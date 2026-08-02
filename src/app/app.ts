import { Component, computed, signal } from '@angular/core';
import { siteContent } from './data/site-content';

const GITHUB_RELEASES_URL = 'https://api.github.com/repos/ruannnebornman/veldmuis/releases';
const DOWNLOAD_BASE_URL =
  globalThis.location?.port === '4200'
    ? '/iso'
    : 'https://downloads.veldmuislinux.org/iso';
const INSTALLER_CHANNEL_URLS = {
  network: `${DOWNLOAD_BASE_URL}/channels/network.json`,
  offline: `${DOWNLOAD_BASE_URL}/channels/offline.json`,
} as const;

type InstallerKind = keyof typeof INSTALLER_CHANNEL_URLS;

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

interface InstallerChannel {
  schema_version: number;
  channel: string;
  installer: InstallerKind;
  release_tag: string;
  published_at: string;
  iso: {
    name: string;
    url: string;
    bytes: number;
    sha256: string;
    checksum_url: string;
  };
  manifest: {
    url: string;
    signature_url: string;
  };
}

type InstallerChannels = Record<InstallerKind, InstallerChannel | null>;

interface ReleaseCardContent {
  kicker: string;
  status: string;
  date: string;
  version: string;
  details: readonly ReleaseDetail[];
}

interface ReleaseAction {
  label: string;
  href: string;
  external: boolean;
  hint?: string;
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

interface WindowDragState {
  pointerId: number;
  pointerX: number;
  pointerY: number;
  windowX: number;
  windowY: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

function buildReleasesPageUrl(repoUrl: string): string {
  return `${repoUrl.replace(/\/+$/, '')}/releases`;
}

function pickDisplayRelease(releases: GitHubRelease[]): GitHubRelease | null {
  return releases.find((release) => !release.draft && !release.prerelease) ?? null;
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

  const match = body.match(/^(?:[-*]\s*)?(?:ISO download|Immutable ISO):\s*(https?:\/\/\S+)/im);
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

function isTrustedDownloadUrl(value: unknown, expectedPath: string): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'downloads.veldmuislinux.org' &&
      url.pathname === expectedPath &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

function parseInstallerChannel(value: unknown, installer: InstallerKind): InstallerChannel | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<InstallerChannel>;
  const releaseTag = candidate.release_tag;
  const iso = candidate.iso;
  const manifest = candidate.manifest;

  if (
    candidate.schema_version !== 1 ||
    candidate.channel !== 'stable' ||
    candidate.installer !== installer ||
    typeof releaseTag !== 'string' ||
    !/^\d{4}\.\d{2}(?:\.\d{2}(?:\.(?:[2-9]|[1-9]\d+))?)?$/.test(releaseTag) ||
    typeof candidate.published_at !== 'string' ||
    !iso ||
    !manifest
  ) {
    return null;
  }

  const isoName = `veldmuis-${releaseTag}-${installer}-x86_64.iso`;
  const immutablePath = `/iso/releases/${releaseTag}/${isoName}`;

  if (
    iso.name !== isoName ||
    !isTrustedDownloadUrl(iso.url, immutablePath) ||
    !Number.isSafeInteger(iso.bytes) ||
    iso.bytes <= 0 ||
    typeof iso.sha256 !== 'string' ||
    !/^[0-9a-f]{64}$/.test(iso.sha256) ||
    !isTrustedDownloadUrl(iso.checksum_url, `${immutablePath}.sha256`) ||
    !isTrustedDownloadUrl(
      manifest.url,
      `/iso/releases/${releaseTag}/veldmuis-${releaseTag}-${installer}-x86_64.manifest.txt`,
    ) ||
    !isTrustedDownloadUrl(
      manifest.signature_url,
      `/iso/releases/${releaseTag}/veldmuis-${releaseTag}-${installer}-x86_64.manifest.txt.sig`,
    )
  ) {
    return null;
  }

  return candidate as InstallerChannel;
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
  fallbackRelease: typeof siteContent.release,
): ReleaseCardContent {
  return {
    kicker: 'Latest GitHub release',
    status: inferReleaseStatus(release),
    date: formatReleaseDate(release.published_at, fallbackRelease.date),
    version: formatReleaseVersion(release.tag_name, fallbackRelease.version),
    details: [
      { label: 'Release tag', value: release.tag_name || fallbackRelease.version },
      { label: 'Channel', value: release.prerelease ? 'Prerelease' : 'Stable' },
    ],
  };
}

function buildReleaseActions(
  release: GitHubRelease,
  fallbackHero: typeof siteContent.hero,
  channels: InstallerChannels,
): ReleaseActions {
  const externalIsoUrl = extractExternalIsoUrl(release.body);
  const externalChecksumUrl = extractExternalChecksumUrl(release.body);
  const isoAsset = release.assets.find((asset) => /\.iso$/i.test(asset.name));
  const checksumAsset = release.assets.find((asset) => /\.sha256$/i.test(asset.name));
  const releasesPageUrl = buildReleasesPageUrl(fallbackHero.secondaryCta.href);
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
          href: `${isoAsset.browser_download_url}.sha256`,
          external: true,
        };
  } else {
    primary = {
      label: fallbackHero.primaryCta.label,
      href: releasesPageUrl,
      external: true,
    };
    secondary = {
      label: 'Download SHA256',
      href: releasesPageUrl,
      external: true,
    };
  }

