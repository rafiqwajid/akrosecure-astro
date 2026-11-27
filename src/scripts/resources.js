// Free working tools (checklists) and their download/copy renderers.
// Migrated verbatim from the original site: the checklist texts and the
// download/copy behaviour are unchanged. The two renderers run on the pages
// that have their grid element and do nothing elsewhere.
var RESOURCES = [
        { id:'threat-canvas', title:'Threat Model Canvas', file:'akrosecure-threat-model-canvas.md',
          desc:'A one-page working canvas for any threat-modelling session: system summary, data flows, trust boundaries, assets, threats and mitigations — used in AkroSecure product-security work.',
          body:'# AkroSecure — Threat Model Canvas\n\n## 1. System in one paragraph\nWhat is it, who uses it, what does it hold that matters?\n\n## 2. Data flows\nList each flow: source -> destination, data carried, protocol, where it crosses a trust boundary.\n\n## 3. Trust boundaries\nName each boundary and what changes on the other side (authentication, privilege, ownership).\n\n## 4. Assets worth protecting\nData, credentials, keys, availability, reputation — ranked by impact if lost.\n\n## 5. Threats (work through STRIDE per flow)\n- Spoofing:\n- Tampering:\n- Repudiation:\n- Information disclosure:\n- Denial of service:\n- Elevation of privilege:\n\n## 6. Mitigations & decisions\nFor each serious threat: mitigation chosen, owner, or risk formally accepted — with the reason written down.\n\n## 7. Open questions for the design review\nAnything unresolved goes here, with a name next to it.\n\n— AkroSecure · Engineering Security. Building Trust.' },
        { id:'review-checklist', title:'Security Design Review Checklist', file:'akrosecure-design-review-checklist.md',
          desc:'The questions a reviewer should be able to answer before signing off a design — boundaries, identity, data, logging, failure modes — in the order a good review actually runs.',
          body:'# AkroSecure — Security Design Review Checklist\n\n## Before the review\n[ ] Architecture diagram received and current\n[ ] Data classification known\n[ ] Threat model exists, or is scheduled as a review output\n\n## Boundaries & flows\n[ ] Every external entry point identified\n[ ] Trust boundaries drawn and justified\n[ ] No flow bypasses authentication/authorisation layers\n\n## Identity & access\n[ ] Human, service and admin access separated\n[ ] Least privilege stated per role\n[ ] Privileged access has no standing rights by default\n\n## Data\n[ ] Encryption in transit and at rest, key ownership clear\n[ ] Secrets in a managed vault, never in code/config\n[ ] Retention and deletion defined\n\n## Resilience & detection\n[ ] Logging covers authentication, authorisation failures and admin actions\n[ ] Failure modes considered per dependency\n[ ] Backups exist and restoration is tested\n\n## Close-out\n[ ] Findings ranked by risk with owners and dates\n[ ] Accepted risks written down with reasons\n\n— AkroSecure · Engineering Security. Building Trust.' },
        { id:'readiness-checklist', title:'ISO 27001 / SOC 2 Readiness Checklist', file:'akrosecure-readiness-checklist.md',
          desc:'The unglamorous readiness work that decides audits: scope, control ownership, evidence discipline and exception handling — for ISO 27001 and SOC 2 preparation.',
          body:'# AkroSecure — ISO 27001 / SOC 2 Readiness Checklist\n\nNote: AkroSecure provides readiness support only. ISO 27001 certification is issued by accredited certification bodies; SOC 2 reports by licensed CPA firms.\n\n## Scope & ownership\n[ ] Scope defined honestly and documented\n[ ] Every control has a named owner\n[ ] Asset inventory current\n\n## Policies & risk\n[ ] Risk assessment performed and treatment plan approved\n[ ] Policies approved, published, and actually followed\n[ ] Exceptions and accepted risks written down with reasons\n\n## Evidence discipline\n[ ] Evidence produced as a by-product of operations, not reconstructed\n[ ] Access reviews, change records and incident records retained\n[ ] Supplier security assessed and documented\n\n## Before the audit\n[ ] Internal audit / readiness review completed\n[ ] Gaps remediated or formally accepted\n[ ] Staff can explain the controls they operate\n\n— AkroSecure · Engineering Security. Building Trust.' },
        { id:'mtls-checklist', title:'TLS / mTLS Lifecycle Checklist', file:'akrosecure-tls-mtls-lifecycle-checklist.md',
          desc:'Most mTLS failures are lifecycle failures. This checklist covers issuance, rotation, revocation, ownership and monitoring — the parts that decide whether PKI survives production.',
          body:'# AkroSecure — TLS / mTLS Lifecycle Checklist\n\n## Issuance\n[ ] Issuance automated or formally controlled — never ad hoc by hand\n[ ] Certificate profiles defined per use case\n[ ] Private keys generated and stored to policy\n\n## Rotation\n[ ] Rotation rehearsed before it is urgent\n[ ] Overlap period allows old and new certs to coexist\n[ ] Expiry monitored with alerting well ahead of deadlines\n\n## Revocation\n[ ] Revocation process defined and tested\n[ ] CRL / OCSP strategy matches client behaviour\n[ ] Compromise playbook exists\n\n## Ownership & inventory\n[ ] Every certificate has a named owner\n[ ] Trust stores inventoried and reviewed\n[ ] Diagram of trust relationships is current — verified, not assumed\n\n— AkroSecure · Engineering Security. Building Trust.' }
      ];
