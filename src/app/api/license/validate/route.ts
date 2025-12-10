import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateLicense } from '@/lib/license';

const validateSchema = z.object({
  licenseKey: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey } = validateSchema.parse(body);

    const result = await validateLicense(licenseKey);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      license: result.license,
    });
  } catch (error) {
    console.error('License validation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { valid: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: false, error: 'Validation failed' },
      { status: 500 }
    );
  }
}
