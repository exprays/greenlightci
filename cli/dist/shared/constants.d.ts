/**
 * Constants used across GreenLightCI packages
 */
/** Baseline years for classification */
export declare const BASELINE_YEARS: {
    readonly WIDELY_AVAILABLE_THRESHOLD: 30;
};
/** Feature patterns to detect in code */
export declare const CSS_FEATURE_PATTERNS: {
    readonly CONTAINER_QUERIES: RegExp;
    readonly HAS_SELECTOR: RegExp;
    readonly CSS_GRID: RegExp;
    readonly SUBGRID: RegExp;
    readonly CSS_NESTING: RegExp;
    readonly CUSTOM_PROPERTIES: RegExp;
    readonly LOGICAL_PROPERTIES: RegExp;
};
export declare const JS_FEATURE_PATTERNS: {
    readonly OPTIONAL_CHAINING: RegExp;
    readonly NULLISH_COALESCING: RegExp;
    readonly DYNAMIC_IMPORT: RegExp;
    readonly TOP_LEVEL_AWAIT: RegExp;
    readonly PRIVATE_FIELDS: RegExp;
};
/** GitHub Action outputs */
export declare const ACTION_OUTPUTS: {
    readonly COMPATIBILITY_SCORE: "compatibility-score";
    readonly FEATURES_DETECTED: "features-detected";
    readonly BLOCKING_ISSUES: "blocking-issues";
};
/** Comment markers for GitHub */
export declare const GITHUB_MARKERS: {
    readonly COMMENT_HEADER: "<!-- greenlightci-baseline-check -->";
    readonly COMMENT_TITLE: "🚦 Baseline Compatibility Report";
};
/** Status emojis for visual feedback */
export declare const STATUS_EMOJIS: {
    readonly WIDELY_AVAILABLE: "✅";
    readonly NEWLY_AVAILABLE: "⚠️";
    readonly LIMITED: "❌";
    readonly NOT_BASELINE: "🚫";
    readonly UNKNOWN: "❓";
};
