import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE, apiFetch } from "../config";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      apiFetch(`${API_BASE}/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((data) => setOrder(data))
        .catch(() => {});
    }
  }, [orderId]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg, #fffdf9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid var(--border, #f0e0ce)",
        borderRadius: "12px",
        padding: "3rem 2.5rem",
        width: "100%",
        maxWidth: "480px",
        textAlign: "center",
      }}>
        {/* Crown icon */}
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>👑</div>

        <h1 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.7rem",
          fontWeight: 500,
          color: "var(--brown1, #2c1a0e)",
          marginBottom: "0.5rem",
          lineHeight: 1.3,
        }}>
          Order Placed Successfully!
        </h1>

        <p style={{
          fontSize: "0.95rem",
          color: "var(--text2, #6b4f3a)",
          lineHeight: 1.75,
          marginBottom: "1.5rem",
        }}>
          Thank you for your order! We've received it and will contact you shortly to confirm payment and delivery details.
        </p>

        {/* Order details */}
        {order && (
          <div style={{
            background: "var(--bg2, #fff8f4)",
            border: "1px solid var(--border, #f0e0ce)",
            borderRadius: "8px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            textAlign: "left",
          }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brown3, #8b5e3c)", marginBottom: "0.75rem", fontWeight: 500 }}>
              Order Summary
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text, #2c1a0e)", marginBottom: "0.4rem" }}>
              <span>Order ID</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text, #2c1a0e)", marginBottom: "0.4rem" }}>
              <span>Customer</span>
              <span>{order.customer?.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text, #2c1a0e)", marginBottom: "0.4rem" }}>
              <span>Items</span>
              <span>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "var(--brown2, #5c3317)", fontWeight: 600, marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border, #f0e0ce)" }}>
              <span>Total</span>
              <span>${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div style={{
          background: "#f0faf4",
          border: "1px solid #c3e6d0",
          borderRadius: "8px",
          padding: "1.25rem",
          marginBottom: "2rem",
          textAlign: "left",
        }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.75rem", fontWeight: 600 }}>
            What Happens Next?
          </div>
          {[
            "📞 We'll call or WhatsApp you within 24 hours",
            "💳 We'll arrange payment at your convenience",
            "📦 Your order will be packed and shipped",
            "💌 You'll receive delivery updates",
          ].map((step, i) => (
            <div key={i} style={{ fontSize: "0.83rem", color: "#2c5040", marginBottom: "0.5rem", lineHeight: 1.5 }}>
              {step}
            </div>
          ))}
        </div>

        <Link
          to="/"
          style={{
            display: "inline-block",
            background: "var(--brown2, #5c3317)",
            color: "#fff",
            padding: "0.85rem 2rem",
            textDecoration: "none",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            borderRadius: "6px",
            transition: "background 0.2s",
          }}
        >
          Continue Shopping →
        </Link>

        <p style={{ fontSize: "0.75rem", color: "var(--text3, #b08060)", marginTop: "1.25rem" }}>
          Questions? Contact us on WhatsApp or email anytime 💌
        </p>
      </div>
    </div>
  );
}
