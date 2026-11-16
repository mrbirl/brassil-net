import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Hand-rolled sitemap: a few lines, so no @astrojs/sitemap dependency.
export const GET: APIRoute = async ({ site }) => {
  const photos = await getCollection('photos', ({ data }) => data.available);
  const paths = ['/', '/photos/', '/about/', ...photos.map((p) => `/photos/${p.data.slug}/`)];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
