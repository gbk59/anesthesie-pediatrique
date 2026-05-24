const medicaments = [
  {
    nom: "Sufenta",
    doseMin: 0.2,
    doseMax: 0.3,
    unite: "µg/kg",
    resultat: "µg",
    categorie: "morphinique",

    preparation: {
      titre: "Préparation",
      administration:"IVD",

      baseCalcul: "poids",

      regles: [
        {
          poidsMin: 0,
          poidsMax: 11.99,
          concentration: "Sufenta 1 µg/mL",
        },
        {
          poidsMin: 12,
          poidsMax: 24.99,
          concentration: "Sufenta 2 µg/mL",
        },
        {
          poidsMin: 25,
          concentration: "Sufenta 5 µg/mL",
        },
      ],

      lignes: [
        'Utiliser une seringue "mère" de Sufenta 5 µg/mL.',
        'Diluer avec du SSI pour atteindre la concentration proposée.',
        'Adapter le volume à la dose maximale.',
        'À utiliser pur à concentration de 5 µg/mL.',
      ],
    },
  },
  
  { nom: "Propofol", 
      doseMin: 2, 
      doseMax: 5, 
      unite: "mg/kg", 
      resultat: "mg", 
      categorie: "hypnotique",

      preparation: {
        titre: "Préparation",
        administration : "IVL",

        regles: [
          {
            doseMin: 0,
            doseMax: 400,
            concentration: "Propofol 1% — 10 mg/mL",
          },
        ],

        lignes: [
          'À utiliser pur, pas de dilution.',
        ],
      },
    },
  
  { nom: "Paracétamol", 
      doseMin: 15, 
      doseMax: 15, 
      unite: "mg/kg", 
      resultat: "mg", 
      categorie: "standard",

      preparation: {
        titre: "Préparation",
        administration: "IVL",


        regles: [
          {
            doseMin: 0,
            doseMax: 1000,
            concentration: "Paracétamol — 10 mg/mL",
          },
        ],

        lignes: [
          'À utiliser pur, pas de dilution.',
          
        ],
      },
    },

  { nom: "Kétoprofène", 
      doseMin: 1, 
      doseMax: 1, 
      unite: "mg/kg", 
      resultat: "mg", 
      categorie: "standard",

      preparation: {
        titre: "Préparation",
        administration: "IVL",


      baseCalcul: "poids",

      regles: [
        {
          poidsMin: 0,
          poidsMax: 20,
          concentration: "Kétroprofène 1 mg/mL",
        },
        {
          poidsMin: 21,
          poidsMax: 100,
          concentration: "Kétoprofène 2 mg/mL",
        },

      ],

        lignes: [
          'Utiliser seringue mère : 50mg/50mL (1mg/mL)',
          'ou',
          'Utiliser seringue mère : 100mg/50mL (2mg/mL)',
          'Prélever le volume nécessaire pour la dose désirée'
          
        ],
      },
    },      

  { nom: "Dexaméthasone", 
      doseMin: 0.1, 
      doseMax: 0.15, 
      unite: "mg/kg", 
      resultat: "mg", 
      categorie: "standard",

      preparation: {
        titre: "Préparation",
        administration: "IVD",


        regles: [
          {
            doseMin: 0,
            doseMax: 4,
            concentration: "Dexaméthasone 1mg/mL",
          },
        ],

        lignes: [
          'Diluer avec du SSI pour atteindre la concentration proposée.',
          
        ],
      },
    },      

  { nom: "Lidocaïne", 
      doseMin: 1, 
      doseMax: 1.5, 
      unite: "mg/kg", 
      resultat: "mg", 
      categorie: "AL" },

  { nom: "Atropine", 
      doseMin: 10, 
      doseMax: 20, 
      unite: "µg/kg", 
      resultat: "µg", 
      categorie: "urgence" },

  { nom: "Kétamine analgésique", 
      doseMin: 0.1, 
      doseMax: 0.3, 
      unite: "mg/kg", 
      resultat: "mg", 
      categorie: "hypnotique" },

  { nom: "Kétamine hypnotique", 
      doseMin: 1, 
      doseMax: 2, 
      unite: "mg/kg", 
      resultat: "mg", 
      categorie: "hypnotique" },
];

export default medicaments;