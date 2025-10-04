import { Ora } from 'ora';
import { BaselineStatus } from './shared/index.js';
import { FileResult, ScanResult } from './types.js';
/**
 * Terminal output formatting with colors and spinners
 */
/**
 * Create a spinner with custom text
 */
export declare function createSpinner(text: string): Ora;
/**
 * Print section header
 */
export declare function printHeader(text: string): void;
/**
 * Print sub-header
 */
export declare function printSubHeader(text: string): void;
/**
 * Print success message
 */
export declare function printSuccess(message: string): void;
/**
 * Print error message
 */
export declare function printError(message: string): void;
/**
 * Print warning message
 */
export declare function printWarning(message: string): void;
/**
 * Print info message
 */
export declare function printInfo(message: string): void;
/**
 * Get colored status badge
 */
export declare function getStatusBadge(status: BaselineStatus): string;
/**
 * Get colored score
 */
export declare function getColoredScore(score: number): string;
/**
 * Print progress bar
 */
export declare function printProgressBar(current: number, total: number): void;
/**
 * Print scan summary
 */
export declare function printScanSummary(result: ScanResult): void;
/**
 * Print file result
 */
export declare function printFileResult(fileResult: FileResult, verbose: boolean): void;
/**
 * Print final result
 */
export declare function printFinalResult(result: ScanResult): void;
