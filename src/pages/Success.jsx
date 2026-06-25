import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE, apiFetch } from "../config";
import SEO from "../components/SEO";

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
    <>
      <SEO
        title="Order Placed Successfully"
        description="Your order has been placed. We will contact you shortly to confirm payment and delivery."
        canonical="/success"
        noindex={true}
      />
      <div style={{
        minHeight: "100vh",
        background: "var(--bg, #ffffff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          background: "#fff",
          border: "1px solid var(--border, #eeeeee)",
          borderRadius: "12px",
          padding: "3rem 2.5rem",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>👑</div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.7rem", fontWeight: 500, color: "var(--black, #111)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text2, #555)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
            Thank you! We've received your order and will contact you shortly to confirm payment and delivery.
          </p>

          {order && (
            <div style={{ background: "var(--bg2, #fafafa)", border: "1px solid var(--border, #eee)", borderRadius: "8px", padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3, #999)", marginBottom: "0.75rem", fontWeight: 500 }}>Order Summary</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text, #111)", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--text3, #999)" }}>Order ID</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>#{order._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text, #111)", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--text3, #999)" }}>Customer</span>
                <span>{order.customer?.name}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--border, #eee)", paddingTop: "0.75rem", marginBottom: "0.75rem" }}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", marginBottom: "0.5rem", gap: "1rem" }}>
                    <span style={{ color: "var(--text, #111)", flex: 1, lineHeight: 1.4 }}>{item.productName || item.product?.name || "Product"} × {item.quantity}</span>
                    <span style={{ color: "var(--pink, #E8006C)", fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", fontWeight: 600, paddingTop: "0.5rem", borderTop: "1px solid var(--border, #eee)" }}>
                <span>Total</span>
                <span style={{ color: "var(--pink, #E8006C)" }}>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div style={{ background: "#f0faf4", border: "1px solid #c3e6d0", borderRadius: "8px", padding: "1.25rem", marginBottom: "2rem", textAlign: "left" }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.75rem", fontWeight: 600 }}>What Happens Next?</div>
            {["📞 We'll call or WhatsApp you within 24 hours", "💳 We'll arrange payment at your convenience", "📦 Your order will be packed and shipped", "💌 You'll receive delivery updates"].map((step, i) => (
              <div key={i} style={{ fontSize: "0.83rem", color: "#2c5040", marginBottom: "0.5rem", lineHeight: 1.5 }}>{step}</div>
            ))}
          </div>

          <Link to="/" style={{ display: "inline-block", background: "var(--pink, #E8006C)", color: "#fff", padding: "0.85rem 2rem", textDecoration: "none", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.08em", borderRadius: "6px" }}>
            Continue Shopping →
          </Link>
          <p style={{ fontSize: "0.75rem", color: "var(--text3, #999)", marginTop: "1.25rem" }}>Questions? Contact us on WhatsApp or email anytime 💌</p>
        </div>
      </div>
    </>
  );
}

