'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, Building, Send, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="container-custom max-w-4xl">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 mb-4">
                    <Mail className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('info.email.title')}
                  </h3>
                  <p className="text-gray-600">{t('info.email.value')}</p>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 mb-4">
                    <MessageSquare className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('info.support.title')}
                  </h3>
                  <p className="text-gray-600">{t('info.support.value')}</p>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 mb-4">
                    <Building className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('info.enterprise.title')}
                  </h3>
                  <p className="text-gray-600">{t('info.enterprise.value')}</p>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-2">
                {submitted ? (
                  <div className="card text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('form.success.title')}
                    </h3>
                    <p className="text-gray-600">{t('form.success.message')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="card">
                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="label">
                          {t('form.name')}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="input"
                          placeholder={t('form.namePlaceholder')}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="label">
                          {t('form.email')}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="input"
                          placeholder={t('form.emailPlaceholder')}
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="company" className="label">
                        {t('form.company')}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="input"
                        placeholder={t('form.companyPlaceholder')}
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="subject" className="label">
                        {t('form.subject')}
                      </label>
                      <select id="subject" name="subject" required className="input">
                        <option value="">{t('form.subjectPlaceholder')}</option>
                        <option value="sales">{t('form.subjects.sales')}</option>
                        <option value="support">{t('form.subjects.support')}</option>
                        <option value="enterprise">{t('form.subjects.enterprise')}</option>
                        <option value="other">{t('form.subjects.other')}</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="message" className="label">
                        {t('form.message')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="input resize-none"
                        placeholder={t('form.messagePlaceholder')}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('form.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('form.submit')}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
