import CarteLien from "./CarteLien";

export default function SourcesSection({
  bibliographie,
  recherche,
}) {
  return (
    <>
      {bibliographie
        .filter(
          (source) =>
            source.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            source.description.toLowerCase().includes(recherche.toLowerCase())
        )
        .map((source) => (
          <CarteLien
            key={source.nom}
            titre={source.nom}
            description={source.description}
            bouton="Consulter"
            onClick={() => window.open(source.url, "_blank")}
          />
        ))}
    </>
  );
}