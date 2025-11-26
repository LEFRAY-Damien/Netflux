<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/axios";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const film = ref(null);
const favoris = ref([]);
const favLoading = ref(null);

// Charger le contenu + favoris
onMounted(async () => {
  try {
    const res = await api.get(`/contenus/${route.params.id}`);
    film.value = res.data;

    console.log("🎯 contenu chargé :", film.value);

    if (authStore.token) {
      const me = await api.get("/me");
      favoris.value = me.data.favoris.map(f => f.id);
      console.log("❤️ favoris :", favoris.value);
    }
  } catch (e) {
    console.error("❌ erreur chargement contenu :", e);
  }
});

// Toggle favoris ❤️🤍
async function toggleFavorite() {
  if (!authStore.token) return alert("Vous devez être connecté !");
  favLoading.value = film.value.id;

  try {
    const res = await api.post(`/contenus/${film.value.id}/favori`);
    if (res.data.favori) {
      favoris.value.push(film.value.id);
    } else {
      favoris.value = favoris.value.filter(f => f !== film.value.id);
    }
    console.log("💾 nouveau favoris :", favoris.value);
  } catch (e) {
    console.error("❌ erreur toggle favoris :", e);
  }

  favLoading.value = null;
}

function isFavori(id) {
  return favoris.value.includes(id);
}

function goBack() {
  router.push({ name: "movies" });
}

// Sécurité image fallback
function onImageError(e) {
  e.target.src = "https://via.placeholder.com/300x450?text=Pas+d’image";
}
</script>

<template>
<div class="container mt-4" v-if="film">

  <!-- HEADER : Retour + Favori -->
  <div class="row mb-3">
    <div class="col-12 d-flex justify-content-between align-items-center">
      <button class="btn btn-secondary" @click="goBack">
        ← Retour à la liste
      </button>

      <button
        v-if="authStore.token"
        class="btn btn-light btn-sm"
        @click="toggleFavorite"
        :disabled="favLoading === film.id"
      >
        <i :class="['bi', isFavori(film.id) ? 'bi-heart-fill text-danger' : 'bi-heart', 'fs-4']"></i>
      </button>
    </div>
  </div>

  <!-- CONTENU -->
  <div class="row">
    
    <!-- AFFICHE -->
    <div class="col-md-4 text-center">
      <img
        :src="film.affiche"
        class="img-fluid rounded shadow-sm"
        alt="Affiche"
        style="max-height:300px;object-fit:cover;"
        @error="onImageError"
      />
    </div>

    <!-- INFOS -->
    <div class="col-md-8">
      <h2 class="fw-bold">{{ film.titre }}</h2>

      <p><strong>Format :</strong> {{ film.format || "—" }}</p>
      <p><strong>Année :</strong> {{ film.anneeSortie || "—" }}</p>

      <p class="fw-bold">Description :</p>
      <p>{{ film.description || film.description || "—" }}</p>

      <p><strong>Genres :</strong> {{ (film.genres || []).map(g => g.nom).join(", ") || "—" }}</p>
      
      <!-- OPTIONNEL : Vidéo si fournie -->
      <div v-if="film.video" class="mt-3">
        <video controls class="w-100 rounded shadow-sm">
          <source :src="film.video" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
    </div>

  </div>
</div>

<!-- LOADER -->
<div v-else class="text-center my-5">
  <div class="spinner-border" role="status"></div>
  <p class="mt-2 text-muted">Chargement du contenu…</p>
</div>
</template>
