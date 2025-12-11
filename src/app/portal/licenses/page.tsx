'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Key,
  Monitor,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Loader2,
  Package,
  Calendar,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Machine {
  id: string;
  name: string | null;
  fingerprint: string;
  lastSeenAt: string | null;
  createdAt: string;
}

interface License {
  id: string;
  key: string;
  tier: string;
  status: string;
  maxMachines: number;
  invoicesPerMonth: number | null;
  expiresAt: string | null;
  activatedAt: string | null;
  createdAt: string;
  machines: Machine[];
}

export default function LicensesPage() {
  const t = useTranslations('portal');
  const tLicenses = useTranslations('portal.licensesPage');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLicenses, setExpandedLicenses] = useState<Set<string>>(new Set());
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState<string | null>(null);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/license/status');
      if (!response.ok) {
        throw new Error('Failed to fetch licenses');
      }
      const data = await response.json();
      setLicenses(data.licenses);
      // Auto-expand active/trial licenses
      const activeLicenses = data.licenses
        .filter((l: License) => l.status === 'ACTIVE' || l.status === 'TRIAL')
        .map((l: License) => l.id);
      setExpandedLicenses(new Set(activeLicenses));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleLicenseExpanded = (licenseId: string) => {
    setExpandedLicenses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(licenseId)) {
        newSet.delete(licenseId);
      } else {
        newSet.add(licenseId);
      }
      return newSet;
    });
  };

  const toggleKeyVisibility = (licenseId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(licenseId)) {
        newSet.delete(licenseId);
      } else {
        newSet.add(licenseId);
      }
      return newSet;
    });
  };

  const copyKey = (key: string, licenseId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(licenseId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    // Show first 4 and last 4 characters
    if (key.length <= 8) return key;
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deactivateMachine = async (machineId: string) => {
    if (!confirm(tLicenses('confirmDeactivate'))) return;

    setDeactivating(machineId);
    setDeactivateError(null);

    try {
      const response = await fetch('/api/license/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machineId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to deactivate');
      }

      // Refresh licenses
      await fetchLicenses();
    } catch (err) {
      setDeactivateError(err instanceof Error ? err.message : 'Failed to deactivate');
    } finally {
      setDeactivating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'TRIAL':
        return 'bg-yellow-100 text-yellow-700';
      case 'EXPIRED':
        return 'bg-red-100 text-red-700';
      case 'REVOKED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return t('license.active');
      case 'TRIAL':
        return t('license.trial');
      case 'EXPIRED':
        return tLicenses('status.expired');
      case 'REVOKED':
        return tLicenses('status.revoked');
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {tLicenses('title')}
        </h1>
        <p className="text-gray-600">{tLicenses('subtitle')}</p>
      </div>

      {/* Deactivation Error */}
      {deactivateError && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{deactivateError}</span>
        </div>
      )}

      {/* Licenses List */}
      {licenses.length > 0 ? (
        <div className="space-y-6">
          {licenses.map((license) => {
            const isExpanded = expandedLicenses.has(license.id);
            const isKeyVisible = visibleKeys.has(license.id);
            const isActive = license.status === 'ACTIVE' || license.status === 'TRIAL';

            return (
              <div
                key={license.id}
                className={`bg-white rounded-xl shadow-sm border ${
                  isActive ? 'border-brand-200' : 'border-gray-100'
                } overflow-hidden`}
              >
                {/* License Header */}
                <div
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-brand-50/30' : ''
                  }`}
                  onClick={() => toggleLicenseExpanded(license.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-brand-100' : 'bg-gray-100'
                        }`}
                      >
                        <Key
                          className={`h-6 w-6 ${
                            isActive ? 'text-brand-600' : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{license.tier}</h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              license.status
                            )}`}
                          >
                            {getStatusText(license.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {tLicenses('createdAt')}: {formatDate(license.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-500">{t('license.machines')}</p>
                        <p className="font-medium text-gray-900">
                          {license.machines.length} / {license.maxMachines}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* License Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6">
                    {/* License Key */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('license.key')}
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-gray-100 px-4 py-2.5 rounded-lg font-mono text-sm overflow-x-auto">
                          {isKeyVisible ? license.key : maskKey(license.key)}
                        </code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleKeyVisibility(license.id);
                          }}
                          className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title={isKeyVisible ? tLicenses('hideKey') : tLicenses('showKey')}
                        >
                          {isKeyVisible ? (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyKey(license.key, license.id);
                          }}
                          className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title={tLicenses('copyKey')}
                        >
                          {copiedKey === license.id ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* License Info Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm">{t('license.plan')}</span>
                        </div>
                        <p className="font-medium text-gray-900">{license.tier}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm">{t('license.machines')}</span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {license.machines.length} / {license.maxMachines}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{tLicenses('invoicesLimit')}</span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {license.invoicesPerMonth ?? tLicenses('unlimited')}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{t('license.expires')}</span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatDate(license.expiresAt)}
                        </p>
                      </div>
                    </div>

                    {/* Machines Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        {t('machines.title')} ({license.machines.length})
                      </h4>
                      {license.machines.length > 0 ? (
                        <div className="space-y-3">
                          {license.machines.map((machine) => (
                            <div
                              key={machine.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Monitor className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {machine.name || tLicenses('unknownMachine')}
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500">
                                    <span>
                                      {tLicenses('activatedOn')}:{' '}
                                      {formatDate(machine.createdAt)}
                                    </span>
                                    <span className="hidden sm:inline">|</span>
                                    <span>
                                      {t('machines.lastSeen')}:{' '}
                                      {formatDateTime(machine.lastSeenAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deactivateMachine(machine.id);
                                }}
                                disabled={deactivating === machine.id}
                                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                                title={t('machines.deactivate')}
                              >
                                {deactivating === machine.id ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <Monitor className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">{t('machines.noMachines')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* No Licenses State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {t('license.noLicense')}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {t('license.noLicenseMessage')}
          </p>
          <Link href="/pricing" className="btn-primary inline-flex">
            {t('license.getPlan')}
          </Link>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-brand-50 rounded-xl border border-brand-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">{tLicenses('help.title')}</h3>
        <p className="text-sm text-gray-600 mb-4">{tLicenses('help.description')}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-secondary text-sm">
            {t('help.contact')}
          </Link>
          <Link href="/download" className="btn-ghost text-sm">
            {tLicenses('help.downloadGuide')}
          </Link>
        </div>
      </div>
    </div>
  );
}
