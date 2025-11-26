<!-- Navbar.vue -->
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Variables des filtres principaux
const selectedFormat = ref(route.query.format || "");
const keyword = ref(route.query.search || "");
const favLoading = ref(null);

// Action retour accueil après logout
const logout = () => {
  authStore.logout();
  router.push("/");
};

// ✅ Mise à jour de l’URL pour le filtre format
watch(selectedFormat, (value) => {
  router.replace({
    path: "/",
    query: {
      ...route.query,
      format: value || undefined
    }
  });
});

// ✅ Mise à jour de l’URL pour la recherche
watch(keyword, (value) => {
  router.replace({
    path: "/",
    query: {
      ...route.query,
      search: value || undefined
    }
  });
});

// Charger les genres (pas utilisé encore, mais on laisse le fetch pour après)
onMounted(async () => {
  try {
    const res = await api.get("/genres");
    const list = res.data.member ?? [];
    console.log("✅ Genres reçus :", list.length);
  } catch (e) {
    console.error("❌ Erreur genres :", e);
  }
});
</script>

<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
  <!-- Logo / nom app -->
  <router-link to="/" class="navbar-brand">Netflux</router-link>

  <!-- Bouton mobile -->
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
    <span class="navbar-toggler-icon"></span>
  </button>

  <!-- Contenu nav -->
  <div class="collapse navbar-collapse" id="navbarNav">

    <!-- 🎯 FILTRES A GAUCHE : format + recherche -->
    <ul class="navbar-nav me-auto">
      <li class="nav-item d-flex align-items-center gap-2">
        <!-- Format film/serie -->
        <select v-model="selectedFormat" class="form-select form-select-sm" style="width:120px;">
          <option value="">Tous</option>
          <option value="film">Films</option>
          <option value="serie">Séries</option>
        </select>

        <!-- Recherche par titre -->
        <input
          v-model="keyword"
          type="text"
          class="form-control form-control-sm"
          placeholder="Rechercher..."
          style="width:150px;"
        />
      </li>
    </ul>

    <!-- 🔑 AUTH A DROITE : navigation utilisateur + favoris + admin si role -->
    <ul class="navbar-nav ms-auto">
      <template v-if="!authStore.token">
        <li class="nav-item"><router-link class="nav-link" to="/login">Connexion</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/register">Inscription</router-link></li>
      </template>

      <template v-else>
        <li class="nav-item"><router-link class="nav-link" to="/home">Profil</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/favoris">Favoris</router-link></li>

        <li class="nav-item" v-if="authStore.user?.roles?.includes('ROLE_ADMIN')">
          <router-link class="nav-link" to="/admin">Admin</router-link>
        </li>

        <li class="nav-item">
          <button class="btn btn-danger btn-sm ms-2" @click="logout">Déconnexion</button>
        </li>
      </template>
    </ul>

  </div>
</nav>
</template>
