import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Analytics Integration', () => {
  describe('Analytics Configuration', () => {
    it('should have analytics configuration file', () => {
      const configPath = path.join(process.cwd(), 'src', 'lib', 'analytics.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('analytics config should export trackEvent function', async () => {
      const analytics = await import('@/lib/analytics');
      expect(typeof analytics.trackEvent).toBe('function');
    });

    it('analytics config should export trackPageView function', async () => {
      const analytics = await import('@/lib/analytics');
      expect(typeof analytics.trackPageView).toBe('function');
    });
  });

  describe('Analytics Provider Component', () => {
    it('should have AnalyticsProvider component', () => {
      const providerPath = path.join(
        process.cwd(),
        'src',
        'components',
        'analytics',
        'AnalyticsProvider.tsx'
      );
      expect(fs.existsSync(providerPath)).toBe(true);
    });
  });

  describe('Event Tracking Functions', () => {
    let analytics: typeof import('@/lib/analytics');

    beforeEach(async () => {
      vi.resetModules();
      analytics = await import('@/lib/analytics');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('trackEvent should accept event name and properties', () => {
      // Should not throw when called with valid arguments
      expect(() => {
        analytics.trackEvent('button_click', { button: 'cta' });
      }).not.toThrow();
    });

    it('trackEvent should handle events without properties', () => {
      expect(() => {
        analytics.trackEvent('page_scroll');
      }).not.toThrow();
    });

    it('trackPageView should accept optional page path', () => {
      expect(() => {
        analytics.trackPageView('/pricing');
      }).not.toThrow();
    });

    it('trackPageView should work without arguments', () => {
      expect(() => {
        analytics.trackPageView();
      }).not.toThrow();
    });
  });

  describe('Predefined Events', () => {
    let analytics: typeof import('@/lib/analytics');

    beforeEach(async () => {
      vi.resetModules();
      analytics = await import('@/lib/analytics');
    });

    it('should export trackCTAClick function', () => {
      expect(typeof analytics.trackCTAClick).toBe('function');
    });

    it('should export trackCheckoutStart function', () => {
      expect(typeof analytics.trackCheckoutStart).toBe('function');
    });

    it('should export trackPurchaseComplete function', () => {
      expect(typeof analytics.trackPurchaseComplete).toBe('function');
    });

    it('should export trackSignUp function', () => {
      expect(typeof analytics.trackSignUp).toBe('function');
    });

    it('trackCTAClick should accept button identifier', () => {
      expect(() => {
        analytics.trackCTAClick('hero_get_started');
      }).not.toThrow();
    });

    it('trackCheckoutStart should accept plan info', () => {
      expect(() => {
        analytics.trackCheckoutStart('professional', 'monthly');
      }).not.toThrow();
    });

    it('trackPurchaseComplete should accept purchase details', () => {
      expect(() => {
        analytics.trackPurchaseComplete('professional', 99);
      }).not.toThrow();
    });
  });

  describe('Environment Variable Support', () => {
    it('should reference analytics domain in env.example', () => {
      const envExamplePath = path.join(process.cwd(), '.env.example');
      const content = fs.readFileSync(envExamplePath, 'utf-8');

      // Should have either Plausible or GA config
      const hasPlausible = content.includes('PLAUSIBLE');
      const hasGA = content.includes('GA_MEASUREMENT_ID');

      expect(hasPlausible || hasGA).toBe(true);
    });
  });
});
