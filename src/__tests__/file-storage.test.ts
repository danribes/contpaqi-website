import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('File Storage for Downloads', () => {
  const rootDir = process.cwd();

  describe('Storage Library', () => {
    it('should have storage library file', () => {
      const storagePath = path.join(rootDir, 'src', 'lib', 'storage.ts');
      expect(fs.existsSync(storagePath)).toBe(true);
    });

    it('storage library should export generateSignedUrl function', async () => {
      const storage = await import('@/lib/storage');
      expect(typeof storage.generateSignedUrl).toBe('function');
    });

    it('storage library should export getDownloadUrl function', async () => {
      const storage = await import('@/lib/storage');
      expect(typeof storage.getDownloadUrl).toBe('function');
    });

    it('storage library should export verifyChecksum function', async () => {
      const storage = await import('@/lib/storage');
      expect(typeof storage.verifyChecksum).toBe('function');
    });
  });

  describe('Download API Route', () => {
    it('should have downloads API route', () => {
      const routePath = path.join(rootDir, 'src', 'app', 'api', 'downloads', 'route.ts');
      expect(fs.existsSync(routePath)).toBe(true);
    });

    it('downloads route should handle GET requests', () => {
      const routePath = path.join(rootDir, 'src', 'app', 'api', 'downloads', 'route.ts');
      const content = fs.readFileSync(routePath, 'utf-8');
      expect(content).toContain('export async function GET');
    });
  });

  describe('Download Tracking', () => {
    it('storage library should export trackDownload function', async () => {
      const storage = await import('@/lib/storage');
      expect(typeof storage.trackDownload).toBe('function');
    });
  });

  describe('Storage Configuration', () => {
    it('.env.example should have storage configuration', () => {
      const envPath = path.join(rootDir, '.env.example');
      const content = fs.readFileSync(envPath, 'utf-8');
      // Should have either Vercel Blob, S3, or R2 config
      const hasVercelBlob = content.includes('BLOB_READ_WRITE_TOKEN');
      const hasS3 = content.includes('AWS_S3_BUCKET');
      const hasR2 = content.includes('R2_');
      expect(hasVercelBlob || hasS3 || hasR2).toBe(true);
    });
  });

  describe('Download Types', () => {
    it('should have download types defined', () => {
      const typesPath = path.join(rootDir, 'src', 'lib', 'storage.ts');
      const content = fs.readFileSync(typesPath, 'utf-8');
      expect(content).toContain('DownloadFile') || expect(content).toContain('interface');
    });
  });

  describe('Security Features', () => {
    it('storage library should support URL expiration', async () => {
      const storagePath = path.join(rootDir, 'src', 'lib', 'storage.ts');
      const content = fs.readFileSync(storagePath, 'utf-8');
      expect(content).toContain('expir') || expect(content).toContain('ttl');
    });

    it('generateSignedUrl should accept expiration parameter', async () => {
      const storage = await import('@/lib/storage');
      // Function should exist and accept parameters
      expect(storage.generateSignedUrl.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Available Downloads Configuration', () => {
    it('should have available downloads configuration', () => {
      const storagePath = path.join(rootDir, 'src', 'lib', 'storage.ts');
      const content = fs.readFileSync(storagePath, 'utf-8');
      expect(content).toContain('AVAILABLE_DOWNLOADS') || expect(content).toContain('downloads');
    });
  });
});
