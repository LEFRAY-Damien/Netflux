// src/api/axios.js
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// 🔒 Intercepteur : ajoute automatiquement le token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔒 Intercepteur réponse : logout si token expiré
api.interceptors.response.use(
  (res) => res,

  (err) => {
    if (err.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
    }

    return Promise.reject(err);
  }
);

export default api;
