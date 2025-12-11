import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getPlanFromPrice, isYearlyPrice, getPriceId } from '@/lib/stripe';
import { z } from 'zod';

// Schema for POST body - supports both priceId and plan+interval
const checkoutSchema = z.object({
  // Either provide priceId directly
  priceId: z.string().min(1).optional(),
  // Or provide plan and interval
  plan: z.enum(['starter', 'professional']).optional(),
  interval: z.enum(['monthly', 'yearly']).optional(),
  // Email is required
  email: z.string().email(),
  // Optional custom URLs
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
}).refine(
  (data) => data.priceId || (data.plan && data.interval),
  { message: 'Either priceId or both plan and interval are required' }
);

// GET handler - redirect to checkout page with params
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');
  const interval = searchParams.get('interval') || 'monthly';

  // Validate plan
  if (!plan || !['starter', 'professional'].includes(plan)) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  // Redirect to checkout page with params
  const checkoutUrl = new URL('/checkout', request.url);
  checkoutUrl.searchParams.set('plan', plan);
  checkoutUrl.searchParams.set('interval', interval);

  return NextResponse.redirect(checkoutUrl);
}

// POST handler - create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);

    // Determine price ID
    let priceId: string;
    let planType: string;
    let billingInterval: 'monthly' | 'yearly';

    if (validatedData.priceId) {
      // Using direct priceId
      priceId = validatedData.priceId;
      const plan = getPlanFromPrice(priceId);
      if (!plan) {
        return NextResponse.json(
          { error: 'Invalid price ID' },
          { status: 400 }
        );
      }
      planType = plan;
      billingInterval = isYearlyPrice(priceId) ? 'yearly' : 'monthly';
    } else {
      // Using plan + interval
      const plan = validatedData.plan!;
      const interval = validatedData.interval!;
      const resolvedPriceId = getPriceId(plan, interval);

      if (!resolvedPriceId) {
        return NextResponse.json(
          { error: 'Invalid plan or interval' },
          { status: 400 }
        );
      }

      priceId = resolvedPriceId;
      planType = plan.toUpperCase();
      billingInterval = interval;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: validatedData.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: validatedData.successUrl || `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: validatedData.cancelUrl || `${baseUrl}/checkout/cancel`,
      metadata: {
        plan: planType,
        billingPeriod: billingInterval,
      },
      subscription_data: {
        metadata: {
          plan: planType,
        },
        // Trial period for new subscriptions
        trial_period_days: 14,
      },
      // Enable invoice generation for Mexican businesses
      invoice_creation: {
        enabled: true,
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address for invoices
      billing_address_collection: 'required',
      // Tax ID collection for Mexican businesses
      tax_id_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    // Handle Stripe errors
    if (error instanceof Error && 'type' in error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
