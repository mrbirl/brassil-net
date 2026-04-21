# brassil.net — Design System

Companion to `CLAUDE.md`. This file captures the visual direction and design decisions for the site. Claude Code should read this alongside `CLAUDE.md` whenever working on anything visual — layouts, components, typography, colour, motion.

## Visual identity in one sentence

A warm, editorial photography site that feels like a considered monograph — spacious, typographically precise, and quietly confident.

## Colour palette

| Role | Hex | Usage |
|---|---|---|
| Background | `#ECEAE5` | Page background throughout |
| Card / surface | `#FFFFFF` | Cards, modals, nav on scroll |
| Primary text | `#1A1917` | Headings, body |
| Muted text | `#6B6560` | Captions, labels, secondary info |
| Border | `#D9D5CF` | Dividers, card outlines |
| Subtle fill | `#F2EFE8` | Hover states, section backgrounds |
| Accent | `#B85C28` | CTAs, active states, links, small highlights only |

Rules:
- No gradients. No mesh gradients, no blurred colour blobs.
- No shadows heavier than `0 2px 20px rgba(0,0,0,0.07)`.
- Accent used sparingly — one or two elements per section at most.
- Define all colours as CSS variables AND as Tailwind theme extensions in `tailwind.config.mjs` under `theme.extend.colors` so utility classes like `bg-background` and `text-accent` work.

## Typography

**Heading font:** Fraunces (Google Fonts)
- Display headings: 400 weight, italic where emphasis is needed (e.g. "Photographs from *the western edge*")
- Section headings: 400–600 weight, upright
- Letter-spacing: `-0.02em` to `-0.025em` on large sizes
- Line-height: `1.05–1.1` on display, `1.3` on mid-size

**Body font:** Outfit (Google Fonts)
- Body copy: 300–400 weight, 14–15px, line-height `1.85`
- Labels / metadata / nav: 500 weight, 10–12px, `letter-spacing: 0.08–0.15em`, uppercase
- UI text (buttons, tags): 500 weight, 12–13px

Load both fonts via `<link>` tags in the base layout `<head>`, with `display=swap` and appropriate weight subsets only (avoid loading the full family). No fallback to Inter or system fonts for primary UI.

## Layout principles

- **Max content width:** 1280px, centred
- **Page padding:** 64px horizontal on desktop, 24px on mobile
- **Grid:** 12-column CSS grid. Photography sections can break to full bleed. Text and card sections respect the content width.
- **Spacing scale:** generous. Sections have 80–96px vertical padding. Internal card padding 24–28px.
- **Corners:** `border-radius: 12–16px` on cards. Sharp (0) on dividers and borders. Never pill-shaped except on buttons.
- **Buttons:** Accent-filled pill (`border-radius: 100px`) for primary CTAs. Ghost/outline style for secondary, with sufficient contrast.

## Tech implementation

- **Framework:** Astro + Tailwind (per `CLAUDE.md`). Do not introduce React/Next/custom CSS-only approaches.
- **Styling:** Tailwind utility classes in markup. Extend `tailwind.config.mjs` with:
  - Full colour palette (see above)
  - Font families for Fraunces and Outfit
  - Spacing, radius, and letter-spacing tokens reflecting the scale here
- **Custom CSS:** use sparingly, only for things Tailwind can't express cleanly (e.g. complex pseudo-element treatments, keyframe animations). Global styles live in `src/styles/global.css`.
- **Components:** extract to `src/components/` once a pattern is used 3+ times. Don't pre-extract — let patterns emerge.
- **Images:** always use Astro's `<Image />` from `astro:assets` for photo content. Never raw `<img>` for photo content.

## Site structure

### Navigation
- Sticky on scroll, background transitions from transparent to `#FFFFFF` with `1px solid #D9D5CF` border-bottom
- Left: `brassil.net` wordmark in Fraunces 17px, preceded by a 7px accent-coloured dot
- Right: text links (Work, Prints, About, Projects) in Outfit 13px muted, plus a filled accent pill CTA "Browse prints"
- Mobile: hamburger triggers a full-screen overlay

