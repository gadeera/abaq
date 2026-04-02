// products array is loaded from products-data.js

// ── CITIES & SHIPPING ────────────────────────────────────
const CITIES_FROM_NAZARETH = [
  { ar: "الناصرة",        en: "Nazareth",         km: 0   },
  { ar: "نوف הגליל",      en: "Nof HaGalil",      km: 3   },
  { ar: "كفر كنا",        en: "Kafr Kanna",        km: 8   },
  { ar: "طرعان",          en: "Tur'an",            km: 10  },
  { ar: "كفر مندا",       en: "Kafr Manda",        km: 12  },
  { ar: "إبلين",          en: "Ibillin",           km: 15  },
  { ar: "عرابة",          en: "Arraba",            km: 15  },
  { ar: "عفولة",          en: "Afula",             km: 16  },
  { ar: "سخنين",          en: "Sakhnin",           km: 20  },
  { ar: "شفاعمرو",        en: "Shefa-Amr",         km: 20  },
  { ar: "رمة",            en: "Rame",              km: 20  },
  { ar: "مجد الكروم",     en: "Majd al-Krum",      km: 20  },
  { ar: "دير حنا",        en: "Deir Hanna",        km: 22  },
  { ar: "المغار",         en: "Maghar",            km: 22  },
  { ar: "كبول",           en: "Kabul",             km: 22  },
  { ar: "أم الفحم",       en: "Umm al-Fahm",       km: 25  },
  { ar: "تمرة",           en: "Tamra",             km: 25  },
  { ar: "كرميئيل",        en: "Karmiel",           km: 26  },
  { ar: "حيفا",           en: "Haifa",             km: 28  },
  { ar: "طبريا",          en: "Tiberias",          km: 30  },
  { ar: "كفر ياسيف",      en: "Kafr Yasif",        km: 32  },
  { ar: "يركا",           en: "Yarka",             km: 33  },
  { ar: "عرعرة",          en: "Ar'ara",            km: 35  },
  { ar: "عكا",            en: "Acre",              km: 36  },
  { ar: "باقة الغربية",   en: "Baka al-Gharbiyye", km: 38  },
  { ar: "أبو سنان",       en: "Abu Snan",          km: 38  },
  { ar: "نهاريا",         en: "Nahariya",          km: 50  },
  { ar: "جسر الزرقاء",    en: "Jisr az-Zarqa",     km: 50  },
  { ar: "حدرة",           en: "Hadera",            km: 55  },
  { ar: "الطيبة",         en: "Taibeh",            km: 55  },
  { ar: "الطيرة",         en: "Tire",              km: 60  },
  { ar: "نتانيا",         en: "Netanya",           km: 62  },
  { ar: "جلجولية",        en: "Jaljulia",          km: 65  },
  { ar: "كفر قاسم",       en: "Kafr Qasim",        km: 67  },
  { ar: "كفار سابا",      en: "Kfar Saba",         km: 72  },
  { ar: "رعنانا",         en: "Ra'anana",          km: 77  },
  { ar: "بتاح تكفا",      en: "Petah Tikva",       km: 82  },
  { ar: "هرتسليا",        en: "Herzliya",          km: 84  },
  { ar: "اللد",           en: "Lod",               km: 88  },
  { ar: "تل أبيب",        en: "Tel Aviv",          km: 90  },
  { ar: "رمله",           en: "Ramla",             km: 90  },
  { ar: "ريشون لتسيون",   en: "Rishon LeZion",     km: 95  },
  { ar: "رحوفوت",         en: "Rehovot",           km: 100 },
  { ar: "القدس",          en: "Jerusalem",         km: 118 },
  { ar: "أشدود",          en: "Ashdod",            km: 132 },
  { ar: "أشكلون",         en: "Ashkelon",          km: 148 },
  { ar: "رهط",            en: "Rahat",             km: 162 },
  { ar: "بئر السبع",      en: "Beer Sheva",        km: 168 },
  { ar: "ديمونا",         en: "Dimona",            km: 195 },
  { ar: "ميتسبه رمون",    en: "Mitzpe Ramon",      km: 232 },
  { ar: "إيلات",          en: "Eilat",             km: 345 },
].sort((a, b) => a.km - b.km);

