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
  const t = useTranslations('legal');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('refunds.title')}
          </h1>
          <p className="text-gray-500 mb-8">
            {t('refunds.lastUpdated')}: December 11, 2024
          </p>

          <div className="prose prose-lg max-w-none">
            {/* 30-Day Guarantee */}
            <section className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                30-Day Money-Back Guarantee
              </h2>
              <p className="text-green-700">
                We offer a full 30-day money-back guarantee on all new subscriptions. If you&apos;re not completely satisfied with ContPAQi AI Bridge within 30 days of your initial purchase, we&apos;ll refund your payment in full—no questions asked.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Eligibility for Refunds</h2>
              <p className="text-gray-600 mb-4">
                You are eligible for a full refund if:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your request is made within 30 days of your initial purchase</li>
                <li>This is your first purchase of ContPAQi AI Bridge</li>
                <li>You have not previously received a refund for the same product</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How to Request a Refund</h2>
              <p className="text-gray-600 mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                <li>Send an email to <a href="mailto:support@contpaqi-ai-bridge.com" className="text-brand-600 hover:text-brand-700">support@contpaqi-ai-bridge.com</a></li>
                <li>Include your order number or the email address used for purchase</li>
                <li>Briefly describe the reason for your refund request (optional but helpful)</li>
              </ol>
              <p className="text-gray-600 mt-4">
                We typically process refund requests within 2-3 business days. Once approved, the refund will be credited to your original payment method within 5-10 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Subscription Renewals</h2>
              <p className="text-gray-600 mb-4">
                For subscription renewals (after the initial 30-day period):
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You may cancel your subscription at any time before the next billing cycle</li>
                <li>Cancellations take effect at the end of your current billing period</li>
                <li>We do not offer prorated refunds for partial months or years</li>
                <li>You retain access to the software until your subscription period ends</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Annual Subscriptions</h2>
              <p className="text-gray-600 mb-4">
                For annual subscription plans:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>The 30-day money-back guarantee applies to the full annual payment</li>
                <li>After 30 days, you may cancel to prevent auto-renewal, but the current year is non-refundable</li>
                <li>If you experience significant technical issues beyond 30 days, please contact support for case-by-case consideration</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Non-Refundable Items</h2>
              <p className="text-gray-600 mb-4">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Subscription renewals after the initial 30-day period</li>
                <li>Upgrades or add-ons purchased separately (after 30 days)</li>
                <li>Purchases made through resellers or third parties</li>
                <li>Accounts terminated for Terms of Service violations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Technical Issues</h2>
              <p className="text-gray-600">
                If you&apos;re experiencing technical issues with the software, we encourage you to contact our support team first. Many issues can be resolved quickly, and we&apos;re committed to ensuring you get value from ContPAQi AI Bridge. If we cannot resolve your issue, we will work with you on an appropriate remedy, which may include a refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Plan Changes</h2>
              <p className="text-gray-600">
                If you upgrade your plan, you&apos;ll pay the prorated difference. If you downgrade, the change takes effect at your next billing cycle—there are no refunds for downgrades, but you retain your higher-tier features until the cycle ends.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Enterprise Customers</h2>
              <p className="text-gray-600">
                Enterprise customers with custom agreements should refer to their specific contract terms. For questions about enterprise refunds, please contact your account representative or email <a href="mailto:enterprise@contpaqi-ai-bridge.com" className="text-brand-600 hover:text-brand-700">enterprise@contpaqi-ai-bridge.com</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Refund Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of the service after changes constitutes acceptance of the new policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about this Refund Policy or need assistance with a refund, please contact us:
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                <li>Email: <a href="mailto:support@contpaqi-ai-bridge.com" className="text-brand-600 hover:text-brand-700">support@contpaqi-ai-bridge.com</a></li>
                <li>Support Portal: <Link href="/contact" className="text-brand-600 hover:text-brand-700">Contact Form</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
