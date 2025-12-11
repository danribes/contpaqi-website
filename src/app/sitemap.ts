import { MetadataRoute } from 'next';

const BASE_URL = 'https://contpaqi-ai-bridge.com';

// Define all public pages that should be indexed
const publicPages = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
  { path: '/features', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/download', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/refunds', changeFrequency: 'yearly' as const, priority: 0.3 },
];

// Supported locales
const locales = ['en', 'es'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Generate entries for each page in each locale
  publicPages.forEach(page => {
    // English version (default - no locale prefix)
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });

    // Spanish version
    entries.push({
      url: `${BASE_URL}/es${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  });

  return entries;
}
