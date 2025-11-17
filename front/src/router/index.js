import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MovieListView from "@/views/MovieListView.vue"; // Page publique
import HomeView from "@/views/HomeView.vue"; // Page profil/utilisateur
import { useUserStore } from "@/stores/user.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "movies", component: MovieListView }, // Page publique
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
    { path: "/home", name: "home", component: HomeView, meta: { requiresAuth: true } }, // Profil utilisateur
  ],
});

// Middleware pour protéger les routes nécessitant une connexion
router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.token) {
    return "/login"; // redirige vers login si pas connecté
  }
});

export default router;
