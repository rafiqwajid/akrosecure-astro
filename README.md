# AkroSecure — Astro rebuild (Stage 1)

The AkroSecure website rebuilt so the owner can publish blog posts and
courses himself — no code, no re-uploading the whole site — the way his
friend's Nextia platform works: **Astro + Cloudflare Pages + Git + Decap CMS**.

- **Live site (current):** akrosecure.com — plain hand-written HTML, deployed
  by drag-and-drop upload. It stays live and untouched until this rebuild is
  verified and the domain is switched (see `OWNER_CHECKLIST.md`).
- **This project:** the same site, same design, same copy, rebuilt in Astro.
  Content lives in Markdown files; the admin at `/admin` edits those files
  through GitHub; Cloudflare Pages rebuilds and publishes automatically.

## How publishing works now

1. Owner opens `https://akrosecure.com/admin/`, signs in with GitHub.
2. He writes a post (title, date, short description, body) or adds a course
   and clicks **Publish**.
3. Decap saves a Markdown file into this repository on GitHub.
4. Cloudflare Pages sees the new commit, runs `npm run build`, and the post
   is live at `akrosecure.com/insights/<post>/` a minute or two later.

No code, no rebuild by hand, no re-upload. Fallback if the admin ever fails:
edit the same `.md` files directly on github.com (web editor) — the site
rebuilds the same way.

## Project layout

```
astro.config.mjs            Astro config (static output, site URL, smartypants OFF)
src/content.config.ts       Content collections (insights + courses) and their fields
src/content/
  insights/                 Blog posts as Markdown (starts EMPTY — nothing published yet)
  courses/                  Course catalogue entries as Markdown (1 course)
src/pages/
  index.astro               Home page (all copy migrated verbatim)
  insights/index.astro      Insights list page (honest empty state while no posts exist)
  insights/[slug].astro     One blog post page
  training/index.astro      Training catalogue (cards rendered from the courses collection)
  training/[slug].astro     One course page
src/layouts/BaseLayout.astro  Shared head, header, footer (migrated verbatim)
src/components/CourseCard.astro  Catalogue card (rendered from a course entry)
src/styles/global.css       The live site's stylesheet, plus a small additions section
src/scripts/                The live site's scripts, split into modules:
  nav.js, faq.js, contact.js (Worker contact form), register.js, resources.js
public/admin/               Decap CMS: index.html + config.yml
oauth-proxy/                Tiny Cloudflare Worker that completes GitHub sign-in
                            for the Decap admin (UNTESTED — see its README)
OWNER_CHECKLIST.md          Plain-worded, screen-by-screen setup steps for the owner
BUILD_REPORT.md             What was migrated, what was verified, what is still untested
```

## Local development

```bash
npm install
npm run dev      # preview at http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site locally
```

## Content collections

**Insights** (`src/content/insights/*.md`) — fields: `title`, `date`,
`description`, `tag` (optional). The file name becomes the URL slug:
`my-first-post.md` → `/insights/my-first-post/`.

**Courses** (`src/content/courses/*.md`) — fields: `title`, `description`,
`tag`, `status` (`Coming soon` / `In development` / `Open for enrolment`),
`statusBadge`, `shortTitle` (breadcrumb), `lede`, `cardMeta` and `pageMeta`
(the 3-box grids on the catalogue card and on the course page — the two
wordings differ on the live site, so both are kept), plus the body in
Markdown. The file name becomes the URL slug:
`practical-pki-certificates-tls.md` → `/training/practical-pki-certificates-tls/`.

The one existing course, "Practical PKI, Certificates & TLS for Engineers",
is migrated as the first entry, marked Coming soon, register-interest only —
same content as the live course page. Its syllabus list and instructor/video
boxes are raw HTML inside the Markdown file (kept that way so the page
renders exactly like the live one); the rest is plain Markdown.

## What did NOT change

- All copy is verbatim from the live site (verified by a visible-text diff
  against the live deploy — see `BUILD_REPORT.md`). The only intentional
  addition is one link: "Browse all insights →" under the homepage Insights
  cards, leading to the new `/insights/` list page.
- The contact form is unchanged: same fields, same honeypot, same success
  message, same LinkedIn copy fallback, and it still posts to the existing
  Cloudflare Worker (`akrosecure-contact-form`). The Worker is not rebuilt.
- The Insights collection starts empty. The three thought-leadership drafts
  from the brand proposal are **not** published here.
- No name, photo, or face anywhere; no invented clients, projects, case
  studies, team, office, or history; no ISO/SOC 2 issuance or guaranteed
  audit claims. The readiness disclaimer is kept verbatim.

## Decap vs the GitHub web editor — which to use

**Decap admin (recommended):** a proper writing screen — title/date/
description fields, a rich-text editor, one-click Publish. Built for a
non-developer. Costs $0. Needs a one-time setup: a GitHub OAuth App plus the
small OAuth proxy Worker in `oauth-proxy/` (GitHub sign-in needs a server to
complete; the proxy is that server). Decap is community-maintained and its
admin loads from a CDN — if that CDN is ever down, the admin is down but the
public site is unaffected.

**GitHub web editor (fallback):** edit the `.md` files directly on github.com
and commit; Cloudflare rebuilds automatically. Zero extra setup. But the
owner has to navigate folders, edit YAML frontmatter by hand (a bad indent
breaks the build), write Markdown, and understand commits — more error-prone.

Recommendation: **Decap**. It is the friendly front-end on the same Markdown
files, so the web editor stays available as a fallback at any time — the two
are compatible, not competing.

## Known limitations and gotchas

- **Deleted posts and the content cache.** Astro keeps a content cache in
  `node_modules/.astro/data-store.json`. If a post file is deleted locally
  and a build still shows it, delete that cache (or `node_modules/.astro`)
  and rebuild. This cannot happen on Cloudflare Pages: every deploy installs
  fresh dependencies, so there is no stale cache there.
- **Smart quotes are off** (`markdown.smartypants: false` in
  `astro.config.mjs`). Astro would otherwise silently turn straight
  apostrophes into curly ones, changing the migrated copy. New posts are
  published exactly as typed.
- **Course syllabus is raw HTML** in the course Markdown file. In the Decap
  editor, change the syllabus in the raw editor; the visual editor may not
  render it.
- **"The first course" heading** on `/training` is static page copy, not
  generated from the collection. When more courses exist, that heading (and
  the roadmap text) is edited in `src/pages/training/index.astro`.
- **Register-interest course list** on `/training` is generated from the
  courses collection, plus a fixed "Future AkroSecure courses" option.
- **Decap admin login is untested** (no GitHub account/repo exists yet), and
  the OAuth proxy Worker is untested for the same reason. See
  `BUILD_REPORT.md` and `OWNER_CHECKLIST.md`.
- **Paid course delivery is unchanged:** per the live site's own copy, when
  paid courses open, enrolment/payment/accounts run on a reputable hosted
  course platform linked from these pages — not built here. Stage 2 (lesson
  engine) and Stage 3 (accounts/progress/certificates) are separate work.
