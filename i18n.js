const I18N = (() => {
  let lang = localStorage.getItem("abaq_lang") || "ar";

  function t(key, vars = {}) {
    let str = TRANSLATIONS[lang]?.[key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, v);
    }
    return str;
  }

  function applyToDOM() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPh);
    });
  }

  function applyDir() {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
  }

  function apply() {
    applyDir();
    applyToDOM();
    if (typeof renderProducts === "function") renderProducts();
    if (typeof renderPage     === "function") renderPage();
    if (typeof updateCartUI  === "function") updateCartUI();
  }

  function toggle() {
    lang = lang === "ar" ? "en" : "ar";
    localStorage.setItem("abaq_lang", lang);
    apply();
    const btn = document.getElementById("langToggleBtn");
    if (btn) btn.textContent = lang === "ar" ? "EN" : "ع";
  }

  function init() {
    apply();
    const btn = document.getElementById("langToggleBtn");
    if (btn) {
      btn.textContent = lang === "ar" ? "EN" : "ع";
      btn.addEventListener("click", toggle);
    }
  }

  return { t, init, apply, getLang: () => lang };
})();
