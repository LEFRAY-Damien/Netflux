<script setup>
import { ref, onMounted } from "vue";

const films = ref([]);
const series = ref([]);

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:8000/api/contenus");
    const data = await res.json();

    const contenus = data.member;

    // IMPORTANT : ton API renvoie "format": "film" ou "serie"
    films.value = contenus.filter(c => c.format === "film");
    series.value = contenus.filter(c => c.format === "serie");

    // Debug pour vérifier
    contenus.forEach(c => console.log("Affiche :", c.affiche));

  } catch (e) {
    console.error("Erreur chargement contenus :", e);
  }
});
</script>

<template>
  <div class="container mt-4">

    <!-- FILMS -->
    <h2 class="mb-3">🎬 Films</h2>

    <div class="row">
      <div class="col-md-3 mb-4" v-for="film in films" :key="film.id">
        <div
          class="card h-100"
          style="cursor: pointer;"
          @click="$router.push(`/contenu/${film.id}`)"
        >
          <img
            :src="film.affiche"
            class="card-img-top"
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
      <div class="col-md-3 mb-4" v-for="serie in series" :key="serie.id">
        <div
          class="card h-100"
          style="cursor: pointer;"
          @click="$router.push(`/contenu/${serie.id}`)"
        >
          <img
            :src="serie.affiche"
            class="card-img-top"
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
