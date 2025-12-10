'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Key,
  Monitor,
  Download,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Mock data - in production this would come from the API
const mockLicense = {
  key: 'A1B2-C3D4-E5F6-G7H8',
  tier: 'PROFESSIONAL',
  status: 'ACTIVE',
  maxMachines: 3,
  invoicesPerMonth: null,
  expiresAt: '2025-12-31',
  machines: [
    { id: '1', name: 'Office Desktop', lastSeen: '2024-12-10' },
    { id: '2', name: 'Laptop', lastSeen: '2024-12-09' },
  ],
};

const mockUser = {
  name: 'Juan Perez',
  email: 'juan@example.com',
  company: 'Despacho Contable Perez',
};

export default function PortalPage() {
  const t = useTranslations('portal');
  const [showLicenseKey, setShowLicenseKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const copyLicenseKey = () => {
    navigator.clipboard.writeText(mockLicense.key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const maskedKey = mockLicense.key.replace(/[A-Z0-9]/g, '*');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="container-custom">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('welcome')}, {mockUser.name}
            </h1>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* License Card */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Key className="h-5 w-5 text-brand-500" />
                    {t('license.title')}
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    {t('license.active')}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">{t('license.key')}</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg">
                        {showLicenseKey ? mockLicense.key : maskedKey}
                      </code>
                      <button
                        onClick={() => setShowLicenseKey(!showLicenseKey)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={showLicenseKey ? 'Hide' : 'Show'}
                      >
                        {showLicenseKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={copyLicenseKey}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy"
                      >
                        {copiedKey ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="text-sm text-gray-500">{t('license.plan')}</label>
                      <p className="font-medium text-gray-900">{mockLicense.tier}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">{t('license.machines')}</label>
                      <p className="font-medium text-gray-900">
                        {mockLicense.machines.length} / {mockLicense.maxMachines}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">{t('license.expires')}</label>
                      <p className="font-medium text-gray-900">{mockLicense.expiresAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Machines Card */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-brand-500" />
                    {t('machines.title')}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {mockLicense.machines.length} / {mockLicense.maxMachines} {t('machines.activated')}
                  </span>
                </div>

                {mockLicense.machines.length > 0 ? (
                  <div className="space-y-3">
                    {mockLicense.machines.map((machine) => (
                      <div
                        key={machine.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Monitor className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{machine.name}</p>
                            <p className="text-sm text-gray-500">
                              {t('machines.lastSeen')}: {machine.lastSeen}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {t('machines.noMachines')}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('quickActions.title')}
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/download"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-brand-500" />
                      <span className="font-medium">{t('quickActions.download')}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link
                    href="/portal/billing"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-brand-500" />
                      <span className="font-medium">{t('quickActions.billing')}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-brand-500" />
                      <span className="font-medium">{t('quickActions.support')}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>

              {/* Account Info */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('account.title')}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">{t('account.name')}</label>
                    <p className="font-medium text-gray-900">{mockUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">{t('account.email')}</label>
                    <p className="font-medium text-gray-900">{mockUser.email}</p>
                  </div>
                  {mockUser.company && (
                    <div>
                      <label className="text-sm text-gray-500">{t('account.company')}</label>
                      <p className="font-medium text-gray-900">{mockUser.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help */}
              <div className="card bg-brand-50 border-brand-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('help.title')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('help.description')}
                </p>
                <Link href="/contact" className="btn-secondary text-sm">
                  {t('help.contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
