import parseDiff, { File } from 'parse-diff';
import {
  CSS_FEATURE_PATTERNS,
  JS_FEATURE_PATTERNS,
} from '@greenlightci/shared';

/**
 * Parse diff content and extract file changes
 */
export function parsePRDiff(diffContent: string): File[] {
  return parseDiff(diffContent);
}

/**
 * Extract added lines from a diff file
 */
export function getAddedLines(
  file: File
): Array<{ line: number; content: string }> {
  const addedLines: Array<{ line: number; content: string }> = [];

  if (!file.chunks) {
    return addedLines;
  }

  for (const chunk of file.chunks) {
    let lineNumber = chunk.newStart || 0;

    for (const change of chunk.changes) {
      if (change.type === 'add') {
        addedLines.push({
          line: lineNumber,
          content: change.content || '',
        });
      }

      if (change.type !== 'del') {
        lineNumber++;
      }
    }
  }

  return addedLines;
}

/**
 * Detect CSS features in code content
 */
export function detectCSSFeatures(content: string): string[] {
  const detected: Set<string> = new Set();

  // Check for container queries
  if (CSS_FEATURE_PATTERNS.CONTAINER_QUERIES.test(content)) {
    detected.add('container-queries');
  }

  // Check for :has() selector
  if (CSS_FEATURE_PATTERNS.HAS_SELECTOR.test(content)) {
    detected.add('has');
  }

  // Check for CSS Grid
  if (CSS_FEATURE_PATTERNS.CSS_GRID.test(content)) {
    detected.add('grid');
  }

  // Check for Subgrid
  if (CSS_FEATURE_PATTERNS.SUBGRID.test(content)) {
    detected.add('subgrid');
  }

  // Check for CSS Nesting
  if (CSS_FEATURE_PATTERNS.CSS_NESTING.test(content)) {
    detected.add('css-nesting');
  }

  // Check for Custom Properties
  if (CSS_FEATURE_PATTERNS.CUSTOM_PROPERTIES.test(content)) {
    detected.add('custom-properties');
  }

  // Check for Logical Properties
  if (CSS_FEATURE_PATTERNS.LOGICAL_PROPERTIES.test(content)) {
    detected.add('logical-properties');
  }

  return Array.from(detected);
}

/**
 * Detect JavaScript features in code content
 */
export function detectJSFeatures(content: string): string[] {
  const detected: Set<string> = new Set();

  // Check for optional chaining
  if (JS_FEATURE_PATTERNS.OPTIONAL_CHAINING.test(content)) {
    detected.add('optional-chaining');
  }

  // Check for nullish coalescing
  if (JS_FEATURE_PATTERNS.NULLISH_COALESCING.test(content)) {
    detected.add('nullish-coalescing');
  }

  // Check for dynamic import
  if (JS_FEATURE_PATTERNS.DYNAMIC_IMPORT.test(content)) {
    detected.add('dynamic-import');
  }

  // Check for top-level await
  if (JS_FEATURE_PATTERNS.TOP_LEVEL_AWAIT.test(content)) {
    detected.add('top-level-await');
  }

  // Check for private fields
  if (JS_FEATURE_PATTERNS.PRIVATE_FIELDS.test(content)) {
    detected.add('private-fields');
  }

  return Array.from(detected);
}

/**
 * Detect web features in file based on extension and content
 */
export function detectFeatures(fileName: string, content: string): string[] {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const features: string[] = [];

  if (extension === 'css' || extension === 'scss' || extension === 'less') {
    features.push(...detectCSSFeatures(content));
  }

  if (
    extension === 'js' ||
    extension === 'ts' ||
    extension === 'jsx' ||
    extension === 'tsx'
  ) {
    features.push(...detectJSFeatures(content));
  }

  // For files with both (like .vue, .svelte), check both
  if (extension === 'vue' || extension === 'svelte') {
    features.push(...detectCSSFeatures(content));
    features.push(...detectJSFeatures(content));
  }

  return features;
}
