const respirateurData = [
  {
    nom: "Volume courant",
    description: "6 à 8 mL/kg",
    resultat: (_, poids, formatNombre) =>
      `${formatNombre((poids || 0) * 6)} à ${formatNombre((poids || 0) * 8)} mL`,
  },
  {
    nom: "Fréquence respiratoire",
    description: "24 - 0,6 × âge",
    resultat: (age) => `${Math.round(24 - 0.6 * (age || 0))} cpm`,
  },
  { nom: "PEP", resultat: () => "4 à 5 cmH₂O" },
  { nom: "FiO₂", resultat: () => "Minimale pour SpO₂ correcte" },
  { nom: "EtCO₂ cible", resultat: () => "35 à 45 mmHg" },
];

export default respirateurData;