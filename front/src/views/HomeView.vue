<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Profil utilisateur</h2>

    <!-- Si l'utilisateur est chargé -->
    <div v-if="userStore.user">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-3">Informations personnelles</h5>

          <ul class="list-group">
            <li class="list-group-item">
              <strong>Nom :</strong> {{ userStore.user.nom }}
            </li>
            <li class="list-group-item">
              <strong>Prénom :</strong> {{ userStore.user.prenom }}
            </li>
            <li class="list-group-item">
              <strong>Email :</strong> {{ userStore.user.email }}
            </li>
            <li class="list-group-item">
              <strong>Rôles :</strong> {{ userStore.user.roles.join(", ") }}
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
import { useUserStore } from "@/stores/user.js";

const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.user && userStore.token) {
    await userStore.fetchUser();
  }
});
</script>
