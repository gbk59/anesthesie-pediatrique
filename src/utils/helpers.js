export function valeurManquante(...valeurs) {
  return valeurs.some(
    (v) => v === "" || v === null || v === undefined
  );
}

export function formatNombre(nombre) {
  return Number(nombre)
    .toFixed(2)
    .replace(".", ",")
    .replace(/,00$/, "")
    .replace(/,(\d)0$/, ",$1");
}

export function normaliserTexte(texte) {
  return String(texte || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

console.log("HELPERS OK");