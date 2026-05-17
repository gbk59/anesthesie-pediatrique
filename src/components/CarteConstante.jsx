import "../styles/carte-constante.css";

function CarteConstante({ titre, valeur }) {
  return (
    <div className="carte-constante">
      <h3 className="carte-constante-titre">
        {titre}
      </h3>

      <p className="carte-constante-valeur">
        {valeur}
      </p>
    </div>
  );
}

export default CarteConstante;