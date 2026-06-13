import { useEffect, useState } from "react";
import "./Hero.css";

import { API_BASE, apiFetch } from "../config";

const FALLBACK = [
  { emoji: "💇🏾‍♀️", name: "Body Wave Lace",  sub: '20" · Natural Black', price: "$350", bg: "ci1", badge: "New" },
  { emoji: "🌊",     name: "Deep Wave HD",    sub: '18" · Dark Brown',    price: "$420", bg: "ci2" },
  { emoji: "✨",     name: "Silk Straight",   sub: '24" · Blonde',        price: "$380", bg: "ci3" },
  { emoji: "🌀",     name: "Kinky Curly",     sub: '16" · Natural',       price: "$395", bg: "ci4" },
];
const BGS = ["ci1", "ci2", "ci3", "ci4"];

export default function Hero({ onTryOnOpen }) {
  const [cards, setCards] = useState(FALLBACK);

  useEffect(() => {
    apiFetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.products ?? []);
        if (list.length === 0) return;
        setCards(
          list.slice(0, 4).map((p, i) => ({
            _id:   p._id,
            image: p.images?.[0] ? `${API_BASE}${p.images[0]}` : null,
            emoji: FALLBACK[i]?.emoji ?? "💇🏾‍♀️",
            name:  p.name,
            sub:   `${p.availableLengths?.[0] ? `${p.availableLengths[0]}" · ` : ""}${p.texture || "Lace Wig"}`,
            price: `$${Number(p.price).toFixed(2)}`,
            bg:    BGS[i],
            badge: i === 0 ? "New" : null,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section className="hero">
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />

      <div className="hero__inner">

        {/* ── Left ── */}
        <div className="hero__left">
          <div className="hero__pill">✦ Premium Collection 2025</div>
          <h1 className="hero__title">Your <em>Crown</em>,<br />Your Story</h1>
          <p className="hero__desc">
            Luxury lace wigs crafted for queens. Try any style before you buy
            with our AI try-on — see exactly how you'll look.
          </p>
          <div className="hero__btns">
            <a href="#shop" className="hero__btn hero__btn--solid">Shop Collection</a>
            <button className="hero__btn hero__btn--outline" onClick={() => onTryOnOpen()}>
              ✨ Try AI Look
            </button>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><span className="hero__stat-n">500+</span><span className="hero__stat-l">Happy Clients</span></div>
            <div className="hero__stat"><span className="hero__stat-n">20+</span><span className="hero__stat-l">Styles</span></div>
            <div className="hero__stat"><span className="hero__stat-n">4.9★</span><span className="hero__stat-l">Rating</span></div>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="hero__right">
          {cards.map((c) => (
            <div className="hero__card" key={c._id ?? c.name}>
              <div className={`hero__card-img ${c.bg}`}>
                {c.image
                  ? <img src={c.image} alt={c.name} className="hero__card-photo" />
                  : <span>{c.emoji}</span>
                }
                {c.badge && <span className="hero__card-badge">{c.badge}</span>}
                <button className="hero__card-tryon" onClick={() => onTryOnOpen()}>✨ Try On</button>
              </div>
              <div className="hero__card-body">
                <div className="hero__card-name">{c.name}</div>
                <div className="hero__card-sub">{c.sub}</div>
                <div className="hero__card-foot">
                  <span className="hero__card-price">{c.price}</span>
                  <a href="#shop" className="hero__card-btn">Shop →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
