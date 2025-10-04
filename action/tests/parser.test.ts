import { describe, it, expect } from 'vitest';
import {
  parsePRDiff,
  getAddedLines,
  detectCSSFeatures,
  detectJSFeatures,
  detectFeatures,
} from '../src/parser';

describe('parsePRDiff', () => {
  it('should parse a simple diff', () => {
    const diff = `diff --git a/test.css b/test.css
index 1234567..abcdefg 100644
--- a/test.css
+++ b/test.css
@@ -1,3 +1,4 @@
 .container {
   display: flex;
 }
+.grid { display: grid; }`;

    const files = parsePRDiff(diff);
    expect(files).toHaveLength(1);
    expect(files[0]?.to).toBe('test.css');
  });

  it('should handle multiple files', () => {
    const diff = `diff --git a/a.css b/a.css
index 1234567..abcdefg 100644
--- a/a.css
+++ b/a.css
@@ -1 +1,2 @@
 .test {}
+.new {}
diff --git a/b.js b/b.js
index 1234567..abcdefg 100644
--- a/b.js
+++ b/b.js
@@ -1 +1,2 @@
 const x = 1;
+const y = x?.value;`;

    const files = parsePRDiff(diff);
    expect(files).toHaveLength(2);
  });
});

describe('getAddedLines', () => {
  it('should extract only added lines', () => {
    const diff = `diff --git a/test.css b/test.css
index 1234567..abcdefg 100644
--- a/test.css
+++ b/test.css
@@ -1,3 +1,5 @@
 .container {
   display: flex;
 }
+.grid { display: grid; }
+.subgrid { grid-template-columns: subgrid; }`;

    const files = parsePRDiff(diff);
    const addedLines = getAddedLines(files[0]!);

    expect(addedLines).toHaveLength(2);
    expect(addedLines[0]?.content).toContain('grid');
    expect(addedLines[1]?.content).toContain('subgrid');
  });

  it('should track line numbers correctly', () => {
    const diff = `diff --git a/test.css b/test.css
index 1234567..abcdefg 100644
--- a/test.css
+++ b/test.css
@@ -5,0 +6,2 @@
+.new-line-6 {}
+.new-line-7 {}`;

    const files = parsePRDiff(diff);
    const addedLines = getAddedLines(files[0]!);

    expect(addedLines[0]?.line).toBe(6);
    expect(addedLines[1]?.line).toBe(7);
  });
});

describe('detectCSSFeatures', () => {
  it('should detect container queries', () => {
    const code = `
      @container (min-width: 400px) {
        .card { padding: 2rem; }
      }
    `;
    const features = detectCSSFeatures(code);
    expect(features).toContain('container-queries');
  });

  it('should detect :has() selector', () => {
    const code = `.parent:has(.child) { color: blue; }`;
    const features = detectCSSFeatures(code);
    expect(features).toContain('has');
  });

  it('should detect CSS Grid', () => {
    const code = `.grid { display: grid; grid-template-columns: 1fr 1fr; }`;
    const features = detectCSSFeatures(code);
    expect(features).toContain('grid');
  });

  it('should detect Subgrid', () => {
    const code = `.item { grid-template-columns: subgrid; }`;
    const features = detectCSSFeatures(code);
    expect(features).toContain('subgrid');
  });

  it('should detect CSS Nesting', () => {
    const code = `
      .parent {
        color: blue;
        & .child { color: red; }
      }
    `;
    const features = detectCSSFeatures(code);
    expect(features).toContain('css-nesting');
  });

  it('should detect Custom Properties', () => {
    const code = `.box { color: var(--primary-color); }`;
    const features = detectCSSFeatures(code);
    expect(features).toContain('custom-properties');
  });

  it('should detect Logical Properties', () => {
    const code = `.box { margin-inline-start: 1rem; padding-block-end: 2rem; }`;
    const features = detectCSSFeatures(code);
    expect(features).toContain('logical-properties');
  });

  it('should detect multiple features', () => {
    const code = `
      @container (min-width: 400px) {
        .card {
          display: grid;
          color: var(--text-color);
        }
      }
    `;
    const features = detectCSSFeatures(code);
    expect(features).toContain('container-queries');
    expect(features).toContain('grid');
    expect(features).toContain('custom-properties');
    expect(features.length).toBe(3);
  });
});

describe('detectJSFeatures', () => {
  it('should detect optional chaining', () => {
    const code = `const value = obj?.prop?.nested;`;
    const features = detectJSFeatures(code);
    expect(features).toContain('optional-chaining');
  });

  it('should detect nullish coalescing', () => {
    const code = `const value = input ?? defaultValue;`;
    const features = detectJSFeatures(code);
    expect(features).toContain('nullish-coalescing');
  });

  it('should detect dynamic import', () => {
    const code = `const module = await import('./module.js');`;
    const features = detectJSFeatures(code);
    expect(features).toContain('dynamic-import');
  });

  it('should detect top-level await', () => {
    const code = `const data = await fetch('/api/data');`;
    const features = detectJSFeatures(code);
    expect(features).toContain('top-level-await');
  });

  it('should detect private fields', () => {
    const code = `
      class MyClass {
        #privateField = 42;
        getPrivate() { return this.#privateField; }
      }
    `;
    const features = detectJSFeatures(code);
    expect(features).toContain('private-fields');
  });

  it('should detect multiple features', () => {
    const code = `
      const value = obj?.prop ?? 'default';
      const module = import('./test.js');
    `;
    const features = detectJSFeatures(code);
    expect(features).toContain('optional-chaining');
    expect(features).toContain('nullish-coalescing');
    expect(features).toContain('dynamic-import');
  });
});

describe('detectFeatures', () => {
  it('should detect CSS features in .css files', () => {
    const features = detectFeatures('styles.css', '.grid { display: grid; }');
    expect(features).toContain('grid');
  });

  it('should detect JS features in .js files', () => {
    const features = detectFeatures('script.js', 'const x = obj?.value;');
    expect(features).toContain('optional-chaining');
  });

  it('should detect JS features in .ts files', () => {
    const features = detectFeatures('script.ts', 'const x = y ?? 0;');
    expect(features).toContain('nullish-coalescing');
  });

  it('should detect both CSS and JS in .vue files', () => {
    const code = `
      <style>
        .grid { display: grid; }
      </style>
      <script>
        const x = obj?.value;
      </script>
    `;
    const features = detectFeatures('component.vue', code);
    expect(features).toContain('grid');
    expect(features).toContain('optional-chaining');
  });

  it('should detect both CSS and JS in .svelte files', () => {
    const code = `
      <style>
        @container (min-width: 400px) {}
      </style>
      <script>
        const data = import('./data.js');
      </script>
    `;
    const features = detectFeatures('component.svelte', code);
    expect(features).toContain('container-queries');
    expect(features).toContain('dynamic-import');
  });

  it('should return empty array for unknown file types', () => {
    const features = detectFeatures('README.md', '# Hello World');
    expect(features).toEqual([]);
  });
});
