# Task 10: Build Pricing Page with Stripe Integration - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Client Component for State
**Pattern:** Convert to client component for interactivity

```tsx
'use client';

import { useState } from 'react';

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
```

Key points:
- `'use client'` at top of file
- Cannot export static metadata from client components
- Use `useState` for toggle state

### 2. Billing Toggle Component
**Pattern:** Pill-style toggle with badge

```tsx
<div className="inline-flex items-center gap-4 p-2 bg-white rounded-xl shadow-lg border">
  <button
    onClick={() => setBillingInterval('monthly')}
    className={`px-6 py-3 rounded-lg font-medium ${
      billingInterval === 'monthly'
        ? 'bg-brand-600 text-white shadow-md'
        : 'text-gray-600'
    }`}
  >
    Monthly
  </button>
  <button onClick={() => setBillingInterval('yearly')} className="...">
    Yearly
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100">
      Save 17%
    </span>
  </button>
</div>
```

Design elements:
- Container with padding acts as track
- Active button has background + shadow
- Badge shows savings incentive

### 3. Dynamic Price Display
**Pattern:** Calculate price based on billing interval

```tsx
<span className="text-5xl font-bold">
  ${billingInterval === 'monthly'
    ? plan.priceMonthly
    : Math.round(plan.priceYearly / 12)}
</span>
```

Shows:
- Monthly price when monthly selected
- Monthly equivalent (yearly/12) when yearly selected
- Annual total below price

### 4. Feature Comparison Table
**Pattern:** Mixed content cells (boolean or string)

```tsx
const comparisonFeatures = [
  { name: 'Machines', starter: '1', professional: '3', enterprise: 'Unlimited' },
  { name: 'AI Extraction', starter: true, professional: true, enterprise: true },
];

{typeof feature.starter === 'boolean' ? (
  feature.starter ? <CheckCircle /> : <X />
) : (
  <span>{feature.starter}</span>
)}
```

Type checking allows:
- Boolean → icon (checkmark or X)
- String → text value

### 5. Highlighted Table Column
**Pattern:** Visual emphasis on recommended plan

```tsx
// Header
<th className="bg-brand-50">
  Professional
  <span className="text-xs text-brand-600">Most Popular</span>
</th>

// Cells
<td className="bg-brand-50/50">
  {content}
</td>
```

Using semi-transparent brand color maintains visibility while creating hierarchy.

### 6. Dynamic Checkout URLs
**Pattern:** Generate URL with query parameters

```tsx
const getCheckoutUrl = (planId: string) => {
  if (planId === 'enterprise') return '/contact';
  return `/api/checkout?plan=${planId}&interval=${billingInterval}`;
};

<Link href={getCheckoutUrl(plan.id)}>
  {plan.cta}
</Link>
```

Advantages:
- Query params pass state to API
- Enterprise redirects to contact form
- URL reflects current toggle state

### 7. Trust Badges Pattern
**Pattern:** Horizontal badge row under pricing

```tsx
<div className="flex flex-wrap items-center justify-center gap-8 mt-12">
  <div className="flex items-center gap-2">
    <Shield className="h-5 w-5 text-green-500" />
    <span>30-day money-back guarantee</span>
  </div>
  {/* More badges */}
</div>
```

Purpose:
- Address purchase objections
- Build trust near conversion point
- Use recognizable icons

### 8. Scale Effect on Popular Plan
**Pattern:** Visual prominence for recommended option

```tsx
className={`${
  plan.popular
    ? 'border-2 border-brand-500 md:scale-105 z-10'
    : 'border-gray-200'
}`}
```

Elements:
- `md:scale-105`: Slightly larger on tablet+
- `z-10`: Ensures card appears above neighbors
- `border-2 border-brand-500`: Thicker colored border

## Best Practices Established

1. **Billing toggle in hero** - Visible before pricing cards
2. **Show equivalent monthly price** - When yearly selected
3. **Highlight recommended plan** - Scale + border + badge
4. **Comparison table** - Easy feature scanning
5. **Trust badges near CTA** - Address objections
6. **Dynamic checkout URLs** - Pass state via query params

## Design Pattern: SaaS Pricing Page

Essential elements:
1. Hero with billing toggle
2. 3 pricing tiers (low/recommended/high)
3. Feature lists per plan
4. Comparison table for scanning
5. Trust badges
6. FAQ section
7. Enterprise CTA

## Price Display Formula

When yearly billing selected:
```
Monthly display = Math.round(yearlyPrice / 12)
Annual display = yearlyPrice + " billed annually"
Savings = yearlyDiscount text (e.g., "Save $98/year")
```

## References
- [Stripe Pricing Page Best Practices](https://stripe.com/guides/atlas/saas-pricing)
- [SaaS Pricing Psychology](https://www.priceintelligently.com/)
