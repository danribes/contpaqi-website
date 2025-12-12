import { NextResponse } from 'next/server';

const GITHUB_REPO = 'danribes/contpaqi';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  body: string;
  assets: GitHubAsset[];
}

// Cache the release info for 5 minutes to avoid hitting GitHub API rate limits
let cachedRelease: { data: GitHubRelease; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  // Check cache
  if (cachedRelease && Date.now() - cachedRelease.timestamp < CACHE_TTL) {
    return cachedRelease.data;
  }

  try {
    const response = await fetch(GITHUB_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ContPAQi-Website',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status, response.statusText);
      return null;
    }

    const release = await response.json() as GitHubRelease;
    cachedRelease = { data: release, timestamp: Date.now() };
    return release;
  } catch (error) {
    console.error('Failed to fetch GitHub release:', error);
    return null;
  }
}

export async function GET() {
  try {
    const release = await fetchLatestRelease();

    if (release) {
      // Find the installer exe in assets
      const installerAsset = release.assets.find(
        (asset) => asset.name.endsWith('.exe') && asset.name.includes('Setup')
      );

      // Find checksums file
      const checksumsAsset = release.assets.find(
        (asset) => asset.name === 'checksums.json'
      );

      let checksum: string | null = null;
      if (checksumsAsset) {
        try {
          const checksumResponse = await fetch(checksumsAsset.browser_download_url);
          const checksumData = await checksumResponse.json();
          checksum = checksumData.sha256 || null;
        } catch {
          // Ignore checksum fetch errors
        }
      }

      if (installerAsset) {
        const version = release.tag_name.replace(/^v/, '');
        return NextResponse.json({
          version,
          releaseDate: release.published_at,
          filename: installerAsset.name,
          size: installerAsset.size,
          checksum,
          changelog: release.body,
          downloadUrl: installerAsset.browser_download_url,
        });
      }
    }

    // Return default values if no release found
    return NextResponse.json({
      version: '1.0.0',
      releaseDate: new Date().toISOString(),
      filename: 'ContPAQi-AI-Bridge-Setup.exe',
      size: 157286400, // ~150 MB
      checksum: null,
      changelog: null,
      downloadUrl: `https://github.com/${GITHUB_REPO}/releases`,
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
      downloadUrl: `https://github.com/${GITHUB_REPO}/releases`,
    });
  }
}
