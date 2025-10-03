import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { BaselineStatus } from '@greenlightci/shared';
import { FileResult, ScanResult } from './types.js';

/**
 * Terminal output formatting with colors and spinners
 */

/**
 * Create a spinner with custom text
 */
export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
  });
}

/**
 * Print section header
 */
export function printHeader(text: string): void {
  console.log('\n' + chalk.bold.cyan('━'.repeat(60)));
  console.log(chalk.bold.white(`  ${text}`));
  console.log(chalk.bold.cyan('━'.repeat(60)) + '\n');
}

/**
 * Print sub-header
 */
export function printSubHeader(text: string): void {
  console.log('\n' + chalk.bold.white(text));
  console.log(chalk.gray('─'.repeat(60)));
}

/**
 * Print success message
 */
export function printSuccess(message: string): void {
  console.log(chalk.green('✓') + ' ' + chalk.white(message));
}

/**
 * Print error message
 */
export function printError(message: string): void {
  console.log(chalk.red('✗') + ' ' + chalk.white(message));
}

/**
 * Print warning message
 */
export function printWarning(message: string): void {
  console.log(chalk.yellow('⚠') + ' ' + chalk.white(message));
}

/**
 * Print info message
 */
export function printInfo(message: string): void {
  console.log(chalk.blue('ℹ') + ' ' + chalk.white(message));
}

/**
 * Get colored status badge
 */
export function getStatusBadge(status: BaselineStatus): string {
  switch (status) {
    case BaselineStatus.WidelyAvailable:
      return chalk.green('✓ Widely Available');
    case BaselineStatus.NewlyAvailable:
      return chalk.yellow('⚠ Newly Available');
    case BaselineStatus.Limited:
      return chalk.hex('#FFA500')('⚠ Limited');
    case BaselineStatus.NotBaseline:
      return chalk.red('✗ Not Baseline');
    default:
      return chalk.gray('? Unknown');
  }
}

/**
 * Get colored score
 */
export function getColoredScore(score: number): string {
  if (score >= 80) {
    return chalk.green.bold(score.toString());
  } else if (score >= 60) {
    return chalk.yellow.bold(score.toString());
  } else if (score >= 40) {
    return chalk.hex('#FFA500').bold(score.toString());
  } else {
    return chalk.red.bold(score.toString());
  }
}

/**
 * Print progress bar
 */
export function printProgressBar(current: number, total: number): void {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round(percentage / 5);
  const empty = 20 - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const coloredBar =
    percentage >= 80
      ? chalk.green(bar)
      : percentage >= 60
        ? chalk.yellow(bar)
        : chalk.hex('#FFA500')(bar);

  console.log(`${coloredBar} ${percentage}%`);
}

/**
 * Print scan summary
 */
export function printScanSummary(result: ScanResult): void {
  printHeader('📊 Scan Summary');

  console.log(
    chalk.bold('Files Scanned:      ') + chalk.white(result.summary.totalFiles)
  );
  console.log(
    chalk.bold('Features Detected:  ') +
      chalk.white(result.summary.totalFeatures)
  );
  console.log(
    chalk.bold('Blocking Issues:    ') +
      (result.summary.blockingIssues > 0
        ? chalk.red(result.summary.blockingIssues)
        : chalk.green(result.summary.blockingIssues))
  );
  console.log(
    chalk.bold('Warnings:           ') +
      (result.summary.warnings > 0
        ? chalk.yellow(result.summary.warnings)
        : chalk.green(result.summary.warnings))
  );
  console.log(
    chalk.bold('Average Score:      ') +
      getColoredScore(result.summary.averageScore)
  );

  console.log('\n');
  printProgressBar(result.summary.averageScore, 100);
}

/**
 * Print file result
 */
export function printFileResult(
  fileResult: FileResult,
  verbose: boolean
): void {
  const scoreColor = getColoredScore(fileResult.score);
  console.log(
    `\n${chalk.cyan(fileResult.filePath)} ${chalk.gray('[')}${scoreColor}${chalk.gray('/100]')}`
  );

  if (fileResult.issues.length === 0) {
    console.log(chalk.green('  ✓ All features are compatible'));
    return;
  }

  // Group by severity
  const errors = fileResult.issues.filter((i) => i.severity === 'error');
  const warnings = fileResult.issues.filter((i) => i.severity === 'warning');
  const infos = fileResult.issues.filter((i) => i.severity === 'info');

  // Print errors
  if (errors.length > 0) {
    errors.forEach((issue) => {
      const lineInfo = issue.line ? chalk.gray(`:${issue.line}`) : '';
      console.log(
        `  ${chalk.red('✗')} ${chalk.white(issue.featureName)}${lineInfo}`
      );
      if (verbose) {
        console.log(`    ${chalk.gray(issue.message)}`);
      }
    });
  }

  // Print warnings
  if (warnings.length > 0) {
    warnings.forEach((issue) => {
      const lineInfo = issue.line ? chalk.gray(`:${issue.line}`) : '';
      console.log(
        `  ${chalk.yellow('⚠')} ${chalk.white(issue.featureName)}${lineInfo}`
      );
      if (verbose) {
        console.log(`    ${chalk.gray(issue.message)}`);
      }
    });
  }

  // Print infos (only in verbose mode)
  if (verbose && infos.length > 0) {
    infos.forEach((issue) => {
      const lineInfo = issue.line ? chalk.gray(`:${issue.line}`) : '';
      console.log(
        `  ${chalk.blue('ℹ')} ${chalk.white(issue.featureName)}${lineInfo}`
      );
      console.log(`    ${chalk.gray(issue.message)}`);
    });
  }
}

/**
 * Print final result
 */
export function printFinalResult(result: ScanResult): void {
  console.log('\n');

  if (result.summary.blockingIssues > 0) {
    printError(
      `Found ${result.summary.blockingIssues} blocking compatibility issues`
    );
    console.log(chalk.gray('  Run with --verbose for detailed information'));
    process.exit(1);
  } else if (result.summary.warnings > 0) {
    printWarning(`Found ${result.summary.warnings} warnings`);
    console.log(
      chalk.gray('  Consider adding polyfills for better compatibility')
    );
    process.exit(0);
  } else {
    printSuccess('All features are compatible! 🎉');
    process.exit(0);
  }
}
