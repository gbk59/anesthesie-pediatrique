import { useState } from "react";
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
  retournable = false,
  preparation,
  doseMaxCalculee,
  poids,
}) {
  const [estRetournee, setEstRetournee] = useState(false);

  const styleCarte = {
    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.10) 0%,
        rgba(255,255,255,0.02) 100%
      ),
      ${fond}
    `,
    color: texte,
    borderTopColor: bordure,
  };

  function basculerCarte() {
    if (!retournable) return;

    setEstRetournee((valeurActuelle) => !valeurActuelle);
  }

  const preparationAffichee = preparation || {
    titre: "Préparation / dilution",

    lignes: [
      "À compléter selon protocole local.",
      "Vérifier concentration disponible.",
    ],
  };

const baseCalcul = preparationAffichee.baseCalcul || "doseMax";

const valeurReference =
  baseCalcul === "poids"
    ? Number(poids)
    : Number(doseMaxCalculee);

const reglePreparation =
  preparationAffichee.regles?.find((regle) => {
    if (!valeurReference) return false;

    if (baseCalcul === "poids") {
      const minimumOk = valeurReference >= regle.poidsMin;

      const maximumOk =
        regle.poidsMax === undefined ||
        valeurReference <= regle.poidsMax;

      return minimumOk && maximumOk;
    }

    const minimumOk = valeurReference >= regle.doseMin;

    const maximumOk =
      regle.doseMax === undefined ||
      valeurReference <= regle.doseMax;

    return minimumOk && maximumOk;
  });

  return (
    <div
      className={`carte-resultat ${
        action ? "carte-has-action" : ""
      } ${
        retournable ? "carte-retournable" : ""
      } ${
        estRetournee ? "carte-retournee" : ""
      }`}
      style={styleCarte}
      onClick={basculerCarte}
    >
      {action && (
        <div
          className="carte-action-top-right"
          onClick={(event) => event.stopPropagation()}
        >
          {action}
        </div>
      )}

      {!estRetournee ? (
        <>
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

          {retournable && (
            <span
              className="carte-resultat-indice"
              aria-hidden="true"
            >
              ↻
            </span>
          )}
        </>
      ) : (
        <>
          <h2 className="carte-resultat-titre">
            {preparationAffichee.titre}
          </h2>

          {preparationAffichee.concentration && (
            <p className="carte-resultat-info">
              <strong>Concentration :</strong>{" "}
              {preparationAffichee.concentration}
            </p>
          )}

          {reglePreparation && (
            <div className="carte-resultat-dilution">
              <span className="carte-resultat-dilution-label">
                Dilution : 
              </span>

              <span className="carte-resultat-dilution-valeur">
                {reglePreparation.concentration}
              </span>
            </div>
          )}

          {preparationAffichee.administration && (
            <div className="carte-resultat-administration">
              {preparationAffichee.administration}
            </div>
          )}

          {preparationAffichee.voie && (
            <p className="carte-resultat-info">
              <strong>Voie :</strong>{" "}
              {preparationAffichee.voie}
            </p>
          )}

          {preparationAffichee.lignes?.map((ligne) => (
            <p
              key={ligne}
              className="carte-resultat-description"
            >
              {ligne}
            </p>
          ))}
        </>
      )}
    </div>
  );
}

export default CarteResultat;