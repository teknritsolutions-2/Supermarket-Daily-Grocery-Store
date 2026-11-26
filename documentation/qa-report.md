# QA Verification Report — FreshAisle Supermarket & Daily Grocery Store

## Environment & Scope

- **Browser Engine Tested**: Headless WebKit (`webkit-2388` via Playwright) served over local HTTP (`127.0.0.1:8788`).
- **Pages Verified (12)**: `index.html`, `pages/home2.html`, `pages/about.html`, `pages/products.html`, `pages/delivery.html`, `pages/offers.html`, `pages/contact.html`, `pages/cart.html`, `pages/checkout.html`, `pages/login.html`, `pages/signup.html`, `pages/dashboard.html`.
- **Viewports Verified (9)**:
  - Mobile: `320×568`, `390×844`, `430×932`
  - Tablet: `768×1024`, `820×1180`, `1024×768`
  - Desktop: `1280×800`, `1440×900`, `1920×1080`
- **Themes & Directions**: Light (`#F8F9F5` / `#FFFFFF`) & Dark (`#101411` / `#171D18`), LTR & RTL (`dir="rtl"`).

## Automated & Visual Matrix Results

- **Matrix checkpoints**: `108` (`12` pages × `9` viewports)
- **Horizontal / Navbar overflows**: `0` (`overflowFailures: []`)
- **Broken images (`naturalWidth === 0`)**: `0` (`brokenImages: []`)
- **Console / uncaught JS runtime errors**: `0` (`consoleErrors: []`)
- **Expanded Dropdown (`FreshSelect`) Checks**: `7 / 7` passed across `pages/products.html` (`1440×900`, `768×1024`, `320×568`), `pages/offers.html` (`390×844`), `pages/contact.html` (`768×1024`), `pages/checkout.html` (`390×844`), and `pages/dashboard.html` (`1440×900`):
  - `isOpen: true`, `inViewport: true`, `noHeaderOverlap: true`, `anchoredClose: true`, `optionFontPx: 15`, `optionHeight: 44–61`.

## End-to-End Functional Journeys Verified

1. **Shopping, Cart & Checkout Journey**:
   - Searched `Apples` on `pages/products.html` (`Showing 1 of 48 products`), opened product detail modal, switched pack size to `2 kg`, incremented quantity to `2`, added to Cart (`₹335 × 2 = ₹670`).
   - Reset filters, filtered `Vegetables`, added `Vine Tomatoes` (`₹42`), verified Cart subtotal & total (`₹712` with free delivery above `₹599`).
   - Tested past-date validation rejection on `pages/checkout.html`, submitted valid details, reviewed and placed demo order (`FA-20261126-9114`), verified Cart cleared to `0`.
   - Opened `pages/dashboard.html#track`, switched demo timeline stage to `3. Packed`, switched to `My Orders`, and reordered items back to Cart (`3` units at current catalogue prices).
2. **Shopping-List Persistence Journey**:
   - Created `Festival Prep`, added catalogue product, incremented quantity, checked item off, transferred checked items to Cart, reloaded page, verified persistent list & cart state, renamed list to `Weekend Pantry`, and deleted list cleanly.
3. **Dark Mode, RTL & Drawers**:
   - Verified dark charcoal background (`rgb(16, 20, 17)`), unmirrored logo/photos, bidirectional `<bdi>` / `unicode-bidi: isolate` formatting on pack sizes and INR prices, and physical-left (`left: 0`) opening of both the site drawer and Dashboard mobile drawer at `390×844`.
4. **Delivery PIN Checker & Auth Validation**:
   - Verified `560038` matches sample `Indiranagar` directory on `pages/delivery.html`.
   - Verified mismatched password rejection on `pages/signup.html` without storing passwords.

## Defects Found & Fixed During QA

1. **Closed Drawers Focus/Locator Visibility**: Added `visibility: hidden` when `.mobile-drawer` and `.dash-drawer` are closed so off-screen drawer items are unreachable until opened.
2. **RTL Bidirectional Pack/Price Text**: Added `direction: ltr; unicode-bidi: isolate;` on prices/packs and `<bdi>` wrappers in `assets/js/dashboard.js` so `1 kg` and `₹346` never flip order in RTL mode.
3. **New Shopping-List Selection Timing**: Fixed `assets/js/dashboard.js` to set `selectedListId = created.id` and call `renderLists()` immediately after creating a list.
4. **320px `home2` Basket Builder Overflow**: Added `min-width: 0` on `.basket-builder > *`, `flex-wrap: wrap` on `.basket-check-row`, and `max-width: 100%` on `.bundle-item-chip` to eliminate a 4px overflow at `320×568`.
5. **`[hidden]` Precedence**: Added `[hidden] { display: none !important; }` in `assets/css/style.css` so inline/flex layouts do not override hidden state.

## Verification Scope & Production Integration Notes

- Browser testing ran in WebKit (`webkit-2388`) via Playwright; Chromium/Firefox physical-device checks were not executed in this environment.
- Authentication, OAuth (`Google`/`Apple`), password reset, enquiry transmission, live PIN-code dispatch availability, real payments, and server-side inventory/order tracking remain frontend demonstrations requiring backend APIs for production deployment.
