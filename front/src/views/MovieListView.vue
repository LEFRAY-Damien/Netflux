<!-- MovieListView.vue -->

<template>
  <div class="container mt-4">

    <h2 class="mb-3">Films</h2>
    <div class="row g-4">
      <div v-for="film in films" :key="film.id" class="col-6 col-md-4 col-lg-3">
        <div class="card shadow-sm h-100">
          <img :src="film.affiche" class="card-img-top img-fluid" alt="Affiche" style="height: 150px; object-fit: cover;" loading="lazy">
          <div class="card-body">
            <h5 class="card-title">{{ film.titre }}</h5>
          </div>
        </div>
      </div>
    </div>

    <h2 class="my-4">Séries</h2>
    <div class="row g-4">
      <div v-for="serie in series" :key="serie.id" class="col-6 col-md-4 col-lg-3">
        <div class="card shadow-sm h-100">
          <img :src="serie.affiche" class="card-img-top img-fluid" alt="Affiche" style="height: 150px; object-fit: cover;" loading="lazy">
          <div class="card-body">
            <h5 class="card-title">{{ serie.titre }}</h5>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center mt-3">Chargement…</div>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const films = ref([]);
const series = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("http://localhost:8000/api/contenus");
    const data = await response.json();
    const contenus = data.member ?? data["hydra:member"] ?? [];

    // Sépare les films et les séries
    films.value = contenus.filter(c => c.format === "film");
    series.value = contenus.filter(c => c.format === "serie");

  } catch (e) {
    error.value = "Erreur lors du chargement : " + e.message;
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped></style>