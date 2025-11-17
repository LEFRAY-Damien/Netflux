import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MovieListView from "@/views/MovieListView.vue";
import MovieDetailView from "@/views/MovieDetailView.vue"; // <-- Import du détail
import HomeView from "@/views/HomeView.vue";
import FavorisView from "@/views/FavorisView.vue";
import { useUserStore } from "@/stores/user.js";

const routes = [
  { path: "/", name: "movies", component: MovieListView },
  { path: "/movie/:id", name: "movieDetail", component: MovieDetailView, props: true }, // <-- Route détail
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/home", name: "home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/favoris", name: "favoris", component: FavorisView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard pour l'authentification
router.beforeEach(async (to) => {
  const userStore = useUserStore();

  if (userStore.token && !userStore.user) {
    await userStore.fetchUser();
  }

  if (to.meta.requiresAuth && !userStore.token) {
    return "/login";
  }
});

export default router;
