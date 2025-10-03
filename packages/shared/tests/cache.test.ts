import { describe, it, expect, beforeEach } from 'vitest';
import {
  Cache,
  featureCache,
  githubCache,
  diffCache,
  getFeatureCacheKey,
  getPRDiffCacheKey,
  getCompatibilityCacheKey,
  getCacheStats,
  pruneAllCaches,
  clearAllCaches,
} from '../src/cache';

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache<string>(1); // 1 second TTL for testing
  });

  describe('set and get', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent keys', () => {
      expect(cache.get('non-existent')).toBeUndefined();
    });

    it('should support custom TTL per key', () => {
      cache.set('key1', 'value1', 10); // 10 seconds
      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(cache.has('non-existent')).toBe(false);
    });

    it('should return false for expired keys', async () => {
      cache.set('key1', 'value1', 0.001); // Very short TTL
      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait for expiry
      expect(cache.has('key1')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should remove keys', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should return false when deleting non-existent keys', () => {
      expect(cache.delete('non-existent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
    });
  });

  describe('prune', () => {
    it('should remove expired entries only', async () => {
      cache.set('key1', 'value1', 10); // Long TTL
      cache.set('key2', 'value2', 0.001); // Very short TTL

      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait for key2 to expire

      cache.prune();
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const stats = cache.getStats();
      expect(stats.entries).toBe(2);
      expect(stats.size).toBe(2);
    });
  });

  describe('getOrSet', () => {
    it('should return cached value if available', async () => {
      cache.set('key1', 'cached-value');

      const result = await cache.getOrSet('key1', () => 'new-value');
      expect(result).toBe('cached-value');
    });

    it('should call factory and cache result if not available', async () => {
      const result = await cache.getOrSet('key1', () => 'factory-value');
      expect(result).toBe('factory-value');
      expect(cache.get('key1')).toBe('factory-value');
    });

    it('should work with async factories', async () => {
      const result = await cache.getOrSet('key1', async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        return 'async-value';
      });
      expect(result).toBe('async-value');
    });
  });
});

describe('Cache key generators', () => {
  it('should generate feature cache key', () => {
    expect(getFeatureCacheKey('grid')).toBe('feature:grid');
  });

  it('should generate PR diff cache key', () => {
    expect(getPRDiffCacheKey('owner', 'repo', 123)).toBe(
      'pr-diff:owner/repo/123'
    );
  });

  it('should generate compatibility cache key', () => {
    const targets = { chrome: '110', firefox: '109' };
    const key = getCompatibilityCacheKey('grid', targets);
    expect(key).toContain('compat:grid:');
    expect(key).toContain('chrome');
    expect(key).toContain('110');
  });
});

describe('Global cache instances', () => {
  beforeEach(() => {
    clearAllCaches();
  });

  it('should have separate feature, github, and diff caches', () => {
    featureCache.set('test', 'feature-value');
    githubCache.set('test', 'github-value');
    diffCache.set('test', 'diff-value');

    expect(featureCache.get('test')).toBe('feature-value');
    expect(githubCache.get('test')).toBe('github-value');
    expect(diffCache.get('test')).toBe('diff-value');
  });

  it('should provide cache statistics for all caches', () => {
    featureCache.set('key1', 'value1');
    githubCache.set('key2', 'value2');
    diffCache.set('key3', 'value3');

    const stats = getCacheStats();
    expect(stats.features.entries).toBe(1);
    expect(stats.github.entries).toBe(1);
    expect(stats.diff.entries).toBe(1);
  });

  it('should prune all caches', () => {
    featureCache.set('key1', 'value1');
    githubCache.set('key2', 'value2');
    diffCache.set('key3', 'value3');

    pruneAllCaches();

    // Values should still be there (not expired yet)
    expect(featureCache.get('key1')).toBe('value1');
    expect(githubCache.get('key2')).toBe('value2');
    expect(diffCache.get('key3')).toBe('value3');
  });

  it('should clear all caches', () => {
    featureCache.set('key1', 'value1');
    githubCache.set('key2', 'value2');
    diffCache.set('key3', 'value3');

    clearAllCaches();

    expect(featureCache.get('key1')).toBeUndefined();
    expect(githubCache.get('key2')).toBeUndefined();
    expect(diffCache.get('key3')).toBeUndefined();
  });
});
