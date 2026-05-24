import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import medicaments from "./data/medicaments";
import aidesCognitives from "./data/aidesCognitives";
import bibliographie from "./data/bibliographie";
import constantesPediatriques from "./data/constantesPediatriques";
import analgesieSSPI from "./data/analgesieSSPI";
import nvpoSSPI from "./data/nvpoSSPI";
import ventilationData from "./data/ventilationData";
import respirateurData from "./data/respirateurData";
import categories from "./data/categories";
import couleursOnglets from "./data/couleursOnglets";
import constantesAffichage from "./data/constantesAffichage";
import getConstantes from "./utils/getConstantes";
import SSPISection from "./components/SSPISection";
import PDFModal from "./components/PDFModal";
import Header, { SECTIONS } from "./components/Header";
import DroguesSection from "./components/DroguesSection";
import HydroSection from "./components/HydroSection";
import VentilationSection from "./components/VentilationSection";
import RespirateurSection from "./components/RespirateurSection";
import ConstantesSection from "./components/ConstantesSection";
import AidesSection from "./components/AidesSection";
import SourcesSection from "./components/SourcesSection";
import FavorisSection from "./components/FavorisSection";
import PatientSetup from "./components/PatientSetup";
import { valeurManquante, formatNombre, normaliserTexte } from "./utils/helpers";
import "./styles/transitions.css";
import "./styles/home.css";
import { Analytics } from '@vercel/analytics/react'
import { trackEvent } from "./utils/trackEvent";
import { useFavoris } from "./hooks/useFavoris";
import Mentions from "./pages/Mentions";
import { Routes, Route } from "react-router-dom";
import AuthGate from "./auth/AuthGate";
import CGUModal from "./components/CGUModal";
import AdminDashboard from './pages/AdminDashboard'
import ResetPassword from './pages/ResetPassword'
import BottomActionBar from "./components/BottomActionBar";

