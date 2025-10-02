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
} from '@greenlightci/shared';
import { getOctokit, getPRDiff, postComment, setStatus } from './github.js';
import { parsePRDiff, getAddedLines, detectFeatures } from './parser.js';

/**
 * Main action entry point
 */
export async function run(): Promise<void> {
  try {
    // Get inputs
    const config: BaselineConfig = {
      targetYear: core.getInput('baseline-year') || '2023',
      blockNewlyAvailable: core.getBooleanInput('block-newly-available'),
      blockLimitedAvailability: core.getBooleanInput(
        'block-limited-availability'
      ),
    };

    const githubToken = core.getInput('github-token', { required: true });

    core.info(`Starting Baseline compatibility check...`);
    core.info(`Target Year: ${config.targetYear}`);
    core.info(`Block Newly Available: ${config.blockNewlyAvailable}`);
    core.info(`Block Limited Availability: ${config.blockLimitedAvailability}`);

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
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

// Run the action
run();
