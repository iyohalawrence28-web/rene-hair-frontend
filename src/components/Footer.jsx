import "./Footer.css";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__brand-col">
            <div className="footer__logo">Ms <em>Fabulux</em></div>
            <p className="footer__desc">{t("footerDesc")}</p>
          </div>
          <div>
            <div className="footer__col-title">{t("footerShop")}</div>
            <a href="/#shop" className="footer__link">All Wigs</a>
            <a href="/#shop" className="footer__link">Body Wave</a>
            <a href="/#shop" className="footer__link">Straight</a>
            <a href="/#shop" className="footer__link">Curly</a>
          </div>
          <div>
            <div className="footer__col-title">Features</div>
            <a href="/#tryon" className="footer__link">{t("aiTryOn")}</a>
            <span className="footer__link">Order Tracking</span>
            <span className="footer__link">Secure Checkout</span>
          </div>
          <div>
            <div className="footer__col-title">{t("footerHelp")}</div>
            <span className="footer__link">Contact Us</span>
            <span className="footer__link">Returns Policy</span>
            <span className="footer__link">Size Guide</span>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Ms.Fabulux Hairs. {t("allRights")}</span>
          <span>Made with ♥ for queens</span>
        </div>
      </div>
    </footer>
  );
}

