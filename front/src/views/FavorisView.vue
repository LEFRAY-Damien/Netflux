<!-- FavorisView.vue -->
<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const favoris = ref([]);
const loading = ref(true);
const errorMsg = ref(null);

// Charger favoris depuis l'API
onMounted(async () => {
  try {
    const res = await api.get("/me"); // ✅ retourne les favoris du user connecté
    favoris.value = res.data.favoris ?? [];
    console.log("✅ Favoris chargés :", favoris.value);
  } catch (e) {
    console.error("❌ erreur /me :", e);
    errorMsg.value = "Impossible de charger les favoris";
  }
  loading.value = false;
});
</script>

<template>
<div class="container mt-4">
  <h2 class="mb-4 text-center">⭐ Mes Favoris</h2>

  <div v-if="loading" class="text-center my-5">
    <div class="spinner-border"></div>
    <div class="mt-2">Chargement des favoris...</div>
  </div>

  <div v-if="errorMsg" class="alert alert-danger text-center">{{ errorMsg }}</div>

  <!-- Carousel horizontal -->
  <div v-if="!loading && !errorMsg" class="d-flex align-items-center">
    
    <button class="btn btn-dark btn-sm me-2" @click="document.querySelector('#favScroll')?.scrollBy({ left: -250, behavior: 'smooth'})">
      ⬅
    </button>
    
    <div id="favScroll" class="d-flex overflow-auto flex-nowrap flex-grow-1 pb-2" style="gap: 15px;">
      
      <div
        class="card h-auto position-relative text-center"
        style="width:220px; min-width:220px;"
        v-for="contenu in favoris"
        :key="contenu.id"
      >

        <!-- Bouton supprimer favoris -->
        <button
          v-if="authStore.token"
          class="btn btn-warning btn-sm position-absolute rounded-circle"
          style="top:8px; right:8px; z-index:10;"
          @click.stop="contenu.id && api.post('/contenus/' + contenu.id + '/favori').then(()=> favoris = favoris.filter(f=>f!==contenu.id))"
          title="Retirer des favoris"
        >
          ✖
        </button>

        <!-- Image -->
        <img
          :src="contenu.affiche"
          class="card-img-top img-fluid rounded-top"
          style="height:200px; width:100%; object-fit:cover;"
          loading="lazy"
          @error="(e) => e.target.src = 'https://placehold.co/200x300?text=Indispo'"
        />

        <!-- Infos -->
        <div class="card-body p-2">
          <p class="small fw-bold m-0">{{ contenu.titre }}</p>
          <div class="text-muted small">
            Format : {{ contenu.format === "film" ? "Film 🎬" : "Série 📺" }}
          </div>

          <!-- Lien vers détail -->
          <button
            class="btn btn-primary btn-sm w-100 mt-2"
            @click="contenu.id ? routerPush(contenu.id) : null"
          >
            🔍 Voir détail
          </button>
        </div>
      </div>

    </div>

    <button class="btn btn-dark btn-sm ms-2" @click="document.querySelector('#favScroll')?.scrollBy({ left: 250, behavior: 'smooth'})">
      ➡
    </button>

  </div>

  <!-- Si pas de favoris après chargement -->
  <div v-if="!loading && !errorMsg && favoris.length === 0" class="alert alert-warning text-center mt-4">
    Tu n'as encore rien ajouté en favoris ⭐
  </div>

</div>
</template>

<script>
// method simple pour pousser vers détail sans enlever Bootstrap
function routerPush(id) {
  router.push("/contenus/" + id);
}
</script>
