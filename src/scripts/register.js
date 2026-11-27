/* ---- Register-interest forms (same no-backend pattern as the consultation form) ---- */
      function wireInterestForm(formId, buildText, outId, textId, copyId, copiedId) {
        var form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          document.getElementById(textId).value = buildText();
          document.getElementById(outId).classList.add('show');
          document.getElementById(copiedId).textContent = '';
        });
        document.getElementById(copyId).addEventListener('click', function () {
          var area = document.getElementById(textId);
          var done = function () { document.getElementById(copiedId).textContent = 'Copied — paste it into a LinkedIn message to AkroSecure any time.'; };
          if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(area.value).then(done, function () { area.select(); }); }
          else { area.select(); }
        });
      }
      wireInterestForm('regForm', function () {
        var name = document.getElementById('regName').value.trim();
        var email = document.getElementById('regEmail').value.trim();
        var course = document.getElementById('regCourse').value;
        var msg = document.getElementById('regMsg').value.trim();
        return 'Hello AkroSecure,\n\nI would like to register my interest in AkroSecure training.\n\nName: ' + name + '\nWork email: ' + email + '\nInterested in: ' + course + (msg ? '\n\nMessage:\n' + msg : '') + '\n\nPlease let me know when dates and enrolment details are confirmed.\n\nThank you.';
      }, 'regOutput', 'regText', 'regCopy', 'regCopied');
      wireInterestForm('courseRegForm', function () {
        var form = document.getElementById('courseRegForm');
        var title = form.getAttribute('data-course-title') || 'Practical PKI, Certificates & TLS for Engineers';
        var name = document.getElementById('courseRegName').value.trim();
        var email = document.getElementById('courseRegEmail').value.trim();
        var msg = document.getElementById('courseRegMsg').value.trim();
        return 'Hello AkroSecure,\n\nI would like to register my interest in the course: ' + title + '.\n\nName: ' + name + '\nWork email: ' + email + (msg ? '\n\nMessage:\n' + msg : '') + '\n\nPlease let me know when dates and enrolment details are confirmed.\n\nThank you.';
      }, 'courseRegOutput', 'courseRegText', 'courseRegCopy', 'courseRegCopied');
