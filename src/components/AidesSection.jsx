import CarteLien from "./CarteLien";
import FavoriButton from "./FavoriButton";
import { normaliserTexte } from "../utils/helpers";

export default function AidesSection({
  aidesCognitives,
  recherche,
  setPdfOuvert,
  estFavori,
  basculerFavori,
}) {
  return (
    <>
      {aidesCognitives
        .filter((aide) =>
          normaliserTexte(aide.nom).includes(normaliserTexte(recherche))
        )
        .map((aide) => (
          <CarteLien
            key={aide.nom}
            titre={aide.nom}
            bouton="Ouvrir le PDF"
            onClick={() => setPdfOuvert(aide.fichier)}
            action={
              <FavoriButton
                actif={estFavori?.("aide", aide.fichier)}
                onClick={() =>
                  basculerFavori?.({
                    type: "aide",
                    key: aide.fichier,
                    label: aide.nom,
                  })
                }
              />
            }
          />
        ))}
    </>
  );
}
