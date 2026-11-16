# TODO

Working list to first launch of the live site. Tick items off as they land.
Scope for launch 1: photos + request-a-print by email + About. CV and Apps stay hidden.

## Launch 1: get the site live

### Photo detail page (`src/pages/photos/[slug].astro`)
- [ ] Render `longDescription` if present, else `description`
- [ ] Show available sizes/papers, **no prices** (prices are quoted by email)
- [ ] "Request a print" button: `mailto:` prefilled with photo title + URL (address: TBD, see Decisions)
- [ ] Keep title font as is (Fraunces, accent); revisit later if it still feels off
- [ ] Decide whether `priceEUR` stays in the schema/frontmatter (kept for now; just not displayed)

### Hide CV and Apps
- [ ] Remove CV and Apps from homepage doors (`src/pages/index.astro`), leaving Photographs and About
- [ ] Remove from header and footer nav (`src/layouts/BaseLayout.astro`)
- [ ] Stop `/cv` and `/apps` being built or indexed (delete the stubs or make them redirect/noindex; code stays in git)
- [ ] Re-balance the homepage door grid for two doors, desktop and mobile

### About page (`src/pages/about.astro`)
- [ ] Bio copy (needs real text from Cian; leave a `TODO:` marker until then)
- [ ] Charity statement: all profits from print sales go to charity (which charity: TBD)
- [ ] Style it to match the design system (single column, editorial, Fraunces headings)
- [ ] Add to nav/footer and as a homepage door

### Site plumbing
- [ ] 404 page
- [ ] `robots.txt` and sitemap
- [ ] Open Graph / social share tags (use the photo on detail pages)
- [ ] `public/_redirects`: old Shopify `/products/<handle>` and `/collections/*` URLs to `/photos/<slug>` and `/photos`
- [ ] Fix gallery header ("25 photographs · 2026" is a placeholder because no photo has `dateTaken`)
- [ ] Add more `heroCandidate: true` photos so the homepage hero has something to rotate (currently 1 of 25)

### Cloudflare Pages and DNS
- [ ] Confirm the existing Pages project: repo connected, build command `pnpm build`, output `dist`, Node >= 22.12
- [ ] Check the `*.pages.dev` preview of this branch/`main`
- [ ] Check what DNS for brassil.net looks like today (Route 53 vs Cloudflare) and whether any email/MX records must be preserved
- [ ] Add brassil.net as a custom domain on the Pages project and move nameservers to Cloudflare
- [ ] Enable Cloudflare Web Analytics (optional, no cookie banner needed)
- [ ] Final pre-launch pass: no external placeholder URLs, Lighthouse/Core Web Vitals check, mobile check

## Launch 2: print-request form (replaces the mailto)
- [ ] Request form on the detail page (name, email, size/paper, shipping address, notes)
- [ ] Turnstile widget + server-side verification
- [ ] `functions/api/request-print.ts`: Zod validation, send email via Resend
- [ ] Resend account, verify brassil.net as a sending domain
- [ ] Set `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY` in Cloudflare
- [ ] Loading / error / success states

## Later
- [ ] CV page (decide: plain page, PDF, or both) and bring back its nav/door
- [ ] Apps index (`src/content/apps/` + `/apps`) once there is at least one app to list
- [ ] Add `location` and `dateTaken` to photos; gallery ordering then follows date
- [ ] Related photos on the detail page
- [ ] Self-host Fraunces and IBM Plex Mono instead of loading from Google Fonts
- [ ] Remove `imageUrl/imageWidth/imageHeight` from the photo schema (all photos are local files now)
- [ ] Update `DESIGN.md` and `CLAUDE.md` where they have drifted (placeholder strategy, hidden routes, schema)
- [ ] Domain registrar decision (Gandi vs INWX) and move off Route 53
- [ ] Decide whether to archive Shopify product history anywhere
- [ ] Consider theprintspace creativehub API for automated fulfilment

## Decisions needed from Cian
- Email address for the "Request a print" mailto
- About page copy, and which charity
- Whether to keep `/cv` and `/apps` as noindex stubs or remove the files entirely until they're ready (I'd remove them)
