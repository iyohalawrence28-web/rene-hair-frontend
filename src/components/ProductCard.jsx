import { useState } from "react";
import { useCart } from "../context/CartContext";
import TryOnModal from "./TryOnModal";
import "./ProductCard.css";

import { API_BASE, apiFetch } from "../config";
const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function ProductCard({ product, onTryOnOpen }) {
  const { addToCart } = useCart();

  const [loadingBuy, setLoadingBuy] = useState(false);
  const [added, setAdded]           = useState(false);
  const [tryOnOpen, setTryOnOpen]   = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const imageUrl =
    product.images?.length > 0 ? `${API_BASE}${product.images[0]}` : null;

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
    if (!form.name.trim())                              err.name    = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) err.email  = "Valid email is required";
    if (!form.address.trim())                           err.address = "Address is required";
    return err;
  };

  const closeForm = () => { setShowForm(false); setFormErrors({}); };

  const handleFormSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setLoadingBuy(true);
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
        }),
      });
      const order = await orderRes.json();

      const stripeRes = await apiFetch(`${API_BASE}/api/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id }),
      });
      const { url } = await stripeRes.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
      setLoadingBuy(false);
    }
  };

  return (
    <>
      {/* ══ Product Card ══ */}
      <div className="pc">
        <div className="pc__img-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="pc__img" loading="lazy" />
          ) : (
            <div className="pc__img-placeholder"><span>💇🏾‍♀️</span></div>
          )}
          <button className="pc__tryon-pill" onClick={() => onTryOnOpen && onTryOnOpen(product)}>
            ✨ Try On
          </button>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="pc__stock-badge">Only {product.stock} left</span>
          )}
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
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
              <button
                className="pc__btn pc__btn--solid"
                onClick={() => setShowForm(true)}
                disabled={loadingBuy}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Buy Now Modal ══ */}
      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2 className="modal-title">Your Details</h2>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>

            <div className="buynow-summary">
              <span className="buynow-product-name">{product.name}</span>
              <span className="buynow-product-price">${product.price.toFixed(2)}</span>
            </div>

            <p className="buynow-subtitle">Enter your details to complete your order</p>

            <div className="checkout-form">
              {[
                { label: "Full Name *",       name: "name",    type: "text",  placeholder: "Jane Doe" },
                { label: "Email Address *",   name: "email",   type: "email", placeholder: "jane@example.com" },
                { label: "Phone Number",      name: "phone",   type: "tel",   placeholder: "+234 800 000 0000" },
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
                <label className="checkout-label">Delivery Address *</label>
                <textarea
                  className={`checkout-input checkout-textarea${formErrors.address ? " checkout-input--err" : ""}`}
                  name="address" placeholder="Street, City, State, Country"
                  value={form.address} onChange={handleChange} rows={3}
                />
                {formErrors.address && <span className="field-error">{formErrors.address}</span>}
              </div>

              <button
                className="pc__btn pc__btn--solid pc__btn--full"
                onClick={handleFormSubmit}
                disabled={loadingBuy}
              >
                {loadingBuy ? "Redirecting to payment..." : "Continue to Payment →"}
              </button>

              <button className="checkout-cancel" onClick={closeForm} disabled={loadingBuy}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <TryOnModal product={product} isOpen={tryOnOpen} onClose={() => setTryOnOpen(false)} />
    </>
  );
}

