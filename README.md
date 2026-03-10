# Veldmuis Website

Landing page for Veldmuis Linux, built with Angular. The site is designed as a warm, branded distro homepage with release information, primary download links, and a maintainable content file for quick updates.

## Stack

- Angular 21
- TypeScript
- Plain CSS with reusable theme variables

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

The app runs at `http://localhost:4200/` by default.

## Available Scripts

```bash
npm start       # Angular dev server
npm run build   # Production build
npm test        # Unit tests
```

## GitHub Pages Deployment

This repo includes a GitHub Actions workflow at `.github/workflows/pages.yml` that deploys the built site to GitHub Pages on every push to `main`.

For this repository, the published URL will be:

```text
https://ruannnebornman.github.io/veldmuis-website/
```

### One-time GitHub setup

1. Push this repository, including the workflow file, to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main` or run the `Deploy to GitHub Pages` workflow manually from the `Actions` tab.

### Notes

- The workflow builds Angular with a repo-relative base path, so the site works under `/veldmuis-website/`.
- The deploy artifact is uploaded from `dist/website/browser`.
- If you later switch to a custom domain, update the build step in `.github/workflows/pages.yml` so the base href matches that domain root.

## Updating Site Content

Most copy and external links live in:

- `src/app/data/site-content.ts`

The current page structure lives in:

- `src/app/app.html`

The visual system and layout live in:

- `src/app/app.css`
- `src/styles.css`

Static assets live in:

- `public/assets`

## Project Layout

```text
src/
  app/
    app.ts
    app.html
    app.css
    data/
      site-content.ts
public/
  assets/
docs/
  WEBSITE_BRIEF.md
  IMPLEMENTATION_PLAN.md
```

## Notes

- `README.angular.md` contains Angular-specific development notes.
- The project brief and design direction are in `docs/WEBSITE_BRIEF.md`.
