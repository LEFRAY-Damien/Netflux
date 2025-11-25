<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const films = ref([]);
const series = ref([]);
const favoris = ref([]);
const error = ref(null);

const loadFavoris = async () => {
  if (!authStore.token) return;
  try {
    const res = await api.get("/me");
    favoris.value = (res.data.favoris || []).map(f => f.id);
  } catch (e) {
    console.error(e);
    favoris.value = [];
  }
};

const toggleFavori = async (id) => {
  if (!authStore.token) { alert("Vous devez être connecté pour ajouter en favori"); return; }
  try {
    const res = await api.post(`/contenus/${id}/favori`);
    const isFav = res.data.favori;
    if (isFav && !favoris.value.includes(id)) favoris.value.push(id);
    else favoris.value = favoris.value.filter(f => f !== id);
  } catch (e) {
    console.error(e);
    error.value = "Impossible de modifier les favoris.";
  }
};

onMounted(async () => {
  error.value = null;
  await loadFavoris();
  try {
    const res = await api.get("/contenus");
    const contenus = res.data.member || [];
    films.value = contenus.filter(c => c.format === "film");
    series.value = contenus.filter(c => c.format === "serie");
  } catch (e) {
    console.error(e);
    error.value = "Impossible de charger les films et séries.";
    films.value = [];
    series.value = [];
  }
});

const isFavori = (id) => favoris.value.includes(id);
</script>

<template>
  <div class="container mt-4">
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <h2 class="mb-3">🎬 Films</h2>
    <div v-if="films.length" class="row">
      <div class="col-md-3 mb-4" v-for="film in films" :key="film.id">
        <div class="card h-100 position-relative">
          <button v-if="authStore.token" class="btn btn-light position-absolute"
            style="top:10px; right:10px; z-index:10;" @click.stop="toggleFavori(film.id)">
            <span v-if="isFavori(film.id)">❤️</span>
            <span v-else>🤍</span>
          </button>
          <div style="cursor:pointer;" @click="$router.push(`/contenu/${film.id}`)">
            <img :src="film.affiche" class="img-fluid" style="max-height:200px; object-fit:cover;" alt="Affiche">
            <div class="card-body"><h5 class="card-title">{{ film.titre }}</h5></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info">Aucun film disponible.</div>

    <hr class="my-4" />
    <h2 class="mb-3">📺 Séries</h2>
    <div v-if="series.length" class="row">
      <div class="col-md-3 mb-4" v-for="serie in series" :key="serie.id">
        <div class="card h-100 position-relative">
          <button v-if="authStore.token" class="btn btn-light position-absolute"
            style="top:10px; right:10px; z-index:10;" @click.stop="toggleFavori(serie.id)">
            <span v-if="isFavori(serie.id)">❤️</span>
            <span v-else>🤍</span>
          </button>
          <div style="cursor:pointer;" @click="$router.push(`/contenu/${serie.id}`)">
            <img :src="serie.affiche" class="img-fluid" style="max-height:200px; object-fit:cover;" alt="Affiche">
            <div class="card-body"><h5 class="card-title">{{ serie.titre }}</h5></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info">Aucune série disponible.</div>
  </div>
</template>
