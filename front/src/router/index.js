import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

// Vues
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MovieListView from "@/views/MovieListView.vue";
import MovieDetailView from "@/views/MovieDetailView.vue";
import FavorisView from "@/views/FavorisView.vue";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";

const routes = [
  { path: "/", name: "movies", component: MovieListView },
  { path: "/contenu/:id", name: "movieDetail", component: MovieDetailView, props: true },

  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },

  { path: "/favoris", name: "favoris", component: FavorisView, meta: { requiresAuth: true } },

  { path: "/admin", name: "admin", component: AdminView, meta: { requiresAdmin: true } },

  { path: "/home", name: "home", component: HomeView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware Auth
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // Charger l'utilisateur si token présent mais user null
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  // Protection : nécessite d'être connecté
  if (to.meta.requiresAuth && !authStore.user) {
    return "/login";
  }

  // Protection Admin
  if (to.meta.requiresAdmin && !authStore.user?.roles?.includes("ROLE_ADMIN")) {
    return "/";
  }
});

export default router;
