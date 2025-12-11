/**
 * File Storage Module for ContPAQi AI Bridge
 *
 * Supports multiple storage providers:
 * - Vercel Blob (recommended for Vercel deployments)
 * - AWS S3 / Cloudflare R2 (for custom hosting)
 * - Local storage (for development)
 *
 * Environment Variables:
 * - BLOB_READ_WRITE_TOKEN: Vercel Blob token
 * - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET: For S3/R2
 */

import crypto from 'crypto';

// =============================================================================
// Types
// =============================================================================

export interface DownloadFile {
  id: string;
  name: string;
  filename: string;
  version: string;
  size: number;
  checksum: string;
  checksumAlgorithm: 'sha256' | 'md5';
  contentType: string;
  description?: string;
  releaseDate: string;
  storageKey: string;
}

export interface SignedUrlOptions {
  expiresIn?: number; // seconds, default 3600 (1 hour)
  filename?: string; // suggested download filename
}

export interface DownloadTrackingData {
  fileId: string;
  version: string;
  ipAddress?: string;
  userAgent?: string;
  licenseKey?: string;
  timestamp: Date;
}

// =============================================================================
// Available Downloads Configuration
// =============================================================================

export const AVAILABLE_DOWNLOADS: DownloadFile[] = [
  {
    id: 'contpaqi-ai-bridge-installer',
    name: 'ContPAQi AI Bridge Installer',
    filename: 'ContPAQi-AI-Bridge-Setup.exe',
    version: '1.0.0',
    size: 85000000, // ~85MB
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    checksumAlgorithm: 'sha256',
    contentType: 'application/x-msdownload',
    description: 'Full installer for ContPAQi AI Bridge',
    releaseDate: '2025-12-01',
    storageKey: 'releases/v1.0.0/ContPAQi-AI-Bridge-Setup.exe',
  },
  {
    id: 'contpaqi-ai-bridge-installer-silent',
    name: 'ContPAQi AI Bridge Silent Installer',
    filename: 'ContPAQi-AI-Bridge-Setup-Silent.exe',
    version: '1.0.0',
    size: 85000000,
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    checksumAlgorithm: 'sha256',
    contentType: 'application/x-msdownload',
    description: 'Silent installer for enterprise deployments',
    releaseDate: '2025-12-01',
    storageKey: 'releases/v1.0.0/ContPAQi-AI-Bridge-Setup-Silent.exe',
  },
];

// =============================================================================
// Storage Provider Detection
// =============================================================================

type StorageProvider = 'vercel-blob' | 's3' | 'local';

function getStorageProvider(): StorageProvider {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return 'vercel-blob';
  }
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET) {
    return 's3';
  }
  return 'local';
}

// =============================================================================
// Signed URL Generation
// =============================================================================

/**
 * Generate a signed URL for downloading a file
 * @param fileId - The ID of the file to download
 * @param options - URL generation options
 * @returns Signed URL or null if file not found
 */
export async function generateSignedUrl(
  fileId: string,
  options: SignedUrlOptions = {}
): Promise<string | null> {
  const file = AVAILABLE_DOWNLOADS.find((f) => f.id === fileId);
  if (!file) {
    return null;
  }

  const { expiresIn = 3600 } = options;
  const provider = getStorageProvider();

  switch (provider) {
    case 'vercel-blob':
      return generateVercelBlobUrl(file, expiresIn);
    case 's3':
      return generateS3Url(file, expiresIn);
    case 'local':
    default:
      return generateLocalUrl(file, expiresIn);
  }
}

/**
 * Get download URL for a file (convenience function)
 * @param fileId - The ID of the file
 * @returns Download information or null
 */
export async function getDownloadUrl(
  fileId: string
): Promise<{ url: string; file: DownloadFile } | null> {
  const file = AVAILABLE_DOWNLOADS.find((f) => f.id === fileId);
  if (!file) {
    return null;
  }

  const url = await generateSignedUrl(fileId);
  if (!url) {
    return null;
  }

  return { url, file };
}

