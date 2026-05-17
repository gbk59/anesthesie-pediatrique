import CarteResultat from "./CarteResultat";
import FavoriButton from "./FavoriButton";
import { normaliserTexte } from "../utils/helpers";

export default function VentilationSection({
  ventilationData,
  recherche,
  age,
  poids,
  valeurManquante,
  couleursOnglets,
  formatNombre,
  estFavori,
  basculerFavori,
}) {
  return (
    <>
      {ventilationData
        .filter((item) =>
          normaliserTexte(item.nom).includes(normaliserTexte(recherche))
        )
        .map((item) => (
          <CarteResultat
            key={item.nom}
            titre={item.nom}
            valeur={
              valeurManquante(age, poids)
                ? "Renseigner âge et poids"
                : item.resultat(
                    Number(age),
                    Number(poids),
                    formatNombre
                  )
            }
            fond={couleursOnglets.ventilation.fond}
            bordure={couleursOnglets.ventilation.bordure}
            action={
              <FavoriButton
                actif={estFavori?.("ventilation", item.nom)}
                onClick={() =>
                  basculerFavori?.({
                    type: "ventilation",
                    key: item.nom,
                    label: item.nom,
                  })
                }
              />
            }
          />
        ))}
    </>
  );
}
