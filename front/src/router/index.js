// front/src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import { useUserStore } from "@/stores/user.js"; // ✅ import correct

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
  ],
});

// 🔐 Middleware de protection
router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.token) {
    return "/login";
  }
});

export default router;
