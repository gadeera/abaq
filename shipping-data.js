// Shared shipping data used by both index.html (via app.js) and product.html

const CITIES_FROM_NAZARETH = [
  { ar: "الناصرة",        en: "Nazareth",         km: 0   },
  { ar: "نوف الجليل",     en: "Nof HaGalil",      km: 3   },
  { ar: "كفر كنا",        en: "Kafr Kanna",        km: 8   },
  { ar: "طرعان",          en: "Tur'an",            km: 10  },
  { ar: "كفر مندا",       en: "Kafr Manda",        km: 12  },
  { ar: "عبلين",          en: "Ibillin",           km: 15  },
  { ar: "عرابة",          en: "Arraba",            km: 15  },
  { ar: "عفولة",          en: "Afula",             km: 16  },
  { ar: "سخنين",          en: "Sakhnin",           km: 20  },
  { ar: "شفاعمرو",        en: "Shefa-Amr",         km: 20  },
  { ar: "رامة",           en: "Rame",              km: 20  },
  { ar: "مجد الكروم",     en: "Majd al-Krum",      km: 20  },
  { ar: "دير حنا",        en: "Deir Hanna",        km: 22  },
  { ar: "المغار",         en: "Maghar",            km: 22  },
  { ar: "كابول",          en: "Kabul",             km: 22  },
  { ar: "أم الفحم",       en: "Umm al-Fahm",       km: 25  },
  { ar: "طمرة",           en: "Tamra",             km: 25  },
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
].sort((a, b) => a.km - b.km);

function getShippingFee(km) {
  if (km <= 20)  return 15;
  if (km <= 50)  return 20;
  if (km <= 100) return 30;
  if (km <= 200) return 40;
  return 50;
}
