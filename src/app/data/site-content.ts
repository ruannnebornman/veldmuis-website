export interface SiteNavLink {
  label: string;
  href: string;
  external: boolean;
}

export const siteContent = {
  siteName: 'Veldmuis',
  brandLine: 'Crafted in the veld',
  hero: {
    kicker: 'Arch-derived. KDE-based. Signed.',
    tagline: 'Warm desktop, deliberate release',
    description:
      'Veldmuis Linux is an Arch-derived KDE distribution with signed package workflows, a warm visual identity, and a deliberate desktop direction shaped around the African veld at sunset.',
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
    kicker: 'Current release state',
    description: 'The live ISO and install path are working. The release section should say exactly that and no more.',
    status: 'Pre-alpha milestone',
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
    primaryCta: {
      label: 'Browse Releases',
      href: 'https://github.com/ruannnebornman/veldmuis/releases',
      external: true,
    },
    secondaryCta: {
      label: 'Source Repository',
      href: 'https://github.com/ruannnebornman/veldmuis',
      external: true,
    },
  },
  footer: {
    copy: 'Veldmuis Linux. Crafted in the veld, built in the open.',
    links: [
      { label: 'GitHub', href: 'https://github.com/ruannnebornman/veldmuis', external: true },
      { label: 'Releases', href: 'https://github.com/ruannnebornman/veldmuis/releases', external: true },
    ] satisfies SiteNavLink[],
  },
} as const;
