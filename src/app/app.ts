import { Component, computed, signal } from '@angular/core';
import { siteContent } from './data/site-content';

const GITHUB_RELEASES_URL = 'https://api.github.com/repos/ruannnebornman/veldmuis/releases';

interface GitHubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  html_url: string;
  tag_name: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  assets: GitHubReleaseAsset[];
  body: string | null;
}

interface ReleaseDetail {
  label: string;
  value: string;
}

interface ReleaseCardContent {
  kicker: string;
  status: string;
  date: string;
  version: string;
  summary: string;
  points: readonly string[];
  details: readonly ReleaseDetail[];
}

interface ReleaseAction {
  label: string;
  href: string;
  external: boolean;
}

interface ReleaseDownloadTarget {
  label: string;
  href: string;
  external: boolean;
  assetName: string;
  assetSize: string;
}

function pickDisplayRelease(releases: GitHubRelease[]): GitHubRelease | null {
  return releases.find((release) => !release.draft && !release.prerelease) ?? null;
}

function extractSectionBullets(body: string | null, sectionHeading: string): string[] {
  if (!body) {
    return [];
  }

  const bullets: string[] = [];
  const targetHeading = `## ${sectionHeading}`.toLowerCase();
  let inSection = false;

  for (const line of body.split('\n')) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('## ')) {
      if (inSection) {
        break;
      }

      inSection = trimmedLine.toLowerCase() === targetHeading;
      continue;
    }

    if (inSection && trimmedLine.startsWith('- ')) {
      bullets.push(trimmedLine.slice(2).trim());
    }
  }

  return bullets;
}

function extractAllBullets(body: string | null): string[] {
  if (!body) {
    return [];
  }

  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function extractFirstParagraph(body: string | null): string | null {
  if (!body) {
    return null;
  }

  const paragraphLines: string[] = [];

  for (const line of body.split('\n')) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('- ')) {
      if (paragraphLines.length > 0) {
        break;
      }

      continue;
    }

    paragraphLines.push(trimmedLine);
  }

  return paragraphLines.length > 0 ? paragraphLines.join(' ') : null;
}

function pickPrimaryAsset(assets: GitHubReleaseAsset[]): GitHubReleaseAsset | null {
  return (
    assets.find((asset) => /\.iso$/i.test(asset.name)) ??
    assets.find((asset) => !/(\.sha256|\.sig|checksums?)/i.test(asset.name)) ??
    assets[0] ??
    null
  );
}

function extractExternalIsoUrl(body: string | null): string | null {
  if (!body) {
    return null;
  }

  const match = body.match(/ISO download:\s*(https?:\/\/\S+)/i);
  return match?.[1] ?? null;
}

function inferReleaseStatus(release: GitHubRelease): string {
  const releaseText = `${release.tag_name} ${release.name ?? ''}`.toLowerCase();

  if (releaseText.includes('alpha')) {
    return 'Alpha milestone';
  }

  if (releaseText.includes('beta')) {
    return 'Beta milestone';
  }

  if (releaseText.includes('rc')) {
    return 'Release candidate';
  }

  return release.prerelease ? 'Prerelease' : 'Stable release';
}

function formatReleaseDate(dateValue: string | null, fallback: string): string {
  if (!dateValue) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return 'n/a';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const roundedSize = size >= 10 || unitIndex === 0 ? size.toFixed(0) : size.toFixed(1);
  return `${roundedSize} ${units[unitIndex]}`;
}

function inferDownloadLabel(asset: GitHubReleaseAsset): string {
  if (/\.iso$/i.test(asset.name)) {
    return 'Download ISO';
  }

  return 'Download Asset';
}

function pickPrimaryDownloadTarget(release: GitHubRelease): ReleaseDownloadTarget | null {
  const primaryAsset = pickPrimaryAsset(release.assets);

  if (primaryAsset && /\.iso$/i.test(primaryAsset.name)) {
    return {
      label: inferDownloadLabel(primaryAsset),
      href: primaryAsset.browser_download_url,
      external: true,
      assetName: primaryAsset.name,
      assetSize: formatBytes(primaryAsset.size),
    };
  }

  const externalIsoUrl = extractExternalIsoUrl(release.body);

  if (externalIsoUrl) {
    return {
      label: 'Download ISO',
      href: externalIsoUrl,
      external: true,
      assetName: 'External ISO link',
      assetSize: 'Hosted externally',
    };
  }

  if (primaryAsset) {
    return {
      label: inferDownloadLabel(primaryAsset),
      href: primaryAsset.browser_download_url,
      external: true,
      assetName: primaryAsset.name,
      assetSize: formatBytes(primaryAsset.size),
    };
  }

  return null;
}

function buildReleaseCard(
  release: GitHubRelease,
  fallbackRelease: typeof siteContent.release
): ReleaseCardContent {
  const highlights = extractSectionBullets(release.body, 'Highlights');
  const allBullets = extractAllBullets(release.body);
  const summary = highlights[0] ?? extractFirstParagraph(release.body) ?? fallbackRelease.summary;
  const primaryDownloadTarget = pickPrimaryDownloadTarget(release);
  const points = (highlights.length > 1 ? highlights.slice(1) : allBullets)
    .filter((point) => point !== summary)
    .slice(0, 3);

  return {
    kicker: 'Latest GitHub release',
    status: inferReleaseStatus(release),
    date: formatReleaseDate(release.published_at, fallbackRelease.date),
    version: release.tag_name || fallbackRelease.version,
    summary,
    points: points.length > 0 ? points : fallbackRelease.points,
    details: [
      { label: 'Release tag', value: release.tag_name || fallbackRelease.version },
      { label: 'Channel', value: release.prerelease ? 'Prerelease' : 'Stable' },
      { label: 'Primary asset', value: primaryDownloadTarget?.assetName ?? 'Release page only' },
      { label: 'Asset size', value: primaryDownloadTarget?.assetSize ?? 'n/a' },
    ],
  };
}

function buildReleaseActions(
  release: GitHubRelease,
  fallbackHero: typeof siteContent.hero
): { primary: ReleaseAction; secondary: ReleaseAction } {
  const primaryDownloadTarget = pickPrimaryDownloadTarget(release);

  return {
    primary: primaryDownloadTarget
      ? {
          label: primaryDownloadTarget.label,
          href: primaryDownloadTarget.href,
          external: primaryDownloadTarget.external,
        }
      : fallbackHero.primaryCta,
    secondary: {
      label: 'View Release',
      href: release.html_url || fallbackHero.secondaryCta.href,
      external: true,
    },
  };
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal(siteContent.siteName);
  protected readonly content = siteContent;
  protected readonly currentYear = new Date().getFullYear();
  private readonly latestRelease = signal<GitHubRelease | null>(null);
  protected readonly releaseCard = computed(() =>
    this.latestRelease() ? buildReleaseCard(this.latestRelease()!, this.content.release) : this.content.release
  );
  protected readonly releaseActions = computed(() =>
    this.latestRelease()
      ? buildReleaseActions(this.latestRelease()!, this.content.hero)
      : {
          primary: this.content.hero.primaryCta,
          secondary: this.content.hero.secondaryCta,
        }
  );

  constructor() {
    void this.loadLatestRelease();
  }

  private async loadLatestRelease(): Promise<void> {
    try {
      const response = await fetch(GITHUB_RELEASES_URL, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        return;
      }

      const releases = (await response.json()) as GitHubRelease[];
      const latestRelease = pickDisplayRelease(releases);

      if (latestRelease) {
        this.latestRelease.set(latestRelease);
      }
    } catch {
      // Fall back to the bundled release content if GitHub is unavailable.
    }
  }
}
