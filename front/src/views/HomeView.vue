<!-- front/src/views/HomeView.vue -->
<template>
    <div class="container mt-4">
        <h2 class="mb-4 text-center">Catalogue</h2>

        <div v-if="loading" class="text-center">Chargement…</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="row g-4" v-if="!loading">
            <div class="col-6 col-md-4 col-lg-3" v-for="contenu in contenus" :key="contenu.id">

                <div class="card shadow-sm h-100">
                    <img :src="contenu.affiche" class="card-img-top" alt="Affiche"
                        style="height: 300px; object-fit: cover;" loading="lazy" />
                    <div class="card-body">
                        <h5 class="card-title">{{ contenu.titre }}</h5>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="contenus.length === 0 && !loading" class="text-center text-muted">
            Aucun contenu trouvé.
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const contenus = ref([]); // éviter "undefined"
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await fetch("http://localhost:8000/api/contenus");
        const data = await response.json();

        console.log(data);

        contenus.value = data.member ?? data["hydra:member"] ?? [];

    } catch (err) {
        error.value = "Erreur lors du chargement : " + err.message;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped></style>
