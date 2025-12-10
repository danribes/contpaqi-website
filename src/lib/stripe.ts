import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

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
