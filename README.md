# ContPAQi AI Bridge - Sales Website

[![CI](https://github.com/danribes/contpaqi-website/actions/workflows/ci.yml/badge.svg)](https://github.com/danribes/contpaqi-website/actions/workflows/ci.yml)

Sales and marketing website for ContPAQi AI Bridge, featuring product information, pricing, payment processing, license delivery, and customer portal.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Email**: Resend
- **i18n**: next-intl (English & Spanish)
- **Deployment**: Vercel

## Features

- **Marketing Pages**: Landing, Features, Pricing, Contact
- **Bilingual Support**: English and Spanish
- **Payment Processing**: Stripe Checkout with subscription support
- **License Management**: Automatic license key generation and delivery
- **Customer Portal**: License viewing, machine management, downloads
- **Email Notifications**: Purchase confirmation, license delivery, renewal reminders

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- PostgreSQL database (local or cloud-hosted)
- Stripe account (test mode for development)
- Resend account (for emails)

### Local Development Setup

#### 1. Clone the repository

```bash
git clone https://github.com/danribes/contpaqi-website.git
cd contpaqi-website
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/contpaqi_website"

# Authentication (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (use test keys for development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Seed with sample data
npm run db:seed
```

#### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run db:migrate` | Create new database migration |
| `npm run db:migrate:deploy` | Apply pending migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

### Stripe Setup

1. Create products and prices in [Stripe Dashboard](https://dashboard.stripe.com/products):
   - Starter Monthly ($49/month)
   - Starter Yearly ($490/year)
   - Professional Monthly ($99/month)
   - Professional Yearly ($990/year)

2. Add the price IDs to your environment variables

3. Set up webhook endpoint in Stripe:
   - Endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

4. For local development, use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Project Structure

```
contpaqi-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── checkout/       # Stripe checkout
│   │   │   ├── license/        # License validation/activation
│   │   │   └── webhooks/       # Stripe webhooks
│   │   ├── (marketing)/        # Marketing pages
│   │   │   ├── features/
│   │   │   ├── pricing/
│   │   │   └── contact/
│   │   ├── portal/             # Customer portal
│   │   └── checkout/           # Checkout success/cancel
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── ui/                 # Reusable UI components
│   │   ├── marketing/          # Marketing-specific components
│   │   └── portal/             # Portal-specific components
│   ├── lib/                    # Utilities
│   │   ├── db.ts               # Prisma client
│   │   ├── stripe.ts           # Stripe configuration
│   │   ├── license.ts          # License management
│   │   ├── email.ts            # Email sending
│   │   └── i18n.ts             # Internationalization
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
├── messages/                   # i18n translations
│   ├── en.json
│   └── es.json
└── public/                     # Static assets
```

## API Endpoints

### License Validation

```bash
POST /api/license/validate
Content-Type: application/json

{
  "licenseKey": "XXXX-XXXX-XXXX-XXXX"
}
```

### Machine Activation

```bash
POST /api/license/activate
Content-Type: application/json

{
  "licenseKey": "XXXX-XXXX-XXXX-XXXX",
  "fingerprint": "machine-hardware-fingerprint",
  "machineName": "Office PC"
}
```

### Create Checkout Session

```bash
POST /api/checkout
Content-Type: application/json

{
  "priceId": "price_...",
  "email": "customer@example.com"
}
```

## Deployment

### Vercel Deployment (Recommended)

#### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository (`contpaqi-website`)
4. Vercel will auto-detect Next.js settings

#### Step 3: Configure Environment Variables

Before deploying, add these environment variables in Vercel:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)) |
| `NEXTAUTH_SECRET` | Random secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your production URL (e.g., `https://your-domain.com`) |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL |
| `STRIPE_SECRET_KEY` | Stripe live secret key (`sk_live_...`) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe live publishable key (`pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `RESEND_API_KEY` | Resend API key for emails |
| `CRON_SECRET` | Secret for cron job authentication |

#### Step 4: Deploy

Click **Deploy** and wait for the build to complete. Vercel will:
- Install dependencies
- Generate Prisma client
- Build the Next.js application
- Deploy to production

#### Step 5: Configure Stripe Webhook

After deployment, set up the Stripe webhook:

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
5. Copy the signing secret and update `STRIPE_WEBHOOK_SECRET` in Vercel

#### Step 6: Verify Deployment

```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Verify sitemap
curl https://your-domain.com/sitemap.xml

# Verify robots.txt
curl https://your-domain.com/robots.txt
```

### Environment Variables Reference

```env
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."

# Stripe Price IDs
STRIPE_PRICE_STARTER_MONTHLY="price_..."
STRIPE_PRICE_STARTER_YEARLY="price_..."
STRIPE_PRICE_PROFESSIONAL_MONTHLY="price_..."
STRIPE_PRICE_PROFESSIONAL_YEARLY="price_..."

# Optional
SENTRY_DSN="https://..."
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
CRON_SECRET="..."
EMAIL_FROM="ContPAQi AI Bridge <noreply@your-domain.com>"
```

> **Note:** For detailed deployment instructions including database setup, troubleshooting, rollback procedures, and security best practices, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

Proprietary - All rights reserved.

## Related

- [ContPAQi AI Bridge](https://github.com/danribes/contpaqi) - Main product repository
