'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle,
  Loader2,
  Package,
} from 'lucide-react';

interface Machine {
  id: string;
  name: string | null;
  fingerprint: string;
  lastSeen: string | null;
  activatedAt: string;
}

interface License {
  id: string;
  key: string;
  tier: string;
  status: string;
  maxMachines: number;
  invoicesPerMonth: number | null;
  expiresAt: string | null;
  machines: Machine[];
}

interface User {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
}

interface PortalData {
  user: User;
  license: License | null;
}

export default function PortalPage() {
  const t = useTranslations('portal');
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLicenseKey, setShowLicenseKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/portal/user');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const copyLicenseKey = () => {
    if (data?.license?.key) {
      navigator.clipboard.writeText(data.license.key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const maskKey = (key: string) => {
    return key.replace(/[A-Z0-9]/g, '*');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error || 'Failed to load data'}</span>
        </div>
      </div>
    );
  }

  const { user, license } = data;

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {t('welcome')}, {user.name || user.email}
        </h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* License Card */}
          {license ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Key className="h-5 w-5 text-brand-500" />
                  {t('license.title')}
                </h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    license.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : license.status === 'TRIAL'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {license.status === 'ACTIVE'
                    ? t('license.active')
                    : license.status === 'TRIAL'
                    ? t('license.trial')
                    : license.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">{t('license.key')}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg font-mono text-sm lg:text-lg overflow-x-auto">
                      {showLicenseKey ? license.key : maskKey(license.key)}
                    </code>
                    <button
                      onClick={() => setShowLicenseKey(!showLicenseKey)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      title={showLicenseKey ? 'Hide' : 'Show'}
                    >
                      {showLicenseKey ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={copyLicenseKey}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      title="Copy"
                    >
                      {copiedKey ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="text-sm text-gray-500">{t('license.plan')}</label>
                    <p className="font-medium text-gray-900">{license.tier}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">{t('license.machines')}</label>
                    <p className="font-medium text-gray-900">
                      {license.machines.length} / {license.maxMachines}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">{t('license.expires')}</label>
                    <p className="font-medium text-gray-900">
                      {formatDate(license.expiresAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('license.noLicense')}
                </h3>
                <p className="text-gray-500 mb-4">{t('license.noLicenseMessage')}</p>
                <Link href="/pricing" className="btn-primary inline-flex">
                  {t('license.getPlan')}
                </Link>
              </div>
            </div>
          )}

          {/* Machines Card */}
          {license && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-brand-500" />
                  {t('machines.title')}
                </h2>
                <span className="text-sm text-gray-500">
                  {license.machines.length} / {license.maxMachines} {t('machines.activated')}
                </span>
              </div>

              {license.machines.length > 0 ? (
                <div className="space-y-3">
                  {license.machines.map((machine) => (
                    <div
                      key={machine.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Monitor className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {machine.name || 'Unknown Machine'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('machines.lastSeen')}: {formatDate(machine.lastSeen)}
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title={t('machines.deactivate')}
                      >
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
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('account.title')}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">{t('account.name')}</label>
                <p className="font-medium text-gray-900">{user.name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t('account.email')}</label>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              {user.company && (
                <div>
                  <label className="text-sm text-gray-500">{t('account.company')}</label>
                  <p className="font-medium text-gray-900">{user.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-brand-50 rounded-xl border border-brand-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{t('help.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('help.description')}</p>
            <Link href="/contact" className="btn-secondary text-sm">
              {t('help.contact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
