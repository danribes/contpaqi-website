import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Production Build Configuration', () => {
  const rootDir = process.cwd();

  describe('Build Scripts', () => {
    it('should have build script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts.build).toBeDefined();
    });

    it('should have start script for production', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts.start).toBeDefined();
    });

    it('should have lint script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts.lint).toBeDefined();
    });

    it('should have typecheck script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts.typecheck).toBeDefined();
    });

    it('should have test script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts.test).toBeDefined();
    });
  });

  describe('Next.js Configuration', () => {
    it('should have next.config.js', () => {
      const configPath = path.join(rootDir, 'next.config.js');
      const configMjsPath = path.join(rootDir, 'next.config.mjs');
      const hasConfig = fs.existsSync(configPath) || fs.existsSync(configMjsPath);
      expect(hasConfig).toBe(true);
    });

    it('should have TypeScript config', () => {
      const tsConfigPath = path.join(rootDir, 'tsconfig.json');
      expect(fs.existsSync(tsConfigPath)).toBe(true);
    });

    it('should have strict TypeScript mode', () => {
      const tsConfigPath = path.join(rootDir, 'tsconfig.json');
      const content = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
      expect(content.compilerOptions.strict).toBe(true);
    });
  });

  describe('Environment Configuration', () => {
    it('should have .env.example file', () => {
      const envExamplePath = path.join(rootDir, '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
    });

    it('should have required environment variables documented', () => {
      const envExamplePath = path.join(rootDir, '.env.example');
      const content = fs.readFileSync(envExamplePath, 'utf-8');
      expect(content).toContain('DATABASE_URL');
      expect(content).toContain('NEXTAUTH_SECRET');
    });

    it('should not have .env files in git', () => {
      const gitignorePath = path.join(rootDir, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf-8');
      expect(content).toContain('.env');
    });
  });

  describe('Vercel Configuration', () => {
    it('should have vercel.json', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      expect(fs.existsSync(vercelPath)).toBe(true);
    });

    it('should have valid JSON in vercel.json', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      const content = fs.readFileSync(vercelPath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('should configure framework as nextjs', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
      expect(content.framework).toBe('nextjs');
    });
  });

  describe('CI/CD Configuration', () => {
    it('should have GitHub Actions workflow', () => {
      const workflowPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it('should run tests in CI', () => {
      const workflowPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
      const content = fs.readFileSync(workflowPath, 'utf-8');
      expect(content).toContain('test');
    });

    it('should run build in CI', () => {
      const workflowPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
      const content = fs.readFileSync(workflowPath, 'utf-8');
      expect(content).toContain('build');
    });
  });

  describe('Database Configuration', () => {
    it('should have Prisma schema', () => {
      const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
      expect(fs.existsSync(schemaPath)).toBe(true);
    });

    it('should have database client library', () => {
      const dbPath = path.join(rootDir, 'src', 'lib', 'db.ts');
      expect(fs.existsSync(dbPath)).toBe(true);
    });

    it('should have seed script', () => {
      const seedPath = path.join(rootDir, 'prisma', 'seed.ts');
      expect(fs.existsSync(seedPath)).toBe(true);
    });
  });

  describe('Documentation', () => {
    it('should have README.md', () => {
      const readmePath = path.join(rootDir, 'README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
    });

    it('should have DEPLOYMENT.md', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      expect(fs.existsSync(deploymentPath)).toBe(true);
    });
  });

  describe('SEO Assets', () => {
    it('should have sitemap configuration', () => {
      const sitemapPath = path.join(rootDir, 'src', 'app', 'sitemap.ts');
      expect(fs.existsSync(sitemapPath)).toBe(true);
    });

    it('should have robots configuration', () => {
      const robotsPath = path.join(rootDir, 'src', 'app', 'robots.ts');
      expect(fs.existsSync(robotsPath)).toBe(true);
    });

    it('should have favicon', () => {
      const faviconPath = path.join(rootDir, 'public', 'favicon.ico');
      expect(fs.existsSync(faviconPath)).toBe(true);
    });
  });

  describe('Security Configuration', () => {
    it('should have security headers in vercel.json', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
      expect(content.headers).toBeDefined();
    });

    it('should have X-Frame-Options header', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
      const headersString = JSON.stringify(content.headers);
      expect(headersString).toContain('X-Frame-Options');
    });

    it('should have HSTS header', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
      const headersString = JSON.stringify(content.headers);
      expect(headersString).toContain('Strict-Transport-Security');
    });
  });

  describe('Production Dependencies', () => {
    it('should have Next.js as dependency', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.dependencies.next).toBeDefined();
    });

    it('should have React as dependency', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.dependencies.react).toBeDefined();
    });

    it('should have Prisma as dependency', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.dependencies['@prisma/client']).toBeDefined();
    });

    it('should have NextAuth as dependency', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.dependencies['next-auth']).toBeDefined();
    });

    it('should have Stripe as dependency', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.dependencies.stripe).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should have global error page', () => {
      const errorPath = path.join(rootDir, 'src', 'app', 'global-error.tsx');
      expect(fs.existsSync(errorPath)).toBe(true);
    });

    it('should have Sentry configuration', () => {
      const sentryClientPath = path.join(rootDir, 'sentry.client.config.ts');
      const sentryServerPath = path.join(rootDir, 'sentry.server.config.ts');
      const hasClient = fs.existsSync(sentryClientPath);
      const hasServer = fs.existsSync(sentryServerPath);
      expect(hasClient || hasServer).toBe(true);
    });
  });
});
