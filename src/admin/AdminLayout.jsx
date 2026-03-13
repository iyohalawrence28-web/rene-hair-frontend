// src/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import "./Admin.css";

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">✦</span>
          <span>René Admin</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            <span className="nav-icon">◈</span> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            <span className="nav-icon">◉</span> Products
          </NavLink>
          <NavLink to="/admin/products/new" className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            <span className="nav-icon">⊕</span> Add Product
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            <span className="nav-icon">◎</span> Orders
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          {admin && (
            <div style={{ padding: "0 0.75rem 0.75rem", fontSize: "0.7rem", color: "var(--admin-text-dim)" }}>
              Signed in as <strong style={{ color: "var(--admin-gold)" }}>{admin.username}</strong>
            </div>
          )}
          <NavLink to="/" className="admin-nav-link">
            <span className="nav-icon">←</span> Back to Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="admin-nav-link"
            style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", color: "var(--admin-danger)" }}
          >
            <span className="nav-icon">⊗</span> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}