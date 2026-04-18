# brassil.net

Personal hub — photography, apps, CV, and links to past projects.

Built with Astro 6, Tailwind CSS v3, deployed on Cloudflare Pages.

## Dev commands

```bash
pnpm install                      # install dependencies
pnpm dev                          # dev server → http://localhost:4321
pnpm build                        # production build → dist/
pnpm preview                      # preview production build locally
pnpm wrangler pages dev ./dist    # test Pages Functions locally (build first)
```

## Adding content

**Photo:** drop an image file + a `.md` frontmatter file into `src/content/photos/`. No code changes needed.

**App:** create a `.md` file in `src/content/apps/`. It appears automatically on `/apps`.

## Environment variables

Copy `.dev.vars.example` → `.dev.vars` and fill in values for local development.
Production values are set in the Cloudflare Pages dashboard (never committed).

## Deploy

Push to `main` — Cloudflare Pages auto-deploys. Pull requests get preview deployments automatically.
