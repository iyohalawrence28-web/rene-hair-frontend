import { useEffect, useRef, useState } from "react";
import "./TryOnModal.css";

import { API_BASE, apiFetch } from "../config";
import { useLanguage } from "../context/LanguageContext";

const getImageUrl = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${API_BASE}${img}`;
};

export default function TryOnModal({ product: initialProduct, isOpen, onClose }) {
  const canvasRef      = useRef(null);
  const userImgRef     = useRef(null);
  const hairImgRef     = useRef(null);
  const baseMetricsRef = useRef(null);

  const { t } = useLanguage();

  const [allProducts, setAllProducts]         = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const product = initialProduct || selectedProduct;

  const [transform, setTransform]               = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [tryOnSessionId, setTryOnSessionId]     = useState(null);
  const [aiGenerating, setAiGenerating]         = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
  const [uploadStatus, setUploadStatus]         = useState("");
  const [photoReady, setPhotoReady]             = useState(false);

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailInput, setEmailInput]         = useState("");
  const [emailSending, setEmailSending]     = useState(false);
  const [emailStatus, setEmailStatus]       = useState("");
  const [downloading, setDownloading]       = useState(false);
  const [shareStatus, setShareStatus]       = useState("");

  useEffect(() => {
    if (isOpen && !initialProduct && allProducts.length === 0) {
      setLoadingProducts(true);
      apiFetch(`${API_BASE}/api/products`)
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : (data.products ?? []);
          setAllProducts(list);
        })
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }
  }, [isOpen, initialProduct]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      setAiGeneratedImage(null);
      setUploadStatus("");
      setPhotoReady(false);
      setTryOnSessionId(null);
      setShowEmailInput(false);
      setEmailStatus("");
      setEmailInput("");
      setShareStatus("");
    }
  }, [isOpen]);

  const drawScene = () => {
    const canvas  = canvasRef.current;
    if (!canvas) return;
    const ctx     = canvas.getContext("2d");
    const userImg = userImgRef.current;
    const hairImg = hairImgRef.current;
    const metrics = baseMetricsRef.current;
    if (!userImg || !hairImg || !metrics) return;
    const { baseHairWidth, baseHairHeight, baseX, baseY } = metrics;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(userImg, 0, 0);
    ctx.save();
    ctx.translate(baseX + baseHairWidth / 2 + transform.x, baseY + baseHairHeight / 2 + transform.y);
    ctx.rotate(transform.rotation);
    ctx.scale(transform.scale, transform.scale);
    ctx.drawImage(hairImg, -baseHairWidth / 2, -baseHairHeight / 2, baseHairWidth, baseHairHeight);
    ctx.restore();
  };
  useEffect(() => { drawScene(); }, [transform]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus("Uploading...");
    setTryOnSessionId(null);
    setAiGeneratedImage(null);
    setEmailStatus("");
    setPhotoReady(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width  = img.width;
        canvas.height = img.height;
        userImgRef.current = img;
        if (product && (product.hairOverlay || product.overlayImage)) {
          const hairImg = new Image();
          hairImg.onload = () => {
            hairImgRef.current = hairImg;
            const baseHairWidth  = img.width * 0.6;
            const baseHairHeight = (hairImg.height / hairImg.width) * baseHairWidth;
            const baseX = (img.width - baseHairWidth) / 2;
            const baseY = img.height * 0.05;
            baseMetricsRef.current = { baseHairWidth, baseHairHeight, baseX, baseY };
            drawScene();
          };
          hairImg.src = product.hairOverlay || product.overlayImage;
        } else {
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await apiFetch(`${API_BASE}/api/tryon/upload`, { method: "POST", body: formData });
      if (!uploadRes.ok) { setUploadStatus("Upload failed. Try again."); return; }
      const uploadData = await uploadRes.json();
      const imageId = uploadData.imageId;
      if (!imageId) { setUploadStatus("Upload error. Try again."); return; }

      const sessionRes = await apiFetch(`${API_BASE}/api/tryon/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?._id || undefined, imageId, source: "frontend" }),
      });
      if (!sessionRes.ok) { setUploadStatus("Session error. Try again."); return; }
      const sessionData = await sessionRes.json();
      setTryOnSessionId(sessionData.sessionId);
      setPhotoReady(true);
      setUploadStatus("Photo ready! Click Generate.");
    } catch {
      setUploadStatus("Something went wrong. Try again.");
    }
  };

  const handleAIGenerate = async () => {
    if (!tryOnSessionId) { alert("Please upload a photo first."); return; }
    setAiGenerating(true);
    setAiGeneratedImage(null);
    setEmailStatus("");
    try {
      const res = await apiFetch(`${API_BASE}/api/ai-tryon/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: tryOnSessionId }),
      });
      if (!res.ok) { alert("AI generation failed. Please try again."); return; }
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setAiGeneratedImage(data.imageUrl);
        setUploadStatus("");
      } else {
        alert("AI generation failed. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailInput || !emailInput.includes("@")) { setEmailStatus("Please enter a valid email."); return; }
    setEmailSending(true);
    setEmailStatus("");
    try {
      const res = await apiFetch(`${API_BASE}/api/tryon/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, imageUrl: aiGeneratedImage, productId: product?._id }),
      });
      if (res.ok) { setEmailStatus("✓ Email sent!"); setShowEmailInput(false); setEmailInput(""); }
      else { setEmailStatus("Failed to send. Try again."); }
    } catch { setEmailStatus("Something went wrong."); }
    finally { setEmailSending(false); }
  };

  const fullImgUrl = aiGeneratedImage ? getImageUrl(aiGeneratedImage) : "";
  const shareText = `I just tried on the "${product?.name}" wig from Ms.Fabulux Hairs! 💇‍♀️✨ Try yours at ${window.location.href}`;

  // ── Fetch image as blob for native sharing ──
  const fetchImageBlob = async () => {
    const response = await fetch(fullImgUrl);
    const blob = await response.blob();
    return new File([blob], `msfabulux-tryon-${Date.now()}.png`, { type: "image/png" });
  };

  // ── Download to gallery (works on mobile too) ──
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(fullImgUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `msfabulux-tryon-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShareStatus("✓ Saved to your device!");
      setTimeout(() => setShareStatus(""), 3000);
    } catch {
      alert("Download failed. Try long-pressing the image to save.");
    } finally {
      setDownloading(false);
    }
  };

  // ── Native Share (opens share sheet on mobile — WhatsApp Status, IG Story, TikTok etc) ──
  const handleNativeShare = async () => {
    try {
      const file = await fetchImageBlob();
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Ms.Fabulux AI Look 💇‍♀️",
          text: shareText,
          files: [file],
        });
        setShareStatus("✓ Shared!");
      } else if (navigator.share) {
        await navigator.share({ title: "My Ms.Fabulux AI Look", text: shareText, url: window.location.href });
        setShareStatus("✓ Shared!");
      } else {
        await navigator.clipboard.writeText(fullImgUrl);
        setShareStatus("✓ Image URL copied to clipboard!");
      }
      setTimeout(() => setShareStatus(""), 3000);
    } catch (err) {
      if (err.name !== "AbortError") {
        await navigator.clipboard.writeText(fullImgUrl);
        setShareStatus("✓ Image URL copied!");
        setTimeout(() => setShareStatus(""), 3000);
      }
    }
  };

  // ── WhatsApp Status (mobile: share with file, desktop: link) ──
  const handleWhatsApp = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      try {
        const file = await fetchImageBlob();
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: shareText });
          return;
        }
      } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  // ── Instagram Story (download then open Instagram) ──
  const handleInstagram = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      try {
        const file = await fetchImageBlob();
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: shareText });
          return;
        }
      } catch {}
      // Fallback: download then open Instagram
      await handleDownload();
      setTimeout(() => {
        window.location.href = "instagram://";
        setShareStatus("✓ Image saved! Opening Instagram...");
      }, 1000);
    } else {
      await navigator.clipboard.writeText(fullImgUrl);
      setShareStatus("✓ Image URL copied! Open Instagram and paste in your story.");
      setTimeout(() => setShareStatus(""), 4000);
    }
  };

  // ── TikTok (download then open TikTok) ──
  const handleTikTok = async () => {
    await handleDownload();
    setTimeout(() => {
      window.location.href = "snssdk1128://";
      setTimeout(() => window.open("https://www.tiktok.com", "_blank"), 1500);
    }, 800);
  };

  // ── Facebook ──
  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`, "_blank");
  };

  // ── X/Twitter ──
  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  if (!isOpen) return null;

  const showPicker = !initialProduct && !selectedProduct;

  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm" onClick={(e) => e.stopPropagation()}>
        <div className="tm__header">
          <div>
            <div className="tm__pill">✨ AI Powered</div>
            <h2 className="tm__title">
              {showPicker ? t("pickStyle") : product ? `Try On — ${product.name}` : "AI Try-On"}
            </h2>
          </div>
          <button className="tm__close" onClick={onClose}>✕</button>
        </div>

        <div className="tm__body">
          {showPicker && (
            <div className="tm__picker">
              <p className="tm__picker-hint">{t("chooseWig")}</p>
              {loadingProducts && (
                <div className="tm__picker-loading">
                  <span className="tm__spinner" style={{ borderTopColor: "var(--brown2)" }} />
                  <span>{t("loadingStyles")}</span>
                </div>
              )}
              {!loadingProducts && allProducts.length === 0 && <p className="tm__picker-empty">{t("noStyles")}</p>}
              {!loadingProducts && allProducts.length > 0 && (
                <div className="tm__picker-grid">
                  {allProducts.map((p) => (
                    <button key={p._id} className="tm__picker-card" onClick={() => setSelectedProduct(p)}>
                      <div className="tm__picker-img">
                        {p.images?.[0] ? <img src={getImageUrl(p.images[0])} alt={p.name} /> : <span>💇🏾‍♀️</span>}
                      </div>
                      <div className="tm__picker-info">
                        <div className="tm__picker-name">{p.name}</div>
                        <div className="tm__picker-meta">
                          {p.texture && <span>{p.texture}</span>}
                          {p.availableLengths?.[0] && <span>{p.availableLengths[0]}"</span>}
                        </div>
                        <div className="tm__picker-price">${Number(p.price).toFixed(2)}</div>
                      </div>
                      <div className="tm__picker-select">Try This →</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!showPicker && (
            <>
              {!initialProduct && selectedProduct && (
                <div className="tm__selected-product">
                  <div className="tm__selected-img">
                    {selectedProduct.images?.[0]
                      ? <img src={getImageUrl(selectedProduct.images[0])} alt={selectedProduct.name} />
                      : <span>💇🏾‍♀️</span>}
                  </div>
                  <div className="tm__selected-info">
                    <div className="tm__selected-name">{selectedProduct.name}</div>
                    <div className="tm__selected-meta">{selectedProduct.texture}</div>
                  </div>
                  <button className="tm__change-btn" onClick={() => { setSelectedProduct(null); setTryOnSessionId(null); setPhotoReady(false); setUploadStatus(""); setAiGeneratedImage(null); }}>
                    Change
                  </button>
                </div>
              )}

              <div className="tm__step"><div className="tm__step-num">1</div><div className="tm__step-label">{t("uploadPhoto")}</div></div>
              <label className="tm__upload-zone">
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <div className="tm__upload-icon">📸</div>
                <div className="tm__upload-text">{photoReady ? t("photoReady") : t("tapToSelect")}</div>
                <div className="tm__upload-hint">JPEG or PNG · Front-facing works best</div>
              </label>
              {uploadStatus && <p className={`tm__status${photoReady ? " tm__status--ok" : ""}`}>{uploadStatus}</p>}
              <canvas ref={canvasRef} style={{ display: "none" }} />

              <div className="tm__step" style={{ marginTop: "18px" }}><div className="tm__step-num">2</div><div className="tm__step-label">{t("generateLook")}</div></div>
              <button className="tm__generate-btn" onClick={handleAIGenerate} disabled={aiGenerating || !tryOnSessionId}>
                {aiGenerating ? (<span className="tm__generating"><span className="tm__spinner" />{t("generating")}</span>) : t("generateBtn")}
              </button>

              {aiGeneratedImage && (
                <div className="tm__result">
                  <div className="tm__result-label">
                    <div className="tm__step-num">3</div>
                    <div className="tm__step-label">{t("yourNewLook")}</div>
                  </div>

                  <div className="tm__result-img-wrap">
                    <img src={fullImgUrl} alt="AI Try-On Result" className="tm__result-img" />
                    <span className="tm__result-badge">✨ AI Generated</span>
                  </div>

                  {/* ── Share Section ── */}
                  <div className="tm__share">
                    <p className="tm__share-label">{t("shareYourLook")}</p>

                    {/* Native share button (mobile) — opens WhatsApp Status, IG Story, TikTok etc */}
                    <button className="tm__native-share-btn" onClick={handleNativeShare}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                      Share to Story / Status
                    </button>

                    {/* Platform buttons */}
                    <div className="tm__share-grid">
                      {/* WhatsApp */}
                      <button className="tm__share-btn tm__wa" onClick={handleWhatsApp}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>

                      {/* Instagram */}
                      <button className="tm__share-btn tm__ig" onClick={handleInstagram}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        Instagram
                      </button>

                      {/* TikTok */}
                      <button className="tm__share-btn tm__tiktok" onClick={handleTikTok}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                        TikTok
                      </button>

                      {/* Facebook */}
                      <button className="tm__share-btn tm__fb" onClick={handleFacebook}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </button>

                      {/* X/Twitter */}
                      <button className="tm__share-btn tm__tw" onClick={handleTwitter}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        X / Twitter
                      </button>
                    </div>

                    {/* Share status message */}
                    {shareStatus && (
                      <p style={{ fontSize: "0.78rem", color: "var(--green, #2d7a4f)", textAlign: "center", margin: "0.5rem 0", fontWeight: 500 }}>
                        {shareStatus}
                      </p>
                    )}

                    {/* Download + Email row */}
                    <div className="tm__share-row2">
                      <button className="tm__download-btn" onClick={handleDownload} disabled={downloading}>
                        {downloading ? "Saving..." : "↓ Save to Device"}
                      </button>
                      {!showEmailInput ? (
                        <button className="tm__email-btn" onClick={() => setShowEmailInput(true)}>✉ Send to Email</button>
                      ) : (
                        <div className="tm__email-form">
                          <input type="email" className="tm__email-input" placeholder="your@email.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                          <div className="tm__email-actions">
                            <button className="tm__email-send" onClick={handleSendEmail} disabled={emailSending}>{emailSending ? "Sending..." : "Send"}</button>
                            <button className="tm__email-cancel" onClick={() => { setShowEmailInput(false); setEmailStatus(""); }}>Cancel</button>
                          </div>
                          {emailStatus && <p className="tm__email-status">{emailStatus}</p>}
                        </div>
                      )}
                    </div>
                    {emailStatus && !showEmailInput && <p className="tm__email-status">{emailStatus}</p>}
                  </div>

                  {product && <button className="tm__shop-btn" onClick={onClose}>Shop {product.name} →</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

