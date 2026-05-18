import "../styles/bottom-action-bar.css";

function BottomActionBar({ age, poids, favorisCount, onPatientClick, onFavorisClick, favorisActif }) {
  return (
    <nav className="bottom-action-shell" aria-label="Actions rapides">
      <div className="bottom-action-bar">
        <button type="button" className="bottom-action-item bottom-action-patient" onClick={onPatientClick}>
          <span className="bottom-action-icon bottom-action-baby" aria-hidden="true">👶</span>
          <span className="bottom-action-text">
            <strong>Patient</strong>
            <span>{age} ans • {poids} kg</span>
          </span>
        </button>

        <span className="bottom-action-divider" aria-hidden="true" />

        <button
          type="button"
          className={`bottom-action-item bottom-action-favoris ${favorisActif ? "actif" : ""}`}
          onClick={onFavorisClick}
        >
          <span className="bottom-action-icon bottom-action-star" aria-hidden="true">⭐</span>
          <span className="bottom-action-text">
            <strong>Favoris</strong>
            <span>{favorisCount} élément{favorisCount > 1 ? "s" : ""}</span>
          </span>
        </button>
      </div>
    </nav>
  );
}

export default BottomActionBar;
