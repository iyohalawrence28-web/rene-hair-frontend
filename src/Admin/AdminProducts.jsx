import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

import { API_BASE } from "../config";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="admin-loading">Loading products...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{products.length} wigs in catalogue</p>
        </div>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          ⊕ Add Product
        </Link>
      </div>

      <div className="admin-card">
        {products.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">◉</div>
            <p>No products yet. Add your first wig.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Texture</th>
                  <th>Lengths</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0].startsWith("http") ? product.images[0] : `${API_BASE}${product.images[0]}`}
                          alt={product.name}
                          className="admin-table-img"
                        />
                      ) : (
                        <div className="admin-table-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text-dim)", fontSize: "1.2rem" }}>◉</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--admin-text-dim)", marginTop: "0.15rem" }}>
                        {product.description?.slice(0, 50)}...
                      </div>
                    </td>
                    <td>${product.price}</td>
                    <td>
                      <span className="admin-badge admin-badge-blue">
                        {product.texture?.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.72rem", color: "var(--admin-text-dim)" }}>
                      {product.lengths?.join(", ")}″
                    </td>
                    <td>
                      <span className={`admin-badge ${product.inStock ? "admin-badge-green" : "admin-badge-red"}`}>
                        {product.inStock ? "In Stock" : "Out"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(product._id)}
                          disabled={deleting === product._id}
                        >
                          {deleting === product._id ? "..." : "Delete"}
                        </button>
                      </div>
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
