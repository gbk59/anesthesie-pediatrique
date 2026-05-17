import "../styles/carte-lien.css";

function CarteLien({ titre, description, bouton, onClick, action }) {
  return (
    <div className={`carte-lien ${action ? "carte-has-action" : ""}`}>
      {action && <div className="carte-action-top-right">{action}</div>}

      <h2 className="carte-lien-titre">
        {titre}
      </h2>

      {description && (
        <p className="carte-lien-description">
          {description}
        </p>
      )}

      <button
        onClick={onClick}
        className="carte-lien-bouton"
      >
        {bouton}
      </button>
    </div>
  );
}

export default CarteLien;