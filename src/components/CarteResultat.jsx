import "../styles/carte-resultat.css";

function CarteResultat({
  titre,
  valeur,
  description,
  info,
  fond,
  bordure,
  texte = "#000",
  action,
}) {
  return (
    <div
      className={`carte-resultat ${action ? "carte-has-action" : ""}`}
      style={{
        background: fond,
        color: texte,
        borderTopColor: bordure,
      }}
    >
      {action && <div className="carte-action-top-right">{action}</div>}

      <h2 className="carte-resultat-titre">
        {titre}
      </h2>

      {description && (
        <p className="carte-resultat-description">
          {description}
        </p>
      )}

      {valeur && (
        <p className="carte-resultat-valeur">
          {valeur}
        </p>
      )}

      {info && (
        <p className="carte-resultat-info">
          {info}
        </p>
      )}
    </div>
  );
}

export default CarteResultat;