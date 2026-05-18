import "../styles/patient-banner.css";

function PatientBanner({ age, poids }) {
  return (
    <div className="patient-banner">
      <div className="patient-banner-infos">
        <span className="patient-banner-avatar" aria-hidden="true">👶</span>
        <span className="patient-banner-label">Patient</span>

        <div className="patient-banner-badges">
          <span className="patient-banner-badge">{age} ans</span>
          <span className="patient-banner-badge">{poids} kg</span>
        </div>
      </div>
    </div>
  );
}

export default PatientBanner;