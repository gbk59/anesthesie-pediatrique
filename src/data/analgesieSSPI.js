const analgesieSSPI = [
  {
    nom: "Nalbuphine",
    dose: "0,1 à 0,2 mg/kg",
    resultat: (poids, formatNombre) =>
      !poids
        ? "Renseigner le poids"
        : `${formatNombre(poids * 0.1)} à ${formatNombre(poids * 0.2)} mg`,
    couleur: "#74c0fc",
  },
  {
    nom: "Morphine",
    dose: "0,05 à 0,1 mg/kg",
    resultat: (poids, formatNombre) =>
      !poids
        ? "Renseigner le poids"
        : `${formatNombre(poids * 0.05)} à ${formatNombre(poids * 0.1)} mg`,
    couleur: "#74c0fc",
  },
  {
    nom: "Paracétamol",
    dose: "15 mg/kg",
    resultat: (poids, formatNombre) =>
      !poids ? "Renseigner le poids" : `${formatNombre(poids * 15)} mg`,
    couleur: "#ffffff",
  },
  {
    nom: "Kétoprofène",
    dose: "1 mg/kg",
    resultat: (poids, formatNombre) =>
      !poids ? "Renseigner le poids" : `${formatNombre(poids)} mg`,
    couleur: "#ffffff",
  },
];

export default analgesieSSPI;