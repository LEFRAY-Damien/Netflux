import { defineStore } from "pinia";
import api from "@/api/axios.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async fetchUser() {
      if (!this.token) return;

      try {
        const res = await api.get("/me", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.user = res.data;
      } catch (error) {
        console.error("Erreur fetchUser :", error);
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
      }
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
