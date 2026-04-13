import React, { useEffect, useRef, useState } from "react";
import { motion, useInView as useFramerInView } from "framer-motion";

// Animation variants

// Hero: slow, weighty reveal — each element "arrives" with intention
// Smooth ease: [0.22, 1, 0.36, 1] is a gentle ease-out with no spring/bounce.
// y kept at 32px — large y + fast-start easing causes visible "jump"; smaller y + slow ease = dignified drift.
// blur removed from h1 entirely — animating filter on large text is the #1 cause of jank in Chrome.
const heroH1Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] as const }
  },
};
const heroSubtitleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: "easeOut" as const, delay: 0.55 }
  },
};
const heroLeftPanelVariants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const, delay: 0.85 }
  },
};
const heroBtnVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const, delay: 1.15 }
  },
};
const heroRightPanelVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const, delay: 0.85 }
  },
};

// Scroll sections — same dignified character as the hero
// Shared easing: custom cubic-bezier for soft, weighty motion
const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(3px)" },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE_SOFT, delay }
  }),
};
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({ opacity: 1, transition: { duration: 0.75, ease: "easeOut" as const, delay } }),
};
// Stagger container for card grids — slower children for a more deliberate feel
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
// Each stagger item: blur+lift, matching the hero language
const staggerItem = {
  hidden: { opacity: 0, y: 32, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE_SOFT } },
};
// Row reveal for table rows — subtle, left-to-right
const rowReveal = {
  hidden: { opacity: 0, x: -20, filter: "blur(2px)" },
  visible: (delay: number = 0) => ({
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_SOFT, delay }
  }),
};
// Slide from left/right for symmetric card pairs
const slideFromLeft = {
  hidden: { opacity: 0, x: -40, filter: "blur(3px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE_SOFT }
  },
};
const slideFromRight = {
  hidden: { opacity: 0, x: 40, filter: "blur(3px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE_SOFT }
  },
};
// Stagger for list items inside cards — very soft, cascading
const listItemVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE_SOFT } },
};
const listStaggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032362343/QvwZVu498WhwxVrDug5WRT/brandfabrik-logo_a07a612a.png";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032362343/QvwZVu498WhwxVrDug5WRT/hero-bg-WtqreeCZ7YEA9bixUDG9YN.webp";

// Legacy hook kept for CaseStudy (uses its own useInView)
function useStaggerInView(count: number, threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setTriggered(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, triggered };
}

