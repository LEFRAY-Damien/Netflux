<!-- src/views/MovieListView.vue -->
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Données
const contenus = ref([]);
const films = ref([]);
const series = ref([]);
const favoris = ref([]);      // IDs des contenus favoris
const favLoading = ref(null); // ID en cours de toggle

// Réfs carrousel
const filmsContainer = ref(null);
const seriesContainer = ref(null);

// Image fallback
function onImageError(e) {
  e.target.src = "https://placehold.co/200x300?text=Image+indispo";
}

// 🔹 Charger les contenus
async function loadContenus() {
  try {
    const res = await api.get("/contenus");
    // API Platform renvoie généralement "member"
    const list = res.data.member ?? res.data["hydra:member"] ?? [];
    contenus.value = list;
    console.log("✅ contenus reçus :", list.length);
    applyFilters();
  } catch (e) {
    console.error("❌ Erreur loadContenus :", e);
  }
}

// 🔹 Charger les favoris depuis /me
async function loadFavoris() {
  if (!authStore.token) {
    favoris.value = [];
    return;
  }
  try {
    const res = await api.get("/me");
    favoris.value = (res.data.favoris || []).map(f => f.id);
    console.log("⭐ favoris IDs :", favoris.value);
  } catch (e) {
    console.error("❌ Erreur loadFavoris :", e);
  }
}

// 🔹 Appliquer filtres format + recherche
function applyFilters() {
  let list = [...contenus.value];

  const format = route.query.format || "";
  const search = (route.query.search || "").toLowerCase();

  if (search) {
    list = list.filter(c =>
      (c.titre || "").toLowerCase().includes(search)
    );
  }

  const allFilms = list.filter(c => c.format === "film");
  const allSeries = list.filter(c => c.format === "serie");

  if (format === "film") {
    films.value = allFilms;
    series.value = [];
  } else if (format === "serie") {
    films.value = [];
    series.value = allSeries;
  } else {
    films.value = allFilms;
    series.value = allSeries;
  }

  console.log("🎬 films:", films.value.length, "📺 séries:", series.value.length, "| format:", format);
}

// 🔹 Toggle favoris (étoile)
async function toggleFavori(id) {
  if (!authStore.token) {
    alert("Vous devez être connecté");
    return;
  }

  favLoading.value = id;
  try {
    const res = await api.post(`/contenus/${id}/favori`);
    const isFav = res.data.favori;

    if (isFav) {
      if (!favoris.value.includes(id)) {
        favoris.value.push(id);
      }
    } else {
      favoris.value = favoris.value.filter(f => f !== id);
    }

    console.log("⭐ favoris (local) :", favoris.value);
  } catch (e) {
    console.error("❌ Erreur toggleFavori :", e);
  }
  favLoading.value = null;
}

// 🔹 Savoir si un contenu est en favori
function isFavori(id) {
  return favoris.value.includes(id);
}

// 🔹 Scroll carrousel
function scrollLeft(type) {
  const el = type === "films" ? filmsContainer.value : seriesContainer.value;
  el?.scrollBy({ left: -250, behavior: "smooth" });
}

function scrollRight(type) {
  const el = type === "films" ? filmsContainer.value : seriesContainer.value;
  el?.scrollBy({ left: 250, behavior: "smooth" });
}

// 🔹 Lifecycle
onMounted(async () => {
  await loadFavoris();
  await loadContenus();
});

// Re-appliquer les filtres quand l'URL change
watch(() => route.query, applyFilters);
</script>

<template>
  <div class="container mt-4">

    <h2 class="mb-4 text-center">Films & Séries</h2>

    <!-- 🎬 FILMS -->
    <div v-if="films.length" class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h4 class="m-0">🎬 Films</h4>
        <div>
          <button class="btn btn-sm btn-dark me-2" @click="scrollLeft('films')">‹</button>
          <button class="btn btn-sm btn-dark" @click="scrollRight('films')">›</button>
        </div>
      </div>

      <div class="d-flex overflow-auto flex-nowrap" ref="filmsContainer" style="gap:15px; padding-bottom:10px;">
        <div
          v-for="film in films"
          :key="film.id"
          class="card border-0 shadow-sm text-center position-relative"
          style="width:200px; min-width:200px;"
        >
          <!-- ⭐ étoile favoris -->
          <button
            v-if="authStore.token"
            class="btn btn-light btn-sm position-absolute rounded-circle"
            style="top:6px; right:6px; z-index:10;"
            @click.stop="toggleFavori(film.id)"
            :disabled="favLoading === film.id"
            title="Ajouter/retirer des favoris"
          >
            <span v-if="isFavori(film.id)">⭐</span>
            <span v-else>☆</span>
          </button>

          <div style="cursor:pointer;" @click="router.push(`/contenu/${film.id}`)">
            <img
              :src="film.affiche"
              class="card-img-top img-fluid rounded-top"
              style="height:200px; width:100%; object-fit:cover;"
              loading="lazy"
              @error="onImageError"
            />
          </div>

          <div class="card-body p-2">
            <p class="small fw-bold m-0">{{ film.titre }}</p>
            <button
              class="btn btn-primary btn-sm w-100 mt-2"
              @click="router.push(`/contenu/${film.id}`)"
            >
              🔍 Voir détail
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 📺 SERIES -->
    <div v-if="series.length">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h4 class="m-0">📺 Séries</h4>
        <div>
          <button class="btn btn-sm btn-dark me-2" @click="scrollLeft('series')">‹</button>
          <button class="btn btn-sm btn-dark" @click="scrollRight('series')">›</button>
        </div>
      </div>

      <div class="d-flex overflow-auto flex-nowrap" ref="seriesContainer" style="gap:15px; padding-bottom:10px;">
        <div
          v-for="serie in series"
          :key="serie.id"
          class="card border-0 shadow-sm text-center position-relative"
          style="width:200px; min-width:200px;"
        >
          <!-- ⭐ étoile favoris -->
          <button
            v-if="authStore.token"
            class="btn btn-light btn-sm position-absolute rounded-circle"
            style="top:6px; right:6px; z-index:10;"
            @click.stop="toggleFavori(serie.id)"
            :disabled="favLoading === serie.id"
            title="Ajouter/retirer des favoris"
          >
            <span v-if="isFavori(serie.id)">⭐</span>
            <span v-else>☆</span>
          </button>

          <div style="cursor:pointer;" @click="router.push(`/contenu/${serie.id}`)">
            <img
              :src="serie.affiche"
              class="card-img-top img-fluid rounded-top"
              style="height:200px; width:100%; object-fit:cover;"
              loading="lazy"
              @error="onImageError"
            />
          </div>

          <div class="card-body p-2">
            <p class="small fw-bold m-0">{{ serie.titre }}</p>
            <button
              class="btn btn-primary btn-sm w-100 mt-2"
              @click="router.push(`/contenu/${serie.id}`)"
            >
              🔍 Voir détail
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Si rien -->
    <div v-if="!films.length && !series.length" class="alert alert-warning text-center">
      Aucun contenu trouvé.
    </div>

  </div>
</template>
