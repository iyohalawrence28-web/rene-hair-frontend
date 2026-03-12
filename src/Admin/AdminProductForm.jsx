import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Admin.css";

import { API_BASE } from "../config";

export default function AdminProductForm() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    texture: "body_wave",
    lengths: "",
    color: "",
    inStock: true,
    previewEnabled: true,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing product when editing
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    fetch(`${API_BASE}/api/products/${id}`)
      .then((r) => r.json())
      .then((product) => {
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          texture: product.texture || "body_wave",
          lengths: product.lengths?.join(", ") || "",
          color: product.color || "",
          inStock: product.inStock ?? true,
          previewEnabled: product.previewEnabled ?? true,
        });
        setExistingImages(product.images || []);
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Parse lengths from comma-separated string
      const lengths = form.lengths
        .split(",")
        .map((l) => Number(l.trim()))
        .filter((l) => !isNaN(l) && l > 0);

      if (imageFiles.length > 0) {
        // Upload with images using FormData
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("texture", form.texture);
        formData.append("lengths", JSON.stringify(lengths));
        formData.append("color", form.color);
        formData.append("inStock", form.inStock);
        formData.append("previewEnabled", form.previewEnabled);

        imageFiles.forEach((file) => formData.append("images", file));

        const res = await fetch(
          isEdit ? `${API_BASE}/api/products/${id}` : `${API_BASE}/api/products`,
          {
            method: isEdit ? "PUT" : "POST",
            body: formData,
          }
        );

        if (!res.ok) throw new Error(await res.text());
      } else {
        // No new images — send JSON
        const body = {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          texture: form.texture,
          lengths,
          color: form.color,
          inStock: form.inStock,
          previewEnabled: form.previewEnabled,
          ...(isEdit && { images: existingImages }),
        };

        const res = await fetch(
          isEdit ? `${API_BASE}/api/products/${id}` : `${API_BASE}/api/products`,
          {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) throw new Error(await res.text());
      }

      setSuccess(isEdit ? "Product updated!" : "Product created!");
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading product...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{isEdit ? "Edit Product" : "Add Product"}</h1>
          <p className="admin-page-subtitle">{isEdit ? `Editing product #${id.slice(-6)}` : "Add a new wig to the catalogue"}</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">

          <div className="admin-field">
            <label className="admin-label">Product Name</label>
            <input
              className="admin-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder='e.g. 20" Body Wave Lace Wig'
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the wig texture, feel, and wear..."
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Price ($)</label>
              <input
                className="admin-input"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="350"
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Texture</label>
              <select
                className="admin-select"
                name="texture"
                value={form.texture}
                onChange={handleChange}
              >
                <option value="straight">Straight</option>
                <option value="body_wave">Body Wave</option>
                <option value="curly">Curly</option>
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Lengths (inches, comma separated)</label>
              <input
                className="admin-input"
                name="lengths"
                value={form.lengths}
                onChange={handleChange}
                placeholder="16, 18, 20, 22"
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Color</label>
              <input
                className="admin-input"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Natural Black"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
                style={{ accentColor: "var(--admin-gold)" }}
              />
              <label htmlFor="inStock" className="admin-label" style={{ marginBottom: 0 }}>In Stock</label>
            </div>

            <div className="admin-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="checkbox"
                id="previewEnabled"
                name="previewEnabled"
                checked={form.previewEnabled}
                onChange={handleChange}
                style={{ accentColor: "var(--admin-gold)" }}
              />
              <label htmlFor="previewEnabled" className="admin-label" style={{ marginBottom: 0 }}>Enable Try-On</label>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="admin-file-input"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
            />
            {/* Show existing images when editing */}
            {isEdit && existingImages.length > 0 && (
              <div className="admin-image-previews">
                {existingImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.startsWith("http") ? img : `${API_BASE}${img}`}
                    alt="existing"
                    className="admin-image-preview"
                  />
                ))}
              </div>
            )}
            {/* Preview newly selected images */}
            {imageFiles.length > 0 && (
              <div className="admin-image-previews">
                {imageFiles.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="admin-image-preview"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
