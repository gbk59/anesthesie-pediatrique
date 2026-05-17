import "../styles/header.css";
import PatientBanner from "./PatientBanner";
import { useEffect, useState } from "react";
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
  onModifierPatient,
  userEmail,
  onSignOut,
}) {

  const [headerCompact, setHeaderCompact] = useState(false);

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
  return (
      
      <div className={`header-container ${headerCompact ? "compact" : ""}`}>
      <div className="header-topline">
        <h1 className="header-titre">
          Anesthésie Pédiatrique
        </h1>

        <div className="header-auth">
          {userEmail && <span className="header-email">{userEmail}</span>}

          <Link to="/admin" className="header-admin-link">
            Admin
          </Link>

          <button type="button" onClick={onSignOut} className="header-signout">
            Déconnexion
          </button>
        </div>
      </div>

      {!(
        onglet === "hydro" ||
        (onglet === "sspi" && sousOngletSSPI === "douleur")
      ) && (
        <div className="header-recherche-wrapper">
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="header-recherche"
/>

          {recherche && (
            <button
              onClick={() => setRecherche("")}
              className="header-clear-btn"
            >
              ✕
            </button>
          )}
        </div>
      )}

      <div className="onglets-grid">
        <BoutonOnglet
          actif={onglet === "drogues"}
          onClick={() => changerOnglet("drogues")}
          emoji="💊"
          label="Drogues"
        />

        <BoutonOnglet
          actif={onglet === "hydro"}
          onClick={() => changerOnglet("hydro")}
          emoji="💧"
          label="Hydro"
        />

        <BoutonOnglet
          actif={onglet === "ventilation"}
          onClick={() => changerOnglet("ventilation")}
          emoji="🫁"
          label="Ventilation"
        />

        <BoutonOnglet
          actif={onglet === "respirateur"}
          onClick={() => changerOnglet("respirateur")}
          emoji="🌬️"
          label="Respirateur"
        />

        <BoutonOnglet
          actif={onglet === "sspi"}
          onClick={() => changerOnglet("sspi")}
          emoji="🩺"
          label="SSPI"
        />

        <BoutonOnglet
          actif={onglet === "constantes"}
          onClick={() => changerOnglet("constantes")}
          emoji="📈"
          label="Constantes"
        />

        <BoutonOnglet
          actif={onglet === "aides"}
          onClick={() => changerOnglet("aides")}
          emoji="📚"
          label="Aides SFAR"
        />

        <BoutonOnglet
          actif={onglet === "sources"}
          onClick={() => changerOnglet("sources")}
          emoji="📄"
          label="Sources"
        />
      </div>

      {!(
        onglet === "aides" ||
        onglet === "sources" ||
        (onglet === "sspi" && sousOngletSSPI === "douleur")
      ) && (
        <PatientBanner
          age={age}
          poids={poids}
          onModifier={onModifierPatient}
        />
      )}
    </div>
  );
}