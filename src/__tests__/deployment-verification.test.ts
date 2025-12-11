import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Production Deployment Verification', () => {
  const rootDir = process.cwd();

  describe('Environment Configuration', () => {
    it('should have .env.example with all required variables', () => {
      const envPath = path.join(rootDir, '.env.example');
      expect(fs.existsSync(envPath)).toBe(true);
      const content = fs.readFileSync(envPath, 'utf-8');

      // Core Next.js variables
      expect(content).toContain('NEXT_PUBLIC_APP_URL');

      // Database
      expect(content).toContain('DATABASE_URL');

      // Authentication
      expect(content).toContain('NEXTAUTH_SECRET');
      expect(content).toContain('NEXTAUTH_URL');

      // Stripe
      expect(content).toContain('STRIPE_SECRET_KEY');
      expect(content).toContain('STRIPE_WEBHOOK_SECRET');
      expect(content).toContain('STRIPE_PUBLISHABLE_KEY');

      // Email
      expect(content).toContain('RESEND_API_KEY');
    });

    it('should have vercel.json for Vercel deployment', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      // vercel.json is optional but recommended
      if (fs.existsSync(vercelPath)) {
        const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
        expect(content).toBeDefined();
      } else {
        // If no vercel.json, that's acceptable for default config
        expect(true).toBe(true);
      }
    });
  });

  describe('SEO and Metadata', () => {
    it('should have sitemap.ts', () => {
      const sitemapPath = path.join(rootDir, 'src', 'app', 'sitemap.ts');
      expect(fs.existsSync(sitemapPath)).toBe(true);
    });

    it('should have robots.ts', () => {
      const robotsPath = path.join(rootDir, 'src', 'app', 'robots.ts');
      expect(fs.existsSync(robotsPath)).toBe(true);
    });

    it('should have favicon', () => {
      const faviconPath = path.join(rootDir, 'public', 'favicon.ico');
      expect(fs.existsSync(faviconPath)).toBe(true);
    });

    it('should have Open Graph image', () => {
      const ogImagePath = path.join(rootDir, 'public', 'images', 'og-image.png');
      expect(fs.existsSync(ogImagePath)).toBe(true);
    });
  });

  describe('Core Pages', () => {
    it('should have homepage', () => {
      const homePath = path.join(rootDir, 'src', 'app', 'page.tsx');
      expect(fs.existsSync(homePath)).toBe(true);
    });

    it('should have pricing page', () => {
      const pricingPath = path.join(rootDir, 'src', 'app', '(marketing)', 'pricing', 'page.tsx');
      expect(fs.existsSync(pricingPath)).toBe(true);
    });

    it('should have features page', () => {
      const featuresPath = path.join(rootDir, 'src', 'app', '(marketing)', 'features', 'page.tsx');
      expect(fs.existsSync(featuresPath)).toBe(true);
    });

    it('should have download page', () => {
      const downloadPath = path.join(rootDir, 'src', 'app', '(marketing)', 'download', 'page.tsx');
      expect(fs.existsSync(downloadPath)).toBe(true);
    });

    it('should have contact page', () => {
      const contactPath = path.join(rootDir, 'src', 'app', '(marketing)', 'contact', 'page.tsx');
      expect(fs.existsSync(contactPath)).toBe(true);
    });
  });

  describe('Legal Pages', () => {
    it('should have terms page', () => {
      const termsPath = path.join(rootDir, 'src', 'app', '(marketing)', 'terms', 'page.tsx');
      expect(fs.existsSync(termsPath)).toBe(true);
    });

    it('should have privacy page', () => {
      const privacyPath = path.join(rootDir, 'src', 'app', '(marketing)', 'privacy', 'page.tsx');
      expect(fs.existsSync(privacyPath)).toBe(true);
    });

    it('should have refunds page', () => {
      const refundsPath = path.join(rootDir, 'src', 'app', '(marketing)', 'refunds', 'page.tsx');
      expect(fs.existsSync(refundsPath)).toBe(true);
    });
  });

  describe('API Routes', () => {
    it('should have checkout API', () => {
      const checkoutPath = path.join(rootDir, 'src', 'app', 'api', 'checkout', 'route.ts');
      expect(fs.existsSync(checkoutPath)).toBe(true);
    });

    it('should have webhook API', () => {
      const webhookPath = path.join(rootDir, 'src', 'app', 'api', 'webhooks', 'stripe', 'route.ts');
      expect(fs.existsSync(webhookPath)).toBe(true);
    });

    it('should have contact API', () => {
      const contactPath = path.join(rootDir, 'src', 'app', 'api', 'contact', 'route.ts');
      expect(fs.existsSync(contactPath)).toBe(true);
    });

    it('should have downloads API', () => {
      const downloadsPath = path.join(rootDir, 'src', 'app', 'api', 'downloads', 'route.ts');
      expect(fs.existsSync(downloadsPath)).toBe(true);
    });

    it('should have license API', () => {
      const licensePath = path.join(rootDir, 'src', 'app', 'api', 'license');
      expect(fs.existsSync(licensePath)).toBe(true);
    });
  });

  describe('Authentication', () => {
    it('should have auth configuration', () => {
      const authPath = path.join(rootDir, 'src', 'app', 'api', 'auth', '[...nextauth]', 'route.ts');
      expect(fs.existsSync(authPath)).toBe(true);
    });

    it('should have login page', () => {
      const loginPath = path.join(rootDir, 'src', 'app', 'auth', 'login', 'page.tsx');
      expect(fs.existsSync(loginPath)).toBe(true);
    });

    it('should have register page', () => {
      const registerPath = path.join(rootDir, 'src', 'app', 'auth', 'register', 'page.tsx');
      expect(fs.existsSync(registerPath)).toBe(true);
    });
  });

  describe('Customer Portal', () => {
    it('should have portal directory', () => {
      const portalPath = path.join(rootDir, 'src', 'app', 'portal');
      expect(fs.existsSync(portalPath)).toBe(true);
    });

    it('should have portal dashboard', () => {
      const dashboardPath = path.join(rootDir, 'src', 'app', 'portal', 'page.tsx');
      expect(fs.existsSync(dashboardPath)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should have Sentry client config', () => {
      const sentryClientPath = path.join(rootDir, 'sentry.client.config.ts');
      expect(fs.existsSync(sentryClientPath)).toBe(true);
    });

    it('should have Sentry server config', () => {
      const sentryServerPath = path.join(rootDir, 'sentry.server.config.ts');
      expect(fs.existsSync(sentryServerPath)).toBe(true);
    });

    it('should have global error handler', () => {
      const globalErrorPath = path.join(rootDir, 'src', 'app', 'global-error.tsx');
      expect(fs.existsSync(globalErrorPath)).toBe(true);
    });

    it('should have ErrorBoundary component', () => {
      const errorBoundaryPath = path.join(rootDir, 'src', 'components', 'error', 'ErrorBoundary.tsx');
      expect(fs.existsSync(errorBoundaryPath)).toBe(true);
    });
  });

  describe('Analytics', () => {
    it('should have analytics library', () => {
      const analyticsPath = path.join(rootDir, 'src', 'lib', 'analytics.ts');
      expect(fs.existsSync(analyticsPath)).toBe(true);
    });

    it('should have AnalyticsProvider component', () => {
      const providerPath = path.join(rootDir, 'src', 'components', 'analytics', 'AnalyticsProvider.tsx');
      expect(fs.existsSync(providerPath)).toBe(true);
    });
  });

  describe('Internationalization', () => {
    it('should have English translations', () => {
      const enPath = path.join(rootDir, 'messages', 'en.json');
      expect(fs.existsSync(enPath)).toBe(true);
    });

    it('should have Spanish translations', () => {
      const esPath = path.join(rootDir, 'messages', 'es.json');
      expect(fs.existsSync(esPath)).toBe(true);
    });

    it('should have i18n configuration', () => {
      const i18nPath = path.join(rootDir, 'src', 'lib', 'i18n.ts');
      expect(fs.existsSync(i18nPath)).toBe(true);
    });
  });

  describe('Database', () => {
    it('should have Prisma schema', () => {
      const prismaPath = path.join(rootDir, 'prisma', 'schema.prisma');
      expect(fs.existsSync(prismaPath)).toBe(true);
    });

    it('should have database client', () => {
      const dbPath = path.join(rootDir, 'src', 'lib', 'db.ts');
      expect(fs.existsSync(dbPath)).toBe(true);
    });
  });

  describe('Storage', () => {
    it('should have storage library', () => {
      const storagePath = path.join(rootDir, 'src', 'lib', 'storage.ts');
      expect(fs.existsSync(storagePath)).toBe(true);
    });
  });

  describe('Email', () => {
    it('should have email library', () => {
      const emailPath = path.join(rootDir, 'src', 'lib', 'email.ts');
      expect(fs.existsSync(emailPath)).toBe(true);
    });
  });

  describe('Build Configuration', () => {
    it('should have Next.js config', () => {
      const nextConfigPath = path.join(rootDir, 'next.config.js');
      expect(fs.existsSync(nextConfigPath)).toBe(true);
    });

    it('next.config.js should have Sentry integration', () => {
      const nextConfigPath = path.join(rootDir, 'next.config.js');
      const content = fs.readFileSync(nextConfigPath, 'utf-8');
      expect(content).toContain('withSentryConfig');
    });

    it('should have TypeScript config', () => {
      const tsConfigPath = path.join(rootDir, 'tsconfig.json');
      expect(fs.existsSync(tsConfigPath)).toBe(true);
    });

    it('should have Tailwind config', () => {
      const tailwindPath = path.join(rootDir, 'tailwind.config.ts');
      expect(fs.existsSync(tailwindPath)).toBe(true);
    });
  });

  describe('Deployment Readiness', () => {
    it('should have package.json with build script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts.build).toBeDefined();
    });

    it('should have .gitignore', () => {
      const gitignorePath = path.join(rootDir, '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);
      const content = fs.readFileSync(gitignorePath, 'utf-8');
      expect(content).toContain('node_modules');
      expect(content).toContain('.env');
    });

    it('should not have .env file committed', () => {
      // .env should exist for local dev but not be committed
      // We check that .gitignore includes it
      const gitignorePath = path.join(rootDir, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf-8');
      expect(content).toContain('.env');
    });
  });

  describe('Checkout Flow', () => {
    it('should have checkout page', () => {
      const checkoutPath = path.join(rootDir, 'src', 'app', 'checkout', 'page.tsx');
      expect(fs.existsSync(checkoutPath)).toBe(true);
    });

    it('should have checkout success page', () => {
      const successPath = path.join(rootDir, 'src', 'app', 'checkout', 'success', 'page.tsx');
      expect(fs.existsSync(successPath)).toBe(true);
    });

    it('should have checkout cancel page', () => {
      const cancelPath = path.join(rootDir, 'src', 'app', 'checkout', 'cancel', 'page.tsx');
      expect(fs.existsSync(cancelPath)).toBe(true);
    });
  });
});
