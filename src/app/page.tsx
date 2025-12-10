import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  FileText,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Cpu,
  Table,
  Eye
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative gradient-bg overflow-hidden">
          <div className="container-custom py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-in">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                  {t('hero.title.line1')}{' '}
                  <span className="gradient-text">{t('hero.title.highlight')}</span>{' '}
                  {t('hero.title.line2')}
                </h1>
                <p className="text-xl text-gray-600 max-w-xl">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing" className="btn-primary">
                    {t('hero.cta.primary')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link href="/features" className="btn-secondary">
                    {t('hero.cta.secondary')}
                  </Link>
                </div>
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {t('hero.badges.noCloud')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {t('hero.badges.mexicanCompliant')}
                  </div>
                </div>
              </div>
              <div className="relative lg:h-[500px] animate-in" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-accent-100 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 h-full">
                  {/* Placeholder for app screenshot/demo */}
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center p-8">
                      <FileText className="h-16 w-16 text-brand-500 mx-auto mb-4" />
                      <p className="text-gray-500">{t('hero.demoPlaceholder')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  step: '1',
                  title: t('howItWorks.steps.upload.title'),
                  description: t('howItWorks.steps.upload.description'),
                },
                {
                  icon: Cpu,
                  step: '2',
                  title: t('howItWorks.steps.extract.title'),
                  description: t('howItWorks.steps.extract.description'),
                },
                {
                  icon: Zap,
                  step: '3',
                  title: t('howItWorks.steps.post.title'),
                  description: t('howItWorks.steps.post.description'),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative card text-center hover:shadow-lg transition-shadow"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <item.icon className="h-12 w-12 text-brand-500 mx-auto mb-4 mt-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('features.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Cpu,
                  title: t('features.items.ai.title'),
                  description: t('features.items.ai.description'),
                },
                {
                  icon: Table,
                  title: t('features.items.tables.title'),
                  description: t('features.items.tables.description'),
                },
                {
                  icon: Eye,
                  title: t('features.items.review.title'),
                  description: t('features.items.review.description'),
                },
                {
                  icon: Shield,
                  title: t('features.items.security.title'),
                  description: t('features.items.security.description'),
                },
                {
                  icon: FileText,
                  title: t('features.items.cfdi.title'),
                  description: t('features.items.cfdi.description'),
                },
                {
                  icon: Zap,
                  title: t('features.items.integration.title'),
                  description: t('features.items.integration.description'),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <feature.icon className="h-10 w-10 text-brand-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/features" className="btn-secondary">
                {t('features.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-brand-600 shadow-lg hover:bg-gray-100 transition-colors"
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