### Hero (homepage) — rotating

Replaces the static 40/60 split from earlier drafts. Same 40/60 layout (text left, photo right), but the right-hand photo rotates through 3–4 hero candidates.

- Crossfade between photos, 6-second hold per photo, 800ms fade.
- No UI chrome for the rotation — no dots, no arrows, no progress bar. The rotation should feel like ambient motion, not a carousel.
- Pause rotation on hover over the photo column. Resume on leave.
- Respect `prefers-reduced-motion`: if set, pick one photo at random on load and don't rotate.
- Text column stays static across rotations — the copy doesn't change per photo, only the image does.
- Hero photo candidates are marked with `heroCandidate: true` in the photo content collection frontmatter. Build-time selects all matching photos.
- Coordinate label bottom-left of photo, date/conditions top-right, both in Outfit 10px at ~50% white opacity. Rotates with the photo. Suppressed if the photo's frontmatter has `showCoordinates: false`.

Text column contents (top to bottom):
- Eyebrow label (Outfit 10px uppercase accent)
- H1 in Fraunces, e.g. "Photographs from *the western edge*" — italic on the secondary phrase
- Short horizontal rule (1px, border colour, 48px wide)
- Body paragraph (Outfit 15px, muted text)
- Two CTAs side by side (primary accent pill + ghost outline)
- Metadata strip below a top border: three small stat blocks — prints available, % to MSF, location

### Work / photography grid (homepage section)
- Section heading left-aligned in Fraunces 30px + "Full archive →" right-aligned in Outfit accent
- **Asymmetric grid:** one large feature card spanning two rows on the left (~55% width), two smaller cards stacked on the right
- Cards: white, `border-radius: 16px`, subtle shadow. Photo fills top portion. Caption below with title (Fraunces 16–20px), sub-line (Outfit 12px muted), metadata/conditions (Outfit 10px accent colour)
- Coordinate overlay on each photo image, bottom-left, Outfit 9–10px white at ~50% opacity (suppressed per `showCoordinates` flag)
- Hover: photo brightens +5%, card lifts `translateY(-2px)`, transition `0.2s ease`

### Prints CTA section (replacement for dark-overlay band)

Replaces the dark-overlay band. Editorial treatment on the warm background:
- Full-bleed row, no dark overlay
- Two-column at desktop: left column holds a large editorial quote treatment — "36 prints. All proceeds to MSF." in Fraunces 48–64px, italic on "MSF", with a thin accent rule above and a small ghost-outline pill CTA below ("Browse prints →"). Right column: a single full-bleed photograph that breaks out of the content grid, no overlay, no text on it.
- On mobile: stacks vertically, photo first then text.
- No dark overlays anywhere on the site.

### Secondary content ("Also here")
- Three equal cards in a row: Side projects, CV, Past work
- White cards, `border-radius: 14px`, `1px solid border`
- Each: title in Fraunces 18px + `↗` in accent top-right → description in Outfit 13px 300 weight
- Hover: border colour shifts to accent

### Footer
- Single rule, 26px vertical padding
- Left: dot + "© 2026 brassil.net" in Outfit 12px muted
- Right: Instagram, Projects, CV links in Outfit 12px muted

### Photo detail page (`/photos/[slug]`)

- Large photo, max height ~75vh, object-contain so nothing crops
- Below photo: metadata row (location, date, conditions) in Outfit small caps
- Title in Fraunces ~42px, left-aligned
- Long description as body copy, constrained to ~65ch
- Print options panel: cards for each size/paper option with price, accent pill "Request this print" CTA on each
- Request form: see below

### Print request form

