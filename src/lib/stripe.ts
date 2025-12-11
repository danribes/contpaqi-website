import Stripe from 'stripe';

// Lazy initialization to prevent build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = {
  get instance() {
    return getStripe();
  },
};

// Price IDs from environment
export const PRICES = {
  STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
  STARTER_YEARLY: process.env.STRIPE_PRICE_STARTER_YEARLY!,
  PROFESSIONAL_MONTHLY: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY!,
  PROFESSIONAL_YEARLY: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY!,
} as const;

export type PriceId = (typeof PRICES)[keyof typeof PRICES];

// Plan configurations
export const PLANS = {
  STARTER: {
    name: 'Starter',
    maxMachines: 1,
    invoicesPerMonth: 100,
    prices: {
      monthly: PRICES.STARTER_MONTHLY,
      yearly: PRICES.STARTER_YEARLY,
    },
  },
  PROFESSIONAL: {
    name: 'Professional',
    maxMachines: 3,
    invoicesPerMonth: null, // unlimited
    prices: {
      monthly: PRICES.PROFESSIONAL_MONTHLY,
      yearly: PRICES.PROFESSIONAL_YEARLY,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;

/**
 * Get plan type from price ID
 */
export function getPlanFromPrice(priceId: string): PlanType | null {
  for (const [planKey, plan] of Object.entries(PLANS)) {
    if (
      plan.prices.monthly === priceId ||
      plan.prices.yearly === priceId
    ) {
      return planKey as PlanType;
    }
  }
  return null;
}

/**
 * Check if price is yearly billing
 */
export function isYearlyPrice(priceId: string): boolean {
  return (
    priceId === PRICES.STARTER_YEARLY ||
    priceId === PRICES.PROFESSIONAL_YEARLY
  );
}

/**
 * Get price ID from plan name and billing interval
 */
export function getPriceId(
  plan: 'starter' | 'professional',
  interval: 'monthly' | 'yearly'
): string | null {
  const planKey = plan.toUpperCase() as keyof typeof PLANS;
  const planConfig = PLANS[planKey];

  if (!planConfig) {
    return null;
  }

  return planConfig.prices[interval] || null;
}

/**
 * Get plan details for display
 */
export function getPlanDetails(plan: 'starter' | 'professional') {
  const planKey = plan.toUpperCase() as keyof typeof PLANS;
  return PLANS[planKey] || null;
}
