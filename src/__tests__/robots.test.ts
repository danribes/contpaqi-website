import { describe, it, expect, vi, beforeEach } from 'vitest';

// We'll test the robots.txt generation function
// The robots.ts file will export a default function that returns MetadataRoute.Robots

describe('Robots.txt Generation', () => {
  const BASE_URL = 'https://contpaqi-ai-bridge.com';

  let robots: {
    rules: Array<{
      userAgent: string | string[];
      allow?: string | string[];
      disallow?: string | string[];
    }>;
    sitemap?: string | string[];
    host?: string;
  };

  beforeEach(async () => {
    // Dynamically import the robots to get fresh results
    vi.resetModules();
    const robotsModule = await import('@/app/robots');
    robots = robotsModule.default();
  });

  describe('Structure', () => {
    it('should return an object with rules array', () => {
      expect(robots).toBeDefined();
      expect(robots.rules).toBeDefined();
      expect(Array.isArray(robots.rules)).toBe(true);
    });

    it('should have at least one rule', () => {
      expect(robots.rules.length).toBeGreaterThan(0);
    });

    it('should include sitemap reference', () => {
      expect(robots.sitemap).toBeDefined();
    });
  });

  describe('Sitemap Reference', () => {
    it('should reference the correct sitemap URL', () => {
      expect(robots.sitemap).toBe(`${BASE_URL}/sitemap.xml`);
    });
  });

  describe('User Agent Rules', () => {
    it('should have a rule for all user agents (*)', () => {
      const allAgentsRule = robots.rules.find(
        rule => rule.userAgent === '*' ||
        (Array.isArray(rule.userAgent) && rule.userAgent.includes('*'))
      );
      expect(allAgentsRule).toBeDefined();
    });
  });

  describe('Allow Rules', () => {
    it('should allow crawling of root path', () => {
      const mainRule = robots.rules.find(
        rule => rule.userAgent === '*' ||
        (Array.isArray(rule.userAgent) && rule.userAgent.includes('*'))
      );

      expect(mainRule?.allow).toBeDefined();
      const allowedPaths = Array.isArray(mainRule?.allow)
        ? mainRule.allow
        : [mainRule?.allow];
      expect(allowedPaths).toContain('/');
    });
  });

  describe('Disallow Rules', () => {
    const privateRoutes = ['/portal', '/api', '/auth'];

    it('should disallow /portal routes', () => {
      const mainRule = robots.rules.find(
        rule => rule.userAgent === '*' ||
        (Array.isArray(rule.userAgent) && rule.userAgent.includes('*'))
      );

      const disallowedPaths = Array.isArray(mainRule?.disallow)
        ? mainRule.disallow
        : [mainRule?.disallow];

      expect(disallowedPaths.some(path => path?.includes('/portal'))).toBe(true);
    });

    it('should disallow /api routes', () => {
      const mainRule = robots.rules.find(
        rule => rule.userAgent === '*' ||
        (Array.isArray(rule.userAgent) && rule.userAgent.includes('*'))
      );

      const disallowedPaths = Array.isArray(mainRule?.disallow)
        ? mainRule.disallow
        : [mainRule?.disallow];

      expect(disallowedPaths.some(path => path?.includes('/api'))).toBe(true);
    });

    it('should disallow /auth routes', () => {
      const mainRule = robots.rules.find(
        rule => rule.userAgent === '*' ||
        (Array.isArray(rule.userAgent) && rule.userAgent.includes('*'))
      );

      const disallowedPaths = Array.isArray(mainRule?.disallow)
        ? mainRule.disallow
        : [mainRule?.disallow];

      expect(disallowedPaths.some(path => path?.includes('/auth'))).toBe(true);
    });

    it('should have at least 3 disallowed paths for private routes', () => {
      const mainRule = robots.rules.find(
        rule => rule.userAgent === '*' ||
        (Array.isArray(rule.userAgent) && rule.userAgent.includes('*'))
      );

      const disallowedPaths = Array.isArray(mainRule?.disallow)
        ? mainRule.disallow
        : [mainRule?.disallow];

      expect(disallowedPaths.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Security Considerations', () => {
    it('should not expose internal paths in allow rules', () => {
      const mainRule = robots.rules.find(
        rule => rule.userAgent === '*' ||
        (Array.isArray(rule.userAgent) && rule.userAgent.includes('*'))
      );

      const allowedPaths = Array.isArray(mainRule?.allow)
        ? mainRule.allow
        : [mainRule?.allow];

      const sensitivePatterns = ['/admin', '/dashboard', '/internal', '/_next'];

      allowedPaths.forEach(path => {
        sensitivePatterns.forEach(pattern => {
          expect(path).not.toContain(pattern);
        });
      });
    });
  });
});
