// Define qué archivos de content/ lee el sitio y qué campos esperan.
// Si añades un campo nuevo a los YAML, decláralo aquí.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const step = z.object({ title: z.string(), text: z.string() });
const serviceLang = z.object({
  title: z.string(),
  tagline: z.string(),
  problem: z.string(),
  for_whom: z.array(z.string()),
  steps: z.array(step),
  deliverables: z.array(z.string()),
  tools: z.array(z.string()).default([]),
  agent_note: z.string().optional().default(''),
});

const services = defineCollection({
  loader: glob({ pattern: '*.{yml,yaml}', base: './content/services' }),
  schema: z.object({
    order: z.number(),
    phase: z.enum(['train', 'discover', 'prioritize', 'govern', 'implement']),
    agent: z.boolean().default(false),
    demo: z.string().nullable().optional(),
    es: serviceLang,
    en: serviceLang,
  }),
});

const demos = defineCollection({
  loader: glob({ pattern: '*.{yml,yaml}', base: './content/demos' }),
  schema: z.object({ service: z.string() }).passthrough(),
});

export const collections = { services, demos };
