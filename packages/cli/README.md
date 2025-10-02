# CLI Package

Command-line tool for local Baseline compatibility checking.

## Structure

```
cli/
├── src/
│   ├── index.ts       # CLI entry point
│   ├── commands/      # Command implementations
│   ├── scanner.ts     # File scanning logic
│   └── reporter.ts    # Output formatting
├── bin/
│   └── greenlightci   # Executable script
└── package.json       # Dependencies
```

## Usage

```bash
# Install globally
npm install -g @greenlightci/cli

# Scan files
greenlightci scan ./src

# Watch mode
greenlightci watch ./src

# Check specific feature
greenlightci check "css-grid"
```
