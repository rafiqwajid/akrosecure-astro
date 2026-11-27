import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output: the Cloudflare Worker project `akrosecure-astro` serves
// the built `dist/` folder as-is. No server adapter, no SSR.
export default defineConfig({
  site: 'https://akrosecure.com',
  integrations: [sitemap()],
  // Smart quotes OFF: Astro's Markdown renderer would otherwise silently
  // rewrite straight apostrophes/quotes into curly ones, changing the
  // migrated copy. The site's text must stay exactly as written.
  markdown: {
    smartypants: false,
  },
});
