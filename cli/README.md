# 🚦 GreenLightCI CLI# 🚦 GreenLightCI CLI# 🚦 GreenLightCI CLI# 🚦 GreenLightCI CLI



A command-line tool for checking Baseline web feature compatibility in your local projects.



## 🎯 Features[![npm version](https://img.shields.io/npm/v/@greenlightci/cli.svg)](https://www.npmjs.com/package/@greenlightci/cli)A command-line tool for checking Baseline web feature compatibility in your local projects.A command-line tool for checking Baseline web feature compatibility in your local projects.



- ✅ **Local file scanning** - Detect web features in CSS, JS, and framework files[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- 👀 **Watch mode** - Continuously monitor files for changes

- 📊 **Rich terminal output** - Colored, formatted compatibility reports## 🎯 Features## 📖 Quick- `--include <patterns>` - File patterns to include

- 📄 **HTML reports** - Generate detailed compatibility reports

- 🎨 **Multiple file types** - Supports CSS, SCSS, JS, TS, JSX, TSX, Vue, Svelte> A powerful command-line tool for checking [Baseline](https://web.dev/baseline/) web feature compatibility in your projects.

- ⚡ **Fast scanning** - Efficiently scan large codebases

- 🔗 **Dashboard integration** - Send scan results to GreenLightCI Dashboard for tracking trends- `--exclude <patterns>` - File patterns to exclude



## 📦 Installation## 📖 Table of Contents



```bash- ✅ **Local file scanning** - Detect web features in CSS, JS, and framework files

# Install globally

npm install -g @greenlightci/cli- [Features](#-features)



# Or use with npx- [Installation](#-installation)- 👀 **Watch mode** - Continuously monitor files for changes### All Options Reference

npx @greenlightci/cli check

```- [Quick Start](#-quick-start)



## 🚀 Usage- [Usage](#-usage)- 📊 **Rich terminal output** - Colored, formatted compatibility reports



### Check Command  - [Check Command](#check-command)



Scan your project for Baseline compatibility issues:  - [Watch Command](#watch-command)- 📄 **HTML reports** - Generate detailed compatibility reports#### Common Options (Available in all commands)



```bash  - [Report Command](#report-command)

# Check current directory

greenlightci check- [Dashboard Integration](#-dashboard-integration)- 🎨 **Multiple file types** - Supports CSS, SCSS, JS, TS, JSX, TSX, Vue, Svelte



# Check specific directory- [Configuration](#-configuration)

greenlightci check ./src

- [Example Output](#-example-output)- ⚡ **Fast scanning** - Efficiently scan large codebases| Option | Alias | Type | Default | Description |

# Check with custom options

greenlightci check --target-year 2024 --block-newly --verbose- [CI/CD Integration](#-cicd-integration)



# Output as JSON- [API Reference](#-supported-features)- 🔗 **Dashboard integration** - Send scan results to GreenLightCI Dashboard for tracking trends|--------|-------|------|---------|-------------|

greenlightci check --json > report.json

```- [Contributing](#-contributing)



**Options:**| `--target-year` | `-t` | string | `2023` | Target Baseline year (2023, 2024, etc.) |



- `-t, --target-year <year>` - Target Baseline year (default: 2023)## ✨ Features

- `--block-newly` - Block newly available features

- `--block-limited` - Block limited availability features## 📖 Quick Reference| `--include` | - | string | `**/*.{css,scss,less,js,jsx,ts,tsx,vue,svelte}` | File patterns to include (glob) |

- `--json` - Output results as JSON

- `--verbose` - Show detailed output- ✅ **Local file scanning** - Detect web features in CSS, JS, and framework files

- `--include <patterns>` - File patterns to include (comma-separated)

- `--exclude <patterns>` - File patterns to exclude (comma-separated)- 👀 **Watch mode** - Continuously monitor files for changes| `--exclude` | - | string | `**/node_modules/**,**/dist/**,**/build/**` | File patterns to exclude (glob) |

- `--dashboard-url <url>` - Dashboard URL for sending scan results (env: `GREENLIGHTCI_DASHBOARD_URL`)

- `--dashboard-api-key <key>` - Dashboard API key for authentication (env: `GREENLIGHTCI_API_KEY`)- 📊 **Rich terminal output** - Colored, formatted compatibility reports



### Watch Mode- 📄 **HTML reports** - Generate detailed compatibility reports```bash



Continuously monitor files for changes:- 🎨 **Multiple file types** - Supports CSS, SCSS, JS, TS, JSX, TSX, Vue, Svelte



```bash- ⚡ **Fast scanning** - Efficiently scan large codebases# Basic usage#### Check Command Options

# Watch current directory

greenlightci watch- 🔗 **Dashboard integration** - Send scan results to GreenLightCI Dashboard for tracking trends



# Watch specific directorygreenlightci check                    # Check current directory

greenlightci watch ./src

## 📦 Installation

# Watch with custom patterns

greenlightci watch --include "src/**/*.{js,css}" --exclude "node_modules/**"greenlightci check ./src              # Check specific directory| Option | Alias | Type | Default | Description |

```

```bash

**Options:**

# Install globallygreenlightci watch                    # Watch mode for live feedback|--------|-------|------|---------|-------------|

- `-t, --target-year <year>` - Target Baseline year

- `--block-newly` - Block newly available featuresnpm install -g @greenlightci/cli

- `--block-limited` - Block limited availability features

- `--include <patterns>` - File patterns to includegreenlightci report                   # Generate HTML report| `--block-newly` | - | boolean | `false` | Treat newly available features as errors |

- `--exclude <patterns>` - File patterns to exclude

# Or use with npx (no installation required)

### Report Command

npx @greenlightci/cli check| `--block-limited` | - | boolean | `false` | Treat limited availability features as errors |

Generate a detailed compatibility report:

```

```bash

# Generate HTML report# With dashboard integration| `--json` | - | boolean | `false` | Output results as JSON |

greenlightci report

## 🚀 Quick Start

# Generate JSON report

greenlightci report --format json --output report.jsongreenlightci check \| `--verbose` | - | boolean | `false` | Show detailed output for all files |



# Generate report for specific directory```bash

greenlightci report ./src --output dist/baseline-report.html

```# Check current directory  --dashboard-url https://greenlightci-dashboard.vercel.app \| `--dashboard-url` | - | string | - | Dashboard URL (env: `GREENLIGHTCI_DASHBOARD_URL`) |



**Options:**greenlightci check



- `-t, --target-year <year>` - Target Baseline year  --dashboard-api-key glci_your_key| `--dashboard-api-key` | - | string | - | Dashboard API key (env: `GREENLIGHTCI_API_KEY`) |

- `-o, --output <file>` - Output file path (default: baseline-report.html)

- `--format <type>` - Output format: html or json (default: html)# Watch mode for live feedback

- `--include <patterns>` - File patterns to include

- `--exclude <patterns>` - File patterns to excludegreenlightci watch



## 🔗 Dashboard Integration



GreenLightCI CLI can send scan results to the [GreenLightCI Dashboard](https://greenlightci-dashboard.vercel.app/) for centralized tracking, trend analysis, and team visibility.# Generate HTML report# Advanced options#### Watch Command Options



### Setupgreenlightci report



1. **Get an API Key** from the dashboard:greenlightci check \

   - Visit https://greenlightci-dashboard.vercel.app/

   - Sign in with GitHub# Advanced usage

   - Go to Settings → API Keys

   - Generate a new API keygreenlightci check --target-year 2024 --block-newly --verbose  --target-year 2024 \| Option | Alias | Type | Default | Description |



2. **Configure the CLI** using environment variables (recommended):```



```bash  --block-newly \|--------|-------|------|---------|-------------|

# Add to your .bashrc, .zshrc, or .env file

export GREENLIGHTCI_DASHBOARD_URL="https://greenlightci-dashboard.vercel.app"## 📖 Usage

export GREENLIGHTCI_API_KEY="glci_your_api_key_here"

```  --block-limited \| `--block-newly` | - | boolean | `false` | Treat newly available features as errors |



Or pass as command-line options:### Commands



```bash  --verbose \| `--block-limited` | - | boolean | `false` | Treat limited availability features as errors |

greenlightci check \

  --dashboard-url https://greenlightci-dashboard.vercel.app \| Command | Description | Output |

  --dashboard-api-key glci_your_api_key_here

```|---------|-------------|--------|  --include "src/**/*.{js,css}" \



### Usage Examples| `check [path]` | Scan files for compatibility issues | Terminal output or JSON |



```bash| `watch [path]` | Monitor files for changes | Live terminal updates |  --exclude "node_modules/**"#### Report Command Options

# Check and send to dashboard (using env vars)

greenlightci check ./src| `report [path]` | Generate detailed compatibility report | HTML or JSON file |



# Check and send with explicit options```

greenlightci check ./src \

  --dashboard-url https://greenlightci-dashboard.vercel.app \### Check Command

  --dashboard-api-key glci_abc123...

| Option | Alias | Type | Default | Description |

# Combine with other options

greenlightci check \Scan your project for Baseline compatibility issues:

  --target-year 2024 \

  --block-newly \## 📦 Installation|--------|-------|------|---------|-------------|

  --verbose \

  --dashboard-url https://greenlightci-dashboard.vercel.app \```bash

  --dashboard-api-key glci_abc123...

```# Check current directory| `--output` | `-o` | string | `baseline-report.html` | Output file path |



### Dashboard Featuresgreenlightci check



When integrated with the dashboard, you get:```bash| `--format`| - | string |`html` | Output format (`html`or`json`) |



- 📈 **Trend tracking** - Monitor compatibility scores over time# Check specific directory

- 📊 **Project overview** - See all your projects in one place

- 🎯 **Feature analysis** - Identify most-used and problematic featuresgreenlightci check ./src# Install globally

- 👥 **Team visibility** - Share results with your team

- 📅 **Historical data** - Compare current and past scans

- 🔔 **Alerts** - Get notified of compatibility regressions (coming soon)

# Check with custom optionsnpm install -g @greenlightci/cli## 🔗 Dashboard Integrationerence

### Environment Variables

greenlightci check --target-year 2024 --block-newly --verbose

- `GREENLIGHTCI_DASHBOARD_URL` - Dashboard URL (default: none)

- `GREENLIGHTCI_API_KEY` - API key for authentication (default: none)# Or use with npx```bash



### Security# Output as JSON



- API keys are stored securely in the dashboard databasegreenlightci check --json > report.jsonnpx @greenlightci/cli check# Basic usage

- Keys are transmitted over HTTPS only

- Each key can be revoked independently from the dashboard```

- Keys are hashed before storage

````greenlightci check                    # Check current directory

## 📊 Example Output

#### Options

### Check Command

greenlightci check ./src              # Check specific directory

```

🚦 GreenLightCI - Baseline Compatibility Check| Option | Alias | Type | Default | Description |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

|--------|-------|------|---------|-------------|## 🚀 Usagegreenlightci watch                    # Watch mode for live feedback

src/styles/main.css [85/100]

  ✓ CSS Grid - Widely Available| `--target-year` | `-t` | string | `2023` | Target Baseline year (2023, 2024, etc.) |

  ⚠ Container Queries - Newly Available

  ⚠ CSS Nesting - Newly Available| `--block-newly` | - | boolean | `false` | Treat newly available features as errors |greenlightci report                   # Generate HTML report



src/components/Button.tsx [92/100]| `--block-limited` | - | boolean | `false` | Treat limited availability features as errors |

  ✓ Optional Chaining - Widely Available

  ✓ Nullish Coalescing - Widely Available| `--json` | - | boolean | `false` | Output results as JSON |### Commands Overview



📊 Scan Summary| `--verbose` | - | boolean | `false` | Show detailed output for all files |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| `--include` | - | string | `**/*.{css,scss,less,js,jsx,ts,tsx,vue,svelte}` | File patterns to include (glob) |# With dashboard integration

Files Scanned:      15

Features Detected:  32| `--exclude` | - | string | `**/node_modules/**,**/dist/**,**/build/**` | File patterns to exclude (glob) |

Blocking Issues:    0

Warnings:           5| `--dashboard-url` | - | string | - | Dashboard URL (env: `GREENLIGHTCI_DASHBOARD_URL`) || Command | Description | Output |greenlightci check \

Average Score:      88

| `--dashboard-api-key` | - | string | - | Dashboard API key (env: `GREENLIGHTCI_API_KEY`) |

█████████████████░░░ 88%

|---------|-------------|--------|  --dashboard-url https://greenlightci-dashboard.vercel.app \

⚠ Found 5 warnings

  Consider adding polyfills for better compatibility### Watch Command

```

| `check [path]` | Scan files for compatibility issues | Terminal output or JSON |  --dashboard-api-key glci_your_key

### With Dashboard Integration

Continuously monitor files for changes:

```

🚦 GreenLightCI - Baseline Compatibility Check| `watch [path]` | Monitor files for changes | Live terminal updates |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```bash

src/styles/main.css [85/100]

  ⚠ Container Queries - Newly Available# Watch current directory| `report [path]` | Generate detailed compatibility report | HTML or JSON file |# Advanced options

  ⚠ CSS Nesting - Newly Available

greenlightci watch

📊 Scan Summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━greenlightci check \



Files Scanned:      15# Watch specific directory

Features Detected:  32

Blocking Issues:    0greenlightci watch ./src### Check Command  --target-year 2024 \

Warnings:           5

Average Score:      88



█████████████████░░░ 88%# Watch with custom patterns  --block-newly \



⚠ Found 5 warningsgreenlightci watch --include "src/**/*.{js,css}" --exclude "node_modules/**"

  Consider adding polyfills for better compatibility

```Scan your project for Baseline compatibility issues:  --block-limited \

📊 Sending scan data to dashboard...

✓ Scan data sent to dashboard (Scan ID: scan_abc123xyz)

🔗 View results: https://greenlightci-dashboard.vercel.app/projects/my-project

```#### Options  --verbose \



### Watch Mode



```| Option | Alias | Type | Default | Description |```bash  --include "src/**/*.{js,css}" \

👀 GreenLightCI - Watch Mode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━|--------|-------|------|---------|-------------|



ℹ Watching: ./src| `--target-year` | `-t` | string | `2023` | Target Baseline year |# Check current directory  --exclude "node_modules/**"

ℹ Target Year: 2023

ℹ Press Ctrl+C to stop| `--block-newly` | - | boolean | `false` | Treat newly available features as errors |



✓ Initial scan complete. Watching for changes... (24 files)| `--block-limited` | - | boolean | `false` | Treat limited availability features as errors |greenlightci check```



[10:45:23] changed src/styles/main.css| `--include` | - | string | `**/*.{css,scss,less,js,jsx,ts,tsx,vue,svelte}` | File patterns to include (glob) |

  Score: 85/100 | Features: 3

  ⚠ Container Queries - ⚠ Newly Available| `--exclude` | - | string | `**/node_modules/**,**/dist/**,**/build/**` | File patterns to exclude (glob) |

  ⚠ CSS Nesting - ⚠ Newly Available

⚠ Consider adding polyfills

```

### Report Command# Check specific directory## 🎯 Features

## 🎨 Supported Features



### CSS Features

Generate a detailed compatibility report:greenlightci check ./src

- Container Queries (`@container`)

- `:has()` Selector

- CSS Grid

- Subgrid```bash- ✅ **Local file scanning** - Detect web features in CSS, JS, and framework files

- CSS Nesting

- Custom Properties (CSS Variables)# Generate HTML report

- Logical Properties

greenlightci report# Check with custom options- 👀 **Watch mode** - Continuously monitor files for changes

### JavaScript Features



- Optional Chaining (`?.`)

- Nullish Coalescing (`??`)# Generate JSON reportgreenlightci check --target-year 2024 --block-newly --verbose- 📊 **Rich terminal output** - Colored, formatted compatibility reports

- Dynamic Import

- Top-level Awaitgreenlightci report --format json --output report.json

- Private Fields

- 📄 **HTML reports** - Generate detailed compatibility reports

## 🔧 Configuration

# Generate report for specific directory

You can create a `.greenlightrc.json` file in your project root:

greenlightci report ./src --output dist/baseline-report.html# Output as JSON- 🎨 **Multiple file types** - Supports CSS, SCSS, JS, TS, JSX, TSX, Vue, Svelte

```json

{```

  "targetYear": "2023",

  "blockNewly": false,greenlightci check --json > report.json- ⚡ **Fast scanning** - Efficiently scan large codebases

  "blockLimited": true,

  "include": ["src/**/*.{css,js,ts}"],#### Options

  "exclude": ["node_modules/**", "dist/**"],

  "dashboardUrl": "https://greenlightci-dashboard.vercel.app",```- 🔗 **Dashboard integration** - Send scan results to GreenLightCI Dashboard for tracking trends

  "dashboardApiKey": "glci_your_api_key_here"

}| Option | Alias | Type | Default | Description |

```

|--------|-------|------|---------|-------------|

**Note:** For security, avoid committing API keys to version control. Use environment variables instead.

| `--target-year` | `-t` | string | `2023` | Target Baseline year |

## 📄 File Support

| `--output` | `-o` | string | `baseline-report.html` | Output file path |**Options:**## 📦 Installation

Supported file extensions:

| `--format` | - | string | `html` | Output format (`html` or `json`) |

- **CSS**: `.css`, `.scss`, `.less`

- **JavaScript**: `.js`, `.ts`, `.jsx`, `.tsx`| `--include` | - | string | `**/*.{css,scss,less,js,jsx,ts,tsx,vue,svelte}` | File patterns to include (glob) |

- **Frameworks**: `.vue`, `.svelte`

| `--exclude` | - | string | `**/node_modules/**,**/dist/**,**/build/**` | File patterns to exclude (glob) |

## 💡 Best Practices

- `-t, --target-year <year>` - Target Baseline year (default: 2023)```bash

1. **Use watch mode during development** - Get instant feedback on compatibility

2. **Generate reports before releases** - Create HTML reports for stakeholders## 🔗 Dashboard Integration

3. **Integrate with CI/CD** - Use JSON output for automated checks

4. **Customize patterns** - Focus on specific directories with include/exclude- `--block-newly` - Block newly available features# Install globally

5. **Use verbose mode** - Get detailed information about each feature

6. **Enable dashboard integration** - Track trends and share results with your teamGreenLightCI CLI can send scan results to the [GreenLightCI Dashboard](https://greenlightci-dashboard.vercel.app/) for centralized tracking, trend analysis, and team visibility.

7. **Use environment variables for API keys** - Keep credentials secure and out of version control

- `--block-limited` - Block limited availability featuresnpm install -g @greenlightci/cli

## 🤝 Integration

### Setup

### NPM Scripts

- `--json` - Output results as JSON

Add to your `package.json`:

1. **Get an API Key** from the dashboard:

```json

{   - Visit https://greenlightci-dashboard.vercel.app/- `--verbose` - Show detailed output# Or use with npx

  "scripts": {

    "baseline:check": "greenlightci check",   - Sign in with GitHub

    "baseline:watch": "greenlightci watch",

    "baseline:report": "greenlightci report",   - Go to Settings → API Keys- `--include <patterns>` - File patterns to include (comma-separated)npx @greenlightci/cli check

    "baseline:check:dashboard": "greenlightci check --dashboard-url $GREENLIGHTCI_DASHBOARD_URL --dashboard-api-key $GREENLIGHTCI_API_KEY"

  }   - Generate a new API key

}

```- `--exclude <patterns>` - File patterns to exclude (comma-separated)```



### Pre-commit Hook2. **Configure the CLI** using environment variables (recommended):



```bash- `--dashboard-url <url>` - Dashboard URL for sending scan results (env: `GREENLIGHTCI_DASHBOARD_URL`)

# .husky/pre-commit

#!/bin/sh```bash

npx greenlightci check --block-newly --block-limited

```# Add to your .bashrc, .zshrc, or .env file- `--dashboard-api-key <key>` - Dashboard API key for authentication (env: `GREENLIGHTCI_API_KEY`)## 🚀 Usage



### CI/CD Pipelineexport GREENLIGHTCI_DASHBOARD_URL="https://greenlightci-dashboard.vercel.app"



```yamlexport GREENLIGHTCI_API_KEY="glci_your_api_key_here"

# .github/workflows/baseline-check.yml

name: Baseline Compatibility Check```



on: [push, pull_request]### Watch Mode### Commands Overview



jobs:Or pass as command-line options:

  check:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v3```bash



      - name: Setup Node.jsgreenlightci check \Continuously monitor files for changes:| Command | Description | Output |

        uses: actions/setup-node@v3

        with:  --dashboard-url https://greenlightci-dashboard.vercel.app \

          node-version: '18'

  --dashboard-api-key glci_your_api_key_here|---------|-------------|--------|

      - name: Install GreenLightCI CLI

        run: npm install -g @greenlightci/cli```



      - name: Run Baseline Check```bash| `check [path]` | Scan files for compatibility issues | Terminal output or JSON |

        run: greenlightci check --json > baseline-report.json

        env:### Usage Examples

          GREENLIGHTCI_DASHBOARD_URL: ${{ secrets.GREENLIGHTCI_DASHBOARD_URL }}

          GREENLIGHTCI_API_KEY: ${{ secrets.GREENLIGHTCI_API_KEY }}# Watch current directory| `watch [path]` | Monitor files for changes | Live terminal updates |



      - name: Upload Report```bash

        uses: actions/upload-artifact@v3

        with:# Check and send to dashboard (using env vars)greenlightci watch| `report [path]` | Generate detailed compatibility report | HTML or JSON file |

          name: baseline-report

          path: baseline-report.jsongreenlightci check ./src

```



**Note:** Add `GREENLIGHTCI_DASHBOARD_URL` and `GREENLIGHTCI_API_KEY` as repository secrets for dashboard integration.

# Check and send with explicit options

## 📚 Related Packages

greenlightci check ./src \# Watch specific directory### Check Command

- **[@greenlightci/action](../action)** - GitHub Action for PR checks

- **[@greenlightci/dashboard](../dashboard)** - Web dashboard for tracking adoption  --dashboard-url https://greenlightci-dashboard.vercel.app \

- **[@greenlightci/shared](../shared)** - Shared utilities and types

  --dashboard-api-key glci_abc123...greenlightci watch ./src

## 📝 License



MIT

# Combine with other optionsScan your project for Baseline compatibility issues:

## 🐛 Issues

greenlightci check \

Report issues on [GitHub](https://github.com/exprays/greenlightci/issues)

  --target-year 2024 \# Watch with custom patterns

## 🙏 Credits

  --block-newly \

Built with:

  --verbose \greenlightci watch --include "src/**/*.{js,css}" --exclude "node_modules/**"```bash

- [Commander.js](https://github.com/tj/commander.js) - CLI framework

- [Chalk](https://github.com/chalk/chalk) - Terminal colors  --dashboard-url https://greenlightci-dashboard.vercel.app \

- [Ora](https://github.com/sindresorhus/ora) - Terminal spinners

- [Chokidar](https://github.com/paulmillr/chokidar) - File watching  --dashboard-api-key glci_abc123...```# Check current directory

- [web-features](https://github.com/web-platform-dx/web-features) - Baseline data

```

---

greenlightci check

Made with ❤️ for the Baseline Tooling Hackathon

### Dashboard Features

**Options:**

When integrated with the dashboard, you get:

# Check specific directory

- 📈 **Trend tracking** - Monitor compatibility scores over time

- 📊 **Project overview** - See all your projects in one place- `-t, --target-year <year>` - Target Baseline yeargreenlightci check ./src

- 🎯 **Feature analysis** - Identify most-used and problematic features

- 👥 **Team visibility** - Share results with your team- `--block-newly` - Block newly available features

- 📅 **Historical data** - Compare current and past scans

- 🔔 **Notifications** - Get alerts on compatibility regressions (coming soon)- `--block-limited` - Block limited availability features# Check with custom options



### Environment Variables- `--include <patterns>` - File patterns to includegreenlightci check --target-year 2024 --block-newly --verbose



- `GREENLIGHTCI_DASHBOARD_URL` - Dashboard URL (default: none)- `--exclude <patterns>` - File patterns to exclude

- `GREENLIGHTCI_API_KEY` - API key for authentication (default: none)

# Output as JSON

### Security

### Report Commandgreenlightci check --json > report.json

- API keys are stored securely in the dashboard database

- Keys are transmitted over HTTPS only````

- Each key can be revoked independently from the dashboard

- Keys are hashed before storageGenerate a detailed compatibility report:



## 📊 Example Output**Options:**



### Check Command````bash



```# Generate HTML report- `-t, --target-year <year>` - Target Baseline year (default: 2023)

🚦 GreenLightCI - Baseline Compatibility Check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━greenlightci report- `--block-newly` - Block newly available features



src/styles/main.css [85/100]- `--block-limited` - Block limited availability features

✓ CSS Grid - Widely Available

⚠ Container Queries - Newly Available# Generate JSON report- `--json` - Output results as JSON

⚠ CSS Nesting - Newly Available

greenlightci report --format json --output report.json- `--verbose` - Show detailed output

src/components/Button.tsx [92/100]

✓ Optional Chaining - Widely Available- `--include <patterns>` - File patterns to include (comma-separated)

✓ Nullish Coalescing - Widely Available

# Generate report for specific directory- `--exclude <patterns>` - File patterns to exclude (comma-separated)

📊 Scan Summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━greenlightci report ./src --output dist/baseline-report.html- `--dashboard-url <url>` - Dashboard URL for sending scan results (env: `GREENLIGHTCI_DASHBOARD_URL`)

Files Scanned: 15

Features Detected: 32```- `--dashboard-api-key <key>` - Dashboard API key for authentication (env: `GREENLIGHTCI_API_KEY`)

Blocking Issues: 0

Warnings: 5

Average Score: 88

**Options:**### Watch Mode

█████████████████░░░ 88%



⚠ Found 5 warnings

  Consider adding polyfills for better compatibility- `-t, --target-year <year>` - Target Baseline yearContinuously monitor files for changes:

```

- `-o, --output <file>` - Output file path (default: baseline-report.html)

### With Dashboard Integration

- `--format <type>` - Output format: html or json (default: html)```bash

```

🚦 GreenLightCI - Baseline Compatibility Check- `--include <patterns>` - File patterns to include# Watch current directory

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- `--exclude <patterns>` - File patterns to excludegreenlightci watch

src/styles/main.css [85/100]

⚠ Container Queries - Newly Available

⚠ CSS Nesting - Newly Available

### All Options Reference# Watch specific directory

📊 Scan Summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━greenlightci watch ./src

Files Scanned: 15

Features Detected: 32#### Common Options (Available in all commands)

Blocking Issues: 0

Warnings: 5# Watch with custom patterns

Average Score: 88

| Option | Alias | Type | Default | Description |greenlightci watch --include "src/**/*.{js,css}" --exclude "node_modules/**"

█████████████████░░░ 88%

|--------|-------|------|---------|-------------|```

⚠ Found 5 warnings

  Consider adding polyfills for better compatibility| `--target-year` | `-t` | string | `2023` | Target Baseline year (2023, 2024, etc.) |



📊 Sending scan data to dashboard...| `--include` | - | string | `**/*.{css,scss,less,js,jsx,ts,tsx,vue,svelte}` | File patterns to include (glob) |**Options:**

✓ Scan data sent to dashboard (Scan ID: scan_abc123xyz)

🔗 View results: https://greenlightci-dashboard.vercel.app/projects/my-project| `--exclude` | - | string | `**/node_modules/**,**/dist/**,**/build/**` | File patterns to exclude (glob) |

```

- `-t, --target-year <year>` - Target Baseline year

### Watch Mode

#### Check Command Options- `--block-newly` - Block newly available features

```

👀 GreenLightCI - Watch Mode- `--block-limited` - Block limited availability features

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Option | Alias | Type | Default | Description |- `--include <patterns>` - File patterns to include

ℹ Watching: ./src

ℹ Target Year: 2023|--------|-------|------|---------|-------------|- `--exclude <patterns>` - File patterns to exclude

ℹ Press Ctrl+C to stop

| `--block-newly` | - | boolean | `false` | Treat newly available features as errors |

✓ Initial scan complete. Watching for changes... (24 files)

| `--block-limited` | - | boolean | `false` | Treat limited availability features as errors |### Report Command

[10:45:23] changed src/styles/main.css

Score: 85/100 | Features: 3| `--json` | - | boolean | `false` | Output results as JSON |

⚠ Container Queries - ⚠ Newly Available

⚠ CSS Nesting - ⚠ Newly Available| `--verbose` | - | boolean | `false` | Show detailed output for all files |Generate a detailed compatibility report:

⚠ Consider adding polyfills

```| `--dashboard-url` | - | string | - | Dashboard URL (env: `GREENLIGHTCI_DASHBOARD_URL`) |



## 🎨 Supported Features| `--dashboard-api-key` | - | string | - | Dashboard API key (env: `GREENLIGHTCI_API_KEY`) |```bash



### CSS Features# Generate HTML report



- Container Queries (`@container`)#### Watch Command Optionsgreenlightci report

- `:has()` Selector

- CSS Grid

- Subgrid

- CSS Nesting| Option | Alias | Type | Default | Description |# Generate JSON report

- Custom Properties (CSS Variables)

- Logical Properties|--------|-------|------|---------|-------------|greenlightci report --format json --output report.json



### JavaScript Features| `--block-newly` | - | boolean | `false` | Treat newly available features as errors |



- Optional Chaining (`?.`)| `--block-limited` | - | boolean | `false` | Treat limited availability features as errors |# Generate report for specific directory

- Nullish Coalescing (`??`)

- Dynamic Importgreenlightci report ./src --output dist/baseline-report.html

- Top-level Await

- Private Fields#### Report Command Options```



## 🔧 Configuration



You can create a `.greenlightrc.json` file in your project root:| Option | Alias | Type | Default | Description |**Options:**



```json|--------|-------|------|---------|-------------|

{

  "targetYear": "2023",| `--output` | `-o` | string | `baseline-report.html` | Output file path |- `-t, --target-year <year>` - Target Baseline year

  "blockNewly": false,

  "blockLimited": true,| `--format` | - | string | `html` | Output format (`html` or `json`) |- `-o, --output <file>` - Output file path (default: baseline-report.html)

  "include": ["src/**/*.{css,js,ts}"],

  "exclude": ["node_modules/**", "dist/**"],- `--format <type>` - Output format: html or json (default: html)

  "dashboardUrl": "https://greenlightci-dashboard.vercel.app",

  "dashboardApiKey": "glci_your_api_key_here"## 🔗 Dashboard Integration- `--include <patterns>` - File patterns to include

}

```- `--exclude <patterns>` - File patterns to exclude



**Note:** For security, avoid committing API keys to version control. Use environment variables instead.GreenLightCI CLI can send scan results to the [GreenLightCI Dashboard](https://greenlightci-dashboard.vercel.app/) for centralized tracking, trend analysis, and team visibility.



## 📄 File Support## � Dashboard Integration



Supported file extensions:### Setup



- **CSS**: `.css`, `.scss`, `.less`GreenLightCI CLI can send scan results to the [GreenLightCI Dashboard](https://greenlightci-dashboard.vercel.app/) for centralized tracking, trend analysis, and team visibility.

- **JavaScript**: `.js`, `.ts`, `.jsx`, `.tsx`

- **Frameworks**: `.vue`, `.svelte`1. **Get an API Key** from the dashboard:



## 💡 Best Practices   - Visit https://greenlightci-dashboard.vercel.app/### Setup



1. **Use watch mode during development** - Get instant feedback on compatibility   - Sign in with GitHub

2. **Generate reports before releases** - Create HTML reports for stakeholders

3. **Integrate with CI/CD** - Use JSON output for automated checks   - Go to Settings → API Keys1. **Get an API Key** from the dashboard:

4. **Customize patterns** - Focus on specific directories with include/exclude

5. **Use verbose mode** - Get detailed information about each feature   - Generate a new API key   - Visit https://greenlightci-dashboard.vercel.app/

6. **Enable dashboard integration** - Track trends and share results with your team

7. **Use environment variables for API keys** - Keep credentials secure and out of version control   - Sign in with GitHub



## 🔄 CI/CD Integration2. **Configure the CLI** using environment variables (recommended):   - Go to Settings → API Keys



### NPM Scripts   - Generate a new API key



Add to your `package.json`:```bash



```json# Add to your .bashrc, .zshrc, or .env file2. **Configure the CLI** using environment variables (recommended):

{

  "scripts": {export GREENLIGHTCI_DASHBOARD_URL="https://greenlightci-dashboard.vercel.app"

    "baseline:check": "greenlightci check",

    "baseline:watch": "greenlightci watch",export GREENLIGHTCI_API_KEY="glci_your_api_key_here"```bash

    "baseline:report": "greenlightci report",

    "baseline:check:dashboard": "greenlightci check --dashboard-url $GREENLIGHTCI_DASHBOARD_URL --dashboard-api-key $GREENLIGHTCI_API_KEY"```# Add to your .bashrc, .zshrc, or .env file

  }

}export GREENLIGHTCI_DASHBOARD_URL="https://greenlightci-dashboard.vercel.app"

```

Or pass as command-line options:export GREENLIGHTCI_API_KEY="glci_your_api_key_here"

### Pre-commit Hook

````

```bash

# .husky/pre-commit````bash

#!/bin/sh

npx greenlightci check --block-newly --block-limitedgreenlightci check \Or pass as command-line options:

```

  --dashboard-url https://greenlightci-dashboard.vercel.app \

### GitHub Actions

  --dashboard-api-key glci_your_api_key_here```bash

```yaml

# .github/workflows/baseline-check.yml```greenlightci check \

name: Baseline Compatibility Check

  --dashboard-url https://greenlightci-dashboard.vercel.app \

on: [push, pull_request]

### Usage Examples  --dashboard-api-key glci_your_api_key_here

jobs:

  check:````

    runs-on: ubuntu-latest

    steps:````bash

      - uses: actions/checkout@v3

# Check and send to dashboard (using env vars)### Usage Examples

      - name: Setup Node.js

        uses: actions/setup-node@v3greenlightci check ./src

        with:

          node-version: '18'```bash



      - name: Install GreenLightCI CLI# Check and send with explicit options# Check and send to dashboard (using env vars)

        run: npm install -g @greenlightci/cli

greenlightci check ./src \greenlightci check ./src

      - name: Run Baseline Check

        run: greenlightci check --json > baseline-report.json  --dashboard-url https://greenlightci-dashboard.vercel.app \

        env:

          GREENLIGHTCI_DASHBOARD_URL: ${{ secrets.GREENLIGHTCI_DASHBOARD_URL }}  --dashboard-api-key glci_abc123...# Check and send with explicit options

          GREENLIGHTCI_API_KEY: ${{ secrets.GREENLIGHTCI_API_KEY }}

greenlightci check ./src \

      - name: Upload Report

        uses: actions/upload-artifact@v3# Combine with other options  --dashboard-url https://greenlightci-dashboard.vercel.app \

        with:

          name: baseline-reportgreenlightci check \  --dashboard-api-key glci_abc123...

          path: baseline-report.json

```  --target-year 2024 \



**Note:** Add `GREENLIGHTCI_DASHBOARD_URL` and `GREENLIGHTCI_API_KEY` as repository secrets for dashboard integration.  --block-newly \# Combine with other options



## 📚 Related Packages  --verbose \greenlightci check \



- **[@greenlightci/action](../action)** - GitHub Action for PR checks  --dashboard-url https://greenlightci-dashboard.vercel.app \  --target-year 2024 \

- **[@greenlightci/dashboard](../dashboard)** - Web dashboard for tracking adoption

- **[@greenlightci/shared](../shared)** - Shared utilities and types  --dashboard-api-key glci_abc123...  --block-newly \



## 🤝 Contributing```  --verbose \



Contributions are welcome! Please feel free to submit a Pull Request.  --dashboard-url https://greenlightci-dashboard.vercel.app \



## 📝 License### Dashboard Features  --dashboard-api-key glci_abc123...



MIT © [Surya](https://github.com/exprays)````



## 🐛 IssuesWhen integrated with the dashboard, you get:



Report issues on [GitHub](https://github.com/exprays/greenlightci/issues)### Dashboard Features



## 🙏 Credits- 📈 **Trend tracking** - Monitor compatibility scores over time



Built with:- 📊 **Project overview** - See all your projects in one placeWhen integrated with the dashboard, you get:



- [Commander.js](https://github.com/tj/commander.js) - CLI framework- 🎯 **Feature analysis** - Identify most-used and problematic features

- [Chalk](https://github.com/chalk/chalk) - Terminal colors

- [Ora](https://github.com/sindresorhus/ora) - Terminal spinners- 👥 **Team visibility** - Share results with your team- 📈 **Trend tracking** - Monitor compatibility scores over time

- [Chokidar](https://github.com/paulmillr/chokidar) - File watching

- [web-features](https://github.com/web-platform-dx/web-features) - Baseline data- 📅 **Historical data** - Compare current and past scans- 📊 **Project overview** - See all your projects in one place



---- 🔔 **Notifications** - Get alerts on compatibility regressions (coming soon)- 🎯 **Feature analysis** - Identify most-used and problematic features



Made with ❤️ by Surya for the Baseline Tooling Hackathon- 👥 **Team visibility** - Share results with your team


### Environment Variables- 📅 **Historical data** - Compare current and past scans

- 🔔 **Notifications** - Get alerts on compatibility regressions (coming soon)

- `GREENLIGHTCI_DASHBOARD_URL` - Dashboard URL (default: none)

- `GREENLIGHTCI_API_KEY` - API key for authentication (default: none)### Environment Variables

### Security- `GREENLIGHTCI_DASHBOARD_URL` - Dashboard URL (default: none)

- `GREENLIGHTCI_API_KEY` - API key for authentication (default: none)

- API keys are stored securely in the dashboard database

- Keys are transmitted over HTTPS only### Security

- Each key can be revoked independently from the dashboard

- Keys are hashed before storage- API keys are stored securely in the dashboard database

- Keys are transmitted over HTTPS only

## 📊 Example Output- Each key can be revoked independently from the dashboard

- Keys are hashed before storage

### Check Command

## �📊 Example Output

```

🚦 GreenLightCI - Baseline Compatibility Check### Check Command

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```

src/styles/main.css [85/100]🚦 GreenLightCI - Baseline Compatibility Check

✓ CSS Grid - Widely Available━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠ Container Queries - Newly Available

⚠ CSS Nesting - Newly Availablesrc/styles/main.css [85/100]

✓ CSS Grid - Widely Available

src/components/Button.tsx [92/100] ⚠ Container Queries - Newly Available

✓ Optional Chaining - Widely Available ⚠ CSS Nesting - Newly Available

✓ Nullish Coalescing - Widely Available

src/components/Button.tsx [92/100]

📊 Scan Summary ✓ Optional Chaining - Widely Available

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✓ Nullish Coalescing - Widely Available

Files Scanned: 15📊 Scan Summary

Features Detected: 32━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Blocking Issues: 0

Warnings: 5Files Scanned: 15

Average Score: 88Features Detected: 32

Blocking Issues: 0

█████████████████░░░ 88%Warnings: 5

Average Score: 88

⚠ Found 5 warnings

Consider adding polyfills for better compatibility█████████████████░░░ 88%

```

⚠ Found 5 warnings

### With Dashboard Integration  Consider adding polyfills for better compatibility

```

```

🚦 GreenLightCI - Baseline Compatibility Check### With Dashboard Integration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```

src/styles/main.css [85/100]🚦 GreenLightCI - Baseline Compatibility Check

⚠ Container Queries - Newly Available━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠ CSS Nesting - Newly Available

src/styles/main.css [85/100]

📊 Scan Summary ⚠ Container Queries - Newly Available

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ⚠ CSS Nesting - Newly Available

Files Scanned: 15📊 Scan Summary

Features Detected: 32━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Blocking Issues: 0

Warnings: 5Files Scanned: 15

Average Score: 88Features Detected: 32

Blocking Issues: 0

█████████████████░░░ 88%Warnings: 5

Average Score: 88

⚠ Found 5 warnings

Consider adding polyfills for better compatibility█████████████████░░░ 88%

📊 Sending scan data to dashboard...⚠ Found 5 warnings

✓ Scan data sent to dashboard (Scan ID: scan_abc123xyz) Consider adding polyfills for better compatibility

🔗 View results: https://greenlightci-dashboard.vercel.app/projects/my-project

```📊 Sending scan data to dashboard...

✓ Scan data sent to dashboard (Scan ID: scan_abc123xyz)

### Watch Mode🔗 View results: https://greenlightci-dashboard.vercel.app/projects/my-project

```

```

👀 GreenLightCI - Watch Mode### Watch Mode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```

ℹ Watching: ./src👀 GreenLightCI - Watch Mode

ℹ Target Year: 2023━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ Press Ctrl+C to stop

ℹ Watching: ./src

✓ Initial scan complete. Watching for changes... (24 files)ℹ Target Year: 2023

ℹ Press Ctrl+C to stop

[10:45:23] changed src/styles/main.css

Score: 85/100 | Features: 3✓ Initial scan complete. Watching for changes... (24 files)

⚠ Container Queries - ⚠ Newly Available

⚠ CSS Nesting - ⚠ Newly Available[10:45:23] changed src/styles/main.css

⚠ Consider adding polyfills Score: 85/100 | Features: 3

```⚠ Container Queries - ⚠ Newly Available

  ⚠ CSS Nesting - ⚠ Newly Available

## 🎨 Supported Features⚠ Consider adding polyfills

```

### CSS Features

## 🎨 Supported Features

- Container Queries (`@container`)

- `:has()` Selector### CSS Features

- CSS Grid

- Subgrid- Container Queries (`@container`)

- CSS Nesting- `:has()` Selector

- Custom Properties (CSS Variables)- CSS Grid

- Logical Properties- Subgrid

- CSS Nesting

### JavaScript Features- Custom Properties (CSS Variables)

- Logical Properties

- Optional Chaining (`?.`)

- Nullish Coalescing (`??`)### JavaScript Features

- Dynamic Import

- Top-level Await- Optional Chaining (`?.`)

- Private Fields- Nullish Coalescing (`??`)

- Dynamic Import

## 🔧 Configuration- Top-level Await

- Private Fields

You can create a `.greenlightrc.json` file in your project root:

## 🔧 Configuration

````json

{You can create a `.greenlightrc.json` file in your project root:

  "targetYear": "2023",

  "blockNewly": false,```json

  "blockLimited": true,{

  "include": ["src/**/*.{css,js,ts}"],  "targetYear": "2023",

  "exclude": ["node_modules/**", "dist/**"],  "blockNewly": false,

  "dashboardUrl": "https://greenlightci-dashboard.vercel.app",  "blockLimited": true,

  "dashboardApiKey": "glci_your_api_key_here"  "include": ["src/**/*.{css,js,ts}"],

}  "exclude": ["node_modules/**", "dist/**"],

```  "dashboardUrl": "https://greenlightci-dashboard.vercel.app",

  "dashboardApiKey": "glci_your_api_key_here"

**Note:** For security, avoid committing API keys to version control. Use environment variables instead.}

````

## 📄 File Support

**Note:** For security, avoid committing API keys to version control. Use environment variables instead.

Supported file extensions:

## 📄 File Support

- **CSS**: `.css`, `.scss`, `.less`

- **JavaScript**: `.js`, `.ts`, `.jsx`, `.tsx`Supported file extensions:

- **Frameworks**: `.vue`, `.svelte`

- **CSS**: `.css`, `.scss`, `.less`

## 💡 Tips- **JavaScript**: `.js`, `.ts`, `.jsx`, `.tsx`

- **Frameworks**: `.vue`, `.svelte`

1. **Use watch mode during development** - Get instant feedback on compatibility

2. **Generate reports before releases** - Create HTML reports for stakeholders## 💡 Tips

3. **Integrate with CI/CD** - Use JSON output for automated checks

4. **Customize patterns** - Focus on specific directories with include/exclude1. **Use watch mode during development** - Get instant feedback on compatibility

5. **Use verbose mode** - Get detailed information about each feature2. **Generate reports before releases** - Create HTML reports for stakeholders

6. **Enable dashboard integration** - Track trends and share results with your team3. **Integrate with CI/CD** - Use JSON output for automated checks

7. **Use environment variables for API keys** - Keep credentials secure and out of version control4. **Customize patterns** - Focus on specific directories with include/exclude

8. **Use verbose mode** - Get detailed information about each feature

## 🤝 Integration6. **Enable dashboard integration** - Track trends and share results with your team

7. **Use environment variables for API keys** - Keep credentials secure and out of version control

### NPM Scripts

## 🤝 Integration

Add to your `package.json`:

### NPM Scripts

````json

{Add to your `package.json`:

  "scripts": {

    "baseline:check": "greenlightci check",```json

    "baseline:watch": "greenlightci watch",{

    "baseline:report": "greenlightci report",  "scripts": {

    "baseline:check:dashboard": "greenlightci check --dashboard-url $GREENLIGHTCI_DASHBOARD_URL --dashboard-api-key $GREENLIGHTCI_API_KEY"    "baseline:check": "greenlightci check",

  }    "baseline:watch": "greenlightci watch",

}    "baseline:report": "greenlightci report",

```    "baseline:check:dashboard": "greenlightci check --dashboard-url $GREENLIGHTCI_DASHBOARD_URL --dashboard-api-key $GREENLIGHTCI_API_KEY"

  }

### Pre-commit Hook}

````

````bash

# .husky/pre-commit### Pre-commit Hook

#!/bin/sh

npx greenlightci check --block-newly --block-limited```bash

```# .husky/pre-commit

#!/bin/sh

### CI/CD Pipelinenpx greenlightci check --block-newly --block-limited

````

````yaml

# .github/workflows/baseline-check.yml### CI/CD Pipeline

name: Baseline Compatibility Check

```yaml

on: [push, pull_request]# .github/workflows/baseline-check.yml

name: Baseline Compatibility Check

jobs:

  check:on: [push, pull_request]

    runs-on: ubuntu-latest

    steps:jobs:

      - uses: actions/checkout@v3  check:

          runs-on: ubuntu-latest

      - name: Setup Node.js    steps:

        uses: actions/setup-node@v3      - uses: actions/checkout@v3

        with:

          node-version: '18'      - name: Setup Node.js

              uses: actions/setup-node@v3

      - name: Install GreenLightCI CLI        with:

        run: npm install -g @greenlightci/cli          node-version: '18'



      - name: Run Baseline Check      - name: Install GreenLightCI CLI

        run: greenlightci check --json > baseline-report.json        run: npm install -g @greenlightci/cli

        env:

          GREENLIGHTCI_DASHBOARD_URL: ${{ secrets.GREENLIGHTCI_DASHBOARD_URL }}      - name: Run Baseline Check

          GREENLIGHTCI_API_KEY: ${{ secrets.GREENLIGHTCI_API_KEY }}        run: greenlightci check --json > baseline-report.json

              env:

      - name: Upload Report          GREENLIGHTCI_DASHBOARD_URL: ${{ secrets.GREENLIGHTCI_DASHBOARD_URL }}

        uses: actions/upload-artifact@v3          GREENLIGHTCI_API_KEY: ${{ secrets.GREENLIGHTCI_API_KEY }}

        with:

          name: baseline-report      - name: Upload Report

          path: baseline-report.json        uses: actions/upload-artifact@v3

```        with:

          name: baseline-report

**Note:** Add `GREENLIGHTCI_DASHBOARD_URL` and `GREENLIGHTCI_API_KEY` as repository secrets for dashboard integration.          path: baseline-report.json

````

## 📚 Related Packages

**Note:** Add `GREENLIGHTCI_DASHBOARD_URL` and `GREENLIGHTCI_API_KEY` as repository secrets for dashboard integration.

- **[@greenlightci/action](../action)** - GitHub Action for PR checks

- **[@greenlightci/dashboard](../dashboard)** - Web dashboard for tracking adoption## 📚 Related Packages

- **[@greenlightci/shared](../shared)** - Shared utilities and types

- **[@greenlightci/action](../action)** - GitHub Action for PR checks

## 📝 License- **[@greenlightci/dashboard](../dashboard)** - Web dashboard for tracking adoption

- **[@greenlightci/shared](../shared)** - Shared utilities and types

MIT

## 📝 License

## 🐛 Issues

MIT

Report issues on [GitHub](https://github.com/exprays/greenlightci/issues)

## 🐛 Issues

## 🙏 Credits

Report issues on [GitHub](https://github.com/exprays/greenlightci/issues)

Built with:

## 🙏 Credits

- [Commander.js](https://github.com/tj/commander.js) - CLI framework

- [Chalk](https://github.com/chalk/chalk) - Terminal colorsBuilt with:

- [Ora](https://github.com/sindresorhus/ora) - Terminal spinners

- [Chokidar](https://github.com/paulmillr/chokidar) - File watching- [Commander.js](https://github.com/tj/commander.js) - CLI framework

- [web-features](https://github.com/web-platform-dx/web-features) - Baseline data- [Chalk](https://github.com/chalk/chalk) - Terminal colors

- [Ora](https://github.com/sindresorhus/ora) - Terminal spinners

---- [Chokidar](https://github.com/paulmillr/chokidar) - File watching

- [web-features](https://github.com/web-platform-dx/web-features) - Baseline data

Made with ❤️ by Surya for the Baseline Tooling Hackathon

---

Made with ❤️ by Surya for the Baseline Tooling Hackathon
