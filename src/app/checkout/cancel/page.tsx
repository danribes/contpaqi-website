import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutCancelPage() {
  const t = useTranslations('checkout');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container-custom max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-8">
            <XCircle className="h-10 w-10 text-gray-400" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('cancel.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('cancel.subtitle')}
          </p>

          <div className="card text-left mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('cancel.whyCancel')}
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                {t('cancel.reasons.questions')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                {t('cancel.reasons.pricing')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                {t('cancel.reasons.demo')}
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('cancel.backToPricing')}
            </Link>
            <Link href="/contact" className="btn-secondary">
              <HelpCircle className="mr-2 h-4 w-4" />
              {t('cancel.contactSupport')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
