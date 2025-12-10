import { randomBytes, createHash } from 'crypto';
import { db } from './db';
import { LicenseTier, LicenseStatus } from '@prisma/client';

/**
 * Generate a unique license key in format: XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const segments: string[] = [];

  for (let i = 0; i < 4; i++) {
    const bytes = randomBytes(2);
    const segment = bytes.toString('hex').toUpperCase();
    segments.push(segment);
  }

  const key = segments.join('-');

  // Add checksum to last segment for validation
  const checksum = createHash('sha256')
    .update(segments.slice(0, 3).join('-'))
    .digest('hex')
    .substring(0, 4)
    .toUpperCase();

  return `${segments[0]}-${segments[1]}-${segments[2]}-${checksum}`;
}

/**
 * Validate license key format and checksum
 */
export function validateLicenseKeyFormat(key: string): boolean {
  const pattern = /^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
  if (!pattern.test(key)) {
    return false;
  }

  const segments = key.split('-');
  const expectedChecksum = createHash('sha256')
    .update(segments.slice(0, 3).join('-'))
    .digest('hex')
    .substring(0, 4)
    .toUpperCase();

  return segments[3] === expectedChecksum;
}

/**
 * Create a new license for a user
 */
export async function createLicense(
  userId: string,
  tier: LicenseTier,
  orderId?: string
) {
  const key = generateLicenseKey();

  // Determine machine limit based on tier
  const maxMachines = tier === 'STARTER' ? 1 : tier === 'PROFESSIONAL' ? 3 : 999;
  const invoicesPerMonth = tier === 'STARTER' ? 100 : null;

  // Calculate expiry (1 year from now for yearly, 1 month for monthly)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Default to 1 year

  const license = await db.license.create({
    data: {
      key,
      userId,
      tier,
      status: 'ACTIVE',
      maxMachines,
      invoicesPerMonth,
      expiresAt,
      orderId,
    },
  });

  return license;
}

/**
 * Validate a license key and return license details
 */
export async function validateLicense(key: string) {
  if (!validateLicenseKeyFormat(key)) {
    return { valid: false, error: 'Invalid license key format' };
  }

  const license = await db.license.findUnique({
    where: { key },
    include: {
      machines: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  if (!license) {
    return { valid: false, error: 'License key not found' };
  }

  if (license.status === 'REVOKED') {
    return { valid: false, error: 'License has been revoked' };
  }

  if (license.status === 'EXPIRED' || (license.expiresAt && license.expiresAt < new Date())) {
    return { valid: false, error: 'License has expired' };
  }

  return {
    valid: true,
    license: {
      id: license.id,
      key: license.key,
      tier: license.tier,
      status: license.status,
      maxMachines: license.maxMachines,
      activeMachines: license.machines.length,
      invoicesPerMonth: license.invoicesPerMonth,
      expiresAt: license.expiresAt,
      user: license.user,
    },
  };
}

/**
 * Activate a license on a machine
 */
export async function activateMachine(
  licenseKey: string,
  fingerprint: string,
  machineName?: string
) {
  const validation = await validateLicense(licenseKey);

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const license = await db.license.findUnique({
    where: { key: licenseKey },
    include: { machines: true },
  });

  if (!license) {
    return { success: false, error: 'License not found' };
  }

  // Check if machine is already activated
  const existingMachine = license.machines.find(
    (m) => m.fingerprint === fingerprint
  );

  if (existingMachine) {
    // Update last seen
    await db.machine.update({
      where: { id: existingMachine.id },
      data: { lastSeenAt: new Date() },
    });

    return {
      success: true,
      message: 'Machine already activated',
      machineId: existingMachine.id,
    };
  }

  // Check machine limit
  if (license.machines.length >= license.maxMachines) {
    return {
      success: false,
      error: `Maximum machines (${license.maxMachines}) already activated`,
    };
  }

  // Activate new machine
  const machine = await db.machine.create({
    data: {
      licenseId: license.id,
      fingerprint,
      name: machineName,
    },
  });

  // Update license activated date if first activation
  if (!license.activatedAt) {
    await db.license.update({
      where: { id: license.id },
      data: { activatedAt: new Date() },
    });
  }

  return {
    success: true,
    message: 'Machine activated successfully',
    machineId: machine.id,
  };
}

/**
 * Deactivate a machine from a license
 */
export async function deactivateMachine(licenseKey: string, fingerprint: string) {
  const license = await db.license.findUnique({
    where: { key: licenseKey },
    include: { machines: true },
  });

  if (!license) {
    return { success: false, error: 'License not found' };
  }

  const machine = license.machines.find((m) => m.fingerprint === fingerprint);

  if (!machine) {
    return { success: false, error: 'Machine not found' };
  }

  await db.machine.delete({
    where: { id: machine.id },
  });

  return { success: true, message: 'Machine deactivated successfully' };
}
