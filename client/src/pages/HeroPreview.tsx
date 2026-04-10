import React, { useEffect, useRef, useState } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032362343/QvwZVu498WhwxVrDug5WRT/hero-bg-WtqreeCZ7YEA9bixUDG9YN.webp";

// ─── Shared hero text content ─────────────────────────────────────────────────
function HeroText() {
  return (
    <div
      className="container"
      style={{
        position: "relative",
        zIndex: 2,
        paddingTop: "40px",
        paddingBottom: "80px",
        maxWidth: "1280px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h1
        style={{
          fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
          fontWeight: 200,
          fontSize: "clamp(40px, 5vw, 68px)",
          lineHeight: 1.15,
          color: "#f0dfc8",
          marginBottom: "48px",
          letterSpacing: "-0.01em",
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "900px",
        }}
      >
        A legtöbb cégvezető nem tudja, mennyi pénzt hagy{" "}
        <span style={{ color: "#f06f66" }}>az asztalon.</span>
      </h1>
      <div style={{ textAlign: "center", marginBottom: "80px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(16px, 1.8vw, 22px)", color: "rgba(240,223,200,0.75)", lineHeight: 1.6, margin: 0 }}>
          Feltárjuk, hol szivárog a bevételed.<br />
          Rendszert építünk a megoldásra.
        </p>
      </div>
      <div style={{ textAlign: "center" }}>
        <a href="#cta" style={{ display: "inline-block", backgroundColor: "#f06f66", color: "#303030", padding: "18px 40px", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase" as const, letterSpacing: "0.12em", textDecoration: "none" }}>
          visszahívást kérek →
        </a>
      </div>
    </div>
  );
}

function Label({ id, title, desc }: { id: string; title: string; desc: string }) {
  return (
    <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", backgroundColor: "rgba(30,28,26,0.92)", border: "1px solid rgba(240,111,102,0.3)", padding: "16px 32px", maxWidth: "560px", width: "90%" }}>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#f06f66", textTransform: "uppercase" as const, marginBottom: "6px" }}>{id}</div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 600, color: "#f0dfc8", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 300, color: "rgba(240,223,200,0.6)", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIÁNS A — Scroll-parallax: több réteg különböző sebességgel mozog
// Az eredeti fotó megmarad, de fölé/alá kerülnek SVG rétegek amelyek
// scroll közben különböző sebességgel csúsznak — mélységérzetet adva.
// ═══════════════════════════════════════════════════════════════════════════════
function VariantA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = -rect.top;
      setScrollY(Math.max(0, progress));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax offsets — each layer moves at different speed
  const bgOffset = scrollY * 0.4;       // photo moves slowest
  const layer1 = scrollY * 0.65;        // mid layer
  const layer2 = scrollY * 0.85;        // fast layer (closest)
  const textOffset = scrollY * 0.15;    // text barely moves

  return (
    <section
      ref={sectionRef}
      id="variant-A"
      style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", paddingTop: "120px" }}
    >
      {/* Layer 0: Photo background — slowest */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: `translateY(${bgOffset * 0.3}px)`,
        willChange: "transform",
        scale: "1.15",
      }} />

      {/* Dark base overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(28,24,20,0.72)" }} />

      {/* Layer 1: Large slow-moving geometric shapes — mid depth */}
      <svg
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          transform: `translateY(-${layer1 * 0.18}px)`,
          willChange: "transform",
          opacity: 0.07,
        }}
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      >
        {/* Large rotated squares */}
        <rect x="80" y="80" width="340" height="340" fill="none" stroke="#f0dfc8" strokeWidth="1" transform="rotate(15 250 250)" />
        <rect x="100" y="100" width="300" height="300" fill="none" stroke="#f0dfc8" strokeWidth="0.5" transform="rotate(15 250 250)" />
        <rect x="1000" y="400" width="420" height="420" fill="none" stroke="#f0dfc8" strokeWidth="1" transform="rotate(-12 1210 610)" />
        <rect x="1020" y="420" width="380" height="380" fill="none" stroke="#f0dfc8" strokeWidth="0.5" transform="rotate(-12 1210 610)" />
        {/* Diagonal rule lines */}
        <line x1="0" y1="900" x2="600" y2="0" stroke="#f0dfc8" strokeWidth="0.6" />
        <line x1="200" y1="900" x2="800" y2="0" stroke="#f0dfc8" strokeWidth="0.4" />
        <line x1="840" y1="900" x2="1440" y2="0" stroke="#f0dfc8" strokeWidth="0.6" />
        <line x1="1040" y1="900" x2="1440" y2="200" stroke="#f0dfc8" strokeWidth="0.4" />
      </svg>

      {/* Layer 2: Fine grid + accent marks — closer, moves faster */}
      <svg
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          transform: `translateY(-${layer2 * 0.12}px)`,
          willChange: "transform",
          opacity: 0.14,
        }}
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="pgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f0dfc8" strokeWidth="0.35" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#pgrid)" />

        {/* Precision cross marks */}
        {[[200,200],[720,450],[1240,280],[400,680],[1100,650]].map(([cx,cy], i) => (
          <g key={i} stroke="#f06f66" strokeWidth="0.8" opacity="0.5">
            <line x1={cx-20} y1={cy} x2={cx+20} y2={cy} />
            <line x1={cx} y1={cy-20} x2={cx} y2={cy+20} />
            <circle cx={cx} cy={cy} r="8" fill="none" />
          </g>
        ))}

        {/* Corner brackets — engineering drawing style */}
        <g stroke="#f0dfc8" strokeWidth="1" opacity="0.4">
          <path d="M 60 60 L 60 20 L 100 20" fill="none" />
          <path d="M 1380 60 L 1380 20 L 1340 20" fill="none" />
          <path d="M 60 840 L 60 880 L 100 880" fill="none" />
          <path d="M 1380 840 L 1380 880 L 1340 880" fill="none" />
        </g>
      </svg>

      {/* Coral accent line — slides in from left on scroll */}
      <div style={{
        position: "absolute",
        left: 0,
        top: "50%",
        width: `${Math.min(100, scrollY * 0.08)}%`,
        height: "1px",
        backgroundColor: "#f06f66",
        opacity: 0.25,
        transform: "translateY(-50%)",
        transition: "width 0.1s linear",
        zIndex: 1,
      }} />

      {/* Text — minimal parallax */}
      <div style={{ transform: `translateY(-${textOffset * 0.1}px)`, width: "100%", willChange: "transform" }}>
        <HeroText />
      </div>

      <Label
        id="A variáns"
        title="Scroll-parallax rétegek"
        desc="A fotó, a mértani vonalak és a rácsréteg különböző sebességgel mozog görgetéskor — mélységérzet és mozgás, anélkül hogy elvonná a figyelmet a szövegről."
      />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIÁNS B — Lassan animált elemek: forgó gyűrűk, lebegő pontok, pulzáló vonalak
