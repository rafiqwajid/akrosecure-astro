import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A "meta cell" is one box of the 3-box grid shown on a course page and on
// the catalogue card (label on top, bold value, small detail underneath).
const metaCell = z.object({
  label: z.string(),
  value: z.string(),
  detail: z.string(),
});

// Insights = blog posts. The collection starts EMPTY: no posts are published
// yet. New posts are created in the admin (/admin) or by adding a .md file
// here; the /insights list and the post page are generated automatically.
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tag: z.string().optional(),
  }),
});

// Courses = training catalogue entries. One entry = one course card on
// /training and one full page at /training/<filename>/.
// cardMeta is the 3-box grid on the catalogue card; pageMeta is the 3-box
// grid on the course page itself (the two wordings differ on the live site,
// so both are kept). statusBadge is the pill under the page title, e.g.
// "Coming soon — in development". shortTitle is the short name used in the
// breadcrumb, e.g. "Practical PKI, Certificates & TLS".
const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tag: z.string(),
    status: z.string(),
    statusBadge: z.string(),
    shortTitle: z.string(),
    lede: z.string(),
    cardMeta: z.array(metaCell),
    pageMeta: z.array(metaCell),
  }),
});

export const collections = { insights, courses };
