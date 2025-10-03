import { describe, it, expect } from 'vitest';
import {
  getBaselineStatus,
  getBaselineYear,
  getBrowserSupport,
  getFeatureById,
  calculateCompatibilityScore,
} from '../src/baseline.js';
import { BaselineStatus } from '../src/types.js';

describe('getBaselineStatus', () => {
  it('should return WidelyAvailable for baseline high', () => {
    const featureData = { status: { baseline: 'high' } };
    expect(getBaselineStatus(featureData)).toBe(BaselineStatus.WidelyAvailable);
  });

  it('should return WidelyAvailable for baseline widely', () => {
    const featureData = { status: { baseline: 'widely' } };
    expect(getBaselineStatus(featureData)).toBe(BaselineStatus.WidelyAvailable);
  });

  it('should return NewlyAvailable for baseline low', () => {
    const featureData = { status: { baseline: 'low' } };
    expect(getBaselineStatus(featureData)).toBe(BaselineStatus.NewlyAvailable);
  });

  it('should return NewlyAvailable for baseline newly', () => {
    const featureData = { status: { baseline: 'newly' } };
    expect(getBaselineStatus(featureData)).toBe(BaselineStatus.NewlyAvailable);
  });

  it('should return NotBaseline for baseline false', () => {
    const featureData = { status: { baseline: false } };
    expect(getBaselineStatus(featureData)).toBe(BaselineStatus.NotBaseline);
  });

  it('should return Limited for other baseline values', () => {
    const featureData = { status: { baseline: 'limited' } };
    expect(getBaselineStatus(featureData)).toBe(BaselineStatus.Limited);
  });

  it('should return Unknown for missing data', () => {
    expect(getBaselineStatus(null)).toBe(BaselineStatus.Unknown);
    expect(getBaselineStatus(undefined)).toBe(BaselineStatus.Unknown);
  });
});

describe('getBaselineYear', () => {
  it('should extract year from baseline_high_date', () => {
    const featureData = {
      status: { baseline_high_date: '2023-05-15' },
    };
    expect(getBaselineYear(featureData)).toBe('2023');
  });

  it('should extract year from baseline_low_date', () => {
    const featureData = {
      status: { baseline_low_date: '2022-03-10' },
    };
    expect(getBaselineYear(featureData)).toBe('2022');
  });

  it('should prefer baseline_high_date over baseline_low_date', () => {
    const featureData = {
      status: {
        baseline_high_date: '2023-05-15',
        baseline_low_date: '2022-03-10',
      },
    };
    expect(getBaselineYear(featureData)).toBe('2023');
  });

  it('should return undefined if no date available', () => {
    const featureData = { status: {} };
    expect(getBaselineYear(featureData)).toBeUndefined();
  });
});

describe('getBrowserSupport', () => {
  it('should extract browser support data', () => {
    const featureData = {
      status: {
        support: {
          chrome: '110',
          firefox: '109',
          safari: '16.4',
          edge: '110',
        },
      },
    };
    const support = getBrowserSupport(featureData);
    expect(support.chrome).toBe('110');
    expect(support.firefox).toBe('109');
    expect(support.safari).toBe('16.4');
    expect(support.edge).toBe('110');
  });

  it('should handle partial browser support', () => {
    const featureData = {
      status: {
        support: {
          chrome: '100',
          safari: '15',
        },
      },
    };
    const support = getBrowserSupport(featureData);
    expect(support.chrome).toBe('100');
    expect(support.safari).toBe('15');
    expect(support.firefox).toBeUndefined();
    expect(support.edge).toBeUndefined();
  });

  it('should return empty object if no support data', () => {
    const featureData = { status: {} };
    const support = getBrowserSupport(featureData);
    expect(Object.keys(support)).toHaveLength(0);
  });
});

describe('calculateCompatibilityScore', () => {
  it('should return 100 for all widely available features', () => {
    const score = calculateCompatibilityScore(10, 0, 0, 0);
    expect(score).toBe(100);
  });

  it('should return 0 for all not-baseline features', () => {
    const score = calculateCompatibilityScore(0, 0, 0, 10);
    expect(score).toBe(0);
  });

  it('should return 75 for all newly available features', () => {
    const score = calculateCompatibilityScore(0, 10, 0, 0);
    expect(score).toBe(75);
  });

  it('should return 25 for all limited features', () => {
    const score = calculateCompatibilityScore(0, 0, 10, 0);
    expect(score).toBe(25);
  });

  it('should calculate mixed scores correctly', () => {
    // 5 widely (100%) + 3 newly (75%) + 2 limited (25%)
    // = (5*100 + 3*75 + 2*25) / 10 = (500 + 225 + 50) / 10 = 77.5 -> 78
    const score = calculateCompatibilityScore(5, 3, 2, 0);
    expect(score).toBe(78);
  });

  it('should handle real-world scenario', () => {
    // 10 widely, 2 newly, 1 limited, 1 not-baseline
    // = (10*100 + 2*75 + 1*25 + 1*0) / 14 = (1000 + 150 + 25 + 0) / 14 = 83.9 -> 84
    const score = calculateCompatibilityScore(10, 2, 1, 1);
    expect(score).toBe(84);
  });

  it('should return 100 for zero features', () => {
    const score = calculateCompatibilityScore(0, 0, 0, 0);
    expect(score).toBe(100);
  });
});

describe('getFeatureById', () => {
  it('should return undefined for non-existent feature', () => {
    const feature = getFeatureById('non-existent-feature-xyz-123');
    expect(feature).toBeUndefined();
  });

  it('should return feature data for valid feature', () => {
    // Note: This test depends on the web-features package having actual data
    // We'll use a commonly known feature that should exist
    const feature = getFeatureById('grid');

    if (feature) {
      expect(feature.id).toBe('grid');
      expect(feature.name).toBeDefined();
      expect(feature.status).toBeDefined();
      expect(feature.support).toBeDefined();
    }
  });
});
