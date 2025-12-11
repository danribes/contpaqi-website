# Task 033: Production Build Verification - Learning Guide

## Overview
This guide explains how to verify a Next.js application is ready for production deployment.

## Build Verification Checklist

### 1. Production Build
```bash
npm run build
```

Should complete without errors. Watch for:
- TypeScript compilation errors
- Missing dependencies
- Invalid imports

### 2. Linting
```bash
npm run lint
```

Ensures code quality and consistency.

### 3. Type Checking
```bash
npm run typecheck
# or
tsc --noEmit
```

Verifies TypeScript types are correct.

### 4. Testing
```bash
npm run test:run
```

All tests should pass.

## Key Configuration Files

### package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true
  }
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration
};

module.exports = nextConfig;
```

## Build Output Analysis

### Understanding Route Types
```
┌ ○ /                    - Static (prerendered)
├ ƒ /api/contact         - Dynamic (server-rendered)
```

- `○` Static: Built at compile time
- `ƒ` Dynamic: Rendered on each request

### Bundle Size
First Load JS should be reasonable:
- Shared: < 200 kB
- Per-page: < 50 kB

## Common Build Issues

### 1. Missing Environment Variables
```
Error: Environment variable not found: DATABASE_URL
```
**Solution**: Set required env vars or use fallbacks

### 2. TypeScript Errors
```
Type 'X' is not assignable to type 'Y'
```
**Solution**: Fix type mismatches

### 3. Import Errors
```
Module not found: Can't resolve '@/lib/something'
```
**Solution**: Check path aliases in tsconfig.json

### 4. Dynamic Server Usage
```
Route couldn't be rendered statically because it used headers
```
**Solution**: Expected for dynamic routes; no action needed

## Production Readiness Checklist

### Code Quality
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] All tests pass
- [ ] No console.log statements

### Configuration
- [ ] vercel.json is valid JSON
- [ ] Security headers configured
- [ ] Environment variables documented
- [ ] .gitignore excludes .env files

### Documentation
- [ ] README.md exists
- [ ] DEPLOYMENT.md exists
- [ ] API endpoints documented

### SEO
- [ ] sitemap.xml configured
- [ ] robots.txt configured
- [ ] Meta tags set
- [ ] OG images present

### Security
- [ ] X-Frame-Options header
- [ ] HSTS header
- [ ] No exposed secrets
- [ ] API routes protected

### Error Handling
- [ ] Global error page exists
- [ ] Error monitoring configured
- [ ] 404 page works

## Automated Verification

Create tests to verify production readiness:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Production Build Configuration', () => {
  it('should have build script', () => {
    const pkg = require('../package.json');
    expect(pkg.scripts.build).toBeDefined();
  });

  it('should have vercel.json', () => {
    expect(fs.existsSync('vercel.json')).toBe(true);
  });

  it('should have security headers', () => {
    const vercel = require('../vercel.json');
    const headersStr = JSON.stringify(vercel.headers);
    expect(headersStr).toContain('X-Frame-Options');
  });
});
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build
```

## Bundle Analysis

### Check Bundle Size
```bash
npm run build
# Check output for sizes
```

### Analyze Bundle
```bash
ANALYZE=true npm run build
```

## Performance Optimization

### Static Generation
Use static generation where possible:
```typescript
export async function generateStaticParams() {
  return [/* params */];
}
```

### Dynamic Imports
```typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <p>Loading...</p>,
});
```

## Related Resources
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Build Configuration](https://vercel.com/docs/build-step)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
