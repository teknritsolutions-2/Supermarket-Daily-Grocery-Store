/**
 * FreshAisle — Shared Grocery Catalogue (48 Products across 6 Categories)
 * Prices stored in integer paise (INR * 100) to avoid floating-point rounding issues.
 * Product details are product-specific and avoid unverified brand, organic, or nutrition claims.
 */
(function (global) {
  'use strict';

  var CATEGORIES = [
    { id: 'fruits', label: 'Fruits', countTarget: 8, image: 'assets/images/fruits/apples.jpg', description: 'Crisp orchard fruits and tropical staples selected for everyday snacking.' },
    { id: 'vegetables', label: 'Vegetables', countTarget: 10, image: 'assets/images/vegetables/tomatoes.jpg', description: 'Everyday cooking vegetables, leafy greens, roots, and aromatics.' },
    { id: 'dairy', label: 'Dairy & Eggs', countTarget: 8, image: 'assets/images/dairy/milk.jpg', description: 'Chilled milk, curd, paneer, butter, cheese, ghee, and farm eggs.' },
    { id: 'pantry', label: 'Pantry Essentials', countTarget: 12, image: 'assets/images/pantry/rice.jpg', description: 'Staple rice, whole-wheat atta, lentils, cooking oil, spices, and pasta.' },
    { id: 'bakery', label: 'Bakery', countTarget: 4, image: 'assets/images/bakery/whole-wheat-bread.jpg', description: 'Daily sandwich loaves, soft burger buns, and crisp tea-time rusk.' },
    { id: 'beverages', label: 'Snacks & Beverages', countTarget: 6, image: 'assets/images/beverages/tea.jpg', description: 'Assam tea, roast coffee, biscuits, roasted nuts, fruit juice, and namkeen.' }
  ];

  var PRODUCTS = [
    /* ===================== FRUITS (8) ===================== */
    {
      id: 'fr-apples',
      name: 'Royal Gala Apples',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Pome & Orchard',
      image: 'assets/images/fruits/apples.jpg',
      alt: 'Fresh red apples arranged together',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 21000,
      offerPricePaise: 17500,
      variants: [
        { pack: '500 g', basePricePaise: 11000, offerPricePaise: 9200 },
        { pack: '1 kg', basePricePaise: 21000, offerPricePaise: 17500 },
        { pack: '2 kg', basePricePaise: 40000, offerPricePaise: 33500 }
      ],
      description: 'Crisp, mildly sweet red-skinned apples suited for lunchboxes, fruit bowls, and quick baking.',
      storage: 'Store in the refrigerator crisper drawer away from strong-smelling produce.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: false,
      mealTags: ['breakfast', 'teatime']
    },
    {
      id: 'fr-bananas',
      name: 'Cavendish Bananas',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Everyday Tropical',
      image: 'assets/images/fruits/bananas.jpg',
      alt: 'Bunch of ripe yellow bananas',
      pack: '6 pcs',
      unit: 'pcs',
      basePricePaise: 5400,
      offerPricePaise: 4500,
      variants: [
        { pack: '6 pcs', basePricePaise: 5400, offerPricePaise: 4500 },
        { pack: '12 pcs', basePricePaise: 10200, offerPricePaise: 8600 }
      ],
      description: 'Evenly ripened yellow bananas for morning porridge, smoothies, and mid-day snacking.',
      storage: 'Keep at cool room temperature; avoid refrigerating until fully ripe.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: true,
      mealTags: ['breakfast']
    },
    {
      id: 'fr-oranges',
      name: 'Nagpur Mandarin Oranges',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Citrus',
      image: 'assets/images/fruits/oranges.jpg',
      alt: 'Fresh bright oranges',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 12000,
      offerPricePaise: 9600,
      variants: [
        { pack: '1 kg', basePricePaise: 12000, offerPricePaise: 9600 },
        { pack: '2 kg', basePricePaise: 23000, offerPricePaise: 18400 }
      ],
      description: 'Easy-peel sweet-tart mandarins packed with juicy segments for fresh eating or home juicing.',
      storage: 'Keep in a cool airy basket for up to 4 days or chill for longer freshness.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['breakfast', 'teatime']
    },
    {
      id: 'fr-grapes',
      name: 'Seedless Green Grapes',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Berries & Vines',
      image: 'assets/images/fruits/grapes.jpg',
      alt: 'Cluster of fresh green grapes',
      pack: '500 g',
      unit: 'g',
      basePricePaise: 9500,
      offerPricePaise: null,
      variants: [
        { pack: '500 g', basePricePaise: 9500, offerPricePaise: null },
        { pack: '1 kg', basePricePaise: 18000, offerPricePaise: null }
      ],
      description: 'Firm, snappy seedless green grapes ready for rinsing and serving chilled.',
      storage: 'Refrigerate unwashed in a ventilated container and rinse just before eating.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['teatime']
    },
    {
      id: 'fr-pomegranates',
      name: 'Ruby Pomegranates',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Orchard & Seasonal',
      image: 'assets/images/fruits/pomegranates.jpg',
      alt: 'Fresh ruby red pomegranates',
      pack: '2 pcs',
      unit: 'pcs',
      basePricePaise: 14000,
      offerPricePaise: 11800,
      variants: [
        { pack: '2 pcs', basePricePaise: 14000, offerPricePaise: 11800 },
        { pack: '4 pcs', basePricePaise: 27000, offerPricePaise: 22800 }
      ],
      description: 'Plump ruby-aril pomegranates ideal for salads, chaat toppings, raita, and fresh bowls.',
      storage: 'Whole fruit stays fresh in a cool dry spot or fridge; store seeded arils chilled.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: false,
      mealTags: ['breakfast', 'lunch']
    },
    {
      id: 'fr-papaya',
      name: 'Ripe Papaya',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Everyday Tropical',
      image: 'assets/images/fruits/papaya.jpg',
      alt: 'Ripe halved papaya showing orange flesh',
      pack: '1 pc (~1 kg)',
      unit: 'pc',
      basePricePaise: 7800,
      offerPricePaise: null,
      variants: [
        { pack: '1 pc (~1 kg)', basePricePaise: 7800, offerPricePaise: null }
      ],
      description: 'Soft, fragrant papaya with vibrant orange flesh ready to slice for breakfast plates.',
      storage: 'Ripen at room temperature; once cut, wrap tightly and refrigerate for 2 days.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['breakfast']
    },
    {
      id: 'fr-pineapple',
      name: 'Golden Pineapple',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Everyday Tropical',
      image: 'assets/images/fruits/pineapple.jpg',
      alt: 'Whole fresh golden pineapple',
      pack: '1 pc (~1.2 kg)',
      unit: 'pc',
      basePricePaise: 9800,
      offerPricePaise: 8200,
      variants: [
        { pack: '1 pc (~1.2 kg)', basePricePaise: 9800, offerPricePaise: 8200 }
      ],
      description: 'Juicy whole golden pineapple suited for fruit platters, grilling, or fresh chutneys.',
      storage: 'Keep whole on the counter for 1–2 days; refrigerate cut chunks in a sealed box.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['teatime']
    },
    {
      id: 'fr-watermelon',
      name: 'Striped Watermelon',
      category: 'fruits',
      categoryLabel: 'Fruits',
      subcategory: 'Melons',
      image: 'assets/images/fruits/watermelon.jpg',
      alt: 'Freshly sliced red watermelon',
      pack: '1 pc (~2.5 kg)',
      unit: 'pc',
      basePricePaise: 11500,
      offerPricePaise: null,
      variants: [
        { pack: '1 pc (~2.5 kg)', basePricePaise: 11500, offerPricePaise: null }
      ],
      description: 'Crisp red-fleshed watermelon that chills quickly for refreshing afternoon wedges.',
      storage: 'Store whole away from direct heat; wrap cut halves cleanly in the refrigerator.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['teatime']
    },

    /* ===================== VEGETABLES (10) ===================== */
    {
      id: 'vg-tomatoes',
      name: 'Vine Tomatoes',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Daily Essentials',
      image: 'assets/images/vegetables/tomatoes.jpg',
      alt: 'Ripe red tomatoes',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 5200,
      offerPricePaise: 4200,
      variants: [
        { pack: '500 g', basePricePaise: 2800, offerPricePaise: 2300 },
        { pack: '1 kg', basePricePaise: 5200, offerPricePaise: 4200 },
        { pack: '2 kg', basePricePaise: 9800, offerPricePaise: 8000 }
      ],
      description: 'Firm, balanced-acidity red tomatoes for everyday curries, rasam, salads, and sauces.',
      storage: 'Keep stem-side up at room temperature for full flavour; refrigerate only if very ripe.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'vg-potatoes',
      name: 'Washed Farm Potatoes',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Roots & Tubers',
      image: 'assets/images/vegetables/potatoes.jpg',
      alt: 'Freshly harvested brown potatoes',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 4400,
      offerPricePaise: null,
      variants: [
        { pack: '1 kg', basePricePaise: 4400, offerPricePaise: null },
        { pack: '2 kg', basePricePaise: 8400, offerPricePaise: null },
        { pack: '5 kg', basePricePaise: 19500, offerPricePaise: null }
      ],
      description: 'Versatile thin-skinned potatoes suited for sabzi, aloo parathas, roasting, and mash.',
      storage: 'Store in a cool, dark, ventilated basket separate from onions.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'vg-onions',
      name: 'Red Onions',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Daily Essentials',
      image: 'assets/images/vegetables/onions.jpg',
      alt: 'Fresh purple-red onions',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 5800,
      offerPricePaise: 4800,
      variants: [
        { pack: '1 kg', basePricePaise: 5800, offerPricePaise: 4800 },
        { pack: '2 kg', basePricePaise: 11200, offerPricePaise: 9200 },
        { pack: '5 kg', basePricePaise: 26500, offerPricePaise: 22000 }
      ],
      description: 'Aromatic cured red onions that form the crisp base for tadka, gravies, and kachumber.',
      storage: 'Keep in a dry, well-ventilated rack away from moisture and potatoes.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'vg-carrots',
      name: 'Crunchy Orange Carrots',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Roots & Tubers',
      image: 'assets/images/vegetables/carrots.jpg',
      alt: 'Bunch of fresh orange carrots',
      pack: '500 g',
      unit: 'g',
      basePricePaise: 4200,
      offerPricePaise: null,
      variants: [
        { pack: '500 g', basePricePaise: 4200, offerPricePaise: null },
        { pack: '1 kg', basePricePaise: 8000, offerPricePaise: null }
      ],
      description: 'Sweet, crisp carrots for stir-fries, pulao, slaws, soups, and lunchbox sticks.',
      storage: 'Store unwashed in a breathable bag inside the refrigerator vegetable drawer.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'vg-cucumbers',
      name: 'English Cucumbers',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Salads & Gourds',
      image: 'assets/images/vegetables/cucumbers.jpg',
      alt: 'Fresh green cucumbers',
      pack: '500 g',
      unit: 'g',
      basePricePaise: 3800,
      offerPricePaise: null,
      variants: [
        { pack: '500 g', basePricePaise: 3800, offerPricePaise: null },
        { pack: '1 kg', basePricePaise: 7200, offerPricePaise: null }
      ],
      description: 'Thin-skinned, crisp cucumbers ideal for raita, sandwiches, and weekday salads.',
      storage: 'Keep refrigerated and dry in the crisper drawer for best crunch.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['lunch']
    },
    {
      id: 'vg-capsicum',
      name: 'Bell Peppers (Capsicum)',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Stir-Fry & Roast',
      image: 'assets/images/vegetables/capsicum.jpg',
      alt: 'Assorted green and red bell peppers',
      pack: '500 g',
      unit: 'g',
      basePricePaise: 6800,
      offerPricePaise: 5600,
      variants: [
        { pack: '500 g', basePricePaise: 6800, offerPricePaise: 5600 },
        { pack: '1 kg', basePricePaise: 13000, offerPricePaise: 10800 }
      ],
      description: 'Thick-walled green and red capsicums ready for kadai paneer, noodles, and pizza.',
      storage: 'Store dry in the refrigerator vegetable drawer for up to 5 days.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['dinner']
    },
    {
      id: 'vg-spinach',
      name: 'Fresh Spinach Leaves',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Leafy Greens',
      image: 'assets/images/vegetables/spinach.jpg',
      alt: 'Fresh green spinach leaves',
      pack: '250 g',
      unit: 'g',
      basePricePaise: 3200,
      offerPricePaise: null,
      variants: [
        { pack: '250 g', basePricePaise: 3200, offerPricePaise: null },
        { pack: '500 g', basePricePaise: 6000, offerPricePaise: null }
      ],
      description: 'Tender dark-green palak leaves suited for dal palak, saag, omelettes, and soups.',
      storage: 'Wrap loosely in a dry paper towel inside a perforated bag in the fridge.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'vg-cauliflower',
      name: 'Whole White Cauliflower',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Florets & Brassicas',
      image: 'assets/images/vegetables/cauliflower.jpg',
      alt: 'Whole fresh white cauliflower head',
      pack: '1 pc (~600 g)',
      unit: 'pc',
      basePricePaise: 5500,
      offerPricePaise: null,
      variants: [
        { pack: '1 pc (~600 g)', basePricePaise: 5500, offerPricePaise: null }
      ],
      description: 'Compact cream-white florets for aloo gobi, parathas, roasted trays, and Manchurian.',
      storage: 'Keep whole in the refrigerator crisper and trim florets right before cooking.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['dinner']
    },
    {
      id: 'vg-green-beans',
      name: 'Tender French Green Beans',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Pods & Stir-Fry',
      image: 'assets/images/vegetables/green-beans.jpg',
      alt: 'Fresh green beans',
      pack: '500 g',
      unit: 'g',
      basePricePaise: 5600,
      offerPricePaise: 4600,
      variants: [
        { pack: '250 g', basePricePaise: 3000, offerPricePaise: 2500 },
        { pack: '500 g', basePricePaise: 5600, offerPricePaise: 4600 }
      ],
      description: 'Snappy young green beans great for poriyal, pulao, garlic stir-fries, and sides.',
      storage: 'Store unwashed in a breathable pouch in the refrigerator.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'vg-ginger',
      name: 'Fresh Ginger Root',
      category: 'vegetables',
      categoryLabel: 'Vegetables',
      subcategory: 'Aromatics',
      image: 'assets/images/vegetables/ginger.jpg',
      alt: 'Fresh ginger roots',
      pack: '250 g',
      unit: 'g',
      basePricePaise: 4500,
      offerPricePaise: null,
      variants: [
        { pack: '100 g', basePricePaise: 2000, offerPricePaise: null },
        { pack: '250 g', basePricePaise: 4500, offerPricePaise: null }
      ],
      description: 'Zesty, fibrous ginger rhizomes essential for morning masala chai and everyday cooking.',
      storage: 'Keep unpeeled in a paper bag inside the fridge drawer.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: true,
      mealTags: ['teatime', 'dinner']
    },

    /* ===================== DAIRY & EGGS (8) ===================== */
    {
      id: 'da-milk',
      name: 'Full Cream Fresh Milk',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Milk & Curd',
      image: 'assets/images/dairy/milk.jpg',
      alt: 'Fresh white milk in glass bottle and glass',
      pack: '1 L',
      unit: 'L',
      basePricePaise: 6800,
      offerPricePaise: null,
      variants: [
        { pack: '500 ml', basePricePaise: 3500, offerPricePaise: null },
        { pack: '1 L', basePricePaise: 6800, offerPricePaise: null }
      ],
      description: 'Rich, pasteurized full-cream milk for coffee, tea, oatmeal, and homemade curd.',
      storage: 'Keep refrigerated at 4°C or below and consume within 48 hours of opening.',
      dietary: 'Contains Milk · Vegetarian',
      featured: true,
      essential: true,
      mealTags: ['breakfast', 'teatime']
    },
    {
      id: 'da-curd',
      name: 'Homestyle Set Curd (Dahi)',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Milk & Curd',
      image: 'assets/images/dairy/curd.jpg',
      alt: 'Thick white curd in a ceramic bowl',
      pack: '400 g',
      unit: 'g',
      basePricePaise: 4800,
      offerPricePaise: 4100,
      variants: [
        { pack: '400 g', basePricePaise: 4800, offerPricePaise: 4100 },
        { pack: '800 g', basePricePaise: 9000, offerPricePaise: 7800 }
      ],
      description: 'Thick, mild-tang set curd ready for lunch thalis, raita, buttermilk, and marinades.',
      storage: 'Keep chilled at 4°C; use a clean dry spoon each time.',
      dietary: 'Contains Milk · Vegetarian',
      featured: false,
      essential: true,
      mealTags: ['lunch']
    },
    {
      id: 'da-paneer',
      name: 'Fresh Malai Paneer Block',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Paneer & Cheese',
      image: 'assets/images/dairy/paneer.jpg',
      alt: 'Fresh white paneer cubes',
      pack: '200 g',
      unit: 'g',
      basePricePaise: 9500,
      offerPricePaise: 8200,
      variants: [
        { pack: '200 g', basePricePaise: 9500, offerPricePaise: 8200 },
        { pack: '400 g', basePricePaise: 18500, offerPricePaise: 15800 }
      ],
      description: 'Soft, firm-cutting cottage cheese block that holds shape in gravies, bhurji, and tikkas.',
      storage: 'Refrigerate unopened; once opened, submerge unused paneer in fresh chilled water.',
      dietary: 'Contains Milk · Vegetarian',
      featured: true,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'da-butter',
      name: 'Cultured Salted Butter',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Butter & Ghee',
      image: 'assets/images/dairy/butter.jpg',
      alt: 'Golden salted butter block',
      pack: '200 g',
      unit: 'g',
      basePricePaise: 11800,
      offerPricePaise: null,
      variants: [
        { pack: '100 g', basePricePaise: 6000, offerPricePaise: null },
        { pack: '200 g', basePricePaise: 11800, offerPricePaise: null },
        { pack: '500 g', basePricePaise: 28500, offerPricePaise: null }
      ],
      description: 'Creamy salted table butter for morning toast, pav bhaji, parathas, and baking.',
      storage: 'Keep chilled in the dairy compartment, tightly wrapped to prevent odour absorption.',
      dietary: 'Contains Milk · Vegetarian',
      featured: false,
      essential: true,
      mealTags: ['breakfast']
    },
    {
      id: 'da-cheese',
      name: 'Mild Cheddar Cheese Block',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Paneer & Cheese',
      image: 'assets/images/dairy/cheese.jpg',
      alt: 'Wedge of mild yellow cheddar cheese',
      pack: '200 g',
      unit: 'g',
      basePricePaise: 14500,
      offerPricePaise: 12500,
      variants: [
        { pack: '200 g', basePricePaise: 14500, offerPricePaise: 12500 },
        { pack: '400 g', basePricePaise: 28000, offerPricePaise: 24200 }
      ],
      description: 'Smooth-melting cheddar block easy to grate over toasties, omelettes, and pasta bakes.',
      storage: 'Wrap tightly in parchment or cling film and store chilled.',
      dietary: 'Contains Milk · Vegetarian',
      featured: false,
      essential: false,
      mealTags: ['breakfast', 'dinner']
    },
    {
      id: 'da-ghee',
      name: 'Pure Cow Ghee',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Butter & Ghee',
      image: 'assets/images/dairy/ghee.jpg',
      alt: 'Glass jar of golden cow ghee',
      pack: '500 ml',
      unit: 'ml',
      basePricePaise: 36500,
      offerPricePaise: 32900,
      variants: [
        { pack: '200 ml', basePricePaise: 15500, offerPricePaise: 14000 },
        { pack: '500 ml', basePricePaise: 36500, offerPricePaise: 32900 },
        { pack: '1 L', basePricePaise: 71000, offerPricePaise: 63900 }
      ],
      description: 'Aromatic granular cow ghee suited for rotis, khichdi, dal tadka, and festive sweets.',
      storage: 'Keep tightly sealed in a cool, dry cupboard away from direct sunlight.',
      dietary: 'Contains Milk · Vegetarian',
      featured: false,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'da-yogurt',
      name: 'Plain Greek Yogurt',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Milk & Curd',
      image: 'assets/images/dairy/yogurt.jpg',
      alt: 'Bowl of creamy plain Greek yogurt',
      pack: '400 g',
      unit: 'g',
      basePricePaise: 11000,
      offerPricePaise: null,
      variants: [
        { pack: '200 g', basePricePaise: 6000, offerPricePaise: null },
        { pack: '400 g', basePricePaise: 11000, offerPricePaise: null }
      ],
      description: 'Strained, spoonable unsweetened yogurt ready for fruit parfaits, dips, and dressings.',
      storage: 'Keep refrigerated at 4°C until the best-before date.',
      dietary: 'Contains Milk · Vegetarian',
      featured: false,
      essential: false,
      mealTags: ['breakfast']
    },
    {
      id: 'da-eggs',
      name: 'Brown Shell Farm Eggs',
      category: 'dairy',
      categoryLabel: 'Dairy & Eggs',
      subcategory: 'Eggs',
      image: 'assets/images/dairy/eggs.jpg',
      alt: 'Carton of fresh brown shell eggs',
      pack: '12 pcs',
      unit: 'pcs',
      basePricePaise: 10800,
      offerPricePaise: null,
      variants: [
        { pack: '6 pcs', basePricePaise: 5800, offerPricePaise: null },
        { pack: '12 pcs', basePricePaise: 10800, offerPricePaise: null }
      ],
      description: 'Clean, sturdy-shelled brown eggs packed in protective pulp trays for daily breakfasts.',
      storage: 'Store pointy-end down inside the refrigerator for consistent freshness.',
      dietary: 'Contains Egg',
      featured: true,
      essential: true,
      mealTags: ['breakfast', 'dinner']
    },

    /* ===================== PANTRY ESSENTIALS (12) ===================== */
    {
      id: 'pa-rice',
      name: 'Aged Basmati Rice',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Rice & Flour',
      image: 'assets/images/pantry/rice.jpg',
      alt: 'Bowl of slender white basmati rice grains',
      pack: '5 kg',
      unit: 'kg',
      basePricePaise: 64000,
      offerPricePaise: 54900,
      variants: [
        { pack: '1 kg', basePricePaise: 13800, offerPricePaise: 11900 },
        { pack: '5 kg', basePricePaise: 64000, offerPricePaise: 54900 }
      ],
      description: 'Slender long-grain basmati rice that cooks up fluffy and separate for pulao and biryani.',
      storage: 'Keep in an airtight grain container in a cool, dry pantry.',
      dietary: 'Naturally gluten-free · Plant-based',
      featured: true,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-wheat-atta',
      name: 'Stoneground Whole Wheat Atta',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Rice & Flour',
      image: 'assets/images/pantry/wheat-atta.jpg',
      alt: 'Bowl of finely milled whole wheat flour',
      pack: '5 kg',
      unit: 'kg',
      basePricePaise: 29500,
      offerPricePaise: 25900,
      variants: [
        { pack: '5 kg', basePricePaise: 29500, offerPricePaise: 25900 },
        { pack: '10 kg', basePricePaise: 57000, offerPricePaise: 49900 }
      ],
      description: 'Finely milled whole-wheat flour crafted for soft everyday rotis, phulkas, and parathas.',
      storage: 'Transfer to a dry airtight tin away from kitchen steam.',
      dietary: 'Contains Wheat / Gluten',
      featured: false,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-toor-dal',
      name: 'Unpolished Toor Dal',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Pulses & Lentils',
      image: 'assets/images/pantry/toor-dal.jpg',
      alt: 'Yellow split toor dal lentils',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 17800,
      offerPricePaise: 15500,
      variants: [
        { pack: '500 g', basePricePaise: 9200, offerPricePaise: 8000 },
        { pack: '1 kg', basePricePaise: 17800, offerPricePaise: 15500 },
        { pack: '2 kg', basePricePaise: 34800, offerPricePaise: 30400 }
      ],
      description: 'Clean yellow split pigeon peas ideal for everyday sambar, dal fry, and homestyle tadka.',
      storage: 'Store in a sealed dry jar away from moisture.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-moong-dal',
      name: 'Yellow Split Moong Dal',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Pulses & Lentils',
      image: 'assets/images/pantry/moong-dal.jpg',
      alt: 'Split yellow moong dal in a bowl',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 15600,
      offerPricePaise: null,
      variants: [
        { pack: '500 g', basePricePaise: 8200, offerPricePaise: null },
        { pack: '1 kg', basePricePaise: 15600, offerPricePaise: null }
      ],
      description: 'Quick-cooking split yellow lentils for comforting khichdi, moong chilla, and light dals.',
      storage: 'Keep in an airtight jar in a cool cupboard.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-chickpeas',
      name: 'Kabuli White Chickpeas',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Pulses & Lentils',
      image: 'assets/images/pantry/chickpeas.jpg',
      alt: 'Dried white kabuli chickpeas',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 16200,
      offerPricePaise: null,
      variants: [
        { pack: '500 g', basePricePaise: 8500, offerPricePaise: null },
        { pack: '1 kg', basePricePaise: 16200, offerPricePaise: null }
      ],
      description: 'Bold-sized dried chickpeas for Punjabi chole, hummus, sundal, and protein-rich salads.',
      storage: 'Keep dry in a sealed pantry jar; soak overnight before pressure cooking.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-cooking-oil',
      name: 'Refined Sunflower Cooking Oil',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Oils & Condiments',
      image: 'assets/images/pantry/cooking-oil.jpg',
      alt: 'Clear bottle of golden cooking oil',
      pack: '1 L',
      unit: 'L',
      basePricePaise: 16500,
      offerPricePaise: 14200,
      variants: [
        { pack: '1 L', basePricePaise: 16500, offerPricePaise: 14200 },
        { pack: '2 L', basePricePaise: 32000, offerPricePaise: 27800 },
        { pack: '5 L', basePricePaise: 78000, offerPricePaise: 67500 }
      ],
      description: 'Light, neutral-tasting sunflower oil suitable for everyday sautéing, tadka, and frying.',
      storage: 'Close cap firmly after pouring and store away from stove heat.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-sugar',
      name: 'Fine Granulated Sugar',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Baking & Staples',
      image: 'assets/images/pantry/sugar.jpg',
      alt: 'Bowl of fine white granulated sugar',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 5400,
      offerPricePaise: null,
      variants: [
        { pack: '1 kg', basePricePaise: 5400, offerPricePaise: null },
        { pack: '2 kg', basePricePaise: 10400, offerPricePaise: null }
      ],
      description: 'Clean white free-flowing sugar crystals that dissolve quickly in chai, coffee, and desserts.',
      storage: 'Keep in a moisture-proof canister to avoid clumping.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: true,
      mealTags: ['breakfast', 'teatime']
    },
    {
      id: 'pa-salt',
      name: 'Iodized Sea Salt',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Baking & Staples',
      image: 'assets/images/pantry/salt.jpg',
      alt: 'Fine white sea salt crystals',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 2800,
      offerPricePaise: null,
      variants: [
        { pack: '1 kg', basePricePaise: 2800, offerPricePaise: null }
      ],
      description: 'Fine, even-grain iodized table salt for everyday cooking, brining, and seasoning.',
      storage: 'Store in a dry ceramic or glass salt jar.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: true,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-turmeric',
      name: 'Ground Turmeric Powder (Haldi)',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Spices',
      image: 'assets/images/pantry/turmeric.jpg',
      alt: 'Bright golden ground turmeric powder in bowl',
      pack: '200 g',
      unit: 'g',
      basePricePaise: 6800,
      offerPricePaise: null,
      variants: [
        { pack: '100 g', basePricePaise: 3800, offerPricePaise: null },
        { pack: '200 g', basePricePaise: 6800, offerPricePaise: null }
      ],
      description: 'Earthy, vibrant golden turmeric finely ground for daily dals, sabzis, and warm milk.',
      storage: 'Seal tightly inside an opaque spice tin away from light.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-chilli-powder',
      name: 'Kashmiri Red Chilli Powder',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Spices',
      image: 'assets/images/pantry/chilli-powder.jpg',
      alt: 'Deep red Kashmiri chilli powder in spoon',
      pack: '200 g',
      unit: 'g',
      basePricePaise: 9600,
      offerPricePaise: 8200,
      variants: [
        { pack: '100 g', basePricePaise: 5200, offerPricePaise: 4500 },
        { pack: '200 g', basePricePaise: 9600, offerPricePaise: 8200 }
      ],
      description: 'Rich crimson chilli powder giving balanced mild warmth and vibrant colour to curries.',
      storage: 'Store in an airtight glass jar in a cool cupboard.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['lunch', 'dinner']
    },
    {
      id: 'pa-oats',
      name: 'Rolled Wholegrain Oats',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Breakfast Grains',
      image: 'assets/images/pantry/oats.jpg',
      alt: 'Bowl of dry rolled oats',
      pack: '1 kg',
      unit: 'kg',
      basePricePaise: 18500,
      offerPricePaise: 15500,
      variants: [
        { pack: '500 g', basePricePaise: 9800, offerPricePaise: 8400 },
        { pack: '1 kg', basePricePaise: 18500, offerPricePaise: 15500 }
      ],
      description: 'Hearty wholegrain rolled oats for 5-minute stovetop porridge, overnight oats, and granola.',
      storage: 'Keep sealed in a cool dry pantry shelf.',
      dietary: 'Plant-based · May contain gluten traces',
      featured: false,
      essential: false,
      mealTags: ['breakfast']
    },
    {
      id: 'pa-pasta',
      name: 'Durum Wheat Penne Pasta',
      category: 'pantry',
      categoryLabel: 'Pantry Essentials',
      subcategory: 'Breakfast Grains',
      image: 'assets/images/pantry/pasta.jpg',
      alt: 'Uncooked ridged penne pasta',
      pack: '500 g',
      unit: 'g',
      basePricePaise: 12500,
      offerPricePaise: null,
      variants: [
        { pack: '500 g', basePricePaise: 12500, offerPricePaise: null },
        { pack: '1 kg', basePricePaise: 23500, offerPricePaise: null }
      ],
      description: 'Ridged durum semolina penne that holds tomato, pesto, and creamy vegetable sauces evenly.',
      storage: 'Store dry in a sealed cupboard container.',
      dietary: 'Contains Wheat / Gluten',
      featured: false,
      essential: false,
      mealTags: ['dinner']
    },

    /* ===================== BAKERY (4) ===================== */
    {
      id: 'bk-white-bread',
      name: 'Soft Milk White Bread Loaf',
      category: 'bakery',
      categoryLabel: 'Bakery',
      subcategory: 'Daily Loaves',
      image: 'assets/images/bakery/white-bread.jpg',
      alt: 'Sliced soft white sandwich bread loaf',
      pack: '400 g',
      unit: 'g',
      basePricePaise: 4500,
      offerPricePaise: null,
      variants: [
        { pack: '400 g', basePricePaise: 4500, offerPricePaise: null },
        { pack: '700 g', basePricePaise: 7200, offerPricePaise: null }
      ],
      description: 'Tender, even-sliced white loaf ideal for crisp toasted sandwiches and classic bread butter.',
      storage: 'Keep sealed in a cool breadbox for up to 4 days; freeze extra slices for longer keeping.',
      dietary: 'Contains Wheat / Gluten & Milk',
      featured: false,
      essential: true,
      mealTags: ['breakfast']
    },
    {
      id: 'bk-whole-wheat-bread',
      name: 'Whole-Wheat Sandwich Loaf',
      category: 'bakery',
      categoryLabel: 'Bakery',
      subcategory: 'Daily Loaves',
      image: 'assets/images/bakery/whole-wheat-bread.jpg',
      alt: 'Sliced brown whole-wheat bread loaf',
      pack: '400 g',
      unit: 'g',
      basePricePaise: 5200,
      offerPricePaise: 4500,
      variants: [
        { pack: '400 g', basePricePaise: 5200, offerPricePaise: 4500 },
        { pack: '700 g', basePricePaise: 8600, offerPricePaise: 7500 }
      ],
      description: 'Nutty whole-wheat sandwich loaf baked with soft crumb for everyday toast and packed lunches.',
      storage: 'Reseal bag tightly after opening and keep in a dry, cool spot.',
      dietary: 'Contains Wheat / Gluten',
      featured: true,
      essential: true,
      mealTags: ['breakfast', 'lunch']
    },
    {
      id: 'bk-buns',
      name: 'Soft Burger Buns',
      category: 'bakery',
      categoryLabel: 'Bakery',
      subcategory: 'Buns & Rolls',
      image: 'assets/images/bakery/buns.jpg',
      alt: 'Golden baked burger buns',
      pack: '4 pcs',
      unit: 'pcs',
      basePricePaise: 4800,
      offerPricePaise: null,
      variants: [
        { pack: '4 pcs', basePricePaise: 4800, offerPricePaise: null },
        { pack: '8 pcs', basePricePaise: 9000, offerPricePaise: null }
      ],
      description: 'Pillowy golden buns suited for veggie patties, sliders, vada pav, and quick dinner rolls.',
      storage: 'Keep sealed at room temperature and toast lightly before serving.',
      dietary: 'Contains Wheat / Gluten',
      featured: false,
      essential: false,
      mealTags: ['dinner', 'teatime']
    },
    {
      id: 'bk-rusk',
      name: 'Crispy Tea Time Milk Rusk',
      category: 'bakery',
      categoryLabel: 'Bakery',
      subcategory: 'Tea-Time Bakes',
      image: 'assets/images/bakery/rusk.jpg',
      alt: 'Golden twice-baked crispy tea rusk slices',
      pack: '300 g',
      unit: 'g',
      basePricePaise: 6200,
      offerPricePaise: 5200,
      variants: [
        { pack: '300 g', basePricePaise: 6200, offerPricePaise: 5200 },
        { pack: '600 g', basePricePaise: 11800, offerPricePaise: 9900 }
      ],
      description: 'Twice-baked crisp golden toast slices made for dipping into hot morning or evening chai.',
      storage: 'Transfer to an airtight tin immediately after opening to retain crunch.',
      dietary: 'Contains Wheat / Gluten & Milk',
      featured: false,
      essential: false,
      mealTags: ['breakfast', 'teatime']
    },

    /* ===================== SNACKS & BEVERAGES (6) ===================== */
    {
      id: 'sb-tea',
      name: 'Assam Leaf Black Tea',
      category: 'beverages',
      categoryLabel: 'Snacks & Beverages',
      subcategory: 'Tea & Coffee',
      image: 'assets/images/beverages/tea.jpg',
      alt: 'Cup of amber black tea with dry tea leaves',
      pack: '250 g',
      unit: 'g',
      basePricePaise: 15500,
      offerPricePaise: 13200,
      variants: [
        { pack: '250 g', basePricePaise: 15500, offerPricePaise: 13200 },
        { pack: '500 g', basePricePaise: 29500, offerPricePaise: 25200 }
      ],
      description: 'Full-bodied malty Assam black tea leaves that brew brisk with or without milk and spices.',
      storage: 'Store in a tightly lidded opaque tea caddy away from spices.',
      dietary: 'Naturally plant-based',
      featured: true,
      essential: true,
      mealTags: ['breakfast', 'teatime']
    },
    {
      id: 'sb-coffee',
      name: 'Filter Roast Ground Coffee',
      category: 'beverages',
      categoryLabel: 'Snacks & Beverages',
      subcategory: 'Tea & Coffee',
      image: 'assets/images/beverages/coffee.jpg',
      alt: 'Roasted coffee beans and freshly brewed coffee cup',
      pack: '250 g',
      unit: 'g',
      basePricePaise: 21500,
      offerPricePaise: null,
      variants: [
        { pack: '250 g', basePricePaise: 21500, offerPricePaise: null },
        { pack: '500 g', basePricePaise: 41000, offerPricePaise: null }
      ],
      description: 'Medium-dark Arabica and Robusta filter blend ground for South Indian drip brewers and French press.',
      storage: 'Keep in an airtight pouch or jar in a cool dark cupboard.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['breakfast', 'teatime']
    },
    {
      id: 'sb-biscuits',
      name: 'Digestive Wholemeal Biscuits',
      category: 'beverages',
      categoryLabel: 'Snacks & Beverages',
      subcategory: 'Biscuits & Snacks',
      image: 'assets/images/beverages/biscuits.jpg',
      alt: 'Stack of golden wholemeal digestive biscuits',
      pack: '400 g',
      unit: 'g',
      basePricePaise: 8500,
      offerPricePaise: 7200,
      variants: [
        { pack: '200 g', basePricePaise: 4500, offerPricePaise: 3900 },
        { pack: '400 g', basePricePaise: 8500, offerPricePaise: 7200 }
      ],
      description: 'Crisp, lightly sweetened wholemeal biscuits suited for tea breaks and cheese boards.',
      storage: 'Store in a dry airtight biscuit jar.',
      dietary: 'Contains Wheat / Gluten',
      featured: false,
      essential: false,
      mealTags: ['teatime']
    },
    {
      id: 'sb-mixed-nuts',
      name: 'Roasted Almonds & Cashews',
      category: 'beverages',
      categoryLabel: 'Snacks & Beverages',
      subcategory: 'Nuts & Dried Fruit',
      image: 'assets/images/beverages/mixed-nuts.jpg',
      alt: 'Bowl of roasted almonds and cashews',
      pack: '250 g',
      unit: 'g',
      basePricePaise: 31000,
      offerPricePaise: 26900,
      variants: [
        { pack: '250 g', basePricePaise: 31000, offerPricePaise: 26900 },
        { pack: '500 g', basePricePaise: 59500, offerPricePaise: 51900 }
      ],
      description: 'Dry-roasted whole California almonds and whole cashews lightly seasoned for desk snacking.',
      storage: 'Reseal pouch tightly or refrigerate in humid weather for lasting crunch.',
      dietary: 'Contains Tree Nuts',
      featured: true,
      essential: false,
      mealTags: ['breakfast', 'teatime']
    },
    {
      id: 'sb-fruit-juice',
      name: 'Pressed Orange & Mango Juice',
      category: 'beverages',
      categoryLabel: 'Snacks & Beverages',
      subcategory: 'Juices & Drinks',
      image: 'assets/images/beverages/fruit-juice.jpg',
      alt: 'Tall glass of vibrant orange fruit juice',
      pack: '1 L',
      unit: 'L',
      basePricePaise: 12000,
      offerPricePaise: null,
      variants: [
        { pack: '1 L', basePricePaise: 12000, offerPricePaise: null }
      ],
      description: 'Bright, smooth fruit juice carton for weekend brunches and chilled afternoon pours.',
      storage: 'Refrigerate after opening and consume within 3 days.',
      dietary: 'Naturally plant-based',
      featured: false,
      essential: false,
      mealTags: ['breakfast']
    },
    {
      id: 'sb-namkeen',
      name: 'Crispy Masala Sev & Peanut Mix',
      category: 'beverages',
      categoryLabel: 'Snacks & Beverages',
      subcategory: 'Biscuits & Snacks',
      image: 'assets/images/beverages/namkeen.jpg',
      alt: 'Bowl of crispy spiced Indian sev and peanut namkeen',
      pack: '200 g',
      unit: 'g',
      basePricePaise: 5800,
      offerPricePaise: null,
      variants: [
        { pack: '200 g', basePricePaise: 5800, offerPricePaise: null },
        { pack: '400 g', basePricePaise: 11000, offerPricePaise: null }
      ],
      description: 'Crunchy gram-flour sev tossed with roasted peanuts and mild kitchen spices for evening chai.',
      storage: 'Keep tightly sealed in a dry snack container.',
      dietary: 'Contains Peanuts',
      featured: false,
      essential: false,
      mealTags: ['teatime']
    }
  ];

  var BY_ID = {};
  PRODUCTS.forEach(function (p) {
    BY_ID[p.id] = p;
  });

  function getProductById(id) {
    return BY_ID[id] || null;
  }

  function getVariant(product, pack) {
    if (!product || !product.variants || !product.variants.length) return null;
    if (!pack) return product.variants[0];
    for (var i = 0; i < product.variants.length; i++) {
      if (product.variants[i].pack === pack) return product.variants[i];
    }
    return product.variants[0];
  }

  function getEffectivePricePaise(product, pack) {
    var v = getVariant(product, pack);
    var base = v ? v.basePricePaise : product.basePricePaise;
    var offer = v ? v.offerPricePaise : product.offerPricePaise;
    return offer && offer < base ? offer : base;
  }

  function getBasePricePaise(product, pack) {
    var v = getVariant(product, pack);
    return v ? v.basePricePaise : product.basePricePaise;
  }

  function getSavingsPaise(product, pack) {
    var base = getBasePricePaise(product, pack);
    var eff = getEffectivePricePaise(product, pack);
    return Math.max(0, base - eff);
  }

  function getDiscountPercent(product, pack) {
    var base = getBasePricePaise(product, pack);
    var savings = getSavingsPaise(product, pack);
    if (!base || savings <= 0) return 0;
    return Math.round((savings / base) * 100);
  }

  global.FRESHAISLE_CATALOGUE = {
    categories: CATEGORIES,
    products: PRODUCTS,
    getProductById: getProductById,
    getVariant: getVariant,
    getEffectivePricePaise: getEffectivePricePaise,
    getBasePricePaise: getBasePricePaise,
    getSavingsPaise: getSavingsPaise,
    getDiscountPercent: getDiscountPercent
  };
})(window);
