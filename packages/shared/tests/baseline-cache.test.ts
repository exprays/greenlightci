import { describe, it, expect, beforeEach } from 'vitest';
import { getFeatureById } from '../src/baseline';
import { featureCache, clearAllCaches } from '../src/cache';

describe('Baseline with Caching Integration', () => {
  beforeEach(() => {
    clearAllCaches();
  });

  describe('getFeatureById with cache', () => {
    it('should cache feature lookups', () => {
      // First call - cache miss
      const feature1 = getFeatureById('grid');
      expect(feature1).toBeDefined();
      expect(feature1?.id).toBe('grid');

      // Check that it's in cache
      const cacheKey = `feature:grid`;
      const cached = featureCache.get(cacheKey);
      expect(cached).toBeDefined();
      expect(cached?.id).toBe('grid');

      // Second call - cache hit (should be same object reference)
      const feature2 = getFeatureById('grid');
      expect(feature2).toBe(cached);
    });

    it('should handle cache for multiple features', () => {
      const feature1 = getFeatureById('grid');
      const feature2 = getFeatureById('subgrid');
      const feature3 = getFeatureById('container-queries');

      expect(feature1?.id).toBe('grid');
      expect(feature2?.id).toBe('subgrid');
      expect(feature3?.id).toBe('container-queries');

      // All should be cached
      expect(featureCache.has('feature:grid')).toBe(true);
      expect(featureCache.has('feature:subgrid')).toBe(true);
      expect(featureCache.has('feature:container-queries')).toBe(true);
    });

    it('should return undefined for non-existent features and not cache them', () => {
      const feature = getFeatureById('non-existent-feature-xyz');
      
      expect(feature).toBeUndefined();
      
      // Should not cache undefined results
      const cached = featureCache.get('feature:non-existent-feature-xyz');
      expect(cached).toBeUndefined();
    });

    it('should cache multiple lookups of same feature', () => {
      // Perform 10 lookups
      for (let i = 0; i < 10; i++) {
        const feature = getFeatureById('grid');
        expect(feature).toBeDefined();
      }

      // Should only have 1 cache entry (not 10)
      const stats = featureCache.getStats();
      expect(stats.entries).toBe(1);
    });
  });
});
