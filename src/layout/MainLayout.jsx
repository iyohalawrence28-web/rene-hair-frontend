import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import TryOnModal from "../components/TryOnModal";
import Footer from "../components/Footer";
import ContactPopup from "../components/ContactPopup";
import ChatWidget from "../components/ChatWidget";
import "./MainLayout.css";

export default function MainLayout() {
  const [cartOpen, setCartOpen]         = useState(false);
  const [tryOnOpen, setTryOnOpen]       = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState(null);

  const openTryOn = (product = null) => {
    setTryOnProduct(product);
    setTryOnOpen(true);
  };

  const closeTryOn = () => {
    setTryOnOpen(false);
    setTryOnProduct(null);
  };

  return (
    <div className="main-layout">
      <Navbar
        onCartOpen={() => setCartOpen(true)}
        onTryOnOpen={() => openTryOn(null)}
      />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <TryOnModal
        isOpen={tryOnOpen}
        onClose={closeTryOn}
        product={tryOnProduct}
      />
      <main className="main-layout__content">
        <Outlet context={{ onTryOnOpen: openTryOn }} />
      </main>
      <Footer />

      {/* ── Scroll popup — appears after browsing products ── */}
      <ContactPopup />

      {/* ── Floating WhatsApp chat widget ── */}
      <ChatWidget />
    </div>
  );
}


