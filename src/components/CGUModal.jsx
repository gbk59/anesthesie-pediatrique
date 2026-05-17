function CGUModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="cgu-modal-overlay" onClick={onClose}>
      <div className="cgu-modal" onClick={(event) => event.stopPropagation()}>
        <div className="cgu-modal-header">
          <h2>Mentions & conditions d’utilisation</h2>

          <button type="button" className="cgu-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cgu-modal-content">
          <section>
            <h3>Objet de l’application</h3>
            <p>
              L’application « Anesthésie Pédiatrique » est un outil d’aide à la
              pratique clinique destiné aux professionnels de santé.
            </p>
            <p>
              Elle fournit des informations indicatives, calculs, références et
              aides cognitives en anesthésie pédiatrique.
            </p>
          </section>

          <section>
            <h3>Limitation de responsabilité</h3>
            <p>
              Les informations fournies par l’application ne remplacent ni le
              jugement médical, ni les protocoles locaux, ni les recommandations
              institutionnelles en vigueur.
            </p>
            <p>
              L’utilisateur demeure seul responsable de la vérification des
              données, des posologies, des calculs et des décisions diagnostiques
              ou thérapeutiques.
            </p>
          </section>

          <section>
            <h3>Données personnelles</h3>
            <p>
              Aucune donnée patient n’est stockée sur les serveurs de
              l’application.
            </p>
            <p>
              Certaines données techniques anonymes d’utilisation peuvent être
              collectées à des fins statistiques et d’amélioration du service.
            </p>
          </section>

          <section>
            <h3>Utilisateurs concernés</h3>
            <p>
              L’application est destinée exclusivement aux professionnels de santé.
            </p>
          </section>

          <section>
            <h3>Disponibilité</h3>
            <p>
              L’éditeur ne garantit pas une disponibilité continue ou sans
              interruption de l’application.
            </p>
          </section>

          <section>
            <h3>Contact</h3>
            <p>
              Contact :{" "}
              <a href="mailto:anesthesie.pediatrique.app@gmail.com">
                anesthesie.pediatrique.app@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CGUModal;