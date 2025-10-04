/**
 * Dashboard Client
 * Send scan results to GreenLightCI Dashboard
 */

import { ScanResult, FeatureIssue } from "./types.js";
import * as path from "path";

export interface DashboardConfig {
  url: string;
  apiKey: string;
}

export interface DashboardScanData {
  project: {
    owner: string;
    repo: string;
    name: string;
    url: string;
  };
  scan: {
    prNumber?: number;
    branch?: string;
    commitSha?: string;
    totalFiles: number;
    totalFeatures: number;
    blockingIssues: number;
    warnings: number;
    averageScore: number;
    targetYear: string;
    blockNewly: boolean;
    blockLimited: boolean;
  };
  files: Array<{
    filePath: string;
    score: number;
    issuesCount: number;
    features: string[];
  }>;
  features: Array<{
    featureId: string;
    featureName: string;
    status: "widely" | "newly" | "limited";
    severity: "info" | "warning" | "error";
    message?: string;
    polyfill?: string;
  }>;
}

/**
 * Send scan results to dashboard
 */
export async function sendToDashboard(
  result: ScanResult,
  config: DashboardConfig,
  scanPath: string,
  options: {
    targetYear: string;
    blockNewly: boolean;
    blockLimited: boolean;
    branch?: string;
    commit?: string;
  }
): Promise<boolean> {
  try {
    // Extract project info from path (simplistic for now)
    const projectName = path.basename(path.resolve(scanPath));
    const owner = "local"; // Default for CLI scans
    const repo = projectName;

    // Collect all unique features from all files
    const featureMap = new Map<string, FeatureIssue>();

    for (const file of result.files) {
      for (const issue of file.issues) {
        // Use featureId as key to avoid duplicates
        if (!featureMap.has(issue.featureId)) {
          featureMap.set(issue.featureId, issue);
        }
      }
    }

    // Prepare dashboard data matching ScanSubmission interface
    const dashboardData: DashboardScanData = {
      project: {
        owner,
        repo,
        name: projectName,
        url: `file://${path.resolve(scanPath)}`, // Local file path for CLI scans
      },
      scan: {
        branch: options.branch || "main",
        commitSha: options.commit,
        totalFiles: result.summary.totalFiles,
        totalFeatures: result.summary.totalFeatures,
        blockingIssues: result.summary.blockingIssues,
        warnings: result.summary.warnings,
        averageScore: result.summary.averageScore,
        targetYear: options.targetYear,
        blockNewly: options.blockNewly,
        blockLimited: options.blockLimited,
      },
      files: result.files.map((f) => ({
        filePath: f.filePath,
        score: f.score,
        issuesCount: f.issues.length,
        features: f.features,
      })),
      features: Array.from(featureMap.values()).map((issue) => ({
        featureId: issue.featureId,
        featureName: issue.featureName,
        status: issue.status as "widely" | "newly" | "limited",
        severity: issue.severity,
        message: issue.message,
        polyfill: undefined, // We don't track polyfills in CLI yet
      })),
    };

    // Send to dashboard
    console.log("DEBUG: Sending data:", JSON.stringify(dashboardData, null, 2));

    const response = await fetch(`${config.url}/api/scans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
      },
      body: JSON.stringify(dashboardData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send data to dashboard: ${response.status} ${errorText}`
      );
      return false;
    }

    const responseData = (await response.json()) as {
      scanId?: string;
      projectId?: string;
    };
    console.log(
      `✓ Scan data sent to dashboard (Scan ID: ${responseData.scanId || "N/A"})`
    );
    return true;
  } catch (error) {
    console.error(`Error sending data to dashboard:`, error);
    return false;
  }
}

/**
 * Validate dashboard configuration
 */
export function validateDashboardConfig(
  url?: string,
  apiKey?: string
): DashboardConfig | null {
  if (!url || !apiKey) {
    return null;
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    console.warn(`Warning: Invalid dashboard URL: ${url}`);
    return null;
  }

  // Validate API key format (basic check)
  if (apiKey.length < 10) {
    console.warn(`Warning: Dashboard API key seems too short`);
    return null;
  }

  return { url, apiKey };
}
