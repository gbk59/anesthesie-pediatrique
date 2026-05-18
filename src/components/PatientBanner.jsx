import "../styles/patient-banner.css";

function PatientBanner({ age, poids, coherencePatient }) {
  return (
    <div className="patient-banner">
      <div className="patient-banner-infos">
        <span className="patient-banner-avatar" aria-hidden="true">
          👶
        </span>

        <span className="patient-banner-label">Patient</span>

        <div className="patient-banner-badges">
          <span className="patient-banner-badge">{age} ans</span>
          <span className="patient-banner-badge">{poids} kg</span>
        </div>
      </div>

      {coherencePatient?.niveau !== "ok" &&
        coherencePatient?.niveau !== "neutre" && (
          <div
            className={`patient-banner-coherence patient-banner-coherence-${coherencePatient.niveau}`}
          >
            {coherencePatient.messages[0]}
          </div>
        )}
    </div>
  );
}

export default PatientBanner;