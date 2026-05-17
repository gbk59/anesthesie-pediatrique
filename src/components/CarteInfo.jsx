import "../styles/carte-info.css";

function CarteInfo({ titre, texte }) {
  return (
    <div className="carte-info">
      <h3 className="carte-info-titre">
        {titre}
      </h3>

      <p className="carte-info-texte">
        {texte}
      </p>
    </div>
  );
}

export default CarteInfo;