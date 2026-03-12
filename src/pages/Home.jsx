import { useOutletContext } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { onTryOnOpen } = useOutletContext();
  const { products, loading } = useProducts();
  return (
    <>
      <Hero onTryOnOpen={onTryOnOpen} />
      <Features />
      <ProductGrid products={products} loading={loading} onTryOnOpen={onTryOnOpen} />
    </>
  );
}
