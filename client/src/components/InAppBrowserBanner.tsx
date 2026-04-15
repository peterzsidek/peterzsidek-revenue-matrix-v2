import { useEffect, useState } from "react";

/**
 * Detects Facebook/Messenger Android WebView (FBAN/FBAV in user agent)
 * and shows a sticky banner prompting the user to open in Chrome.
 * This fixes the zoom/scale issue in Meta in-app browsers on Android.
 */
export default function InAppBrowserBanner() {
  const [show, setShow] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isFacebookWebView = /FBAN|FBAV|FB_IAB|FBIOS|Instagram/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    if (isFacebookWebView && isAndroid) {
      setShow(true);
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (!show) return null;

  const openInChrome = () => {
    // intent:// scheme opens Chrome on Android from WebView
    const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;

    // Fallback: if intent doesn't work, try direct URL after short delay
    setTimeout(() => {
      window.open(currentUrl, "_blank");
    }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#1a1a1a",
        borderTop: "2px solid #f06f66",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#f0dfc8",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Az oldal legjobban Chrome-ban néz ki
        </p>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12px",
            fontWeight: 300,
            color: "rgba(240,223,200,0.6)",
            margin: "2px 0 0",
            lineHeight: 1.4,
          }}
        >
          A Messenger böngészője nem jeleníti meg megfelelően.
        </p>
      </div>
      <button
        onClick={openInChrome}
        style={{
          backgroundColor: "#f06f66",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 16px",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Megnyitás →
      </button>
      <button
        onClick={() => setShow(false)}
        style={{
          background: "none",
          border: "none",
          color: "rgba(240,223,200,0.4)",
          fontSize: "18px",
          cursor: "pointer",
          padding: "4px",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Bezárás"
      >
        ✕
      </button>
    </div>
  );
}
