import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./ContactPopup.css";

const WHATSAPP = "+359879219665";

export default function ContactPopup() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [form, setForm] = useState({ name: "", need: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
}, [dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.need.trim()) return;
    const msg = `Hi Ms.Fabulux! 👋\n\nName: ${form.name}\nLooking for: ${form.need}`;
    window.open(`https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    setTimeout(() => { setVisible(false); setDismissed(true); }, 2000);
  };

  const t = {
    title:       lang === "bg" ? "Не намирате това, което търсите?" : "Can't find what you need?",
    subtitle:    lang === "bg" ? "Кажете ни и ще ви помогнем да намерите перфектната перука!" : "Tell us and we'll help you find the perfect wig!",
    namePh:      lang === "bg" ? "Вашето име" : "Your name",
    needPh:      lang === "bg" ? "Какво търсите? (стил, дължина, цвят...)" : "What are you looking for? (style, length, color...)",
    send:        lang === "bg" ? "Изпрати в WhatsApp →" : "Send via WhatsApp →",
    sent:        lang === "bg" ? "✓ Отваря WhatsApp..." : "✓ Opening WhatsApp...",
    dismiss:     lang === "bg" ? "Не сега" : "Not now",
  };

  if (!visible) return null;

  return (
    <div className="cpop__overlay" onClick={handleDismiss}>
      <div className="cpop" onClick={(e) => e.stopPropagation()}>
        <button className="cpop__close" onClick={handleDismiss}>✕</button>

        <div className="cpop__icon">💬</div>
        <h3 className="cpop__title">{t.title}</h3>
        <p className="cpop__sub">{t.subtitle}</p>

        {sent ? (
          <div className="cpop__sent">{t.sent}</div>
        ) : (
          <div className="cpop__form">
            <input
              className="cpop__input"
              placeholder={t.namePh}
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
            />
            <textarea
              className="cpop__input cpop__textarea"
              placeholder={t.needPh}
              rows={3}
              value={form.need}
              onChange={(e) => setForm(p => ({ ...p, need: e.target.value }))}
            />
            <button
              className="cpop__send"
              onClick={handleSubmit}
              disabled={!form.name.trim() || !form.need.trim()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.send}
            </button>
            <button className="cpop__dismiss" onClick={handleDismiss}>{t.dismiss}</button>
          </div>
        )}
      </div>
    </div>
  );
}