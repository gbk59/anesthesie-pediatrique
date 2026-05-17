import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function cleFavori(type, key) {
  return `${type}:${key}`;
}

export function useFavoris(user) {
  const [favoris, setFavoris] = useState([]);
  const [chargementFavoris, setChargementFavoris] = useState(true);
  const [erreurFavoris, setErreurFavoris] = useState(null);

  const favorisSet = useMemo(() => {
    return new Set(favoris.map((favori) => cleFavori(favori.item_type, favori.item_key)));
  }, [favoris]);

  const chargerFavoris = useCallback(async () => {
    if (!user?.id) {
      setFavoris([]);
      setChargementFavoris(false);
      return;
    }

    setChargementFavoris(true);
    setErreurFavoris(null);

    const { data, error } = await supabase
      .from("user_favorites")
      .select("id, item_type, item_key, item_label, created_at, position")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement favoris", error);
      setErreurFavoris("Impossible de charger les favoris.");
      setFavoris([]);
    } else {
      setFavoris(data ?? []);
    }

    setChargementFavoris(false);
  }, [user?.id]);

  useEffect(() => {
    chargerFavoris();
  }, [chargerFavoris]);

  function estFavori(type, key) {
    return favorisSet.has(cleFavori(type, key));
  }

  async function ajouterFavori({ type, key, label }) {
    if (!user?.id) return;

    const nouveauFavori = {
      user_id: user.id,
      item_type: type,
      item_key: key,
      item_label: label,
      position: favoris.length,
    };

    const { data, error } = await supabase
      .from("user_favorites")
      .insert(nouveauFavori)
      .select("id, item_type, item_key, item_label, created_at, position")
      .single();

    if (error) {
      // 23505 = doublon sur la contrainte unique. Ce n'est pas grave ici.
      if (error.code !== "23505") {
        console.error("Erreur ajout favori", error);
        setErreurFavoris("Impossible d’ajouter ce favori.");
      }
      return;
    }

    setFavoris((favorisActuels) => [data, ...favorisActuels]);
  }

  async function retirerFavori(type, key) {
    if (!user?.id) return;

    const sauvegarde = favoris;
    setFavoris((favorisActuels) =>
      favorisActuels.filter(
        (favori) => !(favori.item_type === type && favori.item_key === key)
      )
    );

    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", type)
      .eq("item_key", key);

    if (error) {
      console.error("Erreur suppression favori", error);
      setErreurFavoris("Impossible de retirer ce favori.");
      setFavoris(sauvegarde);
    }
  }



  async function mettreAJourOrdre(nouveauxFavoris) {
    setFavoris(nouveauxFavoris);

    const updates = nouveauxFavoris.map((favori, index) =>
      supabase
        .from("user_favorites")
        .update({ position: index })
        .eq("id", favori.id)
    );

    const results = await Promise.all(updates);

    const erreur = results.find((result) => result.error);

    if (erreur?.error) {
      console.error("Erreur mise à jour ordre favoris", erreur.error);
      setErreurFavoris("Impossible de sauvegarder l’ordre des favoris.");
      chargerFavoris();
    }
  }

  async function basculerFavori({ type, key, label }) {
    if (estFavori(type, key)) {
      await retirerFavori(type, key);
    } else {
      await ajouterFavori({ type, key, label });
    }
  }

  return {
    favoris,
    chargementFavoris,
    erreurFavoris,
    estFavori,
    basculerFavori,
    rechargerFavoris: chargerFavoris,
    mettreAJourOrdre,
  };
}
