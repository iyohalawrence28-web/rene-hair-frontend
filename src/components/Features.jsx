import "./Hero.css"; /* reuses feature-card styles from Hero.css */

const FEATURES = [
  { icon: "🤖", title: "AI Try-On",       desc: "See any wig on your face with GPT Image AI before you buy" },
  { icon: "💳", title: "Secure Payment",  desc: "Checkout safely with Stripe — cards accepted worldwide" },
  { icon: "📦", title: "Fast Delivery",   desc: "Real-time order tracking updates at every step" },
  { icon: "✉️", title: "Email Updates",   desc: "Confirmation, shipping and delivery emails sent automatically" },
];

export default function Features() {
  return (
    <section className="features">
      <div className="features__inner">
        <div className="features__grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <div className="feature-card__icon">{icon}</div>
              <div className="feature-card__title">{title}</div>
              <p className="feature-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}