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
      href: 'https://drive.proton.me/urls/5FVKQT4G40#swN1c0HA3YcJ',
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
    version: '0.3.0-alpha',
    summary:
      'Fresh installs now complete cleanly through Calamares, first-boot pacman updates work without manual recovery, and the desktop baseline is broader and more usable out of the box.',
    points: [
      'Calamares install path validated on VM and bare metal',
      'First-boot sudo pacman -Syu works cleanly',
      'Firefox, Discover, Flatpak, and Steam included by default',
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
