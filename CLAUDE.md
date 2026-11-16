# brassil.net

Personal hub site for Cian Brassil — photography, apps, CV, and links to past projects. Hobbyist scale; simplicity and low cost matter more than scalability.

## Purpose

- Replace an existing Shopify-hosted photography site (~€300/year) with a self-built static site costing near zero.
- Serve as a hub landing page linking to photography, vibe-coded apps, CV, and previous startup sites.
- Photography is the primary content; everything else is secondary.
- Prints are available on request (by email); the site is not a shop.

## Tech stack

- **Framework:** Astro with Tailwind CSS
- **Content:** Astro content collections for photos (Markdown/MDX frontmatter + image assets)
- **Images:** Astro's built-in image optimisation (`astro:assets`)
- **Hosting:** Cloudflare Pages (free tier)
- **Forms / server logic:** Cloudflare Pages Functions (TypeScript)
- **Email sending:** Resend (free tier: 3k/month)
- **Spam protection:** Cloudflare Turnstile
- **DNS:** Cloudflare
- **Domain registration:** Gandi or INWX (migrating off AWS Route 53)
- **Package manager:** pnpm

Do not introduce React/Next/Vercel/Netlify/Supabase/Firebase unless explicitly asked. Do not add analytics beyond Cloudflare Web Analytics (free, privacy-preserving, no cookie banner needed).

## Repo structure

```
/
├── src/
│   ├── pages/              # Route-per-file: index, photos/, cv, apps, etc.
│   ├── layouts/            # Shared page layouts
│   ├── components/         # Reusable Astro components
│   ├── content/
│   │   ├── photos/         # One .md file per photo + image in same dir
│   │   └── apps/           # One .md file per deployed app (for the /apps index)
│   ├── content.config.ts   # Content collection schemas (Zod) — Astro 6 path
│   └── styles/             # Global Tailwind config/overrides
├── public/                 # Static assets served as-is
├── functions/              # Cloudflare Pages Functions (API routes)
│   └── api/
│       └── request-print.ts  # Handles print-request form POSTs
├── astro.config.mjs
├── tailwind.config.mjs
├── wrangler.toml           # Cloudflare Pages config
└── package.json
```

## Content model

### Photos (`src/content/photos/*.md`)

Each photo has a frontmatter file co-located with its source image. Schema (in `src/content.config.ts`):

- `title: string`
- `slug: string` (URL-friendly)
- `description: string` (short, for card + meta tags)
- `longDescription?: string` (optional, for detail page)
- `image: image()` (Astro image reference, optimised at build)
- `location?: string`
- `dateTaken?: Date`
- `featured?: boolean` (surfaces on homepage)
- `printOptions: Array<{ size: string; paper: string; priceEUR: number }>`
- `available: boolean` (hide sold-out or withdrawn items without deleting)
- `tags?: string[]`
- `heroCandidate?: boolean` (default `false`) — homepage hero rotates through all photos marked `true`
- `showCoordinates?: boolean` (default `true`) — when `false`, suppresses coordinate display on the photo detail page

Adding a photo = drop image file + create .md frontmatter in same folder. No code changes.

### Apps (`src/content/apps/*.md`)

Each deployed app has a frontmatter file here so the `/apps` index renders automatically. Schema:

- `name: string`
- `slug: string` (matches the subdomain, e.g. `expenses`)
- `url: string` (e.g. `https://expenses.brassil.net`)
- `description: string` (one-liner)
- `status: 'live' | 'wip' | 'archived'`
- `launchedAt?: Date`

Adding a new app = create one .md file here. No code changes.

## Sections / routes

- `/` — hub landing, hero photo, nameplate, doors to Photographs and About
- `/photos` — gallery grid
- `/photos/[slug]` — single photo, description, "Request a print" (mailto for now; form in launch 2)
- `/about` — short bio + contact
- `/404` — not-found page

**Hidden until ready — planned to come back:**
- `/cv` — CV page with PDF download
- `/apps` — index of vibe-coded apps (each at its own subdomain, see below)

Their stub pages were deleted for launch 1 (recover from git history: `git show 68c9fa5:src/pages/cv.astro`, `git show 68c9fa5:src/pages/apps.astro`). The `apps` content collection and `src/content/apps/` are kept. To bring either back: recreate the page, add it to the nav/footer in `src/layouts/BaseLayout.astro`, add a homepage door in `src/pages/index.astro` (the door grid currently assumes two doors — see `.door-first`), add it to `src/pages/sitemap.xml.ts`, and remove its temporary redirect from `public/_redirects`. Tracked in `TODO.md`.

## Print-ordering flow

**Launch 1 (current):** the detail page shows no prices. A "Request a print" link opens a prefilled email to `PRINT_REQUEST_EMAIL` (`src/site.ts`). Cian replies with sizes and price. `priceEUR` stays in the frontmatter but is not displayed.

**Launch 2 (planned, v1 manual flow):**

1. User fills request form on a photo page (name, email, size/paper choice, shipping address, notes).
2. Form POSTs to `/functions/api/request-print.ts`.
3. Function validates input, checks Turnstile token, sends email to Cian via Resend with order details.
4. Cian replies manually with a Revolut or Stripe payment link.
5. On payment, Cian places the drop-ship order manually in theprintspace's creativehub dashboard.

**Important:** No Stripe/payment integration in v1. No database. The email *is* the record. Do not build payment automation, inventory tracking, or order management unless explicitly asked — these are deliberate non-goals for v1.

theprintspace offers a REST API (creativehub) for future automation, but defer that decision.

