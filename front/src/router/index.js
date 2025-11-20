import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";  // <-- CHANGÉ

// Vues
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MovieListView from "@/views/MovieListView.vue";
import MovieDetailView from "@/views/MovieDetailView.vue";
import FavorisView from "@/views/FavorisView.vue";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";

const routes = [
  // Page d'accueil
  { path: "/", name: "movies", component: MovieListView },

  // Détail contenu
  {
    path: "/contenu/:id",
    name: "movieDetail",
    component: MovieDetailView,
    props: true,
  },

  // Auth
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },

  // Favoris
  {
    path: "/favoris",
    name: "favoris",
    component: FavorisView,
    meta: { requiresAuth: true },
  },

  // Admin
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { requiresAdmin: true },
  },

  // Profil
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware Auth
router.beforeEach(async (to) => {
  const authStore = useAuthStore();  // <-- CHANGÉ

  // Si on a un token mais pas encore le user → on récupère /api/me
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  // Protection : utilisateur non connecté
  if (to.meta.requiresAuth && !authStore.token) {
    return "/login";
  }

  // Protection admin
  if (to.meta.requiresAdmin && !authStore.user?.roles?.includes("ROLE_ADMIN")) {
    return "/";
  }
});

export default router;