function HomeHub({ sections, onSelectSection, globalSearch, setGlobalSearch, globalSearchResults }) {
  const rechercheActive = globalSearch.trim().length > 0;

  return (
    <main className="home-hub">
      <div className="home-global-search">
        <span aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Rechercher dans toute l’application..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
        {rechercheActive && (
          <button type="button" onClick={() => setGlobalSearch("")} aria-label="Effacer la recherche globale">
            ×
          </button>
        )}
      </div>

      {rechercheActive ? (
        <div className="home-search-results">
          <div className="home-hub-intro">
            <p>Résultats</p>
          </div>

          {globalSearchResults.length > 0 ? (
            globalSearchResults.map((resultat) => (
              <button
                key={`${resultat.sectionId}-${resultat.label}-${resultat.sousOnglet || ""}`}
                type="button"
                className="home-search-result-card"
                onClick={() => resultat.onOpen()}
              >
                <span className="home-search-result-emoji" aria-hidden="true">{resultat.emoji}</span>
                <span className="home-search-result-main">
                  <strong>{resultat.label}</strong>
                  <span>{resultat.sectionLabel}{resultat.sousLabel ? ` · ${resultat.sousLabel}` : ""}</span>
                </span>
                <span className="home-search-result-arrow" aria-hidden="true">›</span>
              </button>
            ))
          ) : (
            <div className="home-empty-search">
              Aucun résultat global pour « {globalSearch.trim()} ».
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="home-hub-intro">
            <p>Choisissez une section</p>
          </div>

          <div className="home-sections-grid">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className="home-section-card"
                onClick={() => onSelectSection(section.id)}
              >
                <span className="home-section-emoji" aria-hidden="true">{section.emoji}</span>
                <strong>{section.label}</strong>
                <span>{section.description}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function MedicoLegalFooter({ onOpenCGU }) {
  return (
    <footer className="medico-legal-footer">
      <div className="medico-legal-box">
        Les informations fournies par cette application sont destinées aux professionnels de santé
        dans le cadre de l’aide à la pratique clinique et ne remplacent ni le jugement médical,
        ni les protocoles locaux en vigueur. L’utilisateur demeure responsable de la vérification
        des données et des décisions thérapeutiques.
      </div>

      <button type="button" onClick={onOpenCGU} className="medico-legal-link">
        Mentions & conditions d’utilisation
      </button>
    </footer>
  );
}

function App() {
  const { user, signOut, isAdmin } = useAuth();
  const [poids, setPoids] = useState("");
  const [age, setAge] = useState("");
  const [patientValide, setPatientValide] = useState(false);
  const [onglet, setOnglet] = useState("accueil");
  const [pdfOuvert, setPdfOuvert] = useState(null);
  const [sousOngletSSPI, setSousOngletSSPI] = useState("analgesie");
  const [recherche, setRecherche] = useState("");
  const [showCGU, setShowCGU] = useState(false);
  const [alertePatientMasquee, setAlertePatientMasquee] = useState(false);

  const {
    favoris,
    chargementFavoris,
    erreurFavoris,
    estFavori,
    basculerFavori,
    mettreAJourOrdre,
  } = useFavoris(user);

  const [flaccVisage, setFlaccVisage] = useState(0);
  const [flaccJambes, setFlaccJambes] = useState(0);
  const [flaccActivite, setFlaccActivite] = useState(0);
  const [flaccCris, setFlaccCris] = useState(0);
  const [flaccConsolabilite, setFlaccConsolabilite] = useState(0);

  const scoreFlacc =
    Number(flaccVisage) +
    Number(flaccJambes) +
    Number(flaccActivite) +
    Number(flaccCris) +
    Number(flaccConsolabilite);

  useEffect(() => {
    setAlertePatientMasquee(false);
  }, [age, poids]);

  function changerOnglet(nouvelOnglet) {
    setOnglet(nouvelOnglet);
    setRecherche("");

    if (nouvelOnglet !== "accueil") {
      trackEvent(user, "open_tab", nouvelOnglet);
    }
  }

  function changerSousOngletSSPI(nouveauSousOnglet) {
    setSousOngletSSPI(nouveauSousOnglet);
    setRecherche("");
  }

  const [rechercheGlobale, setRechercheGlobale] = useState("");

  function reinitialiserFlacc() {
    setFlaccVisage(0);
    setFlaccJambes(0);
    setFlaccActivite(0);
    setFlaccCris(0);
    setFlaccConsolabilite(0);
  }

  function ouvrirDepuisRechercheGlobale(sectionId, sousOnglet = null, terme = "") {
    if (sectionId === "sspi" && sousOnglet) {
      setSousOngletSSPI(sousOnglet);
    }

    setRechercheGlobale("");
    changerOnglet(sectionId);
    window.setTimeout(() => {
      setRecherche(terme);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  const resultatsRechercheGlobale = (() => {
    const terme = normaliserTexte(rechercheGlobale.trim());
    if (!terme) return [];

    const resultats = [];
    const ajouter = ({ sectionId, label, sousOnglet = null, sousLabel = "" }) => {
      const section = sectionId === "favoris"
        ? { id: "favoris", emoji: "⭐", label: "Favoris" }
        : SECTIONS.find((item) => item.id === sectionId);

      if (!section) return;

      const texte = normaliserTexte(`${label} ${section.label} ${sousLabel}`);
      if (!texte.includes(terme)) return;

      resultats.push({
        sectionId,
        sousOnglet,
        sousLabel,
        label,
        emoji: section.emoji,
        sectionLabel: section.label,
        onOpen: () => ouvrirDepuisRechercheGlobale(sectionId, sousOnglet, rechercheGlobale.trim()),
      });
    };

    SECTIONS.forEach((section) => {
      ajouter({ sectionId: section.id, label: section.label });
    });

    medicaments.forEach((item) => ajouter({ sectionId: "drogues", label: item.nom }));
    [
      "Apports de base",
      "Compensation du jeûne",
    ].forEach((label) => ajouter({ sectionId: "hydro", label }));
    ventilationData.forEach((item) => ajouter({ sectionId: "ventilation", label: item.nom }));
    respirateurData.forEach((item) => ajouter({ sectionId: "respirateur", label: item.nom }));
    constantesAffichage.forEach((item) => ajouter({ sectionId: "constantes", label: item.nom }));
    aidesCognitives.forEach((item) => ajouter({ sectionId: "aides", label: item.nom }));
    bibliographie.forEach((item) => ajouter({ sectionId: "sources", label: item.titre || item.nom || item.label || "Source" }));
    analgesieSSPI.forEach((item) => ajouter({ sectionId: "sspi", sousOnglet: "analgesie", sousLabel: "Analgésie", label: item.nom }));
    nvpoSSPI.forEach((item) => ajouter({ sectionId: "sspi", sousOnglet: "nvpo", sousLabel: "NVPO", label: item.nom }));
    ajouter({ sectionId: "sspi", sousOnglet: "douleur", sousLabel: "Douleur", label: "Score FLACC" });
    ajouter({ sectionId: "favoris", label: "Favoris" });

    return resultats.slice(0, 12);
  })();

return (
<Routes>
  <Route
    path="/admin"
    element={
      isAdmin ? (
        <AdminDashboard />
      ) : (
        <AuthGate>
          <div style={{ padding: 24, textAlign: "center" }}>
            <h2>Accès refusé</h2>
            <p>Cette section est réservée aux administrateurs.</p>

            <button onClick={() => window.location.href = "/"}>
              Retour à l’application
            </button>
          </div>
        </AuthGate>
      )
    }
  />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route
    path="/"
    element={
      <AuthGate>
        {!patientValide ? (
          <PatientSetup
            age={age}
            setAge={setAge}
            poids={poids}
            setPoids={setPoids}
            onCommencer={() => setPatientValide(true)}
          />
        ) : (        
      <div
        style={{
          padding: 12,
          paddingBottom: "calc(132px + env(safe-area-inset-bottom))",
          fontFamily: "Arial, sans-serif",
          maxWidth: 760,
          width: "100%",
          boxSizing: "border-box",
          margin: "0 auto",
          minHeight: "100vh",
          background: "#f8fafb",
          color: "#111827",
          colorScheme: "light",
          WebkitTextSizeAdjust: "100%",
        }}
      >
        <Header
          onglet={onglet}
          recherche={recherche}
          setRecherche={setRecherche}
          changerOnglet={changerOnglet}
          age={age}
          poids={poids}
          userEmail={user?.email}
          onSignOut={signOut}
          isAdmin={isAdmin}
          onPatientAlertClick={() => setPatientValide(false)}
          patientAlertMasquee={alertePatientMasquee}
          onPatientAlertDismiss={() => setAlertePatientMasquee(true)}
        />

        <div key={onglet} className="transition-page">

        {onglet === "sspi" && (
          <div className="sspi-subtabs-row">
            <button className={sousOngletSSPI === "douleur" ? "sspi-subtab active" : "sspi-subtab"} onClick={() => changerSousOngletSSPI("douleur")}>Douleur</button>
            <button className={sousOngletSSPI === "analgesie" ? "sspi-subtab active" : "sspi-subtab"} onClick={() => changerSousOngletSSPI("analgesie")}>Analgésie</button>
            <button className={sousOngletSSPI === "nvpo" ? "sspi-subtab active" : "sspi-subtab"} onClick={() => changerSousOngletSSPI("nvpo")}>NVPO</button>
          </div>
        )}


        {onglet === "accueil" && (
          <HomeHub
            sections={SECTIONS}
            userEmail={user?.email}
            onSelectSection={changerOnglet}
            globalSearch={rechercheGlobale}
            setGlobalSearch={setRechercheGlobale}
            globalSearchResults={resultatsRechercheGlobale}
          />
        )}

        {onglet === "drogues" && (
          <DroguesSection
            medicaments={medicaments}
            recherche={recherche}
            poids={poids}
            valeurManquante={valeurManquante}
            formatNombre={formatNombre}
            categories={categories}
            estFavori={estFavori}
            basculerFavori={basculerFavori}
          />
        )}

        {onglet === "hydro" && (
          <HydroSection
            poids={poids}
            age={age}
            valeurManquante={valeurManquante}
            formatNombre={formatNombre}
            couleursOnglets={couleursOnglets}
            estFavori={estFavori}
            basculerFavori={basculerFavori}
          />
        )}

        {onglet === "ventilation" && (
          <VentilationSection
            ventilationData={ventilationData}
            recherche={recherche}
            age={age}
            poids={poids}
            valeurManquante={valeurManquante}
            couleursOnglets={couleursOnglets}
            formatNombre={formatNombre}
            estFavori={estFavori}
            basculerFavori={basculerFavori}
          />
        )}

        {onglet === "respirateur" && (
          <RespirateurSection
            respirateurData={respirateurData}
            recherche={recherche}
            age={age}
            poids={poids}
            valeurManquante={valeurManquante}
            couleursOnglets={couleursOnglets}
            formatNombre={formatNombre}
            estFavori={estFavori}
            basculerFavori={basculerFavori}
          />
        )}

        {onglet === "constantes" && (
          <ConstantesSection
            age={age}
            recherche={recherche}
            getConstantes={getConstantes}
            constantesPediatriques={constantesPediatriques}
            constantesAffichage={constantesAffichage}
            couleursOnglets={couleursOnglets}
          />
        )}

        {onglet === "aides" && (
          <AidesSection
            aidesCognitives={aidesCognitives}
            recherche={recherche}
            setPdfOuvert={setPdfOuvert}
            estFavori={estFavori}
            basculerFavori={basculerFavori}
          />
        )}

        {onglet === "favoris" && (
          <FavorisSection
            favoris={favoris}
            chargementFavoris={chargementFavoris}
            erreurFavoris={erreurFavoris}
            recherche={recherche}
            medicaments={medicaments}
            aidesCognitives={aidesCognitives}
            ventilationData={ventilationData}
            respirateurData={respirateurData}
            analgesieSSPI={analgesieSSPI}
            nvpoSSPI={nvpoSSPI}
            couleursOnglets={couleursOnglets}
            categories={categories}
            poids={poids}
            age={age}
            valeurManquante={valeurManquante}
            formatNombre={formatNombre}
            setPdfOuvert={setPdfOuvert}
            basculerFavori={basculerFavori}
            mettreAJourOrdre={mettreAJourOrdre}
          />
        )}

        {onglet === "sources" && (
          <SourcesSection
            bibliographie={bibliographie}
            recherche={recherche}
          />
        )}

        {onglet === "sspi" && (
          <SSPISection
            sousOngletSSPI={sousOngletSSPI}
            couleursOnglets={couleursOnglets}
            scoreFlacc={scoreFlacc}
            flaccVisage={flaccVisage}
            setFlaccVisage={setFlaccVisage}
            flaccJambes={flaccJambes}
            setFlaccJambes={setFlaccJambes}
            flaccActivite={flaccActivite}
            setFlaccActivite={setFlaccActivite}
            flaccCris={flaccCris}
            setFlaccCris={setFlaccCris}
            flaccConsolabilite={flaccConsolabilite}
            setFlaccConsolabilite={setFlaccConsolabilite}
            analgesieSSPI={analgesieSSPI}
            nvpoSSPI={nvpoSSPI}
            recherche={recherche}
            poids={poids}
            valeurManquante={valeurManquante}
            formatNombre={formatNombre}
            estFavori={estFavori}
            basculerFavori={basculerFavori}
            onResetFlacc={reinitialiserFlacc}
          />
        )}
    
        <Analytics />
        </div>

        <PDFModal
          pdfOuvert={pdfOuvert}
          setPdfOuvert={setPdfOuvert}
        />

        <BottomActionBar
          age={age}
          poids={poids}
          favorisCount={favoris.length}
          favorisActif={onglet === "favoris"}
          onPatientClick={() => setPatientValide(false)}
          onFavorisClick={() => changerOnglet("favoris")}
        />


        <MedicoLegalFooter onOpenCGU={() => setShowCGU(true)} />        
        </div>
      )}  
    <CGUModal
      open={showCGU}
      onClose={() => setShowCGU(false)}
    />      
    </AuthGate>
        }
      />

      <Route path="/mentions" element={<Mentions />} />
    </Routes>
  );
}

export default App;