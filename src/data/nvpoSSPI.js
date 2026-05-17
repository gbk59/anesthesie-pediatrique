const nvpoSSPI = [
  {
    nom: "Zophren",
    dose: "0,1 mg/kg IV lente",
    resultat: (poids, formatNombre) =>
      !poids
        ? "Renseigner le poids"
        : `${formatNombre(Math.min(poids * 0.1, 4))} mg`,
    info: "Dose maximale : 4 mg",
    couleur: "#f4c08d",
  },
];

export default nvpoSSPI;