import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import {
  Cpu,
  Table,
  Eye,
  Shield,
  FileText,
  Zap,
  CheckCircle,
  Server,
  Lock,
  RefreshCw
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover all the powerful features of ContPAQi AI Bridge for automated invoice processing.',
};

export default function FeaturesPage() {
  const t = useTranslations('features');

  const mainFeatures = [
    {
      icon: Cpu,
      title: t('main.ai.title'),
      description: t('main.ai.description'),
      details: [
        t('main.ai.details.layoutlm'),
        t('main.ai.details.tatr'),
        t('main.ai.details.confidence'),
        t('main.ai.details.learning'),
      ],
    },
    {
      icon: Table,
      title: t('main.tables.title'),
      description: t('main.tables.description'),
      details: [
        t('main.tables.details.detection'),
        t('main.tables.details.structure'),
        t('main.tables.details.multipage'),
        t('main.tables.details.export'),
      ],
    },
    {
      icon: Eye,
      title: t('main.review.title'),
      description: t('main.review.description'),
      details: [
        t('main.review.details.split'),
        t('main.review.details.highlight'),
        t('main.review.details.edit'),
        t('main.review.details.batch'),
      ],
    },
    {
      icon: FileText,
      title: t('main.cfdi.title'),
      description: t('main.cfdi.description'),
      details: [
        t('main.cfdi.details.rfc'),
        t('main.cfdi.details.validation'),
        t('main.cfdi.details.iva'),
        t('main.cfdi.details.uuid'),
      ],
    },
    {
      icon: Zap,
      title: t('main.integration.title'),
      description: t('main.integration.description'),
      details: [
        t('main.integration.details.sdk'),
        t('main.integration.details.auto'),
        t('main.integration.details.validation'),
        t('main.integration.details.rollback'),
      ],
    },
    {
      icon: Shield,
      title: t('main.security.title'),
      description: t('main.security.description'),
      details: [
        t('main.security.details.local'),
        t('main.security.details.hardware'),
        t('main.security.details.encrypted'),
        t('main.security.details.audit'),
      ],
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20">
          <div className="container-custom">
            <div className="space-y-24">
              {mainFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 mb-6">
                      <feature.icon className="h-8 w-8 text-brand-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-accent-100 rounded-2xl transform rotate-2"></div>
                      <div className="relative bg-white rounded-2xl shadow-xl p-8 h-80 flex items-center justify-center">
                        <feature.icon className="h-24 w-24 text-brand-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('specs.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <Server className="h-10 w-10 text-brand-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('specs.architecture.title')}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>{t('specs.architecture.docker')}</li>
                  <li>{t('specs.architecture.net')}</li>
                  <li>{t('specs.architecture.electron')}</li>
                  <li>{t('specs.architecture.rest')}</li>
                </ul>
              </div>
              <div className="card">
                <Lock className="h-10 w-10 text-brand-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('specs.security.title')}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>{t('specs.security.processing')}</li>
                  <li>{t('specs.security.licensing')}</li>
                  <li>{t('specs.security.encryption')}</li>
                  <li>{t('specs.security.obfuscation')}</li>
                </ul>
              </div>
              <div className="card">
                <RefreshCw className="h-10 w-10 text-brand-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('specs.compatibility.title')}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>{t('specs.compatibility.windows')}</li>
                  <li>{t('specs.compatibility.contpaqi')}</li>
                  <li>{t('specs.compatibility.pdf')}</li>
                  <li>{t('specs.compatibility.cfdi')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
