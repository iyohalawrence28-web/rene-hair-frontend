// src/admin/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

export default function AdminProtectedRoute({ children }) {
  const { isLoggedIn, checking } = useAdminAuth();

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b6560",
        fontFamily: "DM Mono, monospace",
        fontSize: "0.8rem",
      }}>
        Verifying session...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
