# FreshAisle — Contemporary Supermarket & Daily Grocery Store

A complete static Supermarket & Daily Grocery Store website with a functional frontend Customer Dashboard built using semantic HTML5, modular CSS3, and vanilla JavaScript.

## Pages (12)

- `index.html` — **Home 1 (Storefront)**: Hero savings slider, Shop by Category (6 tiles), Weekly Deals carousel, Fresh from the Produce Aisle, Everyday Essentials, Pantry Restock shelves, Shop by Meal, Customer Tools, and Delivery workflow CTA.
- `pages/home2.html` — **Home 2 ("Your Week, Sorted")**: Split editorial hero, interactive Weekly Basket Builder with live subtotal & Add-to-Cart/List, Breakfast & Morning Essentials, Fresh Fruits & Seasonal Produce, Lunch & Dinner collections, Pantry Cupboard Restock, Household Bundles, Weekly Savings, and List Planner.
- `pages/about.html` — **About**: Supermarket shopping approach, produce & pantry selection, storage guidance, and digital tools.
- `pages/products.html` — **Products Catalogue**: 48 distinct products across Fruits (8), Vegetables (10), Dairy & Eggs (8), Pantry Essentials (12), Bakery (4), and Snacks & Beverages (6), with live search, category tabs, subcategory & sort `FreshSelect` dropdowns, offers-only filter, product detail modal with pack variants, and shopping-list saving.
- `pages/offers.html` — **Offers**: Weekly deals filtered by category and price ceiling, dynamically calculated Household Grocery Bundles, and budget-friendly staples.
- `pages/delivery.html` — **Delivery Info**: Configurable delivery fee/threshold/minimum-order settings, interactive 6-digit PIN-code checker against sample areas, daily time windows, packing guidance, and FAQs.
- `pages/contact.html` — **Contact**: Validated enquiry form with local review preparation state and FAQs.
- `pages/cart.html` — **Shopping Cart**: Shared persistent cart using integer paise math, pack variant switching, free-delivery threshold meter, and savings breakdown.
- `pages/checkout.html` — **Checkout**: Demonstration home-delivery checkout with past-date protection, review/edit flow, immutable local order snapshot, and duplicate-submit prevention.
- `pages/login.html` & `pages/signup.html` — **Authentication**: Split-panel grocery photography forms with password visibility toggles, required validation, and honest feedback for unconnected backend auth/OAuth.
- `pages/dashboard.html` — **Customer Dashboard**: Overview, Shopping Lists workbench (create, rename, delete, check off, selective/full cart merge), My Cart mirror, My Orders (view, download `.txt`, reorder at current prices), Track Order (5-stage timeline with clearly labeled demo preview), Saved Addresses, and Profile preferences.

## Running Locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` in your browser.
