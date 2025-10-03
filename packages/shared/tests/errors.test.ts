import { describe, it, expect } from 'vitest';
import {
  GreenLightError,
  GitHubAPIError,
  ParseError,
  FeatureDetectionError,
  ConfigurationError,
  CompatibilityError,
  CacheError,
  wrapError,
  isErrorType,
  formatErrorForLog,
  getUserFriendlyError,
} from '../src/errors';

describe('GreenLightError', () => {
  it('should create error with code and details', () => {
    const error = new GreenLightError('Test error', 'TEST_CODE', {
      foo: 'bar',
    });

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.details).toEqual({ foo: 'bar' });
    expect(error.name).toBe('GreenLightError');
  });

  it('should serialize to JSON', () => {
    const error = new GreenLightError('Test error', 'TEST_CODE', {
      foo: 'bar',
    });
    const json = error.toJSON();

    expect(json.name).toBe('GreenLightError');
    expect(json.message).toBe('Test error');
    expect(json.code).toBe('TEST_CODE');
    expect(json.details).toEqual({ foo: 'bar' });
    expect(json.stack).toBeDefined();
  });
});

describe('GitHubAPIError', () => {
  it('should include status code', () => {
    const error = new GitHubAPIError('API failed', 404, {
      endpoint: '/api/test',
    });

    expect(error.message).toBe('API failed');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('GITHUB_API_ERROR');
    expect(error.details?.statusCode).toBe(404);
    expect(error.details?.endpoint).toBe('/api/test');
  });
});

describe('ParseError', () => {
  it('should create parse error', () => {
    const error = new ParseError('Failed to parse', { line: 10 });

    expect(error.message).toBe('Failed to parse');
    expect(error.code).toBe('PARSE_ERROR');
    expect(error.details?.line).toBe(10);
  });
});

describe('FeatureDetectionError', () => {
  it('should include feature ID', () => {
    const error = new FeatureDetectionError('Feature not found', 'grid', {
      reason: 'invalid',
    });

    expect(error.message).toBe('Feature not found');
    expect(error.featureId).toBe('grid');
    expect(error.code).toBe('FEATURE_DETECTION_ERROR');
    expect(error.details?.featureId).toBe('grid');
  });
});

describe('ConfigurationError', () => {
  it('should create configuration error', () => {
    const error = new ConfigurationError('Invalid config', { key: 'targets' });

    expect(error.message).toBe('Invalid config');
    expect(error.code).toBe('CONFIGURATION_ERROR');
    expect(error.details?.key).toBe('targets');
  });
});

describe('CompatibilityError', () => {
  it('should create compatibility error', () => {
    const error = new CompatibilityError('Not compatible', {
      browser: 'chrome',
    });

    expect(error.message).toBe('Not compatible');
    expect(error.code).toBe('COMPATIBILITY_ERROR');
  });
});

describe('CacheError', () => {
  it('should create cache error', () => {
    const error = new CacheError('Cache failed', { operation: 'set' });

    expect(error.message).toBe('Cache failed');
    expect(error.code).toBe('CACHE_ERROR');
  });
});

describe('wrapError', () => {
  it('should return GreenLightError as-is', () => {
    const original = new GreenLightError('Original', 'CODE');
    const wrapped = wrapError(original, 'Wrapper message', 'WRAPPER_CODE');

    expect(wrapped).toBe(original);
  });

  it('should wrap Error instances', () => {
    const original = new Error('Original error');
    const wrapped = wrapError(original, 'Wrapper message', 'WRAPPER_CODE', {
      context: 'test',
    });

    expect(wrapped).toBeInstanceOf(GreenLightError);
    expect(wrapped.message).toContain('Wrapper message');
    expect(wrapped.message).toContain('Original error');
    expect(wrapped.code).toBe('WRAPPER_CODE');
    expect(wrapped.details?.originalError).toBe('Original error');
    expect(wrapped.details?.context).toBe('test');
  });

  it('should wrap non-Error values', () => {
    const wrapped = wrapError(
      'String error',
      'Wrapper message',
      'WRAPPER_CODE'
    );

    expect(wrapped).toBeInstanceOf(GreenLightError);
    expect(wrapped.message).toContain('String error');
    expect(wrapped.code).toBe('WRAPPER_CODE');
  });
});

describe('isErrorType', () => {
  it('should identify error types correctly', () => {
    const apiError = new GitHubAPIError('API error', 500);
    const parseError = new ParseError('Parse error');
    const genericError = new GreenLightError('Generic', 'CODE');

    expect(isErrorType(apiError, GitHubAPIError)).toBe(true);
    expect(isErrorType(apiError, ParseError)).toBe(false);
    expect(isErrorType(parseError, ParseError)).toBe(true);
    expect(isErrorType(genericError, GreenLightError)).toBe(true);
  });
});

describe('formatErrorForLog', () => {
  it('should format GreenLightError with details', () => {
    const error = new GreenLightError('Test error', 'TEST_CODE', {
      foo: 'bar',
    });
    const formatted = formatErrorForLog(error);

    expect(formatted).toContain('[TEST_CODE]');
    expect(formatted).toContain('Test error');
    expect(formatted).toContain('Details:');
    expect(formatted).toContain('foo');
  });

  it('should format regular Error', () => {
    const error = new Error('Regular error');
    const formatted = formatErrorForLog(error);

    expect(formatted).toContain('Regular error');
    expect(formatted).toContain('Stack:');
  });

  it('should format non-Error values', () => {
    const formatted = formatErrorForLog('String error');
    expect(formatted).toBe('String error');
  });
});

describe('getUserFriendlyError', () => {
  it('should provide friendly message for GitHubAPIError 404', () => {
    const error = new GitHubAPIError('Not found', 404);
    const message = getUserFriendlyError(error);

    expect(message).toContain('pull request');
    expect(message).not.toContain('404');
  });

  it('should provide friendly message for GitHubAPIError 403', () => {
    const error = new GitHubAPIError('Forbidden', 403);
    const message = getUserFriendlyError(error);

    expect(message).toContain('rate limit');
    expect(message).toContain('permissions');
  });

  it('should provide friendly message for GitHubAPIError 401', () => {
    const error = new GitHubAPIError('Unauthorized', 401);
    const message = getUserFriendlyError(error);

    expect(message).toContain('authentication');
    expect(message).toContain('github-token');
  });

  it('should provide friendly message for ConfigurationError', () => {
    const error = new ConfigurationError('Invalid targets');
    const message = getUserFriendlyError(error);

    expect(message).toContain('Configuration error');
  });

  it('should provide friendly message for ParseError', () => {
    const error = new ParseError('Invalid diff');
    const message = getUserFriendlyError(error);

    expect(message).toContain('parse');
  });

  it('should provide friendly message for FeatureDetectionError', () => {
    const error = new FeatureDetectionError('Detection failed', 'grid');
    const message = getUserFriendlyError(error);

    expect(message).toContain('Feature detection');
  });

  it('should handle generic errors', () => {
    const error = new Error('Generic error');
    const message = getUserFriendlyError(error);

    expect(message).toBe('Generic error');
  });

  it('should handle non-Error values', () => {
    const message = getUserFriendlyError('String error');
    expect(message).toBe('An unknown error occurred');
  });
});
