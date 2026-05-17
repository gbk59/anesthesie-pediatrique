import "../styles/carte-lien.css";

function CarteLien({ titre, description, bouton, onClick }) {
  return (
    <div className="carte-lien">
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