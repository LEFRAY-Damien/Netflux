<template>
    <div class="container mt-4">
        <h2 class="mb-4 text-center">Profil utilisateur</h2>

        <!-- Vérifie si user est chargé -->
        <div v-if="user">
            <ul class="list-group">
                <li class="list-group-item"><strong>Nom :</strong> {{ user.nom }}</li>
                <li class="list-group-item"><strong>Prénom :</strong> {{ user.prenom }}</li>
                <li class="list-group-item"><strong>Email :</strong> {{ user.email }}</li>
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

// Charge l'utilisateur connecté au montage du composant
onMounted(async () => {
    if (!userStore.user) {
        await userStore.fetchUser();
    }
});

const user = userStore.user;
</script>
