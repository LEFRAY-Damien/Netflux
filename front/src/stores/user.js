import { defineStore } from "pinia";
import api from "@/api/axios";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    token: localStorage.getItem("jwt_token") || null, // ← récupère le token au démarrage
  }),

  actions: {
    async login(credentials) {
      const response = await api.post("/login", credentials);

      // 1️⃣ On récupère le token du backend
      this.token = response.data.token;

      // 2️⃣ On sauvegarde dans localStorage (persistant)
      localStorage.setItem("jwt_token", this.token);

      // 3️⃣ On ajoute le token aux headers Axios
      api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

      // 4️⃣ On récupère l'utilisateur connecté
      const me = await api.get("/me");
      this.user = me.data;
    },

    async fetchUser() {
      // Appelé au démarrage si un token existe
      if (!this.token) return;

      api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

      try {
        const { data } = await api.get("/me");
        this.user = data;
      } catch (error) {
        console.error("Token invalide, suppression.", error);
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("jwt_token");
      delete api.defaults.headers.common["Authorization"];
    },
  },
});
