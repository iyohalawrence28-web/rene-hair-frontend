import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import ProductPage from "./pages/ProductPage";
import { LanguageProvider } from "./context/LanguageContext";

// Admin
import { AdminAuthProvider } from "./admin/AdminAuthContext";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminProductForm from "./admin/AdminProductForm";
import AdminOrders from "./admin/AdminOrders";

export default function App() {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <Routes>
          {/* ── Customer Routes ── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Route>

          {/* ── Admin Login (public) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Admin Routes (protected) ── */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </LanguageProvider>
  );
}


