<!-- LoginView.vue -->

<template>
  <div class="container mt-5" style="max-width: 450px">
    <h2 class="text-center mb-4">Connexion</h2>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <form @submit.prevent="handleLogin" class="card p-4 shadow-sm">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Mot de passe</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>

      <button class="btn btn-primary w-100">Se connecter</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const email = ref("");
const password = ref("");
const error = ref(null);

const router = useRouter();
const userStore = useUserStore();

// Redirection automatique si déjà connecté
if (userStore.token) {
  router.push("/");
}

const handleLogin = async () => {
  error.value = null;

  try {
    // Utilisation du store pour gérer login + token
    await userStore.login(email.value, password.value);
    router.push("/"); // Redirection après login réussi
  } catch (err) {
    error.value = err.message;
  }
};
</script>
