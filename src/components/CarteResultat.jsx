import "../styles/carte-resultat.css";

function CarteResultat({
  titre,
  valeur,
  description,
  info,
  fond,
  bordure,
  texte = "#000",
}) {
  return (
    <div
      className="carte-resultat"
      style={{
        background: fond,
        color: texte,
        borderTopColor: bordure,
      }}
    >
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