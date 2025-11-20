<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const films = ref([]);
const series = ref([]);

onMounted(async () => {
  // Sécurité : si pas de token → redirection login
  if (!authStore.token) {
    router.push("/login");
    return;
  }

  try {
    const res = await api.get("/contenus"); // <-- axios + token auto
    const contenus = res.data.member;

    films.value = contenus.filter(c => c.format === "film");
    series.value = contenus.filter(c => c.format === "serie");

  } catch (e) {
    console.error("Erreur API contenus :", e);
  }
});
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
        @click="$router.push(`/contenu/${film.id}`)"
      >
        <div class="card h-100" style="cursor: pointer;">
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

    <hr class="my-4" />

    <!-- SERIES -->
    <h2 class="mb-3">📺 Séries</h2>

    <div class="row">
      <div 
        class="col-md-3 mb-4"
        v-for="serie in series"
        :key="serie.id"
        @click="$router.push(`/contenu/${serie.id}`)"
      >
        <div class="card h-100" style="cursor: pointer;">
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
</template>
