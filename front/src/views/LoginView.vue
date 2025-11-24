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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const error = ref(null);

const router = useRouter();
const authStore = useAuthStore();

// Redirection si déjà connecté
onMounted(() => {
  if (authStore.token) {
    router.push("/");
  }
});

const handleLogin = async () => {
  error.value = null;

  try {
    await authStore.login(email.value, password.value);
    router.push("/"); 
  } catch (err) {
    error.value = "Email ou mot de passe incorrect";
  }
};
</script>

<style scoped></style>
