import './style.css';

(function () {
  'use strict';

  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('main-nav');
  var navLinks = nav ? nav.querySelectorAll('a') : [];
  var yearSpan = document.getElementById('year');
  var form = document.getElementById('estimate-form');
  var successMsg = document.getElementById('form-success');

  /* Mobile menu toggle */
  function toggleMenu() {
    if (!menuBtn || !nav) return;
    var expanded = menuBtn.getAttribute('aria-expanded') === 'true' ? false : true;
    menuBtn.setAttribute('aria-expanded', expanded);
    nav.classList.toggle('open', expanded);
  }

  function closeMenu() {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', closeMenu);
  }

  /* Dynamic copyright year */
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* Contact form */
  if (form && successMsg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successMsg.textContent = 'Thanks! Your request has been received. We\'ll contact you soon.';
      form.reset();
    });
  }
})();
