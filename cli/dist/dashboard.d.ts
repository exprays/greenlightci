/**
 * Dashboard Client
 * Send scan results to GreenLightCI Dashboard
 */
import { ScanResult } from "./types.js";
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
export declare function sendToDashboard(result: ScanResult, config: DashboardConfig, scanPath: string, options: {
    targetYear: string;
    blockNewly: boolean;
    blockLimited: boolean;
    branch?: string;
    commit?: string;
}): Promise<boolean>;
/**
 * Validate dashboard configuration
 */
export declare function validateDashboardConfig(url?: string, apiKey?: string): DashboardConfig | null;
