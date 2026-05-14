# brassil.net — Design System

Companion to `CLAUDE.md`. This file captures the visual direction and design decisions for the site. Claude Code should read this alongside `CLAUDE.md` whenever working on anything visual — layouts, components, typography, colour, motion.

## Visual identity in one sentence

A minimal, Swiss-mono calling card — sharp neutral palette, monospaced precision, photography front and centre. Quiet confidence, no ornament.

## Colour palette

| Role | Token | Hex | Usage |
|---|---|---|---|
| Background | `background` | `#F5F5F4` | Page background throughout |
| Surface | `surface` | `#FFFFFF` | Cards, overlays |
| Primary text | `ink` | `#0A0A0A` | Headings, body |
| Muted text | `muted` | `#737373` | Captions, labels, secondary info |
| Border | `rim` | `#E5E5E4` | Dividers, card outlines, door hairlines |
| Accent | `accent` | `#FF5C1F` | **Names of specific works (photo titles, app names) on hover/display.** Nowhere else — see accent rule below. |

Rules:
- No gradients. No mesh gradients, no blurred colour blobs.
- No shadows heavier than `0 2px 20px rgba(0,0,0,0.07)`.
- `#FF5C1F` marks **the name of a specific work**, and nothing else. Permitted uses:
  - Photo title labels revealed on hover over a photo card (gallery and homepage)
  - Photo title heading on the photo detail page (Fraunces, displayed once at the top)
  - App names on the apps index, revealed on hover over an app card
- `#FF5C1F` is **never** used for: buttons, links, navigation, focus rings, door arrows, section numerals, form CTAs, hover states on non-named elements, error states, success states, or any decorative/branding purpose.
- Intelligibility test: if a user pointed at an orange element and asked "why is this orange?", the answer must be "because it's the name of a specific photograph or app." If the answer is anything else, the orange is wrong.
- Define all colours as CSS variables AND as Tailwind theme extensions in `tailwind.config.mjs` under `theme.extend.colors` so utility classes like `bg-background` and `text-accent` work.

## Typography

**Display heading:** Fraunces (Google Fonts) — used for one element only: the `Cian Brassil` nameplate heading on the homepage.
- Weight 400, italic on the surname: `Cian <em>Brassil</em>`
- Font-size: `clamp(30px, 3.4vw, 46px)` on the homepage nameplate
- Letter-spacing: `-0.025em`
- Line-height: `1.05`

**Everything else:** IBM Plex Mono (Google Fonts)
- Body copy: 400 weight, 13–15px, line-height `1.5–1.6`
- Labels / metadata / nav: 500 weight, 10–11px, `letter-spacing: 0.04em`, uppercase
- Door titles: 500 weight, 20px, `letter-spacing: -0.02em`
- Photo titles: 400 weight italic, 14px
- UI text (buttons, tags): 500 weight, 11–12px

Load both fonts via `<link>` tags in the base layout `<head>`, with `display=swap`. Subsets: Fraunces italic + regular 400 only; IBM Plex Mono 400 + 500 + italic 400.

No fallback to Inter, Outfit, or system-sans for primary UI. Mono stack fallback only: `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace`.

## Layout principles

- **Max content width:** 1280px, centred
- **Page padding:** 32–40px horizontal on desktop, 20px on mobile
- **Homepage:** full-viewport calling card — no top nav, no scroll. Photo fills the upper portion; nameplate grid anchors the bottom. See homepage section below.
- **Interior pages:** standard BaseLayout with sticky top nav.
- **Grid:** 12-column CSS grid where needed. Photography sections can break to full bleed. Text and card sections respect the content width.
- **Spacing:** generous. Interior page sections have 80–96px vertical padding. Nameplate internal padding 36–40px.
- **Corners:** sharp (0) on the homepage photo frame and doors. `border-radius: 12–16px` on interior cards. Never pill-shaped except on buttons.
- **Buttons:** sharp or very low radius (`border-radius: 0`) for primary actions on homepage. Accent-filled pill (`border-radius: 100px`) for interior page CTAs.

## Tech implementation

- **Framework:** Astro + Tailwind (per `CLAUDE.md`). Do not introduce React/Next/custom CSS-only approaches.
- **Styling:** Tailwind utility classes in markup. Extend `tailwind.config.mjs` with:
  - Full colour palette (see above)
  - Font families: `serif` for Fraunces, `mono` for IBM Plex Mono
  - Spacing, radius, and letter-spacing tokens reflecting the scale here
- **Custom CSS:** use sparingly, only for things Tailwind can't express cleanly (hover transitions, keyframe animations). Global styles live in `src/styles/global.css`.
- **Components:** extract to `src/components/` once a pattern is used 3+ times. Don't pre-extract.
- **Images:** always use Astro's `<Image />` from `astro:assets` for photo content in interior pages. The homepage uses a `<img>` placeholder until real hero photos are wired from the content collection.

## Site structure

### Homepage (`/`) — calling card

