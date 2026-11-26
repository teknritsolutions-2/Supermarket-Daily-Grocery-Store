/**
 * FreshAisle — Page Controllers for Home 1, Home 2, Offers, Delivery Info, and Contact
 */
(function (global) {
  'use strict';

  var cfg = global.FRESHAISLE_CONFIG;
  var cat = global.FRESHAISLE_CATALOGUE;
  var offers = global.FRESHAISLE_OFFERS;
  var store = global.FRESHAISLE_STORE;
  var ui = global.FreshAisleUI;
  if (!cfg || !cat || !store || !ui) return;

  /* --------------------------------------------------------------------------
     Home 1 Controller
     -------------------------------------------------------------------------- */
  function initHome1() {
    // 1. Category tiles
    var catGrid = document.getElementById('home1CategoryGrid');
    if (catGrid) {
      catGrid.innerHTML = cat.categories.map(function (c) {
        var count = cat.products.filter(function (p) { return p.category === c.id; }).length;
        return (
          '<a class="category-tile" href="' + ui.escapeHtml(cfg.resolvePath('pages/products.html')) + '?category=' + encodeURIComponent(c.id) + '">' +
            '<div class="category-tile__media"><img src="' + ui.escapeHtml(cfg.resolvePath(c.image)) + '" alt="' + ui.escapeHtml(c.label) + '" loading="lazy" width="320" height="240"></div>' +
            '<div class="category-tile__body"><span class="category-tile__name">' + ui.escapeHtml(c.label) + '</span><span class="category-tile__count">' + count + ' items</span></div>' +
          '</a>'
        );
      }).join('');
    }

    // 2. Weekly Deals carousel
    var dealsTrack = document.getElementById('home1WeeklyDealsTrack');
    if (dealsTrack && offers) {
      var discounted = offers.getDiscountedProducts().slice(0, 8);
      dealsTrack.innerHTML = discounted.map(function (p) {
        return ui.renderProductCardHTML(p);
      }).join('');
    }

    // 3. Fresh from the Produce Aisle (4 directly shoppable fruits & veg)
    var produceGrid = document.getElementById('home1ProduceGrid');
    if (produceGrid) {
      var produceIds = ['fr-apples', 'fr-pomegranates', 'vg-tomatoes', 'vg-spinach'];
      produceGrid.innerHTML = produceIds.map(function (id) {
        var p = cat.getProductById(id);
        return p ? ui.renderProductCardHTML(p) : '';
      }).join('');
    }

    // 4. Everyday Essentials (6 compact horizontal staple cards inside divided shelf)
    var essGrid = document.getElementById('home1EssentialsGrid');
    if (essGrid) {
      var essIds = ['da-milk', 'da-eggs', 'pa-rice', 'pa-wheat-atta', 'bk-whole-wheat-bread', 'pa-cooking-oil'];
      essGrid.innerHTML = essIds.map(renderCompactStapleCard).join('');
    }

    // 5. Pantry Restock shelf cards
    var pantryGrid = document.getElementById('home1PantryGrid');
    if (pantryGrid) {
      var shelves = [
        { title: 'Rice & Flour', desc: 'Aged basmati and whole-wheat atta.', img: 'assets/images/pantry/rice.jpg', ids: ['pa-rice', 'pa-wheat-atta'] },
        { title: 'Lentils & Pulses', desc: 'Daily dals and kabuli chickpeas.', img: 'assets/images/pantry/toor-dal.jpg', ids: ['pa-toor-dal', 'pa-moong-dal', 'pa-chickpeas'] },
        { title: 'Oils & Condiments', desc: 'Everyday cooking oil, sugar, and salt.', img: 'assets/images/pantry/cooking-oil.jpg', ids: ['pa-cooking-oil', 'pa-sugar', 'pa-salt'] },
        { title: 'Spices & Grains', desc: 'Turmeric, chilli powder, oats, and pasta.', img: 'assets/images/pantry/turmeric.jpg', ids: ['pa-turmeric', 'pa-chilli-powder', 'pa-oats'] }
      ];
      pantryGrid.innerHTML = shelves.map(function (sh) {
        var rows = sh.ids.map(function (id) {
          var p = cat.getProductById(id);
          if (!p) return '';
          var eff = cat.getEffectivePricePaise(p, p.pack);
          return (
            '<div class="pantry-shelf-item">' +
              '<span>' + ui.escapeHtml(p.name) + ' <span class="text-muted">(' + ui.escapeHtml(p.pack) + ')</span></span>' +
              '<button type="button" class="btn btn--outline btn--sm js-quick-add" data-id="' + ui.escapeHtml(p.id) + '" data-pack="' + ui.escapeHtml(p.pack) + '">' + ui.escapeHtml(cfg.formatINR(eff)) + ' +</button>' +
            '</div>'
          );
        }).join('');
        return (
          '<div class="pantry-shelf-card">' +
            '<div class="pantry-shelf-card__head">' +
              '<img class="pantry-shelf-card__thumb" src="' + ui.escapeHtml(cfg.resolvePath(sh.img)) + '" alt="' + ui.escapeHtml(sh.title) + '" width="56" height="56">' +
              '<div><h3>' + ui.escapeHtml(sh.title) + '</h3><p>' + ui.escapeHtml(sh.desc) + '</p></div>' +
            '</div>' +
            '<div class="pantry-shelf-list">' + rows + '</div>' +
          '</div>'
        );
      }).join('');
    }

    // 6. Shop by Meal — Food-Led Horizontal Merchandising Board with interactive ingredient chips
    var mealGrid = document.getElementById('home1MealGrid');
    if (mealGrid && offers) {
      mealGrid.innerHTML = offers.mealCollections.map(function (m) {
        var chips = m.productIds.slice(0, 3).map(function (pid) {
          var p = cat.getProductById(pid);
          if (!p) return '';
          return '<button type="button" class="meal-ing-btn js-quick-open" data-id="' + ui.escapeHtml(p.id) + '">' + ui.escapeHtml(p.name) + '</button>';
        }).join('');
        return (
          '<article class="meal-row-card">' +
            '<div class="meal-row-card__media"><img src="' + ui.escapeHtml(cfg.resolvePath(m.image)) + '" alt="' + ui.escapeHtml(m.alt) + '" loading="lazy" width="360" height="240"></div>' +
            '<div class="meal-row-card__body">' +
              '<h3>' + ui.escapeHtml(m.title) + '</h3>' +
              '<p>' + ui.escapeHtml(m.summary) + '</p>' +
              '<div class="meal-row-card__chips">' + chips + '</div>' +
              '<div class="meal-row-card__foot">' +
                '<button type="button" class="btn btn--primary btn--sm js-add-meal-pack" data-meal="' + ui.escapeHtml(m.id) + '">Add Meal Basket</button>' +
                '<a class="text-link" href="' + ui.escapeHtml(cfg.resolvePath('pages/home2.html')) + '#weeklyBuilder">Customize</a>' +
              '</div>' +
            '</div>' +
          '</article>'
        );
      }).join('');
    }
  }

  function renderCompactStapleCard(id) {
    var p = cat.getProductById(id);
    if (!p) return '';
    var price = cat.getEffectivePricePaise(p, p.pack);
    return (
      '<article class="staple-card">' +
        '<div class="staple-card__img"><img src="' + ui.escapeHtml(cfg.resolvePath(p.image)) + '" alt="' + ui.escapeHtml(p.alt || p.name) + '" loading="lazy" width="88" height="76"></div>' +
        '<div>' +
          '<h3 class="staple-card__title"><button type="button" class="product-card__title-btn js-quick-open" data-id="' + ui.escapeHtml(p.id) + '">' + ui.escapeHtml(p.name) + '</button></h3>' +
          '<p class="staple-card__meta">' + ui.escapeHtml(p.pack) + '</p>' +
          '<div class="staple-card__foot">' +
            '<span class="staple-card__price">' + ui.escapeHtml(cfg.formatINR(price)) + '</span>' +
            '<button type="button" class="btn btn--primary btn--sm js-quick-add" data-id="' + ui.escapeHtml(p.id) + '" data-pack="' + ui.escapeHtml(p.pack) + '">+ Add</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* --------------------------------------------------------------------------
     Home 2 Controller — "Your Week, Sorted"
     -------------------------------------------------------------------------- */
  function initHome2() {
    var builderTabs = document.getElementById('home2BuilderTabs');
    var builderList = document.getElementById('home2BuilderChecklist');
    var builderCount = document.getElementById('home2BuilderCount');
    var builderUnits = document.getElementById('home2BuilderUnits');
    var builderSavings = document.getElementById('home2BuilderSavings');
    var builderTotal = document.getElementById('home2BuilderTotal');
    var toggleAllBtn = document.getElementById('home2BuilderToggleAll');
    var addCartBtn = document.getElementById('home2BuilderAddCart');
    var addListBtn = document.getElementById('home2BuilderAddList');

    if (builderTabs && builderList && offers) {
      var activeMealId = 'breakfast';
      var selectedItems = {};

      function loadMeal(mealId) {
        activeMealId = mealId;
        var meal = offers.mealCollections.find(function (m) { return m.id === mealId; }) || offers.mealCollections[0];
        selectedItems = {};
        meal.productIds.forEach(function (id) { selectedItems[id] = { checked: true, qty: 1 }; });
        renderBuilder();
      }

      function renderBuilder() {
        builderTabs.querySelectorAll('[data-meal-tab]').forEach(function (btn) {
          var active = btn.getAttribute('data-meal-tab') === activeMealId;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', String(active));
        });

        var meal = offers.mealCollections.find(function (m) { return m.id === activeMealId; });
        var totalPaise = 0;
        var totalSavings = 0;
        var chosenCount = 0;
        var unitSum = 0;

        builderList.innerHTML = meal.productIds.map(function (id) {
          var p = cat.getProductById(id);
          if (!p) return '';
          var entry = selectedItems[id] || { checked: false, qty: 1 };
          var eff = cat.getEffectivePricePaise(p, p.pack);
          var sav = cat.getSavingsPaise(p, p.pack);
          if (entry.checked) {
            totalPaise += eff * entry.qty;
            totalSavings += sav * entry.qty;
            chosenCount += 1;
            unitSum += entry.qty;
          }
          return (
            '<div class="basket-check-row">' +
              '<label class="basket-check-row__label">' +
                '<input type="checkbox" class="js-builder-chk" data-id="' + ui.escapeHtml(p.id) + '"' + (entry.checked ? ' checked' : '') + '>' +
                '<img class="basket-check-row__thumb" src="' + ui.escapeHtml(cfg.resolvePath(p.image)) + '" alt="' + ui.escapeHtml(p.alt || p.name) + '" width="44" height="44">' +
                '<span><strong>' + ui.escapeHtml(p.name) + '</strong><br><span class="text-muted" style="font-size:0.875rem">' + ui.escapeHtml(p.pack) + ' · ' + ui.escapeHtml(cfg.formatINR(eff)) + '</span></span>' +
              '</label>' +
              '<div class="basket-check-row__controls">' +
                '<div class="basket-qty-mini">' +
                  '<button type="button" class="js-builder-dec" data-id="' + ui.escapeHtml(p.id) + '" aria-label="Decrease quantity of ' + ui.escapeHtml(p.name) + '">&minus;</button>' +
                  '<span>' + entry.qty + '</span>' +
                  '<button type="button" class="js-builder-inc" data-id="' + ui.escapeHtml(p.id) + '" aria-label="Increase quantity of ' + ui.escapeHtml(p.name) + '">+</button>' +
                '</div>' +
                '<strong>' + ui.escapeHtml(cfg.formatINR(eff * entry.qty)) + '</strong>' +
              '</div>' +
            '</div>'
          );
        }).join('');

        builderCount.textContent = chosenCount + ' of ' + meal.productIds.length + ' items selected';
        if (builderUnits) builderUnits.textContent = String(unitSum);
        if (builderSavings) builderSavings.textContent = '-' + cfg.formatINR(totalSavings);
        builderTotal.textContent = cfg.formatINR(totalPaise);
        if (toggleAllBtn) {
          toggleAllBtn.textContent = chosenCount === meal.productIds.length ? 'Uncheck All' : 'Select All';
        }
      }

      builderTabs.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-meal-tab]');
        if (btn) loadMeal(btn.getAttribute('data-meal-tab'));
      });

      builderList.addEventListener('change', function (e) {
        var chk = e.target.closest('.js-builder-chk');
        if (chk) {
          var id = chk.getAttribute('data-id');
          if (!selectedItems[id]) selectedItems[id] = { checked: chk.checked, qty: 1 };
          selectedItems[id].checked = chk.checked;
          renderBuilder();
        }
      });

      builderList.addEventListener('click', function (e) {
        var dec = e.target.closest('.js-builder-dec');
        if (dec) {
          var idD = dec.getAttribute('data-id');
          if (selectedItems[idD]) {
            selectedItems[idD].qty = Math.max(1, selectedItems[idD].qty - 1);
            renderBuilder();
          }
          return;
        }
        var inc = e.target.closest('.js-builder-inc');
        if (inc) {
          var idI = inc.getAttribute('data-id');
          if (selectedItems[idI]) {
            selectedItems[idI].qty = Math.min(20, selectedItems[idI].qty + 1);
            selectedItems[idI].checked = true;
            renderBuilder();
          }
        }
      });

      if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', function () {
          var meal = offers.mealCollections.find(function (m) { return m.id === activeMealId; });
          var allChecked = meal.productIds.every(function (id) { return selectedItems[id] && selectedItems[id].checked; });
          meal.productIds.forEach(function (id) {
            if (!selectedItems[id]) selectedItems[id] = { checked: !allChecked, qty: 1 };
            else selectedItems[id].checked = !allChecked;
          });
          renderBuilder();
        });
      }

      if (addCartBtn) {
        addCartBtn.addEventListener('click', function () {
          var ids = Object.keys(selectedItems).filter(function (k) { return selectedItems[k].checked; });
          if (!ids.length) {
            store.showToast('Select at least one item first.');
            return;
          }
          var units = 0;
          ids.forEach(function (id) {
            var p = cat.getProductById(id);
            if (p) {
              store.addToCart(p.id, p.pack, selectedItems[id].qty);
              units += selectedItems[id].qty;
            }
          });
          store.showToast('Added ' + units + ' units across ' + ids.length + ' items to cart.');
        });
      }

      if (addListBtn) {
        addListBtn.addEventListener('click', function () {
          var ids = Object.keys(selectedItems).filter(function (k) { return selectedItems[k].checked; });
          if (!ids.length) {
            store.showToast('Select at least one item first.');
            return;
          }
          var lists = store.getLists();
          var targetList = lists[0] || store.createList('Weekly Groceries');
          ids.forEach(function (id) {
            var p = cat.getProductById(id);
            if (p) store.addListItem(targetList.id, p.id, p.pack, selectedItems[id].qty);
          });
          store.showToast('Saved ' + ids.length + ' items to "' + targetList.name + '".');
        });
      }

      loadMeal('breakfast');
    }

    // Breakfast & Morning Essentials compact shelf stack (4 items)
    var bkGrid = document.getElementById('home2BreakfastGrid');
    if (bkGrid) {
      bkGrid.innerHTML = ['bk-whole-wheat-bread', 'da-milk', 'da-eggs', 'pa-oats'].map(renderCompactStapleCard).join('');
    }

    // Fresh Fruits & Seasonal Produce — 2 Collection Boards
    var prGrid = document.getElementById('home2ProduceGrid');
    if (prGrid) {
      var produceCollections = [
        {
          title: 'Orchard & Citrus Picks',
          subtitle: 'Vitamin-rich fruit bowls for weekday mornings',
          img: 'assets/images/fruits/oranges.jpg',
          link: 'pages/products.html?category=fruits',
          ids: ['fr-oranges', 'fr-grapes', 'fr-bananas']
        },
        {
          title: 'Salad & Everyday Cooking Veg',
          subtitle: 'Crisp carrots, cucumbers, and cooking greens',
          img: 'assets/images/vegetables/carrots.jpg',
          link: 'pages/products.html?category=vegetables',
          ids: ['vg-carrots', 'vg-cucumbers', 'vg-capsicum']
        }
      ];
      prGrid.innerHTML = produceCollections.map(renderPlanningBoardHTML).join('');
    }

    // Lunch & Dinner Ingredient Collections — 2 Side-by-Side Planning Boards
    var ldGrid = document.getElementById('home2LunchDinnerBoards');
    if (ldGrid) {
      var mealBoards = [
        {
          title: 'Everyday Lunch Staples',
          subtitle: 'Dal, basmati rice, homestyle curd, and salad tomatoes',
          img: 'assets/images/lifestyle/home2-lunch-dinner.jpg',
          link: 'pages/products.html?category=pantry',
          ids: ['pa-rice', 'pa-toor-dal', 'da-curd', 'vg-tomatoes']
        },
        {
          title: 'Quick Dinner Prep',
          subtitle: 'Malai paneer, bell peppers, whole-wheat atta, and penne',
          img: 'assets/images/lifestyle/about-kitchen.jpg',
          link: 'pages/products.html?category=dairy',
          ids: ['da-paneer', 'vg-capsicum', 'pa-wheat-atta', 'pa-pasta']
        }
      ];
      ldGrid.innerHTML = mealBoards.map(renderPlanningBoardHTML).join('');
    }

    // Pantry Cupboard Restock compact ledger (4 items)
    var paGrid = document.getElementById('home2PantryGrid');
    if (paGrid) {
      paGrid.innerHTML = ['pa-rice', 'pa-toor-dal', 'pa-cooking-oil', 'da-ghee'].map(renderCompactStapleCard).join('');
    }

    // Household Grocery Bundles (2-up)
    var bndGrid = document.getElementById('home2BundlesGrid');
    if (bndGrid && offers) {
      bndGrid.innerHTML = offers.bundles.slice(0, 2).map(renderBundleCardHTML).join('');
    }

    // Weekly Savings Collection (4 discounted items)
    var savGrid = document.getElementById('home2SavingsGrid');
    if (savGrid && offers) {
      savGrid.innerHTML = offers.getDiscountedProducts().slice(0, 4).map(function (p) {
        return ui.renderProductCardHTML(p);
      }).join('');
    }
  }

  function renderPlanningBoardHTML(board) {
    var rows = board.ids.map(function (id) {
      var p = cat.getProductById(id);
      if (!p) return '';
      var eff = cat.getEffectivePricePaise(p, p.pack);
      return (
        '<div class="planning-board__row">' +
          '<span><strong>' + ui.escapeHtml(p.name) + '</strong> <span class="text-muted">(' + ui.escapeHtml(p.pack) + ')</span></span>' +
          '<button type="button" class="btn btn--outline btn--sm js-quick-add" data-id="' + ui.escapeHtml(p.id) + '" data-pack="' + ui.escapeHtml(p.pack) + '">' + ui.escapeHtml(cfg.formatINR(eff)) + ' +</button>' +
        '</div>'
      );
    }).join('');
    return (
      '<article class="planning-board">' +
        '<div class="planning-board__head">' +
          '<img src="' + ui.escapeHtml(cfg.resolvePath(board.img)) + '" alt="' + ui.escapeHtml(board.title) + '" loading="lazy" width="120" height="88">' +
          '<div><h3 style="font-size:1.15rem">' + ui.escapeHtml(board.title) + '</h3><p class="text-muted" style="font-size:0.9375rem;margin-top:4px">' + ui.escapeHtml(board.subtitle) + '</p></div>' +
        '</div>' +
        '<div class="planning-board__rows">' + rows + '</div>' +
        '<div class="planning-board__foot">' +
          '<button type="button" class="btn btn--primary btn--sm js-add-board" data-board-ids="' + ui.escapeHtml(board.ids.join(',')) + '">Add All to Cart</button>' +
          '<a class="btn btn--outline btn--sm" href="' + ui.escapeHtml(cfg.resolvePath(board.link)) + '">Browse Aisle</a>' +
        '</div>' +
      '</article>'
    );
  }

  function renderBundleCardHTML(bundle) {
    var totals = offers.computeBundleTotals(bundle);
    var chips = bundle.items.map(function (it) {
      var p = cat.getProductById(it.productId);
      if (!p) return '';
      return (
        '<span class="bundle-item-chip">' +
          '<img src="' + ui.escapeHtml(cfg.resolvePath(p.image)) + '" alt="' + ui.escapeHtml(p.name) + '" width="28" height="28">' +
          '<span>' + it.qty + ' &times; ' + ui.escapeHtml(p.name) + ' (' + ui.escapeHtml(it.pack) + ')</span>' +
        '</span>'
      );
    }).join('');

    return (
      '<article class="bundle-card">' +
        '<div class="bundle-card__head">' +
          '<h3 class="bundle-card__title">' + ui.escapeHtml(bundle.title) + '</h3>' +
          (totals.savingsPaise > 0 ? '<span class="bundle-card__save">Save ' + ui.escapeHtml(cfg.formatINR(totals.savingsPaise)) + '</span>' : '') +
        '</div>' +
        '<p class="text-muted" style="font-size:0.9375rem">' + ui.escapeHtml(bundle.description) + '</p>' +
        '<div class="bundle-card__items">' + chips + '</div>' +
        '<div class="bundle-card__foot">' +
          '<div class="bundle-card__pricing">' +
            '<span class="product-card__price">' + ui.escapeHtml(cfg.formatINR(totals.offerPaise)) + '</span>' +
            (totals.savingsPaise > 0 ? '<span class="product-card__mrp">' + ui.escapeHtml(cfg.formatINR(totals.regularPaise)) + '</span>' : '') +
          '</div>' +
          '<button type="button" class="btn btn--primary btn--sm js-add-bundle" data-bundle-id="' + ui.escapeHtml(bundle.id) + '">Add Bundle to Cart</button>' +
        '</div>' +
      '</article>'
    );
  }

  /* --------------------------------------------------------------------------
     Offers Page Controller
     -------------------------------------------------------------------------- */
  function initOffersPage() {
    if (!offers) return;
    var catFilter = 'all';
    var maxPrice = 'all';

    var grid = document.getElementById('offersGrid');
    var countEl = document.getElementById('offersCount');
    var emptyEl = document.getElementById('offersEmpty');
    var catSelect = document.getElementById('offersCategoryFilter');
    var priceSelect = document.getElementById('offersPriceFilter');
    var bundlesEl = document.getElementById('offersBundlesGrid');
    var budgetEl = document.getElementById('offersBudgetGrid');

    function renderFilteredOffers() {
      var list = offers.getDiscountedProducts().filter(function (p) {
        if (catFilter !== 'all' && p.category !== catFilter) return false;
        var eff = cat.getEffectivePricePaise(p, p.pack);
        if (maxPrice === 'under100' && eff > 10000) return false;
        if (maxPrice === 'under200' && eff > 20000) return false;
        return true;
      });
      if (countEl) countEl.textContent = 'Showing ' + list.length + ' active weekly offers';
      if (!list.length) {
        grid.innerHTML = '';
        grid.hidden = true;
        emptyEl.hidden = false;
      } else {
        emptyEl.hidden = true;
        grid.hidden = false;
        grid.innerHTML = list.map(function (p) { return ui.renderProductCardHTML(p); }).join('');
      }
    }

    if (catSelect) {
      catSelect.addEventListener('change', function () {
        catFilter = catSelect.value || 'all';
        renderFilteredOffers();
      });
    }
    if (priceSelect) {
      priceSelect.addEventListener('change', function () {
        maxPrice = priceSelect.value || 'all';
        renderFilteredOffers();
      });
    }

    var resetBtn = document.getElementById('offersResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        catFilter = 'all';
        maxPrice = 'all';
        if (catSelect) ui.setSelectValue(catSelect, 'all');
        if (priceSelect) ui.setSelectValue(priceSelect, 'all');
        renderFilteredOffers();
      });
    }

    if (bundlesEl) {
      bundlesEl.innerHTML = offers.bundles.map(renderBundleCardHTML).join('');
    }

    if (budgetEl) {
      var budgetPicks = cat.products.filter(function (p) {
        return cat.getEffectivePricePaise(p, p.pack) <= 6500;
      }).slice(0, 8);
      budgetEl.innerHTML = budgetPicks.map(function (p) {
        return ui.renderProductCardHTML(p);
      }).join('');
    }

    renderFilteredOffers();
  }

  /* --------------------------------------------------------------------------
     Delivery Info Page Controller (PIN Checker & Dynamic Config Table)
     -------------------------------------------------------------------------- */
  function initDeliveryPage() {
    var feeEl = document.getElementById('delivFeeVal');
    var threshEl = document.getElementById('delivThresholdVal');
    var minEl = document.getElementById('delivMinOrderVal');
    if (feeEl) feeEl.textContent = cfg.formatINR(cfg.delivery.standardFeePaise);
    if (threshEl) threshEl.textContent = cfg.formatINR(cfg.delivery.freeThresholdPaise);
    if (minEl) minEl.textContent = cfg.formatINR(cfg.delivery.minOrderPaise);

    var slotsTbody = document.getElementById('delivSlotsTableBody');
    if (slotsTbody) {
      slotsTbody.innerHTML = cfg.delivery.slots.map(function (s, idx) {
        return '<tr><td><strong>Window ' + (idx + 1) + '</strong></td><td>' + ui.escapeHtml(s.label) + '</td><td>Illustrative daily schedule</td></tr>';
      }).join('');
    }

    var areasTbody = document.getElementById('delivSamplePinsBody');
    if (areasTbody) {
      areasTbody.innerHTML = cfg.delivery.serviceableAreas.map(function (a) {
        return '<tr><td><code>' + ui.escapeHtml(a.pin) + '</code></td><td>' + ui.escapeHtml(a.area) + '</td><td>' + ui.escapeHtml(a.city) + '</td><td>' + ui.escapeHtml(a.windows) + '</td></tr>';
      }).join('');
    }

    var pinForm = document.getElementById('pinCheckForm');
    var pinInput = document.getElementById('pinCheckInput');
    var pinResult = document.getElementById('pinCheckResult');
    if (pinForm && pinInput && pinResult) {
      pinForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var pin = String(pinInput.value || '').trim();
        pinResult.hidden = false;
        if (!/^\d{6}$/.test(pin)) {
          pinResult.className = 'pin-result pin-result--warn';
          pinResult.textContent = 'Please enter a valid 6-digit Indian PIN code (for example, 560038).';
          return;
        }
        var match = cfg.delivery.serviceableAreas.find(function (a) { return a.pin === pin; });
        if (match) {
          pinResult.className = 'pin-result pin-result--ok';
          pinResult.textContent = 'PIN ' + match.pin + ' (' + match.area + ', ' + match.city + ') is listed in our illustrative sample service directory (' + match.windows + '). Actual live delivery availability requires store-side dispatch confirmation.';
        } else {
          pinResult.className = 'pin-result pin-result--warn';
          pinResult.textContent = 'PIN ' + pin + ' is not in the illustrative sample PIN list below. You can still test the demonstration Checkout workflow with any valid 6-digit PIN.';
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     Contact Page Controller
     -------------------------------------------------------------------------- */
  function initContactPage() {
    var form = document.getElementById('contactForm');
    var status = document.getElementById('contactStatus');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = String(document.getElementById('ctName').value || '').trim();
      var email = String(document.getElementById('ctEmail').value || '').trim();
      var phone = String(document.getElementById('ctPhone').value || '').trim();
      var type = String(document.getElementById('ctType').value || '');
      var orderRef = String(document.getElementById('ctOrderRef').value || '').trim();
      var message = String(document.getElementById('ctMessage').value || '').trim();

      var valid = true;
      function mark(id, msg) {
        var el = document.getElementById(id);
        var field = el ? el.closest('.form-field') : null;
        var err = field ? field.querySelector('.form-error') : null;
        if (field) field.classList.toggle('has-error', Boolean(msg));
        if (err) err.textContent = msg || '';
      }

      if (name.length < 2) { mark('ctName', 'Enter your name.'); valid = false; } else mark('ctName', '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mark('ctEmail', 'Enter a valid email address.'); valid = false; } else mark('ctEmail', '');
      if (phone && !/^\d{10}$/.test(phone.replace(/\s+/g, ''))) { mark('ctPhone', 'Enter a 10-digit phone number or leave blank.'); valid = false; } else mark('ctPhone', '');
      if (message.length < 10) { mark('ctMessage', 'Please include at least 10 characters in your message.'); valid = false; } else mark('ctMessage', '');

      if (!valid) return;

      status.hidden = false;
      status.innerHTML =
        '<strong>Enquiry Prepared (Local Preview Only):</strong> ' +
        ui.escapeHtml(type) + ' from ' + ui.escapeHtml(name) + ' (' + ui.escapeHtml(email) + ')' +
        (orderRef ? ' · Ref: ' + ui.escapeHtml(orderRef) : '') +
        '. Because this static website has no connected email or support desk backend, no message was transmitted.';
      form.reset();
      var typeSel = document.getElementById('ctType');
      if (typeSel) ui.setSelectValue(typeSel, typeSel.options[0].value);
    });
  }

  /* --------------------------------------------------------------------------
     Global Quick Actions (Quick Add, Bundle Add, Meal Pack Add)
     -------------------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var qa = e.target.closest('.js-quick-add');
    if (qa) {
      var id = qa.getAttribute('data-id');
      var pack = qa.getAttribute('data-pack');
      var prod = cat.getProductById(id);
      if (prod) {
        store.addToCart(prod.id, pack || prod.pack, 1);
        store.showToast('Added ' + prod.name + ' to cart');
      }
      return;
    }

    var qo = e.target.closest('.js-quick-open');
    if (qo) {
      ui.openProductModal(qo.getAttribute('data-id'));
      return;
    }

    var ab = e.target.closest('.js-add-bundle');
    if (ab && offers) {
      var b = offers.bundles.find(function (x) { return x.id === ab.getAttribute('data-bundle-id'); });
      if (b) {
        b.items.forEach(function (it) { store.addToCart(it.productId, it.pack, it.qty); });
        store.showToast('Added "' + b.title + '" (' + b.items.length + ' items) to cart');
      }
      return;
    }

    var amp = e.target.closest('.js-add-meal-pack');
    if (amp && offers) {
      var m = offers.mealCollections.find(function (x) { return x.id === amp.getAttribute('data-meal'); });
      if (m) {
        m.productIds.slice(0, 5).forEach(function (pid) {
          var p = cat.getProductById(pid);
          if (p) store.addToCart(p.id, p.pack, 1);
        });
        store.showToast('Added ' + m.title + ' ingredients to cart');
      }
      return;
    }

    var abd = e.target.closest('.js-add-board');
    if (abd) {
      var ids = (abd.getAttribute('data-board-ids') || '').split(',').filter(Boolean);
      ids.forEach(function (pid) {
        var p = cat.getProductById(pid);
        if (p) store.addToCart(p.id, p.pack, 1);
      });
      if (ids.length) store.showToast('Added ' + ids.length + ' items to cart');
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    if (page === 'home1') initHome1();
    else if (page === 'home2') initHome2();
    else if (page === 'offers') initOffersPage();
    else if (page === 'delivery') initDeliveryPage();
    else if (page === 'contact') initContactPage();
  });
})(window);
