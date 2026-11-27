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
 * STATUS: LIVE — /auth and the token exchange were verified live on
 * 2026-11-26 (GitHub sign-in succeeds). The callback hand-off was FIXED
 * 2026-11-27: the first version posted the token once and closed, but
 * Decap 3 expects a two-way handshake (see Step 3) — without it Decap
 * ignored the token, the popup closed, and the admin stayed logged out.
 * The fix below is NOT yet deployed to the Worker; deploy it from the
 * Cloudflare dashboard (Workers & Pages > akrosecure-decap-oauth >
 * Edit code > paste this file > Save and Deploy), then test the login
 * once at akrosecure.com/admin.
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
      //
      // Decap 3 expects a two-way handshake, not a single postMessage: the
      // popup first announces itself with "authorizing:github", the admin
      // page replies with the same string, and only then does the popup
      // send the token — back to the reply's origin. The first version of
      // this Worker posted the token immediately and closed, which is why
      // GitHub sign-in succeeded on 2026-11-26 but the popup closed and
      // the admin stayed on the login screen: Decap ignored the token
      // because the handshake never happened. Fixed 2026-11-27; see
      // https://ailurotech.com/blog/github-oauth-with-decap and the Decap
      // docs' Cloudflare Worker template (sterlingwes/decap-proxy).
      const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
      const html = `<!doctype html><html><body><script>
        (function () {
          function receiveMessage(e) {
            if (e.data === 'authorizing:github') {
              window.opener.postMessage('authorization:github:success:${payload}', e.origin);
              window.close();
            }
          }
          window.addEventListener('message', receiveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      </script><p>Signed in — you can close this window.</p></body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('AkroSecure Decap OAuth proxy — /auth starts GitHub sign-in.', { status: 200 });
  },
};
