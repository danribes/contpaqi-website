# Task 027: File Storage for Downloads - Learning Guide

## Overview
This guide explains how to implement secure file storage and downloads in a Next.js application with support for multiple cloud storage providers.

## Key Concepts

### 1. Signed URLs
Signed URLs provide temporary, secure access to private files without exposing storage credentials.

```typescript
// Generate a signed URL that expires in 1 hour
const url = await generateSignedUrl('file-id', { expiresIn: 3600 });
// Result: /api/downloads/file-id?token=abc123&expires=1702300000000
```

**How it works:**
1. Generate HMAC signature using secret key + file ID + expiration
2. Include signature and expiration in URL query params
3. Server verifies signature before serving file

### 2. Multi-Provider Architecture
Design storage systems to support multiple providers for flexibility:

```typescript
type StorageProvider = 'vercel-blob' | 's3' | 'local';

function getStorageProvider(): StorageProvider {
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'vercel-blob';
  if (process.env.AWS_ACCESS_KEY_ID) return 's3';
  return 'local';
}
```

**Benefits:**
- Deploy anywhere without code changes
- Easy provider migration
- Development works without cloud setup

### 3. Checksum Verification
Ensure file integrity after downloads:

```typescript
import crypto from 'crypto';

function verifyChecksum(data: Buffer, expected: string, algorithm = 'sha256'): boolean {
  const hash = crypto.createHash(algorithm).update(data).digest('hex');
  return hash === expected;
}
```

**Use cases:**
- Verify file wasn't corrupted during transfer
- Detect tampering
- Cache invalidation

### 4. Download Tracking
Track downloads for analytics and licensing:

```typescript
interface DownloadTrackingData {
  fileId: string;
  version: string;
  ipAddress?: string;
  userAgent?: string;
  licenseKey?: string;
  timestamp: Date;
}

async function trackDownload(data: DownloadTrackingData): Promise<void> {
  // Store in database for analytics
  await db.downloadEvent.create({ data });
}
```

## Implementation Patterns

### Token Generation (HMAC-SHA256)
```typescript
function generateSecureToken(fileId: string, expiresIn: number): string {
  const secret = process.env.DOWNLOAD_SECRET || 'fallback';
  const expires = Date.now() + expiresIn * 1000;
  const data = `${fileId}:${expires}`;

  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
    .substring(0, 32); // Shorter tokens for URLs
}
```

### Token Verification
```typescript
function verifyDownloadToken(fileId: string, token: string, expires: number): boolean {
  // Check expiration first (faster than crypto)
  if (Date.now() > expires) return false;

  // Regenerate and compare
  const expected = generateSecureToken(fileId, 0); // 0 because we use provided expires
  return token === expected;
}
```

### Download Configuration
Define available files centrally:

```typescript
const AVAILABLE_DOWNLOADS: DownloadFile[] = [
  {
    id: 'installer',
    name: 'Product Installer',
    filename: 'Setup.exe',
    version: '1.0.0',
    size: 85000000,
    checksum: 'sha256hash...',
    checksumAlgorithm: 'sha256',
    contentType: 'application/x-msdownload',
    releaseDate: '2025-01-01',
    storageKey: 'releases/v1.0.0/Setup.exe',
  },
];
```

## Provider-Specific Implementation

### Vercel Blob
```typescript
import { getDownloadUrl } from '@vercel/blob';

async function getVercelBlobUrl(storageKey: string): Promise<string> {
  const { url } = await getDownloadUrl(storageKey);
  return url;
}
```

### AWS S3
```typescript
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async function getS3Url(storageKey: string, expiresIn: number): Promise<string> {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: storageKey,
  });
  return getSignedUrl(client, command, { expiresIn });
}
```

## Security Best Practices

1. **Never expose storage credentials** to the client
2. **Use short expiration times** (1 hour default)
3. **Rotate secrets regularly** in production
4. **Log download attempts** for security monitoring
5. **Rate limit** download API endpoints
6. **Validate file IDs** against whitelist before generating URLs

## Common Issues

### Issue: Token mismatch
**Cause:** Secret changed or expires calculation differs
**Solution:** Ensure same secret and timestamp calculation on generate/verify

### Issue: CORS errors
**Cause:** Direct S3/Blob URL blocked by browser
**Solution:** Use proxy route or configure CORS on storage provider

### Issue: Large file timeouts
**Cause:** File too large for single request
**Solution:** Use streaming or chunked downloads

## Related Topics
- AWS S3 presigned URLs
- Vercel Blob storage
- Cloudflare R2
- Content-Disposition headers
- Range requests for resume support
