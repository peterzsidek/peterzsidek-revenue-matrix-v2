import React, { useEffect, useRef, useState } from "react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032362343/QvwZVu498WhwxVrDug5WRT/brandfabrik-logo_a07a612a.png";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032362343/QvwZVu498WhwxVrDug5WRT/hero-bg-WtqreeCZ7YEA9bixUDG9YN.webp";

// Staggered grid observer: watches a container, adds .card-stagger class with animationDelay
function useStaggerInView(count: number, threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTriggered(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, triggered };
}

// Simple wrapper — no animation, just renders children
function FadeUp({ children, className = "", style = {} }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ opacity: 1, ...style }}>
      {children}
    </div>
  );
}

// Hero Guarantee Panel
function HeroDifferentiatorTabs() {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setTooltipOpen(false), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    if (!tooltipOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setTooltipOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tooltipOpen]);

  useEffect(() => {
    if (!tooltipOpen) return;
    const onOutside = (e: MouseEvent | TouchEvent) => {
      const t = triggerRef.current;
      const p = tooltipRef.current;
      const target = e.target as Node;
      if (t && !t.contains(target) && p && !p.contains(target)) {
        setTooltipOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [tooltipOpen]);

  const checklistItems = [
    { text: "Először feltárjuk, hol van nálad valódi növekedési lehetőség", asterisk: false },
    { text: "A teljes kommunikációs eszköztárat végigvizsgáljuk", asterisk: true },
    { text: "Bizonyított elemekből, prioritás mentén építünk rendszert", asterisk: false },
    { text: "Amit javaslunk, azért felelősséget vállalunk a megvalósításig", asterisk: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", border: "1px solid rgba(240,223,200,0.1)", backgroundColor: "rgba(48,48,48,0.6)", backdropFilter: "blur(8px)", borderTopLeftRadius: "20px" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(240,223,200,0.1)" }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "3px", color: "#f06f66" }}>A mi garanciánk</div>
      </div>
      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ borderLeft: "3px solid #f06f66", paddingLeft: "20px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "16px", color: "#f0dfc8", lineHeight: 1.55, marginBottom: "12px" }}>
            Ha nem látunk nálad valódi növekedési potenciált, azt ki fogjuk mondani.
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "13px", color: "rgba(240,223,200,0.75)", lineHeight: 1.55, marginBottom: "10px" }}>
            Amit javaslunk, azért felelősséget is vállalunk — és végig is visszük.
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px", color: "#f06f66", lineHeight: 1.4 }}>
            Nem megérzésre dolgozunk, hanem bizonyított működésre építünk.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {checklistItems.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "20px", height: "20px", backgroundColor: "rgba(240,111,102,0.15)", border: "1px solid rgba(240,111,102,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", borderBottomRightRadius: "6px" }}>
                <span style={{ color: "#f06f66", fontSize: "11px", fontWeight: 700 }}>✓</span>
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "rgba(240,223,200,0.75)", lineHeight: 1.5, position: "relative" }}>
                {item.text}{item.asterisk && (
                  <span style={{ display: "inline-block", position: "relative" }}>
                    <span
                      ref={triggerRef as React.RefObject<HTMLSpanElement>}
                      onMouseEnter={() => { cancelClose(); setTooltipOpen(true); }}
                      onMouseLeave={scheduleClose}
                      onClick={() => setTooltipOpen(v => !v)}
                      style={{ color: "#f06f66", cursor: "pointer", fontSize: "11px", fontWeight: 500, marginLeft: "6px", userSelect: "none", opacity: tooltipOpen ? 1 : 0.65, transition: "opacity 0.2s", whiteSpace: "nowrap" }}
                    >[Mi ez?]*</span>
                    {tooltipOpen && (
                      <div
                        ref={tooltipRef}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                        style={{
                          position: "absolute",
                          bottom: "calc(100% + 10px)",
                          left: 0,
                          width: "clamp(280px, 380px, 420px)",
                          maxWidth: "calc(100vw - 32px)",
                          backgroundColor: "rgba(18,18,18,0.98)",
                          border: "1px solid rgba(240,111,102,0.3)",
                          borderRadius: "14px 0 0 0",
                          padding: "20px 22px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(240,111,102,0.08)",
                          zIndex: 9999,
                        }}
                      >
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, color: "#f06f66", textTransform: "uppercase", letterSpacing: "3px" }}>MIT JELENT A TELJES KOMMUNIKÁCIÓS ESZKÖZTÁR?</div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 300, color: "rgba(240,223,200,0.82)", lineHeight: 1.55 }}>
                          A vizsgálat alapja egy <strong style={{ fontWeight: 600, color: "rgba(240,223,200,0.95)" }}>335 elemből álló</strong>, iparágfüggetlen IMC-eszköztár.
                        </div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 300, color: "rgba(240,223,200,0.82)", lineHeight: 1.55 }}>
                          A keretrendszer <strong style={{ fontWeight: 600, color: "rgba(240,223,200,0.95)" }}>Philip Kotler IMC-logikájára</strong> épül, kiegészítve az <strong style={{ fontWeight: 600, color: "rgba(240,223,200,0.95)" }}>AEO/GEO</strong>, vagyis az <strong style={{ fontWeight: 600, color: "rgba(240,223,200,0.95)" }}>AI-alapú keresőoptimalizálás</strong> területével.
                        </div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 300, color: "rgba(240,223,200,0.82)", lineHeight: 1.55 }}>
                          Az iparág-specifikus példákat, bizonyítékokat és releváns működési mintákat a szűrési fázisban rendelünk hozzá, így nem általános ajánlást, hanem a cégedre szabott irányt kapsz.
                        </div>
                      </div>
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Navbar
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        backgroundColor: scrolled ? "rgba(48,48,48,0.97)" : "rgba(48,48,48,0.85)",
        borderBottom: "1px solid rgba(240,111,102,0.15)",
        backdropFilter: "blur(12px)",
        transition: "background-color 0.3s",
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px", maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", padding: "0 40px", boxSizing: "border-box" }}>
        <img src={LOGO_URL} alt="Brandfabrik" style={{ height: "48px", objectFit: "contain" }} />
        <a
          href="#cta"
          className="btn-coral"
          style={{
            backgroundColor: "#f06f66",
            color: "#303030",
            padding: "10px 20px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0",
            borderBottomRightRadius: "12px",
          }}
        >
          Kötelezettségmentes diagnosztikát kérek <span className="btn-arrow">→</span>
        </a>
      </div>
    </nav>
  );
}

