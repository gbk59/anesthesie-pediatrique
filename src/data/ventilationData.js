const ventilationData = [
  {
    nom: "Lame Macintosh",
    resultat: (age) => {
      if (age === 0) return "Lame T0";
      if (age > 0 && age <= 0.5) return "Lame T1";
      if (age > 0.5 && age <= 7) return "Lame T2";
      return "Lame T3";
    },
  },
  {
    nom: "Sonde d'intubation",
    resultat: (age, _, formatNombre) =>
      `Sonde IOT Ø ${formatNombre(Math.round((age / 4 + 3) * 2) / 2)}`,
  },
  {
    nom: "Masque d'anesthésie",
    resultat: (age) => {
      if (age < 1) return "Masque T1";
      if (age >= 1 && age <= 4) return "Masque T2";
      if (age > 4 && age <= 7) return "Masque T2 ou T3";
      return "Masque T3";
    },
  },
  {
    nom: "Canule de Guedel",
    resultat: (age) => {
      if (age < 2) return "Guedel T00";
      if (age >= 2 && age < 3) return "Guedel T0";
      if (age >= 3 && age < 7) return "Guedel T1";
      return "Guedel T2";
    },
  },
  {
    nom: "Circuit respiratoire",
    resultat: (_, poids) => {
      if (poids <= 30) return "Circuit pédiatrique";
      return "Circuit adulte possible";
    },
  },
  {
    nom: "Filtre respiratoire",
    resultat: (_, poids) => {
      if (poids * 6 >= 250 || poids * 8 >= 250) return "Filtre adulte";
      return "Filtre pédiatrique";
    },
  },
];

export default ventilationData;