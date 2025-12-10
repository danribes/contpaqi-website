import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Download,
  Monitor,
  Cpu,
  HardDrive,
  CheckCircle,
  FileText,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Download',
  description: 'Download ContPAQi AI Bridge for Windows. System requirements and installation guide.',
};

export default function DownloadPage() {
  const t = useTranslations('download');

  const systemRequirements = {
    minimum: [
      { icon: Monitor, label: t('requirements.os'), value: 'Windows 10 (64-bit)' },
      { icon: Cpu, label: t('requirements.processor'), value: 'Intel Core i5 (4 cores)' },
      { icon: HardDrive, label: t('requirements.ram'), value: '8 GB RAM' },
      { icon: HardDrive, label: t('requirements.storage'), value: '10 GB' },
    ],
    recommended: [
      { icon: Monitor, label: t('requirements.os'), value: 'Windows 11 (64-bit)' },
      { icon: Cpu, label: t('requirements.processor'), value: 'Intel Core i7 (8 cores)' },
      { icon: HardDrive, label: t('requirements.ram'), value: '16 GB RAM' },
      { icon: HardDrive, label: t('requirements.storage'), value: '20 GB SSD' },
    ],
  };

  const prerequisites = [
    'Docker Desktop 4.0+',
    '.NET 6.0 Runtime',
    'ContPAQi Comercial or ContPAQi Contabilidad',
  ];

  const installSteps = [
    t('install.steps.download'),
    t('install.steps.run'),
    t('install.steps.docker'),
    t('install.steps.activate'),
    t('install.steps.configure'),
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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#download"
                className="btn-primary text-lg py-4 px-8"
              >
                <Download className="mr-2 h-5 w-5" />
                {t('hero.downloadButton')}
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              {t('hero.version')} 1.0.0 | Windows 10/11 (64-bit)
            </p>
          </div>
        </section>

        {/* Download Section */}
        <section id="download" className="py-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Standard Download */}
              <div className="card text-center">
                <Download className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('downloads.standard.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('downloads.standard.description')}
                </p>
                <a
                  href="/downloads/ContPAQi-AI-Bridge-Setup.exe"
                  className="btn-primary w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('downloads.standard.button')}
                </a>
                <p className="text-sm text-gray-500 mt-2">~150 MB</p>
              </div>

              {/* Silent Installer */}
              <div className="card text-center">
                <Settings className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('downloads.silent.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('downloads.silent.description')}
                </p>
                <a
                  href="/downloads/ContPAQi-AI-Bridge-Silent.exe"
                  className="btn-secondary w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('downloads.silent.button')}
                </a>
                <p className="text-sm text-gray-500 mt-2">~150 MB</p>
              </div>
            </div>

            {/* Release Notes Link */}
            <div className="text-center mt-8">
              <Link
                href="/changelog"
                className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {t('downloads.releaseNotes')}
              </Link>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('requirements.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Minimum */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {t('requirements.minimum')}
                </h3>
                <ul className="space-y-4">
                  {systemRequirements.minimum.map((req, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <req.icon className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">{req.label}:</span>
                        <span className="ml-2 font-medium text-gray-900">{req.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended */}
              <div className="card border-brand-200 bg-brand-50/30">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  {t('requirements.recommended')}
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                    {t('requirements.best')}
                  </span>
                </h3>
                <ul className="space-y-4">
                  {systemRequirements.recommended.map((req, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <req.icon className="h-5 w-5 text-brand-500" />
                      <div>
                        <span className="text-sm text-gray-500">{req.label}:</span>
                        <span className="ml-2 font-medium text-gray-900">{req.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="card bg-yellow-50 border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  {t('requirements.prerequisites')}
                </h3>
                <ul className="space-y-2">
                  {prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-4 w-4 text-yellow-600" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Guide */}
        <section className="py-20">
          <div className="container-custom max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('install.title')}
            </h2>
            <div className="space-y-4">
              {installSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/docs"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                {t('install.fullGuide')} &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Need Help */}
        <section className="py-20 bg-brand-600">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('help.title')}
            </h2>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-8">
              {t('help.description')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-brand-600 shadow-lg hover:bg-gray-100 transition-colors"
            >
              {t('help.contact')}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
