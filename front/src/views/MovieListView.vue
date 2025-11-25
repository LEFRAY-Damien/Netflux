<template>
  <div class="container mt-4">

    <!-- FILMS -->
    <h2 class="mb-3">🎬 Films</h2>
    <div class="d-flex align-items-center position-relative">

      <!-- Flèche gauche -->
      <button class="btn btn-dark me-2" @click="scrollLeft('films')">⬅</button>

      <!-- Container scrollable -->
      <div class="d-flex overflow-auto flex-grow-1" ref="filmsContainer">
        <div class="card me-3" style="min-width: 200px;" v-for="film in films" :key="film.id">
          <button
            v-if="authStore.token"
            class="btn btn-light position-absolute"
            style="top: 10px; right: 10px; z-index: 10;"
            @click.stop="toggleFavori(film.id)"
          >
            <span v-if="isFavori(film.id)">❤️</span>
            <span v-else>🤍</span>
          </button>

          <div style="cursor: pointer;" @click="$router.push(`/contenu/${film.id}`)">
            <img :src="film.affiche" class="card-img-top" style="height: 200px; object-fit: cover;" />
            <div class="card-body p-2">
              <h5 class="card-title fs-6">{{ film.titre }}</h5>
            </div>
          </div>
        </div>
      </div>

      <!-- Flèche droite -->
      <button class="btn btn-dark ms-2" @click="scrollRight('films')">➡</button>

    </div>

    <hr class="my-4" />

    <!-- SERIES -->
    <h2 class="mb-3">📺 Séries</h2>
    <div class="d-flex align-items-center position-relative">

      <!-- Flèche gauche -->
      <button class="btn btn-dark me-2" @click="scrollLeft('series')">⬅</button>

      <!-- Container scrollable -->
      <div class="d-flex overflow-auto flex-grow-1" ref="seriesContainer">
        <div class="card me-3" style="min-width: 200px;" v-for="serie in series" :key="serie.id">
          <button
            v-if="authStore.token"
            class="btn btn-light position-absolute"
            style="top: 10px; right: 10px; z-index: 10;"
            @click.stop="toggleFavori(serie.id)"
          >
            <span v-if="isFavori(serie.id)">❤️</span>
            <span v-else>🤍</span>
          </button>

          <div style="cursor: pointer;" @click="$router.push(`/contenu/${serie.id}`)">
            <img :src="serie.affiche" class="card-img-top" style="height: 200px; object-fit: cover;" />
            <div class="card-body p-2">
              <h5 class="card-title fs-6">{{ serie.titre }}</h5>
            </div>
          </div>
        </div>
      </div>

      <!-- Flèche droite -->
      <button class="btn btn-dark ms-2" @click="scrollRight('series')">➡</button>

    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();

const contenus = ref([]);
const films = ref([]);
const series = ref([]);
const favoris = ref([]);

// Refs pour carrousels
const filmsContainer = ref(null);
const seriesContainer = ref(null);

// Chargement favoris
const loadFavoris = async () => {
  if (!authStore.token) return;
  try {
    const res = await api.get("/me");
    favoris.value = res.data.favoris.map(f => f.id);
  } catch (e) { console.error(e); }
};

// Toggle favori
const toggleFavori = async (id) => {
  if (!authStore.token) { alert("Vous devez être connecté"); return; }
  try {
    const res = await api.post(`/contenus/${id}/favori`);
    const isFav = res.data.favori;
    if (isFav && !favoris.value.includes(id)) {
      favoris.value.push(id);
    } else {
      favoris.value = favoris.value.filter(f => f !== id);
    }
  } catch (e) { console.error(e); }
};

const isFavori = (id) => favoris.value.includes(id);

// Filtrer contenus selon navbar
const filterContenus = () => {
  const { format, genre, search } = route.query;
  let filtered = [...contenus.value];
  if (format) filtered = filtered.filter(c => c.format === format);
  if (genre) filtered = filtered.filter(c => c.genre_id == genre);
  if (search) filtered = filtered.filter(c => c.titre.toLowerCase().includes(search.toLowerCase()));

  films.value = filtered.filter(c => c.format === "film");
  series.value = filtered.filter(c => c.format === "serie");
};

// Scroll carrousel
const scrollLeft = (type) => {
  const container = type === 'films' ? filmsContainer.value : seriesContainer.value;
  container.scrollBy({ left: -300, behavior: 'smooth' });
};
const scrollRight = (type) => {
  const container = type === 'films' ? filmsContainer.value : seriesContainer.value;
  container.scrollBy({ left: 300, behavior: 'smooth' });
};

// Chargement initial
onMounted(async () => {
  await loadFavoris();
  try {
    const res = await api.get("/contenus");
    contenus.value = res.data.member;
    filterContenus();
  } catch (e) { console.error(e); }
});

watch(() => route.query, filterContenus);
</script>

<style scoped>
.d-flex.overflow-auto {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}
</style>