// Tisztán CSS animáció, nincs fotó — sötét, indusztriális, de élő háttér.
// ═══════════════════════════════════════════════════════════════════════════════
function VariantB() {
  return (
    <section
      id="variant-B"
      style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", paddingTop: "120px", backgroundColor: "#1c1a18" }}
    >
      <style>{`
        @keyframes rotSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotSlowRev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
        @keyframes floatX { 0%,100% { transform: translateX(0px); } 50% { transform: translateX(14px); } }
        @keyframes pulse { 0%,100% { opacity: 0.08; } 50% { opacity: 0.22; } }
        @keyframes dashFlow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -120; } }
        @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
      `}</style>

      {/* Animated SVG layer */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ── Large concentric rings — top-left, rotating slowly ── */}
        <g style={{ transformOrigin: "220px 260px", animation: "rotSlow 90s linear infinite" }}>
          <circle cx="220" cy="260" r="280" fill="none" stroke="#f0dfc8" strokeWidth="0.6" opacity="0.06" strokeDasharray="4 12" />
          <circle cx="220" cy="260" r="220" fill="none" stroke="#f0dfc8" strokeWidth="0.4" opacity="0.08" />
          <circle cx="220" cy="260" r="160" fill="none" stroke="#f06f66" strokeWidth="0.5" opacity="0.1" strokeDasharray="8 20" />
        </g>
        {/* Counter-rotating inner ring */}
        <g style={{ transformOrigin: "220px 260px", animation: "rotSlowRev 60s linear infinite" }}>
          <circle cx="220" cy="260" r="100" fill="none" stroke="#f0dfc8" strokeWidth="1" opacity="0.07" strokeDasharray="2 8" />
          {/* Tick marks on ring */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line key={i}
                x1={220 + Math.cos(a) * 92} y1={260 + Math.sin(a) * 92}
                x2={220 + Math.cos(a) * 108} y2={260 + Math.sin(a) * 108}
                stroke="#f0dfc8" strokeWidth="1" opacity="0.15"
              />
            );
          })}
        </g>

        {/* ── Large ring — bottom-right ── */}
        <g style={{ transformOrigin: "1260px 680px", animation: "rotSlowRev 120s linear infinite" }}>
          <circle cx="1260" cy="680" r="320" fill="none" stroke="#f0dfc8" strokeWidth="0.5" opacity="0.05" strokeDasharray="6 18" />
          <circle cx="1260" cy="680" r="240" fill="none" stroke="#f06f66" strokeWidth="0.4" opacity="0.08" strokeDasharray="3 15" />
          <circle cx="1260" cy="680" r="160" fill="none" stroke="#f0dfc8" strokeWidth="0.8" opacity="0.06" />
        </g>
        {/* Tick marks on large ring */}
        <g style={{ transformOrigin: "1260px 680px", animation: "rotSlow 120s linear infinite" }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const inner = i % 6 === 0 ? 152 : 156;
            return (
              <line key={i}
                x1={1260 + Math.cos(a) * inner} y1={680 + Math.sin(a) * inner}
                x2={1260 + Math.cos(a) * 168} y2={680 + Math.sin(a) * 168}
                stroke="#f0dfc8" strokeWidth={i % 6 === 0 ? 1.5 : 0.7} opacity="0.12"
              />
            );
          })}
        </g>

        {/* ── Flowing data lines — horizontal, animated dash ── */}
        {[180, 340, 500, 620, 760].map((y, i) => (
          <line key={i}
            x1="0" y1={y} x2="1440" y2={y}
            stroke="#f0dfc8" strokeWidth="0.4" opacity="0.04"
            strokeDasharray="40 80"
            style={{ animation: `dashFlow ${8 + i * 1.5}s linear infinite` }}
          />
        ))}

        {/* ── Accent flowing lines — coral ── */}
        {[420, 580].map((y, i) => (
          <line key={i}
            x1="0" y1={y} x2="1440" y2={y}
            stroke="#f06f66" strokeWidth="0.6" opacity="0.08"
            strokeDasharray="20 120"
            style={{ animation: `dashFlow ${12 + i * 3}s linear infinite` }}
          />
        ))}

        {/* ── Floating geometric nodes ── */}
        {[
          { cx: 600, cy: 180, r: 4, delay: "0s" },
          { cx: 840, cy: 320, r: 3, delay: "1.5s" },
          { cx: 480, cy: 560, r: 5, delay: "3s" },
          { cx: 960, cy: 640, r: 3, delay: "0.8s" },
          { cx: 1100, cy: 200, r: 4, delay: "2.2s" },
          { cx: 340, cy: 380, r: 3, delay: "4s" },
        ].map((n, i) => (
          <g key={i} style={{ animation: `floatY ${5 + i * 0.7}s ease-in-out infinite`, animationDelay: n.delay }}>
            <circle cx={n.cx} cy={n.cy} r={n.r + 8} fill="none" stroke="#f06f66" strokeWidth="0.6" opacity="0.2" />
            <circle cx={n.cx} cy={n.cy} r={n.r} fill="#f06f66" opacity="0.35" />
          </g>
        ))}

        {/* ── Connecting lines between nodes — subtle ── */}
        <g stroke="#f0dfc8" strokeWidth="0.5" opacity="0.06" strokeDasharray="4 8">
          <line x1="600" y1="180" x2="840" y2="320" />
          <line x1="840" y1="320" x2="960" y2="640" />
          <line x1="480" y1="560" x2="840" y2="320" />
          <line x1="1100" y1="200" x2="840" y2="320" />
          <line x1="340" y1="380" x2="480" y2="560" />
        </g>

        {/* ── Fine dot field — floating slowly ── */}
        <g style={{ animation: "floatX 20s ease-in-out infinite" }}>
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 14 }).map((_, col) => (
              <circle key={`${row}-${col}`}
                cx={col * 110 + 55} cy={row * 115 + 58}
                r="1" fill="#f0dfc8" opacity="0.06"
              />
            ))
          )}
        </g>

        {/* ── Single scan line ── */}
        <rect
          x="0" y="0" width="1440" height="2"
          fill="rgba(240,111,102,0.08)"
          style={{ animation: "scanLine 8s linear infinite" }}
        />
      </svg>

      {/* Vignette overlay — edges darker */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(20,18,16,0.7) 100%)",
        zIndex: 1,
      }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <HeroText />
      </div>

      <Label
        id="B variáns"
        title="Lassan animált indusztriális elemek"
        desc="Forgó precíziós gyűrűk, lebegő csomópontok, pulzáló adatfolyam-vonalak és egy scan line — élő, de visszafogott háttér, amely a rendszerszemléletet idézi."
      />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main preview page
// ═══════════════════════════════════════════════════════════════════════════════
export default function HeroPreview() {
  return (
    <div style={{ backgroundColor: "#1c1a18" }}>
      {/* Fixed nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: "rgba(20,18,16,0.96)",
        borderBottom: "1px solid rgba(240,111,102,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "40px", padding: "12px 24px",
      }}>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 600, color: "rgba(240,223,200,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
          Hero alternatívák
        </span>
        {[["#variant-A", "A — Scroll-parallax"], ["#variant-B", "B — Animált"]].map(([href, label]) => (
          <a key={href} href={href} style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: "#f06f66", textDecoration: "none", letterSpacing: "0.05em" }}>
            {label}
          </a>
        ))}
        <a href="/" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "rgba(240,223,200,0.35)", textDecoration: "none" }}>
          ← vissza az oldalra
        </a>
      </div>

      <VariantA />
      <VariantB />
    </div>
  );
}
