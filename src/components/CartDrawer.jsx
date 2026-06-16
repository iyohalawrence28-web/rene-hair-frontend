import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";

import { API_BASE, apiFetch } from "../config";

const getImageUrl = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${API_BASE}${img}`;
};

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal, clearCart } = useCart();
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess]       = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFormErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim())                               err.name    = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) err.email   = "Valid email is required";
    if (!form.address.trim())                            err.address = "Address is required";
    return err;
  };

  const handleClose = () => {
    setShowForm(false);
    setFormErrors({});
    setSuccess(false);
    onClose();
  };

  const handleFormSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    if (loading) return;

    setLoading(true);
    try {
      const orderRes = await apiFetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ product: i._id, quantity: i.quantity, price: i.price })),
          customer: {
            name:    form.name.trim(),
            email:   form.email.trim(),
            phone:   form.phone.trim(),
            address: form.address.trim(),
          },
          totalAmount: cartTotal,
          paymentStatus: "pending",
          orderStatus: "processing",
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to place order");

      clearCart();
      setSuccess(true);
      setShowForm(false);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`cd-backdrop${isOpen ? " cd-backdrop--on" : ""}`} onClick={handleClose} />
      <aside className={`cd${isOpen ? " cd--open" : ""}`}>

        {/* Header */}
        <div className="cd__header">
          <h2 className="cd__title">
            {success ? "Order Placed! 🎉" : showForm ? "Your Details" : (
              <>Your Cart {cart.length > 0 && <span className="cd__count">{cart.length}</span>}</>
            )}
          </h2>
          <button className="cd__close" onClick={handleClose}>✕</button>
        </div>

        {/* ── Success view ── */}
        {success && (
          <div className="cd__body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "3rem 2rem", gap: "1rem" }}>
            <div style={{ fontSize: "3.5rem" }}>👑</div>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", color: "var(--brown1)", fontWeight: 500 }}>
              Your Order Has Been Placed!
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text2)", lineHeight: 1.7, maxWidth: "280px" }}>
              Thank you! We'll contact you shortly to confirm your order and arrange payment and delivery.
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text3)", lineHeight: 1.6, maxWidth: "280px" }}>
              Keep an eye on your phone and email — we'll reach out within 24 hours. 💌
            </p>
            <button className="cd__checkout-btn" style={{ marginTop: "0.5rem" }} onClick={handleClose}>
              Continue Shopping
            </button>
          </div>
        )}

        {/* ── Cart view ── */}
        {!showForm && !success && (
          <>
            <div className="cd__body">
              {cart.length === 0 ? (
                <div className="cd__empty">
                  <div className="cd__empty-icon">🛍️</div>
                  <p className="cd__empty-text">Your cart is empty</p>
                  <button className="cd__continue-btn" onClick={handleClose}>Continue Shopping</button>
                </div>
              ) : (
                <ul className="cd__items">
                  {cart.map((item) => (
                    <li key={item._id} className="cd__item">
                      <div className="cd__item-img">
                        {item.images?.[0]
                          ? <img src={getImageUrl(item.images[0])} alt={item.name} />
                          : <span>💇🏾‍♀️</span>}
                      </div>
                      <div className="cd__item-info">
                        <p className="cd__item-name">{item.name}</p>
                        <p className="cd__item-unit">${item.price.toFixed(2)} each</p>
                        <div className="cd__qty">
                          <button className="cd__qty-btn" onClick={() => decreaseQuantity(item._id)}>−</button>
                          <span className="cd__qty-val">{item.quantity}</span>
                          <button className="cd__qty-btn" onClick={() => increaseQuantity(item._id)}>+</button>
                        </div>
                      </div>
                      <div className="cd__item-right">
                        <span className="cd__item-total">${(item.price * item.quantity).toFixed(2)}</span>
                        <button className="cd__remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cd__footer">
                <div className="cd__summary-row"><span>Shipping</span><span className="cd__free">Free</span></div>
                <div className="cd__total-row"><span>Total</span><span className="cd__total-val">${cartTotal.toFixed(2)}</span></div>
                <button className="cd__checkout-btn" onClick={() => setShowForm(true)}>
                  Checkout →
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Form view ── */}
        {showForm && !success && (
          <div className="cd__body cd__body--form">
            <p className="cd__form-subtitle">Enter your details and we'll contact you to confirm your order</p>
            <div className="cd__form">
              {[
                { label: "Full Name *",     name: "name",  type: "text",  ph: "Jane Doe" },
                { label: "Email Address *", name: "email", type: "email", ph: "jane@example.com" },
                { label: "Phone Number",    name: "phone", type: "tel",   ph: "+234 800 000 0000" },
              ].map(({ label, name, type, ph }) => (
                <div className="cd__field" key={name}>
                  <label className="cd__label">{label}</label>
                  <input
                    className={`cd__input${formErrors[name] ? " cd__input--err" : ""}`}
                    name={name} type={type} placeholder={ph}
                    value={form[name]} onChange={handleChange}
                  />
                  {formErrors[name] && <span className="cd__err">{formErrors[name]}</span>}
                </div>
              ))}
              <div className="cd__field">
                <label className="cd__label">Delivery Address *</label>
                <textarea
                  className={`cd__input cd__textarea${formErrors.address ? " cd__input--err" : ""}`}
                  name="address" placeholder="Street, City, State, Country"
                  value={form.address} onChange={handleChange} rows={3}
                />
                {formErrors.address && <span className="cd__err">{formErrors.address}</span>}
              </div>
              <div className="cd__order-total">
                <span>Order Total</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)", background: "var(--bg2)", padding: "0.75rem", borderRadius: "4px", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                💳 <strong>No payment now.</strong> We'll contact you shortly to arrange payment and delivery.
              </div>
              <button className="cd__checkout-btn" onClick={handleFormSubmit} disabled={loading}>
                {loading ? "Placing Order..." : "Place Order →"}
              </button>
              <button className="cd__back-btn" onClick={() => { setShowForm(false); setFormErrors({}); }} disabled={loading}>
                ← Back to Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}