The homepage is a full-viewport experience. No top navigation — the three doors below the photo ARE the navigation. No scroll.

Structure (top to bottom, full 100dvh):
1. **Photo frame** — fills remaining height after nameplate on desktop. Margins: 32px top, 32px sides. Sharp corners. Contains:
   - Hero photo (object-fit: cover, full bleed within frame)
   - Photo title — **desktop only**. Bottom-left corner, IBM Plex Mono italic 14px, `#FF5C1F`. Hidden by default (opacity 0), fades in on hover (opacity 0→1, translateY 4px→0, 0.25s). Not shown on touch/coarse-pointer devices at all. The `/photos` gallery is where photo titles always appear.
   - Aspect ratios: desktop uses `flex: 1 1 auto` (fills remaining viewport height — effectively landscape, approximately 16:9 to 2:1 depending on screen dimensions). Mobile (< 640px) uses `aspect-ratio: 4/5` (portrait-friendly crop).
2. **Nameplate** — fixed-height bottom grid. 4 columns on desktop:
   - **Col 1 — Identity:** `brassil.net` label (mono 10px uppercase muted) + `Cian Brassil` h1 in Fraunces + tagline in IBM Plex Mono muted.
   - **Col 2 — Door 01:** Photographs → /photos
   - **Col 3 — Door 02:** Apps → /apps
   - **Col 4 — Door 03:** CV → /cv
   - **Footer row** spanning all 4 cols: `© 2026` left, `Galway · Ireland` right, mono 10px uppercase muted.

Door design:
- Top border hairline (`1px solid rim`). On hover/active: border shifts to near-black (`ink`).
- Number label: mono 10px uppercase muted.
- Title: IBM Plex Mono 500 20px, `letter-spacing: -0.02em`, with `↗` that translates on hover.
- Subtitle: mono 12px muted.
- No accent colour anywhere on doors.

On mobile (< 640px):
- Photo frame: margin reduces to 16px, aspect-ratio 4:5 (portrait crop), fixed size rather than flex-fill
- Nameplate: 2-column grid (identity spans full width, doors pair across two columns)
- Door numerals (01, 02, 03) hidden — visual stacking order implies sequence
- Photo title: not shown on mobile or touch devices at all (desktop hover-only enhancement)
- Tagline: visible on mobile, same position relative to nameplate as desktop

### Navigation (interior pages)

Used on all pages except the homepage.
- Sticky on scroll, background transitions from transparent to `#FFFFFF` with `1px solid rim` border-bottom
- Left: `brassil.net` wordmark in IBM Plex Mono 13px, preceded by a 6px near-black square dot
- Right: text links (Photos, Apps, CV) in IBM Plex Mono 12px muted
- Mobile: links stack under wordmark or collapse to a simple menu

### Photo gallery (`/photos`)

#### Layout philosophy

The gallery is a curated composition, not a uniform grid. **Feature photos must genuinely dominate** — roughly 2× the visual weight of standard photos, not marginally larger. The hierarchy must be obvious at a glance; push it hard.

#### Grid

- 12-column CSS grid on desktop (≥ 768px), `grid-auto-flow: dense`
- Column gap: 60px, row gap: 100px
- Page max-width 1280px, centred, 32–40px horizontal padding
- Single column, full-width per photo on mobile (< 768px), 32px gap between photos

#### Cell sizing (desktop)

| `gridSize` | Landscape (≥ 1.2:1) | Portrait (≤ 0.8:1) | Square (~1:1) |
|---|---|---|---|
| `feature` | 12 columns — full container width, alone on its row | 7 columns, tall aspect ratio | 9 columns, tall aspect ratio |
| `standard` | 5 columns | 4 columns | 4 columns |

A `feature` landscape photo takes the entire container width and sits alone on its row. A `feature` portrait takes 7 of 12 columns and is tall, leaving room for one or two standard photos beside it. Standard photos are small — 4–5 columns — so two or three pack per row. This creates real rhythm: full-width feature moments punctuating rows of smaller standard photos.

Orientation is detected from image dimensions at build time (`width / height` ratio). No manual orientation field.

Photos use their natural aspect ratio; `object-fit: cover` applies when cell dimensions can't match exactly.

#### Card chrome

- No background, no border, no border-radius — the photo is the card
- `cursor: pointer` on all photo cards
- Hover: photo brightness +8%, 0.2s ease. No card translation.
- Photo title: hidden by default on desktop, fades in on hover (opacity 0→1, translateY 4px→0, 0.25s). IBM Plex Mono italic 14px, `#FF5C1F`, bottom-left of photo, `text-shadow: 0 1px 8px rgba(0,0,0,0.6)`.
- On mobile/touch (`pointer: coarse`): photo title visible by default at 78% opacity, same position/styling.
- No coordinate overlay on cards.
- The affordance that photos are clickable = cursor pointer + brightness shift + orange title reveal. No "view" buttons, arrows, or instruction text anywhere.

#### Curation order

1. `order` field ascending (if present)
2. `dateTaken` descending
3. Filename alphabetically

