import "../styles/favoris.css";

export default function FavoriButton({ actif, onClick, label }) {
  return (
    <button
      type="button"
      className={`favori-button ${actif ? "actif" : ""}`}
      onClick={onClick}
      aria-label={label ?? (actif ? "Retirer des favoris" : "Ajouter aux favoris")}
      title={actif ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {actif ? "★" : "☆"}
    </button>
  );
}
