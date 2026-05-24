import "../styles/header.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { analyserCoherencePatient } from "../utils/coherencePatient";

const SECTIONS = [
  { id: "drogues", emoji: "💊", label: "Drogues", description: "Posologies et doses" },
  { id: "hydro", emoji: "💧", label: "Hydro", description: "Bilans et perfusions" },
  { id: "ventilation", emoji: "🫁", label: "Ventilation", description: "Réglages et aides" },
  { id: "respirateur", emoji: "🌬️", label: "Respirateur", description: "Paramètres machine" },
  { id: "sspi", emoji: "🩺", label: "SSPI", description: "Douleur, analgésie, NVPO" },
  { id: "constantes", emoji: "📈", label: "Constantes", description: "Valeurs pédiatriques" },
  { id: "aides", emoji: "📚", label: "Aides SFAR", description: "Conduites à tenir" },
  { id: "sources", emoji: "📄", label: "Sources", description: "Bibliographie" },
];

function getSection(onglet) {
  if (onglet === "favoris") {
    return { id: "favoris", emoji: "⭐", label: "Favoris", description: "Accès rapides" };
  }

  return SECTIONS.find((section) => section.id === onglet) || SECTIONS[0];
}

export { SECTIONS, getSection };

export default function Header({
  onglet,
  recherche,
  setRecherche,
  changerOnglet,
  age,
  poids,
  userEmail,
  onSignOut,
  isAdmin,
  onPatientAlertClick,
  patientAlertMasquee = false,
  onPatientAlertDismiss,
}) {
  const [headerCompact, setHeaderCompact] = useState(false);
  const [menuSectionsOuvert, setMenuSectionsOuvert] = useState(false);
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const rechercheRef = useRef(null);

  const estAccueil = onglet === "accueil";
  const section = getSection(onglet);

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
    setRechercheOuverte(false);
    setMenuSectionsOuvert(false);
  }, [onglet]);

  useEffect(() => {
    if (rechercheOuverte) {
      window.setTimeout(() => rechercheRef.current?.focus(), 80);
    }
  }, [rechercheOuverte]);

  const coherencePatient = analyserCoherencePatient({ age, poids });

  const afficherAlertePatient =
    !patientAlertMasquee &&
    coherencePatient?.niveau !== "ok" &&
    coherencePatient?.niveau !== "neutre";

  function fermerRecherche() {
    setRechercheOuverte(false);
    setRecherche("");
  }

  function ouvrirSection(sectionId) {
    changerOnglet(sectionId);
    setMenuSectionsOuvert(false);
  }

  return (
    <>
      <div className={`header-container ${headerCompact ? "compact" : ""} ${estAccueil ? "home" : "section"}`}>
        {estAccueil ? (
          <>
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
                {isAdmin && (
                  <Link to="/admin" className="header-admin-link">
                    <span aria-hidden="true">🛡️</span>
                    Admin
                  </Link>
                )}

                <button type="button" onClick={onSignOut} className="header-signout">
                  <span aria-hidden="true">↪</span>
                  Déconnexion
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="section-header-row">
            <button
              type="button"
              className="section-menu-button"
              onClick={() => setMenuSectionsOuvert(true)}
            >
              <span aria-hidden="true">☰</span>
              Menu
            </button>

            <div className="section-title" aria-label={`Section ${section.label}`}>
              <span className="section-title-emoji" aria-hidden="true">{section.emoji}</span>
              <span className="section-title-label">{section.label}</span>
            </div>

            <div className="section-header-actions">
              <button
                type="button"
                className={`section-icon-button ${rechercheOuverte ? "active" : ""}`}
                onClick={() => (rechercheOuverte ? fermerRecherche() : setRechercheOuverte(true))}
                aria-label={rechercheOuverte ? "Fermer la recherche" : "Ouvrir la recherche"}
              >
                {rechercheOuverte ? "×" : "🔍"}
              </button>


            </div>

            <div className="section-subheader">
              <button
                type="button"
                onClick={onSignOut}
                className="section-logout-pill"
              >
                ↪ Déconnexion
              </button>
            </div>            
          </div>


        )}

        {!estAccueil && rechercheOuverte && (
          <div className="header-recherche-wrapper section-search-wrapper">
            <span className="header-search-icon" aria-hidden="true">🔍</span>
            <input
              ref={rechercheRef}
              type="text"
              placeholder="Rechercher..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="header-recherche"
            />

            <button onClick={fermerRecherche} className="header-clear-btn" aria-label="Fermer la recherche">
              ✕
            </button>
          </div>
        )}

        {afficherAlertePatient && (
          <div
            className={`patient-alert-bar patient-alert-bar-${coherencePatient.niveau}`}
            role="status"
          >
            <span className="patient-alert-icon" aria-hidden="true">⚠️</span>

            <span className="patient-alert-text">
              {coherencePatient.messages[0]}
            </span>

            <div className="patient-alert-actions">
              <button
                type="button"
                className="patient-alert-action"
                onClick={onPatientAlertClick}
              >
                Vérifier
              </button>

              <button
                type="button"
                className="patient-alert-dismiss"
                onClick={onPatientAlertDismiss}
                aria-label="Masquer cette alerte patient"
                title="Masquer cette alerte"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {menuSectionsOuvert && !estAccueil && (
        <div className="sections-sheet-backdrop" onClick={() => setMenuSectionsOuvert(false)}>
          <div className="sections-sheet" role="dialog" aria-modal="true" aria-label="Toutes les sections" onClick={(e) => e.stopPropagation()}>
            <div className="sections-sheet-handle" aria-hidden="true" />

            <div className="sections-sheet-header">
              <h2>Toutes les sections</h2>
              <button type="button" onClick={() => setMenuSectionsOuvert(false)} aria-label="Fermer le menu des sections">
                ×
              </button>
            </div>

            <div className="sections-sheet-grid">
              <button
                type="button"
                className="home-section-card sheet-section-card sheet-home-card"
                onClick={() => ouvrirSection("accueil")}
              >
                <span className="home-section-emoji" aria-hidden="true">🏠</span>
                <strong>Accueil</strong>
                <span>Menu principal</span>
              </button>

              {SECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`home-section-card sheet-section-card ${onglet === item.id ? "active" : ""}`}
                  onClick={() => ouvrirSection(item.id)}
                >
                  <span className="home-section-emoji" aria-hidden="true">{item.emoji}</span>
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
