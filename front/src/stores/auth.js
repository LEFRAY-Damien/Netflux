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
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/login", {
          email,
          password,
        });

        const token = response.data.token;

        this.token = token;
        localStorage.setItem("token", token);

        await this.fetchUser();
      } catch (err) {
        this.error = "Identifiants incorrects";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      try {
        const response = await api.get("/me");
        this.user = response.data;
      } catch {
        this.user = null;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
  },
});
