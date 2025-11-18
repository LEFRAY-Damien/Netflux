import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user.js";

// Vues
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MovieListView from "@/views/MovieListView.vue";
import MovieDetailView from "@/views/MovieDetailView.vue";
import FavorisView from "@/views/FavorisView.vue";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";

const routes = [
  // Page d'accueil affichant films + séries
  { path: "/", name: "movies", component: MovieListView },

  // Page détail d'un contenu (film ou série)
  {
    path: "/contenu/:id",
    name: "movieDetail",
    component: MovieDetailView,
    props: true,
  },

  // Login / Register
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },

  // Favoris
  {
    path: "/favoris",
    name: "favoris",
    component: FavorisView,
    meta: { requiresAuth: true },
  },

  // Espace admin
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { requiresAuth: true },
  },

  // Home interne (si tu l'utilises)
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
  const userStore = useUserStore();

  // Si token mais user non chargé → on récupère le profil
  if (userStore.token && !userStore.user) {
    await userStore.fetchUser();
  }

  // Si page protégée sans être connecté → redirection login
  if (to.meta.requiresAuth && !userStore.token) {
    return "/login";
  }
});

export default router;
