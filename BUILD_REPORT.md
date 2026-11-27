# Stage 1 build & verification report — AkroSecure Astro rebuild

Date: 2026-11-26/27. Built by: Muse (subagent). Owner decision: "build it
like his" (Nextia: Astro + Cloudflare Pages + Git + admin publishing).

## What was built

An Astro 5.18.2 static site in
`hidden_files/akrosecure-astro/` — the same AkroSecure site, same design,
same copy, rebuilt so the owner can publish himself:

- **Home** (`/`) — all sections migrated verbatim (hero, 4 services, who we
  help, approach, expertise, Insights cards, free tools, training band,
  About, FAQ, contact form, footer).
- **Training** (`/training`) — catalogue page; the course card is now rendered
  from the courses collection, and the register-interest course list is
  generated from the collection.
- **Course page** (`/training/practical-pki-certificates-tls/`) — rendered
  from the one courses-collection entry.
- **Insights list** (`/insights`) — new page; empty state while no posts
  exist ("No insights published yet.").
- **Insights post page** (`/insights/<slug>/`) — template only; no posts yet.
- **Admin** (`/admin`) — Decap CMS, GitHub backend, collections for Insights
  and Courses. Config has placeholders the owner must fill in (repo +
  OAuth proxy URL).
- **OAuth proxy** (`oauth-proxy/worker.js`) — tiny Cloudflare Worker that
  completes GitHub sign-in for Decap. Included, **untested** (see below).
- **Contact form** — unchanged behaviour: same fields, honeypot, success
  message, LinkedIn copy fallback; still posts to the existing Worker
  `https://akrosecure-contact-form.rafiqwajid.workers.dev/`. The Worker was
  not rebuilt.

Environment: Node v24.22.1, npm 10.9.4, Astro 5.18.2 (latest stable at build
time). `npm run build` succeeds; output is static `dist/` for Cloudflare
Pages (build command `npm run build`, output directory `dist`,
`NODE_VERSION=22`).

## Migration method (how "verbatim" was enforced)

The three source pages were not retyped. A script extracted the stylesheet,
header, footer, main content and scripts from the original artifact files
(`~/workspace/ts-spaces/secstone-website/`) with asserted link rewrites
(relative `index.html` / `assets/training/...` / `../../index.html` links →
root-relative `/`, `/training/`, `/#services`, …) and the dead LinkedIn-
proposal CSS block stripped exactly as `build_deploy.py` does. The course
page was transcribed into the one courses-collection Markdown entry (front-
matter for the meta grids, Markdown body, raw HTML kept for the syllabus,
instructor box and video placeholder so the page renders identically).

## Verification — 34 checks, all passing

Run: `/tmp/verify.py` against `dist/` and the live deploy folder
(`hidden_files/deploy/site/`), plus a local HTTP serve of `dist/`.

- **Visible-text diff** of all three pages vs the live deploy: home and
  training catalogue are text-identical; the course page is text-identical.
  The only text difference anywhere is the one documented addition (below).
- **Contact form:** Worker URL, success message, LinkedIn fallback message,
  honeypot field, all form fields, both register-interest forms — all present
  in the built output.
- **Content guards:** no `Wajid`, `Rafique`, `Ericsson`, no `<img>`, no
  `proposal` leftovers, no `DRAFT` markers anywhere in `dist/`.
- **Drafts not published:** six distinctive phrases from the three
  thought-leadership drafts in the brand proposal (e.g. "A certificate
  expires on a Friday night", "show me the last three access reviews",
  "#CyberResilienceAct") — none appear in `dist/`.
- **Insights empty state:** `/insights/` shows "No insights published yet.";
  no post pages are generated.
- **Admin:** `/admin/` loads Decap CMS 3.x; `config.yml` has the GitHub
  backend and both collections, with the repo placeholder intact.
- **Live serve test:** `GET /`, `/insights/`, `/training/`,
  `/training/practical-pki-certificates-tls/`, `/admin/` all return 200 with
  the expected content.