function findResource(id){ for (var i=0;i<RESOURCES.length;i++) if (RESOURCES[i].id===id) return RESOURCES[i]; return null; }
export function renderHomeResources() {
/* free tools (rebranded) */
      
      var rGrid = document.getElementById('resourceGrid');
      rGrid.innerHTML = RESOURCES.map(function (r) {
        return '<article class="resource"><h3>' + r.title + '</h3><p>' + r.desc + '</p>' +
          '<div class="row"><button type="button" class="link-btn" data-dl="' + r.id + '">Download (.md)</button>' +
          '<button type="button" class="link-btn" data-copy="' + r.id + '">Copy text</button>' +
          '<span class="copied" data-msg="' + r.id + '" role="status"></span></div></article>';
      }).join('');
      function flashMsg(id, text){ var el = rGrid.querySelector('[data-msg="' + id + '"]'); if (el){ el.textContent = text; setTimeout(function(){ el.textContent=''; }, 2600); } }
      rGrid.addEventListener('click', function (e) {
        var dl = e.target.getAttribute && e.target.getAttribute('data-dl');
        var cp = e.target.getAttribute && e.target.getAttribute('data-copy');
        if (dl) {
          var r = findResource(dl); if (!r) return;
          var blob = new Blob([r.body], { type:'text/markdown' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a'); a.href = url; a.download = r.file;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(function(){ URL.revokeObjectURL(url); }, 800);
          flashMsg(dl, 'Downloading…');
        } else if (cp) {
          var r2 = findResource(cp); if (!r2) return;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(r2.body).then(function(){ flashMsg(cp,'Copied to clipboard.'); }, function(){ flashMsg(cp,'Copy was blocked by the browser.'); });
          } else { flashMsg(cp, 'Copy is not available in this browser.'); }
        }
      });
}
export function renderTrainingResources() {
/* ---- Training page: the same four free checklists as the home page ---- */
      var tGrid = document.getElementById('resourceGridTraining');
      if (tGrid && typeof RESOURCES !== 'undefined') {
        tGrid.innerHTML = RESOURCES.map(function (r) {
          return '<article class="resource"><h3>' + r.title + '</h3><p>' + r.desc + '</p>' +
            '<div class="row"><button type="button" class="link-btn" data-tdl="' + r.id + '">Download (.md)</button>' +
            '<button type="button" class="link-btn" data-tcopy="' + r.id + '">Copy text</button>' +
            '<span class="copied" data-tmsg="' + r.id + '" role="status"></span></div></article>';
        }).join('');
        function tFlash(id, text) {
          var el = tGrid.querySelector('[data-tmsg="' + id + '"]');
          if (el) { el.textContent = text; setTimeout(function () { el.textContent = ''; }, 2600); }
        }
        tGrid.addEventListener('click', function (e) {
          var dl = e.target.getAttribute && e.target.getAttribute('data-tdl');
          var cp = e.target.getAttribute && e.target.getAttribute('data-tcopy');
          if (dl) {
            var r = findResource(dl); if (!r) return;
            var blob = new Blob([r.body], { type: 'text/markdown' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a'); a.href = url; a.download = r.file;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 800);
            tFlash(dl, 'Downloading…');
          } else if (cp) {
            var r2 = findResource(cp); if (!r2) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(r2.body).then(function () { tFlash(cp, 'Copied to clipboard.'); }, function () { tFlash(cp, 'Copy was blocked by the browser.'); });
            } else { tFlash(cp, 'Copy is not available in this browser.'); }
          }
        });
      }
}
