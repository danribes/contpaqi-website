import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Cron Job: License Expiry Check
 * Runs daily at 6:00 AM UTC
 *
 * This endpoint:
 * 1. Finds licenses expiring within 7 days
 * 2. Finds licenses expiring within 30 days
 * 3. Marks expired licenses as EXPIRED
 * 4. Sends renewal reminder emails (TODO: implement with Resend)
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In development, allow without secret
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Find licenses that have expired
    const expiredLicenses = await db.license.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lt: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    // Find licenses expiring within 7 days (for urgent reminders)
    const expiringIn7Days = await db.license.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Find licenses expiring within 30 days (for early reminders)
    const expiringIn30Days = await db.license.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gt: sevenDaysFromNow,
          lte: thirtyDaysFromNow,
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // TODO: Send reminder emails using Resend
    // For now, just log the results
    console.log('[Cron] License check completed:', {
      markedExpired: expiredLicenses.count,
      expiringIn7Days: expiringIn7Days.length,
      expiringIn30Days: expiringIn30Days.length,
    });

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results: {
        markedExpired: expiredLicenses.count,
        expiringIn7Days: expiringIn7Days.length,
        expiringIn30Days: expiringIn30Days.length,
      },
    });
  } catch (error) {
    console.error('[Cron] License check error:', error);
    return NextResponse.json(
      { error: 'Failed to run license check' },
      { status: 500 }
    );
  }
}
