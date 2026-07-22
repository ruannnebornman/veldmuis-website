import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    window.location.hash = '';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Veldmuis');
  });

  it('should render the full brand line without a top anchor link', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.brand-text span')?.textContent).toContain(
      'Crafted in the veld, built in the open.',
    );
    expect(compiled.querySelector('.brand')?.getAttribute('href')).toBeNull();
  });

  it('should link the hero try now button to the desktop preview', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const tryNowLink = compiled.querySelector('.hero-actions .button-primary') as HTMLAnchorElement;

    expect(tryNowLink?.textContent).toContain('Try now');
    expect(tryNowLink?.getAttribute('href')).toBe('#try-now');
  });

  it('should render the Veldmuis Plasma desktop when the try now route is active', async () => {
    window.location.hash = '#try-now';

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.plasma-desktop')).not.toBeNull();
    expect(compiled.querySelector('.launcher-button')?.getAttribute('aria-label')).toBe(
      'Application Launcher',
    );
    expect(compiled.querySelector<HTMLImageElement>('.launcher-button img')?.src).toContain(
      'start-here-kde.svg',
    );
    expect(compiled.querySelector('.window-app-id strong')?.textContent).toContain('Dolphin');
    expect(compiled.textContent).toContain('5 Folders');
    expect(compiled.querySelector<HTMLImageElement>('.folder-item img')?.src).toContain(
      'folder-documents.svg',
    );
    expect(compiled.querySelector('.desktop-back-button')?.getAttribute('href')).toBe('#home');
    expect(compiled.querySelector('.desktop-back-button')?.textContent).toContain(
      'Back to website',
    );
    expect(compiled.textContent).not.toContain('Discover');
    expect(compiled.textContent).not.toContain('Routemate');
  });

  it('should open apps from Kickoff and support the window controls', async () => {
    window.location.hash = '#try-now';

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('.launcher-button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.application-launcher')).not.toBeNull();

    const konsoleButton = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.launcher-app'),
    ).find((button) => button.textContent?.includes('Konsole'));
    konsoleButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.window-app-id strong')?.textContent).toContain('Konsole');
    expect(compiled.textContent).toContain('KDE Plasma 6.7.2');

    compiled
      .querySelector<HTMLButtonElement>('.window-toolbar button[aria-label="Maximize"]')
      ?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.plasma-window-maximized')).not.toBeNull();

    compiled
      .querySelector<HTMLButtonElement>('.window-toolbar button[aria-label="Minimize"]')
      ?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.plasma-window')).toBeNull();

    compiled
      .querySelector<HTMLButtonElement>('.task-buttons button[aria-label="Konsole"]')
      ?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.window-app-id strong')?.textContent).toContain('Konsole');
  });

  it('should not render duplicate footer action links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.footer-links')).toBeNull();
  });

  it('should not render the release card until the release request settles', () => {
    const pendingFetch = new Promise<Response>(() => {});

    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(pendingFetch);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.release-card')).toBeNull();
  });

  it('should render a compact official-links note in the footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(
      'Official Veldmuis links live on this website and GitHub only.',
    );
    expect(compiled.querySelector('.trust-section')).toBeNull();
    expect(compiled.querySelector('.release-trust')).toBeNull();
    expect(compiled.querySelector('.footer-note')?.textContent).toContain(
      'Official Veldmuis links live on this website and GitHub only.',
    );
  });

  it('should prefer the latest stable GitHub release when one is available', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/1.4.1-beta',
          tag_name: '1.4.1-beta',
          name: 'Veldmuis Linux 1.4.1-beta',
          draft: false,
          prerelease: true,
          published_at: '2026-04-02T08:13:43Z',
          assets: [
            {
              name: 'veldmuis-2026.04.02-x86_64.iso',
              size: 1707145216,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/1.4.1-beta/veldmuis-2026.04.02-x86_64.iso',
            },
          ],
          body: '# Veldmuis Linux 1.4.1-beta\n\n## Highlights\n- Beta release.\n',
        },
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/2.0.0',
          tag_name: '2.0.0',
          name: 'Veldmuis Linux 2.0.0',
          draft: false,
          prerelease: false,
          published_at: '2026-04-01T08:13:43Z',
          assets: [
            {
              name: 'veldmuis-2026.04.01-x86_64.iso.sha256',
              size: 97,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/2.0.0/veldmuis-2026.04.01-x86_64.iso.sha256',
            },
          ],
          body: '# Veldmuis Linux 2.0.0\n\n## Highlights\n- First stable hosted release.\n\n## Downloads\nISO download: https://downloads.veldmuislinux.org/iso/latest.iso\nChecksum asset: `veldmuis-2026.04.01-x86_64.iso.sha256`\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector(
      '.release-actions .button-primary',
    ) as HTMLAnchorElement;
    const secondaryAction = compiled.querySelector(
      '.release-actions .button-secondary',
    ) as HTMLAnchorElement;
    const buildLink = compiled.querySelector(
      '.release-links .release-link:first-child',
    ) as HTMLAnchorElement;
    const releaseLink = compiled.querySelector(
      '.release-links .release-link:last-child',
    ) as HTMLAnchorElement;

    expect(compiled.querySelector('.release-kicker')?.textContent).toContain(
      'Latest GitHub release',
    );
    expect(compiled.querySelector('.release-version')?.textContent).toContain('2.0.0');
    expect(compiled.querySelector('.release-points li:first-child')?.textContent).toContain(
      'First stable hosted release.',
    );
    expect(primaryAction.getAttribute('href')).toBe(
      'https://downloads.veldmuislinux.org/iso/latest.iso',
    );
    expect(secondaryAction.getAttribute('href')).toContain('.iso.sha256');
    expect(buildLink.getAttribute('href')).toBe('https://github.com/ruannnebornman/veldmuis');
    expect(buildLink.textContent).toContain('View Build');
    expect(releaseLink.getAttribute('href')).toContain('/releases/tag/2.0.0');
    expect(compiled.textContent).toContain('Stable');
  });

  it('should use immutable network and offline installer channels when available', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          schema_version: 1,
          channel: 'stable',
          installer: 'network',
          release_tag: '2026.07',
          published_at: '2026-07-01T19:18:07Z',
          iso: {
            name: 'veldmuis-2026.07-network-x86_64.iso',
            url: 'https://downloads.veldmuislinux.org/iso/releases/2026.07/veldmuis-2026.07-network-x86_64.iso',
            bytes: 2433222656,
            sha256: 'a'.repeat(64),
            checksum_url:
              'https://downloads.veldmuislinux.org/iso/releases/2026.07/veldmuis-2026.07-network-x86_64.iso.sha256',
          },
          manifest: {
            url: 'https://downloads.veldmuislinux.org/iso/releases/2026.07/veldmuis-2026.07-network-x86_64.manifest.txt',
            signature_url:
              'https://downloads.veldmuislinux.org/iso/releases/2026.07/veldmuis-2026.07-network-x86_64.manifest.txt.sig',
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          schema_version: 1,
          channel: 'stable',
          installer: 'offline',
          release_tag: '2026.07.22',
          published_at: '2026-07-22T17:35:00Z',
          iso: {
            name: 'veldmuis-2026.07.22-offline-x86_64.iso',
            url: 'https://downloads.veldmuislinux.org/iso/releases/2026.07.22/veldmuis-2026.07.22-offline-x86_64.iso',
            bytes: 4666042368,
            sha256: 'b'.repeat(64),
            checksum_url:
              'https://downloads.veldmuislinux.org/iso/releases/2026.07.22/veldmuis-2026.07.22-offline-x86_64.iso.sha256',
          },
          manifest: {
            url: 'https://downloads.veldmuislinux.org/iso/releases/2026.07.22/veldmuis-2026.07.22-offline-x86_64.manifest.txt',
            signature_url:
              'https://downloads.veldmuislinux.org/iso/releases/2026.07.22/veldmuis-2026.07.22-offline-x86_64.manifest.txt.sig',
          },
        }),
      } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector(
      '.release-actions .button-primary',
    ) as HTMLAnchorElement;
    const secondaryAction = compiled.querySelector(
      '.release-actions .button-secondary',
    ) as HTMLAnchorElement;
    const releaseLinks = compiled.querySelectorAll<HTMLAnchorElement>('.release-links a');

    expect(primaryAction.textContent).toContain('Network installer');
    expect(primaryAction.getAttribute('href')).toContain(
      '/releases/2026.07/veldmuis-2026.07-network-x86_64.iso',
    );
    expect(secondaryAction.textContent).toContain('Offline installer');
    expect(secondaryAction.getAttribute('href')).toContain(
      '/releases/2026.07.22/veldmuis-2026.07.22-offline-x86_64.iso',
    );
    expect(releaseLinks[0]?.textContent).toContain('Network SHA256');
    expect(releaseLinks[1]?.textContent).toContain('Offline SHA256');
  });

  it('should use an external ISO link from a stable release when no ISO asset is attached', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/2.0.0',
          tag_name: '2.0.0',
          name: 'Veldmuis Linux 2.0.0',
          draft: false,
          prerelease: false,
          published_at: '2026-04-01T08:13:43Z',
          assets: [
            {
              name: 'veldmuis-2026.04.01-x86_64.iso.sha256',
              size: 97,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/2.0.0/veldmuis-2026.04.01-x86_64.iso.sha256',
            },
          ],
          body: '# Veldmuis Linux 2.0.0\n\n## Highlights\n- Hosted ISO delivery is now live on the stable release line.\n- The website reads the stable external download URL from the release body.\n\n## Downloads\nISO download: https://downloads.veldmuislinux.org/iso/latest.iso\nChecksum asset: `veldmuis-2026.04.01-x86_64.iso.sha256`\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector(
      '.release-actions .button-primary',
    ) as HTMLAnchorElement;
    const secondaryAction = compiled.querySelector(
      '.release-actions .button-secondary',
    ) as HTMLAnchorElement;

    expect(compiled.querySelector('.release-version')?.textContent).toContain('2.0.0');
    expect(compiled.querySelector('.release-points li:first-child')?.textContent).toContain(
      'Hosted ISO delivery is now live on the stable release line.',
    );
    expect(primaryAction.getAttribute('href')).toBe(
      'https://downloads.veldmuislinux.org/iso/latest.iso',
    );
    expect(secondaryAction.getAttribute('href')).toBe(
      'https://downloads.veldmuislinux.org/iso/latest.iso.sha256',
    );
    expect(compiled.textContent).not.toContain('Primary asset');
    expect(compiled.textContent).not.toContain('Asset size');
    expect(compiled.textContent).toContain('Stable');
  });

  it('should fall back to the bundled stable download path when only prereleases exist', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/1.3.1-beta',
          tag_name: '1.3.1-beta',
          name: 'Veldmuis Linux 1.3.1-beta',
          draft: false,
          prerelease: true,
          published_at: '2026-03-20T08:13:43Z',
          assets: [
            {
              name: 'veldmuis-2026.03.20-x86_64.iso.sha256',
              size: 97,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/1.3.1-beta/veldmuis-2026.03.20-x86_64.iso.sha256',
            },
          ],
          body: '## Highlights\n- Hosted prerelease.\n\n## Downloads\nISO download: https://old-host.invalid/iso.iso\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector(
      '.release-actions .button-primary',
    ) as HTMLAnchorElement;
    const secondaryAction = compiled.querySelector(
      '.release-actions .button-secondary',
    ) as HTMLAnchorElement;

    expect(compiled.querySelector('.release-version')?.textContent).toContain('1.0.0');
    expect(primaryAction.getAttribute('href')).toBe(
      'https://downloads.veldmuislinux.org/iso/latest.iso',
    );
    expect(secondaryAction.getAttribute('href')).toBe(
      'https://downloads.veldmuislinux.org/iso/latest.iso.sha256',
    );
    expect(compiled.textContent).toContain('Stable release line');
  });

  it('should fall back to the hosted site download when a stable release has no valid ISO URL', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/v1.4.1',
          tag_name: 'v1.4.1',
          name: 'Veldmuis v1.4.1',
          draft: false,
          prerelease: false,
          published_at: '2026-03-27T07:10:00Z',
          assets: [
            {
              name: 'veldmuis-2026.03.27-x86_64.iso.sha256',
              size: 97,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/v1.4.1/veldmuis-2026.03.27-x86_64.iso.sha256',
            },
            {
              name: 'veldmuis-2026.03.27-x86_64.manifest.txt',
              size: 301,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/v1.4.1/veldmuis-2026.03.27-x86_64.manifest.txt',
            },
          ],
          body: '# Highlights\n\n- Stable hosted release.\n\n## Downloads\n\nISO download: /latest.iso\nChecksum asset: `veldmuis-2026.03.27-x86_64.iso.sha256`\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector(
      '.release-actions .button-primary',
    ) as HTMLAnchorElement;
    const secondaryAction = compiled.querySelector(
      '.release-actions .button-secondary',
    ) as HTMLAnchorElement;

    expect(compiled.querySelector('.release-version')?.textContent).toContain('1.4.1');
    expect(compiled.querySelector('.release-points li:first-child')?.textContent).toContain(
      'Stable hosted release.',
    );
    expect(primaryAction.getAttribute('href')).toBe(
      'https://downloads.veldmuislinux.org/iso/latest.iso',
    );
    expect(secondaryAction.getAttribute('href')).toBe(
      'https://downloads.veldmuislinux.org/iso/latest.iso.sha256',
    );
    expect(primaryAction.textContent).toContain('Download ISO');
    expect(compiled.textContent).not.toContain('ISO download: /latest.iso');
    expect(compiled.textContent).not.toContain('Primary asset');
    expect(compiled.textContent).not.toContain('Asset size');
  });
});
