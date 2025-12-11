'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle, X, HelpCircle, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: t('plans.starter.name'),
      description: t('plans.starter.description'),
      priceMonthly: 49,
      priceYearly: 490,
      yearlyDiscount: t('plans.starter.yearlyDiscount'),
      features: [
        { text: t('plans.starter.features.machines'), included: true },
        { text: t('plans.starter.features.invoices'), included: true },
        { text: t('plans.starter.features.ai'), included: true },
        { text: t('plans.starter.features.support'), included: true },
        { text: t('plans.starter.features.updates'), included: true },
        { text: t('plans.starter.features.api'), included: false },
        { text: t('plans.starter.features.priority'), included: false },
      ],
      cta: t('plans.starter.cta'),
      popular: false,
    },
    {
      id: 'professional',
      name: t('plans.professional.name'),
      description: t('plans.professional.description'),
      priceMonthly: 99,
      priceYearly: 990,
      yearlyDiscount: t('plans.professional.yearlyDiscount'),
      features: [
        { text: t('plans.professional.features.machines'), included: true },
        { text: t('plans.professional.features.invoices'), included: true },
        { text: t('plans.professional.features.ai'), included: true },
        { text: t('plans.professional.features.support'), included: true },
        { text: t('plans.professional.features.updates'), included: true },
        { text: t('plans.professional.features.api'), included: true },
        { text: t('plans.professional.features.priority'), included: true },
      ],
      cta: t('plans.professional.cta'),
      popular: true,
    },
    {
      id: 'enterprise',
      name: t('plans.enterprise.name'),
      description: t('plans.enterprise.description'),
      priceMonthly: null,
      priceYearly: null,
      yearlyDiscount: null,
      features: [
        { text: t('plans.enterprise.features.machines'), included: true },
        { text: t('plans.enterprise.features.invoices'), included: true },
        { text: t('plans.enterprise.features.ai'), included: true },
        { text: t('plans.enterprise.features.support'), included: true },
        { text: t('plans.enterprise.features.sla'), included: true },
        { text: t('plans.enterprise.features.custom'), included: true },
        { text: t('plans.enterprise.features.onboarding'), included: true },
      ],
      cta: t('plans.enterprise.cta'),
      popular: false,
    },
  ];

  const faqs = [
    { question: t('faq.license.question'), answer: t('faq.license.answer') },
    { question: t('faq.machines.question'), answer: t('faq.machines.answer') },
    { question: t('faq.invoices.question'), answer: t('faq.invoices.answer') },
    { question: t('faq.refund.question'), answer: t('faq.refund.answer') },
    { question: t('faq.upgrade.question'), answer: t('faq.upgrade.answer') },
  ];

  // Feature comparison data
  const comparisonFeatures = [
    { name: 'Machine Activations', starter: '1', professional: '3', enterprise: 'Unlimited' },
    { name: 'Invoices per Month', starter: '100', professional: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'AI Extraction', starter: true, professional: true, enterprise: true },
    { name: 'RFC Validation', starter: true, professional: true, enterprise: true },
    { name: 'IVA Calculation', starter: true, professional: true, enterprise: true },
    { name: 'Batch Processing', starter: false, professional: true, enterprise: true },
    { name: 'API Access', starter: false, professional: true, enterprise: true },
    { name: 'Priority Support', starter: false, professional: true, enterprise: true },
    { name: 'Custom Integration', starter: false, professional: false, enterprise: true },
    { name: 'Dedicated Onboarding', starter: false, professional: false, enterprise: true },
    { name: 'SLA Guarantee', starter: false, professional: false, enterprise: true },
  ];

  const getCheckoutUrl = (planId: string) => {
    if (planId === 'enterprise') return '/contact';
    return `/api/checkout?plan=${planId}&interval=${billingInterval}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative gradient-bg py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl"></div>
          </div>

          <div className="container-custom relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">14-Day Free Trial</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              {t('hero.subtitle')}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  billingInterval === 'monthly'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  billingInterval === 'yearly'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  billingInterval === 'yearly'
                    ? 'bg-green-400 text-green-900'
                    : 'bg-green-100 text-green-700'
                }`}>
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 -mt-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? 'border-2 border-brand-500 md:scale-105 z-10'
                      : 'border-gray-200 hover:border-brand-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                        {t('popular')}
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    <div className="text-center mb-8">
                      {plan.priceMonthly !== null ? (
                        <>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-bold text-gray-900">
                              ${billingInterval === 'monthly' ? plan.priceMonthly : Math.round(plan.priceYearly! / 12)}
                            </span>
                            <span className="text-gray-500">/{t('month')}</span>
                          </div>
                          {billingInterval === 'yearly' && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">
                                ${plan.priceYearly} billed annually
                              </span>
                              <span className="ml-2 text-sm text-green-600 font-medium">
                                {plan.yearlyDiscount}
                              </span>
                            </div>
                          )}
                          {billingInterval === 'monthly' && (
                            <div className="mt-2 text-sm text-gray-500">
                              or ${plan.priceYearly}/{t('year')}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-gray-900">
                          {t('plans.enterprise.price')}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          {feature.included ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={getCheckoutUrl(plan.id)}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Instant activation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Compare Plans
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              See which plan is right for your business
            </p>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-5 px-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-5 px-6 font-semibold text-gray-900">Starter</th>
                    <th className="text-center py-5 px-6 font-semibold text-gray-900 bg-brand-50">
                      <div className="flex flex-col items-center">
                        <span>Professional</span>
                        <span className="text-xs font-normal text-brand-600 mt-1">Most Popular</span>
                      </div>
                    </th>
                    <th className="text-center py-5 px-6 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-6 text-gray-700">{feature.name}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 font-medium">{feature.starter}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center bg-brand-50/50">
                        {typeof feature.professional === 'boolean' ? (
                          feature.professional ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 font-medium">{feature.professional}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 font-medium">{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container-custom max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Have questions? We have answers.
            </p>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center gap-4 p-5 cursor-pointer list-none">
                    <HelpCircle className="h-5 w-5 text-brand-500 flex-shrink-0" />
                    <span className="flex-1 font-semibold text-gray-900">{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-5 pl-14">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-600">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-brand-600 shadow-lg hover:bg-gray-100 transition-all hover:-translate-y-0.5"
              >
                {t('cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