// ─── HERO SECTION — static, no scroll animation ───────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(48,48,48,0.75)' }} />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '140px 40px 80px 40px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* H1 */}
        <h1
          style={{
            fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
            fontWeight: 200,
            fontSize: '62px',
            lineHeight: 1.15,
            color: '#f0dfc8',
            marginBottom: '24px',
            letterSpacing: '-0.01em',
            textAlign: 'center',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          A legtöbb cégvezető nem tudja, mennyi pénzt hagy{' '}
          <span style={{ color: '#f06f66' }}>az asztalon.</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 300,
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'rgba(240,223,200,0.7)',
            textAlign: 'center',
            marginBottom: '64px',
            letterSpacing: '0.01em',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          A Revenue Matrix diagnosztikával feltárjuk, hol szivárog a bevételed —<br />majd felépítjük azt a bevételszerző rendszert, ami a te piacodon bizonyítottan működik.
        </p>

        {/* Two-column panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '72px',
            alignItems: 'flex-start',
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/* Left panel */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px', lineHeight: 1.5, color: 'rgba(240,223,200,0.85)', marginBottom: '8px' }}>
              Az első kötelezettségmentes beszélgetés célja:
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: '15px', lineHeight: 1.6, color: 'rgba(240,223,200,0.75)', marginBottom: '32px' }}>
              megnézni, hol van valódi növekedési lehetőség —<br />és van-e értelme rendszert építeni rá.
            </p>
            <a href="#cta" className="btn-coral" style={{ backgroundColor: '#f06f66', color: '#303030', padding: '18px 36px', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0', borderBottomRightRadius: '12px' }}>
              Visszahívást kérek <span className="btn-arrow">→</span>
            </a>
          </div>

          {/* Right panel */}
          <div>
            <HeroDifferentiatorTabs />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, #303030)', zIndex: 1 }} />
    </section>
  );
}



// Differentiator Table — static, no scroll animation
const differentiatorRows = [
  { aspect: "Megközelítés", agency: "Amit kérsz, arra ad javaslatot", brandfabrik: "A teljes működést végignézi, és azt is feltárja, amit nem látsz" },
  { aspect: "Döntési alap", agency: "Tapasztalat és vélemény alapján javasol", brandfabrik: "Iparági szinten bizonyított, működő mintákra épít" },
  { aspect: "Diagnózis", agency: "A felszínen látható problémára reagál", brandfabrik: "Mélyinterjú-szintű feltárás + külső piackutatás, nem csak az ügyfél önbevallása alapján" },
  { aspect: "Lefedettség", agency: "Egy-egy kampányra vagy csatornára néz rá", brandfabrik: "Minden releváns bevételi lehetőséget egyben vizsgál, cégre szabva és sorrendbe rakva" },
  { aspect: "Gondolkodásmód", agency: "Kampányokban gondolkodik", brandfabrik: "Az elemek egymásra épülnek és erősítik egymást" },
  { aspect: "Siker mérése", agency: "Nem látszik pontosan, mi hoz bevételt", brandfabrik: "Pontosan látszik, mi hoz bevételt" },
  { aspect: "Szerződés", agency: "Hosszú távra leköt", brandfabrik: "Csak akkor maradsz, ha működik" },
];

function DifferentiatorTable() {
  return (
    <section style={{ backgroundColor: "#2a2a2a", padding: "100px 0" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{
            fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(32px, 3.5vw, 52px)",
            color: "#f0dfc8",
            lineHeight: 1.2,
            marginBottom: "48px",
          }}>
            Nem ügynökség vagyunk.<br />
            <span style={{ color: "#f06f66" }}>A bevételi működést rakjuk rendbe.</span>
          </h2>
        </div>

        <div style={{ border: "1px solid rgba(240,223,200,0.1)", overflow: "hidden", borderTopLeftRadius: "20px" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", backgroundColor: "rgba(240,111,102,0.08)", borderBottom: "1px solid rgba(240,111,102,0.2)" }}>
            <div style={{ padding: "16px 24px", fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "rgba(240,223,200,0.35)" }}>Szempont</div>
            <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,223,200,0.08)", fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "rgba(240,223,200,0.4)" }}>Hagyományos ügynökség</div>
            <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,111,102,0.3)", backgroundColor: "rgba(240,111,102,0.06)", fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#f06f66" }}>Brandfabrik</div>
          </div>
          {differentiatorRows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", borderBottom: i < differentiatorRows.length - 1 ? "1px solid rgba(240,223,200,0.06)" : "none", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
              <div style={{ padding: "20px 24px", fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(240,223,200,0.5)", letterSpacing: "0.03em", display: "flex", alignItems: "center" }}>{row.aspect}</div>
              <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(240,223,200,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "rgba(240,111,102,0.45)", fontSize: "15px", flexShrink: 0 }}>✕</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 300, color: "rgba(240,223,200,0.4)", lineHeight: 1.5 }}>{row.agency}</span>
              </div>
              <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(240,111,102,0.2)", backgroundColor: "rgba(240,111,102,0.04)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#f06f66", fontSize: "15px", flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 500, color: "#f0dfc8", lineHeight: 1.5 }}>{row.brandfabrik}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Revenue System Section — replaces RevenueMatrixIntro, HowItWorks, WhatYouGet
const revenueSystemCards = [
  {
    num: "01",
    title: "Kötetlen feltáró beszélgetés",
    desc: "Az első lépés egy kötetlen beszélgetés, ahol megértjük a jelenlegi működésedet, a helyzetedet és azt, hogy hol tartasz most.",
  },
  {
    num: "02",
    title: "Testreszabott céges diagnosztika",
    desc: "Az első beszélgetés alapján elkészítjük a teljesen testreszabott kérdőívet, amellyel feltárjuk a működésedet — nem csak marketingoldalról, hanem minden olyan terület felől, ami a bevételre hatással van.",
  },
  {
    num: "03",
    title: "Külső piackutatás",
    desc: "A belső képet nem önmagában vizsgáljuk. Külső piackutatással is megnézzük, mi történik valójában a piacodon, hogyan látszol kívülről, és milyen mintázatok működnek az iparágadban.",
  },
  {
    num: "04",
    title: "Összevetés és ütköztetés",
    desc: "A céges diagnosztika és a külső piaci vizsgálat eredményeit összevetjük, hogy láthatóvá váljanak az eltérések, hiányok, vakfoltok és a valódi növekedési pontok.",
  },
  {
    num: "05",
    title: "Taxonómiai vizsgálat és priorizált rendszerterv",
    desc: "Iparág-specifikusan megvizsgáljuk a bevételszerző eszközrendszert, és bizonyítékot keresünk arra, hogy az adott területen mi lehet valóban működőképes. Ezt vetjük össze a céges diagnosztikával, és ebből áll össze a priorizált megvalósítási terv: a helyzetértékelés, a sorrendbe rendezett teendők és a hosszabb távú fejlesztési útvonal.",
  },
  {
    num: "06",
    title: "Megvalósítás",
    desc: "A folyamat nem áll meg a tervnél. A koncepcióban meghatározott stratégiai lépések feladat szintű végrehajtásában is részt veszünk, vagyis nem csak megmutatjuk az irányt, hanem segítünk fel is építeni azt a rendszert, ami a gyakorlatban működni fog.",
  },
];

function RevenueSystemSection() {
  return (
    <section style={{ backgroundColor: "#2c2c2c", padding: "100px 0 80px", position: "relative", overflow: "hidden" }}>
      {/* Network background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310419663032362343/SwAx7y8KtAtYGdCgPrByVF/hatter2-network_49bb3b4a.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.18,
        zIndex: 0,
        pointerEvents: "none",
      }} />
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "28px" }}>
            Így építjük fel a bevételi<br />rendszeredet
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.85, color: "rgba(240,223,200,0.7)", maxWidth: "780px", marginBottom: "20px" }}>
            Ahhoz, hogy valóban működőképes, megalapozott és bevételnövekedést támogató rendszert tudjunk felépíteni, egy átfogó vállalatdiagnosztikai és stratégiai módszertant dolgoztunk ki. Ezt neveztük el Revenue Matrixnak.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.85, color: "rgba(240,223,200,0.7)", maxWidth: "780px", marginBottom: "20px" }}>
            A Revenue Matrix egy sokrétegű, strukturált rendszer, amely a céges működés feltárását, a piaci valóság vizsgálatát és az iparág-specifikus bevételi lehetőségek elemzését egyetlen logikába rendezi. A célja, hogy pontosan megmutassa, mire érdemes építeni, milyen sorrendben, és hogyan lesz ebből megvalósítható bevételi rendszer.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px", color: "#f06f66", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "36px" }}>
            A folyamata a következő:
          </p>
        </div>

        {/* 6 cards — 3 columns × 2 rows */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", alignItems: "stretch", marginBottom: "64px" }}>
          {revenueSystemCards.map((card, i) => (
            <div
              key={i}
              className="revenue-card"
              style={{
                backgroundColor: "#333231",
                position: "relative",
                overflow: "hidden",
                borderBottomRightRadius: "36px",
                boxSizing: "border-box" as const,
              }}
            >
              {/* Top accent line */}
              <div className="revenue-card-top-border" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#4f4c48" }} />
              {/* Large background number */}
              <div style={{
                fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(64px, 8vw, 96px)",
                color: "rgba(240,223,200,0.08)",
                lineHeight: 1,
                position: "absolute",
                top: "-7px",
                left: "-2px",
                userSelect: "none" as const,
              }}>{card.num}</div>
              {/* Content */}
              <div style={{ padding: "100px 36px 40px 36px", position: "relative" }}>
                <div style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#f0dfc8",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  marginBottom: "12px",
                }}>{card.title}</div>
                <div style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 300,
                  fontSize: "14px",
                  color: "rgba(240,223,200,0.65)",
                  lineHeight: 1.75,
                }}>{card.desc}</div>
                {/* Bottom-right arrow for cards 01–05 */}
                {i < 5 && (
                  <div className="revenue-card-arrow" style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(240,223,200,0.65)",
                    fontSize: "18px",
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1,
                  }}>→</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div style={{ borderLeft: "4px solid #f06f66", paddingLeft: "32px", maxWidth: "860px" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "18px", color: "#f06f66", lineHeight: 1.8 }}>
            Így nem különálló marketingeszközökben gondolkodsz,<br />
            hanem egy olyan rendszerben, ahol pontosan látszik, mi működik, mi nem, és mit kell felépíteni ahhoz, hogy a bevétel kiszámíthatóan növekedjen.
          </p>
        </div>

      </div>
    </section>
  );
}

// For Whom section
function ForWhomSection() {
  const yesItems = [
    "Van már működő vállalkozásod, de úgy érzed, a bevétel nem követi az erőfeszítéseidet",
    "Próbáltál már marketing-megoldásokat, de nem hoztak tartós eredményt",
    "Nem látod át, hogy pontosan hol szivárog a bevételed",
    "Szerződnél egy ügynökséggel, de előbb bizonyítékot szeretnél látni",
    "Fontos neked, hogy ne kössön le hosszú távú szerződés, és csak addig tartson, amíg kézzelfogható hasznot biztosít számodra",
  ];
  const noItems = [
    "Még nem indítottad el a vállalkozásodat",
    "Gyors, sablon-alapú megoldást keresel",
    "Nem vagy kész változtatni, ha az elemzés azt javasolja",
  ];

  return (
    <section style={{ padding: "100px 0", backgroundColor: "#2a2a2a" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ marginBottom: "56px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "16px" }}>
            Kinek szól a diagnosztika alapú szolgáltatásunk?
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", color: "rgba(240,223,200,0.55)", maxWidth: "520px" }}>
            Nem mindenkinek való. Olvasd át őszintén — ha rád illik, érdemes beszélnünk.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div style={{ border: "1px solid rgba(240,111,102,0.2)", backgroundColor: "rgba(240,111,102,0.04)", borderBottomRightRadius: "40px" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(240,111,102,0.15)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#f06f66", fontSize: "16px", fontWeight: 700 }}>✓</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#f06f66" }}>Neked szól, ha…</span>
            </div>
            <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {yesItems.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ color: "#f06f66", fontSize: "18px", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.85)", lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: "1px solid rgba(240,223,200,0.08)", backgroundColor: "rgba(240,223,200,0.02)", borderTopLeftRadius: "20px" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(240,223,200,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "rgba(240,223,200,0.35)", fontSize: "16px", fontWeight: 700 }}>✕</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(240,223,200,0.35)" }}>Nem neked szól, ha…</span>
            </div>
            <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {noItems.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ color: "rgba(240,223,200,0.25)", fontSize: "18px", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>—</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.45)", lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(240,223,200,0.06)", fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "rgba(240,223,200,0.3)", fontStyle: "italic", lineHeight: 1.6 }}>
              Ha nem vagy benne biztos, írj nekünk — őszintén megmondjuk, tud-e segíteni a Revenue Matrix.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Case study section
function CaseStudySection() {
  const { ref, inView } = useInView(0.15);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(520);

  useEffect(() => {
    const el = rightPanelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setChartHeight(el.offsetHeight));
    ro.observe(el);
    setChartHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).Chart) {
        const canvas = document.getElementById("caseMatrix") as HTMLCanvasElement;
        if (!canvas || (canvas as any)._chartInstance) return;
        const quadrantPlugin = {
          id: "quadrantBg",
          beforeDraw(chart: any) {
            const { ctx, chartArea, scales } = chart;
            if (!chartArea) return;
            const { left, right, top, bottom } = chartArea;
            const midX = scales.x.getPixelForValue(5);
            const midY = scales.y.getPixelForValue(5);
            ctx.fillStyle = "rgba(240,111,102,0.10)"; ctx.fillRect(left, top, midX - left, midY - top);
            ctx.fillStyle = "rgba(240,223,200,0.03)"; ctx.fillRect(midX, top, right - midX, midY - top);
            ctx.fillStyle = "rgba(240,223,200,0.02)"; ctx.fillRect(midX, midY, right - midX, bottom - midY);
            ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fillRect(left, midY, midX - left, bottom - midY);
            ctx.strokeStyle = "rgba(240,223,200,0.1)"; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
            ctx.beginPath(); ctx.moveTo(midX, top); ctx.lineTo(midX, bottom); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(left, midY); ctx.lineTo(right, midY); ctx.stroke();
            ctx.setLineDash([]);
          },
          afterDraw(chart: any) {
            const { ctx, chartArea, scales } = chart;
            if (!chartArea) return;
            const { left, right, top, bottom } = chartArea;
            const midX = scales.x.getPixelForValue(5);
            const midY = scales.y.getPixelForValue(5);
            ctx.font = "600 10px Poppins, sans-serif"; ctx.textAlign = "center";
            ctx.fillStyle = "rgba(240,111,102,0.65)"; ctx.fillText("AZONNALI BEAVATKOZÁSOK", (left + midX) / 2, top + 16);
            ctx.fillStyle = "rgba(240,223,200,0.28)"; ctx.fillText("NAGYOBB PROJEKTEK", (midX + right) / 2, top + 16);
            ctx.fillStyle = "rgba(240,223,200,0.22)"; ctx.fillText("KISEBB KIEGÉSZÍTŐK", (midX + right) / 2, bottom - 8);
            ctx.fillStyle = "rgba(240,223,200,0.15)"; ctx.fillText("KERÜLENDŐK", (left + midX) / 2, bottom - 8);
          },
        };
        const chart = new (window as any).Chart(canvas, {
          type: "bubble",
          data: {
            datasets: [
              { label: "Azonnali beavatkozások — 1. fázis", data: [{ x: 1.5, y: 8.5, r: 12, label: "Árlélektani étlapépítés", growth: "+15–25% kosárérték" }, { x: 2.0, y: 7.8, r: 10, label: "Google Business Profile", growth: "+40–70% Maps láthatóság" }, { x: 1.2, y: 8.0, r: 9, label: "Felszolgálói tréning", growth: "+10–15% kosárérték" }, { x: 2.5, y: 7.5, r: 9, label: "Vendégvélemény-kezelés", growth: "+50+ értékelés" }, { x: 1.8, y: 6.8, r: 8, label: "Digitális menü (QR)", growth: "+5–9 értékelés/hó" }], backgroundColor: "rgba(240,111,102,0.80)", borderColor: "#f06f66", borderWidth: 1 },
              { label: "Nagyobb projektek — 2. fázis", data: [{ x: 5.5, y: 8.8, r: 11, label: "Meta Ads", growth: "+15–30 esti vendég/hét" }, { x: 6.0, y: 8.2, r: 10, label: "Google Local Ads", growth: "+10–20 turista/hét" }, { x: 5.2, y: 7.5, r: 8, label: "Szálloda-portás megállapodás", growth: "+5–15 turista/hét" }], backgroundColor: "rgba(240,223,200,0.50)", borderColor: "rgba(240,223,200,0.75)", borderWidth: 1 },
              { label: "Rendszer és skálázás — 3. fázis", data: [{ x: 8.5, y: 9.0, r: 12, label: "Weboldal és foglalási rendszer", growth: "Minden digitális eszköz ×2" }, { x: 7.5, y: 8.5, r: 10, label: "Remarketing", growth: "Legjobb Meta ROI" }], backgroundColor: "rgba(240,223,200,0.22)", borderColor: "rgba(240,223,200,0.35)", borderWidth: 1 },
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true, backgroundColor: "rgba(30,20,20,0.92)", titleColor: "#f06f66", bodyColor: "rgba(240,223,200,0.8)", callbacks: { title: (items: any[]) => items[0]?.raw?.label || "", label: (item: any) => item.raw?.growth ? [" ▶ " + item.raw.growth] : [] } } },
            scales: { x: { min: 0, max: 10, grid: { color: "rgba(240,223,200,0.04)" }, ticks: { display: false }, border: { display: false } }, y: { min: 0, max: 10, grid: { color: "rgba(240,223,200,0.04)" }, ticks: { display: false }, border: { display: false } } },
          },
          plugins: [quadrantPlugin],
        });
        (canvas as any)._chartInstance = chart;
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [inView]);

  return (
    <section ref={ref} style={{ padding: "120px 0", backgroundColor: "rgba(0,0,0,0.18)" }}>
      <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js" async />
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ marginBottom: "64px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(28px, 3vw, 48px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "16px" }}>Így néz ki egy valós elemzés eredménye</h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", color: "rgba(240,223,200,0.6)", maxWidth: "640px", lineHeight: 1.8 }}>
            335 általános eszközből kiindulva, a konkrét vállalkozásra szűrve — minden pont egy valódi beavatkozási javaslatot jelöl.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", marginBottom: "64px" }}>
          {[{ num: "335", label: "Általános eszköz a taxonómiában" }, { num: "127", label: "Releváns az ügyfél helyzetére" }, { num: "30", label: "Prioritizált beavatkozás" }, { num: "3", label: "Végrehajtási fázis" }].map((item, i) => (
            <div key={i} className="card-hover" style={{ backgroundColor: i === 2 ? "rgba(240,111,102,0.1)" : "rgba(240,223,200,0.03)", position: "relative", overflow: "hidden", borderBottomRightRadius: (i === 1 || i === 3) ? "0" : "20px", borderBottomLeftRadius: (i === 1 || i === 3) ? "20px" : "0", padding: "20px 24px 24px 24px", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: i === 2 ? "#f06f66" : "rgba(240,223,200,0.12)" }} />
              <div style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 4vw, 56px)", color: i === 2 ? "#f06f66" : "#f0dfc8", lineHeight: 1, marginBottom: "12px" }}>{item.num}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.55)", lineHeight: 1.5 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "48px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 500, color: "rgba(240,223,200,0.35)", textTransform: "uppercase", letterSpacing: "2px", whiteSpace: "nowrap", transform: "rotate(-90deg)", display: "block" }}>Bevételnövelő hatás →</span>
              </div>
              <div style={{ flex: 1, height: `${chartHeight}px`, backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(240,223,200,0.12)", borderTopLeftRadius: "20px", overflow: "hidden" }}>
                <canvas id="caseMatrix" style={{ display: "block", width: "100%", height: "100%" }} />
              </div>
            </div>
            <div style={{ marginLeft: "28px", textAlign: "center", paddingTop: "10px" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 500, color: "rgba(240,223,200,0.35)", textTransform: "uppercase", letterSpacing: "2px" }}>← Könnyebb megvalósítani &nbsp;&nbsp; Nehezebb →</span>
            </div>
          </div>
          <div ref={rightPanelRef} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "8px" }}>
              {[{ color: "#f06f66", label: "1. fázis — Azonnali beavatkozások", sub: "0–20 ezer Ft · 1–4. hét" }, { color: "rgba(240,223,200,0.7)", label: "2. fázis — Láthatóság és elérés", sub: "30–80 ezer Ft/hó · 1–3. hónap" }, { color: "rgba(240,223,200,0.3)", label: "3. fázis — Rendszer és skálázás", sub: "50–120 ezer Ft/hó · 3–6. hónap" }].map((l, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: l.color, flexShrink: 0, marginTop: "3px" }} />
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px", color: "#f0dfc8", marginBottom: "2px" }}>{l.label}</div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "12px", color: "rgba(240,223,200,0.45)" }}>{l.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-hover" style={{ backgroundColor: "rgba(240,111,102,0.08)", borderLeft: "3px solid #f06f66", padding: "16px 20px", borderBottomRightRadius: "16px" }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px", color: "#f06f66", marginBottom: "6px" }}>1. fázis — összesített hatás</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.75)", lineHeight: 1.6 }}>Az 1. fázis beavatkozásai együttesen +20–35% havi bevételnövekedést realizálhatnak — 1–4 hetes megtérülési idő mellett.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Inline useInView for CaseStudy
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// StaggeredAreaGrid
const AREA_ITEMS = [
  { num: "I", title: "A vállalkozás jelenlegi helyzete", sub: "Pozicionálás, differenciátorok, ideális ügyfél, kínálatstruktúra, árazás, növekedési kapacitás" },
  { num: "II", title: "A piac", sub: "Versenytársak, piaci versenyhelyzet, piaci pozíció" },
  { num: "III", title: "Hogyan találnak rád", sub: "Digitális jelenlét, online láthatóság, GEO jelenlét" },
  { num: "IV", title: "Hogyan lesz érdeklődőből ügyfél", sub: "Vásárlói út, visszatérés, utánkövetés" },
  { num: "V", title: "Marketing és értékesítés", sub: "Jelenlegi tevékenységek, csatornák, konverziók" },
  { num: "VI", title: "Bevétel, célok, elvárások", sub: "Jelenlegi számok, növekedési célok, prioritások" },
  { num: "VII", title: "Záró kérdések", sub: "Korábbi tapasztalatok, félelmek, nyitott gondolatok" },
];

function StaggeredAreaGrid() {
  const { ref, triggered } = useStaggerInView(AREA_ITEMS.length + 1);
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", columnGap: "2px", rowGap: "2px", maxWidth: "680px" }}>
      {AREA_ITEMS.map((area, i) => (
        <div key={i} className={triggered ? "card-anim-wrap triggered" : "card-anim-wrap"} style={{ animationDelay: `${i * 80}ms` }}>
          <div className="card-hover" style={{ height: "100%", backgroundColor: "rgba(240,223,200,0.03)", borderRight: i % 2 === 1 ? "3px solid rgba(240,111,102,0.25)" : "none", borderLeft: i % 2 === 0 ? "3px solid rgba(240,111,102,0.25)" : "none", padding: "16px 20px" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "rgba(240,111,102,0.6)", marginBottom: "6px" }}>{area.num}. terület</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", color: "#f0dfc8", marginBottom: "6px", lineHeight: 1.3 }}>{area.title}</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "12px", color: "rgba(240,223,200,0.5)", lineHeight: 1.5 }}>{area.sub}</div>
          </div>
        </div>
      ))}
      <div className={triggered ? "card-anim-wrap triggered" : "card-anim-wrap"} style={{ animationDelay: `${AREA_ITEMS.length * 80}ms` }}>
        <div className="card-hover" style={{ height: "100%", backgroundColor: "rgba(240,111,102,0.08)", borderRight: "3px solid #f06f66", padding: "16px 20px", borderTopLeftRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", color: "#f0dfc8", marginBottom: "6px", lineHeight: 1.3 }}>Készen állsz a diagnózisra?</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "12px", color: "rgba(240,223,200,0.5)", lineHeight: 1.5 }}>Ingyenes, kötelezettségmentes.</div>
          </div>
          <a href="#cta" className="btn-coral" style={{ display: "inline-block", marginTop: "14px", padding: "8px 16px", backgroundColor: "#f06f66", color: "#1a1a1a", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", textDecoration: "none", borderRadius: "0", borderBottomRightRadius: "12px", alignSelf: "flex-start" }}>Diagnosztikát kérek <span className="btn-arrow">→</span></a>
        </div>
      </div>
    </div>
  );
}

// Why trust section
function WhyTrustSection() {
  const reasons = [
    { title: "A te vállalkozásodra szabva", desc: "Nem általános tanácsokat hallasz — hanem azt, ami a te piacodon, a te helyzetedben valóban működik." },
    { title: "Elvágja a gordiuszi csomót", desc: "Ma már annyi bevételszerző eszköz létezik, hogy a legtöbb vállalkozó nem tudja, melyikbe érdemes időt és pénzt fektetni. A Revenue Matrix ezt a káoszt rendezi." },
    { title: "Először megmutatjuk, utána segítünk", desc: "A prioritizált lista leveszi rólad a 'mit csináljak először?' terhét. Tiszta cselekvési tervet kapsz — és csak utána kerül szóba, hogy miben segítsünk a kivitelezésben." },
    { title: "Nem futószalag, hanem műtét", desc: "Egy elemzés elvégzéséhez valóban ismerni kell a vállalkozást. Ezért egyszerre csak néhány ügyféllel dolgozunk — hogy minden diagnózis valóban személyre szabott legyen." },
  ];

  return (
    <section style={{ padding: "120px 0", backgroundColor: "#303030" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ marginBottom: "72px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2 }}>Miért működik ez az elemzés?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", columnGap: "2px", rowGap: "2px" }}>
          {reasons.map((item, i) => (
            <div key={i} className="card-hover" style={{ padding: "48px 40px", backgroundColor: "rgba(240,223,200,0.03)", borderLeft: i % 2 === 0 ? "3px solid #f06f66" : "none", borderRight: i % 2 === 1 ? "3px solid rgba(240,223,200,0.15)" : "none", borderTopRightRadius: i === 0 ? "28px" : "0", borderBottomRightRadius: i === 2 ? "28px" : "0", borderTopLeftRadius: i === 1 ? "28px" : "0", borderBottomLeftRadius: i === 3 ? "28px" : "0" }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "20px", color: i % 2 === 0 ? "#f06f66" : "#f0dfc8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>{item.title}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.7)", lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Implementation section
function ImplementationSection() {  return (
    <section style={{ padding: "100px 0", backgroundColor: "#303030", position: "relative" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "3px", color: "rgba(240,111,102,0.7)", marginBottom: "16px" }}>Ahol a lényeg van</div>
        <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "20px" }}>Stratégia, majd végrehajtás</h2>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.85, color: "rgba(240,223,200,0.75)", marginBottom: "16px", maxWidth: "720px" }}>
          A diagnózis csak a belépő. A Brandfabrik valódi értéke az, ami utána következik: a stratégia felállítása és a végrehajtás — havi együttműködés keretében.
        </p>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", lineHeight: 1.85, color: "rgba(240,223,200,0.55)", maxWidth: "720px", marginBottom: "48px" }}>
          Az elemzés eredményei alapján felállítjuk a stratégiát három időtávra bontva. A cél egyértelmű: minél hamarabb hozzon kézzelfogható eredményt a megvalósítás.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", maxWidth: "900px", marginBottom: "32px" }}>
          {[
            { label: "Azonnali", timeframe: "1–4 hét", desc: "Kis befektetéssel, gyorsan megvalósítható beavatkozások, amelyek azonnal érezhetővé teszik a változást.", highlight: true },
            { label: "Középtávú", timeframe: "1–3 hónap", desc: "Rendszerépítés: láthatóság, elérés, ügyfélút optimalizálása — az alapok, amelyekre minden más épül.", highlight: false },
            { label: "Hosszabb távú", timeframe: "3–12 hónap", desc: "Skálázható struktúra, automatizált folyamatok, fenntartható növekedési rendszer.", highlight: false },
          ].map((item, i) => (
            <div key={i} className="card-hover" style={{ backgroundColor: item.highlight ? "rgba(240,111,102,0.08)" : "rgba(240,223,200,0.03)", borderTop: `3px solid ${item.highlight ? "#f06f66" : "rgba(240,223,200,0.15)"}`, padding: "28px 24px", borderBottomRightRadius: "30px" }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", color: item.highlight ? "#f06f66" : "#f0dfc8", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{item.label}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "12px", color: "rgba(240,111,102,0.7)", marginBottom: "14px" }}>{item.timeframe}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.55)", lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA section
function CTASection() {
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const FORMSPREE_DIAG_ID = "YOUR_FORM_ID";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_DIAG_ID}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...formData, _subject: "Revenue Matrix — Diagnosztika kérés" }) });
    } catch (_) { }
    setSubmitted(true);
  };

  const inputStyle = { width: "100%", backgroundColor: "rgba(240,223,200,0.06)", border: "1px solid rgba(240,223,200,0.15)", borderBottomRightRadius: "10px", color: "#f0dfc8", padding: "14px 18px", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 300, outline: "none" };

  return (
    <section id="cta" style={{ padding: "120px 0", backgroundColor: "rgba(0,0,0,0.25)" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
          <div>
            <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
            <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "24px" }}>Elemzés. Stratégia. Végrehajtás.</h2>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.8, color: "rgba(240,223,200,0.7)", marginBottom: "40px" }}>
              A Revenue Matrix diagnózis kötelezettségmentes — de nem öncélú. Az eredmények alapján felállítjuk a stratégiát, és havi együttműködés keretében végrehajtjuk.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {["Kötelezettségmentes — semmilyen kötöttség nélkül", "Személyre szabott, nem sablon", "Az eredményt személyesen mutatjuk be", "Komoly vállalkozásoknak — nem mindenkinek"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{ width: "20px", height: "20px", backgroundColor: "rgba(240,111,102,0.15)", border: "1px solid rgba(240,111,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderBottomRightRadius: "6px" }}>
                    <span style={{ color: "#f06f66", fontSize: "11px" }}>✓</span>
                  </div>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 400, color: "rgba(240,223,200,0.8)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div style={{ backgroundColor: "rgba(240,111,102,0.1)", border: "1px solid rgba(240,111,102,0.3)", padding: "48px 40px", textAlign: "center", borderBottomRightRadius: "40px" }}>
                <div style={{ fontSize: "48px", marginBottom: "24px" }}>✓</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "22px", color: "#f06f66", marginBottom: "16px" }}>Köszönjük a jelentkezésedet!</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.7)", lineHeight: 1.7 }}>Hamarosan felvesszük veled a kapcsolatot.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input style={inputStyle} type="text" placeholder="Neved *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input style={inputStyle} type="text" placeholder="Vállalkozás neve *" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                <input style={inputStyle} type="email" placeholder="Email cím *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input style={inputStyle} type="tel" placeholder="Telefonszám *" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} placeholder="Röviden: mi a legnagyobb kihívásod most? (nem kötelező)" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                <button type="submit" className="btn-coral" style={{ backgroundColor: "#f06f66", color: "#303030", padding: "18px 32px", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0", borderBottomRightRadius: "12px" }}>
                  Visszahívást kérek <span className="btn-arrow">→</span>
                </button>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 400, color: "rgba(240,223,200,0.5)", lineHeight: 1.5, textAlign: "center", marginTop: "4px" }}>Kötelezettség nélkül. Emberi nyelven.</p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "rgba(240,223,200,0.3)", lineHeight: 1.5 }}>* Kötelező mezők. Az adataidat bizalmasan kezeljük, harmadik félnek nem adjuk át.</p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "rgba(240,223,200,0.3)", lineHeight: 1.5, marginTop: "4px" }}>
                  A „visszahívást kérek" gombra kattintva hozzájárulsz adataid GDPR-megfelelő kezeléséhez.{" "}
                  <a href="/adatkezeles" style={{ color: "rgba(240,111,102,0.6)", textDecoration: "underline" }}>Adatkezelési tájékoztató</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer style={{ backgroundColor: "#1e1e1e", borderTop: "1px solid rgba(240,223,200,0.08)", padding: "40px 0" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img src={LOGO_URL} alt="Brandfabrik" style={{ height: "28px", objectFit: "contain" }} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "rgba(240,223,200,0.25)", letterSpacing: "0.12em", textTransform: "uppercase" }}>bevétel · rendszer · építés</span>
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "rgba(240,223,200,0.3)" }}>© {new Date().getFullYear()} Brandfabrik. Minden jog fenntartva.</div>
          <a href="/adatkezeles" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "rgba(240,223,200,0.35)", textDecoration: "none", borderBottom: "1px solid rgba(240,223,200,0.15)", paddingBottom: "1px" }}>Adatkezelési tájékoztató</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div style={{ backgroundColor: "#303030", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <DifferentiatorTable />
      <RevenueSystemSection />
      <ForWhomSection />
      <CaseStudySection />
      <WhyTrustSection />
      <ImplementationSection />
      <CTASection />
      <Footer />
    </div>
  );
}
