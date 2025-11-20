import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "./user";

export const useFavorisStore = defineStore("favoris", {
  state: () => ({
    favoris: [],
  }),

  actions: {
    async fetchFavoris() {
      const userStore = useUserStore();

      if (!userStore.token) return;

      try {
        const res = await axios.get("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        this.favoris = res.data.favori ?? [];
      } catch (e) {
        console.error("Erreur fetch favoris :", e);
      }
    },

    async toggleFavori(contenuId) {
      const userStore = useUserStore();

      try {
        const res = await axios.post(
          `http://localhost:8000/api/contenus/${contenuId}/favori`,
          {},
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        if (res.data.favori) {
          // Ajouter
          this.favoris.push(contenuId);
        } else {
          // Retirer
          this.favoris = this.favoris.filter((id) => id !== contenuId);
        }
      } catch (e) {
        console.error("Erreur toggle favori :", e);
      }
    },

    isFavori(id) {
      return this.favoris.includes(id);
    },
  },
});
