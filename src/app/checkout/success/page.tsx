'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle, Download, Key, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutSuccessPage() {
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, verify the session and fetch order details
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-brand-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t('success.processing')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container-custom max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('success.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('success.subtitle')}
          </p>

          <div className="card text-left mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('success.nextSteps')}
            </h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('success.steps.email.title')}</p>
                  <p className="text-sm text-gray-600">{t('success.steps.email.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('success.steps.download.title')}</p>
                  <p className="text-sm text-gray-600">{t('success.steps.download.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('success.steps.activate.title')}</p>
                  <p className="text-sm text-gray-600">{t('success.steps.activate.description')}</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/download" className="btn-primary">
              <Download className="mr-2 h-4 w-4" />
              {t('success.downloadButton')}
            </Link>
            <Link href="/portal" className="btn-secondary">
              <Key className="mr-2 h-4 w-4" />
              {t('success.portalButton')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
