import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
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
      'Crafted in the veld, built in the open.'
    );
    expect(compiled.querySelector('.brand')?.getAttribute('href')).toBeNull();
  });

  it('should not render duplicate footer action links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.footer-links')).toBeNull();
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
          body:
            '# Veldmuis Linux 1.4.1-beta\n\n## Highlights\n- Beta release.\n',
        },
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/1.4.0',
          tag_name: '1.4.0',
          name: 'Veldmuis Linux 1.4.0',
          draft: false,
          prerelease: false,
          published_at: '2026-04-01T08:13:43Z',
          assets: [
            {
              name: 'veldmuis-2026.04.01-x86_64.iso.sha256',
              size: 97,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/1.4.0/veldmuis-2026.04.01-x86_64.iso.sha256',
            },
          ],
          body:
            '# Veldmuis Linux 1.4.0\n\n## Highlights\n- First stable hosted release.\n\n## Downloads\nISO download: http://downloads.veldmuislinux.org\nChecksum asset: `veldmuis-2026.04.01-x86_64.iso.sha256`\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector('.release-actions .button-primary') as HTMLAnchorElement;
    const secondaryAction = compiled.querySelector('.release-actions .button-secondary') as HTMLAnchorElement;

    expect(compiled.querySelector('.release-topline .eyebrow')?.textContent).toContain(
      'Latest GitHub release'
    );
    expect(compiled.querySelector('.release-heading h2')?.textContent).toContain('1.4.0');
    expect(compiled.querySelector('.release-summary')?.textContent).toContain('First stable hosted release.');
    expect(primaryAction.getAttribute('href')).toBe('http://downloads.veldmuislinux.org');
    expect(secondaryAction.getAttribute('href')).toContain('/releases/tag/1.4.0');
    expect(compiled.textContent).toContain('Stable');
  });

  it('should use an external ISO link from a stable release when no ISO asset is attached', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/1.4.0',
          tag_name: '1.4.0',
          name: 'Veldmuis Linux 1.4.0',
          draft: false,
          prerelease: false,
          published_at: '2026-04-01T08:13:43Z',
          assets: [
            {
              name: 'veldmuis-2026.04.01-x86_64.iso.sha256',
              size: 97,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/1.4.0/veldmuis-2026.04.01-x86_64.iso.sha256',
            },
          ],
          body:
            '# Veldmuis Linux 1.4.0\n\n## Highlights\n- Hosted ISO delivery is now live on the stable release line.\n- The website reads the stable external download URL from the release body.\n\n## Downloads\nISO download: http://downloads.veldmuislinux.org\nChecksum asset: `veldmuis-2026.04.01-x86_64.iso.sha256`\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector('.release-actions .button-primary') as HTMLAnchorElement;

    expect(compiled.querySelector('.release-heading h2')?.textContent).toContain('1.4.0');
    expect(compiled.querySelector('.release-summary')?.textContent).toContain(
      'Hosted ISO delivery is now live on the stable release line.'
    );
    expect(primaryAction.getAttribute('href')).toBe('http://downloads.veldmuislinux.org');
    expect(compiled.textContent).toContain('External ISO link');
    expect(compiled.textContent).toContain('Hosted externally');
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
          body:
            '## Highlights\n- Hosted prerelease.\n\n## Downloads\nISO download: https://old-host.invalid/iso.iso\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector('.release-actions .button-primary') as HTMLAnchorElement;

    expect(compiled.querySelector('.release-heading h2')?.textContent).toContain('1.4.0');
    expect(primaryAction.getAttribute('href')).toBe('http://downloads.veldmuislinux.org');
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
          body:
            '# Highlights\n\n- Stable hosted release.\n\n## Downloads\n\nISO download: /latest.iso\nChecksum asset: `veldmuis-2026.03.27-x86_64.iso.sha256`\n',
        },
      ],
    } as Response);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primaryAction = compiled.querySelector('.release-actions .button-primary') as HTMLAnchorElement;

    expect(compiled.querySelector('.release-heading h2')?.textContent).toContain('v1.4.1');
    expect(primaryAction.getAttribute('href')).toBe('http://downloads.veldmuislinux.org');
    expect(primaryAction.textContent).toContain('Download ISO');
    expect(compiled.textContent).toContain('veldmuis-2026.03.27-x86_64.manifest.txt');
  });
});
