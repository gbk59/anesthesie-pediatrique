import CarteResultat from "./CarteResultat";
import { normaliserTexte } from "../utils/helpers";

export default function DroguesSection({
  medicaments,
  recherche,
  poids,
  valeurManquante,
  formatNombre,
  categories,
}) {
  return (
    <>
      {medicaments
        .filter((medicament) =>
          normaliserTexte(medicament.nom).includes(
            normaliserTexte(recherche)
          )
        )
        .map((medicament) => {
          const styleCategorie =
            categories[medicament.categorie];

          const calculImpossible =
            valeurManquante(poids);

          const doseMin = calculImpossible
            ? null
            : Number(poids) * medicament.doseMin;

          const doseMax = calculImpossible
            ? null
            : Number(poids) * medicament.doseMax;

          const doseAffichee = calculImpossible
            ? "Renseigner le poids"
            : medicament.doseMin === medicament.doseMax
            ? `${formatNombre(doseMin)} ${medicament.resultat}`
            : `${formatNombre(doseMin)} à ${formatNombre(doseMax)} ${medicament.resultat}`;

          return (
            <CarteResultat
              key={medicament.nom}
              titre={medicament.nom}
              description={
                medicament.doseMin ===
                medicament.doseMax
                  ? `${medicament.doseMin} ${medicament.unite}`
                  : `${medicament.doseMin} – ${medicament.doseMax} ${medicament.unite}`
              }
              valeur={`Dose : ${doseAffichee}`}
              fond={styleCategorie.couleur}
              texte={styleCategorie.texte}
              bordure="#212529"
            />
          );
        })}
    </>
  );
}