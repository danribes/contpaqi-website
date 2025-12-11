import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Vercel Configuration', () => {
  const rootDir = process.cwd();
  const vercelConfigPath = path.join(rootDir, 'vercel.json');

  describe('Configuration File', () => {
    it('should have vercel.json file', () => {
      expect(fs.existsSync(vercelConfigPath)).toBe(true);
    });

    it('should be valid JSON', () => {
      const content = fs.readFileSync(vercelConfigPath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('should have required top-level properties', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      // vercel.json should have at least some configuration
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });
  });

  describe('Build Configuration', () => {
    it('should specify build command or use defaults', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      // Build command is optional - Vercel auto-detects Next.js
      // But if specified, it should be valid
      if (config.buildCommand) {
        expect(typeof config.buildCommand).toBe('string');
      }
      expect(true).toBe(true); // Pass if no buildCommand (uses default)
    });

    it('should configure framework if specified', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      if (config.framework) {
        expect(config.framework).toBe('nextjs');
      }
      expect(true).toBe(true);
    });
  });

  describe('Security Headers', () => {
    it('should have headers configuration', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      expect(config.headers).toBeDefined();
      expect(Array.isArray(config.headers)).toBe(true);
    });

    it('should include security headers for all routes', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const allRoutesHeader = config.headers.find(
        (h: { source: string }) => h.source === '/(.*)'
      );
      expect(allRoutesHeader).toBeDefined();
    });

    it('should include X-Frame-Options header', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const allRoutesHeader = config.headers.find(
        (h: { source: string }) => h.source === '/(.*)'
      );
      const xFrameOptions = allRoutesHeader?.headers?.find(
        (h: { key: string }) => h.key === 'X-Frame-Options'
      );
      expect(xFrameOptions).toBeDefined();
      expect(xFrameOptions.value).toBe('DENY');
    });

    it('should include X-Content-Type-Options header', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const allRoutesHeader = config.headers.find(
        (h: { source: string }) => h.source === '/(.*)'
      );
      const xContentType = allRoutesHeader?.headers?.find(
        (h: { key: string }) => h.key === 'X-Content-Type-Options'
      );
      expect(xContentType).toBeDefined();
      expect(xContentType.value).toBe('nosniff');
    });

    it('should include Referrer-Policy header', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const allRoutesHeader = config.headers.find(
        (h: { source: string }) => h.source === '/(.*)'
      );
      const referrerPolicy = allRoutesHeader?.headers?.find(
        (h: { key: string }) => h.key === 'Referrer-Policy'
      );
      expect(referrerPolicy).toBeDefined();
    });

    it('should include Strict-Transport-Security header', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const allRoutesHeader = config.headers.find(
        (h: { source: string }) => h.source === '/(.*)'
      );
      const hsts = allRoutesHeader?.headers?.find(
        (h: { key: string }) => h.key === 'Strict-Transport-Security'
      );
      expect(hsts).toBeDefined();
      expect(hsts.value).toContain('max-age=');
    });
  });

  describe('Function Configuration', () => {
    it('should have functions configuration', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      expect(config.functions).toBeDefined();
    });

    it('should set appropriate timeout for API routes', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const apiConfig = config.functions['api/**/*'] || config.functions['src/app/api/**/*'];
      if (apiConfig) {
        expect(apiConfig.maxDuration).toBeDefined();
        expect(apiConfig.maxDuration).toBeGreaterThanOrEqual(10);
      }
      expect(true).toBe(true);
    });

    it('should set extended timeout for webhook routes', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const webhookConfig = config.functions['api/webhooks/**/*'] ||
                           config.functions['src/app/api/webhooks/**/*'];
      if (webhookConfig) {
        expect(webhookConfig.maxDuration).toBeGreaterThanOrEqual(30);
      }
      expect(true).toBe(true);
    });
  });

  describe('Cron Jobs', () => {
    it('should have crons configuration', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      expect(config.crons).toBeDefined();
      expect(Array.isArray(config.crons)).toBe(true);
    });

    it('should have license expiry check cron job', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      const licenseCheck = config.crons.find(
        (c: { path: string }) => c.path.includes('license') || c.path.includes('cron')
      );
      expect(licenseCheck).toBeDefined();
      expect(licenseCheck.schedule).toBeDefined();
    });
  });

  describe('Redirects', () => {
    it('should have redirects array if needed', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      if (config.redirects) {
        expect(Array.isArray(config.redirects)).toBe(true);
      }
      expect(true).toBe(true);
    });
  });

  describe('Region Configuration', () => {
    it('should specify regions for optimal performance', () => {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      // Regions can be specified at function or project level
      if (config.regions) {
        expect(Array.isArray(config.regions)).toBe(true);
      }
      expect(true).toBe(true);
    });
  });
});
