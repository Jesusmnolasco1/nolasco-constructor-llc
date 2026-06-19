import './style.css';

(function () {
  'use strict';

  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('main-nav');
  var navLinks = nav ? nav.querySelectorAll('a') : [];
  var yearSpan = document.getElementById('year');

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

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();
