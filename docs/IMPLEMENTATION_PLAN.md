# Veldmuis Website Implementation Plan

## Goal

Build a polished Angular landing page for Veldmuis Linux that reflects the
sunset veld / field mouse brand mood and is easy to maintain as the distro
changes.

## Working Direction

The site should feel:

- warm
- handcrafted
- premium
- technical without corporate SaaS styling
- inspired by the wallpaper palette and texture, not by literal mascot art

The site should avoid:

- cold blue product-site aesthetics
- generic startup gradients
- overly futuristic glassmorphism
- decorative clutter that competes with the content

## Project Shape

Create a new Angular app in:

```text
website/
```

Use a simple component structure:

```text
website/src/app/
  app.ts
  app.html
  app.css
  data/site-content.ts
  components/
    hero/
    features/
    preview/
    install/
    release/
    community/
    footer/
```

Keep data that changes often in a small content file so links, version labels,
and section text can be swapped without restructuring the layout.

## Visual System

Define a reusable theme system first:

- core CSS variables for palette
- background variants
- surface styles
- text hierarchy
- button variants
- card styles
- terminal/code block styles
- subtle texture and glow utilities

Suggested palette roles:

- primary: sun gold / amber
- secondary: burnt orange / copper
- dark background: smoky brown-violet
- surface: deep brown with warm undertones
- text on dark: warm cream / pale sand
- text on light: charcoal-brown

## Page Structure

### 1. Hero

Purpose:

- establish brand mood immediately
- explain what Veldmuis Linux is
- provide clear primary actions

Contents:

- distro name
- short tagline
- short technical value proposition
- primary CTA
- secondary CTA
- atmospheric visual treatment inspired by the wallpaper

### 2. Features

Purpose:

- explain why Veldmuis is different

Contents:

- 3 to 6 cards
- focused technical positioning
- small visual motifs, not heavy illustration

### 3. Preview

Purpose:

- create visual proof that the distro looks intentional

Contents:

- wallpaper / desktop preview frame
- supporting caption or feature note

### 4. Install / Quick Start

Purpose:

- make the distro feel immediately usable

Contents:

- short install explanation
- terminal-style code block
- concise numbered flow or command examples

### 5. Release

Purpose:

- show current milestone and make the page feel alive

Contents:

- current version
- architecture
- channel or release label
- milestone note

### 6. Community / Open Source

Purpose:

- direct users toward GitHub, docs, issues, and contribution paths

Contents:

- GitHub link
- docs link
- issue tracker link
- contribution message

### 7. Footer

Purpose:

- lightweight closing navigation

Contents:

- useful links
- project identity
- short copyright / open-source note

## Content Model

Keep copy and mutable values centralized in a typed content object:

- `siteName`
- `tagline`
- `description`
- `latestVersion`
- `architecture`
- `downloadUrl`
- `docsUrl`
- `githubUrl`
- features array
- quick start commands
- community links

## Implementation Order

### Phase 1. Foundation

- scaffold Angular app
- set up global CSS variables
- import typography
- create base layout and section shell

Exit criteria:

- app runs
- theme tokens exist
- layout is responsive at a basic level

### Phase 2. Landing Page Structure

- build all major sections
- wire content from a central data file
- create visual hierarchy and spacing

Exit criteria:

- complete landing page exists
- all required sections are present

### Phase 3. Visual Refinement

- add painterly gradients and subtle texture
- refine buttons, cards, badges, and code blocks
- improve hero composition
- improve mobile spacing and stacking

Exit criteria:

- page feels branded and intentional, not placeholder

### Phase 4. Content and Asset Hooks

- make screenshot and wallpaper areas easy to swap later
- label download/version areas clearly
- leave obvious placeholders where real release artifacts will go

Exit criteria:

- future content updates are straightforward

## Technical Notes

- start with plain Angular CSS, no heavy styling framework
- keep components simple and standalone
- use semantic HTML and accessible headings
- prefer CSS custom properties over hardcoded colors
- design mobile-first, then refine large-screen composition

## Immediate Next Step

1. Scaffold `website/` as a new Angular app.
2. Implement the global theme and section skeleton.
3. Build the first-pass landing page with placeholder but structured content.
