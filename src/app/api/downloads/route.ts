import { NextResponse } from 'next/server';

const GITHUB_REPO = 'danribes/contpaqi';
const GITHUB_RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  body: string;
  prerelease: boolean;
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
    // Fetch all releases (includes prereleases) and get the most recent
    const response = await fetch(GITHUB_RELEASES_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ContPAQi-Website',
      },
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status, response.statusText);
      return null;
    }

    const releases: GitHubRelease[] = await response.json();

    if (!releases || releases.length === 0) {
      return null;
    }

    // Get the most recent release (first one in the array, sorted by date)
    const latestRelease = releases[0];

    // Update cache
    cachedRelease = {
      data: latestRelease,
      timestamp: Date.now(),
    };

    return latestRelease;
  } catch (error) {
    console.error('Error fetching GitHub release:', error);
    return null;
  }
}

export async function GET() {
  const release = await fetchLatestRelease();

  if (!release) {
    // Return default values if no release found
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

  // Find the installer asset (.exe file)
  const installerAsset = release.assets.find(
    (asset) => asset.name.endsWith('.exe') && asset.name.includes('Setup')
  );

  // Find the checksums asset
  const checksumsAsset = release.assets.find(
    (asset) => asset.name === 'checksums.json'
  );

  // Fetch checksums if available
  let checksum: string | null = null;
  if (checksumsAsset) {
    try {
      const checksumResponse = await fetch(checksumsAsset.browser_download_url);
      if (checksumResponse.ok) {
        const checksumData = await checksumResponse.json();
        checksum = checksumData.sha256 || null;
      }
    } catch {
      // Ignore checksum fetch errors
    }
  }

  // Extract version from tag (remove 'v' prefix if present)
  const version = release.tag_name.replace(/^v/, '');

  return NextResponse.json({
    version,
    releaseDate: release.published_at,
    filename: installerAsset?.name || 'ContPAQi-AI-Bridge-Setup.exe',
    size: installerAsset?.size || 157286400,
    checksum,
    changelog: release.body,
    downloadUrl: installerAsset?.browser_download_url || `https://github.com/${GITHUB_REPO}/releases`,
  });
}
