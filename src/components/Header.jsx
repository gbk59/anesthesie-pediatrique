import "../styles/header.css";
import PatientBanner from "./PatientBanner";
import { useEffect, useRef, useState } from "react";
import BoutonOnglet from "./BoutonOnglet";
import { Link } from "react-router-dom";

export default function Header({
  onglet,
  sousOngletSSPI,
  recherche,
  setRecherche,
  changerOnglet,
  age,
  poids,
  userEmail,
  onSignOut,
}) {
  const [headerCompact, setHeaderCompact] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const ongletsRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      setHeaderCompact(window.scrollY > 40);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const element = ongletsRef.current;

    if (!element) return undefined;

    function updateScrollState() {
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      setCanScrollLeft(element.scrollLeft > 6);
      setCanScrollRight(element.scrollLeft < maxScrollLeft - 6);
    }

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  function scrollOnglets(direction) {
    const element = ongletsRef.current;
    if (!element) return;

    element.scrollBy({
      left: direction * Math.round(element.clientWidth * 0.68),
      behavior: "smooth",
    });
  }

  const afficherRecherche = !(
    onglet === "hydro" ||
    (onglet === "sspi" && sousOngletSSPI === "douleur")
  );

  const afficherPatient = !(
    onglet === "aides" ||
    onglet === "sources" ||
    (onglet === "sspi" && sousOngletSSPI === "douleur")
  );

  return (
    <div className={`header-container ${headerCompact ? "compact" : ""}`}>
      <div className="header-topline">
        <div className="header-brand">
          <img src="/icon-192.png" alt="" className="header-app-icon" />

          <div className="header-identity">
            <h1 className="header-titre">Anesthésie Pédiatrique</h1>
            {userEmail && <span className="header-email">{userEmail}</span>}
          </div>
        </div>
      </div>

      <div className="header-actions-row">
        <div className="header-auth">
          <Link to="/admin" className="header-admin-link">
            <span aria-hidden="true">🛡️</span>
            Admin
          </Link>

          <button type="button" onClick={onSignOut} className="header-signout">
            <span aria-hidden="true">↪</span>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="onglets-shell">
        <button
          type="button"
          className={`onglets-arrow onglets-arrow-left ${canScrollLeft ? "visible" : ""}`}
          onClick={() => scrollOnglets(-1)}
          aria-label="Faire défiler le menu vers la gauche"
        >
          ‹
        </button>

        <div
          ref={ongletsRef}
          className={`onglets-grid ${canScrollLeft ? "fade-left" : ""} ${canScrollRight ? "fade-right" : ""}`}
        >
          <BoutonOnglet actif={onglet === "drogues"} onClick={() => changerOnglet("drogues")} emoji="💊" label="Drogues" />
          <BoutonOnglet actif={onglet === "hydro"} onClick={() => changerOnglet("hydro")} emoji="💧" label="Hydro" />
          <BoutonOnglet actif={onglet === "ventilation"} onClick={() => changerOnglet("ventilation")} emoji="🫁" label="Ventilation" />
          <BoutonOnglet actif={onglet === "respirateur"} onClick={() => changerOnglet("respirateur")} emoji="🌬️" label="Respirateur" />
          <BoutonOnglet actif={onglet === "sspi"} onClick={() => changerOnglet("sspi")} emoji="🩺" label="SSPI" />
          <BoutonOnglet actif={onglet === "constantes"} onClick={() => changerOnglet("constantes")} emoji="📈" label="Constantes" />
          <BoutonOnglet actif={onglet === "aides"} onClick={() => changerOnglet("aides")} emoji="📚" label="Aides SFAR" />
          <BoutonOnglet actif={onglet === "sources"} onClick={() => changerOnglet("sources")} emoji="📄" label="Sources" />
        </div>

        <button
          type="button"
          className={`onglets-arrow onglets-arrow-right ${canScrollRight ? "visible" : ""}`}
          onClick={() => scrollOnglets(1)}
          aria-label="Faire défiler le menu vers la droite"
        >
          ›
        </button>
      </div>

      {afficherRecherche && (
        <div className="header-recherche-wrapper">
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="header-recherche"
          />

          {recherche && (
            <button onClick={() => setRecherche("")} className="header-clear-btn">
              ✕
            </button>
          )}
        </div>
      )}

      {afficherPatient && <PatientBanner age={age} poids={poids} />}
    </div>
  );
}
