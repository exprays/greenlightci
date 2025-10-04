/**
 * Dashboard Client
 * Send scan results to GreenLightCI Dashboard
 */
import { ScanResult } from './types.js';
export interface DashboardConfig {
    url: string;
    apiKey: string;
}
export interface DashboardScanData {
    projectName: string;
    branch: string;
    commit?: string;
    totalFiles: number;
    totalFeatures: number;
    widelyAvailable: number;
    newlyAvailable: number;
    limited: number;
    notBaseline: number;
    compatibilityScore: number;
    filesScanned: Array<{
        path: string;
        features: string[];
        score: number;
    }>;
}
/**
 * Send scan results to dashboard
 */
export declare function sendToDashboard(result: ScanResult, config: DashboardConfig, projectName: string, branch?: string, commit?: string): Promise<boolean>;
/**
 * Validate dashboard configuration
 */
export declare function validateDashboardConfig(url?: string, apiKey?: string): DashboardConfig | null;
