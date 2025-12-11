import { describe, it, expect, vi, beforeEach } from 'vitest';

// We'll test the sitemap generation function
// The sitemap.ts file will export a default function that returns MetadataRoute.Sitemap

describe('Sitemap Generation', () => {
  const BASE_URL = 'https://contpaqi-ai-bridge.com';

  // Define expected pages that should be in the sitemap
  const expectedPages = [
    '', // home
    '/features',
    '/pricing',
    '/download',
    '/contact',
    '/terms',
    '/privacy',
    '/refunds',
  ];

  const locales = ['en', 'es'];

  // Using a simple type to avoid MetadataRoute.Sitemap complexity
  let sitemap: Array<{
    url: string;
    lastModified?: string | Date;
    changeFrequency?: string;
    priority?: number;
    alternates?: Record<string, string>;
  }>;

  beforeEach(async () => {
    // Dynamically import the sitemap to get fresh results
    vi.resetModules();
    const sitemapModule = await import('@/app/sitemap');
    const result = await sitemapModule.default();
    // Cast to array since MetadataRoute.Sitemap can be array or single entry
    sitemap = (Array.isArray(result) ? result : [result]) as typeof sitemap;
  });

  it('should return an array of sitemap entries', () => {
    expect(Array.isArray(sitemap)).toBe(true);
    expect(sitemap.length).toBeGreaterThan(0);
  });

  it('should include all public pages', () => {
    const urls = sitemap.map(entry => entry.url);

    expectedPages.forEach(page => {
      const pageUrl = `${BASE_URL}${page}`;
      expect(urls).toContain(pageUrl);
    });
  });

  it('should include Spanish versions of all pages', () => {
    const urls = sitemap.map(entry => entry.url);

    expectedPages.forEach(page => {
      const esPageUrl = `${BASE_URL}/es${page}`;
      expect(urls).toContain(esPageUrl);
    });
  });

  it('should have valid URLs starting with the base URL', () => {
    sitemap.forEach(entry => {
      expect(entry.url).toMatch(/^https:\/\/contpaqi-ai-bridge\.com/);
    });
  });

  it('should have lastModified date for all entries', () => {
    sitemap.forEach(entry => {
      expect(entry.lastModified).toBeDefined();
      expect(entry.lastModified instanceof Date).toBe(true);
    });
  });

  it('should have changeFrequency for all entries', () => {
    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

    sitemap.forEach(entry => {
      expect(entry.changeFrequency).toBeDefined();
      expect(validFrequencies).toContain(entry.changeFrequency);
    });
  });

  it('should have priority between 0 and 1 for all entries', () => {
    sitemap.forEach(entry => {
      expect(entry.priority).toBeDefined();
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    });
  });

  it('should have highest priority (1.0) for home page', () => {
    const homeEntry = sitemap.find(entry => entry.url === BASE_URL);
    expect(homeEntry).toBeDefined();
    expect(homeEntry?.priority).toBe(1.0);
  });

  it('should have high priority (0.9) for main marketing pages', () => {
    const marketingPages = ['/features', '/pricing'];

    marketingPages.forEach(page => {
      const entry = sitemap.find(e => e.url === `${BASE_URL}${page}`);
      expect(entry).toBeDefined();
      expect(entry?.priority).toBe(0.9);
    });
  });

  it('should have lower priority for legal pages', () => {
    const legalPages = ['/terms', '/privacy', '/refunds'];

    legalPages.forEach(page => {
      const entry = sitemap.find(e => e.url === `${BASE_URL}${page}`);
      expect(entry).toBeDefined();
      expect(entry?.priority).toBeLessThanOrEqual(0.5);
    });
  });

  it('should not include private routes like /portal, /api, /auth', () => {
    const urls = sitemap.map(entry => entry.url);

    const privatePatterns = ['/portal', '/api', '/auth'];

    privatePatterns.forEach(pattern => {
      const hasPrivateRoute = urls.some(url => url.includes(pattern));
      expect(hasPrivateRoute).toBe(false);
    });
  });

  it('should have correct number of entries (pages × locales)', () => {
    // Expected: each page in both English and Spanish
    const expectedCount = expectedPages.length * locales.length;
    expect(sitemap.length).toBe(expectedCount);
  });
});
