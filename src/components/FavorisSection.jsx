import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CarteLien from "./CarteLien";
import CarteResultat from "./CarteResultat";
import FavoriButton from "./FavoriButton";
import { normaliserTexte } from "../utils/helpers";

const PREFIX_CATEGORIE = "categorie:";
const PREFIX_FAVORI = "favori:";
const STORAGE_ORDRE_CATEGORIES = "favoris_ordre_categories_v1";

const LABELS_CATEGORIES = {
  drug: "Drogues",
  aide: "Aides",
  hydro: "Hydro",
  ventilation: "Ventilation",
  respirateur: "Respirateur",
  "sspi-analgesie": "SSPI Analgésie",
  "sspi-nvpo": "SSPI NVPO",
};

function idCategorie(categorie) {
  return `${PREFIX_CATEGORIE}${categorie}`;
}

function idFavori(favori) {
  return `${PREFIX_FAVORI}${favori.id}`;
}

function extraireCategorieDepuisId(id) {
  return String(id).replace(PREFIX_CATEGORIE, "");
}

function extraireFavoriDepuisId(id) {
  return String(id).replace(PREFIX_FAVORI, "");
}

function retrouverDrogue(favori, medicaments) {
  return medicaments.find((medicament) => medicament.nom === favori.item_key);
}

function retrouverAide(favori, aidesCognitives) {
  return aidesCognitives.find(
    (aide) => aide.nom === favori.item_key || aide.fichier === favori.item_key
  );
}

function retrouverParNom(favori, liste) {
  return liste.find((item) => item.nom === favori.item_key);
}

