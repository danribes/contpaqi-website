# Task 030: CI/CD Pipeline - Learning Guide

## Overview
This guide explains how to set up Continuous Integration and Continuous Deployment (CI/CD) pipelines using GitHub Actions for Next.js applications.

## GitHub Actions Basics

### Workflow Structure
```yaml
name: CI                    # Workflow name
on: [push, pull_request]    # Triggers
jobs:                       # Job definitions
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
```

### Key Concepts

| Term | Description |
|------|-------------|
| Workflow | Automated process defined in YAML |
| Job | Group of steps that run on same runner |
| Step | Individual task within a job |
| Action | Reusable unit (e.g., `actions/checkout`) |
| Runner | Server that executes workflows |

## Common Triggers

### Push Events
```yaml
on:
  push:
    branches: [main, develop]
    paths:
      - 'src/**'
      - 'package.json'
```

### Pull Request Events
```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### Scheduled Events
```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
```

## Job Dependencies

### Sequential Jobs
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: test  # Runs after test completes
    runs-on: ubuntu-latest
    steps: [...]
```

### Parallel Jobs
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
  test:
    runs-on: ubuntu-latest
  # Both run simultaneously
```

### Multiple Dependencies
```yaml
build:
  needs: [lint, test, typecheck]
  # Runs after ALL dependencies complete
```

## Caching Dependencies

### npm Cache
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

### Custom Cache
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

## Environment Variables

### Workflow-Level
```yaml
env:
  NODE_VERSION: '20'
  CI: true
```

### Job-Level
```yaml
jobs:
  build:
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Step-Level
```yaml
- name: Build
  run: npm run build
  env:
    NEXT_PUBLIC_API_URL: 'https://api.example.com'
```

## Secrets Management

### Storing Secrets
1. Go to Repository → Settings → Secrets → Actions
2. Click "New repository secret"
3. Enter name and value

### Using Secrets
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

### Required Secrets for This Project
- `VERCEL_TOKEN` - For deployment
- `VERCEL_ORG_ID` - Vercel organization
- `VERCEL_PROJECT_ID` - Vercel project

## Matrix Builds

### Test Multiple Node Versions
```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### Test Multiple OS
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
runs-on: ${{ matrix.os }}
```

## Common Actions

### Checkout
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Full history for tags
```

### Setup Node.js
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: 'https://registry.npmjs.org'
```

### Upload Artifacts
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: .next/
```

### Download Artifacts
```yaml
- uses: actions/download-artifact@v4
  with:
    name: build
```

## Status Badges

### Basic Badge
```markdown
![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)
```

### With Branch
```markdown
![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg?branch=main)
```

### Clickable Badge
```markdown
[![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/owner/repo/actions/workflows/ci.yml)
```

## Vercel Integration

### Automatic Deployments
Vercel automatically deploys when connected to GitHub:
- Push to main → Production deploy
- PR → Preview deploy

### Manual Deployment with GitHub Actions
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

## Best Practices

### 1. Fail Fast
```yaml
strategy:
  fail-fast: true
```

### 2. Timeout Limits
```yaml
jobs:
  build:
    timeout-minutes: 15
```

### 3. Concurrency Control
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 4. Conditional Execution
```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

## Debugging

### Enable Debug Logging
Set repository secret: `ACTIONS_RUNNER_DEBUG` = `true`

### View Logs
1. Go to Actions tab
2. Select workflow run
3. Click job name
4. Expand step logs

### Common Issues
1. **Cache miss**: Check cache key patterns
2. **Permission denied**: Check repository settings
3. **Timeout**: Increase timeout-minutes
4. **Secret not found**: Verify secret name spelling

## Related Resources
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
