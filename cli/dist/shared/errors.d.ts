/**
 * Custom error classes for better error handling and reporting
 */
/**
 * Base error class for GreenLightCI errors
 */
export declare class GreenLightError extends Error {
    readonly code: string;
    readonly details?: Record<string, any> | undefined;
    constructor(message: string, code: string, details?: Record<string, any> | undefined);
    toJSON(): {
        name: string;
        message: string;
        code: string;
        details: Record<string, any> | undefined;
        stack: string | undefined;
    };
}
/**
 * Error when GitHub API operations fail
 */
export declare class GitHubAPIError extends GreenLightError {
    readonly statusCode?: number | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: Record<string, any>);
}
/**
 * Error when parsing diffs fails
 */
export declare class ParseError extends GreenLightError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Error when feature detection fails
 */
export declare class FeatureDetectionError extends GreenLightError {
    readonly featureId?: string | undefined;
    constructor(message: string, featureId?: string | undefined, details?: Record<string, any>);
}
/**
 * Error when configuration is invalid
 */
export declare class ConfigurationError extends GreenLightError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Error when compatibility checking fails
 */
export declare class CompatibilityError extends GreenLightError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Error when cache operations fail
 */
export declare class CacheError extends GreenLightError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Wrap an error with context
 */
export declare function wrapError(error: unknown, message: string, code?: string, details?: Record<string, any>): GreenLightError;
/**
 * Check if error is of a specific type
 */
export declare function isErrorType<T extends GreenLightError>(error: unknown, errorClass: new (...args: any[]) => T): error is T;
/**
 * Format error for logging
 */
export declare function formatErrorForLog(error: unknown): string;
/**
 * Safe error extraction for user display
 */
export declare function getUserFriendlyError(error: unknown): string;
