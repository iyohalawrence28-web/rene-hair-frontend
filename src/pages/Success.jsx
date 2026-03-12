import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Success.css";

import { API_BASE } from "../config";

export default function Success() {
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const { setCart } = useCart();

  useEffect(() => {
    localStorage.removeItem("cart");
    setCart([]);
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    if (!orderId) return;
    fetch(`${API_BASE}/api/orders/${orderId}`)
      .then((res) => res.json())
      .then(setOrder)
      .catch(console.error);
  }, [location.search, setCart]);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-card__icon">✓</div>
        <h1 className="success-card__title">Thank You</h1>
        <p className="success-card__message">Your order has been confirmed and is being prepared.</p>
        {order && (
          <div className="success-card__order">
            <p className="success-card__order-id">Order #{order._id}</p>
            <ul className="success-card__items">
              {order.items.map((item) => (
                <li key={item._id} className="success-card__item">
                  <span>{item.product?.name}</span>
                  <span>×{item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="success-card__total">
              <span>Total Paid</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>
        )}
        <Link to="/" className="success-card__cta">Continue Shopping</Link>
      </div>
    </div>
  );
}