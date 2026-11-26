/**
 * FreshAisle — Persistent Frontend State Store (Cart, Shopping Lists, Orders, Addresses, Profile)
 * All money math uses integer paise.
 */
(function (global) {
  'use strict';

  var cfg = global.FRESHAISLE_CONFIG;
  var cat = global.FRESHAISLE_CATALOGUE;

  function readJSON(key, fallback) {
    try {
      var raw = global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* ignore quota or private mode failures */
    }
  }

  function notifyChange(scope) {
    updateCartBadges();
    try {
      global.dispatchEvent(new CustomEvent('freshaisle:statechange', { detail: { scope: scope || 'all' } }));
    } catch (e) {
      /* fallback ignored */
    }
  }

  /* --------------------------------------------------------------------------
     Seed Initial Demo Shopping Lists, Address & Order (once per browser)
     -------------------------------------------------------------------------- */
  function seedIfEmpty() {
    var lists = readJSON(cfg.storageKeys.lists, null);
    if (lists === null) {
      var initialLists = [
        {
          id: 'list-weekly',
          name: 'Weekly Groceries',
          createdAt: '2026-11-20T09:00:00Z',
          items: [
            { productId: 'fr-apples', pack: '1 kg', qty: 1, checked: false },
            { productId: 'vg-tomatoes', pack: '1 kg', qty: 1, checked: false },
            { productId: 'vg-onions', pack: '1 kg', qty: 1, checked: false },
            { productId: 'da-milk', pack: '1 L', qty: 2, checked: false },
            { productId: 'da-paneer', pack: '200 g', qty: 1, checked: true }
          ]
        },
        {
          id: 'list-breakfast',
          name: 'Breakfast Essentials',
          createdAt: '2026-11-22T08:30:00Z',
          items: [
            { productId: 'bk-whole-wheat-bread', pack: '400 g', qty: 1, checked: false },
            { productId: 'da-eggs', pack: '12 pcs', qty: 1, checked: false },
            { productId: 'fr-bananas', pack: '6 pcs', qty: 1, checked: false },
            { productId: 'sb-tea', pack: '250 g', qty: 1, checked: false }
          ]
        }
      ];
      writeJSON(cfg.storageKeys.lists, initialLists);
    }

    var addresses = readJSON(cfg.storageKeys.addresses, null);
    if (addresses === null) {
      writeJSON(cfg.storageKeys.addresses, [
        {
          id: 'addr-demo-home',
          label: 'Home',
          recipient: 'Ananya Rao',
          phone: '9876543210',
          line1: 'Flat 304, Oakridge Residency, 12th Main',
          area: 'Indiranagar, Bengaluru',
          pin: '560038',
          isDefault: true
        }
      ]);
    }

    var profile = readJSON(cfg.storageKeys.profile, null);
    if (profile === null) {
      writeJSON(cfg.storageKeys.profile, {
        name: 'Ananya Rao',
        email: 'ananya.rao@example.com',
        phone: '9876543210',
        preferredSlot: cfg.delivery.slots[1].id,
        substitutionPref: cfg.delivery.substitutionOptions[0].id
      });
    }

    var orders = readJSON(cfg.storageKeys.orders, null);
    if (orders === null) {
      writeJSON(cfg.storageKeys.orders, [
        {
          id: 'FA-20261124-4082',
          createdAt: '2026-11-24T10:15:00Z',
          isSample: true,
          stageIndex: 4,
          status: cfg.orderStages[4],
          customer: {
            name: 'Ananya Rao',
            phone: '9876543210',
            address: 'Flat 304, Oakridge Residency, 12th Main, Indiranagar, Bengaluru',
            pin: '560038'
          },
          deliveryDate: '2026-11-24',
          deliverySlot: '09:30 AM – 12:00 PM (Mid-Morning)',
          substitution: 'Call before substituting unavailable items',
          instructions: 'Leave neatly by the front door mat.',
          items: [
            { productId: 'pa-rice', name: 'Aged Basmati Rice', pack: '5 kg', qty: 1, unitPricePaise: 54900, regularPricePaise: 64000, image: 'assets/images/pantry/rice.jpg' },
            { productId: 'da-milk', name: 'Full Cream Fresh Milk', pack: '1 L', qty: 2, unitPricePaise: 6800, regularPricePaise: 6800, image: 'assets/images/dairy/milk.jpg' },
            { productId: 'vg-tomatoes', name: 'Vine Tomatoes', pack: '1 kg', qty: 1, unitPricePaise: 4200, regularPricePaise: 5200, image: 'assets/images/vegetables/tomatoes.jpg' }
          ],
          regularSubtotalPaise: 82800,
          subtotalPaise: 72700,
          savingsPaise: 10100,
          deliveryFeePaise: 0,
          totalPaise: 72700
        }
      ]);
    }
  }

  /* --------------------------------------------------------------------------
     Cart Operations
     -------------------------------------------------------------------------- */
  function getCartRaw() {
    var raw = readJSON(cfg.storageKeys.cart, []);
    return Array.isArray(raw) ? raw : [];
  }

  function saveCartRaw(items) {
    writeJSON(cfg.storageKeys.cart, items);
    notifyChange('cart');
  }

  function addToCart(productId, pack, qty) {
    var prod = cat.getProductById(productId);
    if (!prod) return null;
    var variant = cat.getVariant(prod, pack || prod.pack);
    var resolvedPack = variant ? variant.pack : prod.pack;
    var addQty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));

    var cart = getCartRaw();
    var found = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId && cart[i].pack === resolvedPack) {
        found = cart[i];
        break;
      }
    }
    if (found) {
      found.qty = Math.min(99, found.qty + addQty);
    } else {
      cart.push({ productId: productId, pack: resolvedPack, qty: addQty });
    }
    saveCartRaw(cart);
    return getCartSummary();
  }

  function setCartQty(productId, pack, qty) {
    var nextQty = parseInt(qty, 10);
    var cart = getCartRaw();
    var out = [];
    cart.forEach(function (item) {
      if (item.productId === productId && item.pack === pack) {
        if (nextQty > 0) {
          out.push({ productId: item.productId, pack: item.pack, qty: Math.min(99, nextQty) });
        }
      } else {
        out.push(item);
      }
    });
    saveCartRaw(out);
    return getCartSummary();
  }

  function changeCartVariant(productId, oldPack, newPack) {
    var prod = cat.getProductById(productId);
    if (!prod || oldPack === newPack) return getCartSummary();
    var variant = cat.getVariant(prod, newPack);
    if (!variant) return getCartSummary();

    var cart = getCartRaw();
    var movingQty = 0;
    var remaining = [];
    cart.forEach(function (item) {
      if (item.productId === productId && item.pack === oldPack) {
        movingQty += item.qty;
      } else {
        remaining.push(item);
      }
    });
    if (movingQty > 0) {
      var merged = false;
      remaining.forEach(function (item) {
        if (item.productId === productId && item.pack === variant.pack) {
          item.qty = Math.min(99, item.qty + movingQty);
          merged = true;
        }
      });
      if (!merged) {
        remaining.push({ productId: productId, pack: variant.pack, qty: movingQty });
      }
      saveCartRaw(remaining);
    }
    return getCartSummary();
  }

  function removeFromCart(productId, pack) {
    return setCartQty(productId, pack, 0);
  }

  function clearCart() {
    saveCartRaw([]);
  }

  function getItemQtyInCart(productId, pack) {
    var cart = getCartRaw();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId && (!pack || cart[i].pack === pack)) {
        return cart[i].qty;
      }
    }
    return 0;
  }

  function getCartSummary() {
    var raw = getCartRaw();
    var items = [];
    var totalUnits = 0;
    var regularSubtotalPaise = 0;
    var subtotalPaise = 0;

    raw.forEach(function (entry) {
      var prod = cat.getProductById(entry.productId);
      if (!prod) return;
      var variant = cat.getVariant(prod, entry.pack);
      var pack = variant ? variant.pack : prod.pack;
      var qty = Math.max(1, parseInt(entry.qty, 10) || 1);
      var regularUnit = cat.getBasePricePaise(prod, pack);
      var effectiveUnit = cat.getEffectivePricePaise(prod, pack);
      var lineRegular = regularUnit * qty;
      var lineTotal = effectiveUnit * qty;

      totalUnits += qty;
      regularSubtotalPaise += lineRegular;
      subtotalPaise += lineTotal;

      items.push({
        productId: prod.id,
        product: prod,
        pack: pack,
        qty: qty,
        regularUnitPaise: regularUnit,
        unitPricePaise: effectiveUnit,
        lineRegularPaise: lineRegular,
        lineTotalPaise: lineTotal,
        lineSavingsPaise: Math.max(0, lineRegular - lineTotal)
      });
    });

    var totalSavingsPaise = Math.max(0, regularSubtotalPaise - subtotalPaise);
    var deliveryFeePaise = 0;
    if (items.length > 0 && subtotalPaise < cfg.delivery.freeThresholdPaise) {
      deliveryFeePaise = cfg.delivery.standardFeePaise;
    }
    var freeRemaining = items.length > 0
      ? Math.max(0, cfg.delivery.freeThresholdPaise - subtotalPaise)
      : cfg.delivery.freeThresholdPaise;

    return {
      items: items,
      distinctCount: items.length,
      totalUnits: totalUnits,
      regularSubtotalPaise: regularSubtotalPaise,
      subtotalPaise: subtotalPaise,
      totalSavingsPaise: totalSavingsPaise,
      deliveryFeePaise: deliveryFeePaise,
      totalPaise: subtotalPaise + deliveryFeePaise,
      freeDeliveryRemainingPaise: freeRemaining,
      meetsMinOrder: subtotalPaise >= cfg.delivery.minOrderPaise
    };
  }

  /* --------------------------------------------------------------------------
     Shopping Lists Operations
     -------------------------------------------------------------------------- */
  function getLists() {
    seedIfEmpty();
    var lists = readJSON(cfg.storageKeys.lists, []);
    return Array.isArray(lists) ? lists : [];
  }

  function saveLists(lists) {
    writeJSON(cfg.storageKeys.lists, lists);
    notifyChange('lists');
  }

  function createList(name) {
    var clean = String(name || '').trim();
    if (!clean) return null;
    var lists = getLists();
    var newList = {
      id: 'list-' + Date.now(),
      name: clean,
      createdAt: new Date().toISOString(),
      items: []
    };
    lists.unshift(newList);
    saveLists(lists);
    return newList;
  }

  function renameList(listId, newName) {
    var clean = String(newName || '').trim();
    if (!clean) return false;
    var lists = getLists();
    var updated = false;
    lists.forEach(function (l) {
      if (l.id === listId) {
        l.name = clean;
        updated = true;
      }
    });
    if (updated) saveLists(lists);
    return updated;
  }

  function deleteList(listId) {
    var lists = getLists().filter(function (l) {
      return l.id !== listId;
    });
    saveLists(lists);
  }

  function addListItem(listId, productId, pack, qty) {
    var prod = cat.getProductById(productId);
    if (!prod) return false;
    var variant = cat.getVariant(prod, pack || prod.pack);
    var resolvedPack = variant ? variant.pack : prod.pack;
    var addQty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));

    var lists = getLists();
    var target = null;
    lists.forEach(function (l) {
      if (l.id === listId) target = l;
    });
    if (!target) {
      if (!lists.length) {
        target = { id: 'list-' + Date.now(), name: 'Weekly Groceries', createdAt: new Date().toISOString(), items: [] };
        lists.push(target);
      } else {
        target = lists[0];
      }
    }

    var existing = null;
    target.items.forEach(function (it) {
      if (it.productId === productId && it.pack === resolvedPack) existing = it;
    });
    if (existing) {
      existing.qty = Math.min(99, existing.qty + addQty);
    } else {
      target.items.push({ productId: productId, pack: resolvedPack, qty: addQty, checked: false });
    }
    saveLists(lists);
    return target;
  }

  function setListItemQty(listId, productId, pack, qty) {
    var nextQty = parseInt(qty, 10);
    var lists = getLists();
    lists.forEach(function (l) {
      if (l.id !== listId) return;
      if (nextQty <= 0) {
        l.items = l.items.filter(function (it) {
          return !(it.productId === productId && it.pack === pack);
        });
      } else {
        l.items.forEach(function (it) {
          if (it.productId === productId && it.pack === pack) {
            it.qty = Math.min(99, nextQty);
          }
        });
      }
    });
    saveLists(lists);
  }

  function toggleListItemChecked(listId, productId, pack, forceState) {
    var lists = getLists();
    lists.forEach(function (l) {
      if (l.id !== listId) return;
      l.items.forEach(function (it) {
        if (it.productId === productId && it.pack === pack) {
          it.checked = typeof forceState === 'boolean' ? forceState : !it.checked;
        }
      });
    });
    saveLists(lists);
  }

  function removeListItem(listId, productId, pack) {
    setListItemQty(listId, productId, pack, 0);
  }

  function transferListToCart(listId, onlyChecked) {
    var lists = getLists();
    var target = null;
    lists.forEach(function (l) {
      if (l.id === listId) target = l;
    });
    if (!target) return { addedCount: 0 };

    var itemsToTransfer = target.items.filter(function (it) {
      return onlyChecked ? Boolean(it.checked) : true;
    });

    if (!itemsToTransfer.length) return { addedCount: 0 };

    var cart = getCartRaw();
    var addedCount = 0;

    itemsToTransfer.forEach(function (it) {
      var prod = cat.getProductById(it.productId);
      if (!prod) return;
      var variant = cat.getVariant(prod, it.pack);
      var pack = variant ? variant.pack : prod.pack;
      var qty = Math.max(1, parseInt(it.qty, 10) || 1);
      var found = null;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === prod.id && cart[i].pack === pack) {
          found = cart[i];
          break;
        }
      }
      if (found) {
        found.qty = Math.min(99, found.qty + qty);
      } else {
        cart.push({ productId: prod.id, pack: pack, qty: qty });
      }
      addedCount += 1;
    });

    saveCartRaw(cart);
    return { addedCount: addedCount };
  }

  /* --------------------------------------------------------------------------
     Orders, Tracking & Reorder
     -------------------------------------------------------------------------- */
  function getOrders() {
    seedIfEmpty();
    var orders = readJSON(cfg.storageKeys.orders, []);
    return Array.isArray(orders) ? orders : [];
  }

  function saveOrders(orders) {
    writeJSON(cfg.storageKeys.orders, orders);
    notifyChange('orders');
  }

  function createOrder(details) {
    var summary = getCartSummary();
    if (!summary.items.length) return null;

    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    var rand = String(Math.floor(1000 + Math.random() * 9000));
    var orderId = 'FA-' + y + m + d + '-' + rand;

    var snapshotItems = summary.items.map(function (it) {
      return {
        productId: it.productId,
        name: it.product.name,
        pack: it.pack,
        qty: it.qty,
        unitPricePaise: it.unitPricePaise,
        regularPricePaise: it.regularUnitPaise,
        image: it.product.image
      };
    });

    var order = {
      id: orderId,
      createdAt: now.toISOString(),
      isSample: false,
      stageIndex: 0,
      status: cfg.orderStages[0],
      customer: {
        name: details.name,
        phone: details.phone,
        address: details.address,
        pin: details.pin
      },
      deliveryDate: details.deliveryDate,
      deliverySlot: details.deliverySlot,
      substitution: details.substitution,
      instructions: details.instructions || '',
      items: snapshotItems,
      regularSubtotalPaise: summary.regularSubtotalPaise,
      subtotalPaise: summary.subtotalPaise,
      savingsPaise: summary.totalSavingsPaise,
      deliveryFeePaise: summary.deliveryFeePaise,
      totalPaise: summary.totalPaise
    };

    var orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    clearCart();
    return order;
  }

  function setOrderDemoStage(orderId, stageIndex) {
    var idx = Math.max(0, Math.min(cfg.orderStages.length - 1, parseInt(stageIndex, 10) || 0));
    var orders = getOrders();
    orders.forEach(function (ord) {
      if (ord.id === orderId) {
        ord.stageIndex = idx;
        ord.status = cfg.orderStages[idx];
      }
    });
    saveOrders(orders);
  }

  function reorderToCart(orderId) {
    var orders = getOrders();
    var target = null;
    orders.forEach(function (ord) {
      if (ord.id === orderId) target = ord;
    });
    if (!target) return { added: 0, skipped: [] };

    var cart = getCartRaw();
    var added = 0;
    var skipped = [];

    target.items.forEach(function (item) {
      var prod = cat.getProductById(item.productId);
      if (!prod) {
        skipped.push(item.name || item.productId);
        return;
      }
      var variant = cat.getVariant(prod, item.pack);
      var pack = variant ? variant.pack : prod.pack;
      var qty = Math.max(1, parseInt(item.qty, 10) || 1);

      var found = null;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === prod.id && cart[i].pack === pack) {
          found = cart[i];
          break;
        }
      }
      if (found) {
        found.qty = Math.min(99, found.qty + qty);
      } else {
        cart.push({ productId: prod.id, pack: pack, qty: qty });
      }
      added += 1;
    });

    saveCartRaw(cart);
    return { added: added, skipped: skipped };
  }

  /* --------------------------------------------------------------------------
     Addresses & Profile
     -------------------------------------------------------------------------- */
  function getAddresses() {
    seedIfEmpty();
    var list = readJSON(cfg.storageKeys.addresses, []);
    return Array.isArray(list) ? list : [];
  }

  function saveAddress(addr) {
    var list = getAddresses();
    if (addr.isDefault) {
      list.forEach(function (a) { a.isDefault = false; });
    }
    if (addr.id) {
      var replaced = false;
      list = list.map(function (a) {
        if (a.id === addr.id) {
          replaced = true;
          return addr;
        }
        return a;
      });
      if (!replaced) list.unshift(addr);
    } else {
      addr.id = 'addr-' + Date.now();
      if (!list.length) addr.isDefault = true;
      list.unshift(addr);
    }
    writeJSON(cfg.storageKeys.addresses, list);
    notifyChange('addresses');
    return addr;
  }

  function deleteAddress(id) {
    var list = getAddresses().filter(function (a) { return a.id !== id; });
    if (list.length && !list.some(function (a) { return a.isDefault; })) {
      list[0].isDefault = true;
    }
    writeJSON(cfg.storageKeys.addresses, list);
    notifyChange('addresses');
  }

  function getProfile() {
    seedIfEmpty();
    return readJSON(cfg.storageKeys.profile, {
      name: '',
      email: '',
      phone: '',
      preferredSlot: cfg.delivery.slots[0].id,
      substitutionPref: cfg.delivery.substitutionOptions[0].id
    });
  }

  function saveProfile(profile) {
    writeJSON(cfg.storageKeys.profile, profile);
    notifyChange('profile');
  }

  function clearAllLocalData() {
    Object.keys(cfg.storageKeys).forEach(function (k) {
      if (k === 'theme' || k === 'dir') return;
      try {
        global.localStorage.removeItem(cfg.storageKeys[k]);
      } catch (e) { /* ignore */ }
    });
    writeJSON(cfg.storageKeys.cart, []);
    writeJSON(cfg.storageKeys.lists, []);
    writeJSON(cfg.storageKeys.orders, []);
    writeJSON(cfg.storageKeys.addresses, []);
    writeJSON(cfg.storageKeys.profile, {
      name: '',
      email: '',
      phone: '',
      preferredSlot: cfg.delivery.slots[0].id,
      substitutionPref: cfg.delivery.substitutionOptions[0].id
    });
    notifyChange('all');
  }

  /* --------------------------------------------------------------------------
     Live Navbar Cart Badges & Toast
     -------------------------------------------------------------------------- */
  function updateCartBadges() {
    var summary = getCartSummary();
    document.querySelectorAll('.js-cart-count').forEach(function (el) {
      el.textContent = String(summary.totalUnits);
      el.classList.toggle('is-empty', summary.totalUnits === 0);
    });
  }

  function showToast(message) {
    var toast = document.getElementById('faToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'faToast';
      toast.className = 'fa-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  global.addEventListener('storage', function (e) {
    if (e.key && e.key.indexOf('freshaisle_') === 0) {
      notifyChange('storage');
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    seedIfEmpty();
    updateCartBadges();
  });

  global.FRESHAISLE_STORE = {
    getCartSummary: getCartSummary,
    getItemQtyInCart: getItemQtyInCart,
    addToCart: addToCart,
    setCartQty: setCartQty,
    changeCartVariant: changeCartVariant,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getLists: getLists,
    createList: createList,
    renameList: renameList,
    deleteList: deleteList,
    addListItem: addListItem,
    setListItemQty: setListItemQty,
    toggleListItemChecked: toggleListItemChecked,
    removeListItem: removeListItem,
    transferListToCart: transferListToCart,
    getOrders: getOrders,
    createOrder: createOrder,
    setOrderDemoStage: setOrderDemoStage,
    reorderToCart: reorderToCart,
    getAddresses: getAddresses,
    saveAddress: saveAddress,
    deleteAddress: deleteAddress,
    getProfile: getProfile,
    saveProfile: saveProfile,
    clearAllLocalData: clearAllLocalData,
    updateCartBadges: updateCartBadges,
    showToast: showToast
  };
})(window);
