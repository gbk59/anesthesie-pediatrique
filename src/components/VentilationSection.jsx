import CarteResultat from "./CarteResultat";

export default function VentilationSection({
  ventilationData,
  recherche,
  age,
  poids,
  valeurManquante,
  couleursOnglets,
  formatNombre,
}) {
  return (
    <>
      {ventilationData
        .filter((item) =>
          item.nom
            .toLowerCase()
            .includes(recherche.toLowerCase())
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
          />
        ))}
    </>
  );
}