function SortableCarte({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: "favori" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function connecterRefs(node) {
    setNodeRef(node);
    setActivatorNodeRef(node);
  }

  return (
    <div
      ref={connecterRefs}
      style={style}
      className={`favori-sortable-card ${isDragging ? "is-dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="favori-card-content">{children}</div>
    </div>
  );
}

function SortableCategorie({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: "categorie" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return children({
    setNodeRef,
    setActivatorNodeRef,
    style,
    attributes,
    listeners,
    isDragging,
  });
}

function HeaderCategorie({
  categorie,
  estFermee,
  onToggle,
  dragAttributes,
  dragListeners,
  dragActivatorRef,
}) {
  return (
    <div className="favori-category-header">
      <button
        type="button"
        ref={dragActivatorRef}
        className="favori-category-drag-handle"
        aria-label={`Déplacer la catégorie ${LABELS_CATEGORIES[categorie] || categorie}`}
        {...dragAttributes}
        {...dragListeners}
      >
        ⋮⋮
      </button>

      <button type="button" onClick={onToggle} className="favori-category-toggle">
        <span className="favori-category-title">{LABELS_CATEGORIES[categorie] || categorie}</span>
        <span className="favori-category-chevron" aria-hidden="true">
          {estFermee ? "▸" : "▾"}
        </span>
      </button>
    </div>
  );
}

export default function FavorisSection({
  favoris,
  chargementFavoris,
  erreurFavoris,
  recherche,
  medicaments,
  aidesCognitives,
  ventilationData,
  respirateurData,
  analgesieSSPI,
  nvpoSSPI,
  couleursOnglets,
  categories,
  poids,
  age,
  valeurManquante,
  formatNombre,
  setPdfOuvert,
  basculerFavori,
  mettreAJourOrdre,
}) {
  const [categoriesFermees, setCategoriesFermees] = useState({});
  const [ordreCategories, setOrdreCategories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_ORDRE_CATEGORIES) || "[]");
    } catch {
      return [];
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const favorisFiltres = useMemo(() => {
    return favoris.filter((favori) =>
      normaliserTexte(favori.item_label).includes(normaliserTexte(recherche))
    );
  }, [favoris, recherche]);

  const favorisGroupes = useMemo(() => {
    return favorisFiltres.reduce((acc, favori) => {
      if (!acc[favori.item_type]) acc[favori.item_type] = [];
      acc[favori.item_type].push(favori);
      return acc;
    }, {});
  }, [favorisFiltres]);

  const categoriesDisponibles = useMemo(() => Object.keys(favorisGroupes), [favorisGroupes]);

  const categoriesTriees = useMemo(() => {
    const categoriesConnues = ordreCategories.filter((categorie) =>
      categoriesDisponibles.includes(categorie)
    );
    const nouvellesCategories = categoriesDisponibles.filter(
      (categorie) => !categoriesConnues.includes(categorie)
    );
    return [...categoriesConnues, ...nouvellesCategories];
  }, [categoriesDisponibles, ordreCategories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ORDRE_CATEGORIES, JSON.stringify(categoriesTriees));
  }, [categoriesTriees]);

  function basculerCategorie(categorie) {
    setCategoriesFermees((etatActuel) => ({
      ...etatActuel,
      [categorie]: !etatActuel[categorie],
    }));
  }

  function gererDebutDrag(event) {
    const activeId = String(event.active.id);
    const typeActif = event.active.data.current?.type;

    if (typeActif === "categorie" || activeId.startsWith(PREFIX_CATEGORIE)) {
      const toutesFermees = {};

      categoriesTriees.forEach((categorie) => {
        toutesFermees[categorie] = true;
      });

      setCategoriesFermees(toutesFermees);
    }
  }

  async function gererDragCategorie(activeId, overId) {
    const categorieActive = extraireCategorieDepuisId(activeId);
    const categorieSurvolee = extraireCategorieDepuisId(overId);

    const oldIndex = categoriesTriees.indexOf(categorieActive);
    const newIndex = categoriesTriees.indexOf(categorieSurvolee);

    if (oldIndex === -1 || newIndex === -1) return;

    setOrdreCategories(arrayMove(categoriesTriees, oldIndex, newIndex));
  }

  async function gererDragFavori(activeId, overId) {
    const favoriActifId = extraireFavoriDepuisId(activeId);
    const favoriSurvoleId = extraireFavoriDepuisId(overId);

    const favoriActif = favoris.find((favori) => String(favori.id) === favoriActifId);
    const favoriSurvole = favoris.find((favori) => String(favori.id) === favoriSurvoleId);

    if (!favoriActif || !favoriSurvole) return;
    if (favoriActif.item_type !== favoriSurvole.item_type) return;

    const favorisCategorie = favoris.filter(
      (favori) => favori.item_type === favoriActif.item_type
    );

    const oldIndex = favorisCategorie.findIndex((favori) => favori.id === favoriActif.id);
    const newIndex = favorisCategorie.findIndex((favori) => favori.id === favoriSurvole.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const categorieReordonnee = arrayMove(favorisCategorie, oldIndex, newIndex);
    let indexCategorie = 0;

    const nouvelOrdreGlobal = favoris.map((favori) => {
      if (favori.item_type !== favoriActif.item_type) return favori;
      const favoriRemplace = categorieReordonnee[indexCategorie];
      indexCategorie += 1;
      return favoriRemplace;
    });

    await mettreAJourOrdre(nouvelOrdreGlobal);
  }

  async function gererFinDrag(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const typeActif = active.data.current?.type;
    const typeSurvole = over.data.current?.type;

    if (
      (typeActif === "categorie" || activeId.startsWith(PREFIX_CATEGORIE)) &&
      (typeSurvole === "categorie" || overId.startsWith(PREFIX_CATEGORIE))
    ) {
      await gererDragCategorie(activeId, overId);
      return;
    }

    if (
      (typeActif === "favori" || activeId.startsWith(PREFIX_FAVORI)) &&
      (typeSurvole === "favori" || overId.startsWith(PREFIX_FAVORI))
    ) {
      await gererDragFavori(activeId, overId);
    }
  }

  function renderFavori(favori) {
    if (favori.item_type === "drug") {
      const medicament = retrouverDrogue(favori, medicaments);
      if (!medicament) return null;

      const styleCategorie = categories[medicament.categorie];
      const calculImpossible = valeurManquante(poids);
      const doseMin = calculImpossible ? null : Number(poids) * medicament.doseMin;
      const doseMax = calculImpossible ? null : Number(poids) * medicament.doseMax;
      const doseAffichee = calculImpossible
        ? "Renseigner le poids"
        : medicament.doseMin === medicament.doseMax
        ? `${formatNombre(doseMin)} ${medicament.resultat}`
        : `${formatNombre(doseMin)} à ${formatNombre(doseMax)} ${medicament.resultat}`;

      return (
        <CarteResultat
          titre={medicament.nom}
          description={
            medicament.doseMin === medicament.doseMax
              ? `${medicament.doseMin} ${medicament.unite}`
              : `${medicament.doseMin} – ${medicament.doseMax} ${medicament.unite}`
          }
          valeur={`Dose : ${doseAffichee}`}
          fond={styleCategorie.couleur}
          texte={styleCategorie.texte}
          bordure="#212529"
          action={
            <FavoriButton
              actif={true}
              onClick={() =>
                basculerFavori({ type: "drug", key: medicament.nom, label: medicament.nom })
              }
            />
          }
        />
      );
    }

    if (favori.item_type === "aide") {
      const aide = retrouverAide(favori, aidesCognitives);
      if (!aide) return null;

      return (
        <CarteLien
          titre={aide.nom}
          bouton="Ouvrir le PDF"
          onClick={() => setPdfOuvert(aide.fichier)}
          action={
            <FavoriButton
              actif={true}
              onClick={() => basculerFavori({ type: "aide", key: aide.fichier, label: aide.nom })}
            />
          }
        />
      );
    }

    if (favori.item_type === "hydro") {
      if (favori.item_key === "apports-base") {
        return (
          <CarteResultat
            titre="Apports de base"
            description="Règle 4 - 2 - 1"
            valeur={
              valeurManquante(poids)
                ? "Renseigner le poids"
                : poids <= 10
                ? `${formatNombre(poids * 4)} mL/h`
                : poids <= 20
                ? `${formatNombre(40 + (poids - 10) * 2)} mL/h`
                : `${formatNombre(60 + (poids - 20))} mL/h`
            }
            fond={couleursOnglets.hydro.fond}
            bordure={couleursOnglets.hydro.bordure}
            action={
              <FavoriButton
                actif={true}
                onClick={() =>
                  basculerFavori({
                    type: "hydro",
                    key: "apports-base",
                    label: "Apports de base",
                  })
                }
              />
            }
          />
        );
      }

      if (favori.item_key === "compensation-jeune") {
        return (
          <CarteResultat
            titre="Compensation du jeûne"
            description={age < 3 ? "Première heure : 25 mL/kg" : "Première heure : 15 mL/kg"}
            valeur={
              valeurManquante(poids)
                ? "Renseigner le poids"
                : age < 3
                ? `${formatNombre(poids * 25)} mL`
                : `${formatNombre(poids * 15)} mL`
            }
            fond={couleursOnglets.hydro.fond}
            bordure={couleursOnglets.hydro.bordure}
            action={
              <FavoriButton
                actif={true}
                onClick={() =>
                  basculerFavori({
                    type: "hydro",
                    key: "compensation-jeune",
                    label: "Compensation du jeûne",
                  })
                }
              />
            }
          />
        );
      }

      return null;
    }

    if (favori.item_type === "ventilation") {
      const item = retrouverParNom(favori, ventilationData);
      if (!item) return null;

      return (
        <CarteResultat
          titre={item.nom}
          valeur={
            valeurManquante(age, poids)
              ? "Renseigner âge et poids"
              : item.resultat(Number(age), Number(poids), formatNombre)
          }
          fond={couleursOnglets.ventilation.fond}
          bordure={couleursOnglets.ventilation.bordure}
          action={
            <FavoriButton
              actif={true}
              onClick={() => basculerFavori({ type: "ventilation", key: item.nom, label: item.nom })}
            />
          }
        />
      );
    }

    if (favori.item_type === "respirateur") {
      const item = retrouverParNom(favori, respirateurData);
      if (!item) return null;

      return (
        <CarteResultat
          titre={item.nom}
          description={item.description}
          valeur={
            valeurManquante(age, poids)
              ? "Renseigner âge et poids"
              : item.resultat(Number(age), Number(poids), formatNombre)
          }
          fond={couleursOnglets.respirateur.fond}
          bordure={couleursOnglets.respirateur.bordure}
          action={
            <FavoriButton
              actif={true}
              onClick={() => basculerFavori({ type: "respirateur", key: item.nom, label: item.nom })}
            />
          }
        />
      );
    }

    if (favori.item_type === "sspi-analgesie") {
      const medicament = retrouverParNom(favori, analgesieSSPI);
      if (!medicament) return null;

      return (
        <CarteResultat
          titre={medicament.nom}
          description={medicament.dose}
          valeur={
            valeurManquante(poids)
              ? "Renseigner le poids"
              : medicament.resultat(Number(poids), formatNombre)
          }
          fond={medicament.couleur}
          bordure={couleursOnglets.sspi.bordure}
          action={
            <FavoriButton
              actif={true}
              onClick={() =>
                basculerFavori({
                  type: "sspi-analgesie",
                  key: medicament.nom,
                  label: `SSPI Analgésie — ${medicament.nom}`,
                })
              }
            />
          }
        />
      );
    }

    if (favori.item_type === "sspi-nvpo") {
      const medicament = retrouverParNom(favori, nvpoSSPI);
      if (!medicament) return null;

      return (
        <CarteResultat
          titre={medicament.nom}
          description={medicament.dose}
          valeur={
            valeurManquante(poids)
              ? "Renseigner le poids"
              : medicament.resultat(Number(poids), formatNombre)
          }
          fond={medicament.couleur}
          info={medicament.info}
          bordure={couleursOnglets.sspi.bordure}
          action={
            <FavoriButton
              actif={true}
              onClick={() =>
                basculerFavori({
                  type: "sspi-nvpo",
                  key: medicament.nom,
                  label: `SSPI NVPO — ${medicament.nom}`,
                })
              }
            />
          }
        />
      );
    }

    return null;
  }

  if (chargementFavoris) {
    return <p className="favoris-message">Chargement des favoris…</p>;
  }

  if (erreurFavoris) {
    return <p className="favoris-message favoris-erreur">{erreurFavoris}</p>;
  }

  if (favoris.length === 0) {
    return (
      <div className="favoris-empty">
        <div className="favoris-empty-icon">★</div>
        <h2>Aucun favori pour le moment</h2>
        <p>Ajoute une carte avec l’étoile pour la retrouver ici rapidement.</p>
      </div>
    );
  }

  if (favorisFiltres.length === 0) {
    return <p className="favoris-message">Aucun favori ne correspond à cette recherche.</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={gererDebutDrag}
      onDragEnd={gererFinDrag}
    >
      <SortableContext
        items={categoriesTriees.map(idCategorie)}
        strategy={verticalListSortingStrategy}
      >
        {categoriesTriees.map((categorie) => {
          const favorisCategorie = favorisGroupes[categorie] ?? [];
          const categorieFermee = Boolean(categoriesFermees[categorie]);

          return (
            <section key={categorie} className="favori-category-section">
              <SortableCategorie id={idCategorie(categorie)}>
                {({
                  setNodeRef,
                  setActivatorNodeRef,
                  style,
                  attributes,
                  listeners,
                  isDragging,
                }) => (
                  <div
                    ref={setNodeRef}
                    style={style}
                    className={isDragging ? "is-dragging" : ""}
                  >
                    <HeaderCategorie
                      categorie={categorie}
                      estFermee={categorieFermee}
                      onToggle={() => basculerCategorie(categorie)}
                      dragAttributes={attributes}
                      dragListeners={listeners}
                      dragActivatorRef={setActivatorNodeRef}
                    />
                  </div>
                )}
              </SortableCategorie>

              {!categorieFermee && (
                <SortableContext
                  items={favorisCategorie.map(idFavori)}
                  strategy={verticalListSortingStrategy}
                >
                  {favorisCategorie.map((favori) => {
                    const contenu = renderFavori(favori);

                    if (!contenu) return null;

                    return (
                      <SortableCarte key={favori.id} id={idFavori(favori)}>
                        {contenu}
                      </SortableCarte>
                    );
                  })}
                </SortableContext>
              )}
            </section>
          );
        })}
      </SortableContext>
    </DndContext>
  );
}