function getShippingFee(km) {
  if (km <= 20)  return 15;
  if (km <= 50)  return 20;
  if (km <= 100) return 30;
  if (km <= 200) return 40;
  return 50;
}

// ── STOCK (Supabase) ──────────────────────────────────────
let stockCache = {};

async function loadStock() {
  const { data, error } = await _supabase.from("stock").select("product_id, qty");
  if (error) {
    console.error("Stock load error:", error);
    products.forEach((p) => { stockCache[p.id] = p.stock ?? 0; });
    return;
  }
  data.forEach((row) => { stockCache[row.product_id] = row.qty; });
  // fallback for any product not yet in Supabase
  products.forEach((p) => {
    if (stockCache[p.id] === undefined) stockCache[p.id] = p.stock ?? 0;
  });
}

function getStock(id) {
  return stockCache[id] ?? 0;
}

async function deductStock(id, qty) {
  const newQty = Math.max(0, getStock(id) - qty);
  stockCache[id] = newQty;
  await _supabase.from("stock").update({ qty: newQty }).eq("product_id", id);
}

// ── STATE ────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("abaq_cart") || "[]");

// ── RENDER PRODUCTS ──────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products
    .map((p) => {
      const stock = getStock(p.id);
      const outOfStock = stock === 0;
      return `
    <div class="product-card ${outOfStock ? 'out-of-stock' : ''}">
      <a href="product.html?id=${p.id}" class="product-img-link">
        <div class="product-img">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;object-position:${p.imgPosition || 'center'};filter:${p.imgFilter || 'none'}${outOfStock ? ' grayscale(60%)' : ''};" />` : p.emoji}
          ${outOfStock ? `<div class="stock-badge out">${I18N.t("product.outOfStock")}</div>` : stock <= 3 ? `<div class="stock-badge low">${I18N.t("product.lastItems", { n: stock })}</div>` : ''}
        </div>
      </a>
      <div class="product-info">
        <a href="product.html?id=${p.id}" class="product-name">${I18N.getLang() === 'en' ? (p.nameEn || p.name) : p.name}</a>
        <div class="product-price">₪${p.price.toFixed(2)}</div>
        ${!outOfStock ? `
        <div class="product-qty-row">
          <button class="qty-btn card-qty-btn" data-id="${p.id}" data-delta="-1">−</button>
          <span class="qty-val card-qty-val" data-id="${p.id}">1</span>
          <button class="qty-btn card-qty-btn" data-id="${p.id}" data-delta="1">+</button>
        </div>
        <button class="add-to-cart" data-id="${p.id}">${I18N.t("product.addToCart")}</button>
        ` : `<button class="add-to-cart" disabled style="opacity:.4;cursor:not-allowed;">${I18N.t("product.outOfStock")}</button>`}
      </div>
    </div>`;
    })
    .join("");

  grid.querySelectorAll(".card-qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const delta = Number(btn.dataset.delta);
      const valEl = grid.querySelector(`.card-qty-val[data-id="${id}"]`);
      const stock = getStock(id);
      let qty = Number(valEl.textContent) + delta;
      if (qty < 1) qty = 1;
      if (qty > stock) qty = stock;
      valEl.textContent = qty;
    });
  });

  grid.querySelectorAll(".add-to-cart:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const qty = Number(grid.querySelector(`.card-qty-val[data-id="${id}"]`).textContent);
      addToCart(id, qty);
    });
  });
}

// ── CART LOGIC ───────────────────────────────────────────
function addToCart(id, qty = 1) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  saveCart();
  updateCartUI();
  const displayName = I18N.getLang() === 'en' ? (product.nameEn || product.name) : product.name;
  showToast(I18N.t("toast.added", { name: displayName }));
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem("abaq_cart", JSON.stringify(cart));
}

// ── CART UI ──────────────────────────────────────────────
function updateCartUI() {
  document.getElementById("cartCount").textContent = cart.length;

  const itemsEl = document.getElementById("cartItems");
  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-cart">${I18N.t("cart.empty")}</div>`;
  } else {
    itemsEl.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item-emoji">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:2rem;height:2rem;object-fit:cover;border-radius:6px;" />` : item.emoji}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${I18N.getLang() === 'en' ? (item.nameEn || item.name) : item.name}</div>
          <div class="cart-item-price">₪${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>`
      )
      .join("");

    itemsEl.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        changeQty(Number(btn.dataset.id), Number(btn.dataset.delta))
      );
    });
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("cartSubtotal").textContent = `₪${subtotal.toFixed(2)}`;
  document.getElementById("cartTotal").textContent = `₪${subtotal.toFixed(2)}`;
}

