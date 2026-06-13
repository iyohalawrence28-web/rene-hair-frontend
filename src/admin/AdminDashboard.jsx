import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

import { API_BASE, apiFetch } from "../config";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          apiFetch(`${API_BASE}/api/products`),
          apiFetch(`${API_BASE}/api/orders`),
        ]);
        const products = await productsRes.json();
        const orders = await ordersRes.json();

        const revenue = orders
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + o.totalAmount, 0);

        const pending = orders.filter((o) => o.orderStatus === "processing").length;

        setStats({
          products: products.length,
          orders: orders.length,
          revenue,
          pending,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">René Hair overview</p>
        </div>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          ⊕ Add Product
        </Link>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Products</div>
          <div className="admin-stat-value">{stats.products}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Orders</div>
          <div className="admin-stat-value">{stats.orders}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Revenue</div>
          <div className="admin-stat-value">${stats.revenue.toLocaleString()}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Processing</div>
          <div className="admin-stat-value">{stats.pending}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-page-header" style={{ marginBottom: "1rem", paddingBottom: "0.75rem" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: 500 }}>
            Recent Orders
          </h2>
          <Link to="/admin/orders" className="admin-btn admin-btn-ghost admin-btn-sm">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
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
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: "var(--admin-text-dim)" }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td>{order.customer?.name}</td>
                    <td>${order.totalAmount}</td>
                    <td>
                      <span className={`admin-badge ${
                        order.paymentStatus === "paid" ? "admin-badge-green" :
                        order.paymentStatus === "failed" ? "admin-badge-red" : "admin-badge-yellow"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        order.orderStatus === "delivered" ? "admin-badge-green" :
                        order.orderStatus === "shipped" ? "admin-badge-blue" : "admin-badge-gray"
                      }`}>
                        {order.orderStatus}
                      </span>
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
