import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Public Assets', () => {
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');

  describe('Directory Structure', () => {
    it('should have a public directory', () => {
      expect(fs.existsSync(publicDir)).toBe(true);
    });

    it('should have an images directory inside public', () => {
      expect(fs.existsSync(imagesDir)).toBe(true);
    });
  });

  describe('Favicon Assets', () => {
    it('should have favicon.ico in public directory', () => {
      const faviconPath = path.join(publicDir, 'favicon.ico');
      expect(fs.existsSync(faviconPath)).toBe(true);
    });

    it('should have apple-touch-icon.png in public directory', () => {
      const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
      expect(fs.existsSync(appleTouchIconPath)).toBe(true);
    });

    it('should have favicon-16x16.png in public directory', () => {
      const favicon16Path = path.join(publicDir, 'favicon-16x16.png');
      expect(fs.existsSync(favicon16Path)).toBe(true);
    });

    it('should have favicon-32x32.png in public directory', () => {
      const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
      expect(fs.existsSync(favicon32Path)).toBe(true);
    });
  });

  describe('Open Graph Image', () => {
    it('should have og-image.png in images directory', () => {
      const ogImagePath = path.join(imagesDir, 'og-image.png');
      expect(fs.existsSync(ogImagePath)).toBe(true);
    });

    it('og-image.png should be a valid file with content', () => {
      const ogImagePath = path.join(imagesDir, 'og-image.png');
      const stats = fs.statSync(ogImagePath);
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  describe('Site Manifest', () => {
    it('should have site.webmanifest in public directory', () => {
      const manifestPath = path.join(publicDir, 'site.webmanifest');
      expect(fs.existsSync(manifestPath)).toBe(true);
    });

    it('site.webmanifest should contain valid JSON', () => {
      const manifestPath = path.join(publicDir, 'site.webmanifest');
      const content = fs.readFileSync(manifestPath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('site.webmanifest should have required fields', () => {
      const manifestPath = path.join(publicDir, 'site.webmanifest');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

      expect(manifest.name).toBeDefined();
      expect(manifest.short_name).toBeDefined();
      expect(manifest.icons).toBeDefined();
      expect(Array.isArray(manifest.icons)).toBe(true);
    });
  });

  describe('Logo Assets', () => {
    it('should have logo.svg in images directory', () => {
      const logoPath = path.join(imagesDir, 'logo.svg');
      expect(fs.existsSync(logoPath)).toBe(true);
    });
  });
});
