# Task 031: Database Migrations - Learning Guide

## Overview
This guide explains database migration strategies and health check patterns for production Next.js applications using Prisma ORM.

## Prisma Migration Concepts

### Schema-First Development
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Migration Commands

| Command | Purpose | Environment |
|---------|---------|-------------|
| `prisma migrate dev` | Create and apply migration | Development |
| `prisma migrate deploy` | Apply pending migrations | Production |
| `prisma db push` | Push schema without migration | Prototyping |
| `prisma migrate reset` | Reset database and re-seed | Development |

## Seed Scripts

### Purpose
- Initialize default data
- Create test accounts
- Set up reference data

### Best Practices
```typescript
// Use upsert for idempotent seeding
await prisma.download.upsert({
  where: { id: 'download-1' },
  update: {},
  create: {
    id: 'download-1',
    version: '1.0.0',
    filename: 'setup.exe',
  },
});
```

### Environment Awareness
```typescript
// Only seed demo data in development
if (process.env.NODE_ENV === 'development') {
  await seedDemoUsers();
}
```

## Health Check Patterns

### Basic Health Check
```typescript
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'healthy' });
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

### Comprehensive Health Check
```typescript
export async function GET() {
  const checks = {};

  // Database check
  const dbStart = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = {
      status: 'healthy',
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error.message,
    };
  }

  const isHealthy = Object.values(checks)
    .every(check => check.status === 'healthy');

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
  }, {
    status: isHealthy ? 200 : 503,
  });
}
```

## Database Client Singleton

### Problem: Connection Exhaustion
```typescript
// BAD: Creates new client on each request
export function getDb() {
  return new PrismaClient();
}
```

### Solution: Global Singleton
```typescript
// GOOD: Reuses single client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

## Production Deployment

### Pre-Deployment Checklist
1. Set `DATABASE_URL` in production environment
2. Run `prisma migrate deploy` before starting app
3. Verify health endpoint returns 200

### Vercel Integration
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

### Connection Pooling
For serverless, use connection pooling:
```
DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true&connection_limit=1"
```

## Backup and Restore

### PostgreSQL Backup
```bash
pg_dump $DATABASE_URL > backup.sql
```

### PostgreSQL Restore
```bash
psql $DATABASE_URL < backup.sql
```

### Prisma Reset (Development Only)
```bash
npm run db:reset
```

## Common Issues

### 1. Migration Drift
**Symptom**: Schema doesn't match database
**Solution**: Run `prisma migrate dev` to sync

### 2. Connection Timeout
**Symptom**: Database queries timeout in production
**Solution**: Use connection pooling, increase timeout

### 3. Seed Failures
**Symptom**: Seed script fails with unique constraint
**Solution**: Use upsert instead of create

### 4. Missing Migrations
**Symptom**: Deploy fails with migration error
**Solution**: Ensure migrations committed to git

## Related Resources
- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Seeding](https://www.prisma.io/docs/guides/database/seed-database)
- [Connection Pooling](https://www.prisma.io/docs/guides/database/connection-pooling)
