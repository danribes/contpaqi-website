# Task 12: Complete Stripe Webhook Handler - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Stripe Webhook Signature Verification
**Pattern:** Verify webhook authenticity

```typescript
import { headers } from 'next/headers';

const body = await request.text();
const headersList = await headers();
const signature = headersList.get('stripe-signature');

const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

Key points:
- Use `request.text()` not `request.json()` for raw body
- Signature is in `stripe-signature` header
- Use `constructEvent` to verify and parse

### 2. Invoice Billing Reasons
**Pattern:** Distinguish invoice types

```typescript
// Skip first invoice (already handled by checkout.session.completed)
if (invoice.billing_reason === 'subscription_create') {
  return;
}
```

Billing reasons:
- `subscription_create`: First invoice after checkout
- `subscription_cycle`: Recurring payment
- `subscription_update`: Plan change
- `manual`: Manually created

### 3. Subscription Period Dates
**Pattern:** Get expiry from subscription

```typescript
const subscription = await stripe.subscriptions.retrieve(
  invoice.subscription as string
);

const newExpiryDate = new Date(subscription.current_period_end * 1000);
```

Important: Stripe uses Unix timestamps (seconds), JavaScript uses milliseconds.

### 4. Customer Retrieval and Deleted Check
**Pattern:** Handle deleted customers

```typescript
const customer = await stripe.customers.retrieve(customerId);

if (customer.deleted || !customer.email) {
  return;
}
```

Type narrowing: After checking `customer.deleted`, TypeScript knows customer is not `Stripe.DeletedCustomer`.

### 5. Dynamic Import for Circular Dependencies
**Pattern:** Avoid circular imports

```typescript
async function sendRenewalConfirmation(email: string, ...) {
  const { sendEmail } = await import('@/lib/email');
  return sendEmail({ ... });
}
```

Use dynamic import when:
- Function is called infrequently
- Importing might cause circular dependency
- Module has side effects you want to defer

### 6. Inline Email Templates
**Pattern:** Template literals for emails

```typescript
const html = `
  <!DOCTYPE html>
  <html>
    <body style="...">
      <h1 style="color: ${isError ? '#dc2626' : '#059669'};">
        ${title}
      </h1>
      <p>Amount: ${currency} ${amount.toFixed(2)}</p>
    </body>
  </html>
`;
```

Inline styles required for email compatibility.

### 7. Conditional Email Content
**Pattern:** Include optional sections

```typescript
${invoiceUrl ? `
  <a href="${invoiceUrl}">Update Payment</a>
` : ''}
```

Use ternary in template literal to conditionally include HTML.

### 8. Webhook Response Pattern
**Pattern:** Always return 200 on success

```typescript
try {
  switch (event.type) {
    case 'event.type':
      await handler();
      break;
    default:
      console.log(`Unhandled: ${event.type}`);
  }
  return NextResponse.json({ received: true });
} catch (error) {
  return NextResponse.json({ error: 'Failed' }, { status: 500 });
}
```

Always return 200 for handled events, even if business logic fails (log it instead).

### 9. Batch License Update
**Pattern:** Update all user licenses

```typescript
const user = await db.user.findUnique({
  include: { licenses: { where: { status: 'ACTIVE' } } },
});

for (const license of user.licenses) {
  await db.license.update({
    where: { id: license.id },
    data: { expiresAt: newExpiryDate },
  });
}
```

Filter to only active licenses in the query, not in application code.

## Best Practices Established

1. **Verify signatures first** - Before any processing
2. **Early returns** - For missing/invalid data
3. **Log important events** - License creation, renewals
4. **Handle deleted entities** - Customers can be deleted
5. **Use Unix timestamp conversion** - `* 1000` for JS Date
6. **Return 200 for handled events** - Even if business logic varies

## Stripe Webhook Events Reference

### Subscription Lifecycle
```
checkout.session.completed → subscription created
invoice.paid (cycle) → renewal
customer.subscription.updated → plan change
customer.subscription.deleted → cancellation
invoice.payment_failed → payment issue
```

### Testing Commands
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger customer.subscription.deleted
```

## Email Template Structure

Essential elements:
1. Brand header/logo
2. Clear heading (colored for status)
3. Key information (license, dates)
4. CTA button (if action needed)
5. Support contact
6. Footer with copyright

## References
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Invoice Billing Reasons](https://stripe.com/docs/api/invoices/object#invoice_object-billing_reason)
