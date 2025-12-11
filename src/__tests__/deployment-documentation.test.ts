import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Deployment Documentation', () => {
  const rootDir = process.cwd();

  describe('DEPLOYMENT.md File', () => {
    it('should have DEPLOYMENT.md file', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      expect(fs.existsSync(deploymentPath)).toBe(true);
    });

    it('should have table of contents', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('## Table of Contents');
    });

    it('should have prerequisites section', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('Prerequisites');
    });
  });

  describe('Vercel Setup Instructions', () => {
    it('should have Vercel deployment section', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('Vercel');
    });

    it('should explain project import', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content.toLowerCase()).toContain('import');
    });
  });

  describe('Environment Variables Reference', () => {
    it('should document DATABASE_URL', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('DATABASE_URL');
    });

    it('should document NEXTAUTH_SECRET', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('NEXTAUTH_SECRET');
    });

    it('should document NEXTAUTH_URL', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('NEXTAUTH_URL');
    });

    it('should document Stripe variables', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('STRIPE_SECRET_KEY');
      expect(content).toContain('STRIPE_PUBLISHABLE_KEY');
      expect(content).toContain('STRIPE_WEBHOOK_SECRET');
    });

    it('should document Resend variables', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('RESEND_API_KEY');
    });

    it('should document Sentry DSN', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('SENTRY_DSN');
    });
  });

  describe('Service Configuration Guides', () => {
    it('should have Stripe configuration guide', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('Stripe');
      expect(content.toLowerCase()).toContain('webhook');
    });

    it('should have database setup instructions', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content.toLowerCase()).toContain('database');
      expect(content.toLowerCase()).toContain('postgresql');
    });

    it('should have email setup instructions', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('Resend');
      expect(content.toLowerCase()).toContain('email');
    });
  });

  describe('Domain and SSL', () => {
    it('should have domain configuration section', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content.toLowerCase()).toContain('domain');
    });

    it('should mention SSL/HTTPS', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      const hasSSL = content.toLowerCase().includes('ssl') || content.toLowerCase().includes('https');
      expect(hasSSL).toBe(true);
    });
  });

  describe('Post-Deployment Verification', () => {
    it('should have verification checklist', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content.toLowerCase()).toContain('verification');
    });

    it('should mention health check endpoint', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content).toContain('/api/health');
    });
  });

  describe('Troubleshooting Guide', () => {
    it('should have troubleshooting section', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content.toLowerCase()).toContain('troubleshooting');
    });

    it('should cover common issues', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      // Should have at least some common issues mentioned
      const hasIssues = content.toLowerCase().includes('error') ||
                        content.toLowerCase().includes('issue') ||
                        content.toLowerCase().includes('problem');
      expect(hasIssues).toBe(true);
    });
  });

  describe('Rollback Procedures', () => {
    it('should document rollback procedures', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content.toLowerCase()).toContain('rollback');
    });
  });

  describe('Security Considerations', () => {
    it('should mention security best practices', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      expect(content.toLowerCase()).toContain('security');
    });

    it('should warn about secrets exposure', () => {
      const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentPath, 'utf-8');
      const hasSecretWarning = content.toLowerCase().includes('secret') ||
                               content.toLowerCase().includes('credential');
      expect(hasSecretWarning).toBe(true);
    });
  });
});