## Apps — subdomain structure

Apps live at **flat subdomains** of the root domain, not under a nested `.apps.` subdomain:

- `expenses.brassil.net`
- `weather.brassil.net`
- etc.

Each app lives in a **separate repo**, deployed as its own Cloudflare Pages project, with its subdomain added as a custom domain in the Pages project settings. Cloudflare handles the CNAME automatically.

The `/apps` route on this main site acts as the human-facing directory — it reads from the `src/content/apps/` collection and renders a simple index. When a new app ships, add one .md file to `src/content/apps/` here and it appears on the index.

Apps needing backends use Cloudflare Workers + D1 (SQL) or KV (key-value); apps needing file storage use R2. Everything free-tier.

## Design principles

Full design system is in `DESIGN.md` — read that alongside this file for any visual work.

- **Aesthetic:** Swiss mono calling card. Minimal, neutral, precision-typeset. See `DESIGN.md`.
- **Homepage:** Full-viewport, no top nav — the page itself is the navigation. Doors anchor the bottom: currently two (Photographs / About); Apps and CV return later.
- **Typography:** Fraunces for the `Cian Brassil` nameplate only. IBM Plex Mono for everything else — body, labels, nav, UI, buttons.
- **Colour:** Near-white `#F5F5F4` background, near-black `#0A0A0A` text. Single accent `#FF5C1F` used *only* on photo title labels on hover — not buttons, links, or nav.
- **Tailwind tokens:** `bg-background`, `text-ink`, `text-muted`, `border-rim`, `text-accent` / `bg-accent`. Font utilities: `font-serif` (Fraunces), `font-mono` (IBM Plex Mono).
- Photography-first: large imagery, minimal chrome, no store-like framing.
- Mobile-first responsive.
- No tracking, no cookie banners, no consent pop-ups.
- Core Web Vitals should be green — images lazy-loaded, responsive `srcset`, modern formats (AVIF/WebP with fallback).

## Development workflow

Site-wide constants (contact / print-request email) live in `src/site.ts`.


- **Install:** `pnpm install`
- **Dev server:** `pnpm dev` (runs on `localhost:4321`)
- **Build:** `pnpm build`
- **Preview production build locally:** `pnpm preview`
- **Test Pages Functions locally:** `pnpm wrangler pages dev ./dist` (requires build first)
- **Deploy:** push to `main` branch; Cloudflare Pages auto-deploys. PRs get preview deployments automatically.

Environment variables (set in Cloudflare Pages dashboard, never committed):
- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL` (where print requests go)
- `TURNSTILE_SECRET_KEY`

Turnstile **site key** (public) goes in `astro.config.mjs` or an env var prefixed `PUBLIC_`.

Local development uses `.dev.vars` (gitignored) for the same keys.

## Astro 6 notes

This project uses **Astro 6**. Key differences from older docs you may find online:

- Content collection config lives at `src/content.config.ts` (not `src/content/config.ts`).
- Collections require a `loader` — use `glob` from `astro/loaders` for file-based collections.
- Output is `static`; all Astro pages are pre-rendered. The Cloudflare adapter is *not* configured in `astro.config.mjs` (removed as unnecessary; `@astrojs/cloudflare` is still listed in `package.json` and could be dropped). Pages Functions in `functions/` are deployed by Cloudflare Pages independently of Astro.
- Tailwind CSS v3 (not v4). Config is in `tailwind.config.mjs`. No dark mode.
- View Transitions: use `<ClientRouter />` from `astro:transitions` — the old `<ViewTransitions />` alias was removed in Astro 6.

## Coding conventions

- TypeScript everywhere feasible (Astro pages can be `.astro` with TS frontmatter; Functions are `.ts`).
- 2-space indentation.
- Prefer Astro components over framework islands. Only reach for a React/Svelte island when genuine client-side interactivity is needed (e.g. the print-request form with live validation).
- Tailwind utility classes in markup; extract to components when repeated 3+ times.
- Keep Pages Functions small and single-purpose.
- Validate all form input server-side with Zod. Never trust client validation alone.
- Use `astro:assets` `<Image />` component for any content image — never raw `<img>` for photo content.

## Things Claude should NOT do without asking

- Add a payment processor, checkout flow, or Stripe integration.
- Add a database for orders, customers, or inventory.
- Add user accounts, authentication, or admin panels.
- Add a CMS (Sanity, Contentful, etc.) — content lives in the repo as files.
- Add analytics beyond Cloudflare Web Analytics.
- Introduce a new framework, runtime, or hosting platform.
- Add dependencies for things achievable with a few lines of code.
- Create placeholder Lorem Ipsum content — ask for real copy or leave a `TODO:` marker.
- Ship pages containing Unsplash or other external placeholder image URLs to the `brassil.net` production domain. (Checked at launch 1: no external placeholder URLs remain; all photos are local files from the content collection. Keep it that way.)

## User context

Owner is a product manager with a technical background, comfortable reading code but hasn't written production code in years. Prefers direct, precise answers. Will push back on vague or hedged explanations. Working primarily through Claude Code for implementation. Based in Ireland; site content and currency default to EUR.

## Open questions / TODO

The live working list is `TODO.md` — read it first when picking up work. Longer-standing questions:


- Finalise domain registrar choice (Gandi vs INWX)
- Decide whether to keep Shopify product history archived anywhere
- CV content: plain page vs downloadable PDF vs both
- Watch for subdomain collisions as apps grow (flat namespace shared with any future `blog.`, `shop.` etc.)
