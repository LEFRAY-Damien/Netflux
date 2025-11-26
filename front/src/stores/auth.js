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
      if (!this.token) return;
      try {
        const res = await api.get("/me");
        this.favoris = (res.data.favoris || []).map(f => f.id);

        // 🧠 Sauvegarde ID dans localStorage
        localStorage.setItem("favoris", JSON.stringify(this.favoris));
      } catch {}
    },

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
      } catch {}
    },

    logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      this.favoris = [];
      localStorage.removeItem("token");
      localStorage.removeItem("favoris");
    }
  }
});
