/* expandable drafts + FAQ */
      document.querySelectorAll('.draft > button, .faq-item > button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.parentElement;
          var open = item.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          var chev = btn.querySelector('.chev');
          if (chev) chev.textContent = open ? '–' : '+';
        });
      });
