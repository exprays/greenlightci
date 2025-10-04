import features from "web-features";
import { BaselineStatus } from "./types.js";
import { featureCache, getFeatureCacheKey } from "./cache.js";
import { wrapError } from "./errors.js";
/**
 * Get baseline status from web-features data
 */
export function getBaselineStatus(featureData) {
    if (!featureData) {
        return BaselineStatus.Unknown;
    }
    const baseline = featureData.status?.baseline;
    if (baseline === "high" || baseline === "widely") {
        return BaselineStatus.WidelyAvailable;
    }
    if (baseline === "low" || baseline === "newly") {
        return BaselineStatus.NewlyAvailable;
    }
    if (baseline === false) {
        return BaselineStatus.NotBaseline;
    }
    return BaselineStatus.Limited;
}
/**
 * Get baseline year from feature data
 */
export function getBaselineYear(featureData) {
    const baselineDate = featureData.status?.baseline_high_date ||
        featureData.status?.baseline_low_date;
    if (baselineDate) {
        return new Date(baselineDate).getFullYear().toString();
    }
    return undefined;
}
/**
 * Extract browser support information
 */
export function getBrowserSupport(featureData) {
    const support = {};
    if (featureData.status?.support) {
        const supportData = featureData.status.support;
        if (supportData.chrome)
            support.chrome = supportData.chrome;
        if (supportData.edge)
            support.edge = supportData.edge;
        if (supportData.firefox)
            support.firefox = supportData.firefox;
        if (supportData.safari)
            support.safari = supportData.safari;
    }
    return support;
}
/**
 * Get all baseline features from web-features package
 */
export function getAllBaselineFeatures() {
    const featureMap = new Map();
    // web-features is an object with feature IDs as keys
    for (const [featureId, featureData] of Object.entries(features)) {
        const status = getBaselineStatus(featureData);
        const baselineYear = getBaselineYear(featureData);
        const support = getBrowserSupport(featureData);
        const baselineFeature = {
            id: featureId,
            name: featureData.name || featureId,
            description: featureData.description,
            status,
            ...(baselineYear ? { baselineYear } : {}),
            support,
            mdnUrl: featureData.mdn_url,
            specUrl: featureData.spec,
        };
        featureMap.set(featureId, baselineFeature);
    }
    return featureMap;
}
/**
 * Find feature by ID (with caching)
 */
export function getFeatureById(featureId) {
    try {
        // Check cache first
        const cacheKey = getFeatureCacheKey(featureId);
        const cached = featureCache.get(cacheKey);
        if (cached !== undefined) {
            return cached;
        }
        // Fetch from web-features
        const featureData = features[featureId];
        if (!featureData) {
            return undefined;
        }
        const status = getBaselineStatus(featureData);
        const baselineYear = getBaselineYear(featureData);
        const support = getBrowserSupport(featureData);
        const feature = {
            id: featureId,
            name: featureData.name || featureId,
            description: featureData.description,
            status,
            ...(baselineYear ? { baselineYear } : {}),
            support,
            mdnUrl: featureData.mdn_url,
            specUrl: featureData.spec,
        };
        // Cache the result (24 hour TTL)
        featureCache.set(cacheKey, feature, 86400);
        return feature;
    }
    catch (error) {
        throw wrapError(error, `Failed to get feature by ID: ${featureId}`, "FEATURE_LOOKUP_ERROR", { featureId });
    }
}
/**
 * Calculate compatibility score (0-100)
 */
export function calculateCompatibilityScore(widelyAvailable, newlyAvailable, limited, notBaseline) {
    const total = widelyAvailable + newlyAvailable + limited + notBaseline;
    if (total === 0) {
        return 100;
    }
    // Weighted scoring:
    // Widely Available: 100% weight
    // Newly Available: 75% weight
    // Limited: 25% weight
    // Not Baseline: 0% weight
    const score = (widelyAvailable * 100 +
        newlyAvailable * 75 +
        limited * 25 +
        notBaseline * 0) /
        total;
    return Math.round(score);
}
