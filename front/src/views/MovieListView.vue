<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const films = ref([]);
const series = ref([]);
const favoris = ref([]); // IDs des contenus favoris

// Charger les favoris utilisateur
const loadFavoris = async () => {
  if (!authStore.token) return;

  try {
    const res = await api.get("/me");
    favoris.value = res.data.favoris.map(f => f.id); // liste des IDs
  } catch (e) {
    console.error("Erreur chargement favoris :", e);
  }
};

const toggleFavori = async (id) => {
  try {
    const res = await api.post(`/contenus/${id}/favori`);
    const isFav = res.data.favori;

    if (isFav && !favoris.value.includes(id)) {
      favoris.value.push(id);
    } else {
      favoris.value = favoris.value.filter(f => f !== id);
    }

  } catch (e) {
    console.error("Erreur toggle favori :", e);
  }
};

onMounted(async () => {
  if (!authStore.token) {
    router.push("/login");
    return;
  }

  await loadFavoris();

  try {
    const res = await api.get("/contenus");
    const contenus = res.data.member;

    films.value = contenus.filter(c => c.format === "film");
    series.value = contenus.filter(c => c.format === "serie");

  } catch (e) {
    console.error("Erreur API contenus :", e);
  }
});

// Vérifie si un contenu est favori
const isFavori = (id) => favoris.value.includes(id);
</script>

<template>
  <div class="container mt-4">

    <!-- FILMS -->
    <h2 class="mb-3">🎬 Films</h2>

    <div class="row">
      <div 
        class="col-md-3 mb-4"
        v-for="film in films"
        :key="film.id"
      >
        <div class="card h-100 position-relative">

          <!-- ❤️ Bouton favori -->
          <button
            class="btn btn-light position-absolute"
            style="top: 10px; right: 10px; z-index: 10;"
            @click.stop="toggleFavori(film.id)"
          >
            <span v-if="isFavori(film.id)">❤️</span>
            <span v-else>🤍</span>
          </button>

          <!-- Clique vers détails -->
          <div style="cursor: pointer;" @click="$router.push(`/contenu/${film.id}`)">
            <img 
              :src="film.affiche" 
              class="img-fluid"
              style="max-height: 200px; object-fit: cover;"
              alt="Affiche du film"
            />

            <div class="card-body">
              <h5 class="card-title">{{ film.titre }}</h5>
            </div>
          </div>

        </div>
      </div>
    </div>

    <hr class="my-4" />

    <!-- SERIES -->
    <h2 class="mb-3">📺 Séries</h2>

    <div class="row">
      <div 
        class="col-md-3 mb-4"
        v-for="serie in series"
        :key="serie.id"
      >
        <div class="card h-100 position-relative">

          <!-- ❤️ Bouton favori -->
          <button
            class="btn btn-light position-absolute"
            style="top: 10px; right: 10px; z-index: 10;"
            @click.stop="toggleFavori(serie.id)"
          >
            <span v-if="isFavori(serie.id)">❤️</span>
            <span v-else>🤍</span>
          </button>

          <div style="cursor: pointer;" @click="$router.push(`/contenu/${serie.id}`)">
            <img 
              :src="serie.affiche" 
              class="img-fluid"
              style="max-height: 200px; object-fit: cover;"
              alt="Affiche de la série"
            />

            <div class="card-body">
              <h5 class="card-title">{{ serie.titre }}</h5>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
