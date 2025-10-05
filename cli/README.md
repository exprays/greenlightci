# 🚦 GreenLightCI CLI

A command-line tool for checking Baseline web feature compatibility in your local projects.

## 🎯 Features

- ✅ **Local file scanning** - Detect web features in CSS, JS, and framework files
- 👀 **Watch mode** - Continuously monitor files for changes
- 📊 **Rich terminal output** - Colored, formatted compatibility reports
- 💻 **Feature-rich Dashboard** - A one stop solution for all the projects and reports and trends
- 📄 **HTML reports** - Generate detailed compatibility reports
- 🎨 **Multiple file types** - Supports CSS, SCSS, JS, TS, JSX, TSX, Vue, Svelte
- ⚡ **Fast scanning** - Efficiently scan large codebases

## 📦 Installation

```bash
# Install globally
npm install -g @greenlightci/cli

# Or use with npx
npx @greenlightci/cli check
```

## 🚀 Usage

### Check Command

Scan your project for Baseline compatibility issues:

```bash
# Check current directory
greenlightci check

# Check specific directory
greenlightci check ./src

# Check with custom options
greenlightci check --target-year 2024 --block-newly --verbose

# Output as JSON
greenlightci check --json > report.json
```

**Options:**

- `-t, --target-year <year>` - Target Baseline year (default: 2023)
- `--block-newly` - Block newly available features
- `--block-limited` - Block limited availability features
- `--json` - Output results as JSON
- `--verbose` - Show detailed output
- `--include <patterns>` - File patterns to include (comma-separated)
- `--exclude <patterns>` - File patterns to exclude (comma-separated)

### With Dashboard

```bash
greenlightci check ./src --dashboard-url https://greenlightci-dashboard.vercel.app --dashboard-api-key your-api-key
```

To obtain the api key sign-in to the dashboard at https://greenlightci-dashboard.vercel.app with github and then go to settings to obtain the api key.

### Watch Mode

Continuously monitor files for changes:

```bash
# Watch current directory
greenlightci watch

# Watch specific directory
greenlightci watch ./src

# Watch with custom patterns
greenlightci watch --include "src/**/*.{js,css}" --exclude "node_modules/**"
```

**Options:**

- `-t, --target-year <year>` - Target Baseline year
- `--block-newly` - Block newly available features
- `--block-limited` - Block limited availability features
- `--include <patterns>` - File patterns to include
- `--exclude <patterns>` - File patterns to exclude

### Report Command

Generate a detailed compatibility report:

```bash
# Generate HTML report
greenlightci report

# Generate JSON report
greenlightci report --format json --output report.json

# Generate report for specific directory
greenlightci report ./src --output dist/baseline-report.html
```

**Options:**

- `-t, --target-year <year>` - Target Baseline year
- `-o, --output <file>` - Output file path (default: baseline-report.html)
- `--format <type>` - Output format: html or json (default: html)
- `--include <patterns>` - File patterns to include
- `--exclude <patterns>` - File patterns to exclude

## 📊 Example Output

### Check Command

```
🚦 GreenLightCI - Baseline Compatibility Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

src/styles/main.css [85/100]
  ✓ CSS Grid - Widely Available
  ⚠ Container Queries - Newly Available
  ⚠ CSS Nesting - Newly Available

src/components/Button.tsx [92/100]
  ✓ Optional Chaining - Widely Available
  ✓ Nullish Coalescing - Widely Available

📊 Scan Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files Scanned:      15
Features Detected:  32
Blocking Issues:    0
Warnings:           5
Average Score:      88

█████████████████░░░ 88%

⚠ Found 5 warnings
  Consider adding polyfills for better compatibility
```

### Watch Mode

```
👀 GreenLightCI - Watch Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ Watching: ./src
ℹ Target Year: 2023
ℹ Press Ctrl+C to stop

✓ Initial scan complete. Watching for changes... (24 files)

[10:45:23] changed src/styles/main.css
  Score: 85/100 | Features: 3
  ⚠ Container Queries - ⚠ Newly Available
  ⚠ CSS Nesting - ⚠ Newly Available
⚠ Consider adding polyfills
```

## 🎨 Supported Features

### CSS Features

- Container Queries (`@container`)
- `:has()` Selector
- CSS Grid
- Subgrid
- CSS Nesting
- Custom Properties (CSS Variables)
- Logical Properties

### JavaScript Features

- Optional Chaining (`?.`)
- Nullish Coalescing (`??`)
- Dynamic Import
- Top-level Await
- Private Fields

## 🔧 Configuration

You can create a `.greenlightrc.json` file in your project root:

```json
{
  "targetYear": "2023",
  "blockNewly": false,
  "blockLimited": true,
  "include": ["src/**/*.{css,js,ts}"],
  "exclude": ["node_modules/**", "dist/**"]
}
```

## 📄 File Support

Supported file extensions:

- **CSS**: `.css`, `.scss`, `.less`
- **JavaScript**: `.js`, `.ts`, `.jsx`, `.tsx`
- **Frameworks**: `.vue`, `.svelte`

## 💡 Tips

1. **Use watch mode during development** - Get instant feedback on compatibility
2. **Generate reports before releases** - Create HTML reports for stakeholders
3. **Integrate with CI/CD** - Use JSON output for automated checks
4. **Customize patterns** - Focus on specific directories with include/exclude
5. **Use verbose mode** - Get detailed information about each feature
6. **Use Dashboard** - Get your reports saved to greenlight dashboard

## 🤝 Integration

### NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "baseline:check": "greenlightci check",
    "baseline:watch": "greenlightci watch",
    "baseline:report": "greenlightci report"
  }
}
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npx greenlightci check --block-newly --block-limited
```

### CI/CD Pipeline

```yaml
# .github/workflows/baseline-check.yml
- name: Check Baseline Compatibility
  run: |
    npm install -g @greenlightci/cli
    greenlightci check --json > baseline-report.json
```

## 📚 Related Packages

- **[@greenlightci/action](https://github.com/exprays/greenlightci-action)** - GitHub Action for PR checks
- **[@greenlightci/dashboard](https://github.com/exprays/greenlightci-dashboard)** - Web dashboard for tracking adoption

## 📝 License

MIT

## 🐛 Issues

Report issues on [GitHub](https://github.com/exprays/greenlightci/issues)

## 🙏 Credits

Built with:

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Ora](https://github.com/sindresorhus/ora) - Terminal spinners
- [Chokidar](https://github.com/paulmillr/chokidar) - File watching
- [web-features](https://github.com/web-platform-dx/web-features) - Baseline data

---

Made with ❤️ by Surya for the Baseline Tooling Hackathon
