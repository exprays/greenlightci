/**
 * Scanner for finding and analyzing files in a project
 */
export interface ScanOptions {
    path: string;
    include: string[];
    exclude: string[];
}
export interface ScannedFile {
    path: string;
    relativePath: string;
    content: string;
    features: string[];
}
/**
 * Scan directory for files matching patterns
 */
export declare function scanFiles(options: ScanOptions): Promise<ScannedFile[]>;
/**
 * Parse comma-separated pattern string into array
 * Note: This is for user-provided patterns, not the default glob patterns with braces
 */
export declare function parsePatterns(patterns: string): string[];
/**
 * Get file extension from path
 */
export declare function getFileExtension(filePath: string): string;
/**
 * Check if file should be scanned based on extension
 */
export declare function shouldScanFile(filePath: string): boolean;
/**
 * Detect CSS features in code content
 */
export declare function detectCSSFeatures(content: string): string[];
/**
 * Detect JavaScript features in code content
 */
export declare function detectJSFeatures(content: string): string[];
/**
 * Detect web features in file based on extension and content
 */
export declare function detectFeatures(fileName: string, content: string): string[];
