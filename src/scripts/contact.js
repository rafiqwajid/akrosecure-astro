/* inquiry form — sends via the AkroSecure contact Worker */
      var CONTACT_WORKER_URL = 'https://akrosecure-contact-form.rafiqwajid.workers.dev/';
      var inquiryForm = document.getElementById('inquiryForm');
      var inqStatus = document.getElementById('inqStatus');
      function setInqStatus(msg, kind) {
        inqStatus.textContent = msg;
        inqStatus.className = 'inq-status' + (kind ? ' ' + kind : '');
      }
      function buildInquiryText(name, org, email, topic, ctx) {
        return 'Hello AkroSecure,\n\nI would like to request a consultation.\n\nName: ' + name + (org ? '\nOrganisation: ' + org : '') + '\nEmail: ' + email + '\nTopic: ' + topic + (ctx ? '\n\nContext:\n' + ctx : '') + '\n\nThank you.';
      }
      inquiryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('inqName').value.trim();
        var org = document.getElementById('inqOrg').value.trim();
        var email = document.getElementById('inqEmail').value.trim();
        var topic = document.getElementById('inqTopic').value;
        var ctx = document.getElementById('inqContext').value.trim();
        var honeypot = document.getElementById('inqWebsite').value;
        document.getElementById('inqText').value = buildInquiryText(name, org, email, topic, ctx);
        document.getElementById('inqOutput').classList.add('show');
        document.getElementById('inqCopied').textContent = '';
        /* Honeypot filled: a bot. Show the normal success message and stop. */
        if (honeypot) { setInqStatus('Thank you — your inquiry has been sent.', 'ok'); return; }
        if (name.length < 2) { setInqStatus('Please enter your name.', 'err'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setInqStatus('Please enter a valid email address.', 'err'); return; }
        if (ctx.length > 2000) { setInqStatus('Please keep the context under 2,000 characters.', 'err'); return; }
        var btn = inquiryForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Sending…';
        setInqStatus('Sending your inquiry…', '');
        fetch(CONTACT_WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, org: org, email: email, topic: topic, context: ctx, website: honeypot })
        }).then(function (res) {
          return res.json().then(function (data) { return { status: res.status, data: data }; });
        }).then(function (r) {
          if (r.data && r.data.ok) {
            setInqStatus('Thank you — your inquiry has been sent to AkroSecure. Expect a reply at ' + email + '.', 'ok');
          } else {
            setInqStatus('We could not send your inquiry just now. Please copy it below and send it to AkroSecure on LinkedIn instead.', 'err');
          }
        }).catch(function () {
          setInqStatus('We could not send your inquiry just now. Please copy it below and send it to AkroSecure on LinkedIn instead.', 'err');
        }).then(function () {
          btn.disabled = false;
          btn.textContent = 'Send my inquiry';
        });
      });
      document.getElementById('inqCopy').addEventListener('click', function () {
        var area = document.getElementById('inqText');
        var done = function(){ document.getElementById('inqCopied').textContent = 'Copied to clipboard.'; };
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(area.value).then(done, function(){ area.select(); }); }
        else { area.select(); }
      });
