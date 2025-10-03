import { writeFileSync } from 'fs';
import {
  getFeatureById,
  calculateCompatibilityScore,
  BaselineStatus,
} from '@greenlightci/shared';
import { scanFiles, parsePatterns } from '../scanner.js';
import { createSpinner, printSuccess } from '../output.js';
import { ReportOptions, FileResult, FeatureIssue } from '../types.js';

/**
 * Report command - generate detailed compatibility report
 */
export async function reportCommand(
  path: string,
  options: ReportOptions
): Promise<void> {
  const spinner = createSpinner('Generating report...');
  spinner.start();

  try {
    // Parse patterns
    const includePatterns = parsePatterns(options.include);
    const excludePatterns = parsePatterns(options.exclude);

    // Scan files
    const scannedFiles = await scanFiles({
      path,
      include: includePatterns,
      exclude: excludePatterns,
    });

    spinner.text = `Analyzing ${scannedFiles.length} files...`;

    // Analyze each file
    const fileResults: FileResult[] = [];
    let totalBlocking = 0;
    let totalWarnings = 0;
    let totalFeatures = 0;

    for (const file of scannedFiles) {
      const issues: FeatureIssue[] = [];
      let widelyCount = 0;
      let newlyCount = 0;
      let limitedCount = 0;
      let notBaselineCount = 0;

      for (const featureId of file.features) {
        const feature = getFeatureById(featureId);
        if (!feature) continue;

        totalFeatures++;

        let severity: 'error' | 'warning' | 'info' = 'info';
        let message = '';

        if (feature.status === BaselineStatus.WidelyAvailable) {
          widelyCount++;
          message = `Widely available across all major browsers`;
        } else if (feature.status === BaselineStatus.NewlyAvailable) {
          newlyCount++;
          severity = 'warning';
          message = `Newly available (${feature.baselineYear || 'recent'}) - consider polyfills`;
          totalWarnings++;
        } else {
          if (feature.status === BaselineStatus.Limited) {
            limitedCount++;
          } else {
            notBaselineCount++;
          }
          severity = 'error';
          message = `Limited browser support - polyfills required`;
          totalBlocking++;
        }

        issues.push({
          featureId: feature.id,
          featureName: feature.name,
          status: feature.status,
          severity,
          message,
        });
      }

      const score = calculateCompatibilityScore(
        widelyCount,
        newlyCount,
        limitedCount,
        notBaselineCount
      );

      fileResults.push({
        filePath: file.relativePath,
        features: file.features,
        issues,
        score,
      });
    }

    // Calculate summary
    const averageScore = Math.round(
      fileResults.reduce((sum, f) => sum + f.score, 0) / fileResults.length
    );

    const summary = {
      totalFiles: fileResults.length,
      totalFeatures,
      blockingIssues: totalBlocking,
      warnings: totalWarnings,
      averageScore,
    };

    // Generate report
    spinner.text = 'Generating report file...';

    if (options.format === 'json') {
      const jsonReport = {
        timestamp: new Date().toISOString(),
        path,
        summary,
        files: fileResults,
      };
      writeFileSync(options.output, JSON.stringify(jsonReport, null, 2));
    } else {
      const html = generateHTMLReport(path, summary, fileResults);
      writeFileSync(options.output, html);
    }

    spinner.succeed(`Report generated: ${options.output}`);
    printSuccess(
      `Scanned ${summary.totalFiles} files with ${summary.totalFeatures} features`
    );
  } catch (error) {
    spinner.fail('Report generation failed');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Generate HTML report
 */
function generateHTMLReport(
  path: string,
  summary: any,
  fileResults: FileResult[]
): string {
  const scoreColor =
    summary.averageScore >= 80
      ? '#22c55e'
      : summary.averageScore >= 60
      ? '#eab308'
      : '#ef4444';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GreenLightCI - Baseline Compatibility Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f9fafb; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 8px 8px 0 0; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .subtitle { opacity: 0.9; font-size: 0.875rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; padding: 2rem; border-bottom: 1px solid #e5e7eb; }
    .metric { text-align: center; }
    .metric-value { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
    .metric-label { color: #6b7280; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .files { padding: 2rem; }
    .file { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }
    .file-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .file-path { font-family: monospace; font-size: 0.875rem; color: #1f2937; font-weight: 600; }
    .score-badge { background: ${scoreColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; }
    .issue { padding: 0.75rem; margin: 0.5rem 0; border-left: 3px solid; background: white; }
    .issue.error { border-color: #ef4444; }
    .issue.warning { border-color: #eab308; }
    .issue.info { border-color: #3b82f6; }
    .issue-header { font-weight: 600; margin-bottom: 0.25rem; }
    .issue-message { color: #6b7280; font-size: 0.875rem; }
    .footer { padding: 1.5rem 2rem; background: #f9fafb; border-radius: 0 0 8px 8px; text-align: center; color: #6b7280; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚦 Baseline Compatibility Report</h1>
      <div class="subtitle">Generated on ${new Date().toLocaleString()} · ${path}</div>
    </div>

    <div class="summary">
      <div class="metric">
        <div class="metric-value" style="color: ${scoreColor}">${summary.averageScore}</div>
        <div class="metric-label">Average Score</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.totalFiles}</div>
        <div class="metric-label">Files Scanned</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.totalFeatures}</div>
        <div class="metric-label">Features Detected</div>
      </div>
      <div class="metric">
        <div class="metric-value" style="color: ${summary.blockingIssues > 0 ? '#ef4444' : '#22c55e'}">${summary.blockingIssues}</div>
        <div class="metric-label">Blocking Issues</div>
      </div>
      <div class="metric">
        <div class="metric-value" style="color: ${summary.warnings > 0 ? '#eab308' : '#22c55e'}">${summary.warnings}</div>
        <div class="metric-label">Warnings</div>
      </div>
    </div>

    <div class="files">
      <h2 style="margin-bottom: 1.5rem; color: #1f2937;">File Details</h2>
      ${fileResults
        .map(
          (file) => `
        <div class="file">
          <div class="file-header">
            <div class="file-path">${file.filePath}</div>
            <div class="score-badge">${file.score}/100</div>
          </div>
          ${
            file.issues.length > 0
              ? file.issues
                  .map(
                    (issue) => `
            <div class="issue ${issue.severity}">
              <div class="issue-header">${issue.featureName}</div>
              <div class="issue-message">${issue.message}</div>
            </div>
          `
                  )
                  .join('')
              : '<div style="color: #22c55e; font-weight: 600;">✓ All features are compatible</div>'
          }
        </div>
      `
        )
        .join('')}
    </div>

    <div class="footer">
      Generated by GreenLightCI · Baseline Compatibility Checker
    </div>
  </div>
</body>
</html>`;
}