// ── SIDEBAR OPEN/CLOSE ───────────────────────────────────
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

// ── STRIPE PAYMENT ────────────────────────────────────────
// 🔑 Replace with your Stripe publishable key from https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = "pk_test_51THLEbCJ6nAArKJnk3pen4XxhrKiBD99aftwnzQkGNVFHObETPtDpjIIrec4WxDEgK3SQNLEMHrdBRB49CZqrPJG00jXP6anhw";

let stripe, cardElement;

function initStripe() {
  if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) return;
  stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
  const elements = stripe.elements();

  cardElement = elements.create("card", {
    style: {
      base: { fontSize: "16px", color: "#222", "::placeholder": { color: "#aaa" } },
      invalid: { color: "#e94560" },
    },
  });
  cardElement.mount("#cardElement");
  cardElement.on("change", (e) => {
    document.getElementById("cardErrors").textContent = e.error ? e.error.message : "";
  });

  // Apple Pay / Google Pay
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const paymentRequest = stripe.paymentRequest({
    country: "IL",
    currency: "ils",
    total: { label: "عبق", amount: Math.round(total * 100) },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const prButton = elements.create("paymentRequestButton", { paymentRequest });
  paymentRequest.canMakePayment().then((result) => {
    if (result) {
      prButton.mount("#payment-request-button");
      document.getElementById("paymentDivider").style.display = "flex";
    } else {
      document.getElementById("payment-request-button").style.display = "none";
      document.getElementById("paymentDivider").style.display = "none";
    }
  });

  paymentRequest.on("paymentmethod", async (ev) => {
    try {
      const { clientSecret, error: backendError } = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      }).then((r) => r.json());

      if (backendError) throw new Error(backendError);

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      });

      if (error) {
        ev.complete("fail");
      } else {
        ev.complete("success");
        onPaymentSuccess();
      }
    } catch {
      ev.complete("fail");
    }
  });
}

function openPaymentModal() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("paymentTotalDisplay").textContent = `₪${total.toFixed(2)}`;
  document.getElementById("paymentOverlay").classList.add("open");
  document.getElementById("paymentModal").classList.add("open");
  if (!stripe) initStripe();
}

function closePaymentModal() {
  document.getElementById("paymentOverlay").classList.remove("open");
  document.getElementById("paymentModal").classList.remove("open");
}

function onPaymentSuccess() {
  closePaymentModal();
  closeCart();
  cart = [];
  saveCart();
  updateCartUI();
  showToast("تم الدفع بنجاح! شكراً لك 🎉");
}

document.getElementById("closePayment")?.addEventListener("click", closePaymentModal);
document.getElementById("paymentOverlay")?.addEventListener("click", closePaymentModal);

document.getElementById("paymentForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!stripe) return;

  const btn = document.getElementById("payBtn");
  btn.disabled = true;
  btn.textContent = "جارٍ المعالجة...";

  try {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const { clientSecret, error: backendError } = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(total * 100) }),
    }).then((r) => r.json());

    if (backendError) throw new Error(backendError);

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      document.getElementById("cardErrors").textContent = error.message;
    } else {
      onPaymentSuccess();
    }
  } catch (err) {
    document.getElementById("cardErrors").textContent = "حدث خطأ، يرجى المحاولة مجدداً.";
  } finally {
    btn.disabled = false;
    btn.textContent = "ادفع الآن";
  }
});

// ── ORDER MODAL ───────────────────────────────────────────
const WHATSAPP_NUMBER = "972522838766";

function populateCitySelect() {
  const sel = document.getElementById("customerCity");
  const lang = I18N.getLang();
  sel.innerHTML = `<option value="">${I18N.t("order.cityPH")}</option>`;
  CITIES_FROM_NAZARETH.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.km;
    opt.textContent = lang === "en" ? c.en : c.ar;
    sel.appendChild(opt);
  });
}

