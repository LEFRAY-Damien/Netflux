import { defineStore } from "pinia";
import api from "@/api/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("jwt_token") || null,
    user: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const { data } = await api.post("/login", { email, password });

        this.token = data.token;
        localStorage.setItem("jwt_token", this.token);

        // Ajout du header Authorization pour toutes les requêtes futures
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (err) {
        throw new Error(err.response?.data?.message || "Erreur de connexion");
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("jwt_token");

      // Supprime le header
      delete api.defaults.headers.common['Authorization'];
    },
  },
});
