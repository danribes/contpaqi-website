'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Zap, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Plan details for display
const PLAN_DETAILS = {
  starter: {
    name: 'Starter',
    priceMonthly: 49,
    priceYearly: 490,
    features: [
      '1 machine activation',
      '100 invoices/month',
      'AI data extraction',
      'Email support',
      'Software updates',
    ],
  },
  professional: {
    name: 'Professional',
    priceMonthly: 99,
    priceYearly: 990,
    features: [
      '3 machine activations',
      'Unlimited invoices',
      'AI data extraction',
      'Priority support',
      'API access',
      'Batch processing',
    ],
  },
} as const;

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as 'starter' | 'professional' | null;
  const interval = (searchParams.get('interval') || 'monthly') as 'monthly' | 'yearly';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate plan
  if (!plan || !PLAN_DETAILS[plan]) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Plan</h1>
            <p className="text-gray-600 mb-6">Please select a valid plan from our pricing page.</p>
            <Link href="/pricing" className="btn-primary inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Pricing
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const planDetails = PLAN_DETAILS[plan];
  const price = interval === 'yearly' ? planDetails.priceYearly : planDetails.priceMonthly;
  const monthlyEquivalent = interval === 'yearly' ? Math.round(planDetails.priceYearly / 12) : planDetails.priceMonthly;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          interval,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl">
          {/* Back link */}
          <Link
            href="/pricing"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {planDetails.name} Plan
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {interval} billing
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">${monthlyEquivalent}</span>
                  <span className="text-gray-500">/month</span>
                </div>

                {interval === 'yearly' && (
                  <div className="text-sm text-gray-600 mb-4">
                    ${price} billed annually
                    <span className="ml-2 text-green-600 font-medium">Save 17%</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Includes:</h3>
                <ul className="space-y-3">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${price}
                    <span className="text-sm font-normal text-gray-500">
                      /{interval === 'yearly' ? 'year' : 'month'}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  14-day free trial included
                </p>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Complete Your Order</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Your license key will be sent to this email
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  You&apos;ll be redirected to Stripe for secure payment
                </p>
              </form>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Instant activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span>30-day guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
