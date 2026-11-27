/* ---- Register-interest forms — send via the AkroSecure contact Worker ---- */
      var REGISTER_WORKER_URL = 'https://akrosecure-contact-form.rafiqwajid.workers.dev/';

      function wireInterestForm(formId, getFields, statusId, buttonLabel) {
        var form = document.getElementById(formId);
        if (!form) return;
        var statusEl = document.getElementById(statusId);
        function setStatus(msg, kind) {
          statusEl.textContent = msg;
          statusEl.className = 'inq-status' + (kind ? ' ' + kind : '');
        }
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var f = getFields();
          /* Honeypot filled: a bot. Show the normal success message and stop. */
          if (f.honeypot) { setStatus('Thank you — your interest has been registered.', 'ok'); return; }
          if (f.name.length < 2) { setStatus('Please enter your name.', 'err'); return; }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) { setStatus('Please enter a valid email address.', 'err'); return; }
          if (!f.course) { setStatus('Please choose a course.', 'err'); return; }
          if (f.notes.length > 2000) { setStatus('Please keep the notes under 2,000 characters.', 'err'); return; }
          var btn = form.querySelector('button[type="submit"]');
          btn.disabled = true;
          btn.textContent = 'Sending…';
          setStatus('Sending your registration…', '');
          fetch(REGISTER_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'interest', name: f.name, email: f.email, course: f.course, notes: f.notes, website: f.honeypot })
          }).then(function (res) {
            return res.json().then(function (data) { return { status: res.status, data: data }; });
          }).then(function (r) {
            if (r.data && r.data.ok) {
              setStatus('Thank you — your interest has been registered. We will email ' + f.email + ' first when dates and enrolment details are confirmed.', 'ok');
              form.reset();
            } else {
              setStatus('We could not send your registration just now. Please try again, or email contact@akrosecure.com.', 'err');
            }
          }).catch(function () {
            setStatus('We could not send your registration just now. Please try again, or email contact@akrosecure.com.', 'err');
          }).then(function () {
            btn.disabled = false;
            btn.textContent = buttonLabel;
          });
        });
      }

      /* Training catalogue page form (#regForm). */
      wireInterestForm('regForm', function () {
        return {
          name: document.getElementById('regName').value.trim(),
          email: document.getElementById('regEmail').value.trim(),
          course: document.getElementById('regCourse').value,
          notes: document.getElementById('regMsg').value.trim(),
          honeypot: document.getElementById('regWebsite').value
        };
      }, 'regStatus', 'Register my interest');

      /* Course page form (#courseRegForm). Course comes from the form's data attribute. */
      wireInterestForm('courseRegForm', function () {
        var form = document.getElementById('courseRegForm');
        return {
          name: document.getElementById('courseRegName').value.trim(),
          email: document.getElementById('courseRegEmail').value.trim(),
          course: form.getAttribute('data-course-title') || 'Practical PKI, Certificates & TLS for Engineers',
          notes: document.getElementById('courseRegMsg').value.trim(),
          honeypot: document.getElementById('courseRegWebsite').value
        };
      }, 'courseRegStatus', 'Register my interest');
