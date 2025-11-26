// src/api/axios.js
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Routes accessibles sans token
const PUBLIC_ROUTES = [
  "/contenus",
  "/genres",
];

// Intercepteur pour ajouter le token sauf routes publiques
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    // On enlève les paramètres éventuels /contenus?page=1 → /contenus
    const cleanUrl = config.url.split("?")[0];

    const isPublic = PUBLIC_ROUTES.includes(cleanUrl);

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Déconnexion auto si 401
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
