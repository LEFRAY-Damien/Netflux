import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    favoris: [], // on ne l'utilise pas encore
  }),

  actions: {
    async register({ nom, prenom, email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/register", { nom, prenom, email, password });
        return res.data;
      } catch (err) {
        this.error = "Erreur inscription";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/login", { email, password });
        this.token = res.data.token;
        localStorage.setItem("token", this.token);
        await this.fetchUser();
      } catch {
        this.error = "Identifiants incorrects";
        throw new Error("LOGIN FAIL");
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.token) {
        this.user = null;
        return;
      }
      try {
        const res = await api.get("/me");
        this.user = res.data;
      } catch {
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      localStorage.removeItem("token");
    }
  }
});
