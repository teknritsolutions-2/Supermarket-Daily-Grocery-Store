/**
 * FreshAisle — Shopping Cart Page Controller (pages/cart.html)
 */
(function (global) {
  'use strict';

  var cfg = global.FRESHAISLE_CONFIG;
  var store = global.FRESHAISLE_STORE;
  var ui = global.FreshAisleUI;
  if (!cfg || !store || !ui) return;

  function renderCartPage() {
    var listEl = document.getElementById('cartItemsContainer');
    var emptyEl = document.getElementById('cartEmptyState');
    var layoutEl = document.getElementById('cartLayout');
    if (!listEl || !emptyEl || !layoutEl) return;

    var summary = store.getCartSummary();
    if (!summary.items.length) {
      layoutEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }

    layoutEl.hidden = false;
    emptyEl.hidden = true;

    listEl.innerHTML = summary.items.map(function (item, idx) {
      var prod = item.product;
      var variantSelectHtml = '';
      if (prod.variants && prod.variants.length > 1) {
        variantSelectHtml =
          '<div class="cart-row__variant-wrap">' +
            '<label for="cart-var-' + idx + '" class="sr-only">Pack size for ' + ui.escapeHtml(prod.name) + '</label>' +
            '<select id="cart-var-' + idx + '" data-v-select class="js-cart-variant" data-product-id="' + ui.escapeHtml(prod.id) + '" data-old-pack="' + ui.escapeHtml(item.pack) + '">' +
              prod.variants.map(function (v) {
                var sel = v.pack === item.pack ? ' selected' : '';
                return '<option value="' + ui.escapeHtml(v.pack) + '"' + sel + '>' + ui.escapeHtml(v.pack) + '</option>';
              }).join('') +
            '</select>' +
          '</div>';
      } else {
        variantSelectHtml = '<p class="cart-row__unit">' + ui.escapeHtml(item.pack) + '</p>';
      }

      return (
        '<div class="cart-row" data-cart-row="' + ui.escapeHtml(prod.id) + '">' +
          '<img class="cart-row__img" src="' + ui.escapeHtml(cfg.resolvePath(prod.image)) + '" alt="' + ui.escapeHtml(prod.alt || prod.name) + '" width="96" height="76">' +
          '<div class="cart-row__info">' +
            '<h3 class="cart-row__title">' + ui.escapeHtml(prod.name) + '</h3>' +
            '<p class="cart-row__unit">' +
              ui.escapeHtml(cfg.formatINR(item.unitPricePaise)) + ' / ' + ui.escapeHtml(item.pack) +
              (item.lineSavingsPaise > 0 ? ' <span class="product-card__mrp">' + ui.escapeHtml(cfg.formatINR(item.regularUnitPaise)) + '</span>' : '') +
            '</p>' +
            variantSelectHtml +
          '</div>' +
          '<div class="cart-row__end">' +
            '<div class="qty-stepper qty-stepper--lg">' +
              '<button type="button" class="qty-stepper__btn js-cart-dec" data-id="' + ui.escapeHtml(prod.id) + '" data-pack="' + ui.escapeHtml(item.pack) + '" aria-label="Decrease quantity of ' + ui.escapeHtml(prod.name) + '">&minus;</button>' +
              '<span class="qty-stepper__val">' + item.qty + '</span>' +
              '<button type="button" class="qty-stepper__btn js-cart-inc" data-id="' + ui.escapeHtml(prod.id) + '" data-pack="' + ui.escapeHtml(item.pack) + '" aria-label="Increase quantity of ' + ui.escapeHtml(prod.name) + '">+</button>' +
            '</div>' +
            '<div class="cart-row__price-col">' +
              '<div class="cart-row__total">' + ui.escapeHtml(cfg.formatINR(item.lineTotalPaise)) + '</div>' +
              '<button type="button" class="cart-row__remove js-cart-remove" data-id="' + ui.escapeHtml(prod.id) + '" data-pack="' + ui.escapeHtml(item.pack) + '">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    ui.initCustomSelects(listEl);

    listEl.querySelectorAll('.js-cart-variant').forEach(function (sel) {
      sel.addEventListener('change', function () {
        store.changeCartVariant(sel.getAttribute('data-product-id'), sel.getAttribute('data-old-pack'), sel.value);
      });
    });

    var regularEl = document.getElementById('cartRegularSubtotal');
    var savingsEl = document.getElementById('cartTotalSavings');
    var subtotalEl = document.getElementById('cartSubtotal');
    var deliveryEl = document.getElementById('cartDeliveryFee');
    var totalEl = document.getElementById('cartGrandTotal');
    var meterText = document.getElementById('cartDeliveryMeterText');
    var meterFill = document.getElementById('cartDeliveryMeterFill');
    var minWarn = document.getElementById('cartMinOrderNotice');
    var checkoutBtn = document.getElementById('cartCheckoutBtn');

    if (regularEl) regularEl.textContent = cfg.formatINR(summary.regularSubtotalPaise);
    if (savingsEl) savingsEl.textContent = '-' + cfg.formatINR(summary.totalSavingsPaise);
    if (subtotalEl) subtotalEl.textContent = cfg.formatINR(summary.subtotalPaise);
    if (deliveryEl) deliveryEl.textContent = summary.deliveryFeePaise === 0 ? 'Free' : cfg.formatINR(summary.deliveryFeePaise);
    if (totalEl) totalEl.textContent = cfg.formatINR(summary.totalPaise);

    if (meterText && meterFill) {
      var pct = Math.min(100, Math.round((summary.subtotalPaise / cfg.delivery.freeThresholdPaise) * 100));
      meterFill.style.width = pct + '%';
      if (summary.freeDeliveryRemainingPaise === 0) {
        meterText.textContent = 'Your basket qualifies for complimentary delivery (orders over ' + cfg.formatINR(cfg.delivery.freeThresholdPaise) + ').';
      } else {
        meterText.textContent = 'Add ' + cfg.formatINR(summary.freeDeliveryRemainingPaise) + ' more to unlock complimentary delivery over ' + cfg.formatINR(cfg.delivery.freeThresholdPaise) + '.';
      }
    }

    if (minWarn) {
      minWarn.hidden = summary.meetsMinOrder;
      minWarn.textContent = 'Minimum order value for home delivery is ' + cfg.formatINR(cfg.delivery.minOrderPaise) + '.';
    }
    if (checkoutBtn) {
      checkoutBtn.setAttribute('aria-disabled', String(!summary.meetsMinOrder));
      checkoutBtn.classList.toggle('is-disabled', !summary.meetsMinOrder);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.getAttribute('data-page') !== 'cart') return;
    renderCartPage();

    document.getElementById('cartItemsContainer').addEventListener('click', function (e) {
      var inc = e.target.closest('.js-cart-inc');
      if (inc) {
        var id = inc.getAttribute('data-id');
        var pack = inc.getAttribute('data-pack');
        store.setCartQty(id, pack, store.getItemQtyInCart(id, pack) + 1);
        return;
      }
      var dec = e.target.closest('.js-cart-dec');
      if (dec) {
        var id2 = dec.getAttribute('data-id');
        var pack2 = dec.getAttribute('data-pack');
        store.setCartQty(id2, pack2, store.getItemQtyInCart(id2, pack2) - 1);
        return;
      }
      var rem = e.target.closest('.js-cart-remove');
      if (rem) {
        store.removeFromCart(rem.getAttribute('data-id'), rem.getAttribute('data-pack'));
      }
    });

    var clearBtn = document.getElementById('cartClearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        store.clearCart();
      });
    }

    var checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function (e) {
        var summary = store.getCartSummary();
        if (!summary.meetsMinOrder) {
          e.preventDefault();
          store.showToast('Add at least ' + cfg.formatINR(cfg.delivery.minOrderPaise) + ' to proceed to checkout.');
        }
      });
    }

    global.addEventListener('freshaisle:statechange', renderCartPage);
  });
})(window);
