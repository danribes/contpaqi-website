'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Zap, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Plan details for display (keys for translations)
const PLAN_DETAILS = {
  starter: {
    nameKey: 'starter',
    priceMonthly: 49,
    priceYearly: 490,
    featureKeys: [
      'machines1',
      'invoices100',
      'aiExtraction',
      'emailSupport',
      'softwareUpdates',
    ],
  },
  professional: {
    nameKey: 'professional',
    priceMonthly: 99,
    priceYearly: 990,
    featureKeys: [
      'machines3',
      'unlimitedInvoices',
      'aiExtraction',
      'prioritySupport',
      'apiAccess',
      'batchProcessing',
    ],
  },
} as const;

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as 'starter' | 'professional' | null;
  const interval = (searchParams.get('interval') || 'monthly') as 'monthly' | 'yearly';
  const t = useTranslations('checkout.page');
  const tPricing = useTranslations('pricing.plans');

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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('invalidPlan')}</h1>
            <p className="text-gray-600 mb-6">{t('invalidPlanMessage')}</p>
            <Link href="/pricing" className="btn-primary inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('viewPricing')}
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
            {t('backToPricing')}
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('orderSummary')}</h2>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {tPricing(`${planDetails.nameKey}.name`)} {t('plan')}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {interval === 'yearly' ? t('year') : t('month')} {t('billing')}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">${monthlyEquivalent}</span>
                  <span className="text-gray-500">/{t('month')}</span>
                </div>

                {interval === 'yearly' && (
                  <div className="text-sm text-gray-600 mb-4">
                    ${price} {t('billedAnnually')}
                    <span className="ml-2 text-green-600 font-medium">{t('save')} 17%</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('includes')}</h3>
                <ul className="space-y-3">
                  {planDetails.featureKeys.map((featureKey, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{t(`features.${featureKey}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>{t('total')}</span>
                  <span>
                    ${price}
                    <span className="text-sm font-normal text-gray-500">
                      /{interval === 'yearly' ? t('year') : t('month')}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {t('freeTrialIncluded')}
                </p>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('completeOrder')}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t('emailHint')}
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
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      {t('continuePayment')}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  {t('stripeRedirect')}
                </p>
              </form>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>{t('secureCheckout')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>{t('instantActivation')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span>{t('freeTrial')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span>{t('guarantee')}</span>
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
