# 🚀 GreenLightCI

**Baseline Tooling Hackathon Project** - CI/CD Compatibility Checker for Web Features

[![Hackathon](https://img.shields.io/badge/Hackathon-Baseline%20Tooling-green)](https://devpost.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 **Vision**

GreenLightCI eliminates the guesswork around web feature compatibility by integrating [Baseline](https://web.dev/baseline/) data directly into your development workflow. No more jumping between MDN, caniuse.com, and blog posts - get instant, actionable compatibility insights right in your PRs.

## ✨ **What We're Building**

### 🤖 **GitHub Action** (Core MVP)

- **Real-time PR Analysis**: Automatically scans PR diffs for web features
- **Baseline Integration**: Checks compatibility via `web-features` npm package
- **Smart Comments**: Adds detailed compatibility insights to PR discussions
- **Configurable Blocking**: Optional merge blocking for risky features
- **Custom Targets**: Support for specific browser/year requirements

### 📊 **Dashboard** (Analytics & Tracking)

- **Adoption Tracking**: Visualize Baseline feature adoption over time
- **Repository Insights**: Compatibility scores and trend analysis
- **Team Analytics**: Track your team's modernization progress
- **Export Reports**: Generate compatibility reports for stakeholders

### 🛠️ **CLI Tool** (Local Development)

- **Pre-commit Checks**: Run the same analysis locally before pushing
- **Watch Mode**: Continuous monitoring during development
- **Rich Output**: Beautiful terminal UI with actionable insights
- **IDE Integration**: Easy integration with existing workflows

## 🚀 **Quick Start**

### GitHub Action

```yaml
name: Baseline Compatibility Check
on: [pull_request]

jobs:
  baseline-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: greenlightci/baseline-action@v1
        with:
          baseline-year: "2023"
          block-newly-available: false
```

### CLI Tool

```bash
npm install -g @greenlightci/cli
npx greenlightci scan ./src
npx greenlightci watch
```

## 🏗️ **Development Status**

This project is being developed as part of the **Baseline Tooling Hackathon** with a 4-day sprint approach:

- **Day 1**: Core GitHub Action MVP ⏳
- **Day 2**: Enhanced Action + CLI Tool
- **Day 3**: Dashboard & Analytics
- **Day 4**: Integration, Testing & Deployment

See [phases.md](./phases.md) for detailed development timeline.

## 🛠️ **Tech Stack**

| Component         | Technology              | Purpose                    |
| ----------------- | ----------------------- | -------------------------- |
| **GitHub Action** | Node.js + TypeScript    | PR analysis & commenting   |
| **Dashboard**     | Next.js 14 + TypeScript | Analytics & visualization  |
| **CLI Tool**      | Node.js + Commander.js  | Local development checks   |
| **Database**      | SQLite/PostgreSQL       | Usage tracking & analytics |
| **Deployment**    | Vercel + GitHub Actions | Automated CI/CD pipeline   |

## 📁 **Project Structure**

```
greenlightci/
├── packages/
│   ├── action/          # GitHub Action package
│   ├── dashboard/       # Next.js dashboard
│   ├── cli/            # CLI tool package
│   └── shared/         # Shared utilities
├── docs/               # Documentation
├── examples/           # Demo repositories
└── phases.md          # Development timeline
```

## 🤝 **Contributing**

This is a hackathon project with an aggressive timeline, but we welcome:

- Bug reports and feature suggestions
- Documentation improvements
- Testing and feedback on early releases

## 📝 **License**

MIT License - see [LICENSE](./LICENSE) for details.

## 🏆 **Hackathon Details**

**Event**: [Baseline Tooling Hackathon](https://devpost.com)  
**Submission Deadline**: 4 days from project start ( halted due to some issues )
**Team**: [thethousandsunny]

---

_Built with ❤️ for the Baseline Tooling Hackathon - helping developers confidently adopt modern web features._
