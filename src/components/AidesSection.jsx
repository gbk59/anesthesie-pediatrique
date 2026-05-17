import CarteLien from "./CarteLien";

export default function AidesSection({
  aidesCognitives,
  recherche,
  setPdfOuvert,
}) {
  return (
    <>
      {aidesCognitives
        .filter((aide) =>
          aide.nom.toLowerCase().includes(recherche.toLowerCase())
        )
        .map((aide) => (
          <CarteLien
            key={aide.nom}
            titre={aide.nom}
            bouton="Ouvrir le PDF"
            onClick={() => setPdfOuvert(aide.fichier)}
          />
        ))}
    </>
  );
}