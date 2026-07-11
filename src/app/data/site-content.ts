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
      { icon: '🗂️', label: 'Dolphin', window: 'files' },
      { icon: '⌨️', label: 'Konsole', window: 'terminal' },
      { icon: '⚙️', label: 'Settings', window: 'settings' },
      { icon: '🛒', label: 'Discover', window: 'discover' },
    ],
    windows: [
      {
        id: 'files',
        icon: '🗂️',
        title: 'Dolphin — Home',
        appName: 'Dolphin',
        kicker: 'KDE Plasma desktop preview',
        heading: 'Browse Veldmuis like a KDE desktop.',
        description:
          'This is a visual desktop preview of Veldmuis Linux. It shows the KDE Plasma experience with familiar panels, windows, widgets, and app shortcuts.',
        points: ['Home', 'Downloads', 'Pictures', 'Veldmuis ISO', 'Readme.txt'],
        preview: 'files',
      },
      {
        id: 'terminal',
        icon: '⌨️',
        title: 'Konsole',
        appName: 'Konsole',
        kicker: 'Terminal',
        heading: 'A real Linux desktop feel.',
        description:
          'The demo leans into KDE conventions: a Breeze-like titlebar, bottom panel, application launcher, system tray, and widgets over a Plasma-style wallpaper.',
        points: ['sudo pacman -Syu', 'neofetch', 'uname -r', 'systemctl status'],
        preview: 'terminal',
      },
      {
        id: 'settings',
        icon: '⚙️',
        title: 'System Settings',
        appName: 'System Settings',
        kicker: 'Appearance',
        heading: 'KDE settings, themed for Veldmuis.',
        description:
          'Show visitors the look and feel before they download: dark theme, Plasma panel, KDE-style cards, and Veldmuis branding.',
        points: [
          'Global Theme: Breeze Dark',
          'Icons: Breeze',
          'Window decorations: Veldmuis',
          'Panel position: Bottom',
        ],
        preview: 'settings',
      },
      {
        id: 'discover',
        icon: '🛒',
        title: 'Discover',
        appName: 'Discover',
        kicker: 'Software center',
        heading: 'Explore apps from a desktop mockup.',
        description:
          'Discover is represented as part of the KDE preview so the page feels like an operating system desktop rather than a generic website section.',
        points: ['Firefox', 'LibreOffice', 'Krita', 'VLC'],
        preview: 'discover',
      },
    ],
    widget: {
      title: 'Veldmuis desktop preview',
      copy: 'A browser-based mockup of the KDE Plasma environment visitors can try before downloading the ISO.',
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