Inline expanding panel, not a modal. When user clicks "Request this print":
- Panel expands below the print options (250ms ease), pushes page content down naturally
- Fields in a single column at ~560px max width: name, email, size/paper confirmation, shipping address (single textarea), optional notes
- Turnstile widget above submit button
- Submit is accent pill, full-width on mobile
- Success state replaces the form with a short confirmation message in the warm background colour, no modal, no redirect
- On mobile, same pattern — no slide-up sheets, no separate route

### CV page (`/cv`)

Defer detailed design until first pass of homepage and photos is complete. Guideline direction: single-column, editorial treatment, Fraunces for section headings, Outfit for body. Downloadable PDF link in accent colour near the top. No visual chrome — treat it as a typographic document.

## Content-driven details

### Coordinates and location privacy

Photo frontmatter includes `showCoordinates: boolean` (default `true`). When `false`, the coordinate overlay is suppressed on the card and detail page, and alt text uses only the place name without coordinates. Use for sensitive or private locations.

### Hero rotation candidates

Photo frontmatter includes `heroCandidate: boolean` (default `false`). Homepage hero rotates through all photos marked `true`. Aim for 3–5 strong candidates; never more than 6.

## Motion and interaction

- **Page load:** no splash screen, no skeleton loaders. Content renders immediately.
- **Page transitions:** use Astro 5's `<ViewTransitions />` for subtle crossfades between routes. No custom transition choreography.
- **Scroll reveals:** sections fade up on enter (`opacity: 0 → 1`, `translateY(16px → 0)`, `0.5s ease`, staggered per card). Use `IntersectionObserver`. Respect `prefers-reduced-motion`.
- **Hero rotation:** 6s hold, 800ms crossfade (see Hero section).
- **Hover on cards:** `translateY(-2px)`, brightness +5% on image, `0.2s ease`. Nothing more.
- **Nav transition:** background and border fade in over `0.3s` on scroll past hero.
- **No scroll-jacking.** Native scroll only.
- **No Lottie, no canvas animations, no parallax, no 3D icons.**

## Photography display rules

- All images: `object-fit: cover`, aspect ratios defined by the container (never by the image)
- Feature card: unconstrained height, fills grid row
- Small cards: `height: 160px` image area
- Hero art: fills full column height, no padding
- Alt text: place name + date (e.g. "Achill Island, Co. Mayo, November 2024"). Coordinates omitted from alt text regardless of `showCoordinates`.

## Placeholder strategy

**Use real photographs as placeholders from day one.** Drop 6–8 actual photos into `/public/placeholders/` or the content collection before building layouts. Do not use SVG illustrations, greybox fills, or picsum.photos as placeholders — they flatter weak layouts and distort design judgement. The design must be built against real photographic content to be evaluated honestly.

If real photos aren't ready for a given section, note a `TODO:` in the code and leave the container empty rather than filling with illustration.

## Anti-patterns — do not implement

1. Mesh gradients or blurred colour blobs
2. `border-radius` above 16px on cards, or pill shapes on anything except buttons
3. Heavy drop shadows
4. Scroll-jacking or interfering with native scroll
5. Lottie animations, 3D icon sets, or canvas effects
6. Full-bleed hero with centred text and a single CTA button as the entire homepage layout
7. Square thumbnail grid with identical hover overlays
8. Inter as the only typeface with no display contrast
9. Ghost buttons for primary CTAs
10. AI-style marketing copy ("empowering", "unleashing", "seamless", "elevate your", "crafted with care")
11. Dark photo overlays with centred text on top
12. SVG illustration placeholders that survive past initial scaffold
13. Carousel dots, arrows, or progress indicators on the hero rotation
14. Modal dialogs for the print request form

## Open design TODOs

- CV page detailed treatment (deferred until homepage and photos are complete)
- Apps index page visual treatment (likely inherits cards pattern from "Also here")
- About page treatment (likely inherits CV typographic approach)
- 404 page
- Loading/error states for the print request form beyond success
- Choose the 3–5 hero rotation candidate photos
- Decide whether the accent `#B85C28` needs an adjusted value for dark-mode (if dark mode ships)
