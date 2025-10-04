import chokidar from 'chokidar';
import { join } from 'path';
import { getFeatureById, calculateCompatibilityScore, BaselineStatus, } from '../shared';
import { readFileSync } from 'fs';
import { detectFeatures as detectFeaturesFromParser } from '../scanner.js';
import { parsePatterns } from '../scanner.js';
import { printHeader, printInfo, printSuccess, printError, printWarning, getStatusBadge, } from '../output.js';
import chalk from 'chalk';
/**
 * Watch command - continuously monitor files for changes
 */
export async function watchCommand(path, options) {
    printHeader('👀 GreenLightCI - Watch Mode');
    printInfo(`Watching: ${path}`);
    printInfo(`Target Year: ${options.targetYear}`);
    printInfo('Press Ctrl+C to stop\n');
    // Parse patterns
    const includePatterns = parsePatterns(options.include);
    const excludePatterns = parsePatterns(options.exclude);
    // Create glob patterns for chokidar
    const watchPatterns = includePatterns.map((p) => join(path, p));
    const ignorePatterns = excludePatterns.map((p) => join(path, p));
    // Set up watcher
    const watcher = chokidar.watch(watchPatterns, {
        ignored: ignorePatterns,
        persistent: true,
        ignoreInitial: false,
    });
    // Track processed files to show initial scan progress
    let initialScanComplete = false;
    let filesProcessed = 0;
    watcher
        .on('ready', () => {
        initialScanComplete = true;
        printSuccess(`Initial scan complete. Watching for changes... (${filesProcessed} files)`);
    })
        .on('add', (filePath) => {
        if (!initialScanComplete) {
            filesProcessed++;
            return;
        }
        processFile(filePath, 'added', options);
    })
        .on('change', (filePath) => {
        processFile(filePath, 'changed', options);
    })
        .on('error', (error) => {
        printError(`Watcher error: ${error}`);
    });
    // Keep process alive
    process.on('SIGINT', () => {
        console.log('\n');
        printInfo('Stopping watch mode...');
        watcher.close();
        process.exit(0);
    });
}
/**
 * Process a file change
 */
function processFile(filePath, action, options) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        const features = detectFeaturesFromParser(filePath, content);
        if (features.length === 0) {
            return; // Skip files with no features
        }
        // Analyze features
        let widelyCount = 0;
        let newlyCount = 0;
        let limitedCount = 0;
        let notBaselineCount = 0;
        let hasBlockingIssues = false;
        let hasWarnings = false;
        const issues = [];
        for (const featureId of features) {
            const feature = getFeatureById(featureId);
            if (!feature)
                continue;
            if (feature.status === BaselineStatus.WidelyAvailable) {
                widelyCount++;
            }
            else if (feature.status === BaselineStatus.NewlyAvailable) {
                newlyCount++;
                if (options.blockNewly) {
                    hasBlockingIssues = true;
                    issues.push(`${chalk.red('✗')} ${feature.name} - ${getStatusBadge(feature.status)}`);
                }
                else {
                    hasWarnings = true;
                    issues.push(`${chalk.yellow('⚠')} ${feature.name} - ${getStatusBadge(feature.status)}`);
                }
            }
            else if (feature.status === BaselineStatus.Limited ||
                feature.status === BaselineStatus.NotBaseline) {
                if (feature.status === BaselineStatus.Limited) {
                    limitedCount++;
                }
                else {
                    notBaselineCount++;
                }
                if (options.blockLimited) {
                    hasBlockingIssues = true;
                    issues.push(`${chalk.red('✗')} ${feature.name} - ${getStatusBadge(feature.status)}`);
                }
                else {
                    hasWarnings = true;
                    issues.push(`${chalk.yellow('⚠')} ${feature.name} - ${getStatusBadge(feature.status)}`);
                }
            }
        }
        // Calculate score
        const score = calculateCompatibilityScore(widelyCount, newlyCount, limitedCount, notBaselineCount);
        // Print result
        const timestamp = new Date().toLocaleTimeString();
        const actionText = action === 'added' ? chalk.green('added') : chalk.blue('changed');
        console.log(`\n[${chalk.gray(timestamp)}] ${actionText} ${chalk.cyan(filePath)}`);
        console.log(`  Score: ${getColoredScore(score)}/100 | Features: ${features.length}`);
        if (issues.length > 0) {
            issues.forEach((issue) => console.log(`  ${issue}`));
        }
        else {
            console.log(`  ${chalk.green('✓')} All features are compatible`);
        }
        if (hasBlockingIssues) {
            printError('Blocking issues detected!');
        }
        else if (hasWarnings) {
            printWarning('Consider adding polyfills');
        }
    }
    catch (error) {
        printError(`Failed to process ${filePath}: ${error}`);
    }
}
/**
 * Get colored score
 */
function getColoredScore(score) {
    if (score >= 80) {
        return chalk.green.bold(score.toString());
    }
    else if (score >= 60) {
        return chalk.yellow.bold(score.toString());
    }
    else {
        return chalk.red.bold(score.toString());
    }
}
