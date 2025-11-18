<!-- MovieDetailView.vue -->
<template>
  <div class="container mt-4" v-if="film">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <!-- Bouton retour -->
        <button class="btn btn-secondary" @click="goBack">
          ← Retour
        </button>

        <!-- Bouton Favori -->
        <button class="btn" @click="toggleFavorite">
          <i :class="['bi', isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart', 'fs-4']"></i>
        </button>
      </div>
    </div>

    <div class="row">
      <!-- Affiche -->
      <div class="col-md-4">
        <img
          :src="film.affiche"
          class="img-fluid rounded mb-3"
          alt="Affiche du film"
          @error="onImageError"
        />
      </div>

      <!-- Informations -->
      <div class="col-md-8">
        <h2 class="fw-bold">{{ film.titre }}</h2>

        <p><strong>Année :</strong> {{ formatDate(film.anneeSortie) }}</p>

        <p><strong>Description :</strong></p>
        <p>{{ film.description }}</p>

        <p><strong>Genres :</strong> {{ (film.genres || []).map(g => g.nom).join(', ') || '—' }}</p>

        <div v-if="film.video" class="mt-3">
          <video controls class="w-100 rounded shadow-sm">
            <source :src="film.video" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        </div>
      </div>
    </div>
  </div>

  <!-- Loader -->
  <div v-else class="text-center mt-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Chargement…</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const film = ref(null);
const isFavorite = ref(false);

// Charge les détails du film
onMounted(async () => {
  try {
    const response = await api.get(`/contenus/${route.params.id}`);
    film.value = response.data;

    // Vérifie si déjà en favori (si connecté)
    if (userStore.user) {
      const favorisIds = userStore.user.favori?.map(f => f.id) || [];
      isFavorite.value = favorisIds.includes(film.value.id);
    }
  } catch (e) {
    console.error('Erreur chargement film :', e);
  }
});

// Format année
const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).getFullYear();
};

// Retour à la liste
const goBack = () => {
  router.push({ name: 'movies' });
};

// Ajout / suppression favori
const toggleFavorite = async () => {
  if (!userStore.token) {
    alert("Vous devez être connecté pour ajouter un favori !");
    return;
  }
  try {
    const { data } = await api.post(`/contenus/${film.value.id}/favori`);
    isFavorite.value = data.favori;
    await userStore.fetchUser();
  } catch (error) {
    console.error("Erreur favoris :", error);
  }
};

// Placeholder si image manquante
const onImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x450?text=Pas+d\'image';
};
</script>
