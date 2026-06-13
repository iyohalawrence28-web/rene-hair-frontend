import { useEffect, useState } from "react";
import { API_BASE, apiFetch } from "../config";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  return { products, loading };
}