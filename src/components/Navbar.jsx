import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar({ onCartOpen, onTryOnOpen }) {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="nav__inner">

          {/* Brand / Logo */}
          <a href="/" className="nav__brand">
            <img
              src="/logo.png"
              alt="Ms.Fabulux Hairs"
              className="nav__logo-img"
            />
          </a>

          {/* Desktop links */}
          <div className="nav__links">
            <a href="/" className="nav__link">Home</a>
            <a href="/#shop" className="nav__link">Shop</a>
            <button className="nav__link" onClick={() => onTryOnOpen()}>✨ AI Try-On</button>
          </div>

          {/* Right side */}
          <div className="nav__right">
            <button className="nav__cart-btn" onClick={onCartOpen} aria-label="Open cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Cart
              {cartCount > 0 && <span className="nav__badge">{cartCount}</span>}
            </button>

            {/* Hamburger */}
            <button
              className={`nav__burger${menuOpen ? " nav__burger--open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="nav__mobile">
          <a href="/"       className="nav__mobile-link" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/#shop"  className="nav__mobile-link" onClick={() => setMenuOpen(false)}>Shop</a>
          <button className="nav__mobile-link" onClick={() => { setMenuOpen(false); onTryOnOpen(); }}>✨ AI Try-On</button>
          <button className="nav__mobile-cart" onClick={() => { setMenuOpen(false); onCartOpen(); }}>
            🛒 Cart {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      )}
    </>
  );
}

