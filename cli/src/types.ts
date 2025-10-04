/**
 * CLI Types and Interfaces
 */

export interface CLIOptions {
  targetYear: string;
  blockNewly: boolean;
  blockLimited: boolean;
  json?: boolean;
  verbose?: boolean;
  include: string;
  exclude: string;
  dashboardUrl?: string;
  dashboardApiKey?: string;
}

export interface WatchOptions extends Omit<CLIOptions, "json" | "verbose"> {
  // Watch-specific options can be added here
}

export interface ReportOptions {
  targetYear: string;
  output: string;
  format: "html" | "json";
  include: string;
  exclude: string;
}

export interface FileResult {
  filePath: string;
  features: string[];
  issues: FeatureIssue[];
  score: number;
}

export interface FeatureIssue {
  featureId: string;
  featureName: string;
  status: string;
  severity: "error" | "warning" | "info";
  line?: number;
  message: string;
}

export interface ScanResult {
  files: FileResult[];
  summary: {
    totalFiles: number;
    totalFeatures: number;
    blockingIssues: number;
    warnings: number;
    averageScore: number;
  };
  timestamp: Date;
}
