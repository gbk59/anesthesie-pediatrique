import "../styles/onglets.css";

function BoutonOnglet({ actif, onClick, children, emoji, label }) {
  return (
    <button
      onClick={onClick}
      className={`bouton-onglet ${actif ? "actif" : ""}`}
    >
      {emoji && (
        <span className="onglet-emoji" aria-hidden="true">
          {emoji}
        </span>
      )}

      {label ? (
        <span className="onglet-label">{label}</span>
      ) : (
        children
      )}
    </button>
  );
}

export default BoutonOnglet;