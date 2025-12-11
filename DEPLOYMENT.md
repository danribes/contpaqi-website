# ContPAQi AI Bridge - Deployment Guide

This guide provides step-by-step instructions for deploying the ContPAQi AI Bridge sales website to production using Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment](#vercel-deployment)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Stripe Configuration](#stripe-configuration)
6. [Email Setup with Resend](#email-setup-with-resend)
7. [Sentry Error Monitoring](#sentry-error-monitoring)
8. [Domain and SSL Configuration](#domain-and-ssl-configuration)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Troubleshooting](#troubleshooting)
11. [Rollback Procedures](#rollback-procedures)
12. [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] A [Vercel](https://vercel.com) account (free tier available)
- [ ] A [GitHub](https://github.com) repository with the project code
- [ ] A PostgreSQL database (recommended: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
- [ ] A [Stripe](https://stripe.com) account for payment processing
- [ ] A [Resend](https://resend.com) account for transactional emails
- [ ] A [Sentry](https://sentry.io) account for error monitoring (optional but recommended)
- [ ] A domain name (optional, Vercel provides a free subdomain)

### Required Tools

- Node.js 18.x or later
- npm 9.x or later
- Git

---

## Vercel Deployment

### Step 1: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Vercel will auto-detect Next.js and configure build settings

### Step 2: Configure Build Settings

Vercel should automatically detect these settings, but verify:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `npm run build` (or leave default) |
| Output Directory | `.next` (or leave default) |
| Install Command | `npm ci` (or leave default) |

### Step 3: Add Environment Variables

Before deploying, add all required environment variables (see [Environment Variables](#environment-variables) section).

### Step 4: Deploy

Click **Deploy** and wait for the build to complete. Vercel will provide a deployment URL.

---

## Environment Variables

Configure these environment variables in your Vercel project settings under **Settings > Environment Variables**.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth.js session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full URL of your deployed site | `https://your-domain.com` |
| `STRIPE_SECRET_KEY` | Stripe secret API key (starts with `sk_`) | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with `pk_`) | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SENTRY_DSN` | Sentry Data Source Name for error tracking | - |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics domain | - |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID | - |
| `CRON_SECRET` | Secret for authenticating cron job requests | - |
| `FROM_EMAIL` | Default sender email address | `noreply@contpaqi-ai-bridge.com` |

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -hex 32
```

---

## Database Setup

### Option 1: Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Set `DATABASE_URL` in Vercel

### Option 2: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings > Database**
3. Copy the **Connection string** (URI format)
4. Set `DATABASE_URL` in Vercel

### Option 3: Railway

1. Create a PostgreSQL database at [railway.app](https://railway.app)
2. Copy the `DATABASE_URL` from Variables tab
3. Set in Vercel environment variables

### Database Migration

After setting `DATABASE_URL`, run migrations:

```bash
# Local development
npm run db:migrate

# Production (via Vercel CLI or in build)
npx prisma migrate deploy
```

The build command in `vercel.json` automatically runs migrations.

### Database Seeding (Optional)

Seed initial data for testing:

```bash
npm run db:seed
```

---

## Stripe Configuration

### Step 1: Get API Keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers > API Keys**
3. Copy your **Publishable key** and **Secret key**
4. For production, use live keys (not test keys)

### Step 2: Create Products and Prices

Create your subscription products in Stripe:

1. Go to **Products** in Stripe Dashboard
2. Create products for each tier (Starter, Professional, Enterprise)
3. Add monthly and yearly prices
4. Note the Price IDs (e.g., `price_xxx`)

### Step 3: Configure Webhook

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and set as `STRIPE_WEBHOOK_SECRET`

### Step 4: Update Price IDs

Update your pricing configuration in the codebase to use the correct Stripe Price IDs.

---

## Email Setup with Resend

### Step 1: Get API Key

1. Create an account at [resend.com](https://resend.com)
2. Go to **API Keys**
3. Create a new API key
4. Set as `RESEND_API_KEY` in Vercel

### Step 2: Verify Domain (Optional but Recommended)

1. Go to **Domains** in Resend
2. Add your domain
3. Add the DNS records Resend provides
4. Wait for verification

### Step 3: Configure Sender

Update the `FROM_EMAIL` environment variable with your verified domain email.

---

## Sentry Error Monitoring

### Step 1: Create Sentry Project

1. Create an account at [sentry.io](https://sentry.io)
2. Create a new project (choose Next.js)
3. Copy the DSN

### Step 2: Configure in Vercel

Set the `SENTRY_DSN` environment variable with your DSN.

### Step 3: Verify Integration

After deployment, test error reporting:

1. Visit your site
2. Open browser console
3. Run: `Sentry.captureMessage('Test from production')`
4. Check Sentry dashboard for the event

---

## Domain and SSL Configuration

### Option 1: Use Vercel Subdomain (Default)

Vercel automatically provides a subdomain like `your-project.vercel.app` with HTTPS/SSL.

### Option 2: Custom Domain

1. Go to your Vercel project **Settings > Domains**
2. Add your custom domain
3. Configure DNS:
   - For apex domain (example.com): Add A record pointing to `76.76.21.21`
   - For subdomain (www.example.com): Add CNAME record pointing to `cname.vercel-dns.com`
4. Vercel automatically provisions SSL certificates

### HTTPS Enforcement

Vercel automatically:
- Provisions SSL certificates
- Enforces HTTPS redirects
- Handles certificate renewal

---

## Post-Deployment Verification

After deployment, verify everything works correctly:

### 1. Health Check

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "database": { "status": "healthy", "latency": 50 }
  }
}
```

### 2. Verification Checklist

- [ ] Homepage loads correctly
- [ ] All pages render without errors
- [ ] Navigation works
- [ ] Language switcher works (EN/ES)
- [ ] Contact form submits successfully
- [ ] Pricing page displays correctly
- [ ] Checkout redirects to Stripe
- [ ] Stripe webhook receives events
- [ ] Emails are delivered
- [ ] Authentication flow works
- [ ] Customer portal is accessible
- [ ] `/api/health` returns healthy status

### 3. SEO Verification

- [ ] `/sitemap.xml` is accessible
- [ ] `/robots.txt` is accessible
- [ ] Meta tags render correctly
- [ ] OG images load on social shares

### 4. Performance Check

Run Lighthouse audit:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for Performance, Accessibility, Best Practices, SEO
4. Target scores above 90

---

## Troubleshooting

### Build Failures

**Error: Module not found**
- Ensure all dependencies are in `package.json`
- Run `npm ci` locally to verify

**Error: TypeScript errors**
- Run `npm run typecheck` locally
- Fix any type errors

**Error: Prisma generate failed**
- Ensure `DATABASE_URL` is set
- Run `npx prisma generate` locally

### Database Connection Issues

**Error: Connection refused**
- Verify `DATABASE_URL` is correct
- Check database firewall allows Vercel IPs
- Enable SSL in connection string: `?sslmode=require`

**Error: Too many connections**
- Use connection pooling (PgBouncer)
- Add `?pgbouncer=true&connection_limit=1` to URL

### Stripe Webhook Issues

**Error: Webhook signature verification failed**
- Verify `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint
- Check you're using the correct webhook signing secret

**Error: Events not received**
- Verify webhook URL is correct
- Check Stripe webhook logs for delivery issues

### Email Delivery Issues

**Error: Emails not sent**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Verify domain is properly configured

---

## Rollback Procedures

### Instant Rollback via Vercel

1. Go to your project in Vercel Dashboard
2. Click on **Deployments**
3. Find the last working deployment
4. Click the **...** menu
5. Select **Promote to Production**

### Database Rollback

If a migration caused issues:

```bash
# View migration status
npx prisma migrate status

# Reset to previous migration (CAUTION: data loss)
npx prisma migrate reset

# Or manually revert in database
psql $DATABASE_URL -f rollback-script.sql
```

### Emergency Procedures

1. **Immediate rollback**: Use Vercel instant rollback
2. **Database issues**: Connect directly and fix data
3. **Complete outage**: Contact Vercel support

---

## Security Best Practices

### Credentials and Secrets

- **NEVER** commit secrets to git
- **NEVER** expose secret keys in client-side code
- Use Vercel environment variables for all secrets
- Rotate secrets periodically
- Use different keys for development and production

### Environment Variable Security

- Mark sensitive variables as **Secret** in Vercel
- Use `NEXT_PUBLIC_` prefix ONLY for client-safe variables
- Never log secrets or credentials

### Production Checklist

- [ ] All secrets are set as environment variables (not in code)
- [ ] Using production (live) Stripe keys
- [ ] Database has strong password
- [ ] NEXTAUTH_SECRET is unique and random
- [ ] CRON_SECRET is set for cron job authentication
- [ ] Error monitoring (Sentry) is configured
- [ ] HTTPS is enforced
- [ ] Security headers are configured (via vercel.json)

### Regular Maintenance

- Review Vercel logs for errors
- Monitor Sentry for exceptions
- Check Stripe webhook delivery
- Review npm audit reports
- Keep dependencies updated

---

## Quick Reference

### Useful Commands

```bash
# Local development
npm run dev

# Production build
npm run build

# Type checking
npm run typecheck

# Run tests
npm run test

# Database operations
npm run db:migrate        # Create migration
npm run db:migrate:deploy # Apply migrations
npm run db:seed           # Seed database
npm run db:reset          # Reset database

# Linting
npm run lint
```

### Important URLs

| URL | Description |
|-----|-------------|
| `/api/health` | Health check endpoint |
| `/sitemap.xml` | SEO sitemap |
| `/robots.txt` | Crawler instructions |
| `/api/webhooks/stripe` | Stripe webhook endpoint |
| `/api/cron/license-check` | License expiry cron |
| `/api/cron/cleanup` | Cleanup cron |

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Resend Documentation](https://resend.com/docs)
