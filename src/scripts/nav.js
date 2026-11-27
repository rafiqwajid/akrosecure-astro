var header = document.getElementById('siteHeader');
      var navToggle = document.getElementById('navToggle');
      navToggle.addEventListener('click', function () {
        var open = header.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.getElementById('mainNav').addEventListener('click', function (e) {
        if (e.target.tagName === 'A') { header.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
      });
