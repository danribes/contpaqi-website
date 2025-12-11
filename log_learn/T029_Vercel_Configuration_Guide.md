# Task 029: Vercel Configuration - Learning Guide

## Overview
This guide explains Vercel deployment configuration for Next.js applications, covering security headers, cron jobs, function timeouts, and optimization.

## vercel.json Structure

### Basic Configuration
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

**Schema**: Provides IDE autocompletion
**Framework**: Auto-detected but can be explicit
**Regions**: Choose closest to your users/services

### Available Regions
| Code | Location |
|------|----------|
| `iad1` | US East (Washington DC) |
| `sfo1` | US West (San Francisco) |
| `cdg1` | Europe (Paris) |
| `hnd1` | Asia (Tokyo) |

## Security Headers

### Essential Headers
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
      ]
    }
  ]
}
```

### Header Explanations
| Header | Purpose |
|--------|---------|
| X-Frame-Options | Prevents clickjacking |
| X-Content-Type-Options | Prevents MIME sniffing |
| Referrer-Policy | Controls referrer information |
| HSTS | Forces HTTPS connections |
| Permissions-Policy | Restricts browser features |

## Cron Jobs

### Configuration
```json
{
  "crons": [
    {
      "path": "/api/cron/task-name",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### Schedule Format (Cron Syntax)
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6)
│ │ │ │ │
* * * * *
```

### Common Schedules
| Schedule | Meaning |
|----------|---------|
| `0 * * * *` | Every hour |
| `0 6 * * *` | Daily at 6 AM |
| `0 0 * * 0` | Weekly on Sunday |
| `0 0 1 * *` | Monthly on 1st |

### Securing Cron Endpoints
```typescript
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ... cron logic
}
```

## Function Configuration

### Timeout Settings
```json
{
  "functions": {
    "src/app/api/**/*": {
      "maxDuration": 30
    },
    "src/app/api/webhooks/**/*": {
      "maxDuration": 60
    }
  }
}
```

### Vercel Plan Limits
| Plan | Max Duration |
|------|--------------|
| Hobby | 10 seconds |
| Pro | 60 seconds |
| Enterprise | 900 seconds |

### Best Practices
- Keep API routes under 10s when possible
- Use 60s for webhooks and background tasks
- Consider Edge Functions for faster response

## Cache Headers

### Static Assets
```json
{
  "source": "/(.*).js",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
  ]
}
```

### API Routes (No Cache)
```json
{
  "source": "/api/(.*)",
  "headers": [
    { "key": "Cache-Control", "value": "no-store, no-cache, must-revalidate" }
  ]
}
```

## Redirects

### Permanent (301)
```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

### Temporary (307)
```json
{
  "source": "/temp",
  "destination": "/other",
  "permanent": false
}
```

### With Parameters
```json
{
  "source": "/blog/:slug",
  "destination": "/posts/:slug",
  "permanent": true
}
```

## Environment Variables

### In Vercel Dashboard
1. Go to Project Settings → Environment Variables
2. Add variables for each environment (Production, Preview, Development)
3. Use `NEXT_PUBLIC_` prefix for client-side variables

### Accessing in vercel.json
Environment variables are not directly accessible in vercel.json.
Use runtime environment variables in your code instead.

## Deployment Workflow

### Git Integration
1. Connect repository to Vercel
2. Push to main → Production deploy
3. Push to branch → Preview deploy

### Manual Deploy
```bash
# Install CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Debugging

### View Build Logs
- Vercel Dashboard → Deployments → Select deployment → Build Logs

### Function Logs
- Vercel Dashboard → Functions → View logs

### Common Issues
1. **Build fails**: Check for missing env vars
2. **Function timeout**: Increase maxDuration
3. **404 on routes**: Check rewrites/redirects

## Related Resources
- [Vercel Documentation](https://vercel.com/docs)
- [vercel.json Reference](https://vercel.com/docs/project-configuration)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
