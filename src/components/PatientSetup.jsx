import ChampNombre from "./ChampNombre";

function PatientSetup({ age, setAge, poids, setPoids, onCommencer }) {
  const ageValide = age !== "";
  const poidsValide = poids !== "";
  const peutCommencer = ageValide && poidsValide;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 16,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 18,
          borderRadius: 24,
          background: "white",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
    >
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 22,
        }}
        >
        <img
            src="/icon-512.png"
            alt="Logo"
            style={{
            width: 128,
            height: 128,
            borderRadius: 28,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
        />
        </div>
      
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: 26,
            color: "#111827",
            textAlign: "center",
          }}
        >
          Anesthésie Pédiatrique
        </h1>

        <p
          style={{
            margin: "0 0 20px",
            fontSize: 14,
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Renseigne le patient une seule fois, puis les calculs seront utilisés
          dans les sections nécessaires.
        </p>

        <ChampNombre
          titre="Âge (en années)"
          valeur={age}
          setValeur={setAge}
          min={0}
          max={18}
        />

        <ChampNombre
          titre="Poids (en kg)"
          valeur={poids}
          setValeur={setPoids}
          min={0}
          max={80}
        />

        <button
          onClick={onCommencer}
          disabled={!peutCommencer}
          style={{
            width: "100%",
            marginTop: 8,
            padding: "14px 16px",
            borderRadius: 16,
            border: "none",
            background: peutCommencer ? "#2563eb" : "#cbd5e1",
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            cursor: peutCommencer ? "pointer" : "not-allowed",
            boxShadow: peutCommencer
              ? "0 6px 14px rgba(37, 99, 235, 0.25)"
              : "none",
          }}
        >
          Commencer
        </button>
      </div>
    </div>
  );
}

export default PatientSetup;