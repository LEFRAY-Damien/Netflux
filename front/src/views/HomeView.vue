<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Profil utilisateur</h2>

    <!-- Si l'utilisateur est chargé -->
    <div v-if="authStore.user">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-3">Informations personnelles</h5>

          <ul class="list-group">
            <li class="list-group-item">
              <strong>Nom :</strong> {{ authStore.user.nom }}
            </li>
            <li class="list-group-item">
              <strong>Prénom :</strong> {{ authStore.user.prenom }}
            </li>
            <li class="list-group-item">
              <strong>Email :</strong> {{ authStore.user.email }}
            </li>
            <li class="list-group-item">
              <strong>Rôles :</strong> {{ authStore.user.roles.join(", ") }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Si pas encore chargé -->
    <div v-else class="text-center text-muted">
      Chargement du profil...
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();

onMounted(async () => {
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser();
    console.log("User API response → ", authStore.user);
  }
});
</script>
