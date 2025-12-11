import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Link from 'next/link';
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
  RefreshCw,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Calculator,
  Globe,
  Database,
  Monitor,
  Users
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
      id: 'ai',
      icon: Cpu,
      title: t('main.ai.title'),
      description: t('main.ai.description'),
      details: [
        t('main.ai.details.layoutlm'),
        t('main.ai.details.tatr'),
        t('main.ai.details.confidence'),
        t('main.ai.details.learning'),
      ],
      color: 'brand',
    },
    {
      id: 'tables',
      icon: Table,
      title: t('main.tables.title'),
      description: t('main.tables.description'),
      details: [
        t('main.tables.details.detection'),
        t('main.tables.details.structure'),
        t('main.tables.details.multipage'),
        t('main.tables.details.export'),
      ],
      color: 'purple',
    },
    {
      id: 'review',
      icon: Eye,
      title: t('main.review.title'),
      description: t('main.review.description'),
      details: [
        t('main.review.details.split'),
        t('main.review.details.highlight'),
        t('main.review.details.edit'),
        t('main.review.details.batch'),
      ],
      color: 'blue',
    },
    {
      id: 'cfdi',
      icon: FileText,
      title: t('main.cfdi.title'),
      description: t('main.cfdi.description'),
      details: [
        t('main.cfdi.details.rfc'),
        t('main.cfdi.details.validation'),
        t('main.cfdi.details.iva'),
        t('main.cfdi.details.uuid'),
      ],
      color: 'green',
    },
    {
      id: 'integration',
      icon: Zap,
      title: t('main.integration.title'),
      description: t('main.integration.description'),
      details: [
        t('main.integration.details.sdk'),
        t('main.integration.details.auto'),
        t('main.integration.details.validation'),
        t('main.integration.details.rollback'),
      ],
      color: 'orange',
    },
    {
      id: 'security',
      icon: Shield,
      title: t('main.security.title'),
      description: t('main.security.description'),
      details: [
        t('main.security.details.local'),
        t('main.security.details.hardware'),
        t('main.security.details.encrypted'),
        t('main.security.details.audit'),
      ],
      color: 'red',
    },
  ];

  const navItems = [
    { id: 'ai', label: 'AI Processing', icon: Cpu },
    { id: 'tables', label: 'Table Detection', icon: Table },
    { id: 'review', label: 'Review Interface', icon: Eye },
    { id: 'cfdi', label: 'Mexican Compliance', icon: FileText },
    { id: 'integration', label: 'ContPAQi Integration', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'specs', label: 'Tech Specs', icon: Server },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative gradient-bg py-20 lg:py-28 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl"></div>
          </div>

          <div className="container-custom relative">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-medium text-brand-700">Powered by Advanced AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                {t('hero.subtitle')}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { value: '99%+', label: 'Extraction Accuracy' },
                  { value: '< 5s', label: 'Per Invoice' },
                  { value: '100%', label: 'Local Processing' },
                  { value: '24/7', label: 'Offline Capable' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <p className="text-2xl font-bold text-brand-600">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Navigation */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Features */}
        <section className="py-20">
          <div className="container-custom">
            <div className="space-y-32">
              {mainFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  id={feature.id}
                  className="scroll-mt-20"
                >
                  <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    index % 2 === 1 ? '' : ''
                  }`}>
                    {/* Content */}
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      {/* Section Number */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>

                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 mb-6">
                        <feature.icon className="h-8 w-8 text-brand-600" />
                      </div>

                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-8">
                        {feature.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {feature.details.map((detail, detailIndex) => (
                          <div
                            key={detailIndex}
                            className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual */}
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="relative">
                        {/* Decorative background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-accent-100 rounded-3xl transform rotate-2 scale-105"></div>

                        {/* Main card */}
                        <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                          {/* Top bar */}
                          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-400" />
                              <div className="w-3 h-3 rounded-full bg-yellow-400" />
                              <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 text-center">
                              <span className="text-xs text-gray-400">ContPAQi AI Bridge</span>
                            </div>
                          </div>

                          {/* Content area */}
                          <div className="p-8 h-72 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                            <div className="text-center">
                              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
                                <feature.icon className="h-10 w-10 text-brand-500" />
                              </div>
                              <p className="text-sm text-gray-500 max-w-xs">
                                {feature.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section id="specs" className="py-20 bg-gray-50 scroll-mt-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full mb-4">
                <Server className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">For Developers & IT Teams</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('specs.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built with enterprise-grade architecture for reliability and security
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Architecture */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Server className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t('specs.architecture.title')}
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Database, text: t('specs.architecture.docker') },
                    { icon: Monitor, text: t('specs.architecture.net') },
                    { icon: Globe, text: t('specs.architecture.electron') },
                    { icon: Zap, text: t('specs.architecture.rest') },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <item.icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                  <Lock className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t('specs.security.title')}
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Shield, text: t('specs.security.processing') },
                    { icon: BadgeCheck, text: t('specs.security.licensing') },
                    { icon: Lock, text: t('specs.security.encryption') },
                    { icon: Eye, text: t('specs.security.obfuscation') },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <item.icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compatibility */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                  <RefreshCw className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t('specs.compatibility.title')}
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Monitor, text: t('specs.compatibility.windows') },
                    { icon: Calculator, text: t('specs.compatibility.contpaqi') },
                    { icon: FileText, text: t('specs.compatibility.pdf') },
                    { icon: BadgeCheck, text: t('specs.compatibility.cfdi') },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <item.icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-brand-600">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to See It in Action?
            </h2>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-8">
              Start your 14-day free trial and experience the power of AI-driven invoice processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-brand-600 shadow-lg hover:bg-gray-100 transition-all hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 border border-brand-400 px-8 py-4 text-lg font-semibold text-white hover:bg-brand-400 transition-all hover:-translate-y-0.5"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
