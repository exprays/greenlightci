# 🚀 Final Integration & Deployment Plan

## Current Status: ✅ Local Development Working

All components are working locally. Now we need to:

1. Deploy all three components
2. Integrate them together
3. Test end-to-end workflow
4. Verify real-world scenarios

---

## 📋 Phase 1: Deploy Dashboard (Priority: HIGH)

### Step 1.1: Prepare Dashboard for Production

**Current Location**: `f:\Hackathons\baselinetooling\greenlightci\dashboard`

```bash
cd f:\Hackathons\baselinetooling\greenlightci\dashboard

# Generate Prisma client
npm run prisma:generate

# Test production build locally
npm run build

# If build succeeds, you're ready to deploy
```

### Step 1.2: Deploy to Vercel

**Option A: Via CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (make sure you're in dashboard directory)
cd f:\Hackathons\baselinetooling\greenlightci\dashboard
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: greenlightci-dashboard
# - Confirm settings

# Deploy to production
vercel --prod
```

**Option B: Via GitHub + Vercel Dashboard**

1. Create a new GitHub repository for the dashboard
2. Push the dashboard code:
   ```bash
   cd f:\Hackathons\baselinetooling\greenlightci\dashboard
   git init
   git add .
   git commit -m "Initial dashboard deployment"
   gh repo create greenlightci-dashboard --public --source=. --push
   ```
3. Go to https://vercel.com/new
4. Import the repository
5. Vercel auto-detects Next.js
6. Click Deploy

### Step 1.3: Configure Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_9WjrzIG3hcwC@ep-orange-mountain-add2ajgi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate-new-secret>
GITHUB_ID=Iv23li4jHfc0aNhmP2HF
GITHUB_SECRET=<your-github-secret>
API_SECRET_KEY=<generate-new-secret>
```

**Generate Secrets:**

```bash
# PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Min 0 -Max 256}))
```

### Step 1.4: Update GitHub OAuth Callback URL

1. Go to https://github.com/settings/developers
2. Click on your OAuth App (GreenLightCI Dashboard)
3. Update **Authorization callback URL** to:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```

### Step 1.5: Run Database Migrations

```bash
# Pull environment variables from Vercel
vercel env pull .env.production

# Run migrations
npm run prisma:deploy
```

### Step 1.6: Test Dashboard

- ✅ Visit your Vercel URL
- ✅ Sign in with GitHub
- ✅ Verify dashboard loads
- ✅ Check that database is connected

---

## 📋 Phase 2: Prepare & Deploy GitHub Action

### Step 2.1: Create Standalone Action Repository

```bash
# Navigate to action directory
cd f:\Hackathons\baselinetooling\greenlightci\packages\action

# Copy to standalone location
cd ..\..\..
mkdir greenlightci-action
cd greenlightci-action

# Copy action files
xcopy /E /I /Y "f:\Hackathons\baselinetooling\greenlightci\packages\action\src" "src"
xcopy /E /I /Y "f:\Hackathons\baselinetooling\greenlightci\packages\action\dist" "dist"
copy "f:\Hackathons\baselinetooling\greenlightci\packages\action\action.yml" "action.yml"
copy "f:\Hackathons\baselinetooling\greenlightci\packages\action\package.json" "package.json"
copy "f:\Hackathons\baselinetooling\greenlightci\packages\action\tsconfig.json" "tsconfig.json"
copy "f:\Hackathons\baselinetooling\greenlightci\packages\action\README.md" "README.md"
copy "f:\Hackathons\baselinetooling\greenlightci\.gitignore" ".gitignore"
```

### Step 2.2: Copy Shared Dependencies

```bash
# Create shared folder in action
mkdir src\shared
xcopy /E /I /Y "f:\Hackathons\baselinetooling\greenlightci\packages\shared\src\*" "src\shared"
```

### Step 2.3: Update Import Paths

Update these files to use local shared code instead of workspace:

**src/index.ts**:

```typescript
// Change:
import { ... } from '@greenlightci/shared';
// To:
import { ... } from './shared/index.js';
```

**src/parser.ts** & **src/github.ts**: Same change

### Step 2.4: Build & Test

```bash
npm install
npm run build

# Verify dist/index.js exists and is compiled
```

### Step 2.5: Publish to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "feat: GreenLightCI GitHub Action v1.0.0"

# Create GitHub repo
gh repo create greenlightci-action --public --source=. --push

# Create release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Step 2.6: Test Action in a Sample Repository

Create a test repository with this workflow:

`.github/workflows/baseline-check.yml`:

```yaml
name: Baseline Check
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      statuses: write
    steps:
      - uses: actions/checkout@v4

      - name: Baseline Compatibility Check
        uses: your-username/greenlightci-action@v1.0.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          baseline-year: "2023"
          block-newly-available: false
          block-limited-availability: true
```

---

## 📋 Phase 3: Prepare & Deploy CLI Tool

### Step 3.1: Create Standalone CLI Repository

```bash
cd f:\Hackathons\baselinetooling

mkdir greenlightci-cli
cd greenlightci-cli

# Copy CLI files
xcopy /E /I /Y "f:\Hackathons\baselinetooling\greenlightci\packages\cli\src" "src"
xcopy /E /I /Y "f:\Hackathons\baselinetooling\greenlightci\packages\cli\bin" "bin"
copy "f:\Hackathons\baselinetooling\greenlightci\packages\cli\package.json" "package.json"
copy "f:\Hackathons\baselinetooling\greenlightci\packages\cli\tsconfig.json" "tsconfig.json"
copy "f:\Hackathons\baselinetooling\greenlightci\packages\cli\README.md" "README.md"
copy "f:\Hackathons\baselinetooling\greenlightci\.gitignore" ".gitignore"
```

### Step 3.2: Copy Shared Dependencies

```bash
mkdir src\shared
xcopy /E /I /Y "f:\Hackathons\baselinetooling\greenlightci\packages\shared\src\*" "src\shared"
```

### Step 3.3: Update Import Paths

In all CLI files, change:

```typescript
// From:
import { ... } from '@greenlightci/shared';
// To:
import { ... } from './shared/index.js';
```

### Step 3.4: Update package.json

Change the name to be publishable:

```json
{
  "name": "@your-username/greenlightci",
  "version": "1.0.0",
  ...
}
```

### Step 3.5: Build & Test Locally

```bash
npm install
npm run build

# Test locally
npm link
greenlightci --help
greenlightci scan .
```

### Step 3.6: Publish to npm (Optional)

```bash
npm login
npm publish --access public
```

Or keep it as a local tool for now.

---

## 📋 Phase 4: Full Integration (Action + Dashboard)

### Step 4.1: Update Action to Send Data to Dashboard

The action already has dashboard integration code. Just need to configure it.

### Step 4.2: Configure Repository Secrets

In any repository where you want to use the action:

**GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

```
DASHBOARD_URL=https://your-app.vercel.app
DASHBOARD_API_KEY=157de469bcd3175118ed7a19708984a531f4460844eda43f6af1fd7b862ca567
```

### Step 4.3: Update Workflow to Include Dashboard Reporting

```yaml
- name: Baseline Compatibility Check
  uses: your-username/greenlightci-action@v1.0.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    baseline-year: "2023"
    block-newly-available: false
    block-limited-availability: true
    # Add dashboard integration
    dashboard-url: ${{ secrets.DASHBOARD_URL }}
    dashboard-api-key: ${{ secrets.DASHBOARD_API_KEY }}
```

---

## 📋 Phase 5: Working API Features in Dashboard

### Step 5.1: Verify API Endpoints

Test these endpoints after deployment:

```bash
# Test stats endpoint
curl https://your-app.vercel.app/api/stats

# Test projects endpoint
curl https://your-app.vercel.app/api/projects

# Test trends endpoint
curl https://your-app.vercel.app/api/trends?days=30

# Test scans submission (with API key)
curl -X POST https://your-app.vercel.app/api/scans \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"project": {...}, "scan": {...}, "files": [], "features": []}'
```

### Step 5.2: Fix Any API Issues

If APIs aren't working:

1. Check Vercel logs: Vercel Dashboard → Your Project → Logs
2. Verify environment variables are set
3. Check database connection
4. Test locally first with `npm run dev`

---

## 📋 Phase 6: Real-World Testing

### Test Scenario 1: Sample Repository with Web Features

Create a test repo with files using web features:

**test.js**:

```javascript
// Uses CSS Grid (widely available)
element.style.display = "grid";

// Uses CSS Container Queries (newly available)
const containerQuery = "@container (min-width: 400px)";

// Uses :has() selector (limited availability)
document.querySelector("div:has(> span)");
```

**Create PR and test:**

1. Create branch with changes
2. Open PR
3. Action should run
4. Check PR comments for compatibility report
5. Check dashboard for scan data

### Test Scenario 2: Real Project Integration

1. Pick an actual repository you work on
2. Add the GitHub Action workflow
3. Create a PR with real changes
4. Verify action runs successfully
5. Check dashboard shows data

### Test Scenario 3: CLI Local Testing

```bash
# In any project directory
greenlightci scan .

# Check specific files
greenlightci scan src/

# Watch mode
greenlightci watch src/
```

---

## 📊 Success Criteria Checklist

### Dashboard ✅

- [ ] Deployed to Vercel successfully
- [ ] GitHub OAuth working
- [ ] Can sign in and see dashboard
- [ ] Database connected (Neon)
- [ ] All pages load without errors
- [ ] Charts display (even with no data)

### GitHub Action ✅

- [ ] Published to GitHub
- [ ] Tagged as v1.0.0
- [ ] Can be used in workflows
- [ ] Detects web features in PRs
- [ ] Posts comments on PRs
- [ ] Sends data to dashboard
- [ ] Sets appropriate status checks

### CLI Tool ✅

- [ ] Builds successfully
- [ ] Can run locally with `npm link`
- [ ] Scans files for web features
- [ ] Outputs compatibility information
- [ ] Watch mode works

### Integration ✅

- [ ] Action sends data to dashboard API
- [ ] Dashboard receives and stores scan data
- [ ] Dashboard displays scan history
- [ ] Trends charts populate with data
- [ ] Projects page shows scanned repositories

### End-to-End ✅

- [ ] Create PR → Action runs → Dashboard updates
- [ ] Multiple scans create trend data
- [ ] Charts visualize data correctly
- [ ] Can export data (if implemented)
- [ ] Performance is acceptable

---

## 🚀 Quick Start Commands

### Deploy Dashboard

```bash
cd f:\Hackathons\baselinetooling\greenlightci\dashboard
vercel --prod
```

### Publish Action

```bash
cd f:\Hackathons\baselinetooling\greenlightci-action
git init && git add . && git commit -m "Initial commit"
gh repo create greenlightci-action --public --source=. --push
git tag v1.0.0 && git push origin v1.0.0
```

### Test CLI

```bash
cd f:\Hackathons\baselinetooling\greenlightci-cli
npm install && npm run build && npm link
greenlightci scan .
```

---

## 📝 Notes

- **Priority Order**: Dashboard → Action → CLI → Integration → Testing
- **Time Estimate**: 2-3 hours for full deployment and testing
- **Blockers**: Make sure to update GitHub OAuth callback URL after dashboard deployment
- **API Key**: Use the same API key in both dashboard env and GitHub secrets

---

## 🆘 Troubleshooting

### Dashboard won't deploy

- Check Vercel build logs
- Verify all environment variables are set
- Test build locally first: `npm run build`

### Action not working

- Check workflow permissions (needs `pull-requests: write`)
- Verify action is public on GitHub
- Check action logs in GitHub Actions tab

### Dashboard API not receiving data

- Verify API_SECRET_KEY matches between dashboard and action
- Check Vercel logs for API errors
- Test API endpoint with curl

---

**Ready to start? Let's begin with Phase 1: Deploy Dashboard!** 🚀