// =============================================================================
// Provider-Specific URL Generation
// =============================================================================

async function generateVercelBlobUrl(
  file: DownloadFile,
  expiresIn: number
): Promise<string> {
  // In production, use Vercel Blob's getDownloadUrl
  // For now, construct a URL that would work with Vercel Blob
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const token = generateSecureToken(file.id, expiresIn);

  return `${baseUrl}/api/downloads/${file.id}?token=${token}&expires=${Date.now() + expiresIn * 1000}`;
}

async function generateS3Url(
  file: DownloadFile,
  expiresIn: number
): Promise<string> {
  // In production, use AWS SDK to generate presigned URL
  // For now, construct a proxy URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const token = generateSecureToken(file.id, expiresIn);

  return `${baseUrl}/api/downloads/${file.id}?token=${token}&expires=${Date.now() + expiresIn * 1000}`;
}

async function generateLocalUrl(
  file: DownloadFile,
  expiresIn: number
): Promise<string> {
  // Local development URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const token = generateSecureToken(file.id, expiresIn);
  const expires = Date.now() + expiresIn * 1000;

  return `${baseUrl}/api/downloads/${file.id}?token=${token}&expires=${expires}`;
}

// =============================================================================
// Security Functions
// =============================================================================

/**
 * Generate a secure token for URL signing
 */
function generateSecureToken(fileId: string, expiresIn: number): string {
  const secret = process.env.DOWNLOAD_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const expires = Date.now() + expiresIn * 1000;
  const data = `${fileId}:${expires}`;

  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
    .substring(0, 32);
}

/**
 * Verify a download token
 */
export function verifyDownloadToken(
  fileId: string,
  token: string,
  expires: number
): boolean {
  if (Date.now() > expires) {
    return false; // Token expired
  }

  const secret = process.env.DOWNLOAD_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const data = `${fileId}:${expires}`;
  const expectedToken = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
    .substring(0, 32);

  return token === expectedToken;
}

// =============================================================================
// Checksum Verification
// =============================================================================

/**
 * Verify file checksum
 * @param data - File data as Buffer
 * @param expectedChecksum - Expected checksum value
 * @param algorithm - Hash algorithm (sha256 or md5)
 */
export function verifyChecksum(
  data: Buffer,
  expectedChecksum: string,
  algorithm: 'sha256' | 'md5' = 'sha256'
): boolean {
  const hash = crypto.createHash(algorithm).update(data).digest('hex');
  return hash === expectedChecksum;
}

/**
 * Calculate checksum for data
 */
export function calculateChecksum(
  data: Buffer,
  algorithm: 'sha256' | 'md5' = 'sha256'
): string {
  return crypto.createHash(algorithm).update(data).digest('hex');
}

// =============================================================================
// Download Tracking
// =============================================================================

/**
 * Track a download event
 * In production, this would store in the database
 */
export async function trackDownload(
  data: DownloadTrackingData
): Promise<void> {
  // In development, just log
  if (process.env.NODE_ENV === 'development') {
    console.log('[Storage] Download tracked:', {
      fileId: data.fileId,
      version: data.version,
      timestamp: data.timestamp,
    });
    return;
  }

  // In production, store in database
  // This would use Prisma to create a DownloadEvent record
  try {
    // TODO: Implement database storage when Prisma is connected
    // await prisma.downloadEvent.create({ data: { ... } });
    console.log('[Storage] Download tracked:', data.fileId);
  } catch (error) {
    console.error('[Storage] Failed to track download:', error);
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get file information by ID
 */
export function getFileById(fileId: string): DownloadFile | undefined {
  return AVAILABLE_DOWNLOADS.find((f) => f.id === fileId);
}

/**
 * Get all available downloads
 */
export function getAllDownloads(): DownloadFile[] {
  return AVAILABLE_DOWNLOADS;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
