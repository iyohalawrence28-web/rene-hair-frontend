import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./ChatWidget.css";

const WHATSAPP = "+359879219665";

export default function ChatWidget() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });
  const [sent, setSent] = useState(false);

  const t = {
    title:     lang === "bg" ? "Свържете се с нас" : "Contact Us",
    subtitle:  lang === "bg" ? "Отговаряме бързо в WhatsApp 🚀" : "We reply fast on WhatsApp 🚀",
    phone:     lang === "bg" ? "Телефон / WhatsApp" : "Phone / WhatsApp",
    namePh:    lang === "bg" ? "Вашето име" : "Your name",
    msgPh:     lang === "bg" ? "Как можем да помогнем?" : "How can we help you?",
    send:      lang === "bg" ? "Изпрати в WhatsApp" : "Send via WhatsApp",
    sent:      lang === "bg" ? "✓ Отваря WhatsApp..." : "✓ Opening WhatsApp...",
    orCall:    lang === "bg" ? "Или ни се обадете директно:" : "Or call us directly:",
    close:     lang === "bg" ? "Затвори" : "Close",
  };

  const handleSend = () => {
    if (!form.name.trim() || !form.message.trim()) return;
    const msg = `Hi Ms.Fabulux! 👋\n\nName: ${form.name}\nMessage: ${form.message}`;
    window.open(`https://wa.me/${WHATSAPP.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", message: "" }); setOpen(false); }, 2500);
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={`cw__fab${open ? " cw__fab--open" : ""}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Contact us"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
        {!open && <span className="cw__fab-pulse" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="cw__panel">
          {/* Header */}
          <div className="cw__header">
            <div className="cw__avatar">👑</div>
            <div>
              <div className="cw__name">Ms.Fabulux Hairs</div>
              <div className="cw__status">● Online</div>
            </div>
          </div>

          {/* Body */}
          <div className="cw__body">
            <div className="cw__bubble">
              Hi! 👋 Welcome to Ms.Fabulux Hairs. How can we help you today?
            </div>

            <div className="cw__phone-row">
              <span className="cw__phone-label">{t.phone}:</span>
              <a href={`tel:${WHATSAPP}`} className="cw__phone-num">{WHATSAPP}</a>
            </div>

            {sent ? (
              <div className="cw__sent">{t.sent}</div>
            ) : (
              <div className="cw__form">
                <input
                  className="cw__input"
                  placeholder={t.namePh}
                  value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                />
                <textarea
                  className="cw__input cw__textarea"
                  placeholder={t.msgPh}
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                />
                <button
                  className="cw__send"
                  onClick={handleSend}
                  disabled={!form.name.trim() || !form.message.trim()}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t.send}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
