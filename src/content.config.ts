import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    image: image(),
    location: z.string().optional(),
    dateTaken: z.date().optional(),
    featured: z.boolean().optional(),
    printOptions: z.array(
      z.object({
        size: z.string(),
        paper: z.string(),
        priceEUR: z.number(),
      })
    ),
    available: z.boolean(),
    tags: z.array(z.string()).optional(),
  }),
});

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    url: z.string().url(),
    description: z.string(),
    status: z.enum(['live', 'wip', 'archived']),
    launchedAt: z.date().optional(),
  }),
});

export const collections = { photos, apps };
