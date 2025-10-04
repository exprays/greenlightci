import { BaselineFeature, BaselineStatus, BrowserSupport } from './types.js';
/**
 * Get baseline status from web-features data
 */
export declare function getBaselineStatus(featureData: any): BaselineStatus;
/**
 * Get baseline year from feature data
 */
export declare function getBaselineYear(featureData: any): string | undefined;
/**
 * Extract browser support information
 */
export declare function getBrowserSupport(featureData: any): BrowserSupport;
/**
 * Get all baseline features from web-features package
 */
export declare function getAllBaselineFeatures(): Map<string, BaselineFeature>;
/**
 * Find feature by ID (with caching)
 */
export declare function getFeatureById(featureId: string): BaselineFeature | undefined;
/**
 * Calculate compatibility score (0-100)
 */
export declare function calculateCompatibilityScore(widelyAvailable: number, newlyAvailable: number, limited: number, notBaseline: number): number;