  if (channels.network) {
    primary = {
      label: 'Download ISO',
      href: channels.network.iso.url,
      external: true,
      hint: formatBytes(channels.network.iso.bytes),
    };
  }
  if (channels.offline) {
    secondary = {
      label: 'Offline ISO',
      href: channels.offline.iso.url,
      external: true,
    };
  }

  return {
    primary,
    secondary,
    tertiary: channels.network
      ? {
          label: 'SHA256',
          href: channels.network.iso.checksum_url,
          external: true,
        }
      : {
          label: 'View Build',
          href: fallbackHero.secondaryCta.href,
          external: true,
        },
    quaternary: channels.offline
      ? {
          label: 'Offline SHA256',
          href: channels.offline.iso.checksum_url,
          external: true,
        }
      : {
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
  styleUrls: ['./app.css', './desktop-preview.css'],
})
export class App {
  protected readonly title = signal(siteContent.siteName);
  protected readonly content = siteContent;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly currentRoute = signal(
    globalThis.location?.hash === '#try-now' ? 'try-now' : 'home',
  );
  protected readonly activeWindow =
    signal<(typeof siteContent.demo.windows)[number]['id']>('files');
  protected readonly windowOpen = signal(true);
  protected readonly windowMaximized = signal(false);
  protected readonly windowPosition = signal({ x: 0, y: 0 });
  protected readonly windowDragging = signal(false);
  protected readonly launcherOpen = signal(false);
  protected readonly launcherQuery = signal('');
  protected readonly desktopTime = signal(this.formatDesktopTime());
  protected readonly desktopDate = signal(this.formatDesktopDate());
  private readonly latestRelease = signal<GitHubRelease | null>(null);
  private readonly installerChannels = signal<InstallerChannels>({
    network: null,
    offline: null,
  });
  private readonly isReleaseLoading = signal(true);
  private windowDragState: WindowDragState | null = null;
  protected readonly showReleaseCard = computed(() => !this.isReleaseLoading());
  protected readonly releaseCard = computed(() =>
    this.latestRelease()
      ? buildReleaseCard(this.latestRelease()!, this.content.release)
      : this.content.release,
  );
  protected readonly releaseActions = computed<ReleaseActions>(() =>
    this.latestRelease()
      ? buildReleaseActions(this.latestRelease()!, this.content.hero, this.installerChannels())
      : {
          primary: this.installerChannels().network
            ? {
                label: 'Download ISO',
                href: this.installerChannels().network!.iso.url,
                external: true,
                hint: formatBytes(this.installerChannels().network!.iso.bytes),
              }
            : this.content.hero.primaryCta,
          secondary: this.installerChannels().offline
            ? {
                label: 'Offline ISO',
                href: this.installerChannels().offline!.iso.url,
                external: true,
              }
            : {
                label: 'Download SHA256',
                href: buildReleasesPageUrl(this.content.hero.secondaryCta.href),
                external: true,
              },
          tertiary: this.installerChannels().network
            ? {
                label: 'SHA256',
                href: this.installerChannels().network!.iso.checksum_url,
                external: true,
              }
            : this.content.hero.secondaryCta,
          quaternary: this.installerChannels().offline
            ? {
                label: 'Offline SHA256',
                href: this.installerChannels().offline!.iso.checksum_url,
                external: true,
              }
            : {
                label: 'View Release',
                href: buildReleasesPageUrl(this.content.hero.secondaryCta.href),
                external: true,
              },
        },
  );

  protected readonly isTryNowPage = computed(() => this.currentRoute() === 'try-now');
  protected readonly activeWindowContent = computed(
    () =>
      this.content.demo.windows.find((window) => window.id === this.activeWindow()) ??
      this.content.demo.windows[0],
  );
  protected readonly filteredLauncherWindows = computed(() => {
    const query = this.launcherQuery().trim().toLowerCase();

    if (!query) {
      return this.content.demo.windows;
    }

    return this.content.demo.windows.filter((window) =>
      `${window.appName} ${window.title}`.toLowerCase().includes(query),
    );
  });

