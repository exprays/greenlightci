import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  BaselineConfig,
  BaselineStatus,
  CompatibilityReport,
  CompatibilityResult,
  getFeatureById,
  calculateCompatibilityScore,
  ACTION_OUTPUTS,
  parseCustomTargets,
  isCompatibleWithTargets,
  ConfigurationError,
  GitHubAPIError,
  ParseError,
  FeatureDetectionError,
  getUserFriendlyError,
  formatErrorForLog,
  getCacheStats,
  pruneAllCaches,
} from '@greenlightci/shared';
import { getOctokit, getPRDiff, postComment, setStatus } from './github.js';
import { parsePRDiff, getAddedLines, detectFeatures } from './parser.js';

/**
 * Main action entry point with comprehensive error handling
 */
export async function run(): Promise<void> {
  try {
    core.info('🚦 GreenLightCI - Baseline Compatibility Checker');
    core.info('================================================');

    // Validate inputs and configuration
    const githubToken = core.getInput('github-token', { required: true });
    if (!githubToken) {
      throw new ConfigurationError(
        'github-token is required but was not provided'
      );
    }

    // Get inputs with validation
    const customTargetsInput = core.getInput('custom-browser-targets');
    let customTargets = null;

    if (customTargetsInput) {
      try {
        customTargets = parseCustomTargets(customTargetsInput);
        core.info(`✓ Custom browser targets parsed successfully`);
      } catch (error) {
        throw new ConfigurationError(
          `Invalid custom-browser-targets format: ${error instanceof Error ? error.message : String(error)}`,
          { input: customTargetsInput }
        );
      }
    }

    const config: BaselineConfig = {
      targetYear: core.getInput('baseline-year') || '2023',
      blockNewlyAvailable: core.getBooleanInput('block-newly-available'),
      blockLimitedAvailability: core.getBooleanInput(
        'block-limited-availability'
      ),
      ...(customTargets ? { customTargets } : {}),
    };

    core.info(`Starting Baseline compatibility check...`);
    core.info(`Target Year: ${config.targetYear}`);
    core.info(`Block Newly Available: ${config.blockNewlyAvailable}`);
    core.info(`Block Limited Availability: ${config.blockLimitedAvailability}`);
    if (customTargets) {
      core.info(
        `Custom Browser Targets: ${JSON.stringify(customTargets, null, 2)}`
      );
    }

    // Get PR context
    const context = github.context;
    if (!context.payload.pull_request) {
      core.setFailed('This action must be triggered by a pull_request event');
      return;
    }

    const { owner, repo } = context.repo;
    const pullNumber = context.payload.pull_request.number;
    const sha = context.payload.pull_request.head.sha;

    core.info(`Analyzing PR #${pullNumber} in ${owner}/${repo}`);

    // Get Octokit instance
    const octokit = getOctokit(githubToken);

    // Set pending status
    await setStatus(
      octokit,
      owner,
      repo,
      sha,
      'pending',
      'Checking baseline compatibility...'
    );

    // Get PR diff
    const diffContent = await getPRDiff(octokit, owner, repo, pullNumber);
    const files = parsePRDiff(diffContent);

    core.info(`Found ${files.length} changed files`);

    // Analyze each file
    const results: CompatibilityResult[] = [];
    let widelyCount = 0;
    let newlyCount = 0;
    let limitedCount = 0;
    let notBaselineCount = 0;

    for (const file of files) {
      if (!file.to || file.deleted) {
        continue;
      }

      const addedLines = getAddedLines(file);
      if (addedLines.length === 0) {
        continue;
      }

      // Combine all added content
      const content = addedLines.map((l) => l.content).join('\n');

      // Detect features
      const featureIds = detectFeatures(file.to, content);

      for (const featureId of featureIds) {
        const feature = getFeatureById(featureId);

        if (!feature) {
          continue;
        }

        // Determine severity and blocking
        let severity: 'error' | 'warning' | 'info' = 'info';
        let blocking = false;

        // Check custom browser targets if provided
        if (customTargets) {
          const compat = isCompatibleWithTargets(
            feature.support,
            customTargets
          );
          if (!compat.compatible) {
            severity = 'error';
            blocking = true;
            core.warning(
              `Feature "${feature.name}" is not compatible with custom targets: ${compat.incompatibleBrowsers.join(', ')}`
            );
          }
        }

        // Apply baseline status rules if not already blocked by custom targets
        if (!blocking) {
          if (feature.status === BaselineStatus.WidelyAvailable) {
            widelyCount++;
          } else if (feature.status === BaselineStatus.NewlyAvailable) {
            newlyCount++;
            severity = 'warning';
            blocking = config.blockNewlyAvailable;
          } else if (
            feature.status === BaselineStatus.Limited ||
            feature.status === BaselineStatus.NotBaseline
          ) {
            if (feature.status === BaselineStatus.Limited) {
              limitedCount++;
            } else {
              notBaselineCount++;
            }
            severity = 'error';
            blocking = config.blockLimitedAvailability;
          }
        }

        results.push({
          feature,
          filePath: file.to,
          ...(addedLines[0]?.line ? { line: addedLines[0].line } : {}),
          blocking,
          severity,
        });
      }
    }

    // Calculate score
    const score = calculateCompatibilityScore(
      widelyCount,
      newlyCount,
      limitedCount,
      notBaselineCount
    );

    const report: CompatibilityReport = {
      results,
      score,
      blockingCount: results.filter((r) => r.blocking).length,
      warningCount: results.filter((r) => r.severity === 'warning').length,
      infoCount: results.filter((r) => r.severity === 'info').length,
      totalFeatures: results.length,
    };

    core.info(`Analysis complete: ${report.totalFeatures} features detected`);
    core.info(`Compatibility score: ${score}/100`);
    core.info(`Blocking issues: ${report.blockingCount}`);

    // Set outputs
    core.setOutput(ACTION_OUTPUTS.COMPATIBILITY_SCORE, score);
    core.setOutput(ACTION_OUTPUTS.FEATURES_DETECTED, report.totalFeatures);
    core.setOutput(ACTION_OUTPUTS.BLOCKING_ISSUES, report.blockingCount);

    // Format and post comment
    const comment = await import('./github.js').then((m) =>
      m.formatComment(report)
    );
    await postComment(octokit, owner, repo, pullNumber, comment);

    // Set final status
    if (report.blockingCount > 0) {
      await setStatus(
        octokit,
        owner,
        repo,
        sha,
        'failure',
        `${report.blockingCount} blocking compatibility issues found`
      );
      core.setFailed(
        `Found ${report.blockingCount} blocking compatibility issues`
      );
    } else {
      await setStatus(
        octokit,
        owner,
        repo,
        sha,
        'success',
        `All features are compatible (Score: ${score}/100)`
      );
      core.info('✅ All checks passed!');
    }

    // Log cache statistics
    const cacheStats = getCacheStats();
    core.info(`📊 Cache Statistics:`);
    core.info(`  Features: ${cacheStats.features.entries} entries`);
    core.info(`  GitHub API: ${cacheStats.github.entries} entries`);
    core.info(`  Diffs: ${cacheStats.diff.entries} entries`);

    // Prune expired cache entries
    pruneAllCaches();
  } catch (error) {
    // Enhanced error handling with detailed logging
    core.error('❌ GreenLightCI encountered an error');

    // Log detailed error information
    const errorLog = formatErrorForLog(error);
    core.error(errorLog);

    // Set user-friendly error message
    const userMessage = getUserFriendlyError(error);

    // Handle specific error types
    if (error instanceof ConfigurationError) {
      core.error(
        '💡 Configuration Error: Please check your workflow configuration'
      );
      core.setFailed(`Configuration error: ${userMessage}`);
    } else if (error instanceof GitHubAPIError) {
      core.error(
        '💡 GitHub API Error: Check your token permissions and rate limits'
      );
      core.setFailed(`GitHub API error: ${userMessage}`);
    } else if (error instanceof ParseError) {
      core.error('💡 Parse Error: Failed to parse PR diff');
      core.setFailed(`Parse error: ${userMessage}`);
    } else if (error instanceof FeatureDetectionError) {
      core.error('💡 Feature Detection Error: Failed to detect features');
      core.setFailed(`Feature detection error: ${userMessage}`);
    } else if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }

    // Attempt to clean up caches on error
    try {
      pruneAllCaches();
    } catch {
      // Ignore cache cleanup errors
    }
  }
}

// Run the action
run();
