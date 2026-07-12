# Desktop preview assets

The browser desktop preview intentionally mirrors the assets shipped by Veldmuis Linux.

- `public/assets/kde/veldmuis-dawn.png` is copied from
  `veldmuis/packages/veldmuis-branding/veldmuis-wallpaper/contents/images/1920x1080.png`.
  The Veldmuis branding package declares MIT and CC-BY-SA licensing for its payload.
- The KDE application, place, category, action, and status SVGs are copied unchanged from
  the locally installed Breeze and hicolor icon themes. Embedded SPDX notices are retained.
- `public/assets/kde/firefox.svg` is copied unchanged from the installed Firefox desktop icon
  and is used only to identify Firefox inside the simulated Plasma task manager and launcher.

Refresh these files from the distro source and its installed icon theme when the Veldmuis
desktop defaults change.
