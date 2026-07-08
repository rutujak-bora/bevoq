# BEVOQ Fashion E-Commerce — PRD

## Original Problem Statement
Build a full-stack e-commerce platform for BEVOQ ("The Art of Everyday Luxury") — a fashion/clothing brand selling t-shirts, hoodies, dresses, crop tops, and women's wear. Replace their Shopify store with a custom-built platform including a storefront and full admin panel. Reference: bevoq.shop.

## User Choices
- Payment: **Razorpay** (MOCKED — awaiting API keys)
- Email: **Resend + mocked** (currently MOCKED — logs to backend, awaiting API keys)
- Admin: seed default `admin@bevoq.com / Admin@123`
- Brand: **BEVOQ** — Navy `#0A1A3E` + Gold `#C9A961` luxury palette (per user's brand card)
- Scope: Full storefront + admin panel MVP

## Architecture
- **Backend**: FastAPI + MongoDB (motor async driver), JWT auth (PyJWT), bcrypt password hashing
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn/ui + Recharts + Sonner (toasts)
- **State**: Cart & wishlist in localStorage (synced to server when auth); JWT in localStorage as `bevoq_token`
- **Design**: Cormorant Garamond (serif headings) + Outfit (body); sharp edges, editorial layout

## Personas
- **Shopper** (guest or registered) — browses, filters, adds to cart, checks out
- **Admin** — manages catalog, orders, customers, payments

## Implemented Features (v1 — Feb 2026)
### Storefront
- Home (hero, top collections bento grid, featured products, editorial, trending)
- All Products with filters (category, size, color, price slider, sort)
- Product Detail (gallery, size/color, quantity, stock, add-to-cart, wishlist)
- Collections pages by slug
- Search with trending suggestions
- Cart (client-side, add/update/remove, subtotal, delivery calc)
- Checkout (address, COD/UPI/Card/Razorpay-mock, WELCOME10 coupon, guest or logged-in)
- Order Confirmation
- Wishlist
- My Orders (history with status)
- Account (profile, change password, address book)
- Auth: Register / Login / Forgot Password
- Footer (perks, newsletter with 10% off, links, social)

### Admin Panel
- Separate `/admin/login`
- Dashboard: revenue, orders, customers, low stock, 7-day revenue chart, recent orders/customers
- Products CRUD with variants, tags, images, collections, flags (featured/trending/best-selling)
- Collections CRUD with banner images
- Orders list with filters, detail view, status flow (placed→processing→shipped→delivered/cancelled/refunded), invoice PDF (print)
- Customers list with total spend & order count
- Payments log with COD vs online reconciliation

### Non-Functional
- Bcrypt password hashing, JWT with role-based access control
- Environment-based configuration
- MongoDB with UUID string IDs (never exposes ObjectId)
- `[MOCK EMAIL]` logging for order confirmation + status updates + password reset

## Deferred / Backlog
### P0
- Real Razorpay integration (awaiting API keys from user)
- Real Resend email integration (awaiting API keys)
- Actual logo image upload (user attached brand card only; using text logo currently)

### P1
- Bulk product actions (bulk delete, bulk status update)
- Image upload (currently URL-based; add file upload with object storage)
- Advanced search (fuzzy, category-specific ranking)
- Coupon management UI in admin
- Order tracking with courier integration
- Product reviews & ratings

### P2
- Multi-currency
- Multi-language (i18n)
- Analytics events (GA / Meta pixel)
- Inventory alerts via email
- Loyalty/rewards program
