<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};

// ----------------------
// 🔍 Filtres
// ----------------------
const genres = ref([]);
const selectedFormat = ref("");
const selectedGenre = ref("");
const keyword = ref("");

// Charger genres au chargement de la navbar
onMounted(async () => {
  try {
    const res = await api.get("/genres");
    genres.value = res.data;
  } catch (e) {
    console.error("Erreur chargement genres :", e);
  }
});

// Appliquer les filtres
const applyFilters = () => {
  router.push({
    path: "/",
    query: {
      format: selectedFormat.value || undefined,
      genre: selectedGenre.value || undefined,
      search: keyword.value || undefined,
    }
  });
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">

    <router-link to="/" class="navbar-brand">Netflux</router-link>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">

      <!-- FILTRES -->
      <ul class="navbar-nav me-auto">

        <li class="nav-item d-flex align-items-center gap-2">

          <!-- Format -->
          <select v-model="selectedFormat" class="form-select form-select-sm" style="width: 120px;">
            <option value="">Tous</option>
            <option value="film">Films</option>
            <option value="serie">Séries</option>
          </select>

          <!-- Genre -->
          <select v-model="selectedGenre" class="form-select form-select-sm" style="width: 150px;">
            <option value="">Tous genres</option>
            <option v-for="g in genres" :key="g.id" :value="g.id">
              {{ g.nom }}
            </option>
          </select>

          <!-- Recherche -->
          <input v-model="keyword" type="text" class="form-control form-control-sm"
                 placeholder="Rechercher..." style="width: 150px;" />

          <!-- Bouton -->
          <button class="btn btn-primary btn-sm" @click="applyFilters">
            Filtrer
          </button>

        </li>

      </ul>

      <!-- BLOC DROITE (auth) -->
      <ul class="navbar-nav ms-auto">

        <template v-if="!authStore.token">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Connexion</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Inscription</router-link>
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Profil</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/favoris">Favoris</router-link>
          </li>
          <li class="nav-item" v-if="authStore.user?.roles?.includes('ROLE_ADMIN')">
            <router-link class="nav-link" to="/admin">Admin</router-link>
          </li>
          <li class="nav-item">
            <button class="btn btn-danger btn-sm ms-2" @click="logout">
              Déconnexion
            </button>
          </li>
        </template>

      </ul>

    </div>
  </nav>
</template>
