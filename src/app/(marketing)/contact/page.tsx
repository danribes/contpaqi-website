'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, Building, Send, Loader2, Phone, AlertCircle, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setError(null);
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
          <div className="container-custom max-w-5xl">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 mb-4">
                    <Mail className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('info.email.title')}
                  </h3>
                  <p className="text-gray-600">{t('info.email.value')}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 mb-4">
                    <MessageSquare className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('info.support.title')}
                  </h3>
                  <p className="text-gray-600">{t('info.support.value')}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 mb-4">
                    <Building className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('info.enterprise.title')}
                  </h3>
                  <p className="text-gray-600">{t('info.enterprise.value')}</p>
                </div>

                {/* Business Hours */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4">
                    <Clock className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Business Hours
                  </h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>Monday - Friday: 9am - 6pm CST</p>
                    <p>Saturday: 10am - 2pm CST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-2">
                {submitted ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-12 px-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('form.success.title')}
                    </h3>
                    <p className="text-gray-600 mb-6">{t('form.success.message')}</p>
                    <button
                      onClick={handleSendAnother}
                      className="btn-secondary"
                    >
                      {t('form.success.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    {error && (
                      <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

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

                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
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
                      <div>
                        <label htmlFor="phone" className="label">
                          {t('form.phone')}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="input pl-10"
                            placeholder={t('form.phonePlaceholder')}
                          />
                        </div>
                      </div>
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
                        minLength={10}
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
