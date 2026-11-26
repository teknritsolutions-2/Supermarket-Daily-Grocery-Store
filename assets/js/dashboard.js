/**
 * FreshAisle — Customer Dashboard Controller (pages/dashboard.html)
 */
(function (global) {
  'use strict';

  var cfg = global.FRESHAISLE_CONFIG;
  var cat = global.FRESHAISLE_CATALOGUE;
  var store = global.FRESHAISLE_STORE;
  var ui = global.FreshAisleUI;
  if (!cfg || !cat || !store || !ui) return;

  var activeSection = 'overview';
  var selectedListId = null;
  var selectedOrderId = null;

  function switchSection(sectionId) {
    activeSection = sectionId;
    document.querySelectorAll('.dash-section').forEach(function (sec) {
      sec.classList.toggle('is-active', sec.id === 'sec-' + sectionId);
    });
    document.querySelectorAll('[data-dash-nav]').forEach(function (btn) {
      var active = btn.getAttribute('data-dash-nav') === sectionId;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  function renderNavCounts() {
    var cart = store.getCartSummary();
    var lists = store.getLists();
    var orders = store.getOrders();
    document.querySelectorAll('.js-dash-cart-badge').forEach(function (el) { el.textContent = String(cart.totalUnits); });
    document.querySelectorAll('.js-dash-lists-badge').forEach(function (el) { el.textContent = String(lists.length); });
    document.querySelectorAll('.js-dash-orders-badge').forEach(function (el) { el.textContent = String(orders.length); });
  }

  /* ---------------- Overview ---------------- */
  function renderOverview() {
    var container = document.getElementById('dashOverviewContent');
    if (!container) return;
    var cart = store.getCartSummary();
    var lists = store.getLists();
    var orders = store.getOrders();
    var latestOrder = orders[0] || null;

    var recentProducts = [];
    var seen = {};
    orders.forEach(function (ord) {
      ord.items.forEach(function (it) {
        if (!seen[it.productId] && recentProducts.length < 4) {
          var prod = cat.getProductById(it.productId);
          if (prod) {
            seen[it.productId] = true;
            recentProducts.push(prod);
          }
        }
      });
    });

    container.innerHTML =
      '<div class="dash-overview-grid">' +
        '<div class="dash-panel">' +
          '<div class="dash-panel__head"><h2>Current Cart</h2><a class="text-link" href="' + ui.escapeHtml(cfg.resolvePath('pages/cart.html')) + '">Open Cart</a></div>' +
          (cart.items.length
            ? '<p><bdi>' + cart.totalUnits + ' items</bdi> in your basket · Estimated total <bdi><strong>' + ui.escapeHtml(cfg.formatINR(cart.totalPaise)) + '</strong></bdi></p>' +
              '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
                '<button type="button" class="btn btn--primary btn--sm js-jump-sec" data-target="cart">Manage Cart</button>' +
                '<a class="btn btn--outline btn--sm" href="' + ui.escapeHtml(cfg.resolvePath('pages/checkout.html')) + '">Checkout</a>' +
              '</div>'
            : '<p class="text-muted">Your shopping cart is currently empty.</p>' +
              '<div style="margin-top:12px"><a class="btn btn--primary btn--sm" href="' + ui.escapeHtml(cfg.resolvePath('pages/products.html')) + '">Browse Products</a></div>') +
        '</div>' +
        '<div class="dash-panel">' +
          '<div class="dash-panel__head"><h2>Latest Order</h2><button type="button" class="text-link js-jump-sec" data-target="orders" style="border:0;background:none;padding:0">All Orders</button></div>' +
          (latestOrder
            ? '<p><strong>' + ui.escapeHtml(latestOrder.id) + '</strong> · ' + ui.escapeHtml(latestOrder.status) + '</p>' +
              '<p class="text-muted" style="margin-top:4px"><bdi>' + latestOrder.items.length + ' items</bdi> · <bdi>' + ui.escapeHtml(cfg.formatINR(latestOrder.totalPaise)) + '</bdi> · <bdi>' + ui.escapeHtml(latestOrder.deliveryDate) + '</bdi></p>' +
              '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
                '<button type="button" class="btn btn--outline btn--sm js-dash-track" data-order-id="' + ui.escapeHtml(latestOrder.id) + '">Track Status</button>' +
                '<button type="button" class="btn btn--primary btn--sm js-dash-reorder" data-order-id="' + ui.escapeHtml(latestOrder.id) + '">Reorder</button>' +
              '</div>'
            : '<p class="text-muted">No orders placed yet.</p>') +
        '</div>' +
      '</div>' +
      '<div class="dash-panel">' +
        '<div class="dash-panel__head"><h2>Saved Shopping Lists</h2><button type="button" class="text-link js-jump-sec" data-target="lists" style="border:0;background:none;padding:0">Manage Lists</button></div>' +
        (lists.length
          ? '<div style="display:flex;flex-wrap:wrap;gap:10px">' + lists.map(function (l) {
              return '<button type="button" class="btn btn--outline btn--sm js-open-specific-list" data-list-id="' + ui.escapeHtml(l.id) + '">' + ui.escapeHtml(l.name) + ' (' + l.items.length + ')</button>';
            }).join('') + '</div>'
          : '<p class="text-muted">No shopping lists created yet.</p>') +
      '</div>' +
      (recentProducts.length
        ? '<div class="dash-panel"><div class="dash-panel__head"><h2>Recently Purchased Groceries</h2></div>' +
          '<div class="product-grid">' + recentProducts.map(function (p) { return ui.renderProductCardHTML(p); }).join('') + '</div></div>'
        : '');
  }

  /* ---------------- Shopping Lists ---------------- */
  function renderLists() {
    var lists = store.getLists();
    var sidebar = document.getElementById('dashListsSidebar');
    var detail = document.getElementById('dashListDetail');
    if (!sidebar || !detail) return;

    if (!lists.length) {
      selectedListId = null;
      sidebar.innerHTML = '<p class="text-muted">No lists yet. Create your first shopping list above.</p>';
      detail.innerHTML = '<div class="empty-state"><h3>No Shopping Lists</h3><p>Create a list like Weekly Groceries or Monthly Pantry to organize repeat items.</p></div>';
      return;
    }

    if (!selectedListId || !lists.some(function (l) { return l.id === selectedListId; })) {
      selectedListId = lists[0].id;
    }

    sidebar.innerHTML = lists.map(function (l) {
      return (
        '<button type="button" class="list-selector-btn' + (l.id === selectedListId ? ' is-active' : '') + '" data-select-list="' + ui.escapeHtml(l.id) + '">' +
          '<span>' + ui.escapeHtml(l.name) + '</span>' +
          '<span class="dash-nav__badge">' + l.items.length + '</span>' +
        '</button>'
      );
    }).join('');

    var activeList = lists.find(function (l) { return l.id === selectedListId; });
    var productOptions = cat.products.map(function (p) {
      return '<option value="' + ui.escapeHtml(p.id) + '">' + ui.escapeHtml(p.name) + ' (' + ui.escapeHtml(p.pack) + ' — ' + ui.escapeHtml(cfg.formatINR(cat.getEffectivePricePaise(p, p.pack))) + ')</option>';
    }).join('');

    var checkedCount = activeList.items.filter(function (it) { return it.checked; }).length;

    var itemsHtml = activeList.items.length
      ? activeList.items.map(function (it) {
          var prod = cat.getProductById(it.productId);
          if (!prod) return '';
          var eff = cat.getEffectivePricePaise(prod, it.pack);
          return (
            '<div class="list-item-row' + (it.checked ? ' is-checked' : '') + '">' +
              '<input type="checkbox" class="list-item-row__check js-list-check" data-id="' + ui.escapeHtml(prod.id) + '" data-pack="' + ui.escapeHtml(it.pack) + '"' + (it.checked ? ' checked' : '') + ' aria-label="Check ' + ui.escapeHtml(prod.name) + '">' +
              '<img class="list-item-row__img" src="' + ui.escapeHtml(cfg.resolvePath(prod.image)) + '" alt="' + ui.escapeHtml(prod.alt || prod.name) + '">' +
              '<div>' +
                '<div class="list-item-row__name" style="font-weight:700">' + ui.escapeHtml(prod.name) + '</div>' +
                '<div class="text-muted" style="font-size:0.875rem">' + ui.escapeHtml(it.pack) + ' · ' + ui.escapeHtml(cfg.formatINR(eff)) + '</div>' +
              '</div>' +
              '<div class="list-item-row__controls">' +
                '<div class="qty-stepper">' +
                  '<button type="button" class="qty-stepper__btn js-list-dec" data-id="' + ui.escapeHtml(prod.id) + '" data-pack="' + ui.escapeHtml(it.pack) + '" aria-label="Decrease">&minus;</button>' +
                  '<span class="qty-stepper__val">' + it.qty + '</span>' +
                  '<button type="button" class="qty-stepper__btn js-list-inc" data-id="' + ui.escapeHtml(prod.id) + '" data-pack="' + ui.escapeHtml(it.pack) + '" aria-label="Increase">+</button>' +
                '</div>' +
                '<button type="button" class="btn btn--danger-outline btn--sm js-list-rem" data-id="' + ui.escapeHtml(prod.id) + '" data-pack="' + ui.escapeHtml(it.pack) + '">Remove</button>' +
              '</div>' +
            '</div>'
          );
        }).join('')
      : '<p class="text-muted" style="padding-block:12px">This list has no products yet. Add any grocery item below.</p>';

    detail.innerHTML =
      '<div class="dash-panel">' +
        '<div class="dash-panel__head">' +
          '<h2>' + ui.escapeHtml(activeList.name) + '</h2>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<button type="button" class="btn btn--outline btn--sm" id="dashRenameListBtn">Rename</button>' +
            '<button type="button" class="btn btn--danger-outline btn--sm" id="dashDeleteListBtn">Delete List</button>' +
          '</div>' +
        '</div>' +
        '<form id="dashAddItemToListForm" style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:16px">' +
          '<div class="form-field">' +
            '<label for="dashListAddSelect" class="sr-only">Choose product to add</label>' +
            '<select id="dashListAddSelect" data-v-select>' + productOptions + '</select>' +
          '</div>' +
          '<button type="submit" class="btn btn--primary">Add Product</button>' +
        '</form>' +
        '<div id="dashRenameBox" hidden style="margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap">' +
          '<input id="dashRenameInput" type="text" class="form-input" style="max-width:280px" value="' + ui.escapeHtml(activeList.name) + '" maxlength="48">' +
          '<button type="button" class="btn btn--primary btn--sm" id="dashRenameSaveBtn">Save Name</button>' +
          '<button type="button" class="btn btn--outline btn--sm" id="dashRenameCancelBtn">Cancel</button>' +
        '</div>' +
        '<div>' + itemsHtml + '</div>' +
        (activeList.items.length
          ? '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">' +
              '<button type="button" class="btn btn--primary btn--sm" id="dashAddSelectedToCart"' + (checkedCount === 0 ? ' disabled' : '') + '>Add Checked (' + checkedCount + ') to Cart</button>' +
              '<button type="button" class="btn btn--outline btn--sm" id="dashAddAllToCart">Add Complete List to Cart</button>' +
            '</div>'
          : '') +
      '</div>';

    ui.initCustomSelects(detail);

    var addForm = document.getElementById('dashAddItemToListForm');
    if (addForm) {
      addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var pid = document.getElementById('dashListAddSelect').value;
        var p = cat.getProductById(pid);
        if (p) {
          store.addListItem(activeList.id, p.id, p.pack, 1);
          store.showToast('Added ' + p.name + ' to ' + activeList.name);
        }
      });
    }

    var renBtn = document.getElementById('dashRenameListBtn');
    var renBox = document.getElementById('dashRenameBox');
    if (renBtn && renBox) {
      renBtn.addEventListener('click', function () { renBox.hidden = !renBox.hidden; });
      document.getElementById('dashRenameCancelBtn').addEventListener('click', function () { renBox.hidden = true; });
      document.getElementById('dashRenameSaveBtn').addEventListener('click', function () {
        var val = String(document.getElementById('dashRenameInput').value || '').trim();
        if (val) {
          store.renameList(activeList.id, val);
          store.showToast('List renamed to "' + val + '"');
        }
      });
    }

    var delBtn = document.getElementById('dashDeleteListBtn');
    if (delBtn) {
      delBtn.addEventListener('click', function () {
        store.deleteList(activeList.id);
        store.showToast('Deleted shopping list');
      });
    }

    var addSelBtn = document.getElementById('dashAddSelectedToCart');
    if (addSelBtn) {
      addSelBtn.addEventListener('click', function () {
        var res = store.transferListToCart(activeList.id, true);
        store.showToast('Added ' + res.addedCount + ' checked items to cart (list retained)');
      });
    }

    var addAllBtn = document.getElementById('dashAddAllToCart');
    if (addAllBtn) {
      addAllBtn.addEventListener('click', function () {
        var res = store.transferListToCart(activeList.id, false);
        store.showToast('Added all ' + res.addedCount + ' items from "' + activeList.name + '" to cart');
      });
    }
  }

  /* ---------------- My Cart (Dashboard mirror of shared cart) ---------------- */
  function renderDashCart() {
    var box = document.getElementById('dashCartContent');
    if (!box) return;
    var summary = store.getCartSummary();
    if (!summary.items.length) {
      box.innerHTML = '<div class="empty-state"><h3>Your Cart is Empty</h3><p>Add groceries from the catalogue or transfer items from a Shopping List.</p><a class="btn btn--primary" href="' + ui.escapeHtml(cfg.resolvePath('pages/products.html')) + '">Shop Groceries</a></div>';
      return;
    }

    box.innerHTML =
      '<div class="dash-panel">' +
        summary.items.map(function (it) {
          return (
            '<div class="list-item-row">' +
              '<img class="list-item-row__img" src="' + ui.escapeHtml(cfg.resolvePath(it.product.image)) + '" alt="' + ui.escapeHtml(it.product.alt || it.product.name) + '" style="grid-column:span 1">' +
              '<div style="grid-column:span 2">' +
                '<div style="font-weight:700">' + ui.escapeHtml(it.product.name) + ' (' + ui.escapeHtml(it.pack) + ')</div>' +
                '<div class="text-muted" style="font-size:0.875rem">' + ui.escapeHtml(cfg.formatINR(it.unitPricePaise)) + ' each</div>' +
              '</div>' +
              '<div class="list-item-row__controls">' +
                '<div class="qty-stepper">' +
                  '<button type="button" class="qty-stepper__btn js-dashcart-dec" data-id="' + ui.escapeHtml(it.productId) + '" data-pack="' + ui.escapeHtml(it.pack) + '">&minus;</button>' +
                  '<span class="qty-stepper__val">' + it.qty + '</span>' +
                  '<button type="button" class="qty-stepper__btn js-dashcart-inc" data-id="' + ui.escapeHtml(it.productId) + '" data-pack="' + ui.escapeHtml(it.pack) + '">+</button>' +
                '</div>' +
                '<strong>' + ui.escapeHtml(cfg.formatINR(it.lineTotalPaise)) + '</strong>' +
              '</div>' +
            '</div>'
          );
        }).join('') +
        '<div style="margin-top:16px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px">' +
          '<div><strong>Estimated Total:</strong> ' + ui.escapeHtml(cfg.formatINR(summary.totalPaise)) + ' <span class="text-muted">(includes ' + (summary.deliveryFeePaise === 0 ? 'free delivery' : cfg.formatINR(summary.deliveryFeePaise) + ' delivery') + ')</span></div>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
            '<a class="btn btn--outline btn--sm" href="' + ui.escapeHtml(cfg.resolvePath('pages/cart.html')) + '">Full Cart View</a>' +
            '<a class="btn btn--primary btn--sm" href="' + ui.escapeHtml(cfg.resolvePath('pages/checkout.html')) + '">Proceed to Checkout</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------------- My Orders ---------------- */
  function downloadOrderTxt(order) {
    var lines = [
      'FRESHAISLE — ORDER SUMMARY',
      'Order ID: ' + order.id,
      'Status: ' + order.status,
      'Date: ' + order.deliveryDate + ' | Window: ' + order.deliverySlot,
      'Recipient: ' + order.customer.name + ' (' + order.customer.phone + ')',
      'Address: ' + order.customer.address + ' (PIN ' + order.customer.pin + ')',
      '',
      'ITEMS:'
    ];
    order.items.forEach(function (it) {
      lines.push('- ' + it.name + ' (' + it.pack + ') x ' + it.qty + ' @ ' + cfg.formatINR(it.unitPricePaise));
    });
    lines.push('');
    lines.push('Subtotal: ' + cfg.formatINR(order.subtotalPaise));
    lines.push('Delivery Fee: ' + (order.deliveryFeePaise === 0 ? 'Free' : cfg.formatINR(order.deliveryFeePaise)));
    lines.push('Total: ' + cfg.formatINR(order.totalPaise));
    lines.push('Payment Method: Pay on Delivery');

    var blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = order.id + '-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function renderOrders() {
    var box = document.getElementById('dashOrdersContent');
    if (!box) return;
    var orders = store.getOrders();
    if (!orders.length) {
      box.innerHTML = '<div class="empty-state"><h3>No Orders Yet</h3><p>Place a home delivery order from Checkout to view your order history and tracking.</p><a class="btn btn--primary" href="' + ui.escapeHtml(cfg.resolvePath('pages/products.html')) + '">Shop Groceries</a></div>';
      return;
    }

    box.innerHTML = orders.map(function (ord) {
      var unitCount = ord.items.reduce(function (acc, i) { return acc + (i.qty || 1); }, 0);
      return (
        '<article class="order-card">' +
          '<div class="order-card__top">' +
            '<div><strong>' + ui.escapeHtml(ord.id) + '</strong>' + (ord.isSample ? ' <span class="text-muted">(Recent Delivery)</span>' : '') + '</div>' +
            '<span class="order-status-pill">' + ui.escapeHtml(ord.status) + '</span>' +
          '</div>' +
          '<div class="order-card__meta">' +
            '<span><strong>Date:</strong> ' + ui.escapeHtml(ord.deliveryDate) + '</span>' +
            '<span><strong>Items:</strong> ' + unitCount + '</span>' +
            '<span><strong>Slot:</strong> ' + ui.escapeHtml(ord.deliverySlot) + '</span>' +
            '<span><strong>Total:</strong> ' + ui.escapeHtml(cfg.formatINR(ord.totalPaise)) + '</span>' +
          '</div>' +
          '<div class="order-card__actions">' +
            '<button type="button" class="btn btn--outline btn--sm js-dash-toggle-details" data-order-id="' + ui.escapeHtml(ord.id) + '">View Order</button>' +
            '<button type="button" class="btn btn--primary btn--sm js-dash-reorder" data-order-id="' + ui.escapeHtml(ord.id) + '">Reorder (Current Prices)</button>' +
            '<button type="button" class="btn btn--outline btn--sm js-dash-track" data-order-id="' + ui.escapeHtml(ord.id) + '">Track Order</button>' +
            '<button type="button" class="btn btn--outline btn--sm js-dash-download" data-order-id="' + ui.escapeHtml(ord.id) + '">Download Summary</button>' +
          '</div>' +
          '<div class="js-order-details-drawer" id="ord-det-' + ui.escapeHtml(ord.id) + '" hidden style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-subtle)">' +
            ord.items.map(function (it) {
              return '<div class="summary-row"><span>' + ui.escapeHtml(it.name) + ' (' + ui.escapeHtml(it.pack) + ') &times; ' + it.qty + '</span><span>' + ui.escapeHtml(cfg.formatINR(it.unitPricePaise * it.qty)) + '</span></div>';
            }).join('') +
            '<p class="text-muted" style="margin-top:8px;font-size:0.875rem"><strong>Delivery Address:</strong> ' + ui.escapeHtml(ord.customer.address) + ' (PIN ' + ui.escapeHtml(ord.customer.pin) + ')</p>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  /* ---------------- Track Order ---------------- */
  function renderTracker() {
    var box = document.getElementById('dashTrackContent');
    if (!box) return;
    var orders = store.getOrders();
    if (!orders.length) {
      box.innerHTML = '<div class="empty-state"><h3>No Order Selected</h3><p>Place an order through Checkout to follow the 5-stage delivery timeline.</p></div>';
      return;
    }

    if (!selectedOrderId || !orders.some(function (o) { return o.id === selectedOrderId; })) {
      selectedOrderId = orders[0].id;
    }

    var ord = orders.find(function (o) { return o.id === selectedOrderId; });
    var orderSelectHtml = orders.map(function (o) {
      return '<option value="' + ui.escapeHtml(o.id) + '"' + (o.id === ord.id ? ' selected' : '') + '>' + ui.escapeHtml(o.id) + ' — ' + ui.escapeHtml(o.status) + '</option>';
    }).join('');

    var timelineHtml = cfg.orderStages.map(function (stage, idx) {
      var done = idx <= ord.stageIndex;
      var current = idx === ord.stageIndex;
      return (
        '<div class="timeline-step' + (done ? ' is-done' : '') + (current ? ' is-current' : '') + '">' +
          '<span class="timeline-step__num">' + (idx + 1) + '</span>' +
          '<span class="timeline-step__label">' + ui.escapeHtml(stage) + '</span>' +
          '<span class="text-muted" style="font-size:0.875rem">' + (current ? 'Current stage' : (done ? 'Completed' : 'Pending')) + '</span>' +
        '</div>'
      );
    }).join('');

    var stageButtonsHtml = cfg.orderStages.map(function (stage, idx) {
      return '<button type="button" class="chip-tab' + (idx === ord.stageIndex ? ' is-active' : '') + ' js-set-demo-stage" data-stage-idx="' + idx + '">' + (idx + 1) + '. ' + ui.escapeHtml(stage) + '</button>';
    }).join('');

    box.innerHTML =
      '<div class="dash-panel">' +
        '<div class="form-field" style="max-width:360px;margin-bottom:16px">' +
          '<label for="dashTrackOrderSelect" class="form-label">Select Order</label>' +
          '<select id="dashTrackOrderSelect" data-v-select>' + orderSelectHtml + '</select>' +
        '</div>' +
        '<div class="order-card__meta">' +
          '<span><strong>Order ID:</strong> ' + ui.escapeHtml(ord.id) + '</span>' +
          '<span><strong>Window:</strong> ' + ui.escapeHtml(ord.deliveryDate) + ' · ' + ui.escapeHtml(ord.deliverySlot) + '</span>' +
          '<span><strong>Status:</strong> ' + ui.escapeHtml(ord.status) + '</span>' +
        '</div>' +
        '<div class="timeline">' + timelineHtml + '</div>' +
        '<div class="notice-box">' +
          '<strong>Delivery Stage Controls:</strong> Update your fulfillment progress stage below to preview each step on the order timeline.' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">' + stageButtonsHtml + '</div>' +
        '</div>' +
      '</div>';

    ui.initCustomSelects(box);

    var trackSel = document.getElementById('dashTrackOrderSelect');
    if (trackSel) {
      trackSel.addEventListener('change', function () {
        selectedOrderId = trackSel.value;
        renderTracker();
      });
    }

    box.querySelectorAll('.js-set-demo-stage').forEach(function (btn) {
      btn.addEventListener('click', function () {
        store.setOrderDemoStage(ord.id, parseInt(btn.getAttribute('data-stage-idx'), 10));
        store.showToast('Order status updated to "' + cfg.orderStages[parseInt(btn.getAttribute('data-stage-idx'), 10)] + '"');
      });
    });
  }

  /* ---------------- Saved Addresses ---------------- */
  function renderAddresses() {
    var box = document.getElementById('dashAddressesList');
    if (!box) return;
    var list = store.getAddresses();
    if (!list.length) {
      box.innerHTML = '<p class="text-muted">No saved delivery addresses yet.</p>';
      return;
    }

    box.innerHTML = list.map(function (a) {
      return (
        '<div class="address-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
            '<strong>' + ui.escapeHtml(a.label || 'Address') + (a.isDefault ? ' (Default)' : '') + '</strong>' +
            '<button type="button" class="btn btn--danger-outline btn--sm js-del-addr" data-addr-id="' + ui.escapeHtml(a.id) + '">Remove</button>' +
          '</div>' +
          '<div>' + ui.escapeHtml(a.recipient) + ' · ' + ui.escapeHtml(a.phone) + '</div>' +
          '<div class="text-muted" style="font-size:0.9375rem">' + ui.escapeHtml(a.line1) + ', ' + ui.escapeHtml(a.area) + ' — PIN ' + ui.escapeHtml(a.pin) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* ---------------- Profile ---------------- */
  function populateProfileForm() {
    var prof = store.getProfile();
    var nameEl = document.getElementById('profName');
    var emailEl = document.getElementById('profEmail');
    var phoneEl = document.getElementById('profPhone');
    var slotEl = document.getElementById('profSlot');
    var subEl = document.getElementById('profSub');

    if (slotEl && !slotEl.options.length) {
      slotEl.innerHTML = cfg.delivery.slots.map(function (s) {
        return '<option value="' + ui.escapeHtml(s.id) + '">' + ui.escapeHtml(s.label) + '</option>';
      }).join('');
      ui.refreshSelect(slotEl);
    }
    if (subEl && !subEl.options.length) {
      subEl.innerHTML = cfg.delivery.substitutionOptions.map(function (s) {
        return '<option value="' + ui.escapeHtml(s.id) + '">' + ui.escapeHtml(s.label) + '</option>';
      }).join('');
      ui.refreshSelect(subEl);
    }

    if (nameEl) nameEl.value = prof.name || '';
    if (emailEl) emailEl.value = prof.email || '';
    if (phoneEl) phoneEl.value = prof.phone || '';
    if (slotEl && prof.preferredSlot) ui.setSelectValue(slotEl, prof.preferredSlot);
    if (subEl && prof.substitutionPref) ui.setSelectValue(subEl, prof.substitutionPref);
  }

  function renderAll() {
    renderNavCounts();
    renderOverview();
    renderLists();
    renderDashCart();
    renderOrders();
    renderTracker();
    renderAddresses();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.getAttribute('data-page') !== 'dashboard') return;

    populateProfileForm();
    renderAll();

    // Handle hash route like #track?order=...
    var hash = global.location.hash.replace('#', '');
    if (hash) {
      var parts = hash.split('?');
      if (parts[1]) {
        var hp = new URLSearchParams(parts[1]);
        if (hp.get('order')) selectedOrderId = hp.get('order');
      }
      if (document.getElementById('sec-' + parts[0])) {
        switchSection(parts[0]);
      }
    }

    // Mobile dashboard drawer
    var openDrawerBtn = document.getElementById('dashDrawerOpen');
    var closeDrawerBtn = document.getElementById('dashDrawerClose');
    var drawer = document.getElementById('dashDrawer');
    var backdrop = document.getElementById('dashDrawerBackdrop');

    function closeDashDrawer() {
      if (!drawer || !backdrop) return;
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
    }

    if (openDrawerBtn && drawer && backdrop) {
      openDrawerBtn.addEventListener('click', function () {
        drawer.classList.add('is-open');
        backdrop.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('drawer-open');
      });
      if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDashDrawer);
      backdrop.addEventListener('click', closeDashDrawer);
    }

    document.querySelectorAll('[data-dash-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchSection(btn.getAttribute('data-dash-nav'));
        closeDashDrawer();
      });
    });

    // Create Shopping List Form
    var createListForm = document.getElementById('dashCreateListForm');
    if (createListForm) {
      createListForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = document.getElementById('dashNewListName');
        var name = String(inp.value || '').trim();
        if (!name) return;
        var created = store.createList(name);
        if (created) {
          selectedListId = created.id;
          inp.value = '';
          renderLists();
          store.showToast('Created list "' + created.name + '"');
        }
      });
    }

    // Add Address Form
    var addrForm = document.getElementById('dashAddressForm');
    if (addrForm) {
      addrForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var pin = String(document.getElementById('addrPin').value || '').trim();
        if (!/^\d{6}$/.test(pin)) {
          store.showToast('Enter a valid 6-digit PIN code.');
          return;
        }
        store.saveAddress({
          label: String(document.getElementById('addrLabel').value || '').trim() || 'Saved Address',
          recipient: String(document.getElementById('addrRecipient').value || '').trim(),
          phone: String(document.getElementById('addrPhone').value || '').trim(),
          line1: String(document.getElementById('addrLine1').value || '').trim(),
          area: String(document.getElementById('addrArea').value || '').trim(),
          pin: pin,
          isDefault: document.getElementById('addrDefault').checked
        });
        addrForm.reset();
        store.showToast('Delivery address saved.');
      });
    }

    // Profile Form
    var profForm = document.getElementById('dashProfileForm');
    if (profForm) {
      profForm.addEventListener('submit', function (e) {
        e.preventDefault();
        store.saveProfile({
          name: String(document.getElementById('profName').value || '').trim(),
          email: String(document.getElementById('profEmail').value || '').trim(),
          phone: String(document.getElementById('profPhone').value || '').trim(),
          preferredSlot: document.getElementById('profSlot').value,
          substitutionPref: document.getElementById('profSub').value
        });
        store.showToast('Local profile preferences saved.');
      });
    }

    // Clear Local Data button
    var clearAllBtn = document.getElementById('dashClearLocalData');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function () {
        store.clearAllLocalData();
        populateProfileForm();
        store.showToast('Cleared all local shopping lists, cart, orders, and addresses.');
      });
    }

    // Delegated clicks inside main dashboard
    document.querySelector('.dash-main').addEventListener('click', function (e) {
      var jump = e.target.closest('.js-jump-sec');
      if (jump) {
        switchSection(jump.getAttribute('data-target'));
        return;
      }
      var openList = e.target.closest('.js-open-specific-list');
      if (openList) {
        selectedListId = openList.getAttribute('data-list-id');
        switchSection('lists');
        renderLists();
        return;
      }
      var selList = e.target.closest('[data-select-list]');
      if (selList) {
        selectedListId = selList.getAttribute('data-select-list');
        renderLists();
        return;
      }
      var listInc = e.target.closest('.js-list-inc');
      if (listInc && selectedListId) {
        var lists = store.getLists();
        var active = lists.find(function (l) { return l.id === selectedListId; });
        var it = active && active.items.find(function (x) { return x.productId === listInc.getAttribute('data-id') && x.pack === listInc.getAttribute('data-pack'); });
        if (it) store.setListItemQty(selectedListId, it.productId, it.pack, it.qty + 1);
        return;
      }
      var listDec = e.target.closest('.js-list-dec');
      if (listDec && selectedListId) {
        var listsD = store.getLists();
        var activeD = listsD.find(function (l) { return l.id === selectedListId; });
        var itD = activeD && activeD.items.find(function (x) { return x.productId === listDec.getAttribute('data-id') && x.pack === listDec.getAttribute('data-pack'); });
        if (itD) store.setListItemQty(selectedListId, itD.productId, itD.pack, itD.qty - 1);
        return;
      }
      var listRem = e.target.closest('.js-list-rem');
      if (listRem && selectedListId) {
        store.removeListItem(selectedListId, listRem.getAttribute('data-id'), listRem.getAttribute('data-pack'));
        return;
      }
      var dcInc = e.target.closest('.js-dashcart-inc');
      if (dcInc) {
        var pid = dcInc.getAttribute('data-id');
        var pk = dcInc.getAttribute('data-pack');
        store.setCartQty(pid, pk, store.getItemQtyInCart(pid, pk) + 1);
        return;
      }
      var dcDec = e.target.closest('.js-dashcart-dec');
      if (dcDec) {
        var pid2 = dcDec.getAttribute('data-id');
        var pk2 = dcDec.getAttribute('data-pack');
        store.setCartQty(pid2, pk2, store.getItemQtyInCart(pid2, pk2) - 1);
        return;
      }
      var togDet = e.target.closest('.js-dash-toggle-details');
      if (togDet) {
        var oid = togDet.getAttribute('data-order-id');
        var drawerEl = document.getElementById('ord-det-' + oid);
        if (drawerEl) drawerEl.hidden = !drawerEl.hidden;
        return;
      }
      var trackBtn = e.target.closest('.js-dash-track');
      if (trackBtn) {
        selectedOrderId = trackBtn.getAttribute('data-order-id');
        switchSection('track');
        renderTracker();
        return;
      }
      var reorderBtn = e.target.closest('.js-dash-reorder');
      if (reorderBtn) {
        var res = store.reorderToCart(reorderBtn.getAttribute('data-order-id'));
        var msg = 'Added ' + res.added + ' items to cart using current catalogue prices.';
        if (res.skipped.length) msg += ' Unavailable skipped: ' + res.skipped.join(', ');
        store.showToast(msg);
        return;
      }
      var dlBtn = e.target.closest('.js-dash-download');
      if (dlBtn) {
        var ordObj = store.getOrders().find(function (o) { return o.id === dlBtn.getAttribute('data-order-id'); });
        if (ordObj) downloadOrderTxt(ordObj);
        return;
      }
      var delAddr = e.target.closest('.js-del-addr');
      if (delAddr) {
        store.deleteAddress(delAddr.getAttribute('data-addr-id'));
        store.showToast('Address removed.');
      }
    });

    document.querySelector('.dash-main').addEventListener('change', function (e) {
      var chk = e.target.closest('.js-list-check');
      if (chk && selectedListId) {
        store.toggleListItemChecked(selectedListId, chk.getAttribute('data-id'), chk.getAttribute('data-pack'), chk.checked);
      }
    });

    global.addEventListener('freshaisle:statechange', renderAll);
  });
})(window);
