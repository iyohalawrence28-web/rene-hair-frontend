import { useEffect, useState } from "react";
import "./Admin.css";

import { API_BASE, apiFetch } from "../config";

const PAYMENT_COLORS = {
  paid: "admin-badge-green",
  pending: "admin-badge-yellow",
  failed: "admin-badge-red",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    apiFetch(`${API_BASE}/api/orders`)
      .then((r) => r.json())
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await apiFetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">
            {orders.length} total · ${totalRevenue.toLocaleString()} revenue
          </p>
        </div>
      </div>

      <div className="admin-card">
        {orders.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">◎</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr key={order._id} style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                      <td style={{ fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: "var(--admin-text-dim)" }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.customer?.name}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--admin-text-dim)", marginTop: "2px" }}>{order.customer?.address}</div>
                      </td>
                      <td style={{ fontSize: "0.72rem" }}>
                        <div>{order.customer?.email}</div>
                        {order.customer?.phone && (
                          <div style={{ color: "var(--admin-gold)", marginTop: "2px", fontWeight: 500 }}>
                            📞 {order.customer?.phone}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: "0.78rem" }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ marginBottom: "3px", lineHeight: 1.4 }}>
                            <span style={{ fontWeight: 500 }}>
                              {item.productName || item.product?.name || "Product"}
                            </span>
                            <span style={{ color: "var(--admin-text-dim)", marginLeft: "4px" }}>
                              × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--admin-gold)" }}>${order.totalAmount}</td>
                      <td>
                        <span className={`admin-badge ${PAYMENT_COLORS[order.paymentStatus] || "admin-badge-gray"}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="admin-select"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td style={{ color: "var(--admin-text-dim)", fontSize: "0.72rem" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expanded === order._id && (
                      <tr key={`${order._id}-expanded`}>
                        <td colSpan={8} style={{ background: "var(--admin-bg2, #1a1a2e)", padding: "1rem 1.5rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", fontSize: "0.78rem" }}>
                            <div>
                              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-gold)", marginBottom: "0.5rem" }}>Customer Details</div>
                              <div><strong>Name:</strong> {order.customer?.name}</div>
                              <div><strong>Email:</strong> {order.customer?.email}</div>
                              <div><strong>Phone:</strong> {order.customer?.phone || "—"}</div>
                              <div><strong>Address:</strong> {order.customer?.address}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-gold)", marginBottom: "0.5rem" }}>Items Ordered</div>
                              {order.items?.map((item, i) => (
                                <div key={i} style={{ marginBottom: "4px" }}>
                                  {item.productName || item.product?.name || "Product"} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-gold)", marginBottom: "0.5rem" }}>Order Info</div>
                              <div><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</div>
                              <div><strong>Total:</strong> ${order.totalAmount}</div>
                              <div><strong>Payment:</strong> {order.paymentStatus}</div>
                              <div><strong>Status:</strong> {order.orderStatus}</div>
                              <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

