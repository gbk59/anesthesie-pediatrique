import CarteResultat from "./CarteResultat";
import FlaccItem from "./FlaccItem";
import FavoriButton from "./FavoriButton";
import { normaliserTexte } from "../utils/helpers";

export default function SSPISection({
  sousOngletSSPI,
  couleursOnglets,
  scoreFlacc,

  flaccVisage,
  setFlaccVisage,

  flaccJambes,
  setFlaccJambes,

  flaccActivite,
  setFlaccActivite,

  flaccCris,
  setFlaccCris,

  flaccConsolabilite,
  setFlaccConsolabilite,

  analgesieSSPI,
  nvpoSSPI,
  recherche,
  poids,
  valeurManquante,
  formatNombre,
  estFavori,
  basculerFavori,
  onResetFlacc,
}) {
  return (
    <>
      {sousOngletSSPI === "douleur" && (
        <div
          style={{
            background: couleursOnglets.sspi.fond,
            borderLeft: `6px solid ${couleursOnglets.sspi.bordure}`,
            padding: 10,
            borderRadius: 16,
            marginBottom: 14,
            boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
            color: "#111827",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: 22,
              marginBottom: 10,
              marginTop: 0,
              color: "#111827",
            }}
          >
            Échelle FLACC
          </h2>

          <FlaccItem
            titre="Visage"
            valeur={flaccVisage}
            setValeur={setFlaccVisage}
            labels={[
              "Sourire / neutre",
              "Grimace occasionnelle",
              "Menton tremblant / mâchoire serrée",
            ]}
          />

          <FlaccItem
            titre="Jambes"
            valeur={flaccJambes}
            setValeur={setFlaccJambes}
            labels={[
              "Position normale",
              "Mal à l'aise / agité",
              "Recroquevillé / coups de pied",
            ]}
          />

          <FlaccItem
            titre="Activité"
            valeur={flaccActivite}
            setValeur={setFlaccActivite}
            labels={[
              "Calme",
              "Se tortille",
              "Arc-bouté / raide",
            ]}
          />

          <FlaccItem
            titre="Cris"
            valeur={flaccCris}
            setValeur={setFlaccCris}
            labels={[
              "Pas de cri",
              "Gémissements",
              "Pleurs constants / cris",
            ]}
          />

          <FlaccItem
            titre="Consolabilité"
            valeur={flaccConsolabilite}
            setValeur={setFlaccConsolabilite}
            labels={[
              "Content / détendu",
              "Rassuré par contact",
              "Difficile à consoler",
            ]}
          />

          <button
            type="button"
            onClick={onResetFlacc}
            className="flacc-reset-button"
          >
            ↻ Réinitialiser le score FLACC
          </button>

          <div
            style={{
              marginTop: 12,
              padding: 18,
              borderRadius: 16,
              textAlign: "center",
              background:
                scoreFlacc <= 3
                  ? "#b2f2bb"
                  : scoreFlacc <= 6
                  ? "#ffe066"
                  : "#ff8787",
            }}
          >
            <h3 style={{ fontSize: 22, marginBottom: 8 }}>
              Score FLACC
            </h3>

            <p
              style={{
                fontSize: 36,
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {scoreFlacc} / 10
            </p>

            <p style={{ fontSize: 18, marginTop: 8 }}>
              {scoreFlacc <= 3 &&
                "Douleur absente à légère"}

              {scoreFlacc >= 4 &&
                scoreFlacc <= 6 &&
                "Douleur modérée"}

              {scoreFlacc >= 7 &&
                "Douleur sévère"}
            </p>
          </div>
        </div>
      )}

      {sousOngletSSPI === "analgesie" && (
        <>
          {analgesieSSPI
            .filter((medicament) =>
              normaliserTexte(medicament.nom).includes(normaliserTexte(recherche))
            )
            .map((medicament) => (
              <CarteResultat
                key={medicament.nom}
                titre={medicament.nom}
                description={medicament.dose}
                valeur={
                  valeurManquante(poids)
                    ? "Renseigner le poids"
                    : medicament.resultat(
                        Number(poids),
                        formatNombre
                      )
                }
                fond={medicament.couleur}
                bordure={couleursOnglets.sspi.bordure}
                action={
                  <FavoriButton
                    actif={estFavori?.("sspi-analgesie", medicament.nom)}
                    onClick={() =>
                      basculerFavori?.({
                        type: "sspi-analgesie",
                        key: medicament.nom,
                        label: `SSPI Analgésie — ${medicament.nom}`,
                      })
                    }
                  />
                }
              />
            ))}
        </>
      )}

      {sousOngletSSPI === "nvpo" && (
        <>
          {nvpoSSPI
            .filter((medicament) =>
              normaliserTexte(medicament.nom).includes(normaliserTexte(recherche))
            )
            .map((medicament) => (
              <CarteResultat
                key={medicament.nom}
                titre={medicament.nom}
                description={medicament.dose}
                valeur={
                  valeurManquante(poids)
                    ? "Renseigner le poids"
                    : medicament.resultat(
                        Number(poids),
                        formatNombre
                      )
                }
                fond={medicament.couleur}
                info={medicament.info}
                bordure={couleursOnglets.sspi.bordure}
                action={
                  <FavoriButton
                    actif={estFavori?.("sspi-nvpo", medicament.nom)}
                    onClick={() =>
                      basculerFavori?.({
                        type: "sspi-nvpo",
                        key: medicament.nom,
                        label: `SSPI NVPO — ${medicament.nom}`,
                      })
                    }
                  />
                }
              />
            ))}
        </>
      )}
    </>
  );
}
