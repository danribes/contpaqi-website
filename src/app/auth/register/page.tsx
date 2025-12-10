'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { User, Mail, Lock, Building, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const company = formData.get('company') as string;
    const acceptTerms = formData.get('acceptTerms');

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError(t('register.acceptTermsRequired'));
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (err) {
      setError(t('register.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="card">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('register.success.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('register.success.message')}
              </p>
              <Link href="/auth/login" className="btn-primary">
                {t('register.success.login')}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('register.title')}
            </h1>
            <p className="text-gray-600">
              {t('register.subtitle')}
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="label">
                  {t('register.name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="input pl-10"
                    placeholder={t('register.namePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  {t('register.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="input pl-10"
                    placeholder={t('register.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="label">
                  {t('register.company')}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="input pl-10"
                    placeholder={t('register.companyPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label">
                  {t('register.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    className="input pl-10"
                    placeholder={t('register.passwordPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  {t('register.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    className="input pl-10"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                  />
                </div>
              </div>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  className="mt-1 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-600">
                  {t('register.acceptTerms')}{' '}
                  <Link href="/terms" className="text-brand-600 hover:text-brand-700">
                    {t('register.termsLink')}
                  </Link>{' '}
                  {t('register.and')}{' '}
                  <Link href="/privacy" className="text-brand-600 hover:text-brand-700">
                    {t('register.privacyLink')}
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('register.creating')}
                  </>
                ) : (
                  <>
                    {t('register.createAccount')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                {t('register.haveAccount')}{' '}
                <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">
                  {t('register.signIn')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
