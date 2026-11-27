# Decap OAuth proxy (Cloudflare Worker)

A tiny Worker that completes GitHub sign-in for the Decap admin. See the
comment at the top of `worker.js` for how it works.

## Deploy (after the GitHub OAuth App exists — OWNER_CHECKLIST.md step 3)

```bash
cd oauth-proxy
npx wrangler deploy
npx wrangler secret put GITHUB_OAUTH_CLIENT_ID
npx wrangler secret put GITHUB_OAUTH_CLIENT_SECRET
```

Or paste `worker.js` into a new Worker in the Cloudflare dashboard
(Workers & Pages → Create → Worker) and add the two secrets under
Settings → Variables → Secrets.

## What it costs

$0 on the Workers free tier (sign-ins are a handful of requests a month).

## Status

UNTESTED — it cannot be tested until the GitHub account, repository and
OAuth App exist. If sign-in fails after setup, the fallback is the GitHub
web editor (edit the `.md` files directly on github.com); the site rebuilds
the same way.
