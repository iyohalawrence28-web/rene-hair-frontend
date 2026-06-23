import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, apiFetch } from "../config";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import "./ProductPage.css";

const getImageUrl = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${API_BASE}${img}`;
};

const TEXTURE_LABELS = {
  en: { straight: "Straight", body_wave: "Body Wave", curly: "Curly", water_wave: "Water Wave", deep_wave: "Deep Wave", kinky: "Kinky" },
  bg: { straight: "Права", body_wave: "Вълнообразна", curly: "Къдрава", water_wave: "Водни вълни", deep_wave: "Дълбоки вълни", kinky: "Кинки" },
};

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [formErrors, setFormErrors] = useState({});
  const [ordering, setOrdering] = useState(false);
  const [selectedLength, setSelectedLength] = useState(null);

  useEffect(() => {
    apiFetch(`${API_BASE}/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        if (data.lengths?.length > 0) setSelectedLength(data.lengths[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // SEO: update page title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Ms.Fabulux Hairs`;
    }
    return () => { document.title = "Ms.Fabulux Hairs"; };
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Required";
    if (!form.email.trim() || !form.email.includes("@")) err.email = "Valid email required";
    if (!form.address.trim()) err.address = "Required";
    return err;
  };

  const handleOrder = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setOrdering(true);
    try {
      const orderRes = await apiFetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ product: product._id, quantity: 1, price: product.price }],
          customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), address: form.address.trim() },
          totalAmount: product.price,
          paymentStatus: "pending",
          orderStatus: "processing",
        }),
      });
      if (!orderRes.ok) throw new Error();
      const order = await orderRes.json();
      navigate(`/success?orderId=${order._id}`);
    } catch {
      alert("Something went wrong. Please try again.");
      setOrdering(false);
    }
  };

  // SEO content generator
  const getSEOContent = (p) => {
    const textureEn = TEXTURE_LABELS.en[p.texture] || p.texture || "Lace";
    const textureBg = TEXTURE_LABELS.bg[p.texture] || p.texture || "Дантела";
    const lengths = p.lengths?.join('", ') + '"';

    return {
      en: {
        h2: `About the ${p.name}`,
        p1: `The ${p.name} is one of our premium lace wigs designed for women who want a natural, beautiful look without compromise. Crafted with ${textureEn.toLowerCase()} texture, this wig delivers volume, movement, and a seamless blend that looks like your own hair.`,
        p2: `Available in lengths ${lengths}, this wig suits every occasion — from everyday wear to special events. The HD lace melts perfectly into your scalp for an undetectable hairline that turns heads.`,
        h3: `Why Choose This Wig?`,
        bullets: [
          "100% premium human hair — feels and styles like natural hair",
          `${textureEn} texture — perfect for a natural, effortless look`,
          `Available in ${p.lengths?.length} different lengths for your perfect style`,
          "Lightweight and breathable lace for comfortable all-day wear",
          "Try it with our AI Try-On before you buy",
        ],
        h3b: `Who Is This Wig For?`,
        p3: `The ${p.name} is perfect for women looking for a high-quality lace wig in Sofia and across Bulgaria. Whether you want to add length, volume, or completely transform your look, this wig delivers salon-quality results at home.`,
        cta: `Order the ${p.name} today and we'll contact you within 24 hours to arrange delivery.`,
      },
      bg: {
        h2: `За ${p.name}`,
        p1: `${p.name} е една от нашите премиум дантелени перуки, създадена за жени, които искат естествен и красив вид без компромис. Изработена с ${textureBg.toLowerCase()} текстура, тази перука осигурява обем, движение и безшевно смесване, което изглежда като вашата собствена коса.`,
        p2: `Налична в дължини ${lengths}, тази перука е подходяща за всеки повод — от ежедневно носене до специални събития. HD дантелата се слива перфектно с кожата ви за неоткриваема линия на косата.`,
        h3: `Защо да изберете тази перука?`,
        bullets: [
          "100% естествена човешка коса — усеща се и се стайлира като естествена",
          `${textureBg} текстура — перфектна за естествен, лесен вид`,
          `Налична в ${p.lengths?.length} различни дължини за вашия перфектен стил`,
          "Лека и дишаща дантела за комфортно носене през целия ден",
          "Пробвайте я с нашето AI пробване преди покупка",
        ],
        h3b: `За кого е тази перука?`,
        p3: `${p.name} е перфектна за жени, търсещи висококачествена дантелена перука в София и из цяла България. Независимо дали искате да добавите дължина, обем или напълно да промените визията си, тази перука осигурява резултати от салон у дома.`,
        cta: `Поръчайте ${p.name} днес и ще се свържем с вас в рамките на 24 часа за уреждане на доставката.`,
      }
    };
  };

  if (loading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="pp__loading">Loading...</div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div>Product not found. <button onClick={() => navigate("/")}>Go back</button></div>
    </div>
  );

  const imageUrl = product.images?.[0] ? getImageUrl(product.images[0]) : null;
  const seo = getSEOContent(product);
  const content = lang === "bg" ? seo.bg : seo.en;
  const textureLabel = lang === "bg" ? TEXTURE_LABELS.bg[product.texture] : TEXTURE_LABELS.en[product.texture];

  return (
    <div className="pp">
      {/* Breadcrumb */}
      <div className="pp__breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <a href="/#shop">{lang === "bg" ? "Магазин" : "Shop"}</a>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      {/* Main product section */}
      <div className="pp__main">

        {/* Image */}
        <div className="pp__img-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="pp__img" />
          ) : (
            <div className="pp__img-placeholder">💇🏾‍♀️</div>
          )}
          <div className="pp__img-badge">✨ AI Try-On Available</div>
        </div>

        {/* Info */}
        <div className="pp__info">
          {textureLabel && <div className="pp__texture-tag">{textureLabel}</div>}
          <h1 className="pp__name">{product.name}</h1>
          <div className="pp__price">${product.price.toFixed(2)}</div>

          {product.description && (
            <p className="pp__desc">{product.description}</p>
          )}

          {/* Length selector */}
          {product.lengths?.length > 0 && (
            <div className="pp__lengths">
              <div className="pp__lengths-label">
                {lang === "bg" ? "Изберете дължина:" : "Select Length:"}
              </div>
              <div className="pp__lengths-grid">
                {product.lengths.map(l => (
                  <button
                    key={l}
                    className={`pp__len-btn${selectedLength === l ? " pp__len-btn--active" : ""}`}
                    onClick={() => setSelectedLength(l)}
                  >
                    {l}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className={`pp__stock${product.inStock ? " pp__stock--in" : " pp__stock--out"}`}>
            {product.inStock
              ? (lang === "bg" ? "✓ В наличност" : "✓ In Stock")
              : (lang === "bg" ? "✗ Изчерпан" : "✗ Out of Stock")}
          </div>

          {/* No payment notice */}
          <div className="pp__notice">
            💳 {lang === "bg"
              ? "Без плащане сега — ще се свържем с вас за потвърждение"
              : "No payment now — we'll contact you to confirm"}
          </div>

          {/* Actions */}
          <div className="pp__actions">
            <button className="pp__btn pp__btn--cart" onClick={handleAddToCart}>
              {added ? "✓ Added!" : (lang === "bg" ? "Добави в количката" : "Add to Cart")}
            </button>
            <button className="pp__btn pp__btn--buy" onClick={() => setShowForm(true)}>
              {lang === "bg" ? "Купи сега" : "Buy Now"}
            </button>
          </div>

          {/* Features */}
          <div className="pp__features">
            {["👑 100% Human Hair", "🚚 Free Shipping", "✨ AI Try-On", "💌 24h Contact"].map(f => (
              <div key={f} className="pp__feature">{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Order form */}
      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{lang === "bg" ? "Вашите данни" : "Your Details"}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="buynow-summary">
              <span className="buynow-product-name">{product.name}</span>
              <span className="buynow-product-price">${product.price.toFixed(2)}</span>
            </div>
            <div className="checkout-form">
              {[
                { label: lang === "bg" ? "Пълно Ime *" : "Full Name *", name: "name", type: "text", ph: "Jane Doe" },
                { label: lang === "bg" ? "Имейл *" : "Email *", name: "email", type: "email", ph: "jane@example.com" },
                { label: lang === "bg" ? "Телефон" : "Phone", name: "phone", type: "tel", ph: "+359..." },
              ].map(({ label, name, type, ph }) => (
                <div className="checkout-field" key={name}>
                  <label className="checkout-label">{label}</label>
                  <input
                    className={`checkout-input${formErrors[name] ? " checkout-input--err" : ""}`}
                    name={name} type={type} placeholder={ph}
                    value={form[name]}
                    onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                  />
                  {formErrors[name] && <span className="field-error">{formErrors[name]}</span>}
                </div>
              ))}
              <div className="checkout-field">
                <label className="checkout-label">{lang === "bg" ? "Адрес *" : "Delivery Address *"}</label>
                <textarea
                  className={`checkout-input checkout-textarea${formErrors.address ? " checkout-input--err" : ""}`}
                  name="address" placeholder="Street, City..."
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  rows={3}
                />
                {formErrors.address && <span className="field-error">{formErrors.address}</span>}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)", background: "var(--bg2)", padding: "0.75rem", borderRadius: "4px", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                💳 {lang === "bg" ? "Без плащане сега. Ще се свържем с вас скоро." : "No payment now. We'll contact you shortly."}
              </div>
              <button className="pc__btn pc__btn--solid pc__btn--full" onClick={handleOrder} disabled={ordering}>
                {ordering ? "..." : (lang === "bg" ? "Поръчай →" : "Place Order →")}
              </button>
              <button className="checkout-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* SEO Blog Content */}
      <div className="pp__seo">
        <div className="pp__seo-inner">

          {/* English */}
          <div className="pp__seo-block">
            <h2 className="pp__seo-h2">{seo.en.h2}</h2>
            <p className="pp__seo-p">{seo.en.p1}</p>
            <p className="pp__seo-p">{seo.en.p2}</p>
            <h3 className="pp__seo-h3">{seo.en.h3}</h3>
            <ul className="pp__seo-list">
              {seo.en.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <h3 className="pp__seo-h3">{seo.en.h3b}</h3>
            <p className="pp__seo-p">{seo.en.p3}</p>
            <p className="pp__seo-cta">{seo.en.cta}</p>
          </div>

          <div className="pp__seo-divider">🇧🇬</div>

          {/* Bulgarian */}
          <div className="pp__seo-block">
            <h2 className="pp__seo-h2">{seo.bg.h2}</h2>
            <p className="pp__seo-p">{seo.bg.p1}</p>
            <p className="pp__seo-p">{seo.bg.p2}</p>
            <h3 className="pp__seo-h3">{seo.bg.h3}</h3>
            <ul className="pp__seo-list">
              {seo.bg.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <h3 className="pp__seo-h3">{seo.bg.h3b}</h3>
            <p className="pp__seo-p">{seo.bg.p3}</p>
            <p className="pp__seo-cta">{seo.bg.cta}</p>
          </div>

        </div>
      </div>

      {/* Back to shop */}
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <a href="/#shop" className="pp__back">← {lang === "bg" ? "Обратно към магазина" : "Back to Shop"}</a>
      </div>
    </div>
  );
}