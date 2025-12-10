import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for ContPAQi AI Bridge software.',
};

export default function TermsPage() {
  const t = useTranslations('legal');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-gray-500 mb-8">
            {t('terms.lastUpdated')}: December 10, 2024
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing or using ContPAQi AI Bridge (&quot;the Software&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Software.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. License Grant</h2>
              <p className="text-gray-600">
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable license to use the Software on the number of machines specified by your subscription plan.
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>Starter Plan: 1 machine activation</li>
                <li>Professional Plan: 3 machine activations</li>
                <li>Enterprise Plan: As specified in your agreement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Restrictions</h2>
              <p className="text-gray-600">You may not:</p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>Reverse engineer, decompile, or disassemble the Software</li>
                <li>Remove or alter any proprietary notices or labels</li>
                <li>Share, transfer, or sublicense your license to others</li>
                <li>Use the Software for any unlawful purpose</li>
                <li>Attempt to bypass the licensing or activation system</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Processing</h2>
              <p className="text-gray-600">
                The Software processes invoice data locally on your machine. No invoice data is transmitted to our servers. The Software only communicates with our servers for:
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>License activation and validation</li>
                <li>Software updates</li>
                <li>Anonymous usage analytics (if enabled)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Payment</h2>
              <p className="text-gray-600">
                Subscriptions are billed monthly or annually as selected. You authorize us to charge your payment method for recurring fees. You may cancel your subscription at any time, effective at the end of the current billing period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refund Policy</h2>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for new subscriptions. If you are not satisfied with the Software within 30 days of your initial purchase, contact support for a full refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-600">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600">
                IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SOFTWARE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600">
                We may update these Terms from time to time. We will notify you of any material changes by email or through the Software. Your continued use of the Software after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <p className="text-gray-600">
                For questions about these Terms, please contact us at legal@contpaqi-ai-bridge.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
