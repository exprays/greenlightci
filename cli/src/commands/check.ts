import {
  getFeatureById,
  calculateCompatibilityScore,
  BaselineStatus,
} from "../shared/index.js";
import { scanFiles, parsePatterns } from "../scanner.js";
import {
  createSpinner,
  printHeader,
  printFileResult,
  printScanSummary,
  printFinalResult,
} from "../output.js";
import { CLIOptions, FileResult, FeatureIssue, ScanResult } from "../types.js";
import { sendToDashboard, validateDashboardConfig } from "../dashboard.js";

/**
 * Check command - scan files and report compatibility
 */
export async function checkCommand(
  path: string,
  options: CLIOptions
): Promise<void> {
  // Debug: log options
  console.log("Dashboard URL:", options.dashboardUrl);
  console.log(
    "Dashboard API Key:",
    options.dashboardApiKey
      ? "***" + options.dashboardApiKey.slice(-4)
      : "not set"
  );

  const spinner = createSpinner("Scanning files...");
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

    spinner.succeed(`Found ${scannedFiles.length} files with web features`);

    if (scannedFiles.length === 0) {
      console.log("\nNo files with web features found.");
      return;
    }

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

        let severity: "error" | "warning" | "info" = "info";
        let blocking = false;
        let message = "";

        // Determine severity based on status
        if (feature.status === BaselineStatus.WidelyAvailable) {
          widelyCount++;
          message = `Widely available across all major browsers`;
        } else if (feature.status === BaselineStatus.NewlyAvailable) {
          newlyCount++;
          severity = "warning";
          blocking = options.blockNewly;
          message = `Newly available - consider adding polyfills`;
          if (blocking) totalBlocking++;
          else totalWarnings++;
        } else if (
          feature.status === BaselineStatus.Limited ||
          feature.status === BaselineStatus.NotBaseline
        ) {
          if (feature.status === BaselineStatus.Limited) {
            limitedCount++;
          } else {
            notBaselineCount++;
          }
          severity = "error";
          blocking = options.blockLimited;
          message = `Limited browser support - polyfills required`;
          if (blocking) totalBlocking++;
          else totalWarnings++;
        }

        issues.push({
          featureId: feature.id,
          featureName: feature.name,
          status: feature.status,
          severity,
          message,
        });
      }

      // Calculate score
      const score = calculateCompatibilityScore(
        widelyCount,
        newlyCount,
        limitedCount,
        notBaselineCount
      );

      fileResults.push({
        filePath: file.relativePath,
        features: file.features,
        issues: issues.filter((i) => i.severity !== "info" || options.verbose),
        score,
      });
    }

    // Calculate summary
    const averageScore = Math.round(
      fileResults.reduce((sum, f) => sum + f.score, 0) / fileResults.length
    );

    const result: ScanResult = {
      files: fileResults,
      summary: {
        totalFiles: fileResults.length,
        totalFeatures,
        blockingIssues: totalBlocking,
        warnings: totalWarnings,
        averageScore,
      },
      timestamp: new Date(),
    };

    // Output results
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printHeader("🚦 GreenLightCI - Baseline Compatibility Check");

      // Print file results
      for (const fileResult of fileResults) {
        if (fileResult.issues.length > 0 || options.verbose) {
          printFileResult(fileResult, options.verbose || false);
        }
      }

      // Print summary
      printScanSummary(result);

      // Print final result
      printFinalResult(result);
    }

    // Send to dashboard if configured
    const dashboardConfig = validateDashboardConfig(
      options.dashboardUrl,
      options.dashboardApiKey
    );

    if (dashboardConfig) {
      console.log("\n📊 Sending scan data to dashboard...");
      const sent = await sendToDashboard(
        result,
        dashboardConfig,
        path,
        {
          targetYear: options.targetYear,
          blockNewly: options.blockNewly,
          blockLimited: options.blockLimited,
          branch: "main", // TODO: Extract from git
          commit: undefined, // TODO: Extract from git
        }
      );

      if (!sent) {
        console.warn(
          "⚠️  Failed to send data to dashboard. Continuing with local results."
        );
      }
    }

    // Exit with appropriate code based on results
    if (result.summary.blockingIssues > 0) {
      process.exit(1);
    }
  } catch (error) {
    spinner.fail("Scan failed");
    console.error(error);
    process.exit(1);
  }
}
