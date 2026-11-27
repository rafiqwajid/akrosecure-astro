import { defineConfig } from 'astro/config';

// Static output: Cloudflare Pages serves the built `dist/` folder as-is.
// No server adapter, no SSR — the same free static hosting as the live site.
export default defineConfig({
  site: 'https://akrosecure.com',
  // Smart quotes OFF: Astro's Markdown renderer would otherwise silently
  // rewrite straight apostrophes/quotes into curly ones, changing the
  // migrated copy. The site's text must stay exactly as written.
  markdown: {
    smartypants: false,
  },
});
