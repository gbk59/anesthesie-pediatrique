function FlaccItem({ titre, valeur, setValeur, labels }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <h3
        style={{
          fontSize: 16,
          marginBottom: 5,
          marginTop: 0,
          textAlign: "center",
          color: "#111827",
          WebkitTextFillColor: "#111827",
        }}
      >
        {titre}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 6,
        }}
      >
        {[0, 1, 2].map((score) => {
          const actif = valeur === score;
          const couleurTexte = actif ? "#ffffff" : "#111827";

          return (
            <button
              key={score}
              onClick={() => setValeur(score)}
              style={{
                minHeight: 52,
                padding: "5px 4px",
                borderRadius: 10,
                border: "none",
                background: actif ? "#212529" : "#dee2e6",
                color: couleurTexte,
                WebkitTextFillColor: couleurTexte,
                fontSize: 12,
                fontWeight: "bold",
                lineHeight: 1.15,
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: "bold" }}>
                {score}
              </div>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: "normal",
                }}
              >
                {labels[score]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FlaccItem;