export const siteContent = {
  siteName: 'Veldmuis',
  brandLine: 'Crafted in the veld, built in the open.',
  hero: {
    kicker: 'Arch-based. KDE Plasma. Signed.',
    description:
      `Veldmuis Linux is an Arch-based KDE Plasma distribution
with signed package workflows,shaped around the 
African veld at sunset.`,
    primaryCta: {
      label: 'Download ISO',
      href: 'https://downloads.veldmuislinux.org/iso/latest.iso',
      external: true,
    },
    secondaryCta: {
      label: 'View on GitHub',
      href: 'https://github.com/ruannnebornman/veldmuis',
      external: true,
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
  footer: {
    copy: 'Veldmuis Linux. Crafted in the veld, built in the open.',
  },
} as const;
