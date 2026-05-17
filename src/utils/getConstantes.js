export default function getConstantes(age, constantesPediatriques) {
  const ageNombre = Number(age || 1);

  return (
    constantesPediatriques.find(
      (ligne) =>
        ageNombre >= ligne.ageMin &&
        ageNombre <= ligne.ageMax
    ) || constantesPediatriques[0]
  );
}