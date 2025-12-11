# Task 025: Analytics Integration - Learning Guide

## What Was Developed

### Analytics System for ContPAQi AI Bridge
A flexible analytics integration supporting both Plausible Analytics (privacy-focused) and Google Analytics 4, with custom event tracking for business metrics.

## Why Was This Developed

### Business Intelligence
1. **User Behavior**: Understand how visitors navigate the site
2. **Conversion Tracking**: Measure CTA effectiveness
3. **Revenue Attribution**: Track which pages lead to purchases
4. **Feature Interest**: See which features attract attention

### Privacy Compliance
1. **GDPR**: Plausible doesn't require cookie consent
2. **User Trust**: Privacy-respecting analytics builds trust
3. **Simplicity**: No complex cookie banners needed

### Product Decisions
1. **A/B Testing**: Measure different approaches
2. **Feature Prioritization**: Focus on what users want
3. **Marketing ROI**: Track campaign effectiveness

## How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    RootLayout                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │            AnalyticsProvider                      │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │  Plausible Script  │  GA Script         │    │   │
│  │  │  (if configured)   │  (if configured)   │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │         PageViewTracker                  │    │   │
│  │  │  (tracks SPA navigation)                 │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  │                    ↓                             │   │
│  │              {children}                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Plausible Analytics

Plausible is a lightweight, privacy-focused alternative to Google Analytics:

```typescript
// Plausible script injection
<Script
  defer
  data-domain={PLAUSIBLE_DOMAIN}
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>
```

**Benefits:**
- No cookies = no consent banner needed
- ~1KB script size
- GDPR, CCPA, PECR compliant
- Open source

### Google Analytics 4

For users who prefer GA's full feature set:

```typescript
// GA4 initialization
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
```

**Features:**
- Enhanced measurement
- Predictive metrics
- BigQuery integration
- Detailed demographics

### Event Tracking Pattern

```typescript
// Generic event tracking
export function trackEvent(eventName: string, properties?: EventProperties) {
  if (!isBrowser) return;

  // Plausible
  if (isPlausibleEnabled && window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Google Analytics
  if (isGAEnabled && window.gtag) {
    window.gtag('event', eventName, properties);
  }
}
```

## Event Tracking Strategy

### Funnel Events

Track the user journey from landing to purchase:

```
Page Visit → CTA Click → Checkout Start → Purchase Complete
     ↓           ↓             ↓               ↓
trackPageView  trackCTAClick  trackCheckoutStart  trackPurchaseComplete
```

### Key Events to Track

| Event | When | Properties |
|-------|------|------------|
| `page_view` | Every page | path |
| `cta_click` | CTA button clicked | button, location |
| `checkout_start` | User starts checkout | plan, interval |
| `purchase_complete` | Payment succeeds | plan, value |
| `sign_up` | User registers | method |
| `demo_request` | Demo form submitted | - |
| `contact_submit` | Contact form sent | inquiry_type |
| `download_start` | Download initiated | version |

### Implementing Event Tracking

```tsx
// In a component
import { trackCTAClick } from '@/lib/analytics';

function HeroSection() {
  return (
    <button
      onClick={() => trackCTAClick('hero_get_started', 'hero')}
    >
      Get Started
    </button>
  );
}
```

## Next.js Integration

### Using next/script

Next.js provides optimized script loading:

```typescript
import Script from 'next/script';

// afterInteractive - loads after page is interactive
<Script src="..." strategy="afterInteractive" />

// lazyOnload - loads during idle time
<Script src="..." strategy="lazyOnload" />

// beforeInteractive - loads before page hydration
<Script src="..." strategy="beforeInteractive" />
```

### Page View Tracking with App Router

```typescript
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname, searchParams]);

  return null;
}

// Wrap in Suspense for useSearchParams
<Suspense fallback={null}>
  <PageViewTracker />
</Suspense>
```

## Privacy Best Practices

### 1. Use Plausible for EU Visitors
Plausible doesn't use cookies, making it GDPR-compliant without consent.

### 2. Avoid Collecting PII
```typescript
// DON'T do this
trackEvent('signup', { email: user.email }); // ❌

// DO this instead
trackEvent('signup', { method: 'email' }); // ✅
```

### 3. Respect Do Not Track
```typescript
const doNotTrack =
  navigator.doNotTrack === '1' ||
  window.doNotTrack === '1';

if (!doNotTrack) {
  trackEvent('...');
}
```

### 4. Provide Opt-Out
```typescript
// Store user preference
localStorage.setItem('analytics-opt-out', 'true');

// Check before tracking
if (localStorage.getItem('analytics-opt-out') !== 'true') {
  trackEvent('...');
}
```

## Configuration

### Environment Variables

```env
# Choose one or both:

# Plausible (recommended)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Development vs Production

In development, events are logged to console:
```
[Analytics] Event: cta_click { button: 'hero', location: 'homepage' }
```

In production, events are sent to analytics providers.

## Testing Analytics

### Manual Testing
1. Open browser DevTools → Network tab
2. Filter by "plausible" or "google"
3. Trigger events and verify requests

### Plausible Debug Mode
```html
<script data-domain="..." src="...script.js?debug=true"></script>
```

### GA Debug Mode
Use [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension.

## Key Concepts Learned

### 1. Script Loading Strategies
- `afterInteractive` for analytics (doesn't block rendering)
- Scripts load after React hydration

### 2. Environment-Based Configuration
- Use `NEXT_PUBLIC_` prefix for client-side env vars
- Check for undefined before using

### 3. TypeScript Global Types
```typescript
declare global {
  interface Window {
    plausible?: (...) => void;
    gtag?: (...) => void;
  }
}
```

### 4. Server vs Client Code
- Check `typeof window !== 'undefined'`
- Analytics only runs on client side

## Related Tasks
- **Task 23**: Public Assets (AnalyticsProvider needs assets)
- **Task 28**: Production Deployment (verify analytics in production)

## Resources
- [Plausible Documentation](https://plausible.io/docs)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Script Component](https://nextjs.org/docs/basic-features/script)
- [GDPR and Analytics](https://plausible.io/blog/google-analytics-gdpr)
