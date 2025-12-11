import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for ContPAQi AI Bridge software subscriptions.',
};

export default function RefundsPage() {
  const t = useTranslations('legal.refunds');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-500 mb-8">
            {t('lastUpdated')}: December 11, 2024
          </p>

          <div className="prose prose-lg max-w-none">
            {/* 30-Day Guarantee */}
            <section className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                {t('sections.guarantee.title')}
              </h2>
              <p className="text-green-700">
                {t('sections.guarantee.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.eligibility.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('sections.eligibility.intro')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('sections.eligibility.items.within30')}</li>
                <li>{t('sections.eligibility.items.firstPurchase')}</li>
                <li>{t('sections.eligibility.items.noPrevious')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.howTo.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('sections.howTo.intro')}
              </p>
              <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                <li>{t('sections.howTo.steps.email')}</li>
                <li>{t('sections.howTo.steps.orderNumber')}</li>
                <li>{t('sections.howTo.steps.reason')}</li>
              </ol>
              <p className="text-gray-600 mt-4">
                {t('sections.howTo.processing')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.renewals.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('sections.renewals.intro')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('sections.renewals.items.cancel')}</li>
                <li>{t('sections.renewals.items.effective')}</li>
                <li>{t('sections.renewals.items.prorated')}</li>
                <li>{t('sections.renewals.items.access')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.annual.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('sections.annual.intro')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('sections.annual.items.guarantee')}</li>
                <li>{t('sections.annual.items.after30')}</li>
                <li>{t('sections.annual.items.technical')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.nonRefundable.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('sections.nonRefundable.intro')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('sections.nonRefundable.items.renewals')}</li>
                <li>{t('sections.nonRefundable.items.upgrades')}</li>
                <li>{t('sections.nonRefundable.items.resellers')}</li>
                <li>{t('sections.nonRefundable.items.violations')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.technical.title')}</h2>
              <p className="text-gray-600">
                {t('sections.technical.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.planChanges.title')}</h2>
              <p className="text-gray-600">
                {t('sections.planChanges.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.enterprise.title')}</h2>
              <p className="text-gray-600">
                {t('sections.enterprise.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.changes.title')}</h2>
              <p className="text-gray-600">
                {t('sections.changes.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.contact.title')}</h2>
              <p className="text-gray-600">
                {t('sections.contact.intro')}
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li><a href="mailto:support@contpaqi-ai-bridge.com" className="text-brand-600 hover:text-brand-700">{t('sections.contact.email')}</a></li>
                <li><Link href="/contact" className="text-brand-600 hover:text-brand-700">{t('sections.contact.portal')}</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
