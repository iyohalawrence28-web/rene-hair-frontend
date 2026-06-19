import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import TryOnModal from "./TryOnModal";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { API_BASE, apiFetch } from "../config";

const emptyForm = { name: "", email: "", phone: "", address: "" };

const getImageUrl = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${API_BASE}${img}`;
};

export default function ProductCard({ product, onTryOnOpen }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading]       = useState(false);
  const [added, setAdded]           = useState(false);
  const [tryOnOpen, setTryOnOpen]   = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const imageUrl = product.images?.length > 0 ? getImageUrl(product.images[0]) : null;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFormErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim())                               err.name    = t("fullName").replace(" *","") + " is required";
    if (!form.email.trim() || !form.email.includes("@")) err.email   = t("emailAddress").replace(" *","") + " is required";
    if (!form.address.trim())                            err.address = t("deliveryAddress").replace(" *","") + " is required";
    return err;
  };

  const closeForm = () => { setShowForm(false); setFormErrors({}); };

  const handleFormSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setLoading(true);
    try {
      const orderRes = await apiFetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ product: product._id, quantity: 1, price: product.price }],
          customer: {
            name:    form.name.trim(),
            email:   form.email.trim(),
            phone:   form.phone.trim(),
            address: form.address.trim(),
          },
          totalAmount: product.price,
          paymentStatus: "pending",
          orderStatus: "processing",
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to place order");
      const order = await orderRes.json();
      closeForm();
      navigate(`/success?orderId=${order._id}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pc">
        <div className="pc__img-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="pc__img" loading="lazy" />
          ) : (
            <div className="pc__img-placeholder"><span>💇🏾‍♀️</span></div>
          )}
          <button className="pc__tryon-pill" onClick={() => onTryOnOpen && onTryOnOpen(product)}>
            {t("tryOn")}
          </button>
        </div>

        <div className="pc__body">
          <h3 className="pc__name">{product.name}</h3>
          {product.texture && <span className="pc__meta">{product.texture}</span>}
          {product.availableLengths?.length > 0 && (
            <div className="pc__lengths">
              {product.availableLengths.map((l) => (
                <span key={l} className="pc__len">{l}"</span>
              ))}
            </div>
          )}
          {product.description && <p className="pc__desc">{product.description}</p>}
          <div className="pc__footer">
            <span className="pc__price">${product.price.toFixed(2)}</span>
            <div className="pc__actions">
              <button className="pc__btn pc__btn--ghost" onClick={handleAddToCart}>
                {added ? t("added") : t("addToCart")}
              </button>
              <button className="pc__btn pc__btn--solid" onClick={() => setShowForm(true)}>
                {t("buyNow")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t("yourDetails")}</h2>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <div className="buynow-summary">
              <span className="buynow-product-name">{product.name}</span>
              <span className="buynow-product-price">${product.price.toFixed(2)}</span>
            </div>
            <p className="buynow-subtitle">{t("enterDetails")}</p>
            <div className="checkout-form">
              {[
                { label: t("fullName"),     name: "name",  type: "text",  placeholder: "Jane Doe" },
                { label: t("emailAddress"), name: "email", type: "email", placeholder: "jane@example.com" },
                { label: t("phoneNumber"),  name: "phone", type: "tel",   placeholder: "+234 800 000 0000" },
              ].map(({ label, name, type, placeholder }) => (
                <div className="checkout-field" key={name}>
                  <label className="checkout-label">{label}</label>
                  <input
                    className={`checkout-input${formErrors[name] ? " checkout-input--err" : ""}`}
                    name={name} type={type} placeholder={placeholder}
                    value={form[name]} onChange={handleChange}
                  />
                  {formErrors[name] && <span className="field-error">{formErrors[name]}</span>}
                </div>
              ))}
              <div className="checkout-field">
                <label className="checkout-label">{t("deliveryAddress")}</label>
                <textarea
                  className={`checkout-input checkout-textarea${formErrors.address ? " checkout-input--err" : ""}`}
                  name="address" placeholder="Street, City, State, Country"
                  value={form.address} onChange={handleChange} rows={3}
                />
                {formErrors.address && <span className="field-error">{formErrors.address}</span>}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)", background: "var(--bg2)", padding: "0.75rem", borderRadius: "4px", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                💳 {t("noPaymentNow")}
              </div>
              <button className="pc__btn pc__btn--solid pc__btn--full" onClick={handleFormSubmit} disabled={loading}>
                {loading ? t("placingOrder") : t("placeOrder")}
              </button>
              <button className="checkout-cancel" onClick={closeForm} disabled={loading}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <TryOnModal product={product} isOpen={tryOnOpen} onClose={() => setTryOnOpen(false)} />
    </>
  );
}

