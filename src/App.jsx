import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import BoutonOnglet from "./components/BoutonOnglet";
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
import Header from "./components/Header";
import DroguesSection from "./components/DroguesSection";
import HydroSection from "./components/HydroSection";
import VentilationSection from "./components/VentilationSection";
import RespirateurSection from "./components/RespirateurSection";
import ConstantesSection from "./components/ConstantesSection";
import AidesSection from "./components/AidesSection";
import SourcesSection from "./components/SourcesSection";
import PatientSetup from "./components/PatientSetup";
import PatientBanner from "./components/PatientBanner";
import { valeurManquante, formatNombre } from "./utils/helpers";
import "./styles/transitions.css";
import { Analytics } from '@vercel/analytics/react'
import { trackEvent } from "./utils/trackEvent";
import Mentions from "./pages/Mentions";
import { Routes, Route } from "react-router-dom";
import AuthGate from "./auth/AuthGate";
import CGUModal from "./components/CGUModal";

function App() {
  const { user, signOut } = useAuth();
  const [poids, setPoids] = useState("");
  const [age, setAge] = useState("");
  const [patientValide, setPatientValide] = useState(false);
  const [onglet, setOnglet] = useState("drogues");
  const [pdfOuvert, setPdfOuvert] = useState(null);
  const [sousOngletSSPI, setSousOngletSSPI] = useState("analgesie");
  const [recherche, setRecherche] = useState("");
  const [showCGU, setShowCGU] = useState(false);

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

  function changerOnglet(nouvelOnglet) {
    setOnglet(nouvelOnglet);
    setRecherche("");

    trackEvent(user, "open_tab", nouvelOnglet);
  }

  function changerSousOngletSSPI(nouveauSousOnglet) {
    setSousOngletSSPI(nouveauSousOnglet);
    setRecherche("");
  }

  function reinitialiserDonnees() {
    setRecherche("");
    setFlaccVisage(0);
    setFlaccJambes(0);
    setFlaccActivite(0);
    setFlaccCris(0);
    setFlaccConsolabilite(0);
    setPdfOuvert(null);
  }

return (
<Routes>
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
          paddingBottom: 80,
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
          sousOngletSSPI={sousOngletSSPI}
          recherche={recherche}
          setRecherche={setRecherche}
          changerOnglet={changerOnglet}
          age={age}
          poids={poids}
          onModifierPatient={() => setPatientValide(false)}
          userEmail={user?.email}
          onSignOut={signOut}
        />

        <div key={onglet} className="transition-page">

        {onglet === "sspi" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 6 }}>
            <BoutonOnglet actif={sousOngletSSPI === "douleur"} onClick={() => changerSousOngletSSPI("douleur")}>Douleur</BoutonOnglet>
            <BoutonOnglet actif={sousOngletSSPI === "analgesie"} onClick={() => changerSousOngletSSPI("analgesie")}>Analgésie</BoutonOnglet>
            <BoutonOnglet actif={sousOngletSSPI === "nvpo"} onClick={() => changerSousOngletSSPI("nvpo")}>NVPO</BoutonOnglet>
          </div>
        )}


        <div style={{ marginBottom: 14 }}>
          <button
            onClick={reinitialiserDonnees}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 14,
              border: "none",
              background: "#dee2e6",
              color: "#495057",
              fontSize: 15,
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            Réinitialiser les données
          </button>
        </div>

        
        {onglet === "drogues" && (
          <DroguesSection
            medicaments={medicaments}
            recherche={recherche}
            poids={poids}
            valeurManquante={valeurManquante}
            formatNombre={formatNombre}
            categories={categories}
          />
        )}

        {onglet === "hydro" && (
          <HydroSection
            poids={poids}
            age={age}
            valeurManquante={valeurManquante}
            formatNombre={formatNombre}
            couleursOnglets={couleursOnglets}
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
          />
        )}
    
        <Analytics />
        </div>

        <PDFModal
          pdfOuvert={pdfOuvert}
          setPdfOuvert={setPdfOuvert}
        />

        <div
          style={{
            marginTop: 24,
            marginBottom: 12,
            padding: "12px 14px",
            borderRadius: 12,
            background: "#f1f3f5",
            border: "1px solid #dee2e6",
            fontSize: 12,
            color: "#6c757d",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          Les informations fournies par cette application sont destinées aux professionnels de santé 
          dans le cadre de l’aide à la pratique clinique et ne remplacent ni le jugement médical, 
          ni les protocoles locaux en vigueur. L’utilisateur demeure responsable de la vérification 
          des données et des décisions thérapeutiques.
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            onClick={() => setShowCGU(true)}
            style={{
              border: "none",
              background: "none",
              color: "#2563eb",
              textDecoration: "underline",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Mentions & conditions d’utilisation
          </button>
        </div>        
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