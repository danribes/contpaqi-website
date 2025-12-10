import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, X, HelpCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the perfect ContPAQi AI Bridge plan for your business needs.',
};

export default function PricingPage() {
  const t = useTranslations('pricing');

  const plans = [
    {
      name: t('plans.starter.name'),
      description: t('plans.starter.description'),
      priceMonthly: '$49',
      priceYearly: '$490',
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
      name: t('plans.professional.name'),
      description: t('plans.professional.description'),
      priceMonthly: '$99',
      priceYearly: '$990',
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
      name: t('plans.enterprise.name'),
      description: t('plans.enterprise.description'),
      priceMonthly: t('plans.enterprise.price'),
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
    {
      question: t('faq.license.question'),
      answer: t('faq.license.answer'),
    },
    {
      question: t('faq.machines.question'),
      answer: t('faq.machines.answer'),
    },
    {
      question: t('faq.invoices.question'),
      answer: t('faq.invoices.answer'),
    },
    {
      question: t('faq.refund.question'),
      answer: t('faq.refund.answer'),
    },
    {
      question: t('faq.upgrade.question'),
      answer: t('faq.upgrade.answer'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-bg py-20">
          <div className="container-custom text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative card ${
                    plan.popular
                      ? 'border-2 border-brand-500 shadow-xl scale-105'
                      : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                        {t('popular')}
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.priceMonthly}
                      {plan.priceYearly && (
                        <span className="text-lg font-normal text-gray-500">
                          /{t('month')}
                        </span>
                      )}
                    </div>
                    {plan.priceYearly && (
                      <div className="text-sm text-gray-500 mt-1">
                        {plan.priceYearly}/{t('year')}{' '}
                        <span className="text-green-600 font-medium">
                          {plan.yearlyDiscount}
                        </span>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        {feature.included ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included ? 'text-gray-700' : 'text-gray-400'
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === 'Enterprise' ? '/contact' : '/checkout'}
                    className={`w-full ${
                      plan.popular ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('faq.title')}
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="card">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="h-6 w-6 text-brand-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-600">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-8">
              {t('cta.subtitle')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-brand-600 shadow-lg hover:bg-gray-100 transition-colors"
            >
              {t('cta.button')}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