// Count-up hook — starts counting when `active` becomes true
function useCountUp(target: number, active: boolean, duration = 1400, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    let raf: number;
    const delayTimer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(delayTimer); cancelAnimationFrame(raf); };
  }, [active, target, duration, delay]);
  return count;
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
    { text: "A teljes bevételszerző működést átvizsgáljuk ", asterisk: true },
    { text: "Bizonyított elemekből, prioritás mentén építünk rendszert", asterisk: false },
    { text: "Amit javaslunk, azért a megvalósításig felelősséget vállalunk", asterisk: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", border: "1px solid rgba(240,223,200,0.1)", backgroundColor: "rgba(48,48,48,0.6)", backdropFilter: "blur(8px)", borderTopLeftRadius: "20px" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(240,223,200,0.1)" }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "3px", color: "#f06f66" }}>A MI HOZZÁÁLLÁSUNK</div>
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

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useFramerInView(heroRef, { once: true, margin: "0px" });
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
        ref={heroRef}
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
        {/* H1 — slow blur+lift reveal, the anchor of the page */}
        <motion.h1
          variants={heroH1Variants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
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
            willChange: 'transform, opacity',
          }}
        >
          A legtöbb cégvezető nem tudja, mennyi pénzt hagy{' '}
          <span style={{ color: '#f06f66' }}>az asztalon.</span>
        </motion.h1>

        {/* Tagline — pure opacity fade, quieter than the h1 */}
        <motion.p
          variants={heroSubtitleVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
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
          A Revenue Matrix diagnosztikával feltárjuk, hol akad el az ügyfélszerzés, a kommunikáció és a bevételi működés — majd ezek alapján felépítjük azt a rendszert, ami a te piacodon bizonyítottan működik.
        </motion.p>

        {/* Two-column panels — open symmetrically from center */}
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
          {/* Left panel — slides in from left */}
          <motion.div
            variants={heroLeftPanelVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            style={{ textAlign: 'right' }}
          >
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px', lineHeight: 1.5, color: 'rgba(240,223,200,0.85)', marginBottom: '8px' }}>
              Az első kötelezettségmentes beszélgetés célja:
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: '15px', lineHeight: 1.6, color: 'rgba(240,223,200,0.75)', marginBottom: '32px' }}>
              megnézni, hol van valódi növekedési lehetőség a cégedben,<br />és van-e értelme rendszert építeni rá.
            </p>
            {/* CTA button — delayed slightly after panel, draws the eye last */}
            <motion.a
              href="#cta"
              variants={heroBtnVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              className="btn-coral"
              style={{ backgroundColor: '#f06f66', color: '#303030', padding: '18px 36px', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0', borderBottomRightRadius: '12px' }}
            >
              Visszahívást kérek <span className="btn-arrow">→</span>
            </motion.a>
          </motion.div>

          {/* Right panel — slides in from right, mirrors left */}
          <motion.div
            variants={heroRightPanelVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <HeroDifferentiatorTabs />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, #303030)', zIndex: 1 }} />
    </section>
  );
}



// Differentiator Table — static, no scroll animation
const differentiatorRows = [
  { aspect: "Kiindulópont", agency: "Előre kialakított szolgáltatásokból indul ki", brandfabrik: "A vállalkozásod valós helyzetéből indul ki" },
  { aspect: "Első lépés", agency: "Kivitelezést ajánl", brandfabrik: "Először átvizsgálja, hol akad el a bevételszerzés" },
  { aspect: "Fókusz", agency: "Különálló marketingeszközök", brandfabrik: "A teljes bevételszerző működés" },
  { aspect: "Gondolkodásmód", agency: "Kampányokban és csatornákban gondolkodik", brandfabrik: "Rendszerben, prioritásban és üzleti logikában gondolkodik" },
  { aspect: "Javaslat alapja", agency: "Általános best practice-ek", brandfabrik: "A te piacod, a te működésed és a te elakadásaid" },
  { aspect: "Cél", agency: "Több marketingaktivitás", brandfabrik: "Jobban működő bevételi rendszer" },
  { aspect: "Kivitelezés szerepe", agency: "Gyakran előbb jön, mint a tisztán látható diagnózis", brandfabrik: "Csak azután indul, hogy látszik, mire van valóban szükség" },
  { aspect: "Eredmény", agency: "Több eszköz, több zaj, több bizonytalanság", brandfabrik: "Tisztább irány, jobb sorrend és indokolhatóbb döntések" },
];

function DifferentiatorTable() {
  // Same split-ref pattern as ForWhom:
  // headerRef fires when the heading is 30% visible;
  // tableRef fires only when the table itself is clearly on screen (-300px margin)
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const headerInView = useFramerInView(headerRef, { once: true, amount: 0.3 });
  const tableInView = useFramerInView(tableRef, { once: true, margin: "0px 0px -400px 0px" });
  return (
    <section style={{ backgroundColor: "#2a2a2a", padding: "40px 0 100px" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <motion.div
          ref={headerRef}
          variants={fadeUpVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          custom={0}
          style={{ marginBottom: "48px" }}
        >
          <h2 style={{
            fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(28px, 3vw, 44px)",
            color: "#f0dfc8",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}>
            Nem ügynökség vagyunk.<br />
            <span style={{ color: "#f06f66" }}>A bevételi működést rakjuk rendbe.</span>
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", color: "rgba(240,223,200,0.55)", maxWidth: "720px", lineHeight: 1.75 }}>
            A legtöbb ügynökség eszközöket, kampányokat vagy kivitelezést ad el. Mi először azt vizsgáljuk meg, hogy a vállalkozásodban hol akad el a bevételszerzés, és csak ezután építünk rá olyan rendszert, ami üzletileg is indokolható.
          </p>
        </motion.div>

        {/* Wrapper fades in together with the rows — opacity only, no y/blur so it doesn’t
             fight with the individual row animations. overflow:hidden kept for rounded corners. */}
        <motion.div
          ref={tableRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: tableInView ? 1 : 0 }}
          transition={{ duration: 0.01, delay: 0 }}
          style={{ border: "1px solid rgba(240,223,200,0.1)", overflow: "hidden", borderTopLeftRadius: "20px" }}
        >
          {/* Header row — animated as first stagger item */}
          <motion.div variants={rowReveal} custom={0} initial="hidden" animate={tableInView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", backgroundColor: "rgba(240,111,102,0.08)", borderBottom: "1px solid rgba(240,111,102,0.2)" }}>
            <div style={{ padding: "16px 24px", fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "rgba(240,223,200,0.7)" }}>Szempont</div>
            <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,223,200,0.08)", fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "rgba(240,223,200,0.4)" }}>Hagyományos ügynökségi működés</div>
            <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,111,102,0.3)", backgroundColor: "rgba(240,111,102,0.06)", fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#f06f66" }}>Brandfabrik megközelítés</div>
          </motion.div>
          {differentiatorRows.map((row, i) => (
            <motion.div key={i} variants={rowReveal} custom={(i + 1) * 0.08} initial="hidden" animate={tableInView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", borderBottom: i < differentiatorRows.length - 1 ? "1px solid rgba(240,223,200,0.06)" : "none", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
              <div style={{ padding: "20px 24px", fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: "#f0dfc8", letterSpacing: "0.03em", display: "flex", alignItems: "center" }}>{row.aspect}</div>
              <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(240,223,200,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "rgba(240,111,102,0.45)", fontSize: "15px", flexShrink: 0 }}>✕</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 300, color: "rgba(240,223,200,0.6)", lineHeight: 1.5 }}>{row.agency}</span>
              </div>
              <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(240,111,102,0.2)", backgroundColor: "rgba(240,111,102,0.04)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#f06f66", fontSize: "15px", flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 500, color: "#f0dfc8", lineHeight: 1.5 }}>{row.brandfabrik}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={tableInView ? "visible" : "hidden"}
          custom={0.4}
          style={{ marginTop: "40px", borderLeft: "4px solid #f06f66", paddingLeft: "24px", maxWidth: "720px" }}
        >
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.7)", lineHeight: 1.75, fontStyle: "italic" }}>
            Nem azt keressük, mit lehetne még rátenni a cégedre. Hanem azt, hogy mitől fog stabilabban működni a bevételszerzés.
          </p>
        </motion.div>
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
    desc: "A beszélgetés alapján elindítjuk a teljes testreszabott diagnosztikát, amellyel feltárjuk a működésedben azokat a pontokat, amelyek a bevételszerzést és a növekedést ma leginkább visszafogják.",
  },
  {
    num: "03",
    title: "Külső piackutatás",
    desc: "A belső képet nem önmagában vizsgáljuk. Külső piackutatással is megnézzük, mi történik a piacodon, hogyan látszol kívülről, és mit csinálnak jól azok a versenytársaid, akik egyre sikeresebbek az online térben.",
  },
  {
    num: "04",
    title: "Összevetés és ütköztetés",
    desc: "A belső diagnosztika és a külső piaci vizsgálat eredményeit összevetjük, hogy láthatóvá váljanak az eltérések, a hiányok, a vakfoltok és a valódi növekedési pontok.",
  },
  {
    num: "05",
    title: "Taxonómiai vizsgálat és priorizált rendszerterv",
    desc: "Iparág-specifikusan megvizsgáljuk a bevételszerző eszközrendszert, és bizonyítékot keresünk arra, hogy vállalkozásod tekintetében mi lehet valóban működőképes. Ezt vetjük össze a céges diagnosztikával, és ebből áll össze a priorizált megvalósítási terv: a helyzetértékelés, a sorrendbe rendezett teendők és a hosszabb távú fejlesztési útvonal.",
  },
  {
    num: "06",
    title: "Megvalósítás",
    desc: "A folyamat nem áll meg a felismerésnél vagy a stratégiánál. A meghatározott lépések alapján veled együtt felépítjük azt a bevételi rendszert, amely nem papíron működik jól, hanem a gyakorlatban is.",
  },
];

// Revenue card left-slide variant — each card slides in from the left with a per-card delay
// No blur on cards (same reason as h1: blur on many elements causes jank)
const revenueCardVariant = {
  hidden: { opacity: 0, x: -56 },
  visible: (delay: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay }
  }),
};

