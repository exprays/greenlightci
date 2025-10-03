# Example Workflows

This directory contains example GitHub Actions workflows for using GreenLightCI.

## Basic Usage

### 1. Standard Configuration (Recommended)

```yaml
name: Baseline Check
on: [pull_request]

jobs:
  baseline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: greenlightci/baseline-action@v1
        with:
          baseline-year: '2023'
          block-newly-available: false
          block-limited-availability: true
```

### 2. Strict Mode (Block All Non-Baseline)

```yaml
- uses: greenlightci/baseline-action@v1
  with:
    baseline-year: '2024'
    block-newly-available: true
    block-limited-availability: true
```

### 3. Informational Only (No Blocking)

```yaml
- uses: greenlightci/baseline-action@v1
  with:
    baseline-year: '2023'
    block-newly-available: false
    block-limited-availability: false
```

### 4. With Custom Browser Targets

```yaml
- uses: greenlightci/baseline-action@v1
  with:
    baseline-year: '2023'
    custom-browser-targets: |
      {
        "chrome": "110",
        "firefox": "109",
        "safari": "16.4",
        "edge": "110"
      }
```

## Configuration Options

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `baseline-year` | Target Baseline year | `'2023'` | No |
| `block-newly-available` | Block PRs with newly available features | `false` | No |
| `block-limited-availability` | Block PRs with limited availability | `true` | No |
| `github-token` | GitHub token for API access | `${{ github.token }}` | No |
| `custom-browser-targets` | Custom browser version requirements (JSON) | - | No |

## Outputs

The action provides the following outputs that can be used in subsequent steps:

| Output | Description | Example |
|--------|-------------|---------|
| `compatibility-score` | Overall score (0-100) | `87` |
| `features-detected` | Number of features found | `12` |
| `blocking-issues` | Number of blocking problems | `2` |

### Using Outputs

```yaml
- uses: greenlightci/baseline-action@v1
  id: baseline
  with:
    baseline-year: '2023'

- name: Comment on Score
  if: steps.baseline.outputs.compatibility-score < 80
  run: echo "Score is below threshold!"
```

## Integration Examples

### With Code Coverage

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Tests
        run: npm test
      
      - name: Check Baseline
        uses: greenlightci/baseline-action@v1
        with:
          baseline-year: '2023'
```

### With Build Step

```yaml
jobs:
  build-and-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Baseline Check
        uses: greenlightci/baseline-action@v1
```

### Multiple Configurations

```yaml
jobs:
  strict-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: greenlightci/baseline-action@v1
        with:
          baseline-year: '2024'
          block-newly-available: true
  
  lenient-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: greenlightci/baseline-action@v1
        with:
          baseline-year: '2022'
          block-newly-available: false
```

## Troubleshooting

### Action Fails to Run

- Ensure you're using the action in a `pull_request` event
- Verify the `github-token` has required permissions

### No Features Detected

- The action only scans changed files in the PR
- It looks for CSS and JavaScript features specifically
- Check if your file extensions are supported (.css, .js, .ts, .jsx, .tsx, .vue, .svelte)

### False Positives

- Some patterns may match unintended code
- Consider using custom browser targets for fine-tuned control
- Open an issue to improve detection patterns

## Support

For more examples and documentation, visit:
- [GitHub Repository](https://github.com/your-org/greenlightci)
- [Documentation](https://greenlightci.dev/docs)
- [Issue Tracker](https://github.com/your-org/greenlightci/issues)
