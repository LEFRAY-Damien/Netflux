import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    favoris: JSON.parse(localStorage.getItem("favoris") || "[]"), // ⭐ IDs favoris persistés
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await api.post("/login", { email, password });
        const token = res.data.token;
        this.token = token;
        localStorage.setItem("token", token);
        await this.fetchUser();
        await this.fetchFavoris();
      } catch (e) {
        this.logout();
        throw e;
      }
    },

    async fetchUser() {
      if (!this.token) return this.user = null;
      try {
        const res = await api.get("/me");
        this.user = res.data;
      } catch {
        this.logout();
      }
    },

    async fetchFavoris() {
      if (!this.token) {
        this.favoris = [];
        localStorage.setItem("favoris", "[]");
        return;
      }

      try {
        const res = await api.get("/me", {
          headers: { Authorization: "Bearer " + this.token }
        });

        console.log("🎯 JSON API /me :", res.data);

        // ✅ Lire les IDs depuis res.data.favoris directement
        const ids = res.data.favoris || [];

        this.favoris = ids;
        localStorage.setItem("favoris", JSON.stringify(ids));

        console.log("✅ IDs favoris persistés :", ids);
      } catch (e) {
        console.error("❌ erreur fetchFavoris :", e);
        this.favoris = [];
        localStorage.setItem("favoris", "[]");
      }
    }
    ,


    async toggleFavori(id) {
      if (!this.token) return alert("Connecte-toi !");
      try {
        const res = await api.post(`/contenus/${id}/favori`);

        if (res.data.favori) {
          if (!this.favoris.includes(id)) this.favoris.push(id);
        } else {
          this.favoris = this.favoris.filter(f => f !== id);
        }

        // ⭐ Persistance mise à jour
        localStorage.setItem("favoris", JSON.stringify(this.favoris));
      } catch { }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.error = null;

      localStorage.removeItem("token");
      localStorage.setItem("favoris", JSON.stringify(this.favoris));

      // 🔥 Envoyer un event personnalisé pour dire au composant liste de restaurer l’icône ⭐
      window.dispatchEvent(new CustomEvent("auth:logout"));

      console.log("🚪 Logout → IDs conservés :", this.favoris);
    }

  }
});
