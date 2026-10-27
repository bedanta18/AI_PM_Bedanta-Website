// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeConceptLinks from './src/lib/rehype-concept-links.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.aipmbedanta.com',
  integrations: [sitemap()],
  markdown: {
    // Links the first mention of each AI/PM concept to its glossary page.
    rehypePlugins: [rehypeConceptLinks],
  },
  redirects: {
    '/work': '/about/#work',
  },
});
