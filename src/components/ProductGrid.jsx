import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, loading, onTryOnOpen }) {

  return (
    <div id="shop">
      {/* ── Section Header ── */}
      <div className="pg-section">
        <div className="pg-section__inner">
          <div className="pg-section__head">
            <h2 className="pg-section__title">Our <em>Collection</em></h2>
            <span className="pg-section__sub">
              {loading ? "Loading..." : `${products.length} style${products.length !== 1 ? "s" : ""} available`}
            </span>
          </div>

          {/* Skeleton */}
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

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div className="pg-empty">
              <div className="pg-empty__icon">💇🏾‍♀️</div>
              <p className="pg-empty__text">No products available yet.</p>
              <p className="pg-empty__sub">Check back soon — new styles are on the way!</p>
            </div>
          )}

          {/* Grid */}
          {!loading && products.length > 0 && (
            <div className="pg-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onTryOnOpen={onTryOnOpen} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── AI Banner ── */}
      <section className="ai-banner" id="tryon">
        <div className="ai-banner__blob" />
        <div className="ai-banner__inner">
          <div>
            <div className="ai-banner__pill">✨ Powered by GPT Image AI</div>
            <h2 className="ai-banner__title">Try Any Wig Before<br />You Buy It</h2>
            <p className="ai-banner__desc">
              Upload your selfie and our AI shows you exactly how any wig looks on your
              face. No guessing. No returns.
            </p>
          </div>
          {/* ✅ Now opens modal instead of scrolling */}
          <button className="ai-banner__btn" onClick={() => onTryOnOpen()}>
            Try It Free →
          </button>
        </div>
      </section>
    </div>
  );
}

