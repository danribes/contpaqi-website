import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Cron Job: Database Cleanup
 * Runs weekly on Sunday at 3:00 AM UTC
 *
 * This endpoint:
 * 1. Deletes expired password reset tokens
 * 2. Deletes expired verification tokens
 * 3. Deletes expired sessions
 * 4. Cleans up old download events (older than 90 days)
 * 5. Removes inactive machines (not seen in 90 days)
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
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Delete expired password reset tokens
    const deletedPasswordTokens = await db.passwordResetToken.deleteMany({
      where: {
        expires: {
          lt: now,
        },
      },
    });

    // Delete expired verification tokens
    const deletedVerificationTokens = await db.verificationToken.deleteMany({
      where: {
        expires: {
          lt: now,
        },
      },
    });

    // Delete expired sessions
    const deletedSessions = await db.session.deleteMany({
      where: {
        expires: {
          lt: now,
        },
      },
    });

    // Delete old download events (older than 90 days)
    const deletedDownloadEvents = await db.downloadEvent.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo,
        },
      },
    });

    // Remove machines not seen in 90 days
    const deletedMachines = await db.machine.deleteMany({
      where: {
        lastSeenAt: {
          lt: ninetyDaysAgo,
        },
      },
    });

    const results = {
      deletedPasswordTokens: deletedPasswordTokens.count,
      deletedVerificationTokens: deletedVerificationTokens.count,
      deletedSessions: deletedSessions.count,
      deletedDownloadEvents: deletedDownloadEvents.count,
      deletedMachines: deletedMachines.count,
    };

    console.log('[Cron] Cleanup completed:', results);

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    });
  } catch (error) {
    console.error('[Cron] Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to run cleanup' },
      { status: 500 }
    );
  }
}
