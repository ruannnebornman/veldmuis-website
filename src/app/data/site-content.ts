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
      href: 'https://github.com/ruannnebornman/veldmuis/releases',
      external: true,
    },
    secondaryCta: {
      label: 'View Build',
      href: 'https://github.com/ruannnebornman/veldmuis',
      external: true,
    },
    tryNowCta: {
      label: 'Try it in the browser',
      href: '#try-now',
      external: false,
    },
    meta: ['x86_64', 'KDE Plasma', 'Systemd-boot'],
  },
  release: {
    kicker: 'Current release',
    status: 'Stable release line',
    date: 'August 2026',
    version: '2026.08',
    details: [
      { label: 'Architecture', value: 'x86_64' },
      { label: 'Desktop', value: 'KDE Plasma' },
      { label: 'Installer', value: 'Calamares' },
      { label: 'Package flow', value: 'signed local Veldmuis repos' },
    ],
  },
  build: {
    eyebrow: 'Built in the open',
    links: [
      {
        label: 'View source',
        href: 'https://github.com/ruannnebornman/veldmuis',
        external: true,
      },
      {
        label: 'Signed manifest',
        href: 'https://downloads.veldmuislinux.org/iso/channels/network.manifest.txt',
        external: true,
      },
    ],
  },
  maintainer: {
    name: 'Ruanne Bornman',
    links: [
      {
        label: 'Personal site',
        href: 'https://ruannebornman.com/',
        external: true,
      },
    ],
  },
  demo: {
    windows: [
      {
        id: 'browser',
        icon: 'assets/kde/firefox.svg',
        title: 'Veldmuis Linux - Mozilla Firefox',
        appName: 'Firefox',
        description: 'Fast and private web browser',
      },
      {
        id: 'files',
        icon: 'assets/kde/dolphin.svg',
        title: 'Home — Dolphin',
        appName: 'Dolphin',
        description: 'Manage your files',
      },
      {
        id: 'terminal',
        icon: 'assets/kde/konsole.svg',
        title: 'Konsole',
        appName: 'Konsole',
        description: 'Command line terminal',
      },
      {
        id: 'settings',
        icon: 'assets/kde/system-settings.svg',
        title: 'System Settings',
        appName: 'System Settings',
        description: "Configure the system's behavior and appearance",
      },
    ],
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
    links: [
      {
        label: 'Official GitHub',
        href: 'https://github.com/ruannnebornman/veldmuis',
        external: true,
      },
      {
        label: 'Maintainer',
        href: 'https://ruannebornman.com/',
        external: true,
      },
    ],
  },
} as const;
