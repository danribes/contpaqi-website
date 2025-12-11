import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get the latest download
    const latestDownload = await db.download.findFirst({
      where: { isLatest: true },
      orderBy: { releaseDate: 'desc' },
    });

    // Fallback to most recent if none marked as latest
    const download = latestDownload || await db.download.findFirst({
      orderBy: { releaseDate: 'desc' },
    });

    if (!download) {
      // Return default values if no download in database
      return NextResponse.json({
        version: '1.0.0',
        releaseDate: new Date().toISOString(),
        filename: 'ContPAQi-AI-Bridge-Setup.exe',
        size: 157286400, // ~150 MB
        checksum: null,
        changelog: null,
        downloadUrl: '/downloads/ContPAQi-AI-Bridge-Setup.exe',
      });
    }

    return NextResponse.json({
      version: download.version,
      releaseDate: download.releaseDate.toISOString(),
      filename: download.filename,
      size: download.size,
      checksum: download.checksum,
      changelog: download.changelog,
      downloadUrl: download.downloadUrl || `/downloads/${download.filename}`,
    });
  } catch (error) {
    console.error('Downloads API error:', error);
    // Return defaults on error
    return NextResponse.json({
      version: '1.0.0',
      releaseDate: new Date().toISOString(),
      filename: 'ContPAQi-AI-Bridge-Setup.exe',
      size: 157286400,
      checksum: null,
      changelog: null,
      downloadUrl: '/downloads/ContPAQi-AI-Bridge-Setup.exe',
    });
  }
}