  constructor() {
    globalThis.addEventListener?.('hashchange', () => this.syncRouteFromHash());
    globalThis.setInterval?.(() => {
      this.desktopTime.set(this.formatDesktopTime());
      this.desktopDate.set(this.formatDesktopDate());
    }, 30_000);
    void this.loadReleaseData();
  }

  protected openWindow(windowId: (typeof siteContent.demo.windows)[number]['id']): void {
    this.activeWindow.set(windowId);
    this.windowOpen.set(true);
    this.windowMaximized.set(false);
  }

  protected openFromLauncher(windowId: (typeof siteContent.demo.windows)[number]['id']): void {
    this.openWindow(windowId);
    this.launcherOpen.set(false);
  }

  protected toggleLauncher(): void {
    this.launcherOpen.update((isOpen) => !isOpen);
  }

  protected closeLauncher(): void {
    this.launcherOpen.set(false);
  }

  protected activateTask(windowId: (typeof siteContent.demo.windows)[number]['id']): void {
    if (this.activeWindow() === windowId && this.windowOpen()) {
      this.windowOpen.set(false);
      return;
    }

    this.openWindow(windowId);
  }

  protected minimizeWindow(): void {
    this.windowOpen.set(false);
  }

  protected toggleMaximize(): void {
    this.finishWindowDrag();
    this.windowMaximized.update((isMaximized) => !isMaximized);
  }

  protected closeWindow(): void {
    this.windowOpen.set(false);
    this.windowMaximized.set(false);
  }

  protected updateLauncherQuery(event: Event): void {
    this.launcherQuery.set((event.target as HTMLInputElement | null)?.value ?? '');
  }

  protected startWindowDrag(event: PointerEvent): void {
    const target = event.target as HTMLElement | null;

    if (event.button !== 0 || this.windowMaximized() || target?.closest('button')) {
      return;
    }

    const titlebar = event.currentTarget as HTMLElement | null;
    const windowElement = titlebar?.closest<HTMLElement>('.plasma-window');

    if (!titlebar || !windowElement) {
      return;
    }

    const bounds = windowElement.getBoundingClientRect();
    const position = this.windowPosition();
    this.windowDragState = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      windowX: position.x,
      windowY: position.y,
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    };
    this.windowDragging.set(true);
    titlebar.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  protected moveWindow(event: PointerEvent): void {
    const dragState = this.windowDragState;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const viewportWidth = globalThis.innerWidth;
    const viewportHeight = globalThis.innerHeight;
    const deltaX = event.clientX - dragState.pointerX;
    const deltaY = event.clientY - dragState.pointerY;
    const minimumVisibleWidth = Math.min(120, dragState.width / 2);
    const minimumLeft = minimumVisibleWidth - dragState.width;
    const maximumLeft = viewportWidth - minimumVisibleWidth;
    const maximumTop = Math.max(0, viewportHeight - 54 - dragState.height);
    const nextLeft = Math.min(Math.max(dragState.left + deltaX, minimumLeft), maximumLeft);
    const nextTop = Math.min(Math.max(dragState.top + deltaY, 0), maximumTop);

    this.windowPosition.set({
      x: dragState.windowX + nextLeft - dragState.left,
      y: dragState.windowY + nextTop - dragState.top,
    });
  }

  protected endWindowDrag(event: PointerEvent): void {
    if (this.windowDragState?.pointerId !== event.pointerId) {
      return;
    }

    (event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId);
    this.finishWindowDrag();
  }

  private finishWindowDrag(): void {
    this.windowDragState = null;
    this.windowDragging.set(false);
  }

  private syncRouteFromHash(): void {
    const route = globalThis.location?.hash === '#try-now' ? 'try-now' : 'home';
    this.currentRoute.set(route);

    if (route === 'home') {
      this.launcherOpen.set(false);
      this.finishWindowDrag();
    }
  }

  private formatDesktopTime(): string {
    return new Intl.DateTimeFormat('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  }

  private formatDesktopDate(): string {
    const date = new Date();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}/${month}/${day}`;
  }

  private async loadReleaseData(): Promise<void> {
    try {
      await Promise.all([this.loadLatestRelease(), this.loadInstallerChannels()]);
    } finally {
      this.isReleaseLoading.set(false);
    }
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

  private async loadInstallerChannels(): Promise<void> {
    const loadChannel = async (installer: InstallerKind): Promise<InstallerChannel | null> => {
      try {
        const response = await fetch(INSTALLER_CHANNEL_URLS[installer], {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          return null;
        }

        return parseInstallerChannel(await response.json(), installer);
      } catch {
        return null;
      }
    };

    const [network, offline] = await Promise.all([loadChannel('network'), loadChannel('offline')]);
    this.installerChannels.set({ network, offline });
  }
}
