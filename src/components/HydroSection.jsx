import CarteResultat from "./CarteResultat";
import FavoriButton from "./FavoriButton";

export default function HydroSection({
  poids,
  age,
  valeurManquante,
  formatNombre,
  couleursOnglets,
  estFavori,
  basculerFavori,
}) {
  return (
    <>
      <CarteResultat
        titre="Apports de base"
        description="Règle 4 - 2 - 1"
        valeur={
          valeurManquante(poids)
            ? "Renseigner le poids"
            : poids <= 10
            ? `${formatNombre(poids * 4)} mL/h`
            : poids <= 20
            ? `${formatNombre(
                40 + (poids - 10) * 2
              )} mL/h`
            : `${formatNombre(
                60 + (poids - 20)
              )} mL/h`
        }
        fond={couleursOnglets.hydro.fond}
        bordure={couleursOnglets.hydro.bordure}
        action={
          <FavoriButton
            actif={estFavori?.("hydro", "apports-base")}
            onClick={() =>
              basculerFavori?.({
                type: "hydro",
                key: "apports-base",
                label: "Apports de base",
              })
            }
          />
        }
      />

      <CarteResultat
        titre="Compensation du jeûne"
        description={
          age < 3
            ? "Première heure : 25 mL/kg"
            : "Première heure : 15 mL/kg"
        }
        valeur={
          valeurManquante(poids)
            ? "Renseigner le poids"
            : age < 3
            ? `${formatNombre(poids * 25)} mL`
            : `${formatNombre(poids * 15)} mL`
        }
        fond={couleursOnglets.hydro.fond}
        bordure={couleursOnglets.hydro.bordure}
        action={
          <FavoriButton
            actif={estFavori?.("hydro", "compensation-jeune")}
            onClick={() =>
              basculerFavori?.({
                type: "hydro",
                key: "compensation-jeune",
                label: "Compensation du jeûne",
              })
            }
          />
        }
      />
    </>
  );
}
