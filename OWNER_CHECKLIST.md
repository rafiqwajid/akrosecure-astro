# AkroSecure new website — your setup checklist

This is the one-time setup to switch your website to the new version — the
one where you can publish blog posts and courses yourself, without code and
without re-uploading the whole site.

**What it costs:** $0. GitHub is free, Cloudflare Pages is free, the small
sign-in helper is free. Nothing here asks for a card.

**Your live site stays up the whole time.** You only move the domain across
at step 9, after you have checked the new site yourself. The old site stays
there as a backup — do not delete it.

You will need: the zip file of the new website code (Muse will send it to
you), about an hour, and your Cloudflare account (the same one you used
before — you sign in with Google).

---

## Step 1 — Create a free GitHub account

GitHub is where the website code and your posts will live. (Think of it as a
filing cabinet for the website: the code goes in, your posts go in, and the
live site is built from what's inside.)

1. Go to **github.com** and click **Sign up**.
2. Enter your email, choose a password, and pick a username. The username
   shows in the website address of your code, so pick something plain and
   professional — your name without spaces is fine.
3. Verify your email when GitHub asks (it sends you a code).

That is the whole account. You do not need a paid plan.

## Step 2 — Create the repository (the folder for the website)

1. On github.com, click the **+** at the top right, then **New repository**.
2. Repository name: type exactly **`akrosecure-astro`**.
3. Leave it **Public**.
4. Do **not** tick "Add a README file" or anything else.
5. Click **Create repository**. Leave the page open.

## Step 3 — Put the new website code into the repository

The easiest way without code is GitHub Desktop (a free app).

1. Go to **desktop.github.com**, download GitHub Desktop, install it, and
   sign in with the GitHub account from step 1.
2. In GitHub Desktop: **File → Clone repository**. Pick
   **`akrosecure-astro`** from the list, choose a folder on your computer,
   click **Clone**.
3. Unzip the website-code zip file Muse sent you.
4. Copy **everything** from inside the unzipped folder into the cloned
   `akrosecure-astro` folder on your computer.
5. Back in GitHub Desktop you will see all the files listed on the left.
   In the "Summary" box at the bottom left, type: `First version of the new site`
6. Click **Commit to main**, then click **Push origin** at the top.
7. Check on github.com that the files are there (open the repository page
   and you should see folders like `src`, `public`, `oauth-proxy`).

## Step 4 — Put up the small sign-in helper (Cloudflare Worker)

The admin page signs you in with GitHub. GitHub needs a tiny helper to
finish that sign-in — a small piece of code that runs on Cloudflare, free.
The code is already written for you in the `oauth-proxy` folder.

1. In Cloudflare (sign in the same way as before), go to **Workers & Pages**,
   click **Create**, then choose **Worker** (the "Hello World" starting
   point is fine).
2. Name it exactly **`akrosecure-decap-oauth`** and click **Deploy**.
3. Click **Edit code**, delete everything in the editor, and paste in the
   contents of the file `oauth-proxy/worker.js` from the code you uploaded
   in step 3 (open it on github.com, click Raw, copy it all).
4. Click **Deploy** (top right).
5. The Worker now has an address like
   `https://akrosecure-decap-oauth.<something>.workers.dev` — write it down.
   You need it in the next two steps.

## Step 5 — Register the sign-in app on GitHub

1. On github.com, click your profile picture (top right) → **Settings** →
   **Developer settings** (at the bottom of the left menu) → **OAuth Apps** →
   **New OAuth App**.
2. Application name: `AkroSecure Admin`
3. Homepage URL: `https://akrosecure.com`
4. Authorization callback URL: paste the Worker address from step 4 and add
   `/callback` at the end, like this:
   `https://akrosecure-decap-oauth.<something>.workers.dev/callback`
5. Click **Register application**.
6. On the next page you will see a **Client ID** — copy it. Click
   **Generate a new client secret** and copy the secret too. Keep both
   somewhere safe (a note on your phone is fine). **Do not paste them into
   the website code or share them.**

## Step 6 — Give the secret to the Worker

1. Back in Cloudflare, open the Worker `akrosecure-decap-oauth` →
   **Settings** → **Variables** → **Add variable** (under Secrets, or
   "Add secret" depending on the screen).
2. Add a secret named exactly `GITHUB_OAUTH_CLIENT_ID` with the Client ID
   from step 5. Add another named exactly `GITHUB_OAUTH_CLIENT_SECRET` with
   the secret from step 5.
3. Click **Deploy** again so the Worker picks them up.

## Step 7 — Fill in two lines in the admin settings file

1. On github.com, open the repository `akrosecure-astro`, then open the file
   `public/admin/config.yml` (click through the `public` folder, then
   `admin`).
2. Click the pencil icon (**Edit this file**, top right).
3. Find the line that says `repo: YOUR-GITHUB-USERNAME/akrosecure-astro`
   and change `YOUR-GITHUB-USERNAME` to your GitHub username from step 1.
4. Find the line that says
   `base_url: https://akrosecure-decap-oauth.YOUR-WORKERS-SUBDOMAIN.workers.dev`
   and replace the whole address with your Worker address from step 4.
5. Click **Commit changes** (the green button).

## Step 8 — Connect the new site to Cloudflare Pages

1. In Cloudflare, go to **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. If it asks, connect your GitHub account and pick the repository
   **`akrosecure-astro`**.
3. Project name: type exactly **`akrosecure-astro`**.
4. Framework preset: choose **Astro**.
5. Build command: `npm run build` (it usually fills itself in).
   Build output directory: `dist`.
6. Under **Environment variables**, add one: name `NODE_VERSION`, value `22`.
7. Click **Save and Deploy**. Wait for the build to finish (a minute or two).
8. When it says the deployment is live, click the address it gives you —
   something like `https://akrosecure-astro.pages.dev` — and check it:
   home page, Training page, the PKI course page, the Insights page (it
   should say "No insights published yet"), and the admin page
   (`https://akrosecure-astro.pages.dev/admin/` — it should show the Decap
   sign-in screen).
9. If the build fails, click the failed deployment and read the log — it
   usually says which file has a problem. Send the message to Muse.

## Step 9 — Move the domain to the new site (only after step 8 works)

Do this in one sitting — it takes a few minutes, and the site may show an
error page very briefly while the domain moves.

1. In Cloudflare, open the **old** Pages project **`akrosecure`** →
   **Custom domains**. Next to `akrosecure.com`, click the three dots →
   **Remove**. Do the same for `www.akrosecure.com`.
2. Open the **new** project **`akrosecure-astro`** → **Custom domains** →
   **Set up a custom domain**. Type `akrosecure.com` → **Continue** →
   **Activate domain**.
3. Repeat for `www.akrosecure.com`.
4. Wait a few minutes, then open **https://akrosecure.com** and
   **https://www.akrosecure.com** and check the home page, Training, and
   the contact form. If a page still shows an error after an hour, check the
   new project's Custom domains tab — both should say Active.
5. **Do not delete the old `akrosecure` project.** It is your rollback: if
   the new site ever has a problem, the domain can be moved back the same
   way.

## Step 10 — Test publishing your first post

1. Go to **https://akrosecure.com/admin/** and click **Login with GitHub**.
   Authorize it when GitHub asks.
2. You will see two collections: **Insights (blog posts)** and **Courses**.
   Click **Insights** → **New Insights**.
3. Fill in a test title, today's date, a one-line description, and a line of
   body text. Click **Publish**.
4. Wait a minute or two, then open **https://akrosecure.com/insights/** —
   your test post should be there. Click it to check the post page.
5. Go back to the admin, open the test post, and delete it (or change it
   into your first real post).

## Step 11 — Test the contact form once

Fill in the contact form on the new site with test details and send it. It
uses the same sending setup as before, so the email should arrive in your
Gmail exactly as it does today. If it does not, the form will tell you on
the page — copy the message with the "Copy inquiry" button and send it on
LinkedIn instead, then tell Muse.

## If something goes wrong

- **The admin sign-in fails:** the fallback is editing posts directly on
  github.com — open `src/content/insights/`, click **Add file → Create new
  file**, name it `my-first-post.md`, paste in the title/date/description
  and body in the same shape as the course file, and commit. The site
  rebuilds the same way. Tell Muse what the sign-in screen said.
- **A post you deleted still shows up:** this only happens on a computer
  that built the site before, not on Cloudflare — but if you ever see it,
  tell Muse; it is a stale cache and it clears with a fresh build.
- **The build fails on Cloudflare:** open the failed deployment, copy the
  last lines of the log, and send them to Muse.
- **Anything else:** do not delete the old `akrosecure` project. The live
  site can be put back by moving the domain to it again (step 9 in reverse).
