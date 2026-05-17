import CarteResultat from "./CarteResultat";
import FavoriButton from "./FavoriButton";
import { normaliserTexte } from "../utils/helpers";

export default function RespirateurSection({
  respirateurData,
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
      {respirateurData
        .filter((item) =>
          normaliserTexte(item.nom).includes(normaliserTexte(recherche))
        )
        .map((item) => (
          <CarteResultat
            key={item.nom}
            titre={item.nom}
            description={item.description}
            valeur={
              valeurManquante(age, poids)
                ? "Renseigner âge et poids"
                : item.resultat(
                    Number(age),
                    Number(poids),
                    formatNombre
                  )
            }
            fond={couleursOnglets.respirateur.fond}
            bordure={couleursOnglets.respirateur.bordure}
            action={
              <FavoriButton
                actif={estFavori?.("respirateur", item.nom)}
                onClick={() =>
                  basculerFavori?.({
                    type: "respirateur",
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
