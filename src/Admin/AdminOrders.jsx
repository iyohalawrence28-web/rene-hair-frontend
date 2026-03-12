import { useEffect, useState } from "react";
import "./Admin.css";

import { API_BASE } from "../config";

const STATUS_COLORS = {
  processing: "admin-badge-gray",
  shipped: "admin-badge-blue",
  delivered: "admin-badge-green",
};

const PAYMENT_COLORS = {
  paid: "admin-badge-green",
  pending: "admin-badge-yellow",
  failed: "admin-badge-red",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/orders`)
      .then((r) => r.json())
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
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
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: "var(--admin-text-dim)" }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td>{order.customer?.name}</td>
                    <td style={{ fontSize: "0.72rem", color: "var(--admin-text-dim)" }}>
                      {order.customer?.email}
                    </td>
                    <td style={{ fontSize: "0.72rem" }}>
                      {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                    </td>
                    <td style={{ fontWeight: 500 }}>${order.totalAmount}</td>
                    <td>
                      <span className={`admin-badge ${PAYMENT_COLORS[order.paymentStatus] || "admin-badge-gray"}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
