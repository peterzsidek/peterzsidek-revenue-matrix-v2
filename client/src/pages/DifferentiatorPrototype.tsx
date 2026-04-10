import React, { useEffect, useRef, useState } from "react";

const prototypeRows = [
  {
    aspect: "Kiindulopont",
    agency: "Kampanyigenyre reagal",
    brandfabrik: "A teljes beveteli rendszert vizsgalja meg",
  },
  {
    aspect: "Diagnozis",
    agency: "Rovid briefing utan ajanlat",
    brandfabrik: "Melyebb feltaras, uzleti es piaci kontextussal",
  },
  {
    aspect: "Lefedettseg",
    agency: "Csatornankent vagy taktikankent gondolkodik",
    brandfabrik: "Priorizalt, teljes kepet epit a novekedesi pontokrol",
  },
  {
    aspect: "Logika",
    agency: "Eszkozoket aktival",
    brandfabrik: "Egymast erosito rendszert allit ossze",
  },
  {
    aspect: "Meres",
    agency: "Nehez osszevetni a valodi uzleti hatassal",
    brandfabrik: "Konkret mutatokhoz es uzleti eredmenyhez koti",
  },
  {
    aspect: "Kapcsolat",
    agency: "Kivitelezesi fokusz",
    brandfabrik: "Diagnozistol a vegrehajtasi logikaig vezet vegig",
  },
];

function usePrototypeProgress() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      const startOffset = viewportHeight * 0.8;
      const pinDistance = Math.max(el.offsetHeight - viewportHeight, 1);
      const raw = (startOffset - rect.top) / (pinDistance + startOffset);
      const next = Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0;

      setProgress(next);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, progress };
}

