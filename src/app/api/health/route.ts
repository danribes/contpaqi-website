import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Health Check Endpoint
 *
 * This endpoint verifies the application is running and can connect to:
 * - Database (PostgreSQL via Prisma)
 *
 * Use this endpoint for:
 * - Load balancer health checks
 * - Kubernetes liveness/readiness probes
 * - Uptime monitoring services
 *
 * Returns:
 * - 200: All systems operational
 * - 503: Service unavailable (database connection failed)
 */
export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  // Check database connectivity
  try {
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    checks.database = {
      status: 'healthy',
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Determine overall health
  const isHealthy = Object.values(checks).every((check) => check.status === 'healthy');
  const totalLatency = Date.now() - startTime;

  const response = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    checks,
    latency: totalLatency,
  };

  return NextResponse.json(response, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
