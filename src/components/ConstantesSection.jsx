import CarteResultat from "./CarteResultat";
import CarteConstante from "./CarteConstante";
import CarteInfo from "./CarteInfo";

export default function ConstantesSection({
  age,
  recherche,
  getConstantes,
  constantesPediatriques,
  constantesAffichage,
  couleursOnglets,
}) {
  const constantes = getConstantes(
    age,
    constantesPediatriques
  );

  return (
    <>
      <CarteResultat
        titre="Constantes pédiatriques"
        description={`Tranche : ${constantes.tranche}`}
        valeur=""
        fond={couleursOnglets.constantes.fond}
        bordure={couleursOnglets.constantes.bordure}
      />

      <div style={{ display: "grid", gap: 12 }}>
        {constantesAffichage
          .filter(
            (item) =>
              item.nom
                .toLowerCase()
                .includes(recherche.toLowerCase()) ||
              item.cle
                .toLowerCase()
                .includes(recherche.toLowerCase())
          )
          .map((item) => (
            <CarteConstante
              key={item.cle}
              titre={item.nom}
              valeur={constantes[item.cle]}
            />
          ))}
      </div>

      <CarteInfo
        titre="Sources utilisées"
        texte={
          <>
            RCH Clinical Practice Guidelines
            <br />
            BC PEWS Vital Signs Reference Card — June 2025
            <br />
            ERC Pediatric Life Support Guidelines 2025
          </>
        }
      />
    </>
  );
}