function updateOrderTotal() {
  const isPickup = document.getElementById("methodPickup").checked;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cityKm = isPickup ? null : Number(document.getElementById("customerCity").value) || null;
  const shipping = isPickup ? 0 : (cityKm !== null ? getShippingFee(cityKm) : null);
  const total = shipping !== null ? subtotal + shipping : subtotal;

  document.getElementById("orderTotalDisplay").textContent = `₪${total.toFixed(2)}`;

  const estimateEl = document.getElementById("shippingEstimate");
  if (!isPickup && cityKm !== null) {
    estimateEl.textContent = `🚚 ${I18N.t("order.shippingFee").replace("{fee}", shipping)}`;
    estimateEl.style.display = "block";
  } else {
    estimateEl.style.display = "none";
  }
}

function setDeliveryMode(isPickup) {
  document.getElementById("cityField").style.display   = isPickup ? "none" : "flex";
  document.getElementById("streetField").style.display = isPickup ? "none" : "flex";
  document.getElementById("pickupInfo").style.display  = isPickup ? "block" : "none";
  document.getElementById("customerCity").required    = !isPickup;
  document.getElementById("customerAddress").required = !isPickup;
  updateOrderTotal();
}

function openOrderModal() {
  populateCitySelect();
  document.getElementById("methodDelivery").checked = true;
  setDeliveryMode(false);
  updateOrderTotal();
  document.getElementById("orderOverlay").classList.add("open");
  document.getElementById("orderModal").classList.add("open");
}

function closeOrderModal() {
  document.getElementById("orderOverlay").classList.remove("open");
  document.getElementById("orderModal").classList.remove("open");
  document.getElementById("orderForm").reset();
}

document.getElementById("closeOrder").addEventListener("click", closeOrderModal);
document.getElementById("orderOverlay").addEventListener("click", closeOrderModal);

document.getElementById("methodDelivery").addEventListener("change", () => setDeliveryMode(false));
document.getElementById("methodPickup").addEventListener("change",   () => setDeliveryMode(true));
document.getElementById("customerCity").addEventListener("change", updateOrderTotal);

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name     = document.getElementById("customerName").value.trim();
  const phone    = document.getElementById("customerPhone").value.trim();
  const notes    = document.getElementById("customerNotes").value.trim();
  const isPickup = document.getElementById("methodPickup").checked;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let shippingFee = 0;
  let locationLine = "";

  if (isPickup) {
    locationLine = `📍 الاستلام: من المتجر في الناصرة`;
  } else {
    const cityKm   = Number(document.getElementById("customerCity").value);
    const cityName = document.getElementById("customerCity").selectedOptions[0]?.text.split(" (~")[0] || "";
    const address  = document.getElementById("customerAddress").value.trim();
    shippingFee    = getShippingFee(cityKm);
    locationLine   = `📍 المدينة: ${cityName}\n🏠 العنوان: ${address}`;
  }

  const total = subtotal + shippingFee;
  const itemsList = cart.map((i) => `• ${i.name} x${i.qty} — ₪${(i.price * i.qty).toFixed(2)}`).join("\n");

  const message =
    `طلب جديد من متجر عبق 🛍️\n` +
    `──────────────────\n` +
    `👤 الاسم: ${name}\n` +
    `📞 الهاتف: ${phone}\n` +
    `${locationLine}\n` +
    (notes ? `📝 ملاحظات: ${notes}\n` : "") +
    `──────────────────\n` +
    `${itemsList}\n` +
    `──────────────────\n` +
    `🛒 المجموع الجزئي: ₪${subtotal.toFixed(2)}\n` +
    (isPickup ? `🏪 الاستلام من المتجر: مجاني\n` : `🚚 الشحن: ₪${shippingFee.toFixed(2)}\n`) +
    `💰 الإجمالي: ₪${total.toFixed(2)}\n` +
    `الدفع عند الاستلام`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  for (const item of cart) { await deductStock(item.id, item.qty); }
  cart = [];
  saveCart();
  updateCartUI();
  renderProducts();
  closeOrderModal();
  closeCart();
  showToast(I18N.t("toast.orderSent"));
});

// ── CHECKOUT ─────────────────────────────────────────────
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast(I18N.t("toast.emptyCart"));
    return;
  }
  openOrderModal();
});

// ── TOAST ────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// ── INIT ─────────────────────────────────────────────────
(async () => {
  await loadStock();
  I18N.init();
})();
