/**
 * FreshAisle — Offers, Collections & Household Bundles (derived strictly from shared catalogue)
 */
(function (global) {
  'use strict';

  var MEAL_COLLECTIONS = [
    {
      id: 'breakfast',
      title: 'Breakfast Essentials',
      summary: 'Bread, milk, eggs, rolled oats, bananas, and fresh morning tea.',
      image: 'assets/images/lifestyle/home2-breakfast.jpg',
      alt: 'Breakfast spread with bread, eggs, milk and fresh fruit',
      productIds: ['bk-whole-wheat-bread', 'da-milk', 'da-eggs', 'da-butter', 'pa-oats', 'fr-bananas', 'sb-tea']
    },
    {
      id: 'lunch',
      title: 'Everyday Lunch',
      summary: 'Basmati rice, toor dal, fresh curd, tomatoes, onions, and crisp salad greens.',
      image: 'assets/images/lifestyle/home2-lunch-dinner.jpg',
      alt: 'Fresh vegetables and pantry ingredients ready for home cooking',
      productIds: ['pa-rice', 'pa-toor-dal', 'da-curd', 'vg-tomatoes', 'vg-onions', 'vg-cucumbers', 'da-ghee']
    },
    {
      id: 'dinner',
      title: 'Quick Dinner',
      summary: 'Malai paneer, bell peppers, whole-wheat atta, penne pasta, and spices.',
      image: 'assets/images/lifestyle/about-kitchen.jpg',
      alt: 'Fresh dinner vegetables arranged on a wooden cutting board',
      productIds: ['da-paneer', 'vg-capsicum', 'pa-wheat-atta', 'pa-pasta', 'da-cheese', 'pa-cooking-oil']
    },
    {
      id: 'teatime',
      title: 'Tea-Time Snacks',
      summary: 'Assam tea, filter coffee, crispy milk rusk, digestive biscuits, and nuts.',
      image: 'assets/images/lifestyle/meal-teatime.jpg',
      alt: 'Evening tea cup with biscuits and crispy snacks',
      productIds: ['sb-tea', 'sb-coffee', 'bk-rusk', 'sb-biscuits', 'sb-mixed-nuts', 'sb-namkeen']
    }
  ];

  var BUNDLES = [
    {
      id: 'bundle-breakfast',
      title: 'Morning Breakfast Basket',
      description: 'Whole-wheat bread, full-cream milk, 12 farm eggs, butter, and bananas.',
      items: [
        { productId: 'bk-whole-wheat-bread', pack: '400 g', qty: 1 },
        { productId: 'da-milk', pack: '1 L', qty: 1 },
        { productId: 'da-eggs', pack: '12 pcs', qty: 1 },
        { productId: 'da-butter', pack: '200 g', qty: 1 },
        { productId: 'fr-bananas', pack: '6 pcs', qty: 1 }
      ]
    },
    {
      id: 'bundle-pantry',
      title: 'Monthly Dal & Grain Restock',
      description: 'Aged basmati rice (5 kg), whole-wheat atta (5 kg), toor dal, sunflower oil, and cow ghee.',
      items: [
        { productId: 'pa-rice', pack: '5 kg', qty: 1 },
        { productId: 'pa-wheat-atta', pack: '5 kg', qty: 1 },
        { productId: 'pa-toor-dal', pack: '1 kg', qty: 1 },
        { productId: 'pa-cooking-oil', pack: '1 L', qty: 1 },
        { productId: 'da-ghee', pack: '500 ml', qty: 1 }
      ]
    },
    {
      id: 'bundle-produce',
      title: 'Fresh Kitchen Produce Pack',
      description: 'Vine tomatoes, red onions, potatoes, carrots, spinach, apples, and oranges.',
      items: [
        { productId: 'vg-tomatoes', pack: '1 kg', qty: 1 },
        { productId: 'vg-onions', pack: '1 kg', qty: 1 },
        { productId: 'vg-potatoes', pack: '1 kg', qty: 1 },
        { productId: 'vg-spinach', pack: '250 g', qty: 1 },
        { productId: 'fr-apples', pack: '1 kg', qty: 1 },
        { productId: 'fr-oranges', pack: '1 kg', qty: 1 }
      ]
    },
    {
      id: 'bundle-teatime',
      title: 'Evening Chai & Snacks Box',
      description: 'Assam leaf tea, crispy milk rusk, digestive biscuits, mixed nuts, and masala sev.',
      items: [
        { productId: 'sb-tea', pack: '250 g', qty: 1 },
        { productId: 'bk-rusk', pack: '300 g', qty: 1 },
        { productId: 'sb-biscuits', pack: '400 g', qty: 1 },
        { productId: 'sb-mixed-nuts', pack: '250 g', qty: 1 },
        { productId: 'sb-namkeen', pack: '200 g', qty: 1 }
      ]
    }
  ];

  function getDiscountedProducts() {
    var cat = global.FRESHAISLE_CATALOGUE;
    if (!cat) return [];
    return cat.products.filter(function (p) {
      return cat.getSavingsPaise(p, p.pack) > 0;
    });
  }

  function computeBundleTotals(bundle) {
    var cat = global.FRESHAISLE_CATALOGUE;
    var regularPaise = 0;
    var offerPaise = 0;
    bundle.items.forEach(function (entry) {
      var prod = cat.getProductById(entry.productId);
      if (!prod) return;
      regularPaise += cat.getBasePricePaise(prod, entry.pack) * entry.qty;
      offerPaise += cat.getEffectivePricePaise(prod, entry.pack) * entry.qty;
    });
    return {
      regularPaise: regularPaise,
      offerPaise: offerPaise,
      savingsPaise: Math.max(0, regularPaise - offerPaise)
    };
  }

  global.FRESHAISLE_OFFERS = {
    mealCollections: MEAL_COLLECTIONS,
    bundles: BUNDLES,
    getDiscountedProducts: getDiscountedProducts,
    computeBundleTotals: computeBundleTotals
  };
})(window);
