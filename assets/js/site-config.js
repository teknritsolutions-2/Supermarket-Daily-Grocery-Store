/**
 * FreshAisle — Central Site Configuration & GitHub Pages Path Resolver
 * All delivery rules, PIN codes, offer window copy, and storage keys are configurable here.
 */
(function (global) {
  'use strict';

  function getSiteRoot() {
    var meta = document.querySelector('meta[name="site-root"]');
    return meta ? meta.getAttribute('content') || '.' : '.';
  }

  function resolvePath(relativePath) {
    if (!relativePath) return '';
    if (/^(https?:)?\/\//i.test(relativePath) || relativePath.indexOf('data:') === 0) {
      return relativePath;
    }
    var root = getSiteRoot().replace(/\/+$/, '');
    var clean = String(relativePath).replace(/^\/+/, '');
    return root + '/' + clean;
  }

  function formatINR(paise) {
    var num = Math.round(Number(paise || 0)) / 100;
    if (Number.isInteger(num)) {
      return '₹' + num.toLocaleString('en-IN');
    }
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  global.FRESHAISLE_CONFIG = {
    brandName: 'FreshAisle',
    currency: 'INR',
    currencySymbol: '₹',
    assetVersion: '20261126',
    storageKeys: {
      theme: 'freshaisle_theme',
      dir: 'freshaisle_dir',
      cart: 'freshaisle_cart_v1',
      lists: 'freshaisle_lists_v1',
      orders: 'freshaisle_orders_v1',
      addresses: 'freshaisle_addresses_v1',
      profile: 'freshaisle_profile_v1',
      checkoutDraft: 'freshaisle_checkout_draft_v1',
      authNote: 'freshaisle_auth_pref_v1'
    },
    offerPeriod: {
      label: 'Illustrative Weekly Savings Cycle',
      validityNote: 'Prices and weekly savings shown are illustrative store catalogue figures for demonstration.'
    },
    delivery: {
      minOrderPaise: 14900,
      freeThresholdPaise: 59900,
      standardFeePaise: 3500,
      note: 'Illustrative store delivery configuration — no live dispatch backend is connected.',
      slots: [
        { id: 'slot-morning-1', label: '07:00 AM – 09:00 AM (Early Morning)' },
        { id: 'slot-morning-2', label: '09:30 AM – 12:00 PM (Mid-Morning)' },
        { id: 'slot-afternoon', label: '01:00 PM – 04:00 PM (Afternoon)' },
        { id: 'slot-evening-1', label: '05:00 PM – 07:30 PM (Evening)' },
        { id: 'slot-evening-2', label: '08:00 PM – 10:00 PM (Late Evening)' }
      ],
      substitutionOptions: [
        { id: 'call-first', label: 'Call before substituting unavailable items' },
        { id: 'similar-pack', label: 'Allow closest pack size or variety match' },
        { id: 'no-substitute', label: 'Do not substitute — omit unavailable items' }
      ],
      serviceableAreas: [
        { pin: '560001', area: 'MG Road & Central District', city: 'Bengaluru', windows: 'All 5 daily windows' },
        { pin: '560034', area: 'Koramangala', city: 'Bengaluru', windows: 'All 5 daily windows' },
        { pin: '560038', area: 'Indiranagar', city: 'Bengaluru', windows: 'All 5 daily windows' },
        { pin: '560078', area: 'JP Nagar', city: 'Bengaluru', windows: 'Morning, Afternoon & Evening' },
        { pin: '400001', area: 'Fort & Colaba', city: 'Mumbai', windows: 'All 5 daily windows' },
        { pin: '400050', area: 'Bandra West', city: 'Mumbai', windows: 'All 5 daily windows' },
        { pin: '110001', area: 'Connaught Place', city: 'New Delhi', windows: 'All 5 daily windows' },
        { pin: '110016', area: 'Hauz Khas', city: 'New Delhi', windows: 'Morning & Evening windows' },
        { pin: '500032', area: 'Gachibowli', city: 'Hyderabad', windows: 'All 5 daily windows' },
        { pin: '600001', area: 'Parrys & Central', city: 'Chennai', windows: 'Morning, Afternoon & Evening' },
        { pin: '411001', area: 'Camp & Koregaon Park', city: 'Pune', windows: 'All 5 daily windows' }
      ]
    },
    orderStages: [
      'Order Placed',
      'Preparing Groceries',
      'Packed',
      'Out for Delivery',
      'Delivered'
    ],
    resolvePath: resolvePath,
    formatINR: formatINR
  };
})(window);
