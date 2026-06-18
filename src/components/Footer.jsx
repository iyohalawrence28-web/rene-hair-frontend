import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">

        <div className="footer__grid">
          {/* Brand col */}
          <div className="footer__brand-col">
            <div className="footer__logo">Ms <em>Fabulux</em></div>
            <p className="footer__desc">
              Premium lace wigs for the modern woman.
              Quality you can feel, style you can see.
            </p>
          </div>

          {/* Shop col */}
          <div>
            <div className="footer__col-title">Shop</div>
            <a href="/#shop" className="footer__link">All Wigs</a>
            <a href="/#shop" className="footer__link">Body Wave</a>
            <a href="/#shop" className="footer__link">Straight</a>
            <a href="/#shop" className="footer__link">Curly</a>
          </div>

          {/* Features col */}
          <div>
            <div className="footer__col-title">Features</div>
            <a href="/#tryon" className="footer__link">AI Try-On</a>
            <span className="footer__link">Order Tracking</span>
            <span className="footer__link">Secure Checkout</span>
          </div>

          {/* Support col */}
          <div>
            <div className="footer__col-title">Support</div>
            <span className="footer__link">Contact Us</span>
            <span className="footer__link">Returns Policy</span>
            <span className="footer__link">Size Guide</span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} ms Fabulux. All rights reserved.</span>
          <span>Made with ♥ for queens</span>
        </div>

      </div>
    </footer>
  );
}
