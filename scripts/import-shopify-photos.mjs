#!/usr/bin/env node
/**
 * Imports photos from the public Shopify products.json API.
 *
 * For each product it:
 *   1. Downloads the highest-resolution product image
 *   2. Writes src/content/photos/{slug}/index.md with correct frontmatter
 *   3. Removes old flat placeholder .md files from src/content/photos/
 *
 * Usage:
 *   node scripts/import-shopify-photos.mjs
 *   node scripts/import-shopify-photos.mjs --dry-run
 *
 * If brassil.net is already pointing away from Shopify, pass the myshopify URL:
 *   SHOP_URL=https://your-store.myshopify.com node scripts/import-shopify-photos.mjs
 */

import { writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'src/content/photos');
const SHOP_URL = process.env.SHOP_URL ?? 'https://brassil.net';
const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Shopify API
// ---------------------------------------------------------------------------

async function fetchAllProducts() {
  const products = [];
  let page = 1;

  while (true) {
    const url = `${SHOP_URL}/products.json?limit=250&page=${page}`;
    console.log(`Fetching page ${page} from ${SHOP_URL}…`);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);

    const { products: batch } = await res.json();
    if (!batch || batch.length === 0) break;

    products.push(...batch);
    if (batch.length < 250) break;
    page++;
  }

  return products;
}

// ---------------------------------------------------------------------------
// Image handling
// ---------------------------------------------------------------------------

/**
 * Shopify CDN appends a size suffix before the extension, e.g.:
 *   …/photo_800x.jpg?v=123  →  …/photo.jpg
 * Removing it gives us the original upload at full resolution.
 */
function toOriginalUrl(src) {
  return src
    .replace(/_\d+x\d*(?=\.[a-z]+)/i, '')
    .split('?')[0];
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(dest, Buffer.from(buffer));
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function yamlStr(str) {
  return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

// ---------------------------------------------------------------------------
// Print option parsing
// ---------------------------------------------------------------------------

/**
 * Shopify variant titles: "40×60cm / Hahnemühle Photo Rag"
 * Single-variant products have title "Default Title" — skip those.
 */
function parseVariants(variants) {
  return variants
    .filter(v => v.title !== 'Default Title')
    .map(v => {
      const [sizeRaw, paperRaw] = v.title.split(' / ');
      return {
        size: (sizeRaw ?? v.title).trim(),
        paper: (paperRaw ?? 'Standard').trim(),
        priceEUR: parseFloat(v.price),
      };
    });
}

// ---------------------------------------------------------------------------
// Frontmatter generation
// ---------------------------------------------------------------------------

function generateMd(product, imageFile) {
  const raw = stripHtml(product.body_html || '');

  // First paragraph (or first 200 chars) → description. Rest → longDescription.
  const breakIdx = raw.indexOf('\n\n');
  const shortText =
    breakIdx > 0 && breakIdx <= 200
      ? raw.slice(0, breakIdx)
      : raw.slice(0, 200);
  const description = shortText.replace(/\n/g, ' ').trim();
  const hasLong = raw.length > description.length;
  const longDescription = hasLong ? raw.replace(/\n/g, ' ').trim() : null;

  const rawTags = Array.isArray(product.tags)
    ? product.tags
    : (product.tags ? product.tags.split(',') : []);
  const tags = rawTags.map(t => t.trim().toLowerCase()).filter(Boolean);

  const printOptions = parseVariants(product.variants);

  const lines = [
    '---',
    `title: ${yamlStr(product.title)}`,
    `slug: "${product.handle}"`,
    `description: ${yamlStr(description)}`,
  ];

  if (longDescription) {
    lines.push(`longDescription: ${yamlStr(longDescription)}`);
  }

  lines.push(`image: ./${imageFile}`);
  lines.push(`featured: false`);
  lines.push(`heroCandidate: false`);

  if (printOptions.length > 0) {
    lines.push(`printOptions:`);
    for (const opt of printOptions) {
      lines.push(`  - size: ${yamlStr(opt.size)}`);
      lines.push(`    paper: ${yamlStr(opt.paper)}`);
      lines.push(`    priceEUR: ${opt.priceEUR}`);
    }
  } else {
    lines.push(`printOptions: []`);
  }

  lines.push(`available: true`);

  if (tags.length > 0) {
    lines.push(`tags:`);
    for (const tag of tags) {
      lines.push(`  - ${tag}`);
    }
  }

  lines.push('---', '');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

function removeOldPlaceholders() {
  for (const name of readdirSync(OUT_DIR)) {
    if (!name.endsWith('.md')) continue;
    const filePath = join(OUT_DIR, name);
    if (statSync(filePath).isFile()) {
      console.log(`  removing placeholder: ${name}`);
      if (!DRY_RUN) rmSync(filePath);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (DRY_RUN) console.log('[DRY RUN] No files will be written.\n');

  const products = await fetchAllProducts();
  console.log(`\nFound ${products.length} product(s)\n`);

  let ok = 0;
  let skipped = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) {
      console.warn(`  SKIP  ${product.title} — no images`);
      skipped++;
      continue;
    }

    const slug = product.handle;
    const imageUrl = toOriginalUrl(product.images[0].src);
    const ext = extname(imageUrl).replace('.', '').toLowerCase() || 'jpg';
    const imageFile = `photo.${ext}`;
    const dir = join(OUT_DIR, slug);

    console.log(`  → ${product.title}  [${slug}]`);
    console.log(`    image: ${imageUrl}`);

    if (!DRY_RUN) {
      mkdirSync(dir, { recursive: true });

      process.stdout.write('    downloading… ');
      await downloadImage(imageUrl, join(dir, imageFile));
      console.log('done');

      writeFileSync(join(dir, 'index.md'), generateMd(product, imageFile));
      console.log('    wrote index.md');
    }

    ok++;
  }

  console.log('\nRemoving old placeholder files…');
  removeOldPlaceholders();

  console.log(`\nDone. ${ok} imported, ${skipped} skipped.`);
  if (DRY_RUN) console.log('(dry run — nothing written)');
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
