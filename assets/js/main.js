/**
 * FreshAisle — Core UI Interactions, Navigation, Theme/RTL Persistence,
 * Accessible Dropdowns (FreshSelect), Shared Product Cards & Modals
 */
(function (global) {
  'use strict';

  var root = document.documentElement;
  var cfg = global.FRESHAISLE_CONFIG || {
    storageKeys: { theme: 'freshaisle_theme', dir: 'freshaisle_dir' }
  };

  /* --------------------------------------------------------------------------
     Theme (Light / Dark) & Direction (LTR / RTL)
     -------------------------------------------------------------------------- */
  function getStored(key, fallback) {
    try {
      return global.localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored(key, val) {
    try {
      global.localStorage.setItem(key, val);
    } catch (e) {
      /* ignore storage restrictions */
    }
  }

  function applyTheme(theme) {
    var next = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    setStored(cfg.storageKeys.theme, next);
    document.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
      var isDark = next === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      var sun = btn.querySelector('.icon-sun');
      var moon = btn.querySelector('.icon-moon');
      if (sun && moon) {
        sun.style.display = isDark ? 'block' : 'none';
        moon.style.display = isDark ? 'none' : 'block';
      }
    });
  }

  function applyDir(dir) {
    var next = dir === 'rtl' ? 'rtl' : 'ltr';
    root.setAttribute('dir', next);
    setStored(cfg.storageKeys.dir, next);
    document.querySelectorAll('.js-dir-toggle').forEach(function (btn) {
      var isRtl = next === 'rtl';
      btn.setAttribute('aria-pressed', String(isRtl));
      btn.setAttribute('aria-label', isRtl ? 'Switch text direction to LTR' : 'Switch text direction to RTL');
      var label = btn.querySelector('.js-dir-label');
      if (label) {
        label.textContent = isRtl ? 'LTR' : 'RTL';
      } else {
        btn.textContent = isRtl ? 'LTR' : 'RTL';
      }
    });
  }

  function initThemeAndDir() {
    applyTheme(getStored(cfg.storageKeys.theme, root.getAttribute('data-theme') || 'light'));
    applyDir(getStored(cfg.storageKeys.dir, root.getAttribute('dir') || 'ltr'));

    document.addEventListener('click', function (e) {
      var themeBtn = e.target.closest('.js-theme-toggle');
      if (themeBtn) {
        var currTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(currTheme === 'dark' ? 'light' : 'dark');
        return;
      }
      var dirBtn = e.target.closest('.js-dir-toggle');
      if (dirBtn) {
        var currDir = root.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
        applyDir(currDir === 'rtl' ? 'ltr' : 'rtl');
      }
    });
  }

  /* --------------------------------------------------------------------------
     Desktop Home Dropdown
     -------------------------------------------------------------------------- */
  function initDesktopDropdowns() {
    document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.nav-dropdown__trigger');
      var menu = dd.querySelector('.nav-dropdown__menu');
      if (!trigger || !menu) return;
      var closeTimer = null;

      function open() {
        clearTimeout(closeTimer);
        dd.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function close() {
        dd.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (dd.classList.contains('is-open')) close();
        else open();
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          open();
          var first = menu.querySelector('a');
          if (first) first.focus();
        } else if (e.key === 'Escape') {
          close();
          trigger.focus();
        }
      });

      menu.addEventListener('keydown', function (e) {
        var items = Array.prototype.slice.call(menu.querySelectorAll('a'));
        var idx = items.indexOf(document.activeElement);
        if (e.key === 'Escape') {
          close();
          trigger.focus();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(idx + 1) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length].focus();
        }
      });

      if (global.matchMedia && global.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        dd.addEventListener('mouseenter', open);
        dd.addEventListener('mouseleave', function () {
          closeTimer = setTimeout(close, 160);
        });
      }

      document.addEventListener('click', function (e) {
        if (!dd.contains(e.target)) close();
      });
    });
  }

  /* --------------------------------------------------------------------------
     Mobile & Tablet Physical-Left Side Drawer
     -------------------------------------------------------------------------- */
  function initMobileDrawer() {
    var openBtn = document.getElementById('mobileMenuOpen');
    var drawer = document.getElementById('mobileDrawer');
    var backdrop = document.getElementById('drawerBackdrop');
    var closeBtn = document.getElementById('mobileMenuClose');
    if (!openBtn || !drawer || !backdrop || !closeBtn) return;

    var lastFocused = null;

    function getFocusable() {
      return Array.prototype.slice.call(
        drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
    }

    function openDrawer() {
      lastFocused = document.activeElement;
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      backdrop.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('drawer-open');
      setTimeout(function () {
        closeBtn.focus();
      }, 40);
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      backdrop.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('drawer-open');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (e.key === 'Tab') {
        var focusable = getFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });
  }

  /* --------------------------------------------------------------------------
     Global Header Grocery Search Bar
     -------------------------------------------------------------------------- */
  function initHeaderSearch() {
    document.querySelectorAll('.js-header-search-form').forEach(function (form) {
      var input = form.querySelector('input[type="search"], input[type="text"]');
      if (!input) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = String(input.value || '').trim();
        var productsInput = document.getElementById('catalogueSearchInput');
        if (productsInput && document.body.getAttribute('data-page') === 'products') {
          productsInput.value = q;
          productsInput.dispatchEvent(new Event('input', { bubbles: true }));
          productsInput.focus();
          return;
        }
        var target = cfg.resolvePath('pages/products.html') + (q ? '?search=' + encodeURIComponent(q) : '');
        global.location.href = target;
      });
    });
  }

  /* --------------------------------------------------------------------------
     Custom Accessible Viewport-Aware Dropdown (.v-select) — Adapted from VERONNE
     -------------------------------------------------------------------------- */
  var activeDropdownInstance = null;
  var uidCounter = 0;

  function FreshSelect(nativeSelect) {
    this.select = nativeSelect;
    this.id = 'vselect-' + (++uidCounter);
    this.isOpen = false;
    this.focusedIndex = -1;
    this.options = [];
    this.build();
  }

  FreshSelect.prototype.build = function () {
    var self = this;
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'v-select';

    this.select.parentNode.insertBefore(this.wrapper, this.select);
    this.wrapper.appendChild(this.select);
    this.select.classList.add('v-select__native');
    this.select.setAttribute('tabindex', '-1');
    this.select.setAttribute('aria-hidden', 'true');

    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'v-select__trigger';
    this.trigger.id = this.id + '-trigger';
    this.trigger.setAttribute('role', 'combobox');
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-controls', this.id + '-listbox');

    var labelId = this.select.getAttribute('aria-labelledby');
    if (labelId) {
      this.trigger.setAttribute('aria-labelledby', labelId + ' ' + this.trigger.id);
    } else if (this.select.id) {
      var assocLabel = document.querySelector('label[for="' + this.select.id + '"]');
      if (assocLabel) {
        if (!assocLabel.id) assocLabel.id = this.id + '-label';
        this.trigger.setAttribute('aria-labelledby', assocLabel.id + ' ' + this.trigger.id);
      }
    }

    this.valueSpan = document.createElement('span');
    this.valueSpan.className = 'v-select__value';
    this.trigger.appendChild(this.valueSpan);

    var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '1.9');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.classList.add('v-select__arrow');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M6 9l6 6 6-6');
    arrow.appendChild(path);
    this.trigger.appendChild(arrow);

    this.panel = document.createElement('div');
    this.panel.className = 'v-select-panel';
    this.panel.id = this.id + '-listbox';
    this.panel.setAttribute('role', 'listbox');
    this.panel.setAttribute('tabindex', '-1');
    document.body.appendChild(this.panel);

    this.wrapper.appendChild(this.trigger);
    this.syncOptions();

    this.trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (self.isOpen) self.close(true);
      else self.open();
    });

    this.trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!self.isOpen) self.open();
        else if (e.key === 'ArrowDown') self.moveFocus(1);
        else if (e.key === 'ArrowUp') self.moveFocus(-1);
        else if (e.key === 'Enter' || e.key === ' ') {
          if (self.focusedIndex >= 0) self.selectIndex(self.focusedIndex);
        }
      } else if (e.key === 'Escape' && self.isOpen) {
        e.preventDefault();
        self.close(true);
      }
    });

    this.panel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        self.moveFocus(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        self.moveFocus(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        self.setFocus(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        self.setFocus(self.options.length - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (self.focusedIndex >= 0) self.selectIndex(self.focusedIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        self.close(true);
      } else if (e.key === 'Tab') {
        self.close(false);
      }
    });

    this.select.addEventListener('change', function () {
      self.updateDisplay();
    });
  };

  FreshSelect.prototype.syncOptions = function () {
    var self = this;
    if (this.isOpen) this.close(false);
    this.panel.innerHTML = '';
    this.options = [];

    Array.prototype.forEach.call(this.select.options, function (opt, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'v-select-option';
      btn.id = self.id + '-opt-' + index;
      btn.setAttribute('role', 'option');
      btn.setAttribute('data-value', opt.value);
      btn.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
      if (opt.disabled) btn.disabled = true;

      var text = document.createElement('span');
      text.textContent = opt.textContent;
      btn.appendChild(text);

      var check = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      check.setAttribute('viewBox', '0 0 24 24');
      check.setAttribute('fill', 'none');
      check.setAttribute('stroke', 'currentColor');
      check.setAttribute('stroke-width', '2.1');
      check.setAttribute('aria-hidden', 'true');
      check.classList.add('v-select-option__check');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M5 12l5 5L20 7');
      check.appendChild(path);
      btn.appendChild(check);

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.selectIndex(index);
      });

      self.panel.appendChild(btn);
      self.options.push(btn);
    });

    this.updateDisplay();
  };

  FreshSelect.prototype.updateDisplay = function () {
    var idx = this.select.selectedIndex;
    var selectedOpt = idx >= 0 ? this.select.options[idx] : null;
    if (selectedOpt) {
      this.valueSpan.textContent = selectedOpt.textContent;
      this.valueSpan.classList.toggle('is-placeholder', selectedOpt.value === '');
    } else {
      this.valueSpan.textContent = 'Select';
      this.valueSpan.classList.add('is-placeholder');
    }

    this.options.forEach(function (btn, i) {
      btn.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
  };

  FreshSelect.prototype.positionPanel = function (fromScroll) {
    if (!this.isOpen) return;
    var rect = this.trigger.getBoundingClientRect();
    var header = document.querySelector('.site-header');
    var headerBottom = header ? header.getBoundingClientRect().bottom : 0;

    if (fromScroll && (rect.bottom < headerBottom + 4 || rect.top > global.innerHeight - 4)) {
      this.close(false);
      return;
    }

    var margin = 8;
    var gap = 4;
    var spaceBelow = Math.max(0, global.innerHeight - rect.bottom - margin - gap);
    var topLimit = Math.max(margin, headerBottom + margin);
    var spaceAbove = Math.max(0, rect.top - topLimit - gap);
    var width = Math.min(Math.max(rect.width, 210), global.innerWidth - margin * 2);

    this.panel.style.width = width + 'px';
    this.panel.style.maxHeight = '320px';

    var naturalHeight = Math.min(this.panel.scrollHeight || 260, 320);
    var openAbove = spaceBelow < Math.min(naturalHeight, 180) && spaceAbove > spaceBelow;
    var available = openAbove ? spaceAbove : spaceBelow;
    var maxAllowed = Math.max(88, Math.min(320, available));
    var finalHeight = Math.min(naturalHeight, maxAllowed);

    this.panel.style.maxHeight = maxAllowed + 'px';

    if (openAbove) {
      this.panel.style.top = Math.max(topLimit, rect.top - gap - finalHeight) + 'px';
    } else {
      var topPos = Math.min(rect.bottom + gap, Math.max(margin, global.innerHeight - margin - finalHeight));
      this.panel.style.top = topPos + 'px';
    }

    var isRtl = root.getAttribute('dir') === 'rtl';
    var left = isRtl ? rect.right - width : rect.left;
    left = Math.max(margin, Math.min(left, global.innerWidth - width - margin));
    this.panel.style.left = left + 'px';
  };

  FreshSelect.prototype.open = function () {
    if (activeDropdownInstance && activeDropdownInstance !== this) {
      activeDropdownInstance.close(false);
    }
    this.isOpen = true;
    activeDropdownInstance = this;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.panel.classList.add('is-open');
    this.positionPanel();

    var selIdx = Math.max(0, this.select.selectedIndex);
    this.setFocus(selIdx);
    this.panel.focus({ preventScroll: true });
  };

  FreshSelect.prototype.close = function (restoreFocus) {
    if (!this.isOpen) return;
    this.isOpen = false;
    if (activeDropdownInstance === this) {
      activeDropdownInstance = null;
    }
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.removeAttribute('aria-activedescendant');
    this.panel.classList.remove('is-open');
    if (restoreFocus) {
      this.trigger.focus({ preventScroll: true });
    }
  };

  FreshSelect.prototype.setFocus = function (index) {
    if (!this.options.length) return;
    var next = Math.max(0, Math.min(index, this.options.length - 1));
    this.focusedIndex = next;
    var activeBtn = null;
    this.options.forEach(function (btn, i) {
      var isFoc = i === next;
      btn.classList.toggle('is-focused', isFoc);
      if (isFoc) activeBtn = btn;
    });
    if (activeBtn) {
      this.trigger.setAttribute('aria-activedescendant', activeBtn.id);
      var optTop = activeBtn.offsetTop;
      var optBottom = optTop + activeBtn.offsetHeight;
      if (optTop < this.panel.scrollTop) {
        this.panel.scrollTop = optTop;
      } else if (optBottom > this.panel.scrollTop + this.panel.clientHeight) {
        this.panel.scrollTop = optBottom - this.panel.clientHeight;
      }
    }
  };

  FreshSelect.prototype.moveFocus = function (delta) {
    this.setFocus(this.focusedIndex + delta);
  };

  FreshSelect.prototype.selectIndex = function (index) {
    if (index < 0 || index >= this.select.options.length) return;
    if (this.select.options[index].disabled) return;
    this.select.selectedIndex = index;
    this.updateDisplay();
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
    this.close(true);
  };

  var selectInstances = new WeakMap();
  var selectListenersBound = false;

  function closeAllSelects() {
    if (activeDropdownInstance) {
      activeDropdownInstance.close(false);
    }
  }

  function initCustomSelects(scopeEl) {
    var rootNode = scopeEl || document;
    rootNode.querySelectorAll('select[data-v-select]').forEach(function (sel) {
      if (!selectInstances.has(sel)) {
        selectInstances.set(sel, new FreshSelect(sel));
      }
    });

    if (selectListenersBound) return;
    selectListenersBound = true;

    function handleOutside(e) {
      if (!activeDropdownInstance) return;
      if (
        !activeDropdownInstance.wrapper.contains(e.target) &&
        !activeDropdownInstance.panel.contains(e.target)
      ) {
        activeDropdownInstance.close(false);
      }
    }

    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('click', handleOutside);

    global.addEventListener('scroll', function () {
      if (activeDropdownInstance) activeDropdownInstance.positionPanel(true);
    }, true);

    global.addEventListener('resize', function () {
      if (activeDropdownInstance) activeDropdownInstance.positionPanel(false);
    });
  }

  function refreshSelect(selectEl) {
    if (!selectEl) return;
    if (!selectInstances.has(selectEl)) {
      selectInstances.set(selectEl, new FreshSelect(selectEl));
      return;
    }
    selectInstances.get(selectEl).syncOptions();
  }

  function setSelectValue(selectEl, value) {
    if (!selectEl) return;
    selectEl.value = value;
    var inst = selectInstances.get(selectEl);
    if (inst) inst.updateDisplay();
  }

  /* --------------------------------------------------------------------------
     Back-to-Top, Accordions, Hero Slider & Carousels
     -------------------------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    function toggle() {
      btn.classList.toggle('is-visible', global.scrollY > 420);
    }
    global.addEventListener('scroll', toggle, { passive: true });
    toggle();
    btn.addEventListener('click', function () {
      global.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initAccordions() {
    document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panelId = trigger.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function initHeroSlider() {
    var hero = document.querySelector('[data-hero-slider]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prevBtn = hero.querySelector('[data-hero-prev]');
    var nextBtn = hero.querySelector('[data-hero-next]');
    if (slides.length <= 1) return;

    var current = 0;
    var timer = null;
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(idx) {
      current = (idx + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
        d.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
    }

    function start() {
      if (reduced) return;
      clearInterval(timer);
      timer = setInterval(function () { show(current + 1); }, 6500);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); start(); });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); start(); });

    var touchStartX = 0;
    hero.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 45) {
        show(dx < 0 ? current + 1 : current - 1);
        start();
      }
    }, { passive: true });

    start();
  }

  function initCarousels() {
    document.querySelectorAll('[data-card-carousel]').forEach(function (wrap) {
      var track = wrap.querySelector('.carousel-track');
      var prevBtn = wrap.querySelector('[data-carousel-prev]');
      var nextBtn = wrap.querySelector('[data-carousel-next]');
      if (!track || !prevBtn || !nextBtn) return;

      function updateArrows() {
        var hasOverflow = track.scrollWidth > track.clientWidth + 8;
        prevBtn.classList.toggle('is-hidden', !hasOverflow);
        nextBtn.classList.toggle('is-hidden', !hasOverflow);
        if (!hasOverflow) return;
        var isRtl = root.getAttribute('dir') === 'rtl';
        var scrollLeft = Math.abs(track.scrollLeft);
        var maxScroll = track.scrollWidth - track.clientWidth;
        if (!isRtl) {
          prevBtn.disabled = scrollLeft <= 4;
          nextBtn.disabled = scrollLeft >= maxScroll - 4;
        } else {
          prevBtn.disabled = false;
          nextBtn.disabled = false;
        }
      }

      function scrollByCard(dirSign) {
        var slide = track.firstElementChild;
        var step = slide ? slide.getBoundingClientRect().width + 20 : 320;
        var isRtl = root.getAttribute('dir') === 'rtl';
        var delta = isRtl ? -dirSign * step : dirSign * step;
        track.scrollBy({ left: delta, behavior: 'smooth' });
      }

      prevBtn.addEventListener('click', function () { scrollByCard(-1); });
      nextBtn.addEventListener('click', function () { scrollByCard(1); });
      track.addEventListener('scroll', updateArrows, { passive: true });
      global.addEventListener('resize', updateArrows);
      setTimeout(updateArrows, 150);
    });
  }

  /* --------------------------------------------------------------------------
     Shared Product Card Renderer & Modals (Product Details + List Picker)
     -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderProductCardHTML(product, options) {
    var cat = global.FRESHAISLE_CATALOGUE;
    var store = global.FRESHAISLE_STORE;
    var opts = options || {};
    var pack = opts.pack || product.pack;
    var base = cat.getBasePricePaise(product, pack);
    var eff = cat.getEffectivePricePaise(product, pack);
    var savings = Math.max(0, base - eff);
    var pct = cat.getDiscountPercent(product, pack);
    var cartQty = store ? store.getItemQtyInCart(product.id, pack) : 0;

    var badgeHtml = savings > 0
      ? '<span class="product-card__badge">Save ' + escapeHtml(cfg.formatINR(savings)) + ' (' + pct + '% off)</span>'
      : '';

    var priceHtml = '<span class="product-card__price">' + escapeHtml(cfg.formatINR(eff)) + '</span>';
    if (savings > 0) {
      priceHtml += ' <span class="product-card__mrp">' + escapeHtml(cfg.formatINR(base)) + '</span>';
    }

    var actionHtml = cartQty > 0
      ? '<div class="qty-stepper" data-qty-stepper>' +
          '<button type="button" class="qty-stepper__btn js-card-dec" aria-label="Decrease quantity of ' + escapeHtml(product.name) + '">&minus;</button>' +
          '<span class="qty-stepper__val" aria-live="polite">' + cartQty + '</span>' +
          '<button type="button" class="qty-stepper__btn js-card-inc" aria-label="Increase quantity of ' + escapeHtml(product.name) + '">+</button>' +
        '</div>'
      : '<button type="button" class="btn btn--primary btn--sm product-card__add js-card-add">Add to Cart</button>';

    return (
      '<article class="product-card" data-product-id="' + escapeHtml(product.id) + '" data-pack="' + escapeHtml(pack) + '">' +
        '<div class="product-card__media">' +
          '<button type="button" class="product-card__img-btn js-open-product" aria-label="View details for ' + escapeHtml(product.name) + '">' +
            '<img src="' + escapeHtml(cfg.resolvePath(product.image)) + '" alt="' + escapeHtml(product.alt || product.name) + '" loading="lazy" width="400" height="300">' +
          '</button>' +
          badgeHtml +
        '</div>' +
        '<div class="product-card__body">' +
          '<p class="product-card__cat">' + escapeHtml(product.categoryLabel) + '</p>' +
          '<h3 class="product-card__title">' +
            '<button type="button" class="product-card__title-btn js-open-product">' + escapeHtml(product.name) + '</button>' +
          '</h3>' +
          '<p class="product-card__pack">' + escapeHtml(pack) + '</p>' +
          '<div class="product-card__pricing">' + priceHtml + '</div>' +
          '<div class="product-card__actions">' +
            actionHtml +
            '<button type="button" class="btn-icon-list js-add-to-list" aria-label="Save ' + escapeHtml(product.name) + ' to shopping list" title="Save to shopping list">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">' +
                '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function syncVisibleProductCards() {
    var store = global.FRESHAISLE_STORE;
    if (!store) return;
    document.querySelectorAll('.product-card[data-product-id]').forEach(function (card) {
      var id = card.getAttribute('data-product-id');
      var pack = card.getAttribute('data-pack');
      var qty = store.getItemQtyInCart(id, pack);
      var actions = card.querySelector('.product-card__actions');
      var prod = global.FRESHAISLE_CATALOGUE && global.FRESHAISLE_CATALOGUE.getProductById(id);
      if (!actions || !prod) return;
      var listBtn = actions.querySelector('.js-add-to-list');
      var firstCtrl = actions.firstElementChild;
      if (!firstCtrl || firstCtrl === listBtn) return;

      if (qty > 0) {
        if (!firstCtrl.classList.contains('qty-stepper')) {
          var stepper = document.createElement('div');
          stepper.className = 'qty-stepper';
          stepper.innerHTML =
            '<button type="button" class="qty-stepper__btn js-card-dec" aria-label="Decrease quantity of ' + escapeHtml(prod.name) + '">&minus;</button>' +
            '<span class="qty-stepper__val" aria-live="polite">' + qty + '</span>' +
            '<button type="button" class="qty-stepper__btn js-card-inc" aria-label="Increase quantity of ' + escapeHtml(prod.name) + '">+</button>';
          actions.replaceChild(stepper, firstCtrl);
        } else {
          var valEl = firstCtrl.querySelector('.qty-stepper__val');
          if (valEl) valEl.textContent = String(qty);
        }
      } else if (!firstCtrl.classList.contains('js-card-add')) {
        var addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'btn btn--primary btn--sm product-card__add js-card-add';
        addBtn.textContent = 'Add to Cart';
        actions.replaceChild(addBtn, firstCtrl);
      }
    });
  }

  /* --------------------------------------------------------------------------
     Shared Product Detail Modal & Shopping-List Picker Modal
     -------------------------------------------------------------------------- */
  function ensureProductModal() {
    var modal = document.getElementById('faProductModal');
    if (modal) return modal;
    modal = document.createElement('dialog');
    modal.id = 'faProductModal';
    modal.className = 'fa-dialog product-dialog';
    modal.setAttribute('aria-labelledby', 'faModalTitle');
    modal.innerHTML =
      '<div class="fa-dialog__box">' +
        '<button type="button" class="fa-dialog__close js-close-product-modal" aria-label="Close product details">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<div class="product-dialog__grid" id="faProductModalBody"></div>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.js-close-product-modal')) {
        modal.close();
      }
    });
    return modal;
  }

  function openProductModal(productId, initialPack) {
    var cat = global.FRESHAISLE_CATALOGUE;
    var store = global.FRESHAISLE_STORE;
    var prod = cat && cat.getProductById(productId);
    if (!prod) return;

    var modal = ensureProductModal();
    var body = document.getElementById('faProductModalBody');
    var selectedPack = initialPack || prod.pack;
    var selectedQty = 1;

    function renderModalContent() {
      var base = cat.getBasePricePaise(prod, selectedPack);
      var eff = cat.getEffectivePricePaise(prod, selectedPack);
      var savings = Math.max(0, base - eff);
      var pct = cat.getDiscountPercent(prod, selectedPack);

      var variantChips = prod.variants.map(function (v) {
        var isSel = v.pack === selectedPack;
        var vPrice = cat.getEffectivePricePaise(prod, v.pack);
        return (
          '<button type="button" class="variant-chip' + (isSel ? ' is-selected' : '') + '" data-variant-pack="' + escapeHtml(v.pack) + '" aria-pressed="' + String(isSel) + '">' +
            '<span>' + escapeHtml(v.pack) + '</span>' +
            '<strong>' + escapeHtml(cfg.formatINR(vPrice)) + '</strong>' +
          '</button>'
        );
      }).join('');

      body.innerHTML =
        '<div class="product-dialog__media">' +
          '<img src="' + escapeHtml(cfg.resolvePath(prod.image)) + '" alt="' + escapeHtml(prod.alt || prod.name) + '">' +
        '</div>' +
        '<div class="product-dialog__info">' +
          '<p class="product-dialog__kicker">' + escapeHtml(prod.categoryLabel) + ' · ' + escapeHtml(prod.subcategory) + '</p>' +
          '<h2 id="faModalTitle" class="product-dialog__title">' + escapeHtml(prod.name) + '</h2>' +
          '<div class="product-dialog__price-row">' +
            '<span class="product-dialog__price">' + escapeHtml(cfg.formatINR(eff)) + '</span>' +
            (savings > 0 ? '<span class="product-card__mrp">' + escapeHtml(cfg.formatINR(base)) + '</span><span class="product-dialog__save">Save ' + escapeHtml(cfg.formatINR(savings)) + ' (' + pct + '% off)</span>' : '') +
          '</div>' +
          '<p class="product-dialog__desc">' + escapeHtml(prod.description) + '</p>' +
          '<div class="product-dialog__variants">' +
            '<span class="product-dialog__label">Pack Size</span>' +
            '<div class="variant-chip-group">' + variantChips + '</div>' +
          '</div>' +
          '<div class="product-dialog__controls">' +
            '<div class="qty-stepper qty-stepper--lg">' +
              '<button type="button" class="qty-stepper__btn js-modal-dec" aria-label="Decrease quantity">&minus;</button>' +
              '<span class="qty-stepper__val" id="faModalQty">' + selectedQty + '</span>' +
              '<button type="button" class="qty-stepper__btn js-modal-inc" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="btn btn--primary js-modal-add-cart">Add to Cart</button>' +
            '<button type="button" class="btn btn--outline js-modal-add-list">Save to List</button>' +
          '</div>' +
          '<dl class="product-dialog__meta">' +
            '<div><dt>Storage</dt><dd>' + escapeHtml(prod.storage) + '</dd></div>' +
            '<div><dt>Dietary Info</dt><dd>' + escapeHtml(prod.dietary) + '</dd></div>' +
          '</dl>' +
        '</div>';

      body.querySelectorAll('[data-variant-pack]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectedPack = btn.getAttribute('data-variant-pack');
          renderModalContent();
        });
      });
      body.querySelector('.js-modal-dec').addEventListener('click', function () {
        selectedQty = Math.max(1, selectedQty - 1);
        document.getElementById('faModalQty').textContent = String(selectedQty);
      });
      body.querySelector('.js-modal-inc').addEventListener('click', function () {
        selectedQty = Math.min(99, selectedQty + 1);
        document.getElementById('faModalQty').textContent = String(selectedQty);
      });
      body.querySelector('.js-modal-add-cart').addEventListener('click', function () {
        if (!store) return;
        store.addToCart(prod.id, selectedPack, selectedQty);
        store.showToast('Added ' + selectedQty + ' × ' + prod.name + ' (' + selectedPack + ') to cart');
        modal.close();
      });
      body.querySelector('.js-modal-add-list').addEventListener('click', function () {
        modal.close();
        openListPickerModal(prod.id, selectedPack, selectedQty);
      });
    }

    renderModalContent();
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  }

  function ensureListPickerModal() {
    var modal = document.getElementById('faListPickerModal');
    if (modal) return modal;
    modal = document.createElement('dialog');
    modal.id = 'faListPickerModal';
    modal.className = 'fa-dialog list-picker-dialog';
    modal.setAttribute('aria-labelledby', 'faListPickerTitle');
    modal.innerHTML =
      '<div class="fa-dialog__box">' +
        '<button type="button" class="fa-dialog__close js-close-list-modal" aria-label="Close list picker">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<h2 id="faListPickerTitle" class="list-picker__title">Save to Shopping List</h2>' +
        '<p class="list-picker__subtitle" id="faListPickerItem"></p>' +
        '<div class="list-picker__lists" id="faListPickerOptions"></div>' +
        '<form class="list-picker__new" id="faListPickerCreateForm">' +
          '<label for="faNewListInput" class="sr-only">New list name</label>' +
          '<input id="faNewListInput" type="text" class="form-input" placeholder="Create new list (e.g. Weekend Dinner)" maxlength="48" required>' +
          '<button type="submit" class="btn btn--primary btn--sm">Create &amp; Add</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.js-close-list-modal')) {
        modal.close();
      }
    });
    return modal;
  }

  function openListPickerModal(productId, pack, qty) {
    var cat = global.FRESHAISLE_CATALOGUE;
    var store = global.FRESHAISLE_STORE;
    var prod = cat && cat.getProductById(productId);
    if (!prod || !store) return;

    var modal = ensureListPickerModal();
    var chosenPack = pack || prod.pack;
    var chosenQty = qty || 1;
    document.getElementById('faListPickerItem').textContent = prod.name + ' (' + chosenPack + ')';

    function renderLists() {
      var lists = store.getLists();
      var box = document.getElementById('faListPickerOptions');
      if (!lists.length) {
        box.innerHTML = '<p class="text-muted">No shopping lists yet. Create one below.</p>';
        return;
      }
      box.innerHTML = lists.map(function (l) {
        return (
          '<button type="button" class="list-picker__row" data-pick-list="' + escapeHtml(l.id) + '">' +
            '<span>' + escapeHtml(l.name) + '</span>' +
            '<span class="list-picker__count">' + l.items.length + ' items</span>' +
          '</button>'
        );
      }).join('');

      box.querySelectorAll('[data-pick-list]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var lid = btn.getAttribute('data-pick-list');
          var target = store.addListItem(lid, prod.id, chosenPack, chosenQty);
          store.showToast('Saved ' + prod.name + ' to "' + (target ? target.name : 'list') + '"');
          modal.close();
        });
      });
    }

    var form = document.getElementById('faListPickerCreateForm');
    form.onsubmit = function (e) {
      e.preventDefault();
      var inp = document.getElementById('faNewListInput');
      var name = String(inp.value || '').trim();
      if (!name) return;
      var created = store.createList(name);
      if (created) {
        store.addListItem(created.id, prod.id, chosenPack, chosenQty);
        store.showToast('Created "' + created.name + '" and added ' + prod.name);
        inp.value = '';
        modal.close();
      }
    };

    renderLists();
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  }

  function initGlobalCardDelegation() {
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.product-card[data-product-id]');
      if (!card) return;
      var id = card.getAttribute('data-product-id');
      var pack = card.getAttribute('data-pack');
      var store = global.FRESHAISLE_STORE;
      var prod = global.FRESHAISLE_CATALOGUE && global.FRESHAISLE_CATALOGUE.getProductById(id);
      if (!prod || !store) return;

      if (e.target.closest('.js-card-add')) {
        store.addToCart(id, pack, 1);
        store.showToast('Added ' + prod.name + ' (' + pack + ') to cart');
        return;
      }
      if (e.target.closest('.js-card-inc')) {
        var cur = store.getItemQtyInCart(id, pack);
        store.setCartQty(id, pack, cur + 1);
        return;
      }
      if (e.target.closest('.js-card-dec')) {
        var curDec = store.getItemQtyInCart(id, pack);
        store.setCartQty(id, pack, curDec - 1);
        return;
      }
      if (e.target.closest('.js-add-to-list')) {
        openListPickerModal(id, pack, 1);
        return;
      }
      if (e.target.closest('.js-open-product')) {
        openProductModal(id, pack);
      }
    });

    global.addEventListener('freshaisle:statechange', function () {
      syncVisibleProductCards();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initThemeAndDir();
    initDesktopDropdowns();
    initMobileDrawer();
    initHeaderSearch();
    initCustomSelects();
    initBackToTop();
    initAccordions();
    initHeroSlider();
    initCarousels();
    initGlobalCardDelegation();
  });

  global.FreshAisleUI = {
    refreshSelect: refreshSelect,
    setSelectValue: setSelectValue,
    closeAllSelects: closeAllSelects,
    initCustomSelects: initCustomSelects,
    applyTheme: applyTheme,
    applyDir: applyDir,
    escapeHtml: escapeHtml,
    renderProductCardHTML: renderProductCardHTML,
    syncVisibleProductCards: syncVisibleProductCards,
    openProductModal: openProductModal,
    openListPickerModal: openListPickerModal
  };
})(window);
