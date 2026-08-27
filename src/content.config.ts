import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    date: z.coerce.date(),
    ispublished: z.boolean(),
    author: z.string(),
    categories: z.array(z.string()).default([]),
  }),
});

const work = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/work',
  }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    company: z.string(),
    dateRange: z.string(),
    role: z.string().optional(),
    tag: z.string(),
    tagVariant: z.enum(['te', 'tq', 'tp', 'ts', 'ta']),
    current: z.boolean().default(false),
    logo: z.string().optional(),
    metrics: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    order: z.number(),
    ispublished: z.boolean().default(true),
  }),
});

const pmConcepts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pm-concepts',
  }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    date: z.coerce.date(),
    ispublished: z.boolean(),
    author: z.string(),
    categories: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, work, pmConcepts };
