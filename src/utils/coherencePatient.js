import constantesPediatriques from "../data/constantesPediatriques";

function extrairePlagePoids(textePoids) {
  const nombres = textePoids.match(/\d+(?:[.,]\d+)?/g)?.map((n) => Number(n.replace(",", ".")));

  if (!nombres?.length) return null;

  if (nombres.length === 1) {
    return { min: nombres[0], max: nombres[0] };
  }

  return { min: nombres[0], max: nombres[1] };
}

export function analyserCoherencePatient({ age, poids }) {
  const ageNombre = Number(age);
  const poidsNombre = Number(poids);

  if (!ageNombre || !poidsNombre) {
    return {
      niveau: "neutre",
      messages: [],
    };
  }

  const tranche = constantesPediatriques.find(
    (item) => ageNombre >= item.ageMin && ageNombre <= item.ageMax
  );

  if (!tranche) {
    return {
      niveau: "neutre",
      messages: [],
    };
  }

  const plagePoids = extrairePlagePoids(tranche.poids);

  if (!plagePoids) {
    return {
      niveau: "neutre",
      messages: [],
    };
  }

  const margeAttentionBasse = plagePoids.min * 0.7;
  const margeAttentionHaute = plagePoids.max * 1.35;

  const margeAlerteBasse = plagePoids.min * 0.5;
  const margeAlerteHaute = plagePoids.max * 1.75;

  if (poidsNombre < margeAlerteBasse || poidsNombre > margeAlerteHaute) {
    return {
      niveau: "alerte",
      messages: [
        `Poids très inhabituel pour ${tranche.tranche} — référence ${tranche.poids}. Vérifier la saisie.`,
      ],
    };
  }

  if (poidsNombre < margeAttentionBasse || poidsNombre > margeAttentionHaute) {
    return {
      niveau: "attention",
      messages: [
        `Poids inhabituel pour ${tranche.tranche} — référence ${tranche.poids}.`,
      ],
    };
  }

  return {
    niveau: "ok",
    messages: [],
  };
}