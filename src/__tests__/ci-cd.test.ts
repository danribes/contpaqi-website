import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

describe('CI/CD Pipeline Configuration', () => {
  const rootDir = process.cwd();
  const workflowsDir = path.join(rootDir, '.github', 'workflows');

  describe('GitHub Actions Directory', () => {
    it('should have .github/workflows directory', () => {
      expect(fs.existsSync(workflowsDir)).toBe(true);
    });
  });

  describe('CI Workflow', () => {
    const ciPath = path.join(workflowsDir, 'ci.yml');

    it('should have ci.yml workflow file', () => {
      expect(fs.existsSync(ciPath)).toBe(true);
    });

    it('should be valid YAML', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should have workflow name', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      const workflow = yaml.load(content) as Record<string, unknown>;
      expect(workflow.name).toBeDefined();
    });

    it('should trigger on push and pull_request', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      const workflow = yaml.load(content) as Record<string, unknown>;
      const on = workflow.on as Record<string, unknown>;
      expect(on.push || on.pull_request).toBeDefined();
    });

    it('should have lint job', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('lint');
    });

    it('should have test job', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('test');
    });

    it('should have build job', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('build');
    });

    it('should use Node.js setup action', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('actions/setup-node');
    });

    it('should specify Node.js version 18 or higher', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      // Check for direct node-version or NODE_VERSION env var
      const hasDirectVersion = content.match(/node-version.*['"]?(18|20|22)/);
      const hasEnvVersion = content.match(/NODE_VERSION.*['"]?(18|20|22)/);
      expect(hasDirectVersion || hasEnvVersion).toBeTruthy();
    });

    it('should run npm ci for dependencies', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('npm ci');
    });

    it('should run lint command', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('npm run lint');
    });

    it('should run test command', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('npm run test');
    });

    it('should run build command', () => {
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('npm run build');
    });
  });

  describe('TypeScript Check', () => {
    it('should include TypeScript type checking', () => {
      const ciPath = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciPath, 'utf-8');
      // Should have tsc or type-check command
      expect(content.match(/tsc|type-check|typescript/i)).toBeTruthy();
    });
  });

  describe('Caching', () => {
    it('should cache npm dependencies', () => {
      const ciPath = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciPath, 'utf-8');
      expect(content).toContain('cache');
    });
  });

  describe('README Badges', () => {
    it('should have CI status badge in README', () => {
      const readmePath = path.join(rootDir, 'README.md');
      const content = fs.readFileSync(readmePath, 'utf-8');
      // Check for GitHub Actions badge format
      expect(content.match(/!\[.*\]\(.*github\.com.*actions.*badge/i) ||
             content.match(/github\.com.*workflows.*badge/i) ||
             content.includes('CI')).toBeTruthy();
    });
  });
});
