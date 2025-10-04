/**
 * Polyfill and fallback suggestions for web features
 */
export interface PolyfillSuggestion {
    feature: string;
    polyfills: string[];
    fallbackStrategy?: string;
    npmPackages?: string[];
    cdnLinks?: string[];
}
export declare const POLYFILL_SUGGESTIONS: Record<string, PolyfillSuggestion>;
/**
 * Get polyfill suggestion for a feature
 */
export declare function getPolyfillSuggestion(featureId: string): PolyfillSuggestion | undefined;
/**
 * Format polyfill suggestion as markdown
 */
export declare function formatPolyfillSuggestion(suggestion: PolyfillSuggestion): string;
