import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { activateMachine, deactivateMachine } from '@/lib/license';

const activateSchema = z.object({
  licenseKey: z.string().min(1),
  fingerprint: z.string().min(1),
  machineName: z.string().optional(),
});

const deactivateSchema = z.object({
  licenseKey: z.string().min(1),
  fingerprint: z.string().min(1),
});

/**
 * POST - Activate a machine
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, fingerprint, machineName } = activateSchema.parse(body);

    const result = await activateMachine(licenseKey, fingerprint, machineName);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      machineId: result.machineId,
    });
  } catch (error) {
    console.error('Machine activation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Activation failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Deactivate a machine
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, fingerprint } = deactivateSchema.parse(body);

    const result = await deactivateMachine(licenseKey, fingerprint);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Machine deactivation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Deactivation failed' },
      { status: 500 }
    );
  }
}
