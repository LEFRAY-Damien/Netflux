// src/stores/auth.js
import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  }),

  actions: {
    //--------------------------------
    // 🔐 INSCRIPTION
    //--------------------------------
    async register({ nom, prenom, email, password }) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/register", {
          nom,
          prenom,
          email,
          password,
        });

        return res.data;
      } catch (err) {
        console.error("Erreur inscription :", err.response?.data || err);
        throw new Error(
          err.response?.data?.message ||
            "Erreur lors de l'inscription."
        );
      } finally {
        this.loading = false;
      }
    },

    //--------------------------------
    // 🔑 LOGIN (JWT)
    //--------------------------------
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/login", { email, password });

        const token = response.data.token;

        this.token = token;
        localStorage.setItem("token", token);

        // Charger l'utilisateur connecté
        await this.fetchUser();
      } catch (err) {
        console.error("Erreur login :", err.response?.data || err);
        this.error = "Identifiants incorrects";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    //--------------------------------
    // 👤 RECUPERATION DE L'UTILISATEUR CONNECTÉ
    //--------------------------------
    async fetchUser() {
      if (!this.token) {
        this.user = null;
        return;
      }

      try {
        // Aucun header → Axios met automatiquement Authorization
        const response = await api.get("/me");

        this.user = response.data;
      } catch (err) {
        console.error("Erreur fetchUser :", err.response?.data || err);

        // Token expiré ou invalide
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
      }
    },

    //--------------------------------
    // 🚪 DECONNEXION
    //--------------------------------
    logout() {
      this.user = null;
      this.token = null;
      this.error = null;

      localStorage.removeItem("token");
    },
  },
});
