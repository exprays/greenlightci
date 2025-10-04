import { BrowserSupport } from './types.js';
/**
 * Check if feature is compatible with custom browser targets
 */
export declare function isCompatibleWithTargets(featureSupport: BrowserSupport, customTargets: BrowserSupport): {
    compatible: boolean;
    incompatibleBrowsers: string[];
};
/**
 * Compare two version strings
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export declare function compareVersions(v1: string, v2: string): number;
/**
 * Parse custom browser targets from JSON string
 */
export declare function parseCustomTargets(targetsJson: string): BrowserSupport | null;
