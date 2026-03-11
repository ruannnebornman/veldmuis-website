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
      href: 'https://github.com/ruannnebornman/veldmuis/releases',
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
    status: 'Alpha milestone',
    date: 'March 2026',
    version: '0.1 pre-alpha',
    summary:
      'The live ISO boots, installs through the current archinstall bootstrap flow, and lands in a branded Plasma environment with Veldmuis defaults applied for a fresh user.',
    points: [
      'Bootable live ISO with Veldmuis branding',
      'Working archinstall bootstrap path',
      'Fresh-user Plasma defaults applied after install',
    ],
    details: [
      { label: 'Architecture', value: 'x86_64' },
      { label: 'Desktop', value: 'KDE Plasma' },
      { label: 'Installer', value: 'archinstall bootstrap' },
      { label: 'Package flow', value: 'signed local Veldmuis repos' },
    ],
  },
  footer: {
    copy: 'Veldmuis Linux. Crafted in the veld, built in the open.',
  },
} as const;
