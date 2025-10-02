# GitHub Action Package

This package contains the core GitHub Action for baseline compatibility checking.

## Structure

```
action/
├── src/
│   ├── index.ts        # Main action entry point
│   ├── parser.ts       # Diff parsing logic
│   ├── baseline.ts     # Baseline data integration
│   └── github.ts       # GitHub API interactions
├── tests/
│   └── *.test.ts       # Unit tests
├── action.yml          # GitHub Action configuration
└── package.json        # Package dependencies
```

## Development

```bash
cd packages/action
pnpm install
pnpm dev
pnpm test
```