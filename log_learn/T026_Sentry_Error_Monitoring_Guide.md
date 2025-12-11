# Task 026: Sentry Error Monitoring - Learning Guide

## What Was Developed

### Error Monitoring System for ContPAQi AI Bridge
A comprehensive error tracking and monitoring system using Sentry, including client-side and server-side error capture, session replay, and performance monitoring.

## Why Was This Developed

### Production Reliability
1. **Error Visibility**: See errors as they happen in production
2. **Stack Traces**: Full context for debugging
3. **User Impact**: Understand which errors affect users most
4. **Performance**: Track slow pages and API routes

### Business Value
1. **Faster Resolution**: Find and fix bugs quickly
2. **User Experience**: Address issues before users complain
3. **Proactive Monitoring**: Get alerts for new errors
4. **Release Confidence**: Verify deployments don't introduce bugs

## How It Works

### Sentry Architecture in Next.js

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              sentry.client.config.ts                 │   │
│  │  - Captures JS errors                                │   │
│  │  - Records user sessions                             │   │
│  │  - Tracks performance                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              /monitoring (tunnel)                    │   │
│  │  - Bypasses ad blockers                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Sentry Server                            │
│  - Aggregates errors                                         │
│  - Groups similar issues                                     │
│  - Sends alerts                                              │
│  - Provides dashboard                                        │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Server                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              sentry.server.config.ts                 │   │
│  │  - Captures server errors                            │   │
│  │  - Tracks API route performance                      │   │
│  │  - Logs unhandled rejections                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Client Configuration

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  enabled: process.env.NODE_ENV === 'production',
});
```

### Server Configuration

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1,
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ['error'],
    }),
  ],
  enabled: process.env.NODE_ENV === 'production',
});
```

### Error Boundary Pattern

React Error Boundaries catch JavaScript errors in component trees:

```typescript
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.withScope((scope) => {
      scope.setExtra('componentStack', errorInfo.componentStack);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

### Global Error Handler

Next.js App Router requires a `global-error.tsx` for root-level errors:

```typescript
'use client';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h1>Something went wrong</h1>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

## Key Features

### 1. Session Replay
Records user sessions to see exactly what happened before an error:

```typescript
Sentry.replayIntegration({
  maskAllText: true,  // Privacy: hide text content
  blockAllMedia: true, // Privacy: block images/videos
})
```

### 2. Performance Monitoring
Track slow pages and API routes:

```typescript
tracesSampleRate: 1, // 100% of transactions
```

### 3. Source Maps
Upload source maps for readable stack traces:

```javascript
// next.config.js
widenClientFileUpload: true,
hideSourceMaps: true,
```

### 4. Ad-Blocker Bypass
Route through your own domain:

```javascript
tunnelRoute: '/monitoring',
```

### 5. Ignored Errors
Filter out noise:

```typescript
ignoreErrors: [
  /extensions\//i,
  'Network request failed',
  'AbortError',
]
```

## Environment Setup

### Development
```env
# Not needed - Sentry disabled in development
```

### Production
```env
# Required for error capture
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"

# Required for source map uploads
SENTRY_AUTH_TOKEN="sntrys_xxx"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
```

## Best Practices

### 1. Sample Rates
```typescript
// Development: 100% for debugging
// Production: Lower for high-traffic sites
tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
```

### 2. Error Context
Add context to help debugging:

```typescript
Sentry.setUser({ id: userId, email: userEmail });
Sentry.setTag('page', pageName);
Sentry.setContext('order', { orderId, amount });
```

### 3. Breadcrumbs
Track user actions leading to error:

```typescript
Sentry.addBreadcrumb({
  category: 'ui',
  message: 'User clicked checkout button',
  level: 'info',
});
```

### 4. Release Tracking
Tag errors with release version:

```typescript
Sentry.init({
  release: process.env.VERCEL_GIT_COMMIT_SHA,
});
```

## Testing Sentry

### Trigger Test Error
```typescript
// Add to a test page
<button onClick={() => {
  throw new Error('Test Sentry Error');
}}>
  Test Sentry
</button>
```

### Verify in Dashboard
1. Go to Sentry dashboard
2. Check Issues tab for new error
3. Verify stack trace is readable
4. Check session replay if enabled

## Instrumentation File

Next.js 14 uses `instrumentation.ts` for server initialization:

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.server.config');
  }
}
```

## Key Concepts Learned

### 1. Client vs Server Config
- Client: Browser errors, user sessions
- Server: API errors, SSR errors

### 2. Webpack Plugin Integration
```javascript
module.exports = withSentryConfig(nextConfig, sentryOptions);
```

### 3. Error Boundaries in React
- Class components only
- Catch errors in child component tree
- Don't catch errors in event handlers

### 4. Global Error Handler
- Must be a Client Component
- Must include own `<html>` and `<body>`
- Catches errors not caught by other boundaries

## Related Tasks
- **Task 25**: Analytics (complementary monitoring)
- **Task 28**: Production Deployment (verify Sentry works)

## Resources
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
