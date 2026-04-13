path = "/home/ubuntu/revenue-matrix-v2/client/src/pages/Home.tsx"
with open(path, "r") as f:
    lines = f.readlines()

# Find start and end line indices (0-based)
start = None
end = None
for i, line in enumerate(lines):
    if line.startswith("function WhyTrustSection()"):
        start = i
    if start is not None and i > start and line.startswith("// Implementation section"):
        end = i
        break

print(f"Replacing lines {start+1}–{end} (1-based)")

new_section = r'''function WhyTrustSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useFramerInView(headerRef, { once: true, amount: 0.4 });
  const row1Ref = useRef<HTMLDivElement>(null);
  const row1InView = useFramerInView(row1Ref, { once: true, margin: "0px 0px -400px 0px" });
  const row2Ref = useRef<HTMLDivElement>(null);
  const row2InView = useFramerInView(row2Ref, { once: true, margin: "0px 0px -300px 0px" });

  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const slideLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const slideRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const slideLeftDelayed = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE, delay: 0.18 } },
  };
  const slideRightDelayed = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE, delay: 0.18 } },
  };

  const reasons = [
    { title: "A TE V\u00c1LLALKOZ\u00c1SODRA SZABVA", desc: "Nem \u00e1ltal\u00e1nos tan\u00e1csokat kapsz, hanem azt, ami a te piacodon, a te helyzetedben \u00e9s a te m\u0171k\u00f6d\u00e9sed mellett lehet val\u00f3ban relev\u00e1ns." },
    { title: "RENDET TESZ A LEHET\u0150S\u00c9GEK K\u00d6Z\u00d6TT", desc: "Ma m\u00e1r t\u00fal sok bev\u00e9telre hat\u00f3 eszk\u00f6z l\u00e9tezik ahhoz, hogy \u00e9rz\u00e9sb\u0151l lehessen j\u00f3l d\u00f6nteni. A Revenue Matrix nem mindent akar egyszerre haszn\u00e1lni, hanem kijel\u00f6li, mi maradjon bent, mi essen ki, \u00e9s hogyan er\u0151s\u00edts\u00e9k egym\u00e1st rendszerben a megtartott elemek." },
    { title: "EL\u0150SZ\u00d6R TISZST\u00c1N L\u00c1TSZ, UT\u00c1NA LEHET HALADNI", desc: "A prioritiz\u00e1lt rendszer leveszi r\u00f3lad a \u201emivel \u00e9rdemes kezdeni?\u201d terh\u00e9t. El\u0151sz\u00f6r vil\u00e1gos helyzetk\u00e9pet \u00e9s sorrendet kapsz, \u00e9s csak ut\u00e1na indulhat el a megval\u00f3s\u00edt\u00e1s." },
    { title: "NEM \u00c1LL MEG A DIAGN\u00d3Z IS\u00c1N\u00c1L", desc: "A c\u00e9l nem az, hogy k\u00e9sz\u00fclj\u00f6n egy j\u00f3 elemz\u00e9s, hanem az, hogy abb\u00f3l m\u0171k\u00f6d\u0151 rendszer \u00e9p\u00fclj\u00f6n. Ez\u00e9rt a folyamat nem a felismer\u00e9sn\u00e9l \u00e9r v\u00e9get, hanem a kivitelez\u00e9s ir\u00e1ny\u00e1ba megy tov\u00e1bb." },
  ];

  const renderCard = (item: { title: string; desc: string }, i: number, rowInView: boolean) => {
    const isLeft = i % 2 === 0;
    const isSecondInRow = i === 1 || i === 3;
    const variant = isLeft
      ? (isSecondInRow ? slideLeftDelayed : slideLeft)
      : (isSecondInRow ? slideRightDelayed : slideRight);
    const borderRadiusStyle = {
      borderTopRightRadius: i === 0 ? "28px" : "0",
      borderBottomRightRadius: i === 2 ? "28px" : "0",
      borderTopLeftRadius: i === 1 ? "28px" : "0",
      borderBottomLeftRadius: i === 3 ? "28px" : "0",
    };
    const greyBorder = "3px solid rgba(240,223,200,0.15)";
    const coralBorder = "3px solid #f06f66";
    const gradients = [
      "linear-gradient(315deg, rgba(240,111,102,0.07), transparent 60%)",
      "linear-gradient(45deg, rgba(240,111,102,0.07), transparent 60%)",
      "linear-gradient(225deg, rgba(240,111,102,0.07), transparent 60%)",
      "linear-gradient(135deg, rgba(240,111,102,0.07), transparent 60%)",
    ];
    return (
      <motion.div
        key={i}
        variants={variant}
        initial="hidden"
        animate={rowInView ? "visible" : "hidden"}
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
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: gradients[i], opacity: 0.85, pointerEvents: "none" }} />
        <div className="card-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "20px", color: "#f0dfc8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", transition: "color 0.25s ease", position: "relative" }}>{item.title}</div>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "15px", color: "rgba(240,223,200,0.7)", lineHeight: 1.7, position: "relative" }}>{item.desc}</div>
      </motion.div>
    );
  };

  return (
    <section style={{ padding: "120px 0", backgroundColor: "#303030" }}>
      <div className="container" style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto" }}>
        <motion.div ref={headerRef} variants={fadeUpVariants} initial="hidden" animate={headerInView ? "visible" : "hidden"} custom={0} style={{ marginBottom: "72px" }}>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#f06f66", marginBottom: "24px" }} />
          <h2 style={{ fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#f0dfc8", lineHeight: 1.2 }}>Mitt\u0151l lesz ebb\u0151l val\u00f3ban m\u0171k\u00f6d\u0151 rendszer?</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", columnGap: "2px", rowGap: "2px" }}>
          <div ref={row1Ref} style={{ display: "contents" }}>
            {reasons.slice(0, 2).map((item, i) => renderCard(item, i, row1InView))}
          </div>
          <div ref={row2Ref} style={{ display: "contents" }}>
            {reasons.slice(2, 4).map((item, i) => renderCard(item, i + 2, row2InView))}
          </div>
        </div>
      </div>
    </section>
  );
}

'''

new_lines = new_section.splitlines(keepends=True)
result = lines[:start] + new_lines + lines[end:]
with open(path, "w") as f:
    f.writelines(result)
print("Done")
