<!-- Navigation.vue -->

<script setup>
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
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

      <!--  MILIEU : (Vide pour garder l'espace) -->
      <ul class="navbar-nav me-auto"></ul>

      <!--  DROITE : Liens -->
      <ul class="navbar-nav ms-auto">

        <!-- UTILISATEUR NON CONNECTÉ -->
        <template v-if="!userStore.token">

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

          <li class="nav-item" v-if="userStore.user?.roles?.includes('ROLE_ADMIN')">
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

<style scoped></style>
