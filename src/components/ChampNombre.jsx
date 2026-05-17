import "../styles/champ-nombre.css";

function ChampNombre({ titre, valeur, setValeur, min, max, step = 0.5 }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 6,
        borderRadius: 14,
        marginBottom: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        color: "#111827",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: 14,
          marginBottom: 4,
          marginTop: 0,
          color: "#495057",
        }}
      >
        {titre}
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
        <button
          onClick={() => setValeur(Math.max(min, Number(valeur || 0) - step))}
          style={{
            flex: "0 0 46px",
            height: 30,
            fontSize: 18,
            borderRadius: 10,
            border: "none",
            background: "#dee2e6",
            fontWeight: "bold",
            color: "#228be6",
          }}
        >
          -
        </button>

        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={valeur}
          onChange={(e) => setValeur(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            padding: 4,
            border: "1px solid #ccc",
            borderRadius: 10,
            background: "#ffffff",
            color: "#111827",
            caretColor: "#2563eb",
          }}
        />

        <button
          onClick={() => setValeur(Math.min(max, Number(valeur || 0) + step))}
          style={{
            flex: "0 0 46px",
            height: 30,
            fontSize: 18,
            borderRadius: 10,
            border: "none",
            background: "#dee2e6",
            fontWeight: "bold",
            color: "#228be6",
          }}
        >
          +
        </button>
      </div>

      <input
        className="champ-nombre-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={valeur || 0}
        onChange={(e) => setValeur(e.target.value)}
      />
    </div>
  );
}

export default ChampNombre;