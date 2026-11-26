/**
 * FreshAisle — Frontend Checkout & Demo Order Placement (pages/checkout.html)
 */
(function (global) {
  'use strict';

  var cfg = global.FRESHAISLE_CONFIG;
  var store = global.FRESHAISLE_STORE;
  var ui = global.FreshAisleUI;
  if (!cfg || !store || !ui) return;

  var orderLocked = false;

  function todayIsoLocal() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function populateSelects() {
    var slotSel = document.getElementById('coSlot');
    var subSel = document.getElementById('coSubstitution');
    if (slotSel) {
      slotSel.innerHTML = cfg.delivery.slots.map(function (s) {
        return '<option value="' + ui.escapeHtml(s.label) + '">' + ui.escapeHtml(s.label) + '</option>';
      }).join('');
      ui.refreshSelect(slotSel);
    }
    if (subSel) {
      subSel.innerHTML = cfg.delivery.substitutionOptions.map(function (s) {
        return '<option value="' + ui.escapeHtml(s.label) + '">' + ui.escapeHtml(s.label) + '</option>';
      }).join('');
      ui.refreshSelect(subSel);
    }
  }

  function prefillFromStore() {
    var profile = store.getProfile();
    var addresses = store.getAddresses();
    var defAddr = addresses.find(function (a) { return a.isDefault; }) || addresses[0];

    var nameEl = document.getElementById('coName');
    var phoneEl = document.getElementById('coPhone');
    var addrEl = document.getElementById('coAddress');
    var pinEl = document.getElementById('coPin');
    var dateEl = document.getElementById('coDate');

    if (nameEl && !nameEl.value) nameEl.value = (defAddr && defAddr.recipient) || profile.name || '';
    if (phoneEl && !phoneEl.value) phoneEl.value = (defAddr && defAddr.phone) || profile.phone || '';
    if (addrEl && !addrEl.value && defAddr) {
      addrEl.value = [defAddr.line1, defAddr.area].filter(Boolean).join(', ');
    }
    if (pinEl && !pinEl.value && defAddr) pinEl.value = defAddr.pin || '';

    if (dateEl) {
      var minDate = todayIsoLocal();
      dateEl.setAttribute('min', minDate);
      if (!dateEl.value || dateEl.value < minDate) {
        dateEl.value = minDate;
      }
    }
  }

  function renderSummary() {
    var emptyEl = document.getElementById('checkoutEmptyState');
    var layoutEl = document.getElementById('checkoutLayout');
    var successEl = document.getElementById('checkoutSuccessState');
    if (!layoutEl || !emptyEl) return;
    if (successEl && !successEl.hidden) return;

    var summary = store.getCartSummary();
    if (!summary.items.length) {
      layoutEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }

    layoutEl.hidden = false;
    emptyEl.hidden = true;

    var itemsBox = document.getElementById('coSummaryItems');
    if (itemsBox) {
      itemsBox.innerHTML = summary.items.map(function (it) {
        return (
          '<div class="summary-row">' +
            '<span>' + ui.escapeHtml(it.product.name) + ' (' + ui.escapeHtml(it.pack) + ') &times; ' + it.qty + '</span>' +
            '<strong>' + ui.escapeHtml(cfg.formatINR(it.lineTotalPaise)) + '</strong>' +
          '</div>'
        );
      }).join('');
    }

    document.getElementById('coSubtotal').textContent = cfg.formatINR(summary.subtotalPaise);
    document.getElementById('coSavings').textContent = '-' + cfg.formatINR(summary.totalSavingsPaise);
    document.getElementById('coDeliveryFee').textContent = summary.deliveryFeePaise === 0 ? 'Free' : cfg.formatINR(summary.deliveryFeePaise);
    document.getElementById('coGrandTotal').textContent = cfg.formatINR(summary.totalPaise);
  }

  function setError(inputId, msg) {
    var el = document.getElementById(inputId);
    if (!el) return;
    var field = el.closest('.form-field');
    var err = field ? field.querySelector('.form-error') : null;
    if (field) field.classList.toggle('has-error', Boolean(msg));
    if (err) err.textContent = msg || '';
  }

  function validateForm() {
    var name = String(document.getElementById('coName').value || '').trim();
    var phone = String(document.getElementById('coPhone').value || '').trim().replace(/\s+/g, '');
    var address = String(document.getElementById('coAddress').value || '').trim();
    var pin = String(document.getElementById('coPin').value || '').trim();
    var date = String(document.getElementById('coDate').value || '').trim();
    var slot = String(document.getElementById('coSlot').value || '').trim();
    var sub = String(document.getElementById('coSubstitution').value || '').trim();
    var instructions = String(document.getElementById('coInstructions').value || '').trim();

    var valid = true;

    if (name.length < 2) {
      setError('coName', 'Please enter your full name.');
      valid = false;
    } else setError('coName', '');

    if (!/^\d{10}$/.test(phone)) {
      setError('coPhone', 'Enter a valid 10-digit mobile number.');
      valid = false;
    } else setError('coPhone', '');

    if (address.length < 8) {
      setError('coAddress', 'Enter a complete flat, street, and locality address.');
      valid = false;
    } else setError('coAddress', '');

    if (!/^\d{6}$/.test(pin)) {
      setError('coPin', 'Enter a valid 6-digit PIN code.');
      valid = false;
    } else setError('coPin', '');

    var today = todayIsoLocal();
    if (!date || date < today) {
      setError('coDate', 'Please select today or a future delivery date.');
      valid = false;
    } else setError('coDate', '');

    return valid ? {
      name: name,
      phone: phone,
      address: address,
      pin: pin,
      deliveryDate: date,
      deliverySlot: slot,
      substitution: sub,
      instructions: instructions
    } : null;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.getAttribute('data-page') !== 'checkout') return;
    populateSelects();
    prefillFromStore();
    renderSummary();

    var reviewBtn = document.getElementById('coReviewBtn');
    var editBtn = document.getElementById('coEditBtn');
    var placeBtn = document.getElementById('coPlaceOrderBtn');
    var formPanel = document.getElementById('coFormCard');
    var reviewPanel = document.getElementById('coReviewCard');
    var reviewDetails = document.getElementById('coReviewDetails');

    var validatedPayload = null;

    if (reviewBtn) {
      reviewBtn.addEventListener('click', function () {
        var summary = store.getCartSummary();
        if (!summary.meetsMinOrder) {
          store.showToast('Minimum illustrative order value is ' + cfg.formatINR(cfg.delivery.minOrderPaise));
          return;
        }
        var data = validateForm();
        if (!data) return;
        validatedPayload = data;

        reviewDetails.innerHTML =
          '<div><strong>Recipient:</strong> ' + ui.escapeHtml(data.name) + ' (' + ui.escapeHtml(data.phone) + ')</div>' +
          '<div><strong>Address:</strong> ' + ui.escapeHtml(data.address) + ' — PIN ' + ui.escapeHtml(data.pin) + '</div>' +
          '<div><strong>Delivery Window:</strong> ' + ui.escapeHtml(data.deliveryDate) + ' · ' + ui.escapeHtml(data.deliverySlot) + '</div>' +
          '<div><strong>Substitutions:</strong> ' + ui.escapeHtml(data.substitution) + '</div>' +
          (data.instructions ? '<div><strong>Instructions:</strong> ' + ui.escapeHtml(data.instructions) + '</div>' : '');

        formPanel.hidden = true;
        reviewPanel.hidden = false;
        reviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', function () {
        reviewPanel.hidden = true;
        formPanel.hidden = false;
      });
    }

    if (placeBtn) {
      placeBtn.addEventListener('click', function () {
        if (orderLocked) return;
        var data = validatedPayload || validateForm();
        if (!data) return;

        orderLocked = true;
        placeBtn.disabled = true;
        var created = store.createOrder(data);
        if (!created) {
          orderLocked = false;
          placeBtn.disabled = false;
          store.showToast('Your cart is empty.');
          return;
        }

        document.getElementById('checkoutLayout').hidden = true;
        var successEl = document.getElementById('checkoutSuccessState');
        successEl.hidden = false;
        document.getElementById('coSuccessOrderId').textContent = created.id;
        document.getElementById('coSuccessStatus').textContent = created.status;
        document.getElementById('coSuccessSlot').textContent = created.deliveryDate + ' · ' + created.deliverySlot;
        document.getElementById('coSuccessTotal').textContent = cfg.formatINR(created.totalPaise);
        document.getElementById('coTrackLink').href = cfg.resolvePath('pages/dashboard.html') + '#track?order=' + encodeURIComponent(created.id);
        successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    global.addEventListener('freshaisle:statechange', renderSummary);
  });
})(window);
