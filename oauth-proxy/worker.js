/**
 * Decap CMS GitHub OAuth proxy for Cloudflare Workers.
 *
 * WHY THIS EXISTS: Decap's GitHub backend signs the owner in with GitHub
 * OAuth, and GitHub's token exchange needs a client secret — which must never
 * live in the browser. So a tiny server (this Worker) does the exchange.
 * Decap opens <worker>/auth, GitHub sends the owner back to <worker>/callback
 * with a code, this Worker swaps the code for a token and hands it to the
 * admin page. No data is stored; the token goes only to the owner's browser.
 *
 * STATUS: UNTESTED. It cannot be tested until the owner has a GitHub account,
 * a repository, and a registered GitHub OAuth App (see OWNER_CHECKLIST.md
 * steps 2–4). The code follows the standard Decap GitHub OAuth pattern.
 *
 * SETUP (after the GitHub OAuth App exists):
 *   1. Deploy: `npx wrangler deploy` from this folder (or paste this file
 *      into a new Worker in the Cloudflare dashboard).
 *   2. Secrets (never commit these):
 *        npx wrangler secret put GITHUB_OAUTH_CLIENT_ID
 *        npx wrangler secret put GITHUB_OAUTH_CLIENT_SECRET
 *   3. In the GitHub OAuth App, set "Authorization callback URL" to
 *      https://<your-worker-subdomain>/callback
 *   4. Put the Worker URL as `base_url:` in public/admin/config.yml.
 */

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Step 1: Decap sends the owner here to start GitHub sign-in.
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_OAUTH_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: 'repo',
      });
      return Response.redirect(`${GITHUB_AUTHORIZE}?${params.toString()}`, 302);
    }

    // Step 2: GitHub sends the owner back with a one-time code.
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code from GitHub.', { status: 400 });

      const res = await fetch(GITHUB_TOKEN, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: env.GITHUB_OAUTH_CLIENT_ID,
          client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
          code,
        }),
      });
      const data = await res.json();
      if (!data.access_token) {
        return new Response('GitHub token exchange failed.', { status: 500 });
      }

      // Step 3: hand the token to the Decap admin window and close this tab.
      const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
      const html = `<!doctype html><html><body><script>
        window.opener.postMessage('authorization:github:success:${payload}', '*');
        window.close();
      </script><p>Signed in — you can close this window.</p></body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('AkroSecure Decap OAuth proxy — /auth starts GitHub sign-in.', { status: 200 });
  },
};
