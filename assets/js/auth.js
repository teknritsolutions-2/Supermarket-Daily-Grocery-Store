/**
 * FreshAisle — Authentication Forms Controller (pages/login.html & pages/signup.html)
 * Provides client-side validation, password visibility toggles, and honest feedback
 * without storing real passwords or simulating OAuth sign-in.
 */
(function (global) {
  'use strict';

  function initPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-toggle-password');
        var input = document.getElementById(targetId);
        if (!input) return;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-pressed', String(show));
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });
  }

  function setFieldError(id, msg) {
    var inp = document.getElementById(id);
    if (!inp) return;
    var field = inp.closest('.form-field');
    var err = field ? field.querySelector('.form-error') : null;
    if (field) field.classList.toggle('has-error', Boolean(msg));
    if (err) err.textContent = msg || '';
  }

  function setStatus(msg) {
    var box = document.getElementById('authFeedback');
    if (!box) return;
    box.textContent = msg;
    box.classList.toggle('is-info', Boolean(msg));
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPasswordToggles();

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = String(document.getElementById('loginEmail').value || '').trim();
        var pass = String(document.getElementById('loginPassword').value || '');
        var ok = true;

        if (!isValidEmail(email)) {
          setFieldError('loginEmail', 'Please enter a valid email address.');
          ok = false;
        } else setFieldError('loginEmail', '');

        if (pass.length < 8) {
          setFieldError('loginPassword', 'Password must be at least 8 characters.');
          ok = false;
        } else setFieldError('loginPassword', '');

        if (!ok) return;

        document.getElementById('loginPassword').value = '';
        setStatus('Live sign-in requires a connected account server. This static frontend does not authenticate or store passwords; you can preview shopping workflows from the Customer Dashboard in the main site navigation.');
      });
    }

    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = String(document.getElementById('signupName').value || '').trim();
        var email = String(document.getElementById('signupEmail').value || '').trim();
        var pass = String(document.getElementById('signupPassword').value || '');
        var confirmPass = String(document.getElementById('signupConfirmPassword').value || '');
        var ok = true;

        if (name.length < 2) {
          setFieldError('signupName', 'Please enter your full name.');
          ok = false;
        } else setFieldError('signupName', '');

        if (!isValidEmail(email)) {
          setFieldError('signupEmail', 'Please enter a valid email address.');
          ok = false;
        } else setFieldError('signupEmail', '');

        if (pass.length < 8) {
          setFieldError('signupPassword', 'Use at least 8 characters for your password.');
          ok = false;
        } else setFieldError('signupPassword', '');

        if (confirmPass !== pass || !confirmPass) {
          setFieldError('signupConfirmPassword', 'Passwords do not match.');
          ok = false;
        } else setFieldError('signupConfirmPassword', '');

        if (!ok) return;

        document.getElementById('signupPassword').value = '';
        document.getElementById('signupConfirmPassword').value = '';
        setStatus('Account creation requires a connected registration backend. No credentials were transmitted or saved locally.');
      });
    }

    document.querySelectorAll('[data-provider]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var provider = btn.getAttribute('data-provider');
        setStatus(provider + ' single sign-on is not connected in this static demonstration build.');
      });
    });

    var forgotBtn = document.getElementById('forgotPasswordBtn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', function () {
        setStatus('Password recovery emails require a connected authentication service.');
      });
    }
  });
})(window);
