<!-- MovieListView.vue -->
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const contenus = ref([]);
const films = ref([]);
const series = ref([]);
const favLoading = ref(null);

const filmsContainer = ref(null);
const seriesContainer = ref(null);

// Fallback image
function onImageError(e) {
  e.target.src = "https://placehold.co/200x280?text=Image+indispo";
}

// Charger API
async function loadContenus() {
  const res = await api.get("/contenus");
  contenus.value = res.data.member ?? [];
  applyFilters();
}

// Appliquer filtres format + activer étoiles si favoris existent
function applyFilters() {
  const list = [...contenus.value];

  const f = list.filter(c => c.format === "film");
  const s = list.filter(c => c.format === "serie");
  const format = route.query.format || "";

  if (format === "film") {
    films.value = f;
    series.value = [];
  } else if (format === "serie") {
    films.value = [];
    series.value = s;
  } else {
    films.value = f;
    series.value = s;
  }
}

// Toggle favoris (APPAREIL LOCAL + DB)
async function toggleFavori(id) {
  favLoading.value = id;
  await authStore.toggleFavori(id);
  applyFilters();
  favLoading.value = null;
}

function isFavourite(id) {
  return authStore.favoris?.includes(id);
}

// Scroll carousel
function scrollLeft(type) {
  const el = type === "films" ? filmsContainer.value : seriesContainer.value;
  el?.scrollBy({ left: -250, behavior: "smooth" });
}
function scrollRight(type) {
  const el = type === "films" ? filmsContainer.value : seriesContainer.value;
  el?.scrollBy({ left: 250, behavior: "smooth" });
}

// Au montage
onMounted(async () => {
  await loadContenus();
  if (authStore.token) await authStore.fetchFavoris();
});

// Réagir aux changements URL
watch(() => route.query.format, applyFilters);
watch(() => route.query.search, applyFilters);
</script>

<template>
<div class="container mt-4">

  <h2 class="mb-4 text-center">Films & Séries</h2>

  <!-- LIGNE FILMS -->
  <div class="mb-5" v-if="films.length">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4>🎬 Films</h4>
      <div>
        <button class="btn btn-sm btn-dark me-2" @click="scrollLeft('films')">⬅</button>
        <button class="btn btn-sm btn-dark" @click="scrollRight('films')">➡</button>
      </div>
    </div>

    <div class="d-flex overflow-auto flex-nowrap" ref="filmsContainer" style="gap:15px;">
      <div class="card border-0 shadow-sm text-center position-relative"
           style="width:220px; min-width:220px;"
           v-for="film in films"
           :key="film.id"
      >
        <!-- ⭐ ÉTOILE → seulement si connecté -->
        <button
          v-if="authStore.token"
          class="btn btn-light btn-sm position-absolute rounded-circle"
          style="top:6px; right:6px; z-index:10;"
          @click.stop="toggleFavori(film.id)"
          :disabled="favLoading===film.id"
          title="Ajouter / retirer favoris"
        >
          <span v-if="isFavourite(film.id)">⭐</span>
          <span v-else>☆</span>
        </button>

        <!-- IMAGE -->
        <img :src="film.affiche" style="height:280px;width:100%;object-fit:cover;"
             loading="lazy" @error="onImageError" />

        <!-- TITRE + DÉTAIL -->
        <div class="card-body p-2">
          <p class="fw-bold small m-1">{{ film.titre }}</p>
          <p class="text-muted small m-0">{{ film.format }}</p>
          <button class="btn btn-primary btn-sm w-100 mt-2"
                  @click.stop="router.push('/contenu/' + film.id)">
            🔍 Voir détail
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- LIGNE SERIES -->
  <div v-if="series.length">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4>📺 Séries</h4>
      <div>
        <button class="btn btn-sm btn-dark me-2" @click="scrollLeft('series')">⬅</button>
        <button class="btn btn-sm btn-dark" @click="scrollRight('series')">➡</button>
      </div>
    </div>

    <div class="d-flex overflow-auto flex-nowrap" ref="seriesContainer" style="gap:15px;">
      <div class="card border-0 shadow-sm text-center position-relative"
           style="width:220px; min-width:220px;"
           v-for="serie in series"
           :key="serie.id"
      >
        <!-- ⭐ ÉTOILE → seulement si connecté -->
        <button
          v-if="authStore.token"
          class="btn btn-light btn-sm position-absolute rounded-circle"
          style="top:6px; right:6px; z-index:10;"
          @click.stop="toggleFavori(serie.id)"
          :disabled="favLoading===serie.id"
          title="Ajouter / retirer favoris"
        >
          <span v-if="isFavourite(serie.id)">⭐</span>
          <span v-else>☆</span>
        </button>

        <!-- IMAGE -->
        <img :src="serie.affiche" style="height:280px;width:100%;object-fit:cover;"
             loading="lazy" @error="onImageError" />

        <!-- TITRE + DÉTAIL -->
        <div class="card-body p-2">
          <p class="fw-bold small m-1">{{ serie.titre }}</p>
          <p class="text-muted small m-0">{{ serie.format }}</p>
          <button class="btn btn-primary btn-sm w-100 mt-2"
                  @click.stop="router.push('/contenu/' + serie.id)">
            🔍 Voir détail
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- SI RIEN -->
  <div v-if="!films.length && !series.length" class="alert alert-warning text-center">
    Aucun contenu trouvé
  </div>

</div>
</template>
