import CarteResultat from "./CarteResultat";

export default function RespirateurSection({
  respirateurData,
  recherche,
  age,
  poids,
  valeurManquante,
  couleursOnglets,
  formatNombre,
}) {
  return (
    <>
      {respirateurData
        .filter((item) =>
          item.nom
            .toLowerCase()
            .includes(recherche.toLowerCase())
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
          />
        ))}
    </>
  );
}