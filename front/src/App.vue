*<!-- App.vue -->

<script setup>
import Navigation from "@/components/Navigation.vue";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user"; // <-- importe ton store

const userStore = useUserStore();

// 🔥 Charger l'utilisateur automatiquement s'il existe un token
onMounted(() => {
  userStore.fetchUser();
});
</script>

<template>
  <Navigation />
  <div class="container mt-4">
    <router-view />
  </div>
</template>

<style scoped></style>
