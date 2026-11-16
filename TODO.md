# TODO

Working list to first launch of the live site. Tick items off as they land.
Scope for launch 1: photos + request-a-print by email + About. CV and Apps are hidden (planned to return, see "Later").

## Launch 1: get the site live

### Photo detail page (`src/pages/photos/[slug].astro`)
- [x] Render `longDescription` if present, else `description`
- [x] No prices shown (`priceEUR` kept in frontmatter, not displayed)
- [x] "Request a print" mailto to cian@brassil.net, prefilled with title + URL (`src/site.ts`)
- [ ] Hero letterbox: the black side bands don't quite match the photo's own blacks on dark images (visible seam on Achill Island Dawn). Consider a background matching the page instead of `#0A0A0A`.
- [ ] Title font (Fraunces, accent): kept for now; revisit if it still feels off

### Hide CV and Apps
- [x] Homepage doors are now Photographs + About
- [x] Header and footer nav: Photos + About
- [x] `/cv` and `/apps` stubs deleted; `public/_redirects` sends stray links to `/`
- [x] Note in `CLAUDE.md` that both are planned to return, and how

### About page (`src/pages/about.astro`)
- [x] Layout, contact block
- [ ] **Cian to review/rewrite the bio copy** (Claude's draft from facts already on the site; marked `TODO:` in the file)
- [ ] Any other links to list (LinkedIn, Instagram, …)

### Site plumbing
- [x] 404 page
- [x] `robots.txt` and `sitemap.xml` (hand-rolled, `src/pages/sitemap.xml.ts`)
- [x] Open Graph / social share tags, canonical URLs
- [x] `public/_redirects`: Shopify `/products/<handle>` → `/photos/<handle>`, collections → `/photos`
- [x] Gallery header no longer shows a made-up year when photos have no `dateTaken`
- [ ] Add more `heroCandidate: true` photos (currently 1 of 25) — and decide if the hero should rotate per visit (needs a few lines of client JS; static build otherwise always shows the first)

### Cloudflare Pages and DNS
- [ ] Confirm the Pages project: production branch `main`, build `pnpm build`, output `dist`, Node >= 22.12 (`NODE_VERSION` env var if needed)
- [ ] Merge this branch to `main` → auto-deploy; check the `*.pages.dev` URL
- [ ] Check brassil.net DNS today (Route 53 vs Cloudflare). **Preserve MX records** — cian@brassil.net must keep working, the site now depends on it
- [ ] Add brassil.net (and www) as custom domains on the Pages project; move nameservers to Cloudflare if not already
- [ ] Test a few old Shopify URLs redirect correctly once live
- [ ] Enable Cloudflare Web Analytics (optional)
- [ ] Final pass: Lighthouse/Core Web Vitals, mobile check

## Launch 2: print-request form (replaces the mailto)
- [ ] Request form on the detail page (name, email, size/paper, shipping address, notes)
- [ ] Turnstile widget + server-side verification
- [ ] `functions/api/request-print.ts`: Zod validation, send email via Resend
- [ ] Resend account, verify brassil.net as a sending domain
- [ ] Set `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY` in Cloudflare
- [ ] Loading / error / success states

## Later
- [ ] **Bring back CV** (decide: plain page, PDF, or both). Steps in `CLAUDE.md` → "Hidden until ready"
- [ ] **Bring back Apps** index once there is at least one app to list. Same steps
- [ ] Add `location` and `dateTaken` to photos; gallery ordering then follows date
- [ ] Related photos on the detail page
- [ ] Self-host Fraunces and IBM Plex Mono instead of loading from Google Fonts
- [ ] Remove `imageUrl/imageWidth/imageHeight` from the photo schema (all photos are local files now)
- [ ] Domain registrar decision (Gandi vs INWX) and move off Route 53
- [ ] Decide whether to archive Shopify product history anywhere
- [ ] Consider theprintspace creativehub API for automated fulfilment
