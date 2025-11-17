// front/src/stores/user.js
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

        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        // Après login, récupérer les infos utilisateur
        await this.fetchUser();
      } catch (err) {
        throw new Error(err.response?.data?.message || "Erreur de connexion");
      }
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        const { data } = await api.get("/me");
        this.user = data;
      } catch (err) {
        console.error("Impossible de récupérer l'utilisateur :", err);
      }
    },


    async register(payload) {
      try {
        await api.post("/register", payload);
      } catch (err) {
        throw new Error(err.response?.data?.message || "Erreur lors de l'inscription");
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("jwt_token");

      delete api.defaults.headers.common["Authorization"];
    },

    async fetchUser() {
      try {
        const { data } = await api.get("/me"); // <-- endpoint backend pour récupérer l'utilisateur connecté
        this.user = data;
      } catch (err) {
        console.error("Impossible de récupérer l'utilisateur :", err);
      }
    },
  },
});
