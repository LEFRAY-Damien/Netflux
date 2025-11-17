<!-- MovieDetailView.vue -->
<template>
  <div class="container mt-4" v-if="film">
    <div class="row mb-3">
      <div class="col-12">
        <!-- Bouton retour -->
        <button class="btn btn-secondary mb-3" @click="goBack">
          ← Retour à la liste
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <img :src="film.affiche" class="img-fluid rounded mb-3" alt="Affiche">
      </div>
      <div class="col-md-8">
        <h2>{{ film.titre }}</h2>
        <p><strong>Année :</strong> {{ formatDate(film.anneeSortie) }}</p>
        <p><strong>Description :</strong></p>
        <p>{{ film.description }}</p>
        <p><strong>Genres :</strong> {{ film.genres.map(g => g.nom).join(', ') }}</p>

        <div v-if="film.video" class="mt-3">
          <video controls class="w-100">
            <source :src="film.video" type="video/mp4">
            Votre navigateur ne supporte pas la vidéo.
          </video>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center mt-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Chargement…</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const film = ref(null);

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/contenus/${route.params.id}`);
    film.value = await response.json();
  } catch (e) {
    console.error("Erreur chargement film :", e);
  }
});

// Fonction simple pour formater l'année
const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).getFullYear();
};

// Fonction pour revenir à la liste
const goBack = () => {
  router.push({ name: "movies" });
};
</script>