Gaps from `grid-auto-flow: dense` not perfectly packing are acceptable — they read as intentional whitespace in this aesthetic. Do not reorder photos to eliminate gaps.

### Photo detail page (`/photos/[slug]`)

- Standard interior BaseLayout with sticky top nav
- Large hero photo at top: max-height 75vh, `object-contain` (no cropping)
- Hero image shares `transition:name={`photo-${slug}`}` with its gallery card — the photo morphs from card position to hero on navigation
- Photo title in Fraunces ~42px, `#FF5C1F`, left-aligned, directly below the hero
- Metadata: location + date in IBM Plex Mono muted, below the title
- Coordinates in muted IBM Plex Mono overlaid at bottom of hero photo, suppressed when `showCoordinates: false`
- `TODO:` long description, print options panel, request-print form, related photos

### CV page (`/cv`)

Single-column, editorial. Fraunces for section headings, IBM Plex Mono for body. Downloadable PDF link near the top. No visual chrome.

### Footer (interior pages)

- Single rule, 26px vertical padding
- Left: `© 2026 brassil.net` in IBM Plex Mono 11px muted
- Right: Photos, Apps, CV links in IBM Plex Mono 11px muted

## Motion and interaction

- **Gallery → detail shared element transition:** When a photo card is clicked on `/photos`, the photo itself morphs from its card position into the detail page's large hero photo position. Same image, animating to new size and location.
  - Implement with Astro's View Transitions API and the `transition:name` directive. Each photo card image and its corresponding detail page hero share a unique transition name based on the photo slug: `transition:name={`photo-${slug}`}`.
  - Page chrome (nav, footer, surrounding content) crossfades during the transition; only the photo morphs.
  - Test specifically on iOS Safari — View Transitions support there is recent and has edge cases.
  - `prefers-reduced-motion`: if set, fall back to a simple crossfade with no morphing. No special media query handling needed — Astro/browsers handle this automatically for View Transitions.
- **All other route transitions** (e.g. `/`, `/cv`, `/apps`): simple `<ClientRouter />` crossfade. The shared element transition is specifically for gallery-to-detail.
- **Photo title reveal:** opacity + translateY, 0.25s ease. No brightness change on the photo itself.
- **Door hover:** border-top colour change, 0.2s ease. Arrow nudges `translate(2px, -2px)`.
- **No scroll-jacking.** Native scroll only.
- **No Lottie, no canvas animations, no parallax, no 3D icons.**
- Respect `prefers-reduced-motion` on all transitions.

## Photography display rules

- All images: `object-fit: cover`, aspect ratios defined by the container
- Hero photo: fills full frame, no padding
- Alt text: place name + date (e.g. "Achill Island, Co. Mayo, November 2024")

## Placeholder strategy

Use Unsplash URLs as hero photo placeholders until real photos are dropped in. Do not use picsum, SVG illustrations, or greybox fills. Mark every placeholder with a `TODO:` comment.

> **TODO — before first deploy to brassil.net production domain:** All Unsplash and other external placeholder URLs must be replaced with real photos from the content collection. Placeholders must not ship to the live domain.

## Anti-patterns — do not implement

1. Mesh gradients or blurred colour blobs
2. `border-radius` above 16px on cards, or pill shapes on anything except interior CTA buttons
3. Heavy drop shadows
4. Scroll-jacking or interfering with native scroll
5. Lottie animations, 3D icon sets, or canvas effects
6. Full-bleed hero with centred text and a single CTA button as the entire homepage layout
7. Square thumbnail grid with identical hover overlays
8. Inter or Outfit as the body typeface (replaced by IBM Plex Mono)
9. Ghost buttons for primary CTAs
10. AI-style marketing copy ("empowering", "unleashing", "seamless", "elevate your", "crafted with care")
11. Dark photo overlays with centred text on top
12. SVG illustration placeholders that survive past initial scaffold
13. Top navigation on the homepage
14. Orange (`#FF5C1F`) used for anything other than the name of a specific photograph or app — this includes buttons, links, nav items, focus rings, door arrows, section numerals, form CTAs, hover states on non-named elements, error states, success states, and decorative accents
15. Masonry / Pinterest-style variable-height columns in the photo gallery
16. Feature and standard photos at similar visual weight — feature must be roughly 2× the visual footprint of standard; if they look comparable in size, the hierarchy is wrong
17. Forced uniform cropping that destroys photo composition
18. Captions, metadata, or explanatory text beside photos in the gallery — context belongs on the detail page only
19. "View more" buttons, arrows, or instruction lines in the gallery — cursor + brightness + title reveal is the only affordance needed
20. Auto-pack algorithms that reorder photos to eliminate grid gaps — gaps are intentional whitespace, not errors

## Open design TODOs

- Wire homepage hero photo from content collection (`heroCandidate: true` photos)
- CV page detailed treatment
- Apps index page visual treatment
- About page treatment
- 404 page
- Print request form loading/error states
