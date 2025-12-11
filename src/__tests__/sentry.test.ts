import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Sentry Error Monitoring', () => {
  const rootDir = process.cwd();

  describe('Configuration Files', () => {
    it('should have sentry.client.config.ts in root', () => {
      const configPath = path.join(rootDir, 'sentry.client.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should have sentry.server.config.ts in root', () => {
      const configPath = path.join(rootDir, 'sentry.server.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should have instrumentation.ts in src', () => {
      const configPath = path.join(rootDir, 'src', 'instrumentation.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });
  });

  describe('Client Configuration', () => {
    it('sentry.client.config.ts should import Sentry', () => {
      const configPath = path.join(rootDir, 'sentry.client.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      expect(content).toContain('@sentry/nextjs');
    });

    it('sentry.client.config.ts should call Sentry.init', () => {
      const configPath = path.join(rootDir, 'sentry.client.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      expect(content).toContain('Sentry.init');
    });

    it('sentry.client.config.ts should reference DSN from environment', () => {
      const configPath = path.join(rootDir, 'sentry.client.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      const hasDSN = content.includes('SENTRY_DSN') || content.includes('NEXT_PUBLIC_SENTRY_DSN');
      expect(hasDSN).toBe(true);
    });
  });

  describe('Server Configuration', () => {
    it('sentry.server.config.ts should import Sentry', () => {
      const configPath = path.join(rootDir, 'sentry.server.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      expect(content).toContain('@sentry/nextjs');
    });

    it('sentry.server.config.ts should call Sentry.init', () => {
      const configPath = path.join(rootDir, 'sentry.server.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      expect(content).toContain('Sentry.init');
    });
  });

  describe('Error Boundary Component', () => {
    it('should have ErrorBoundary component', () => {
      const componentPath = path.join(
        rootDir,
        'src',
        'components',
        'error',
        'ErrorBoundary.tsx'
      );
      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it('ErrorBoundary should use Sentry for error reporting', () => {
      const componentPath = path.join(
        rootDir,
        'src',
        'components',
        'error',
        'ErrorBoundary.tsx'
      );
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toContain('@sentry/nextjs');
    });
  });

  describe('Global Error Handler', () => {
    it('should have global-error.tsx in app directory', () => {
      const errorPath = path.join(rootDir, 'src', 'app', 'global-error.tsx');
      expect(fs.existsSync(errorPath)).toBe(true);
    });

    it('global-error.tsx should use Sentry', () => {
      const errorPath = path.join(rootDir, 'src', 'app', 'global-error.tsx');
      const content = fs.readFileSync(errorPath, 'utf-8');
      expect(content).toContain('@sentry/nextjs');
    });
  });

  describe('Environment Variables', () => {
    it('.env.example should have SENTRY_DSN', () => {
      const envPath = path.join(rootDir, '.env.example');
      const content = fs.readFileSync(envPath, 'utf-8');
      expect(content).toContain('SENTRY_DSN');
    });

    it('.env.example should have SENTRY_AUTH_TOKEN', () => {
      const envPath = path.join(rootDir, '.env.example');
      const content = fs.readFileSync(envPath, 'utf-8');
      expect(content).toContain('SENTRY_AUTH_TOKEN');
    });
  });

  describe('Next.js Configuration', () => {
    it('next.config.js should have Sentry webpack plugin', () => {
      const configPath = path.join(rootDir, 'next.config.js');
      const content = fs.readFileSync(configPath, 'utf-8');
      const hasSentry = content.includes('withSentryConfig') || content.includes('@sentry/nextjs');
      expect(hasSentry).toBe(true);
    });
  });
});
