# Task 028: Production Deployment - Learning Guide

## Overview
This guide covers deployment verification for a Next.js SaaS application, ensuring all systems are properly configured before going live.

## Deployment Checklist Approach

### Why Verification Tests?
Instead of manual checklists, automated tests provide:
- **Consistency**: Same checks every time
- **CI/CD Integration**: Catch issues before deploy
- **Documentation**: Tests document requirements
- **Regression Prevention**: Ensure nothing breaks

### Test Structure
```typescript
describe('Deployment Verification', () => {
  describe('Category', () => {
    it('should have required feature', () => {
      const filePath = path.join(rootDir, 'path/to/file');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
```

## Key Verification Categories

### 1. Environment Configuration
Essential environment variables for production:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="generated-secret"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# Application
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 2. SEO Requirements
Essential files for search engine visibility:

```
src/app/
├── sitemap.ts      # Dynamic sitemap generation
├── robots.ts       # Crawler instructions
public/
├── favicon.ico     # Browser tab icon
├── images/
│   └── og-image.png  # Social sharing image
```

### 3. Page Structure
Standard SaaS page requirements:

```
Marketing Pages:
├── / (homepage)
├── /features
├── /pricing
├── /download
├── /contact
├── /terms
├── /privacy
└── /refunds

Auth Pages:
├── /auth/login
├── /auth/register
└── /auth/forgot-password

Portal Pages:
├── /portal (dashboard)
└── /portal/licenses

Checkout Pages:
├── /checkout
├── /checkout/success
└── /checkout/cancel
```

### 4. API Structure
Required API endpoints:

```
src/app/api/
├── auth/[...nextauth]/route.ts  # Authentication
├── checkout/route.ts            # Payment initiation
├── webhooks/stripe/route.ts     # Payment confirmation
├── contact/route.ts             # Contact form
├── downloads/route.ts           # File downloads
└── license/                     # License management
    ├── activate/route.ts
    ├── deactivate/route.ts
    └── status/route.ts
```

## Pre-Deployment Checklist

### Infrastructure
- [ ] Database provisioned (PostgreSQL)
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] CDN configured (Vercel handles this)

### Third-Party Services
- [ ] Stripe account verified
- [ ] Stripe products/prices created
- [ ] Stripe webhook configured
- [ ] Resend domain verified
- [ ] Sentry project created
- [ ] Analytics configured

### Code Verification
- [ ] All tests passing
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] Environment variables documented

### Security
- [ ] .env files gitignored
- [ ] API keys not exposed
- [ ] CORS configured
- [ ] Rate limiting in place
- [ ] Input validation active

## Vercel Deployment

### Project Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... repeat for all variables
```

### Deployment Commands
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Post-Deployment Verification
1. Check homepage loads
2. Test authentication flow
3. Complete test purchase (Stripe test mode)
4. Verify email delivery
5. Check error tracking (Sentry)
6. Validate analytics events

## Common Issues and Solutions

### Issue: Build fails with missing env vars
**Solution**: Ensure all `NEXT_PUBLIC_*` vars are set in Vercel

### Issue: Database connection timeout
**Solution**: Use connection pooling (PgBouncer or Prisma Data Proxy)

### Issue: Webhook signature verification fails
**Solution**: Use raw body in webhook handler, verify secret is correct

### Issue: Emails not delivering
**Solution**: Verify domain DNS settings in Resend dashboard

### Issue: Images not loading
**Solution**: Add domain to next.config.js `images.remotePatterns`

## Monitoring After Launch

### Error Tracking (Sentry)
- Monitor error rates
- Set up alerts for new errors
- Review performance metrics

### Analytics
- Track conversion funnel
- Monitor page performance
- Review user behavior

### Infrastructure
- Monitor response times
- Track serverless function execution
- Review database performance

## Rollback Strategy

### If Issues Arise
1. Revert to previous deployment in Vercel
2. Check Sentry for new errors
3. Review recent commits
4. Test fix in preview deployment
5. Deploy fix to production

### Vercel Rollback
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

## Summary

Deployment verification ensures:
1. All required files exist
2. Configuration is correct
3. Third-party services are connected
4. Security measures are in place
5. Monitoring is active

Automated tests prevent deployment of incomplete or broken code.
