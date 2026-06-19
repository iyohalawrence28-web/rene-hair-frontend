import ProductCard from "./ProductCard";
import "./ProductGrid.css";
import { useLanguage } from "../context/LanguageContext";

export default function ProductGrid({ products, loading, onTryOnOpen }) {
  const { t } = useLanguage();

  return (
    <div id="shop">
      <div className="pg-section">
        <div className="pg-section__inner">
          <div className="pg-section__head">
            <h2 className="pg-section__title">{t("ourCollection").split(" ")[0]} <em>{t("ourCollection").split(" ").slice(1).join(" ")}</em></h2>
            <span className="pg-section__sub">
              {loading ? t("loading") : `${products.length} ${t("stylesAvailable")}`}
            </span>
          </div>

          {loading && (
            <div className="pg-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="pg-skeleton">
                  <div className="pg-skeleton__img" />
                  <div className="pg-skeleton__body">
                    <div className="pg-skeleton__line pg-skeleton__line--wide" />
                    <div className="pg-skeleton__line" />
                    <div className="pg-skeleton__line pg-skeleton__line--short" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="pg-empty">
              <div className="pg-empty__icon">💇🏾‍♀️</div>
              <p className="pg-empty__text">{t("noProducts")}</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="pg-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onTryOnOpen={onTryOnOpen} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="ai-banner" id="tryon">
        <div className="ai-banner__blob" />
        <div className="ai-banner__inner">
          <div>
            <div className="ai-banner__pill">✨ Powered by GPT Image AI</div>
            <h2 className="ai-banner__title">{t("aiTryOn").replace("✨ ", "")} —<br />{t("tryAiLook").replace("✨ ", "")}</h2>
            <p className="ai-banner__desc">{t("heroDesc")}</p>
          </div>
          <button className="ai-banner__btn" onClick={() => onTryOnOpen()}>
            {t("tryAiLook")} →
          </button>
        </div>
      </section>
    </div>
  );
}

