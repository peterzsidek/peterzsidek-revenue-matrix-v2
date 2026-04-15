import { Link } from "wouter";

export default function Adatkezeles() {
  const sections = [
    {
      title: "1. Az adatkezelő",
      content: `Adatkezelő: Brandfabrik (a továbbiakban: „Brandfabrik" vagy „mi").\nA Revenue Matrix™ diagnosztikai szolgáltatás keretében gyűjtött személyes adatok kezelője a Brandfabrik.\nKapcsolat: a weboldalon megadott elérhetőségeken keresztül.`,
    },
    {
      title: "2. Milyen adatokat gyűjtünk?",
      content: `A weboldalon található kapcsolatfelvételi és visszahívás-kérő űrlapokon az alábbi adatokat kérjük:\n\n• Név (keresztnév)\n• Telefonszám\n• E-mail cím (diagnosztika kérés esetén)\n• Vállalkozás neve (diagnosztika kérés esetén)\n• Opcionális üzenet / kihívás leírása\n\nEzeken kívül a weboldal látogatása során automatikusan rögzíthetők technikai adatok (IP-cím, böngésző típusa, látogatás időpontja) a szerver naplófájlokban.`,
    },
    {
      title: "3. Az adatkezelés célja és jogalapja",
      content: `Az adatkezelés célja:\n• Visszahívás biztosítása az érdeklődő számára\n• Revenue Matrix™ diagnosztikai elemzés elvégzése és eredményeinek bemutatása\n• Üzleti kapcsolatfelvétel és ajánlatadás\n\nJogalap: az érintett önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont), amelyet az űrlap elküldésével ad meg.`,
    },
    {
      title: "4. Adatmegőrzési idő",
      content: `A személyes adatokat az üzleti kapcsolat fennállásáig, illetve a hozzájárulás visszavonásáig tároljuk, de legfeljebb 2 évig. Ezt követően az adatokat töröljük.`,
    },
    {
      title: "5. Adattovábbítás, harmadik felek",
      content: `Az adatokat harmadik félnek nem adjuk el, nem adjuk bérbe, és nem adjuk át marketing célokra.\n\nAz adatok feldolgozásához az alábbi adatfeldolgozókat vesszük igénybe:\n• Brandfabrik saját szervere (brandfabrik.hu) — az űrlapok technikai kézbesítéséhez\n\nEzek az adatfeldolgozók kizárólag a mi utasításaink alapján, az általunk meghatározott célra kezelik az adatokat.`,
    },
    {
      title: "6. Az érintett jogai",
      content: `A GDPR alapján Ön jogosult:\n\n• Hozzáféréshez: megismerheti, hogy milyen adatokat kezelünk Önről.\n• Helyesbítéshez: kérheti a pontatlan adatok javítását.\n• Törléshez (elfeledtetéshez): kérheti adatai törlését.\n• Adatkezelés korlátozásához: kérheti az adatkezelés felfüggesztését.\n• Hordozhatósághoz: kérheti adatait géppel olvasható formátumban.\n• Tiltakozáshoz: tiltakozhat az adatkezelés ellen.\n\nJogai gyakorlásához vegye fel velünk a kapcsolatot a weboldalon megadott elérhetőségeken. Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH) fordulhat: naih.hu`,
    },
    {
      title: "7. Adatbiztonság",
      content: `Megfelelő technikai és szervezési intézkedésekkel gondoskodunk arról, hogy az adatok védelme biztosított legyen az illetéktelen hozzáféréssel, megváltoztatással, nyilvánosságra hozatallal vagy megsemmisítéssel szemben.`,
    },
    {
      title: "8. Módosítások",
      content: `Fenntartjuk a jogot, hogy ezt a tájékoztatót szükség esetén frissítsük. A módosítások hatálybalépéséről a weboldalon tájékoztatjuk az érintetteket.`,
    },
  ];

  return (
    <div style={{ backgroundColor: "#1a1212", minHeight: "100vh", color: "#f0dfc8" }}>
      {/* Nav */}
      <div style={{ borderBottom: "1px solid rgba(240,223,200,0.08)", padding: "16px 0" }}>
        <div style={{
          maxWidth: "860px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <Link href="/">
            <span style={{
              fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 4vw, 18px)",
              color: "#f0dfc8",
              cursor: "pointer",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}>
              BRANDFABRIK
            </span>
          </Link>
          <Link href="/">
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(12px, 3.5vw, 13px)",
              color: "rgba(240,111,102,0.85)",
              cursor: "pointer",
              textDecoration: "underline",
              whiteSpace: "nowrap",
            }}>
              ← Vissza a főoldalra
            </span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "860px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "48px 20px 80px",
      }}>
        <div style={{ width: "40px", height: "3px", backgroundColor: "#f06f66", marginBottom: "28px" }} />

        <h1 style={{
          fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(24px, 6vw, 48px)",
          color: "#f0dfc8",
          lineHeight: 1.2,
          marginBottom: "12px",
        }}>
          Adatkezelési tájékoztató
        </h1>

        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "13px",
          color: "rgba(240,223,200,0.6)",
          marginBottom: "48px",
        }}>
          Hatályos: 2026. április 1-től
        </p>

        {sections.map((section, i) => (
          <div key={i} style={{
            marginBottom: "40px",
            paddingBottom: "40px",
            borderBottom: i < sections.length - 1 ? "1px solid rgba(240,223,200,0.07)" : "none",
          }}>
            <h2 style={{
              fontFamily: "'Zalando Sans Expanded', 'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(15px, 4vw, 18px)",
              color: "#f06f66",
              marginBottom: "14px",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
            }}>
              {section.title}
            </h2>
            <div style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(14px, 3.8vw, 15px)",
              color: "rgba(240,223,200,0.8)",
              lineHeight: 1.85,
              whiteSpace: "pre-line",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}>
              {section.content}
            </div>
          </div>
        ))}

        <div style={{ paddingTop: "32px" }}>
          <Link href="/">
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              color: "rgba(240,111,102,0.85)",
              cursor: "pointer",
              textDecoration: "underline",
            }}>
              ← Vissza a főoldalra
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
