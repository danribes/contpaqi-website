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

- Node.js 18+
- PostgreSQL database
- Stripe account
- Resend account (for emails)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/danribes/contpaqi-website.git
cd contpaqi-website
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_STARTER_MONTHLY="price_..."
STRIPE_PRICE_STARTER_YEARLY="price_..."
STRIPE_PRICE_PROFESSIONAL_MONTHLY="price_..."
STRIPE_PRICE_PROFESSIONAL_YEARLY="price_..."
RESEND_API_KEY="re_..."
EMAIL_FROM="ContPAQi AI Bridge <noreply@your-domain.com>"
```

## License

Proprietary - All rights reserved.

## Related

- [ContPAQi AI Bridge](https://github.com/danribes/contpaqi) - Main product repository
