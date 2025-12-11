import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user with licenses and machines
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        licenses: {
          where: {
            status: { in: ['ACTIVE', 'TRIAL'] },
          },
          include: {
            machines: {
              orderBy: { lastSeenAt: 'desc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the primary (most recent active) license
    const primaryLicense = user.licenses[0] || null;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
      },
      license: primaryLicense
        ? {
            id: primaryLicense.id,
            key: primaryLicense.key,
            tier: primaryLicense.tier,
            status: primaryLicense.status,
            maxMachines: primaryLicense.maxMachines,
            invoicesPerMonth: primaryLicense.invoicesPerMonth,
            expiresAt: primaryLicense.expiresAt?.toISOString() || null,
            machines: primaryLicense.machines.map((m) => ({
              id: m.id,
              name: m.name,
              fingerprint: m.fingerprint,
              lastSeen: m.lastSeenAt?.toISOString() || null,
              activatedAt: m.createdAt.toISOString(),
            })),
          }
        : null,
    });
  } catch (error) {
    console.error('Portal user API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
