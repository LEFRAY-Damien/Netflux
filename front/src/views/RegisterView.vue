<!-- RegisterView.vue -->
<template>
    <div class="container mt-5" style="max-width: 450px">
        <h2 class="text-center mb-4">Créer un compte</h2>

        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <form @submit.prevent="handleRegister" class="card p-4 shadow-sm">

            <div class="mb-3">
                <label class="form-label">Nom</label>
                <input v-model="nom" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Prénom</label>
                <input v-model="prenom" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input v-model="password" type="password" class="form-control" required />
            </div>

            <button class="btn btn-success w-100">Créer mon compte</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // ✔ CORRECT STORE

const router = useRouter();
const authStore = useAuthStore();

const nom = ref("");
const prenom = ref("");
const email = ref("");
const password = ref("");
const error = ref(null);

const handleRegister = async () => {
    error.value = null;

    try {
        await authStore.register({
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            password: password.value,
        });

        // Redirection après inscription
        router.push("/login");
    } catch (err) {
        error.value = err.message || "Erreur d'inscription.";
    }
};
</script>

<style scoped></style>
