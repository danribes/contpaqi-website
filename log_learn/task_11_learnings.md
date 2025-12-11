# Task 11: Implement Checkout API - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Zod Refinements for Complex Validation
**Pattern:** Either-or field requirements

```typescript
const schema = z.object({
  priceId: z.string().optional(),
  plan: z.enum(['starter', 'professional']).optional(),
  interval: z.enum(['monthly', 'yearly']).optional(),
  email: z.string().email(),
}).refine(
  (data) => data.priceId || (data.plan && data.interval),
  { message: 'Either priceId or both plan and interval are required' }
);
```

Use `.refine()` for custom validation logic that spans multiple fields.

### 2. Next.js API Route with GET Redirect
**Pattern:** GET handler redirects to page

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');

  // Redirect to checkout page with params
  const checkoutUrl = new URL('/checkout', request.url);
  checkoutUrl.searchParams.set('plan', plan);
  return NextResponse.redirect(checkoutUrl);
}
```

Benefits:
- Links can use simple query params
- Page handles form collection
- Separation of concerns

### 3. Stripe Checkout Session Configuration
**Pattern:** Subscription with trial and metadata

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  customer_email: email,
  line_items: [{ price: priceId, quantity: 1 }],
  subscription_data: {
    metadata: { plan },
    trial_period_days: 14,
  },
  invoice_creation: { enabled: true },
  allow_promotion_codes: true,
  billing_address_collection: 'required',
  tax_id_collection: { enabled: true },
});
```

Key options for SaaS:
- `trial_period_days`: Free trial before first charge
- `invoice_creation`: Generate invoices (important for B2B)
- `tax_id_collection`: Collect RFC for Mexican businesses

### 4. Price ID Resolution
**Pattern:** Map plan name to environment variable

```typescript
export function getPriceId(
  plan: 'starter' | 'professional',
  interval: 'monthly' | 'yearly'
): string | null {
  const planKey = plan.toUpperCase();
  const planConfig = PLANS[planKey];
  return planConfig?.prices[interval] || null;
}
```

Keep price IDs in environment variables, resolve at runtime.

### 5. Client-Side Checkout Form
**Pattern:** Form with loading and error states

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan, interval, email }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error);
    if (data.url) window.location.href = data.url;
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};
```

Key elements:
- Prevent form default
- Set loading before async
- Clear error on new attempt
- Check response.ok before using data
- Redirect on success, show error on failure

### 6. Order Summary Layout
**Pattern:** Two-column checkout layout

```
┌───────────────────┬───────────────────┐
│  ORDER SUMMARY    │  CHECKOUT FORM    │
│                   │                   │
│  • Plan details   │  • Email input    │
│  • Price          │  • Submit button  │
│  • Features       │  • Trust badges   │
│  • Total          │                   │
└───────────────────┴───────────────────┘
```

Left column shows what they're buying, right column collects info.

### 7. Reading Query Params in Client Component
**Pattern:** useSearchParams hook

```typescript
'use client';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const interval = searchParams.get('interval') || 'monthly';
}
```

Note: `useSearchParams` requires client component.

### 8. Stripe Session Response Handling
**Pattern:** Return URL for client redirect

```typescript
// API response
return NextResponse.json({
  sessionId: session.id,
  url: session.url,
});

// Client handling
if (data.url) {
  window.location.href = data.url;
}
```

Stripe checkout is on their domain, so use `window.location.href` not Next.js router.

## Best Practices Established

1. **Flexible input handling** - Support both legacy and new params
2. **Zod refinements** - Complex field dependencies
3. **GET for redirects** - Simple links, form pages collect data
4. **Trial periods** - 14 days for SaaS is standard
5. **Tax collection** - Important for B2B in Mexico
6. **Order summary** - Show value before payment

## Stripe Configuration Checklist

For production:
- [ ] Create products in Stripe dashboard
- [ ] Create monthly and yearly prices
- [ ] Set environment variables for price IDs
- [ ] Configure success/cancel webhooks
- [ ] Enable tax collection in Stripe settings
- [ ] Set up invoice templates

## References
- [Stripe Checkout Sessions](https://stripe.com/docs/api/checkout/sessions/create)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Refinements](https://zod.dev/?id=refine)
