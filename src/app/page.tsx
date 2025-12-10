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
  Eye,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Star,
  Play,
  ChevronDown,
  Calculator,
  Building2
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
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="container-custom py-20 lg:py-32 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-fade-in-up">
                  <span className="block">{t('hero.title.line1')}</span>
                  <span className="block gradient-text animate-fade-in-delay-2">{t('hero.title.highlight')}</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-xl animate-fade-in-delay-3">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-4">
                  <Link href="/pricing" className="btn-primary text-base px-8 py-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                    {t('hero.cta.primary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link href="/features" className="btn-secondary text-base px-8 py-4 hover:-translate-y-0.5 transition-all">
                    <Play className="mr-2 h-5 w-5" />
                    {t('hero.cta.secondary')}
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6 pt-4 animate-fade-in-delay-5">
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
              <div className="relative lg:h-[500px] animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-200 to-accent-200 rounded-2xl transform rotate-3 animate-float"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 h-full border border-gray-100">
                  {/* Placeholder for app screenshot/demo */}
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-10 w-10 text-brand-600" />
                      </div>
                      <p className="text-gray-500 font-medium">{t('hero.demoPlaceholder')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t('trustBar.title')}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Building2 className="h-8 w-8 text-gray-400" />
                  <span className="font-semibold text-gray-400">Despacho {i}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-600">500+</p>
                <p className="text-sm text-gray-500">{t('trustBar.stats.accountants')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-600">1M+</p>
                <p className="text-sm text-gray-500">{t('trustBar.stats.invoices')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-600">90%</p>
                <p className="text-sm text-gray-500">{t('trustBar.stats.timeSaved')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('problemSolution.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('problemSolution.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Problems */}
              <div className="card border-red-100 bg-red-50/50">
                <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  {t('problemSolution.problems.title')}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t('problemSolution.problems.time.title')}</p>
                      <p className="text-sm text-gray-600">{t('problemSolution.problems.time.description')}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t('problemSolution.problems.errors.title')}</p>
                      <p className="text-sm text-gray-600">{t('problemSolution.problems.errors.description')}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t('problemSolution.problems.scaling.title')}</p>
                      <p className="text-sm text-gray-600">{t('problemSolution.problems.scaling.description')}</p>
                    </div>
                  </li>
                </ul>
              </div>
              {/* Solutions */}
              <div className="card border-green-100 bg-green-50/50">
                <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  {t('problemSolution.solutions.title')}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t('problemSolution.solutions.speed.title')}</p>
                      <p className="text-sm text-gray-600">{t('problemSolution.solutions.speed.description')}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t('problemSolution.solutions.accuracy.title')}</p>
                      <p className="text-sm text-gray-600">{t('problemSolution.solutions.accuracy.description')}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t('problemSolution.solutions.growth.title')}</p>
                      <p className="text-sm text-gray-600">{t('problemSolution.solutions.growth.description')}</p>
                    </div>
                  </li>
                </ul>
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

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('testimonials.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('testimonials.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: t('testimonials.items.1.name'),
                  role: t('testimonials.items.1.role'),
                  company: t('testimonials.items.1.company'),
                  quote: t('testimonials.items.1.quote'),
                  result: t('testimonials.items.1.result'),
                },
                {
                  name: t('testimonials.items.2.name'),
                  role: t('testimonials.items.2.role'),
                  company: t('testimonials.items.2.company'),
                  quote: t('testimonials.items.2.quote'),
                  result: t('testimonials.items.2.result'),
                },
                {
                  name: t('testimonials.items.3.name'),
                  role: t('testimonials.items.3.role'),
                  company: t('testimonials.items.3.company'),
                  quote: t('testimonials.items.3.quote'),
                  result: t('testimonials.items.3.result'),
                },
              ].map((testimonial, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-brand-600 font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-green-600 font-medium">{testimonial.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('pricingPreview.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t('pricingPreview.subtitle')}
            </p>
            <div className="inline-flex items-baseline gap-1 mb-8">
              <span className="text-sm text-gray-500">{t('pricingPreview.from')}</span>
              <span className="text-5xl font-bold text-gray-900">$49</span>
              <span className="text-gray-500">/{t('pricingPreview.month')}</span>
            </div>
            <div>
              <Link href="/pricing" className="btn-primary inline-flex items-center">
                {t('pricingPreview.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t('faq.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('faq.subtitle')}
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: t('faq.items.1.question'), a: t('faq.items.1.answer') },
                { q: t('faq.items.2.question'), a: t('faq.items.2.answer') },
                { q: t('faq.items.3.question'), a: t('faq.items.3.answer') },
                { q: t('faq.items.4.question'), a: t('faq.items.4.answer') },
                { q: t('faq.items.5.question'), a: t('faq.items.5.answer') },
              ].map((faq, index) => (
                <details key={index} className="card group cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-gray-900 list-none">
                    {faq.q}
                    <ChevronDown className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.a}</p>
                </details>
              ))}
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
