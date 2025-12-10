import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ContPAQi AI Bridge - AI-Powered Invoice Processing',
    template: '%s | ContPAQi AI Bridge',
  },
  description:
    'Automate your Mexican invoice processing with AI. Extract data from PDFs, validate RFC and CFDI compliance, and post directly to ContPAQi.',
  keywords: [
    'ContPAQi',
    'AI',
    'invoice processing',
    'OCR',
    'Mexican accounting',
    'CFDI',
    'RFC validation',
    'automation',
    'facturación electrónica',
  ],
  authors: [{ name: 'ContPAQi AI Bridge' }],
  creator: 'ContPAQi AI Bridge',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_MX',
    url: 'https://contpaqi-ai-bridge.com',
    siteName: 'ContPAQi AI Bridge',
    title: 'ContPAQi AI Bridge - AI-Powered Invoice Processing',
    description:
      'Automate your Mexican invoice processing with AI. Extract data from PDFs and post directly to ContPAQi.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ContPAQi AI Bridge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContPAQi AI Bridge - AI-Powered Invoice Processing',
    description:
      'Automate your Mexican invoice processing with AI.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
