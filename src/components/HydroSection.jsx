import CarteResultat from "./CarteResultat";

export default function HydroSection({
  poids,
  age,
  valeurManquante,
  formatNombre,
  couleursOnglets,
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
      />
    </>
  );
}