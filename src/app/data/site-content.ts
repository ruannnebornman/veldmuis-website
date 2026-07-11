export const siteContent = {
  siteName: 'Veldmuis',
  brandLine: 'Crafted in the veld, built in the open.',
  hero: {
    kicker: 'Arch-based. KDE Plasma. Signed.',
    description: `Veldmuis Linux is an Arch-based KDE Plasma distribution
with signed package workflows,
shaped around the African veld at sunset.`,
    primaryCta: {
      label: 'Download ISO',
      href: 'https://downloads.veldmuislinux.org/iso/latest.iso',
      external: true,
    },
    secondaryCta: {
      label: 'View Build',
      href: 'https://github.com/ruannnebornman/veldmuis',
      external: true,
    },
    tryNowCta: {
      label: 'Try now',
      href: '#try-now',
      external: false,
    },
    meta: ['x86_64', 'KDE Plasma', 'Systemd-boot'],
  },
  release: {
    kicker: 'Current release',
    status: 'Stable release line',
    date: 'March 2026',
    version: '1.0.0',
    summary:
      'Hosted ISO delivery, signed package publishing, and the website download path are now aligned for the next stable Veldmuis release.',
    points: [
      'Download button points at the current hosted ISO path',
      'Signed package repositories publish to packages.veldmuislinux.org',
      'If you see 1.0.0 here, the site is showing its fallback release card',
    ],
    details: [
      { label: 'Architecture', value: 'x86_64' },
      { label: 'Desktop', value: 'KDE Plasma' },
      { label: 'Installer', value: 'Calamares' },
      { label: 'Package flow', value: 'signed local Veldmuis repos' },
    ],
  },
  demo: {
    shortcuts: [
      { icon: '🗺️', label: 'Routes', window: 'routes' },
      { icon: '🚌', label: 'Transit', window: 'transit' },
      { icon: '⚙️', label: 'Settings', window: 'settings' },
    ],
    windows: [
      {
        id: 'routes',
        icon: '🗺️',
        title: 'Route planner',
        kicker: 'Routemate demo',
        heading: 'Plan a day across the veld.',
        description:
          'This KDE-style preview shows how Routemate could feel on the Veldmuis desktop: map-first, quick to scan, and ready for live trip decisions.',
        points: [
          'Drag between stops on the map preview.',
          'Compare time, distance, and comfort at a glance.',
          'Keep your route window pinned above the desktop panel.',
        ],
      },
      {
        id: 'transit',
        icon: '🚌',
        title: 'Transit board',
        kicker: 'Arrivals',
        heading: 'See what is leaving next.',
        description:
          'A compact board presents upcoming legs like a Plasma widget, with clear timing for the next route choice.',
        points: [
          'Next bus: 8 min from Acacia Stop.',
          'Walking link: 600 m along the river path.',
          'Connection confidence: comfortable.',
        ],
      },
      {
        id: 'settings',
        icon: '⚙️',
        title: 'Route settings',
        kicker: 'Preferences',
        heading: 'Tune Routemate to your trip.',
        description:
          'Preference controls demonstrate how users could prioritise fewer transfers, accessible paths, or lower data use.',
        points: [
          'Prefer shaded walking routes.',
          'Avoid gravel roads after sunset.',
          'Sync offline route packs when on Wi‑Fi.',
        ],
      },
    ],
    widget: {
      title: 'Today’s sample trip',
      copy: 'Home → Market → Station, with two calm transfers and a sunset arrival.',
    },
  },
  trust: {
    text: 'Official Veldmuis links live on this website and GitHub only.',
    link: {
      label: 'Official GitHub',
      href: 'https://github.com/ruannnebornman/veldmuis',
    },
  },
  footer: {
    copy: 'Veldmuis Linux. Crafted in the veld, built in the open.',
    note: 'Official Veldmuis links live on this website and GitHub only.',
  },
} as const;
