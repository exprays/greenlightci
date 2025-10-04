import { glob } from 'glob';
import { readFileSync } from 'fs';
import { join, relative } from 'path';
/**
 * Scan directory for files matching patterns
 */
export async function scanFiles(options) {
    const { path: basePath, include, exclude } = options;
    const results = [];
    // Scan for each include pattern
    for (const pattern of include) {
        const files = await glob(pattern, {
            cwd: basePath,
            ignore: exclude,
            absolute: false,
            nodir: true,
        });
        for (const file of files) {
            try {
                const fullPath = join(basePath, file);
                const content = readFileSync(fullPath, 'utf-8');
                const features = detectFeatures(file, content);
                // Only include files with detected features
                if (features.length > 0) {
                    results.push({
                        path: fullPath,
                        relativePath: relative(basePath, fullPath),
                        content,
                        features,
                    });
                }
            }
            catch (error) {
                // Skip files that can't be read
                console.warn(`Warning: Could not read file ${file}: ${error}`);
            }
        }
    }
    return results;
}
/**
 * Parse comma-separated pattern string into array
 * Note: This is for user-provided patterns, not the default glob patterns with braces
 */
export function parsePatterns(patterns) {
    // If the pattern contains glob braces {}, treat it as a single pattern
    if (patterns.includes('{') && patterns.includes('}')) {
        return [patterns.trim()];
    }
    return patterns
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
}
/**
 * Get file extension from path
 */
export function getFileExtension(filePath) {
    const parts = filePath.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}
/**
 * Check if file should be scanned based on extension
 */
export function shouldScanFile(filePath) {
    const ext = getFileExtension(filePath);
    const supportedExtensions = [
        'css',
        'scss',
        'less',
        'js',
        'ts',
        'jsx',
        'tsx',
        'vue',
        'svelte',
    ];
    return supportedExtensions.includes(ext);
}
/**
 * Detect CSS features in code content
 */
export function detectCSSFeatures(content) {
    const detected = new Set();
    // Check for container queries
    if (/@container|container-type|container-name/gi.test(content)) {
        detected.add('container-queries');
    }
    // Check for :has() selector
    if (/:has\(/gi.test(content)) {
        detected.add('has');
    }
    // Check for CSS Grid
    if (/display:\s*grid|grid-template/gi.test(content)) {
        detected.add('grid');
    }
    // Check for Subgrid
    if (/subgrid/gi.test(content)) {
        detected.add('subgrid');
    }
    // Check for CSS Nesting (& selector in nested context)
    if (/&\s*[:.\{]/gi.test(content)) {
        detected.add('css-nesting');
    }
    // Check for Custom Properties
    if (/var\(--/gi.test(content)) {
        detected.add('custom-properties');
    }
    // Check for Logical Properties
    if (/inline-start|inline-end|block-start|block-end/gi.test(content)) {
        detected.add('logical-properties');
    }
    return Array.from(detected);
}
/**
 * Detect JavaScript features in code content
 */
export function detectJSFeatures(content) {
    const detected = new Set();
    // Check for optional chaining
    if (/\?\./g.test(content)) {
        detected.add('optional-chaining');
    }
    // Check for nullish coalescing
    if (/\?\?/g.test(content)) {
        detected.add('nullish-coalescing');
    }
    // Check for dynamic import
    if (/import\(/g.test(content)) {
        detected.add('dynamic-import');
    }
    // Check for top-level await
    if (/^(?!.*function).*await\s+/gm.test(content)) {
        detected.add('top-level-await');
    }
    // Check for private fields
    if (/#[a-zA-Z_]/g.test(content)) {
        detected.add('private-fields');
    }
    return Array.from(detected);
}
/**
 * Detect web features in file based on extension and content
 */
export function detectFeatures(fileName, content) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const features = [];
    if (extension === 'css' || extension === 'scss' || extension === 'less') {
        features.push(...detectCSSFeatures(content));
    }
    if (extension === 'js' ||
        extension === 'ts' ||
        extension === 'jsx' ||
        extension === 'tsx') {
        features.push(...detectJSFeatures(content));
    }
    // For files with both (like .vue, .svelte), check both
    if (extension === 'vue' || extension === 'svelte') {
        features.push(...detectCSSFeatures(content));
        features.push(...detectJSFeatures(content));
    }
    return features;
}
