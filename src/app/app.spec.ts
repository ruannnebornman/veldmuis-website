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

  it('should render the latest GitHub prerelease when available', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          html_url: 'https://github.com/ruannnebornman/veldmuis/releases/tag/0.1.0-alpha',
          tag_name: '0.1.0-alpha',
          name: 'Veldmuis Linux 0.1.0-alpha',
          draft: false,
          prerelease: true,
          published_at: '2026-03-11T08:13:43Z',
          assets: [
            {
              name: 'veldmuis-2026.03.11-x86_64.iso',
              size: 1707145216,
              browser_download_url:
                'https://github.com/ruannnebornman/veldmuis/releases/download/0.1.0-alpha/veldmuis-2026.03.11-x86_64.iso',
            },
          ],
          body:
            '# Veldmuis Linux 0.1.0-alpha\n\n## Highlights\n- First tagged technical alpha release.\n- Live ISO boots into a branded Veldmuis KDE Plasma session.\n- archinstall remains available as the primary install path.\n- Installed systems can sync against the hosted Veldmuis package repositories.\n',
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
    expect(compiled.querySelector('.release-heading h2')?.textContent).toContain('0.1.0-alpha');
    expect(compiled.querySelector('.release-summary')?.textContent).toContain(
      'First tagged technical alpha release.'
    );
    expect(primaryAction.getAttribute('href')).toContain(
      '/releases/download/0.1.0-alpha/veldmuis-2026.03.11-x86_64.iso'
    );
    expect(secondaryAction.getAttribute('href')).toContain('/releases/tag/0.1.0-alpha');
  });
});