- **Template check with a temporary post:** a throwaway test post was added,
  built, and confirmed to render correctly on the Insights list (title +
  date) and on its own post page (Markdown, tag + date, back link) — then
  deleted and the project rebuilt clean. No test content remains.

## Differences from the live site

Exactly one intentional addition:

1. **"Browse all insights →" link** under the homepage Insights cards,
   linking to the new `/insights/` list page. The list page is otherwise
   unreachable from the site. Everything else is identical copy.

Technical notes (no visible difference):

- Astro re-encodes `&` in attributes and raw HTML as `&#38;` / `&#x26;`
  (e.g. `data-course-title="… &#38; …"`). Browsers decode these identically;
  the visible text and the form behaviour are unchanged.
- Astro's Markdown "smart quotes" were disabled (`markdown.smartypants:
  false` in `astro.config.mjs`) after the first build silently turned a
  straight apostrophe into a curly one in the course text. The migrated copy
  is now byte-faithful.
- The build initially failed on a YAML error: the course `lede` contains a
  colon (`…in production: the certificate lifecycle…`), which must be quoted
  in YAML. Fixed by quoting that value (and the one format-detail value that
  also contains a colon).

## Incident during verification — stale content cache (worth knowing)

After the temporary test post was deleted, three clean rebuilds kept
generating its page. Cause: Astro 5 keeps its content-layer data store in
`node_modules/.astro/data-store.json`, and deleting a `.md` file does not
remove its entry from that store. Deleting `node_modules/.astro` and
rebuilding fixed it (4 pages, all checks pass). **This cannot happen on
Cloudflare Pages** — every deploy installs fresh dependencies — but it is
noted in the README as a troubleshooting item for local builds.

## What was NOT tested (needs the owner's GitHub account)

- **Decap admin login flow** — no GitHub account, repo, or OAuth App exists
  yet, so the sign-in cannot be exercised. The config is written and the
  admin page loads the Decap script, but the login itself is untested.
- **OAuth proxy Worker** — code written, never deployed or executed; it
  follows the standard Decap GitHub OAuth pattern but is untested end to end.
- **Cloudflare Pages Git deploy** — no repo exists to connect; the build
  command / output directory / Node version are documented in
  `OWNER_CHECKLIST.md` but unproven until the owner connects the repo.
- **Decap admin UI rendering** (the form fields as the owner will see them)
  — same reason as above.

## Decap vs GitHub web editor — evaluation

- **Decap admin (recommended):** a proper writing screen — labelled fields,
  rich-text editor, one-click Publish; built for a non-developer; $0. Needs
  the one-time OAuth App + proxy Worker setup (~30 min, in the checklist).
  Downsides: Decap is community-maintained; the admin loads from a CDN
  (unpkg), so if that CDN is down the admin is down (the public site is
  unaffected).
- **GitHub web editor (fallback):** edit the same `.md` files on github.com
  and commit; Cloudflare rebuilds automatically. Zero extra setup. But the
  owner must navigate folders, edit YAML frontmatter by hand (a bad indent
  breaks the build), write Markdown, and understand commits — more
  error-prone for a non-developer.
- **Recommendation: Decap.** It is a friendly front-end on the same Markdown
  files, so the web editor remains a fully compatible fallback at any time.
  The two are not competing choices.

## What Stage 1 does not include

- Lesson engine (lessons, exercises, progress) — Stage 2.
- Student accounts, progress tracking, certificates — Stage 3.
- Paid course delivery — per the live site's own copy, that runs on a
  reputable hosted course platform linked from these pages, not built here.
- Any change to the live site, the artifact source, or the deploy folder —
  none were touched. The live site keeps serving the old build until the
  owner verifies the new one and moves the domain (checklist step 9).

## Files

Project: `hidden_files/akrosecure-astro/` (see `README.md` for the layout,
`OWNER_CHECKLIST.md` for the owner's setup steps). Verification script:
`/tmp/verify.py` (ephemeral; rerun after any change with a fresh
`rm -rf dist .astro node_modules/.astro && npm run build` first).
