# عبق — Abaq E-Commerce Store

A fully responsive bilingual (Arabic/English) e-commerce web application built from scratch, designed for selling handcrafted heritage products and meaningful gift boxes.

🌐 **Live Site:** [abaq-store.net](https://abaq-store.net/)

---

## Features

- 🌍 **Bilingual** — Full Arabic (RTL) and English (LTR) support with one-click language toggle
- 🛒 **Shopping cart** — Persistent cart with quantity controls per product
- 📦 **Live stock management** — Real-time inventory via Supabase database; out-of-stock and low-stock badges
- 🚚 **Smart shipping calculator** — Distance-based shipping fees across 49 cities from Nazareth
- 🤝 **Pickup option** — Customers can choose to pick up from Nazareth
- 💬 **WhatsApp checkout** — Orders sent directly via WhatsApp with full order summary
- 🖼️ **Multi-image product pages** — Individual product detail pages with image galleries
- 📱 **Fully responsive** — Works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Database | Supabase (PostgreSQL) |
| Hosting | Netlify |
| Payments | WhatsApp (cash on delivery) |
| i18n | Custom i18n module |

---

## Project Structure

```
abaq/
├── index.html          # Main shop page
├── product.html        # Product detail page
├── about.html          # About page
├── style.css           # All styles
├── app.js              # Main app logic (cart, stock, orders)
├── products-data.js    # Product catalog
├── translations.js     # AR/EN translations
├── i18n.js             # Language switching module
├── supabase-client.js  # Supabase config (not tracked by git)
└── images/             # Product images
```

---

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/gadeera/abaq.git
cd abaq
```

### 2. Configure Supabase
Create a file called `supabase-client.js`:
```js
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

Create a `stock` table in Supabase with columns:
- `id` (int8, primary key)
- `product_id` (int4)
- `qty` (int4)

### 3. Open locally
Just open `index.html` in your browser — no build step needed.

### 4. Deploy
Drag the project folder to [Netlify Drop](https://app.netlify.com/drop).

---

## Adding Products

Edit the `products` array in `products-data.js`:

```js
{
  id: 10,
  name: "اسم المنتج",
  nameEn: "Product Name",
  desc: "الوصف بالعربي",
  descEn: "Description in English",
  price: 99,
  stock: 10,
  image: "images/my-product.jpg",
  images: ["images/my-product.jpg", "images/my-product-2.jpg"],
}
```

Then update the stock in your Supabase table.

---

## Managing Stock

Go to your [Supabase dashboard](https://supabase.com) → Table Editor → `stock` table and edit the `qty` value directly. Changes reflect immediately on the live site.

---

## License

This project is proprietary. All rights reserved © 2026 Abaq.
