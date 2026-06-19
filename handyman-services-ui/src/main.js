import './style.css';

(function () {
  'use strict';

  /* Theme toggle */
  var themeToggle = document.getElementById('theme-toggle');
  var html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    var current = html.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    var currentTheme = html.getAttribute('data-theme') || 'light';
    themeToggle.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  var darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  function handleSystemChange(e) {
    if (!localStorage.getItem('theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  }
  darkModeMedia.addEventListener('change', handleSystemChange);

  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('main-nav');
  var navLinks = nav ? nav.querySelectorAll('a') : [];
  var yearSpan = document.getElementById('year');

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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeMenu();
    }
  });

  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', closeMenu);
  }

  /* Dynamic copyright year */
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* Contact form handler */
  var forms = [];
  var form1 = document.getElementById('estimate-form');
  var form2 = document.getElementById('contact-form');
  if (form1) forms.push(form1);
  if (form2) forms.push(form2);

  for (var f = 0; f < forms.length; f++) {
    (function (form) {
      var successMsg = form.querySelector('.form-success');
      var requiredInputs = form.querySelectorAll('[required]');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        for (var r = 0; r < requiredInputs.length; r++) {
          var input = requiredInputs[r];
          if (!input.value.trim()) {
            input.classList.add('input-error');
            valid = false;
          } else {
            input.classList.remove('input-error');
          }
        }

        if (successMsg) {
          if (valid) {
            successMsg.textContent = 'Thanks! Your request has been received. We\'ll contact you soon.';
            successMsg.className = 'form-success';
            form.reset();
          } else {
            successMsg.textContent = 'Please fill in all required fields.';
            successMsg.className = 'form-success error';
          }
        }
      });

      for (var r = 0; r < requiredInputs.length; r++) {
        requiredInputs[r].addEventListener('input', function () {
          if (this.value.trim()) {
            this.classList.remove('input-error');
          }
          if (successMsg && successMsg.textContent) {
            successMsg.textContent = '';
          }
        });
      }
    })(forms[f]);
  }
})();
