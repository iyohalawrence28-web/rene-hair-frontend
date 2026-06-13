import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";

import { API_BASE, apiFetch } from "../config";
const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal } = useCart();
  const [cartLoading, setCartLoading] = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState(emptyForm);
  const [formErrors, setFormErrors]   = useState({});

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

  const handleClose = () => { setShowForm(false); setFormErrors({}); onClose(); };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setShowForm(true);
  };

  const handleFormSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    if (cartLoading) return;

    setCartLoading(true);
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
      alert("Checkout failed. Please try again.");
      setCartLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cd-backdrop${isOpen ? " cd-backdrop--on" : ""}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <aside className={`cd${isOpen ? " cd--open" : ""}`}>

        {/* Header */}
        <div className="cd__header">
          <h2 className="cd__title">
            {showForm ? "Your Details" : (
              <>Your Cart {cart.length > 0 && <span className="cd__count">{cart.length}</span>}</>
            )}
          </h2>
          <button className="cd__close" onClick={handleClose}>✕</button>
        </div>

        {/* ── Cart view ── */}
        {!showForm && (
          <>
            <div className="cd__body">
              {cart.length === 0 ? (
                <div className="cd__empty">
                  <div className="cd__empty-icon">🛍️</div>
                  <p className="cd__empty-text">Your cart is empty</p>
                  <button className="cd__continue-btn" onClick={handleClose}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="cd__items">
                  {cart.map((item) => (
                    <li key={item._id} className="cd__item">
                      <div className="cd__item-img">
                        {item.images?.[0]
                          ? <img src={`${API_BASE}${item.images[0]}`} alt={item.name} />
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
                <div className="cd__summary-row">
                  <span>Shipping</span>
                  <span className="cd__free">Free</span>
                </div>
                <div className="cd__total-row">
                  <span>Total</span>
                  <span className="cd__total-val">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="cd__checkout-btn" onClick={handleCheckoutClick}>
                  Checkout →
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Checkout form view ── */}
        {showForm && (
          <div className="cd__body cd__body--form">
            <p className="cd__form-subtitle">Enter your details to complete your order</p>

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

              <button className="cd__checkout-btn" onClick={handleFormSubmit} disabled={cartLoading}>
                {cartLoading ? "Redirecting to payment..." : "Continue to Payment →"}
              </button>

              <button
                className="cd__back-btn"
                onClick={() => { setShowForm(false); setFormErrors({}); }}
                disabled={cartLoading}
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

