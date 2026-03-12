// src/admin/AdminAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext(null);

import { API_BASE } from "../config";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token"));
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  // Verify token on load
  useEffect(() => {
    if (!token) { setChecking(false); return; }

    fetch(`${API_BASE}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setAdmin({ username: data.username });
        } else {
          logout();
        }
      })
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, []);

  const login = (newToken, username) => {
    sessionStorage.setItem("admin_token", newToken);
    setToken(newToken);
    setAdmin({ username });
  };

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, admin, login, logout, checking, isLoggedIn: !!token }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
