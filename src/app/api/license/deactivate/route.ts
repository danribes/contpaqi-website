import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const deactivateSchema = z.object({
  machineId: z.string().min(1, 'Machine ID is required'),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = deactivateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { machineId } = result.data;

    // Find the machine and verify ownership
    const machine = await db.machine.findUnique({
      where: { id: machineId },
      include: {
        license: {
          select: { userId: true },
        },
      },
    });

    if (!machine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 404 }
      );
    }

    // Verify the user owns this license
    if (machine.license.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not own this license' },
        { status: 403 }
      );
    }

    // Delete the machine activation
    await db.machine.delete({
      where: { id: machineId },
    });

    return NextResponse.json({
      success: true,
      message: 'Machine deactivated successfully',
    });
  } catch (error) {
    console.error('Deactivate machine API error:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate machine' },
      { status: 500 }
    );
  }
}
