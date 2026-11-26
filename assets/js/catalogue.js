/**
 * FreshAisle — Products Catalogue Controller (pages/products.html)
 */
(function (global) {
  'use strict';

  var cat = global.FRESHAISLE_CATALOGUE;
  var ui = global.FreshAisleUI;
  if (!cat || !ui) return;

  var state = {
    category: 'all',
    subcategory: 'all',
    sort: 'featured',
    offersOnly: false,
    search: ''
  };

  function getSubcategoriesFor(categoryId) {
    var set = {};
    cat.products.forEach(function (p) {
      if (categoryId === 'all' || p.category === categoryId) {
        set[p.subcategory] = true;
      }
    });
    return Object.keys(set).sort();
  }

  function syncSubcategorySelect() {
    var sel = document.getElementById('catalogueSubcatSelect');
    if (!sel) return;
    var subs = getSubcategoriesFor(state.category);
    sel.innerHTML = '<option value="all">All Subcategories</option>' +
      subs.map(function (s) {
        return '<option value="' + ui.escapeHtml(s) + '">' + ui.escapeHtml(s) + '</option>';
      }).join('');
    if (subs.indexOf(state.subcategory) === -1) {
      state.subcategory = 'all';
    }
    sel.value = state.subcategory;
    ui.refreshSelect(sel);
  }

  function filterAndSort() {
    var query = state.search.trim().toLowerCase();
    var list = cat.products.filter(function (p) {
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (state.subcategory !== 'all' && p.subcategory !== state.subcategory) return false;
      if (state.offersOnly && cat.getSavingsPaise(p, p.pack) <= 0) return false;
      if (query) {
        var hay = (p.name + ' ' + p.categoryLabel + ' ' + p.subcategory + ' ' + p.description).toLowerCase();
        if (hay.indexOf(query) === -1) return false;
      }
      return true;
    });

    list.sort(function (a, b) {
      var pa = cat.getEffectivePricePaise(a, a.pack);
      var pb = cat.getEffectivePricePaise(b, b.pack);
      if (state.sort === 'price-asc') return pa - pb;
      if (state.sort === 'price-desc') return pb - pa;
      if (state.sort === 'name-asc') return a.name.localeCompare(b.name);
      if (state.sort === 'savings-desc') return cat.getSavingsPaise(b, b.pack) - cat.getSavingsPaise(a, a.pack);
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return 0;
    });

    return list;
  }

  function render() {
    var grid = document.getElementById('catalogueGrid');
    var empty = document.getElementById('catalogueEmpty');
    var countEl = document.getElementById('catalogueCount');
    if (!grid) return;

    var items = filterAndSort();
    if (countEl) {
      countEl.textContent = 'Showing ' + items.length + ' of ' + cat.products.length + ' products';
    }

    if (!items.length) {
      grid.innerHTML = '';
      grid.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = items.map(function (p) {
      return ui.renderProductCardHTML(p);
    }).join('');
  }

  function updateCategoryTabs() {
    document.querySelectorAll('[data-cat-tab]').forEach(function (btn) {
      var val = btn.getAttribute('data-cat-tab');
      var active = val === state.category;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function applyUrlParams() {
    var params = new URLSearchParams(global.location.search);
    var catParam = params.get('category');
    var searchParam = params.get('search');
    var offersParam = params.get('offers');
    if (catParam) state.category = catParam;
    if (searchParam) state.search = searchParam;
    if (offersParam === '1' || offersParam === 'true') state.offersOnly = true;
  }

  function resetFilters() {
    state.category = 'all';
    state.subcategory = 'all';
    state.sort = 'featured';
    state.offersOnly = false;
    state.search = '';

    var searchInput = document.getElementById('catalogueSearchInput');
    var offersCheck = document.getElementById('catalogueOffersOnly');
    var sortSelect = document.getElementById('catalogueSortSelect');
    if (searchInput) searchInput.value = '';
    if (offersCheck) offersCheck.checked = false;
    if (sortSelect) ui.setSelectValue(sortSelect, 'featured');

    updateCategoryTabs();
    syncSubcategorySelect();
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.getAttribute('data-page') !== 'products') return;
    applyUrlParams();

    var searchInput = document.getElementById('catalogueSearchInput');
    var subcatSelect = document.getElementById('catalogueSubcatSelect');
    var sortSelect = document.getElementById('catalogueSortSelect');
    var offersCheck = document.getElementById('catalogueOffersOnly');
    var clearBtn = document.getElementById('catalogueClearBtn');
    var emptyClearBtn = document.getElementById('catalogueEmptyReset');

    if (searchInput) searchInput.value = state.search;
    if (offersCheck) offersCheck.checked = state.offersOnly;

    updateCategoryTabs();
    syncSubcategorySelect();
    render();

    document.querySelectorAll('[data-cat-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.category = btn.getAttribute('data-cat-tab');
        state.subcategory = 'all';
        updateCategoryTabs();
        syncSubcategorySelect();
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.search = searchInput.value;
        render();
      });
    }

    if (subcatSelect) {
      subcatSelect.addEventListener('change', function () {
        state.subcategory = subcatSelect.value || 'all';
        render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value || 'featured';
        render();
      });
    }

    if (offersCheck) {
      offersCheck.addEventListener('change', function () {
        state.offersOnly = offersCheck.checked;
        render();
      });
    }

    if (clearBtn) clearBtn.addEventListener('click', resetFilters);
    if (emptyClearBtn) emptyClearBtn.addEventListener('click', resetFilters);
  });
})(window);