function RevenueSystemSection() {
  // Header: fires when heading is 30% visible
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useFramerInView(headerRef, { once: true, amount: 0.3 });
  // Row 1 (cards 1-2-3): fires when row 1 is clearly on screen
  const row1Ref = useRef<HTMLDivElement>(null);
  const row1InView = useFramerInView(row1Ref, { once: true, margin: "0px 0px -400px 0px" });
  // Row 2 (cards 4-5-6): fires when row 2 is clearly on screen (deeper trigger)
  const row2Ref = useRef<HTMLDivElement>(null);
  const row2InView = useFramerInView(row2Ref, { once: true, margin: "0px 0px -400px 0px" });
  // Closing statement: fires after row 2
  const closingRef = useRef<HTMLDivElement>(null);
  const closingInView = useFramerInView(closingRef, { once: true, margin: "0px 0px -200px 0px" });

  const cardJSX = (card: typeof revenueSystemCards[0], i: number) => (
    <motion.div
      key={i}
      variants={revenueCardVariant}
      custom={i % 3 * 0.18}
      initial="hidden"
      animate={i < 3 ? (row1InView ? "visible" : "hidden") : (row2InView ? "visible" : "hidden")}
      className="revenue-card"
      style={{
        backgroundColor: "#333231",
        position: "relative",
        overflow: "hidden",
        borderBottomRightRadius: "36px",
        boxSizing: "border-box" as const,
      }}
    >
      {/* hatter6 overlay */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 100%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.85, pointerEvents: "none" }} />
      {/* Top accent line */}
      <div className="revenue-card-top-border" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#4f4c48" }} />
      {/* Large background number */}
      <div className="revenue-card-number" style={{
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
      <div style={{ padding: "100px 36px 56px 36px", position: "relative" }}>
        <div className="revenue-card-title" style={{
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
      </div>
      {/* Small arrow for cards 01–05 */}
      {i < 5 && (
        <div className="revenue-card-arrow" style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(240,223,200,0.25)",
          fontSize: "18px",
          fontFamily: "'Poppins', sans-serif",
          lineHeight: 1,
        }}>→</div>
      )}
      {/* Small down arrow for card 06 */}
      {i === 5 && (
        <div className="revenue-card-arrow" style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(240,223,200,0.25)",
          fontSize: "18px",
          fontFamily: "'Poppins', sans-serif",
          lineHeight: 1,
        }}>↓</div>
      )}
    </motion.div>
  );

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
        <motion.div ref={headerRef} variants={fadeUpVariants} initial="hidden" animate={headerInView ? "visible" : "hidden"} custom={0} style={{ marginBottom: "56px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "28px" }}>
            Így építjük fel a bevételi<br />rendszeredet
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.85, color: "rgba(240,223,200,0.7)", maxWidth: "780px", marginBottom: "20px" }}>
            Ahhoz, hogy valóban működő, megalapozott és a bevételi növekedést támogató rendszert tudjunk felépíteni, nem ötletekből indulunk ki, hanem feltárásból, diagnosztikából és világos stratégiai sorrendből.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.85, color: "rgba(240,223,200,0.7)", maxWidth: "780px", marginBottom: "20px" }}>
            A Revenue Matrix a Brandfabrik saját fejlesztésű módszertana. Ennek segítségével a céged jelenlegi működését, a piaci valóságot és a növekedési lehetőségeket egyetlen logikában nézzük végig. Így nemcsak az derül ki, hol akad el most a bevételszerzés, hanem az is, hogy mihez érdemes hozzányúlni, milyen sorrendben, és mit kell valóban felépíteni ahhoz, hogy a bevételi működés stabilabban növekedjen.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px", color: "#f06f66", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "36px" }}>
            A folyamata a következő:
          </p>
        </motion.div>

        {/* Row 1: cards 1-2-3 — slide in from left, staggered */}
        <div ref={row1Ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", alignItems: "stretch", marginBottom: "2px" }}>
          {revenueSystemCards.slice(0, 3).map((card, i) => cardJSX(card, i))}
        </div>

        {/* Row 2: cards 4-5-6 — same left-slide, triggered separately */}
        <div ref={row2Ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", alignItems: "stretch", marginBottom: "64px" }}>
          {revenueSystemCards.slice(3).map((card, i) => cardJSX(card, i + 3))}
        </div>

        {/* Closing statement */}
        <motion.div ref={closingRef} variants={fadeUpVariants} initial="hidden" animate={closingInView ? "visible" : "hidden"} custom={0} style={{ borderLeft: "4px solid #f06f66", paddingLeft: "32px", maxWidth: "860px" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "18px", color: "#f06f66", lineHeight: 1.8 }}>
            Nem különálló marketingeszközökben gondolkodunk, hanem olyan rendszerben, ahol pontosan látszik, mi működik, mi nem, és mit kell felépíteni a kiszámíthatóbb bevételnövekedéshez.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

// For Whom section
function ForWhomSection() {
  const yesItems = [
    "A vállalkozásod működik, de egyre erősebben érzed, hogy ami eddig elhozott idáig, az a következő években már nem lesz elég.",
    "Látod, hogy a piac, a technológia és a vevői szokások változnak, de nem akarsz minden új hullám után rohanni.",
    "Nem újabb marketingeszközöket keresel, hanem azt akarod tisztán látni, hogy nálad mi termel valóban bevételt, és mi nem.",
    "Zavar, hogy egyre nehezebb eldönteni, mire érdemes figyelni, és mi az, ami csak zaj.",
    "Nem egy újabb kampányötletre van szükséged, hanem arra, hogy a bevételszerző működésed végre átlátható és tudatos rendszerben működjön.",
  ];
  const noItems = [
    "Gyors marketingtrükköt vagy azonnali csodamegoldást keresel, feltárás és valós döntések nélkül.",
    "Még csak most indítod a vállalkozásodat, és nincs mögötte működő üzleti alap, amit érdemben át lehet vizsgálni.",
    "Nem akarsz ránézni arra, hogy a jelenlegi működésedben min kellene változtatni, csak megerősítést keresel arra, hogy minden maradhasson ugyanúgy.",
    "Kizárólag kivitelezőt keresel, de nem akarsz előtte tisztán látni abban, hogy valójában mihez érdemes hozzányúlni.",
    "Még több különálló eszközt, ötletet és próbálkozást akarsz, nem pedig világos sorrendet és rendszerszintű rendet.",
  ];

  // Two separate refs: header triggers when section top enters view,
  // cards trigger only when the cards themselves are visible
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  // header: fires when header itself is 30% visible
  const headerInView = useFramerInView(headerRef, { once: true, amount: 0.3 });
  // cards: negative bottom margin means the element must be at least 300px
  // above the bottom edge of the viewport before it triggers — i.e. clearly on screen
  const cardsInView = useFramerInView(cardsRef, { once: true, margin: "0px 0px -400px 0px" });

  return (
    <section style={{ padding: "100px 0", backgroundColor: "#2a2a2a" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <motion.div ref={headerRef} variants={fadeUpVariants} initial="hidden" animate={headerInView ? "visible" : "hidden"} custom={0} style={{ marginBottom: "56px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "16px" }}>
            Amikor a régi működés már nem elég.
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", color: "rgba(240,223,200,0.55)", maxWidth: "720px" }}>
            Ilyenkor már nem újabb marketingötletekre van szükség, hanem arra, hogy tisztán lásd, mi akad el a bevételszerzésben, és mihez érdemes valóban hozzányúlni.
          </p>
        </motion.div>

        <div ref={cardsRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Left card — slides in from left, list items cascade */}
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            style={{ border: "1px solid rgba(240,111,102,0.2)", backgroundColor: "rgba(240,111,102,0.04)", borderBottomRightRadius: "40px", position: "relative", overflow: "hidden" }}
          >
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 100%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.85, pointerEvents: "none" }} />
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(240,111,102,0.15)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#f06f66", fontSize: "16px", fontWeight: 700 }}>✓</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#f06f66" }}>Neked szól, ha…</span>
            </div>
            <motion.div
              variants={listStaggerContainer}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {yesItems.map((item, i) => (
                <motion.div key={i} variants={listItemVariants} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ color: "#f06f66", fontSize: "18px", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.85)", lineHeight: 1.65 }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right card — slides in from right, list items cascade slightly slower */}
          <motion.div
            variants={slideFromRight}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            style={{ border: "1px solid rgba(240,223,200,0.08)", backgroundColor: "rgba(240,223,200,0.02)", borderBottomLeftRadius: "40px", position: "relative", overflow: "hidden" }}
          >
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 100%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.6, pointerEvents: "none" }} />
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(240,223,200,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "rgba(240,223,200,0.35)", fontSize: "16px", fontWeight: 700 }}>✕</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(240,223,200,0.35)" }}>Nem neked szól, ha…</span>
            </div>
            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {noItems.map((item, i) => (
                <motion.div key={i} variants={listItemVariants} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ color: "rgba(240,223,200,0.25)", fontSize: "18px", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>—</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.45)", lineHeight: 1.65 }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
            <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(240,223,200,0.06)", fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "rgba(240,223,200,0.3)", fontStyle: "italic", lineHeight: 1.6 }}>
              Ha nem vagy benne biztos, írj nekünk — őszintén megmondjuk, tudunk-e valóban segíteni.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Case study section
const PHASE1_BUBBLES = [
  { x: 1.2, y: 8.8, label: "Google Cégprofil teljes optimalizálása (GBP)", line1: "+40–70% láthatóság várható a Google Térképen.", line2: "A profil rendbetétele segít abban, hogy többen találjanak rá az étteremre a környéken." },
  { x: 2.0, y: 6.5, label: "QR-kód rendszer bevezetése", line1: "+5–9 új értékelés várható havonta.", line2: "A vendég egyetlen beolvasással eljut az értékeléshez, a menühez vagy a profilhoz." },
  { x: 1.5, y: 9.2, label: "Étlap átalakítása árpszichológiai elvek szerint", line1: "+15–25% kosárérték várható.", line2: "Nem új fogásokat kell kitalálni, hanem úgy kell átrendezni az étlapot, hogy többen válasszanak magasabb értékű opciót." },
  { x: 0.8, y: 4.5, label: "Utcai tábla optimalizálása (A-tábla)", line1: "+5–10% esti vendég várható.", line2: "A járókelőnek gyorsan értenie kell, miért érdemes most bemenni." },
  { x: 1.8, y: 7.5, label: "Pultosi kommunikációs tréning", line1: "+10–15% kosárérték várható.", line2: "Néhány jól betanított mondat is növelheti, hogy a vendég mit és mennyit rendel." },
  { x: 2.5, y: 3.2, label: "WhatsApp Business beállítása", line1: "Közvetlen üzleti kapcsolatépítés indulhat.", line2: "A napi menü és a gyors válaszok egyszerűbbé teszik a kapcsolatot a céges partnerekkel és a visszatérő vendégekkel." },
  { x: 1.0, y: 5.8, label: "TripAdvisor profil aktiválása", line1: "Cél: 2 értékelésről 50+ értékelés felé elindulni.", line2: "A turista gyakran ott dönt, ahol több és jobb értékelést lát." },
  { x: 1.5, y: 2.5, label: "Apple Térkép üzleti profil beállítása (Apple Maps Business Connect)", line1: "Külön elérés az iPhone-t használó turistáknál.", line2: "Egy rövid beállítással olyan vendégeket is el lehet érni, akik eddig nem találták meg a helyet." },
  { x: 2.2, y: 6.0, label: "Bélyegzőkártya bevezetése", line1: "+20–30% visszatérés várható.", line2: "Egyszerű eszköz arra, hogy a környéken dolgozók újra és újra visszajöjjenek." },
  { x: 0.5, y: 7.8, label: "Napi csomagajánlat bevezetése", line1: "+15–25% kosárérték várható.", line2: "Ha a leves, főétel és ital együtt jobban megéri, a vendég könnyebben dönt és többet költ." },
];
const PHASE2_BUBBLES = [
  { x: 5.5, y: 8.5, label: "Helyi célzású Meta-hirdetés (Meta Ads)", line1: "+15–30 esti vendég várható hetente.", line2: "A hirdetés a közelben lévő és releváns embereket éri el, főleg az esti forgalom erősítésére." },
  { x: 6.2, y: 7.2, label: "Google helyi keresési hirdetés (Google Local Search Ads)", line1: "+10–20 turista várható hetente.", line2: "Akkor jelenik meg, amikor valaki már konkrétan éttermet keres a környéken." },
  { x: 3.5, y: 5.5, label: "Környékbeli irodák személyes felkeresése", line1: "+2–5 irodai megállapodás várható.", line2: "Egy egyszeri személyes körből később rendszeres ebédrendelések jöhetnek." },
  { x: 4.5, y: 7.8, label: "Szállodai recepciós együttmlűködések (concierge megállapodás)", line1: "+5–15 turista várható hetente, tartósan.", line2: "A recepciós ajánlás közvetlenül a döntés pillanatában hozhat vendéget." },
  { x: 3.8, y: 3.8, label: "Instagram aktív használata", line1: "A nem fizetett elérésből is jöhet turista forgalom.", line2: "A rendszeres ételfotók és történetek segítenek abban, hogy az étterem könnyebben felfedezhető legyen." },
  { x: 4.8, y: 5.0, label: "Szerkesztői meghívás budapesti portáloknak", line1: "Egy megjelelés hosszabb távon is hozhat keresésből érkező forgalmat.", line2: "Ez nem hirdetés, hanem külső ajánlás, ami hitelesebbnek hat." },
  { x: 5.0, y: 6.5, label: "Kisebb influencerek meghívása (nano / mikro-influencer)", line1: "+20–40% kampányhatás várható az adott időszakban.", line2: "Rövid távon gyors figyelmet tud hozni, főleg célzott közönségnél." },
  { x: 3.2, y: 2.2, label: "Kora esti kedvezmény bevezetése", line1: "17:00 után 15–20% kedvezmény.", line2: "Az üresebb esti órákat segít megtölteni, nem az egész napot árazza le." },
  { x: 5.8, y: 4.2, label: "Kétnyelvű szórólap terjesztése", line1: "+5–10 új vendég várható hetente.", line2: "A magyar és angol anyag egyszerre szól a helyiekhez és a turistákhoz." },
  { x: 4.2, y: 1.8, label: "Külső platformokon való megjelelés", line1: "Több alkalmazásban és keresési felületen jelenhet meg az étterem.", line2: "Az egyszeri profilfeltöltés később több helyen is visszahozhatja a nevet és az adatokat." },
];
const PHASE3_BUBBLES = [
  { x: 8.5, y: 9.2, label: "Egyszerű kétnyelvű weboldal", line1: "A többi digitális eszköz hatása akár 2×-esére erősödhet.", line2: "Nem dísznek kell, hanem stabil alapnak, ahová minden csatorna vissza tud vezetni." },
  { x: 7.2, y: 6.8, label: "Weboldal keresőbarát rendbetétele és a Google Cégprofil megerősítése (on-page SEO + GBP)", line1: "Nőhet a keresésből érkező turista forgalom.", line2: "A cél, hogy az étterem ne csak hirdetésből, hanem sima keresésből is jobban megtalálható legyen." },
  { x: 6.5, y: 4.5, label: "TripAdvisor Travelers' Choice megszerzése", line1: "Cél: 50+ értékelés elérése.", line2: "Ez egy kívülről látható bizalmi jel, ami segíthet a döntésnél." },
  { x: 8.0, y: 7.8, label: "Étlap elemzése nyereség és népszerűség alapján (Kasavana–Smith)", line1: "+8–15% profitmarzs várható.", line2: "Megmutatja, mely fogásokat érdemes jobban előtérbe tolni, és melyek viszik el a hasznot." },
  { x: 7.8, y: 8.5, label: "Meglévő vendégekhez hasonló közönség célzása (Meta Custom + Lookalike Audience)", line1: "Várhatóan ez adja a leghatékonyabb Meta-célzást.", line2: "Nem teljesen idegen emberekre céloz, hanem a mostani vendégekhez hasonló közönségre." },
  { x: 9.0, y: 5.8, label: "Ajándékkártya bevezetése", line1: "A beváltók átlagosan 61%-kal többet költenek.", line2: "Előre hoz bevételt, és új vendéget is be tud húzni." },
  { x: 7.5, y: 3.5, label: "Email- és WhatsApp-lista építése", line1: "50+ kontakt után heti kommunikáció indulhat.", line2: "Így a kapcsolat nem ér véget a fizetésnél, később is vissza lehet hívni a vendéget." },
  { x: 9.2, y: 7.0, label: "Strukturált adatjelölés és AI-találati alapok (schema markup, AEO)", line1: "Alapot ad ahhoz, hogy az étterem AI-ajánlásokban is megjelenjen.", line2: "Ez technikai előkészítés arra, hogy a keresők és az új ajánlófelületek jobban értsék a helyet." },
  { x: 6.8, y: 2.2, label: "Tematikus esti események bevezetése", line1: "Kéthetente ismételhető forgalomépítő alkalom.", line2: "Konkrét okot ad arra, hogy valaki ne csak véletlenül térjen be este." },
  { x: 8.2, y: 1.5, label: "Helyi célzású Spotify-hirdetés", line1: "Kiegészítő turistaelérés építhető vele.", line2: "Nem fő csatorna, hanem ráerősítés a már működő online jelenlétre." },
];

function CaseStudySection() {
  const { ref, inView } = useInView(0.15);
  // Separate ref for the stat cards — fires much later so cards are clearly visible
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useFramerInView(cardsRef, { once: true, margin: "0px 0px -400px 0px" });
  // Count-up for each stat card — staggered delays match the staggerItem animation
  const count335 = useCountUp(335, cardsInView, 1600, 0);
  const count127 = useCountUp(127, cardsInView, 1400, 120);
  const count30  = useCountUp(30,  cardsInView, 1200, 240);
  const count3   = useCountUp(3,   cardsInView, 900,  360);
  // Chart gets its own ref — fires even later than the cards so the diagram
  // only draws when the user has scrolled well past the stat cards
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useFramerInView(chartRef, { once: true, margin: "0px 0px -300px 0px" });

  useEffect(() => {
    if (!chartInView) return;
    const timeout = setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).Chart) {
        const canvas = document.getElementById("caseMatrix") as HTMLCanvasElement;
        if (!canvas || (canvas as any)._chartInstance) return;
        const BUBBLE_R = 9;
        // Custom HTML tooltip
        let tooltipEl = document.getElementById("chartTooltip");
        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.id = "chartTooltip";
          tooltipEl.style.cssText = [
            "position:absolute",
            "pointer-events:none",
            "z-index:9999",
            "max-width:200px",
            "width:200px",
            "background:rgba(26,23,20,0.96)",
            "border:1px solid rgba(240,111,102,0.3)",
            "border-radius:6px",
            "padding:12px",
            "font-family:Poppins,sans-serif",
            "font-size:12px",
            "line-height:1.55",
            "color:rgba(240,223,200,0.80)",
            "word-wrap:break-word",
            "white-space:normal",
            "opacity:0",
            "transition:opacity 0.15s",
            "box-shadow:0 4px 24px rgba(240,111,102,0.12),0 2px 8px rgba(0,0,0,0.5)",
          ].join(";");
          canvas.parentElement?.appendChild(tooltipEl);
        }
        // ensure the parent wrapper is positioned so absolute child works
        if (canvas.parentElement) {
          (canvas.parentElement as HTMLElement).style.position = "relative";
        }
        const externalTooltip = (context: any) => {
          const { tooltip } = context;
          if (!tooltip || tooltip.opacity === 0) { tooltipEl!.style.opacity = "0"; return; }
          const raw = tooltip.dataPoints?.[0]?.raw;
          if (!raw) return;
          const title = raw.label || "";
          const line1 = raw.line1 || "";
          const line2 = raw.line2 || "";
          // determine phase shadow color from dataset index
          const dsIndex = tooltip.dataPoints?.[0]?.datasetIndex ?? 0;
          const shadowColors = [
            "rgba(240,111,102,0.35)",   // phase 1 — coral
            "rgba(240,223,200,0.25)",   // phase 2 — off-white
            "rgba(180,180,180,0.2)",    // phase 3 — grey
          ];
          const shadowColor = shadowColors[dsIndex] || shadowColors[0];
          tooltipEl!.style.boxShadow = `0 4px 24px ${shadowColor}, 0 2px 8px rgba(0,0,0,0.5)`;
          tooltipEl!.innerHTML = [
            `<div style="font-weight:600;font-size:13px;color:#f06f66;margin-bottom:6px;word-wrap:break-word">${title}</div>`,
            line1 ? `<div style="margin-bottom:4px">${line1}</div>` : "",
            line2 ? `<div>${line2}</div>` : "",
          ].join("");
          // caretX/Y are relative to the canvas element itself
          const tw = 200;
          const parentW = canvas.parentElement!.offsetWidth;
          const parentH = canvas.parentElement!.offsetHeight;
          const tooltipH = tooltipEl!.offsetHeight || 120; // estimated height
          let left = tooltip.caretX + 12;
          let top = tooltip.caretY - 8;
          // flip horizontally if overflowing right
          if (left + tw > parentW) left = tooltip.caretX - tw - 12;
          if (left < 0) left = 8;
          // flip vertically if overflowing bottom
          if (top + tooltipH > parentH) top = tooltip.caretY - tooltipH - 12;
          if (top < 0) top = 8;
          tooltipEl!.style.left = left + "px";
          tooltipEl!.style.top = top + "px";
          tooltipEl!.style.opacity = "1";
        };
        const chart = new (window as any).Chart(canvas, {
          type: "bubble",
          data: {
            datasets: [
              {
                label: "1. fázis — Azonnali beavatkozások",
                data: PHASE1_BUBBLES.map(b => ({ x: b.x, y: b.y, r: BUBBLE_R, label: b.label, line1: b.line1, line2: b.line2 })),
                backgroundColor: "rgba(240,111,102,0.75)",
                borderColor: "#f06f66",
                borderWidth: 1.5,
              },
              {
                label: "2. fázis — Láthatóság és elérés",
                data: PHASE2_BUBBLES.map(b => ({ x: b.x, y: b.y, r: BUBBLE_R, label: b.label, line1: b.line1, line2: b.line2 })),
                backgroundColor: "rgba(240,223,200,0.45)",
                borderColor: "rgba(240,223,200,0.65)",
                borderWidth: 1.5,
              },
              {
                label: "3. fázis — Rendszer és skálázás",
                data: PHASE3_BUBBLES.map(b => ({ x: b.x, y: b.y, r: BUBBLE_R, label: b.label, line1: b.line1, line2: b.line2 })),
                backgroundColor: "rgba(200,200,200,0.25)",
                borderColor: "rgba(200,200,200,0.45)",
                borderWidth: 1.5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: false,
                external: externalTooltip,
              },
            },
            layout: { padding: { top: 40, right: 40, bottom: 40, left: 40 } },
            scales: {
              x: {
                min: 0, max: 10,
                grid: { color: "rgba(240,223,200,0.06)", lineWidth: 1, drawTicks: false, drawBorder: false },
                ticks: { display: false },
                border: { display: false },
              },
              y: {
                min: 0, max: 10,
                grid: { color: "rgba(240,223,200,0.06)", lineWidth: 1, drawTicks: false, drawBorder: false },
                ticks: { display: false },
                border: { display: false },
              },
            },
          },
        });
        (canvas as any)._chartInstance = chart;
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [chartInView]);

  return (
    <section ref={ref} style={{ padding: "120px 0", backgroundColor: "rgba(0,0,0,0.18)" }}>
      <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js" async />
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <motion.div variants={fadeUpVariants} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} style={{ marginBottom: "24px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(28px, 3vw, 48px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "16px" }}>Így működik a Revenue Matrix<br />egy valós vállalkozásnál</h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", color: "rgba(240,223,200,0.6)", maxWidth: "640px", lineHeight: 1.8 }}>
            Ez egy működő gyorsétterem teljes körű vizsgálatának az eredménye. A vége nem egy ötletlista, hanem egy leszűrt, prioritizált, azonnal bevethető bevételi rendszer.
          </p>
        </motion.div>
        <motion.div variants={fadeUpVariants} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "14px", color: "#f06f66", lineHeight: 1.7, marginBottom: "20px", maxWidth: "720px" }}>A Revenue Matrix diagnózisa a kétszintű vizsgálat után így jut el a cégre szabott,<br />megvalósítható stratégiáig.</p>
        </motion.div>
        <motion.div ref={cardsRef} variants={staggerContainer} initial="hidden" animate={cardsInView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", marginBottom: "64px" }}>
          {/* Flip card for the 335 stat */}
          <motion.div variants={staggerItem} className="stat-flip-card" style={{ borderBottomRightRadius: "20px" }}>
            <div className="stat-flip-inner">
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 0%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.85, pointerEvents: "none", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: 0 }} />
              {/* Front face */}
              <div className="stat-flip-front" style={{ backgroundColor: "rgba(240,223,200,0.03)", borderBottomRightRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "rgba(240,223,200,0.12)" }} />
                <div style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 4vw, 56px)", color: "#f0dfc8", lineHeight: 1, marginBottom: "12px" }}>{count335}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.55)", lineHeight: 1.5, flex: 1 }}>teljes vizsgált kommunikációs eszköztár</div>
                <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(240,223,200,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1 }}>részletek</span>
                  <span className="revenue-card-arrow" style={{ fontSize: "14px", color: "rgba(240,223,200,0.25)", lineHeight: 1, display: "inline-block", marginTop: "0px" }}>→</span>
                </div>
              </div>
              {/* Back face */}
              <div className="stat-flip-back" style={{ borderBottomRightRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#f06f66" }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.85)", lineHeight: 1.7, margin: 0 }}>A Revenue Matrix egy <strong style={{ color: "#f0dfc8", fontWeight: 500 }}>335 elemből álló</strong>, teljes kommunikációs eszköztárból indul ki, nem néhány általános marketingötletből.</p>
              </div>
            </div>
          </motion.div>
          {/* Flip card 2: 127 */}
          <motion.div variants={staggerItem} className="stat-flip-card" style={{ borderBottomLeftRadius: "20px" }}>
            <div className="stat-flip-inner">
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 0% 0%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.85, pointerEvents: "none", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: 0 }} />
              <div className="stat-flip-front" style={{ backgroundColor: "rgba(240,223,200,0.03)", borderBottomLeftRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "rgba(240,223,200,0.12)" }} />
                <div style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 4vw, 56px)", color: "#f0dfc8", lineHeight: 1, marginBottom: "12px" }}>{count127}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.55)", lineHeight: 1.5, flex: 1 }}>iparágra szűrt releváns eszköz</div>
                <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(240,223,200,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1 }}>részletek</span>
                  <span className="revenue-card-arrow" style={{ fontSize: "14px", color: "rgba(240,223,200,0.25)", lineHeight: 1, display: "inline-block" }}>→</span>
                </div>
              </div>
              <div className="stat-flip-back" style={{ borderBottomLeftRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#f06f66" }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.85)", lineHeight: 1.7, margin: 0 }}>A teljes eszköztárból <strong style={{ color: "#f0dfc8", fontWeight: 500 }}>ennyi bizonyult relevánsnak</strong> az adott iparág működése és bevételi logikája szempontjából.</p>
              </div>
            </div>
          </motion.div>
          {/* Flip card 3: 30 */}
          <motion.div variants={staggerItem} className="stat-flip-card" style={{ borderBottomRightRadius: "20px" }}>
            <div className="stat-flip-inner">
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 0%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.85, pointerEvents: "none", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: 0 }} />
              <div className="stat-flip-front" style={{ backgroundColor: "rgba(240,223,200,0.03)", borderBottomRightRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "rgba(240,223,200,0.12)" }} />
                <div style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 4vw, 56px)", color: "#f0dfc8", lineHeight: 1, marginBottom: "12px" }}>{count30}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.55)", lineHeight: 1.5, flex: 1 }}>a cégre szabott lehetőség</div>
                <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(240,223,200,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1 }}>részletek</span>
                  <span className="revenue-card-arrow" style={{ fontSize: "14px", color: "rgba(240,223,200,0.25)", lineHeight: 1, display: "inline-block" }}>→</span>
                </div>
              </div>
              <div className="stat-flip-back" style={{ borderBottomRightRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#f06f66" }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.85)", lineHeight: 1.7, margin: 0 }}>Az iparágra releváns elemek közül <strong style={{ color: "#f0dfc8", fontWeight: 500 }}>ennyi maradt</strong>, amely ennél a konkrét cégnél valóban használhatónak bizonyult.</p>
              </div>
            </div>
          </motion.div>
          {/* Flip card 4: 3 */}
          <motion.div variants={staggerItem} className="stat-flip-card" style={{ borderBottomLeftRadius: "20px" }}>
            <div className="stat-flip-inner">
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 0% 0%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.85, pointerEvents: "none", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: 0 }} />
              <div className="stat-flip-front" style={{ backgroundColor: "rgba(240,223,200,0.03)", borderBottomLeftRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "rgba(240,223,200,0.12)" }} />
                <div style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 4vw, 56px)", color: "#f0dfc8", lineHeight: 1, marginBottom: "12px" }}>{count3}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.55)", lineHeight: 1.5, flex: 1 }}>megvalósítási fázis</div>
                <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(240,223,200,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1 }}>részletek</span>
                  <span className="revenue-card-arrow" style={{ fontSize: "14px", color: "rgba(240,223,200,0.25)", lineHeight: 1, display: "inline-block" }}>→</span>
                </div>
              </div>
              <div className="stat-flip-back" style={{ borderBottomLeftRadius: "20px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#f06f66" }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.85)", lineHeight: 1.7, margin: 0 }}>A végén a kiválasztott lehetőségek nem ömlesztve maradtak, hanem <strong style={{ color: "#f0dfc8", fontWeight: 500 }}>3 világos megvalósítási szakaszba</strong> rendeződtek.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.4)", marginBottom: "20px", fontStyle: "italic" }}>Minden buborék egy bevételre ható eszközt jelöl.</p>
        <div ref={chartRef} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "48px", alignItems: "start" }}>
          {/* Chart column */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "0" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "28px", flexShrink: 0, paddingTop: "16px", paddingBottom: "16px" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 400, color: "rgba(240,223,200,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap", transform: "rotate(-90deg)", display: "block", marginTop: "50px" }}>nagyobb hatás</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 400, color: "rgba(240,223,200,0.2)", textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap", transform: "rotate(-90deg)", display: "block", marginBottom: "45px" }}>kisebb hatás</span>
              </div>
              <div style={{ flex: 1, aspectRatio: "1 / 1", maxHeight: "560px", backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(240,223,200,0.12)", borderTopLeftRadius: "20px", overflow: "hidden" }}>
                <canvas id="caseMatrix" style={{ display: "block", width: "100%", height: "100%" }} />
              </div>
            </div>
            <div style={{ marginLeft: "28px", display: "flex", justifyContent: "space-between", paddingTop: "10px", paddingRight: "4px" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 400, color: "rgba(240,223,200,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginLeft: "25px" }}>könnyebben bevezethő</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 400, color: "rgba(240,223,200,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginRight: "23px" }}>nehezebben bevezethő</span>
            </div>
          </div>
          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* How to read */}
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", color: "#f0dfc8", marginBottom: "10px" }}>Hogyan olvasd ezt az ábrát?</div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.65)", lineHeight: 1.7, margin: "0 0 14px 0" }}>A diagram egyszerre három dolgot mutat: mekkora bevételi hatása lehet egy adott eszköznek, mennyire nehéz bevezetni, és melyik fázisban érdemes vele foglalkozni.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderLeft: "2px solid rgba(240,223,200,0.1)", paddingLeft: "12px" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 400, color: "rgba(240,223,200,0.55)", lineHeight: 1.6 }}>Függőleges tengely: várható bevételi hatás</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 400, color: "rgba(240,223,200,0.55)", lineHeight: 1.6 }}>Vízszintes tengely: bevezetés nehézsége</div>
              </div>
            </div>
            {/* Phase legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { color: "rgba(240,111,102,0.75)", border: "#f06f66", label: "1. fázis — Azonnali beavatkozások", sub: "Időtáv: 1–4. hét" },
                { color: "rgba(240,223,200,0.45)", border: "rgba(240,223,200,0.65)", label: "2. fázis — Láthatóság és elérés", sub: "Időtáv: 1–3. hónap" },
                { color: "rgba(200,200,200,0.25)", border: "rgba(200,200,200,0.45)", label: "3. fázis — Rendszer és skálázás", sub: "Időtáv: 3–6. hónap" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: l.color, border: `1.5px solid ${l.border}`, flexShrink: 0, marginTop: "3px" }} />
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px", color: "#f0dfc8", marginBottom: "2px" }}>{l.label}</div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "12px", color: "rgba(240,223,200,0.45)" }}>{l.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Summary box */}
            <div style={{ backgroundColor: "rgba(240,111,102,0.08)", borderLeft: "3px solid #f06f66", padding: "16px 20px", borderBottomRightRadius: "16px", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, rgba(240,111,102,0.07), transparent 60%)", opacity: 0.85, pointerEvents: "none" }} />
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px", color: "#f06f66", marginBottom: "8px" }}>1. fázis — Összesített hatás</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.75)", lineHeight: 1.65 }}>Az 1. fázis beavatkozásai együttesen <strong style={{ color: "#f0dfc8", fontWeight: 500 }}>+20–35% havi bevételnövekedést</strong> realizálhatnak 1–4 hetes megtérülési idő mellett.</div>
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
          <div className="card-hover" style={{ height: "100%", backgroundColor: "rgba(240,223,200,0.03)", borderRight: i % 2 === 1 ? "3px solid rgba(240,111,102,0.12)" : "none", borderLeft: i % 2 === 0 ? "3px solid rgba(240,111,102,0.12)" : "none", padding: "16px 20px", position: "relative", overflow: "hidden" }}>
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(315deg, rgba(240,111,102,0.07), transparent 60%)", opacity: 0.85, pointerEvents: "none" }} />
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useFramerInView(ref, { once: true, margin: "-80px" });
  const reasons = [
    { title: "A TE VÁLLALKOZÁSODRA SZABVA", desc: "Nem általános tanácsokat kapsz, hanem azt, ami a te piacodon, a te helyzetedben és a te működésed mellett lehet valóban releváns." },
    { title: "RENDET TESZ A LEHETŐSÉGEK KÖZÖTT", desc: "Ma már túl sok bevételre ható eszköz létezik ahhoz, hogy érzésből lehessen jól dönteni. A Revenue Matrix nem mindent akar egyszerre használni, hanem kijelöli, mi maradjon bent, mi essen ki, és hogyan erősítsék egymást rendszerben a megtartott elemek." },
    { title: "ELŐSZÖR TISZTÁN LÁTSZ, UTÁNA LEHET HALADNI", desc: "A priorizált rendszer leveszi rólad a „mivel érdemes kezdeni?” terhét. Először világos helyzetképet és sorrendet kapsz, és csak utána indulhat el a megvalósítás." },
    { title: "NEM ÁLL MEG A DIAGNÓZISÁNÁL", desc: "A cél nem az, hogy készüljön egy jó elemzés, hanem az, hogy abból működő rendszer épüljön. Ezért a folyamat nem a felismerésnél ér véget, hanem a kivitelezés irányába megy tovább." },
  ];

  return (
    <section style={{ padding: "120px 0", backgroundColor: "#303030" }}>
      <div ref={ref} className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <motion.div variants={fadeUpVariants} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} style={{ marginBottom: "72px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2 }}>Mittől lesz ebből valóban működő rendszer?</h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", columnGap: "2px", rowGap: "2px" }}>
          {reasons.map((item, i) => {
            const isLeft = i % 2 === 0;
            const borderRadiusStyle = {
              borderTopRightRadius: i === 0 ? "28px" : "0",
              borderBottomRightRadius: i === 2 ? "28px" : "0",
              borderTopLeftRadius: i === 1 ? "28px" : "0",
              borderBottomLeftRadius: i === 3 ? "28px" : "0",
            };
            const greyBorder = "3px solid rgba(240,223,200,0.15)";
            const coralBorder = "3px solid #f06f66";
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                style={{
                  padding: "48px 40px",
                  backgroundColor: "rgba(240,223,200,0.03)",
                  borderLeft: isLeft ? greyBorder : "none",
                  borderRight: !isLeft ? greyBorder : "none",
                  transition: "background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  position: "relative",
                  overflow: "hidden",


                  ...borderRadiusStyle,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "rgba(240,111,102,0.07)";
                  el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(240,111,102,0.15)";
                  if (isLeft) el.style.borderLeft = coralBorder;
                  else el.style.borderRight = coralBorder;
                  const title = el.querySelector(".card-title") as HTMLElement | null;
                  if (title) title.style.color = "#f06f66";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "rgba(240,223,200,0.03)";
                  el.style.boxShadow = "none";
                  if (isLeft) el.style.borderLeft = greyBorder;
                  else el.style.borderRight = greyBorder;
                  const title = el.querySelector(".card-title") as HTMLElement | null;
                  if (title) title.style.color = "#f0dfc8";
                }}
              >
                {i === 0 && (
                  <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(315deg, rgba(240,111,102,0.07), transparent 60%)", opacity: 0.85, pointerEvents: "none" }} />
                )}
                {i === 2 && (
                  <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, rgba(240,111,102,0.07), transparent 60%)", opacity: 0.85, pointerEvents: "none" }} />
                )}
                {i === 1 && (
                  <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(45deg, rgba(240,111,102,0.07), transparent 60%)", opacity: 0.85, pointerEvents: "none" }} />
                )}
                {i === 3 && (
                  <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(240,111,102,0.07), transparent 60%)", opacity: 0.85, pointerEvents: "none" }} />
                )}
                <div className="card-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "20px", color: "#f0dfc8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", transition: "color 0.25s ease", position: "relative" }}>{item.title}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.7)", lineHeight: 1.7, position: "relative" }}>{item.desc}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Implementation section
function ImplementationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useFramerInView(ref, { once: true, margin: "-80px" });
  return (
    <section style={{ padding: "100px 0", backgroundColor: "#303030", position: "relative", overflow: "hidden" }}>
      {/* Halftone dot pattern — centered, mix-blend-mode:multiply makes white areas transparent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310419663032362343/SwAx7y8KtAtYGdCgPrByVF/hatter5_1a9ad927.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          opacity: 0.07,
          mixBlendMode: "screen" as React.CSSProperties["mixBlendMode"],
          pointerEvents: "none",
        }}
      />
      <div ref={ref} className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", position: "relative" }}>
        <motion.div variants={fadeUpVariants} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
        <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "3px", color: "rgba(240,111,102,0.7)", marginBottom: "16px" }}>Ahol a lényeg van</div>
        <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "20px" }}>Stratégia, majd végrehajtás</h2>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.85, color: "rgba(240,223,200,0.75)", marginBottom: "16px", maxWidth: "720px" }}>
          A diagnózis nem a folyamat vége, hanem a kezdete. A Revenue Matrix alapján felépítjük a megvalósítás sorrendjét, majd részt is veszünk annak kivitelezésében.
        </p>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", lineHeight: 1.85, color: "rgba(240,223,200,0.55)", maxWidth: "720px", marginBottom: "48px" }}>
          A cél nem egy jól kinéző terv, hanem az, hogy a fontos lépések valóban elinduljanak, a megfelelő időben és a megfelelő sorrendben.
        </p>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", maxWidth: "900px", marginBottom: "32px" }}>
          {[
            { label: "Azonnali", timeframe: "1–4 hét", desc: "Olyan beavatkozások, amelyek gyorsan elindíthatók, és rövid időn belül kézzelfogható eredményt hozhatnak.", highlight: true },
            { label: "Középtávú", timeframe: "1–3 hónap", desc: "Azok a lépések, amelyek már építik a láthatóságot, az elérést és az ügyfélszerzési működést, és amelyekre a későbbi rendszer támaszkodni tud.", highlight: false },
            { label: "Hosszabb távú", timeframe: "3–12 hónap", desc: "Azok a fejlesztések, amelyek stabilabb működést, jobb skálázhatóságot és fenntarthatóbb növekedést tesznek lehetővé.", highlight: false },
          ].map((item, i) => (
            <motion.div key={i} variants={staggerItem} className={`revenue-card${item.highlight ? "" : " impl-card-grey"}`} style={{ backgroundColor: item.highlight ? "#3d3230" : "#2a2a2a", borderTop: `3px solid ${item.highlight ? "#f06f66" : "#4f4c48"}`, padding: "28px 24px", borderBottomRightRadius: "30px", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 100%, rgba(240,111,102,0.07) 0%, transparent 65%)", opacity: 0.85, pointerEvents: "none" }} />
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", color: item.highlight ? "#f06f66" : "#f0dfc8", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1.5px", position: "relative" }}>{item.label}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "12px", color: "rgba(240,111,102,0.7)", marginBottom: "14px" }}>{item.timeframe}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(240,223,200,0.55)", lineHeight: 1.65 }}>{item.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// CTA section
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useFramerInView(ref, { once: true, margin: "-80px" });
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
      <div ref={ref} className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
          {/* Left column — blur+lift fade-up */}
          <motion.div variants={slideFromLeft} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
            <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2, marginBottom: "24px" }}>Elemzés. Stratégia. Végrehajtás.</h2>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.8, color: "rgba(240,223,200,0.7)", marginBottom: "40px" }}>
              A Revenue Matrix feltárása kötelezettségmentes. Ha van értelme tovább lépni, az eredményeiből stratégia, majd megvalósítás épülhet.
            </p>
            <motion.div
              variants={listStaggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {["Kötelezettségmentes indulás — rejtett költségek nélkül", "Személyre szabott irány — nem sablonos javaslatok", "Az eredményeket személyesen mutatjuk be", "Olyan cégeknek, akik valódi döntésekre készek"].map((item, i) => (
                <motion.div key={i} variants={listItemVariants} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{ width: "20px", height: "20px", backgroundColor: "rgba(240,111,102,0.15)", border: "1px solid rgba(240,111,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderBottomRightRadius: "6px" }}>
                    <span style={{ color: "#f06f66", fontSize: "11px" }}>✓</span>
                  </div>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 400, color: "rgba(240,223,200,0.8)" }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — form slides in from right */}
          <motion.div variants={slideFromRight} initial="hidden" animate={inView ? "visible" : "hidden"}>
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
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "rgba(240,223,200,0.3)", lineHeight: 1.6 }}>* Kötelező mezők.<br />Az adataidat bizalmasan kezeljük, harmadik félnek nem adjuk át. A „visszahívást kérek" gombra kattintva hozzájárulsz adataid GDPR-megfelelő kezeléséhez.{" "}<a href="/adatkezeles" style={{ color: "rgba(240,111,102,0.6)", textDecoration: "underline" }}>Adatkezelési tájékoztató</a></p>
              </form>
            )}
          </motion.div>
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
            <img src={LOGO_URL} alt="Brandfabrik" style={{ height: "38px", objectFit: "contain" }} />
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
      <ForWhomSection />
      <DifferentiatorTable />
      <RevenueSystemSection />
      <CaseStudySection />
      <WhyTrustSection />
      <ImplementationSection />
      <CTASection />
      <Footer />
    </div>
  );
}
