<!-- Navigation.vue -->

<script setup>
import { useAuthStore } from "@/stores/auth";   // <-- CHANGÉ
import { useRouter } from "vue-router";

const authStore = useAuthStore();               // <-- CHANGÉ
const router = useRouter();

const logout = () => {
  authStore.logout();                           // <-- CHANGÉ
  router.push("/login");
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">

    <!--  GAUCHE : Logo -->
    <router-link to="/" class="navbar-brand">
      Netflux
    </router-link>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">

      <ul class="navbar-nav me-auto"></ul>

      <ul class="navbar-nav ms-auto">

        <!-- UTILISATEUR NON CONNECTÉ -->
        <template v-if="!authStore.token">

          <li class="nav-item">
            <router-link class="nav-link" to="/login">Connexion</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/register">Inscription</router-link>
          </li>

        </template>

        <!-- UTILISATEUR CONNECTÉ -->
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
            <button class="btn btn-danger btn-sm ms-2" @click="logout">Déconnexion</button>
          </li>

        </template>

      </ul>
    </div>
  </nav>
</template>
