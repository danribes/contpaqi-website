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

    // Get all licenses for the user
    const licenses = await db.license.findMany({
      where: { userId: session.user.id },
      include: {
        machines: {
          orderBy: { lastSeenAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format the licenses
    const formattedLicenses = licenses.map((license) => ({
      id: license.id,
      key: license.key,
      tier: license.tier,
      status: license.status,
      maxMachines: license.maxMachines,
      invoicesPerMonth: license.invoicesPerMonth,
      expiresAt: license.expiresAt?.toISOString() || null,
      activatedAt: license.activatedAt?.toISOString() || null,
      createdAt: license.createdAt.toISOString(),
      machines: license.machines.map((m) => ({
        id: m.id,
        name: m.name,
        fingerprint: m.fingerprint,
        lastSeenAt: m.lastSeenAt?.toISOString() || null,
        createdAt: m.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({
      licenses: formattedLicenses,
    });
  } catch (error) {
    console.error('License status API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license status' },
      { status: 500 }
    );
  }
}
