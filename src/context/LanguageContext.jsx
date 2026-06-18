import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Navbar
    home: "Home",
    shop: "Shop",
    aiTryOn: "✨ AI Try-On",
    cart: "Cart",

    // Hero
    heroEyebrow: "Premium Collection 2025",
    heroTitle1: "Your",
    heroTitleEm: "Crown",
    heroTitle2: "Your Story",
    heroDesc: "Luxury lace wigs crafted for queens. Try any style with our AI try-on before you buy — see exactly how you'll look.",
    shopCollection: "Shop Collection",
    tryAiLook: "✨ Try AI Look",
    happyClients: "Happy Clients",
    styles: "Styles",
    rating: "Rating",

    // Products
    ourCollection: "Our Collection",
    stylesAvailable: "styles available",
    loading: "Loading...",
    noProducts: "No products available yet.",
    addToCart: "Add to Cart",
    added: "✓ Added!",
    buyNow: "Buy Now",
    tryOn: "✨ Try On",

    // Cart
    yourCart: "Your Cart",
    cartEmpty: "Your cart is empty",
    continueShopping: "Continue Shopping",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    checkout: "Checkout →",
    yourDetails: "Your Details",
    enterDetails: "Enter your details and we'll contact you to confirm your order",
    fullName: "Full Name *",
    emailAddress: "Email Address *",
    phoneNumber: "Phone Number",
    deliveryAddress: "Delivery Address *",
    noPaymentNow: "No payment now. We'll contact you shortly to arrange payment and delivery.",
    placeOrder: "Place Order →",
    placingOrder: "Placing Order...",
    backToCart: "← Back to Cart",
    orderTotal: "Order Total",

    // Success
    orderPlaced: "Order Placed Successfully!",
    orderThankYou: "Thank you! We've received your order and will contact you shortly to confirm payment and delivery.",
    orderSummary: "Order Summary",
    whatNext: "What Happens Next?",
    step1: "📞 We'll call or WhatsApp you within 24 hours",
    step2: "💳 We'll arrange payment at your convenience",
    step3: "📦 Your order will be packed and shipped",
    step4: "💌 You'll receive delivery updates",
    questions: "Questions? Contact us on WhatsApp or email anytime 💌",

    // AI TryOn
    pickStyle: "Pick a Style to Try On",
    chooseWig: "Choose a wig style first — the AI will show it on your photo",
    loadingStyles: "Loading styles...",
    noStyles: "No styles available right now.",
    uploadPhoto: "Upload your photo",
    tapToSelect: "Tap to select a clear face photo",
    photoReady: "✓ Photo uploaded — ready to generate!",
    generateLook: "Generate your look",
    generating: "Generating your look... (~30s)",
    generateBtn: "✨ Generate AI Try-On",
    yourNewLook: "Your new look!",
    shareYourLook: "Share your look",

    // Footer
    footerDesc: "Premium lace wigs for queens who demand quality, style, and confidence in every strand.",
    footerShop: "Shop",
    footerHelp: "Help",
    footerCompany: "Company",
    allRights: "All rights reserved.",
  },

  bg: {
    // Navbar
    home: "Начало",
    shop: "Магазин",
    aiTryOn: "✨ AI Пробване",
    cart: "Количка",

    // Hero
    heroEyebrow: "Премиум Колекция 2025",
    heroTitle1: "Твоята",
    heroTitleEm: "Корона",
    heroTitle2: "Твоята История",
    heroDesc: "Луксозни дантелени перуки, създадени за кралици. Пробвай всеки стил с нашето AI пробване преди да купиш — виж точно как ще изглеждаш.",
    shopCollection: "Разгледай Колекцията",
    tryAiLook: "✨ AI Пробване",
    happyClients: "Доволни Клиенти",
    styles: "Стила",
    rating: "Оценка",

    // Products
    ourCollection: "Нашата Колекция",
    stylesAvailable: "налични стила",
    loading: "Зареждане...",
    noProducts: "Все още няма налични продукти.",
    addToCart: "Добави в Количката",
    added: "✓ Добавено!",
    buyNow: "Купи Сега",
    tryOn: "✨ Пробвай",

    // Cart
    yourCart: "Вашата Количка",
    cartEmpty: "Количката е празна",
    continueShopping: "Продължи Пазаруването",
    shipping: "Доставка",
    free: "Безплатна",
    total: "Общо",
    checkout: "Поръчай →",
    yourDetails: "Вашите Данни",
    enterDetails: "Въведете данните си и ние ще се свържем с вас за потвърждение",
    fullName: "Пълно Ime *",
    emailAddress: "Имейл Адрес *",
    phoneNumber: "Телефонен Номер",
    deliveryAddress: "Адрес за Доставка *",
    noPaymentNow: "Без плащане сега. Ще се свържем с вас скоро за уреждане на плащането и доставката.",
    placeOrder: "Поръчай →",
    placingOrder: "Поръчката се обработва...",
    backToCart: "← Обратно към Количката",
    orderTotal: "Обща Сума",

    // Success
    orderPlaced: "Поръчката е направена успешно!",
    orderThankYou: "Благодарим! Получихме вашата поръчка и ще се свържем с вас скоро за потвърждение на плащането и доставката.",
    orderSummary: "Обобщение на Поръчката",
    whatNext: "Какво следва?",
    step1: "📞 Ще ви се обадим или изпратим WhatsApp в рамките на 24 часа",
    step2: "💳 Ще уредим плащането по удобен за вас начин",
    step3: "📦 Поръчката ви ще бъде опакована и изпратена",
    step4: "💌 Ще получавате актуализации за доставката",
    questions: "Въпроси? Свържете се с нас по WhatsApp или имейл 💌",

    // AI TryOn
    pickStyle: "Изберете Стил за Пробване",
    chooseWig: "Изберете стил на перука — AI ще го покаже върху вашата снимка",
    loadingStyles: "Зареждане на стилове...",
    noStyles: "Няма налични стилове в момента.",
    uploadPhoto: "Качете вашата снимка",
    tapToSelect: "Докоснете, за да изберете ясна снимка на лицето",
    photoReady: "✓ Снимката е качена — готово за генериране!",
    generateLook: "Генерирайте вашия образ",
    generating: "Генериране на образ... (~30 сек)",
    generateBtn: "✨ Генерирай AI Пробване",
    yourNewLook: "Вашият нов образ!",
    shareYourLook: "Споделете своя образ",

    // Footer
    footerDesc: "Премиум дантелени перуки за кралици, които изискват качество, стил и увереност.",
    footerShop: "Магазин",
    footerHelp: "Помощ",
    footerCompany: "Компания",
    allRights: "Всички права запазени.",
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("msfabulux_lang") || "en";
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage || "";
    const isBulgarian = browserLang.toLowerCase().startsWith("bg");
    const hasChosen = localStorage.getItem("msfabulux_lang_chosen");

    if (isBulgarian && !hasChosen) {
      setShowPopup(true);
    }
  }, []);

  const switchTo = (newLang) => {
    setLang(newLang);
    localStorage.setItem("msfabulux_lang", newLang);
    localStorage.setItem("msfabulux_lang_chosen", "true");
    setShowPopup(false);
  };

  const dismissPopup = () => {
    localStorage.setItem("msfabulux_lang_chosen", "true");
    setShowPopup(false);
  };

  const t = (key) => translations[lang]?.[key] || translations["en"][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang: switchTo, t, showPopup, dismissPopup }}>
      {children}

      {/* Language Switch Popup */}
      {showPopup && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999, width: "calc(100% - 2rem)", maxWidth: "400px",
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          animation: "slideUpPopup 0.3s ease",
        }}>
          <style>{`
            @keyframes slideUpPopup {
              from { opacity: 0; transform: translateX(-50%) translateY(20px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🌐</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111", marginBottom: "0.25rem" }}>
                Превключи на български?
              </div>
              <div style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.5 }}>
                Забелязахме, че браузърът ви е на български. Искате ли да превключите езика?
                <br/>
                <span style={{ color: "#999", fontSize: "0.75rem" }}>
                  (We noticed your browser is in Bulgarian. Switch language?)
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => switchTo("bg")}
              style={{
                flex: 1, background: "#E8006C", color: "#fff",
                border: "none", borderRadius: "8px",
                padding: "0.6rem", fontSize: "0.82rem",
                fontWeight: 600, cursor: "pointer",
              }}
            >
              🇧🇬 Да, на български
            </button>
            <button
              onClick={dismissPopup}
              style={{
                flex: 1, background: "#f5f5f5", color: "#333",
                border: "none", borderRadius: "8px",
                padding: "0.6rem", fontSize: "0.82rem",
                fontWeight: 500, cursor: "pointer",
              }}
            >
              🇬🇧 Keep English
            </button>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}