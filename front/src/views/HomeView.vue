<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Profil utilisateur</h2>

    <div v-if="userStore.user">
      <ul class="list-group">
        <li class="list-group-item"><strong>Nom :</strong> {{ userStore.user.nom }}</li>
        <li class="list-group-item"><strong>Prénom :</strong> {{ userStore.user.prenom }}</li>
        <li class="list-group-item"><strong>Email :</strong> {{ userStore.user.email }}</li>
        <li class="list-group-item"><strong>Rôles :</strong> {{ userStore.user.roles.join(', ') }}</li>
      </ul>
    </div>

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
