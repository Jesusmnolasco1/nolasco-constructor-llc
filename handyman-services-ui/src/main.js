import './style.css';
import { FORM_CONFIG } from './config.js';

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
  var form = document.getElementById('contact-form');
  if (form) {
    (function () {
      var mode = FORM_CONFIG.mode;
      var endpoint = FORM_CONFIG.endpoint;
      var successMsg = document.getElementById('form-success');
      var noticeEl = document.getElementById('form-notice');
      var submitBtn = form.querySelector('.form-submit');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';

      var fields = {
        name: { el: document.getElementById('form-name'), error: document.getElementById('error-name'), required: true },
        phone: { el: document.getElementById('form-phone'), error: document.getElementById('error-phone'), required: true },
        email: { el: document.getElementById('form-email'), error: document.getElementById('error-email'), required: true },
        service: { el: document.getElementById('form-service'), error: document.getElementById('error-service'), required: true },
        message: { el: document.getElementById('form-message'), error: document.getElementById('error-message'), required: true },
        propertyType: { el: document.getElementById('form-property'), error: null, required: false },
        preferredTiming: { el: document.getElementById('form-timing'), error: null, required: false },
      };

      function setModeNotice() {
        if (!noticeEl) return;
        if (mode === 'demo') {
          noticeEl.textContent = 'Demo mode \u2014 form validates locally but no data is sent.';
          noticeEl.className = 'form-notice notice-demo';
        } else if (mode === 'external' && endpoint) {
          noticeEl.textContent = 'Form is connected to an external endpoint.';
          noticeEl.className = 'form-notice notice-external';
        } else if (mode === 'external' && !endpoint) {
          noticeEl.textContent = 'External mode is enabled but no endpoint is configured.';
          noticeEl.className = 'form-notice notice-error';
        } else {
          noticeEl.textContent = '';
          noticeEl.className = 'form-notice';
        }
      }
      setModeNotice();

      function validateField(field) {
        if (!field || !field.el) return true;
        var value = field.el.value.trim();
        var errorMsg = '';

        if (field.required && !value) {
          errorMsg = 'This field is required.';
        } else if (field.el.id === 'form-email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg = 'Please enter a valid email address.';
        }

        if (field.error) {
          field.error.textContent = errorMsg;
        }
        field.el.setAttribute('aria-invalid', errorMsg ? 'true' : 'false');
        return !errorMsg;
      }

      function clearFieldError(field) {
        if (!field) return;
        if (field.error) field.error.textContent = '';
        if (field.el) field.el.setAttribute('aria-invalid', 'false');
      }

      function clearAllFieldErrors() {
        Object.keys(fields).forEach(function (key) {
          clearFieldError(fields[key]);
        });
      }

      Object.keys(fields).forEach(function (key) {
        var field = fields[key];
        if (!field.el) return;
        field.el.addEventListener('input', function () {
          validateField(field);
          if (successMsg) {
            successMsg.textContent = '';
            successMsg.className = 'form-success';
          }
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var valid = true;
        Object.keys(fields).forEach(function (key) {
          if (!validateField(fields[key])) {
            valid = false;
          }
        });

        if (!valid) {
          if (successMsg) {
            successMsg.textContent = 'Please correct the highlighted fields.';
            successMsg.className = 'form-success error';
          }
          return;
        }

        if (successMsg) {
          successMsg.textContent = '';
          successMsg.className = 'form-success';
        }

        if (mode === 'demo') {
          if (successMsg) {
            successMsg.textContent = 'Thanks! This demo request was validated successfully. Connect a secure form endpoint before launch to receive real messages.';
            successMsg.className = 'form-success';
          }
          form.reset();
          clearAllFieldErrors();
          return;
        }

        if (mode === 'external' && !endpoint) {
          if (successMsg) {
            successMsg.textContent = 'The contact form is not connected yet. Please add a valid form endpoint before launch.';
            successMsg.className = 'form-success error';
          }
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        var payload = {};
        Object.keys(fields).forEach(function (key) {
          if (fields[key].el) {
            payload[key] = fields[key].el.value.trim();
          }
        });

        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Server error');
            return response.json();
          })
          .then(function () {
            if (successMsg) {
              successMsg.textContent = 'Thanks! Your request has been sent. We\'ll contact you soon.';
              successMsg.className = 'form-success';
            }
            form.reset();
            clearAllFieldErrors();
          })
          .catch(function () {
            if (successMsg) {
              successMsg.textContent = 'Something went wrong. Please try again or contact us directly.';
              successMsg.className = 'form-success error';
            }
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalBtnText;
            }
          });
      });
    })();
  }
})();
