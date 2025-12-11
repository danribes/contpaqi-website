import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for ContPAQi AI Bridge software.',
};

export default function TermsPage() {
  const t = useTranslations('legal.terms');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-500 mb-8">
            {t('lastUpdated')}: December 10, 2024
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.acceptance.title')}</h2>
              <p className="text-gray-600">
                {t('sections.acceptance.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.license.title')}</h2>
              <p className="text-gray-600">
                {t('sections.license.content')}
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>{t('sections.license.plans.starter')}</li>
                <li>{t('sections.license.plans.professional')}</li>
                <li>{t('sections.license.plans.enterprise')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.restrictions.title')}</h2>
              <p className="text-gray-600">{t('sections.restrictions.intro')}</p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>{t('sections.restrictions.items.reverse')}</li>
                <li>{t('sections.restrictions.items.remove')}</li>
                <li>{t('sections.restrictions.items.share')}</li>
                <li>{t('sections.restrictions.items.unlawful')}</li>
                <li>{t('sections.restrictions.items.bypass')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.dataProcessing.title')}</h2>
              <p className="text-gray-600">
                {t('sections.dataProcessing.content')}
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>{t('sections.dataProcessing.items.activation')}</li>
                <li>{t('sections.dataProcessing.items.updates')}</li>
                <li>{t('sections.dataProcessing.items.analytics')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.subscription.title')}</h2>
              <p className="text-gray-600">
                {t('sections.subscription.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.refund.title')}</h2>
              <p className="text-gray-600">
                {t('sections.refund.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.warranty.title')}</h2>
              <p className="text-gray-600">
                {t('sections.warranty.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.liability.title')}</h2>
              <p className="text-gray-600">
                {t('sections.liability.content')}
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
                {t('sections.contact.content')}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
