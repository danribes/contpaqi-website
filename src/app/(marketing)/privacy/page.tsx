import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ContPAQi AI Bridge software.',
};

export default function PrivacyPage() {
  const t = useTranslations('legal');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-gray-500 mb-8">
            {t('privacy.lastUpdated')}: December 10, 2024
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                This Privacy Policy explains how ContPAQi AI Bridge collects, uses, and protects your information. We are committed to protecting your privacy and ensuring the security of your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-medium text-gray-900 mt-4 mb-2">Account Information</h3>
              <p className="text-gray-600">When you create an account, we collect:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Name and email address</li>
                <li>Company name (optional)</li>
                <li>Payment information (processed securely via Stripe)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-4 mb-2">License Information</h3>
              <p className="text-gray-600">For license management, we collect:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Hardware fingerprint (for machine activation)</li>
                <li>Machine name (optional)</li>
                <li>Activation timestamps</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-4 mb-2">Usage Analytics (Optional)</h3>
              <p className="text-gray-600">If you opt-in, we collect anonymous usage data such as:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Feature usage statistics</li>
                <li>Error reports</li>
                <li>Performance metrics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information We Do NOT Collect</h2>
              <p className="text-gray-600">
                We do NOT collect, store, or transmit:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Your invoice data or documents</li>
                <li>ContPAQi database contents</li>
                <li>Customer or vendor information from invoices</li>
                <li>Financial transaction details from invoices</li>
              </ul>
              <p className="text-gray-600 mt-4">
                All invoice processing happens 100% locally on your machine. Your business data never leaves your computer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-gray-600">We use your information to:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Provide and maintain the Software</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important service notifications</li>
                <li>Provide customer support</li>
                <li>Improve the Software based on usage analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Encryption of data in transit (TLS/SSL)</li>
                <li>Secure payment processing via Stripe</li>
                <li>Regular security audits</li>
                <li>Access controls and monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-600">
                We retain your account information for as long as your account is active. If you close your account, we will delete your personal information within 90 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-600">You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-600">
                Our website uses essential cookies for functionality and optional analytics cookies (with your consent). You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
              <p className="text-gray-600">We use the following third-party services:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-1">
                <li>Stripe for payment processing</li>
                <li>Resend for email delivery</li>
                <li>Vercel for website hosting</li>
              </ul>
              <p className="text-gray-600 mt-2">
                These services have their own privacy policies governing their use of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-600">
                For privacy-related inquiries, please contact us at privacy@contpaqi-ai-bridge.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