export default function DifferentiatorPrototype() {
  const { ref: sectionRef, progress } = usePrototypeProgress();
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  const titleOneReveal = clamp((progress - 0.015) / 0.2);
  const titleTwoReveal = clamp((progress - 0.055) / 0.18);
  const labelReveal = clamp((progress - 0.14) / 0.46);
  const tableReveal = clamp((progress - 0.08) / 0.34);
  const settleProgress = clamp((progress - 0.78) / 0.14);
  const stageShift = 22 - Math.min(progress / 0.78, 1) * 22;

  return (
    <main
      style={{
        backgroundColor: "#252525",
        minHeight: "100vh",
        backgroundImage:
          "radial-gradient(circle at top right, rgba(240,111,102,0.16), transparent 28%)",
      }}
    >
      <section style={{ minHeight: "88vh", padding: "88px 24px 48px" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              border: "1px solid rgba(240,111,102,0.28)",
              backgroundColor: "rgba(240,111,102,0.08)",
              color: "#f06f66",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Standard Prototype
          </div>
          <h1
            style={{
              margin: "24px 0 18px",
              fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
              fontSize: "clamp(38px, 5vw, 70px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "#f0dfc8",
              maxWidth: "980px",
            }}
          >
            "Miert mas a Brandfabrik?" enter-scrub-settle-release sandbox
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "760px",
              color: "rgba(240,223,200,0.72)",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "18px",
              lineHeight: 1.65,
            }}
          >
            Normal beerkezes utan a heading indul, roviddel utana a tabla row-by-row epul, majd egy rovid kesz allapot
            utan a szekcio release-el es visszaadja a normal scrollt.
          </p>
        </div>
      </section>

      <section
        ref={sectionRef}
        style={{
          minHeight: "215vh",
          position: "relative",
          backgroundColor: "#2a2a2a",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "88px 24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: "1180px",
              width: "100%",
              margin: "0 auto",
              transform: `translateY(${stageShift}px)`,
              transition: settleProgress > 0 ? "transform 120ms linear" : undefined,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  paddingTop: "10px",
                  paddingBottom: "20px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    position: "relative",
                    zIndex: 1,
                    backgroundColor: "rgba(240,111,102,0.15)",
                    color: "#f06f66",
                    border: "1px solid rgba(240,111,102,0.35)",
                    padding: "6px 16px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontFamily: "'Poppins', sans-serif",
                    marginBottom: "24px",
                    borderBottomRightRadius: "10px",
                    opacity: labelReveal,
                    transform: `translateY(${(1 - labelReveal) * 60}px)`,
                    willChange: "transform, opacity",
                  }}
                >
                  Miert mas a Brandfabrik?
                </span>
                <h2
                  style={{
                    position: "relative",
                    zIndex: 2,
                    margin: "-8px 0 0",
                    fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(34px, 4.8vw, 58px)",
                    lineHeight: 1.15,
                    color: "#f0dfc8",
                    opacity: 0.15 + titleOneReveal * 0.85,
                    transform: `translateY(${(1 - titleOneReveal) * 34}px)`,
                    willChange: "transform, opacity",
                  }}
                >
                  Nem ugynokseg vagyunk.
                  <br />
                  <span
                    style={{
                      color: "#f06f66",
                      display: "inline-block",
                      opacity: 0.1 + titleTwoReveal * 0.9,
                      transform: `translateY(${(1 - titleTwoReveal) * 52}px)`,
                      willChange: "transform, opacity",
                    }}
                  >
                    Beveteli rendszert epitunk.
                  </span>
                </h2>
              </div>
            </div>

            <div
              style={{
                border: "1px solid rgba(240,223,200,0.1)",
                borderTopLeftRadius: "20px",
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.01)",
                opacity: 0.1 + tableReveal * 0.9,
                transform: `translateY(${(1 - tableReveal) * 46}px)`,
                willChange: "transform, opacity",
                boxShadow:
                  settleProgress > 0.15 ? "0 18px 60px rgba(0,0,0,0.16)" : "0 8px 28px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr 1fr",
                  backgroundColor: "rgba(240,111,102,0.08)",
                  borderBottom: "1px solid rgba(240,111,102,0.2)",
                }}
              >
                <div style={headerCellStyle("rgba(240,223,200,0.35)")}>Szempont</div>
                <div style={headerCellStyle("rgba(240,223,200,0.4)", true)}>Hagyomanyos tanacsadas</div>
                <div
                  style={{
                    ...headerCellStyle("#f06f66", true),
                    borderLeft: "1px solid rgba(240,111,102,0.3)",
                    backgroundColor: "rgba(240,111,102,0.06)",
                  }}
                >
                  Brandfabrik Revenue Matrix
                </div>
              </div>

              {prototypeRows.map((row, index) => {
                const rowReveal = clamp((progress - (0.08 + index * 0.085)) / 0.17);

                return (
                  <div
                    key={row.aspect}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "180px 1fr 1fr",
                      borderBottom:
                        index < prototypeRows.length - 1 ? "1px solid rgba(240,223,200,0.06)" : "none",
                      backgroundColor: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      opacity: 0.04 + rowReveal * 0.96,
                      transform: `translateY(${(1 - rowReveal) * 52}px)`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <div style={aspectCellStyle}>{row.aspect}</div>
                    <div style={bodyCellStyle(false)}>
                      <span style={{ color: "rgba(240,111,102,0.45)", fontSize: "15px", flexShrink: 0 }}>x</span>
                      <span style={bodyTextStyle(false)}>{row.agency}</span>
                    </div>
                    <div style={bodyCellStyle(true)}>
                      <span style={{ color: "#f06f66", fontSize: "15px", flexShrink: 0 }}>+</span>
                      <span style={bodyTextStyle(true)}>{row.brandfabrik}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section style={{ minHeight: "84vh", padding: "96px 24px 120px", backgroundColor: "#252525" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              margin: 0,
              color: "rgba(240,223,200,0.62)",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              lineHeight: 1.7,
              maxWidth: "680px",
            }}
          >
            Itt mar a settle utan vagyunk. A szekcio elengedte a fokuszt, es a normal oldal-scroll folytatodik.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: "28px",
              color: "#f06f66",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            Vissza a landing oldalra
          </a>
        </div>
      </section>
    </main>
  );
}

function headerCellStyle(color: string, withBorder = false): React.CSSProperties {
  return {
    padding: "16px 24px",
    borderLeft: withBorder ? "1px solid rgba(240,223,200,0.08)" : undefined,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color,
  };
}

const aspectCellStyle: React.CSSProperties = {
  padding: "20px 24px",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "12px",
  fontWeight: 600,
  color: "rgba(240,223,200,0.5)",
  letterSpacing: "0.03em",
  display: "flex",
  alignItems: "center",
};

function bodyCellStyle(isAccent: boolean): React.CSSProperties {
  return {
    padding: "20px 24px",
    borderLeft: isAccent ? "1px solid rgba(240,111,102,0.2)" : "1px solid rgba(240,223,200,0.08)",
    backgroundColor: isAccent ? "rgba(240,111,102,0.04)" : "transparent",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };
}

function bodyTextStyle(isAccent: boolean): React.CSSProperties {
  return {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    fontWeight: isAccent ? 500 : 300,
    color: isAccent ? "#f0dfc8" : "rgba(240,223,200,0.4)",
    lineHeight: 1.5,
  };
}
