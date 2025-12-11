import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Database Migration Scripts', () => {
  const rootDir = process.cwd();

  describe('Prisma Schema', () => {
    it('should have Prisma schema file', () => {
      const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
      expect(fs.existsSync(schemaPath)).toBe(true);
    });

    it('should have database provider configured', () => {
      const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
      const content = fs.readFileSync(schemaPath, 'utf-8');
      expect(content).toContain('provider = "postgresql"');
    });

    it('should have all required models', () => {
      const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
      const content = fs.readFileSync(schemaPath, 'utf-8');

      // Core models
      expect(content).toContain('model User');
      expect(content).toContain('model Account');
      expect(content).toContain('model Session');
      expect(content).toContain('model License');
      expect(content).toContain('model Order');
      expect(content).toContain('model Machine');
      expect(content).toContain('model Download');
      expect(content).toContain('model ContactSubmission');
    });
  });

  describe('Seed Script', () => {
    it('should have seed script file', () => {
      const seedPath = path.join(rootDir, 'prisma', 'seed.ts');
      expect(fs.existsSync(seedPath)).toBe(true);
    });

    it('should have seed script configured in package.json', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.prisma?.seed).toBeDefined();
    });

    it('seed script should create sample downloads', () => {
      const seedPath = path.join(rootDir, 'prisma', 'seed.ts');
      const content = fs.readFileSync(seedPath, 'utf-8');
      expect(content).toContain('download');
    });
  });

  describe('Migration Scripts', () => {
    it('should have db:generate script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts['db:generate']).toContain('prisma generate');
    });

    it('should have db:push script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts['db:push']).toContain('prisma db push');
    });

    it('should have db:migrate script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts['db:migrate']).toContain('prisma migrate');
    });

    it('should have db:seed script', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts['db:seed']).toBeDefined();
    });

    it('should have db:reset script for development', () => {
      const packagePath = path.join(rootDir, 'package.json');
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(content.scripts['db:reset']).toBeDefined();
    });
  });

  describe('Health Check Endpoint', () => {
    it('should have health check API route', () => {
      const healthPath = path.join(rootDir, 'src', 'app', 'api', 'health', 'route.ts');
      expect(fs.existsSync(healthPath)).toBe(true);
    });

    it('health check should test database connectivity', () => {
      const healthPath = path.join(rootDir, 'src', 'app', 'api', 'health', 'route.ts');
      const content = fs.readFileSync(healthPath, 'utf-8');
      expect(content).toContain('db');
    });
  });

  describe('Database Client', () => {
    it('should have database client library', () => {
      const dbPath = path.join(rootDir, 'src', 'lib', 'db.ts');
      expect(fs.existsSync(dbPath)).toBe(true);
    });

    it('should export db instance', () => {
      const dbPath = path.join(rootDir, 'src', 'lib', 'db.ts');
      const content = fs.readFileSync(dbPath, 'utf-8');
      expect(content).toContain('export');
      expect(content).toContain('PrismaClient');
    });
  });
});
