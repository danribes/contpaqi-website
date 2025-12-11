import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ContPAQi AI Bridge software.',
};

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');

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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.intro.title')}</h2>
              <p className="text-gray-600">
                {t('sections.intro.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.collect.title')}</h2>

              <h3 className="text-xl font-medium text-gray-900 mt-4 mb-2">{t('sections.collect.account.title')}</h3>
              <p className="text-gray-600">{t('sections.collect.account.intro')}</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.collect.account.items.name')}</li>
                <li>{t('sections.collect.account.items.company')}</li>
                <li>{t('sections.collect.account.items.payment')}</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-4 mb-2">{t('sections.collect.license.title')}</h3>
              <p className="text-gray-600">{t('sections.collect.license.intro')}</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.collect.license.items.fingerprint')}</li>
                <li>{t('sections.collect.license.items.machine')}</li>
                <li>{t('sections.collect.license.items.timestamps')}</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-4 mb-2">{t('sections.collect.analytics.title')}</h3>
              <p className="text-gray-600">{t('sections.collect.analytics.intro')}</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.collect.analytics.items.features')}</li>
                <li>{t('sections.collect.analytics.items.errors')}</li>
                <li>{t('sections.collect.analytics.items.performance')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.notCollect.title')}</h2>
              <p className="text-gray-600">
                {t('sections.notCollect.intro')}
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.notCollect.items.invoice')}</li>
                <li>{t('sections.notCollect.items.database')}</li>
                <li>{t('sections.notCollect.items.customer')}</li>
                <li>{t('sections.notCollect.items.financial')}</li>
              </ul>
              <p className="text-gray-600 mt-4">
                {t('sections.notCollect.note')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.use.title')}</h2>
              <p className="text-gray-600">{t('sections.use.intro')}</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.use.items.provide')}</li>
                <li>{t('sections.use.items.process')}</li>
                <li>{t('sections.use.items.send')}</li>
                <li>{t('sections.use.items.support')}</li>
                <li>{t('sections.use.items.improve')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.security.title')}</h2>
              <p className="text-gray-600">
                {t('sections.security.intro')}
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.security.items.encryption')}</li>
                <li>{t('sections.security.items.stripe')}</li>
                <li>{t('sections.security.items.audits')}</li>
                <li>{t('sections.security.items.access')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.retention.title')}</h2>
              <p className="text-gray-600">
                {t('sections.retention.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.rights.title')}</h2>
              <p className="text-gray-600">{t('sections.rights.intro')}</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.rights.items.access')}</li>
                <li>{t('sections.rights.items.correct')}</li>
                <li>{t('sections.rights.items.delete')}</li>
                <li>{t('sections.rights.items.export')}</li>
                <li>{t('sections.rights.items.optout')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.cookies.title')}</h2>
              <p className="text-gray-600">
                {t('sections.cookies.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('sections.thirdParty.title')}</h2>
              <p className="text-gray-600">{t('sections.thirdParty.intro')}</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>{t('sections.thirdParty.items.stripe')}</li>
                <li>{t('sections.thirdParty.items.resend')}</li>
                <li>{t('sections.thirdParty.items.vercel')}</li>
              </ul>
              <p className="text-gray-600 mt-2">
                {t('sections.thirdParty.note')}
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
