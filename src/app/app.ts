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

interface ReleaseActions {
  primary: ReleaseAction;
  secondary: ReleaseAction;
  tertiary: ReleaseAction;
  quaternary: ReleaseAction;
}

interface ReleaseDownloadTarget {
  label: string;
  href: string;
  external: boolean;
  assetName: string;
  assetSize: string;
}

function isMarkdownHeading(line: string): boolean {
  return /^#{1,6}\s+/.test(line);
}

function matchesSectionHeading(line: string, sectionHeading: string): boolean {
  const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
  return headingMatch?.[1]?.trim().toLowerCase() === sectionHeading.toLowerCase();
}

function isReleaseMetadataLine(line: string): boolean {
  const normalized = line.trim().toLowerCase();

  return (
    normalized.startsWith('iso download:') ||
    normalized.startsWith('sha256 download:') ||
    normalized.startsWith('checksum asset:') ||
    normalized.startsWith('sha256:') ||
    normalized.startsWith('direct https iso:') ||
    normalized.startsWith('direct https checksum:') ||
    normalized.startsWith('primary asset:') ||
    normalized.startsWith('asset size:')
  );
}

function cleanReleaseText(text: string): string {
  return text.replace(/`([^`]+)`/g, '$1').replace(/\s+/g, ' ').trim();
}

function buildReleasesPageUrl(repoUrl: string): string {
  return `${repoUrl.replace(/\/+$/, '')}/releases`;
}

function pickDisplayRelease(releases: GitHubRelease[]): GitHubRelease | null {
  return releases.find((release) => !release.draft && !release.prerelease) ?? null;
}

function extractSectionBullets(body: string | null, sectionHeading: string): string[] {
  if (!body) {
    return [];
  }

  const bullets: string[] = [];
  let inSection = false;

  for (const line of body.split('\n')) {
    const trimmedLine = line.trim();

    if (isMarkdownHeading(trimmedLine)) {
      if (inSection) {
        break;
      }

      inSection = matchesSectionHeading(trimmedLine, sectionHeading);
      continue;
    }

    if (inSection && trimmedLine.startsWith('- ')) {
      bullets.push(cleanReleaseText(trimmedLine.slice(2)));
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
    .map((line) => cleanReleaseText(line.slice(2)));
}

function extractFirstParagraph(body: string | null): string | null {
  if (!body) {
    return null;
  }

  const paragraphLines: string[] = [];

  for (const line of body.split('\n')) {
    const trimmedLine = line.trim();

    if (
      !trimmedLine ||
      isMarkdownHeading(trimmedLine) ||
      trimmedLine.startsWith('- ') ||
      isReleaseMetadataLine(trimmedLine)
    ) {
      if (paragraphLines.length > 0) {
        break;
      }

      continue;
    }

    paragraphLines.push(cleanReleaseText(trimmedLine));
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

function extractExternalChecksumUrl(body: string | null): string | null {
  if (!body) {
    return null;
  }

  const checksumDownloadMatch = body.match(/SHA256 download:\s*(https?:\/\/\S+)/i);
  if (checksumDownloadMatch?.[1]) {
    return checksumDownloadMatch[1];
  }

  const directChecksumMatch = body.match(/Direct HTTPS checksum:\s*(https?:\/\/\S+)/i);
  return directChecksumMatch?.[1] ?? null;
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

function formatReleaseVersion(tag: string | null | undefined, fallback: string): string {
  if (!tag) {
    return fallback;
  }

  return tag.replace(/^v(?=\d)/, '');
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
  const summary = cleanReleaseText(
    highlights[0] ?? allBullets[0] ?? extractFirstParagraph(release.body) ?? fallbackRelease.summary
  );
  const points = (highlights.length > 0 ? highlights.slice(1) : allBullets.slice(1))
    .filter((point) => point !== summary)
    .slice(0, 2);

  return {
    kicker: 'Latest GitHub release',
    status: inferReleaseStatus(release),
    date: formatReleaseDate(release.published_at, fallbackRelease.date),
    version: formatReleaseVersion(release.tag_name, fallbackRelease.version),
    summary,
    points: points.length > 0 ? points : fallbackRelease.points,
    details: [
      { label: 'Release tag', value: release.tag_name || fallbackRelease.version },
      { label: 'Channel', value: release.prerelease ? 'Prerelease' : 'Stable' },
    ],
  };
}

function buildReleaseActions(
  release: GitHubRelease,
  fallbackHero: typeof siteContent.hero
): ReleaseActions {
  const externalIsoUrl = extractExternalIsoUrl(release.body);
  const externalChecksumUrl = extractExternalChecksumUrl(release.body);
  const isoAsset = release.assets.find((asset) => /\.iso$/i.test(asset.name));
  const checksumAsset = release.assets.find((asset) => /\.sha256$/i.test(asset.name));
  const fallbackChecksumUrl = `${fallbackHero.primaryCta.href}.sha256`;
  let primary: ReleaseAction;
  let secondary: ReleaseAction;

  if (externalIsoUrl) {
    primary = {
      label: 'Download ISO',
      href: externalIsoUrl,
      external: true,
    };
    secondary = {
      label: 'Download SHA256',
      href: externalChecksumUrl ?? `${externalIsoUrl}.sha256`,
      external: true,
    };
  } else if (isoAsset) {
    primary = {
      label: 'Download ISO',
      href: isoAsset.browser_download_url,
      external: true,
    };
    secondary = checksumAsset
      ? {
          label: 'Download SHA256',
          href: checksumAsset.browser_download_url,
          external: true,
        }
      : {
          label: 'Download SHA256',
          href: fallbackChecksumUrl,
          external: true,
        };
  } else {
    primary = fallbackHero.primaryCta;
    secondary = {
      label: 'Download SHA256',
      href: fallbackChecksumUrl,
      external: true,
    };
  }

  return {
    primary,
    secondary,
    tertiary: {
      label: 'View Build',
      href: fallbackHero.secondaryCta.href,
      external: true,
    },
    quaternary: {
      label: 'View Release',
      href: release.html_url || buildReleasesPageUrl(fallbackHero.secondaryCta.href),
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
  private readonly isReleaseLoading = signal(true);
  protected readonly showReleaseCard = computed(() => !this.isReleaseLoading());
  protected readonly releaseCard = computed(() =>
    this.latestRelease() ? buildReleaseCard(this.latestRelease()!, this.content.release) : this.content.release
  );
  protected readonly releaseActions = computed(() =>
    this.latestRelease()
      ? buildReleaseActions(this.latestRelease()!, this.content.hero)
      : {
          primary: this.content.hero.primaryCta,
          secondary: {
            label: 'Download SHA256',
            href: `${this.content.hero.primaryCta.href}.sha256`,
            external: true,
          },
          tertiary: this.content.hero.secondaryCta,
          quaternary: {
            label: 'View Release',
            href: buildReleasesPageUrl(this.content.hero.secondaryCta.href),
            external: true,
          },
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
    } finally {
      this.isReleaseLoading.set(false);
    }
  }
}
