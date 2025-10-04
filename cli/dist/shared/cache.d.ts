/**
 * Simple in-memory cache for web-features data and GitHub API responses
 */
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}
export declare class Cache<T> {
    private store;
    private defaultTTL;
    constructor(defaultTTLSeconds?: number);
    /**
     * Set a value in the cache
     */
    set(key: string, data: T, ttl?: number): void;
    /**
     * Get a value from the cache
     * Returns undefined if not found or expired
     */
    get(key: string): T | undefined;
    /**
     * Check if a key exists and is not expired
     */
    has(key: string): boolean;
    /**
     * Delete a key from the cache
     */
    delete(key: string): boolean;
    /**
     * Clear all entries from the cache
     */
    clear(): void;
    /**
     * Remove all expired entries
     */
    prune(): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        entries: number;
    };
    /**
     * Get or set a value using a factory function
     */
    getOrSet(key: string, factory: () => Promise<T> | T, ttl?: number): Promise<T>;
}
/**
 * Global cache instances
 */
export declare const featureCache: Cache<any>;
export declare const githubCache: Cache<any>;
export declare const diffCache: Cache<any>;
/**
 * Generate cache key for feature lookup
 */
export declare function getFeatureCacheKey(featureId: string): string;
/**
 * Generate cache key for PR diff
 */
export declare function getPRDiffCacheKey(owner: string, repo: string, pullNumber: number): string;
/**
 * Generate cache key for compatibility check
 */
export declare function getCompatibilityCacheKey(featureId: string, targets: Record<string, string>): string;
/**
 * Cache statistics and monitoring
 */
export declare function getCacheStats(): {
    features: {
        size: number;
        entries: number;
    };
    github: {
        size: number;
        entries: number;
    };
    diff: {
        size: number;
        entries: number;
    };
};
/**
 * Prune all caches
 */
export declare function pruneAllCaches(): void;
/**
 * Clear all caches
 */
export declare function clearAllCaches(): void;
