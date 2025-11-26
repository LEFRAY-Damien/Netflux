<!-- FavorisView.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const favoris = ref([]);
const loading = ref(true);
const errorMsg = ref(null);

// Charger la liste des favoris depuis l'API
onMounted(async () => {
  loading.value = true;
  try {
    const res = await api.get("/me");
    favoris.value = res.data.favoris ?? [];
  } catch (e) {
    errorMsg.value = "Erreur lors du chargement des favoris";
  }
  loading.value = false;
});
</script>

<template>
  <div class="container mt-4">

    <h2 class="text-center mb-4">⭐ Mes Favoris</h2>

    <!-- LOADER -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border"></div>
    </div>

    <!-- ERREUR -->
    <div v-if="errorMsg" class="alert alert-danger text-center">
      {{ errorMsg }}
    </div>

    <!-- ✅ LISTE FAVORIS + CAROUSEL NETFLIX -->
    <div v-if="!loading && !errorMsg" class="d-flex overflow-auto flex-nowrap pb-2" style="gap: 15px;">

      <div
        class="card border-0 text-center position-relative shadow-sm"
        style="width:220px; min-width:220px;"
        v-for="contenu in favoris"
        :key="contenu.id"
      >

        <!-- BOUTON FAVORI PERSISTENT -->
        <button
          v-if="authStore.token"
          class="btn btn-light btn-sm rounded-circle position-absolute"
          style="top:6px; right:6px; z-index:10;"
          @click.stop="toggleFavori(contenu.id)"
          title="Retirer des favoris"
        >
          <span v-if="authStore.favoris.includes(contenu.id)">⭐</span>
          <span v-else>☆</span>
        </button>

        <!-- IMAGE -->
        <img
          :src="contenu.affiche"
          class="card-img-top img-fluid rounded-top"
          style="height:280px; width:100%; object-fit:cover;"
          loading="lazy"
          @error="(e) => e.target.src='https://placehold.co/200x280?text=Image+indispo'"
        />

        <!-- BODY -->
        <div class="card-body p-2">
          <h6 class="small fw-bold m-0">{{ contenu.titre }}</h6>

          <!-- FORMAT à la place de TYPE -->
          <div class="text-muted small mt-1">
            {{ contenu.format === "film" ? "🎬 Film" : "📺 Série" }}
          </div>

          <!-- BOUTON DETAIL -->
          <button
            class="btn btn-primary btn-sm w-100 mt-2"
            @click.stop="router.push('/contenus/' + contenu.id)"
          >
            🔍 Voir détail
          </button>

          <!-- BOUTON SUPPRIMER DU BACKEND -->
          <button
            class="btn btn-warning btn-sm w-100 mt-1"
            @click.stop="toggleDelete(contenu.id)"
          >
            ⭐ Retirer
          </button>
        </div>

      </div>

    </div>

    <!-- SI PAS DE FAVORIS -->
    <div v-if="!loading && !errorMsg && favoris.length === 0" class="alert alert-warning text-center mt-4">
      Aucun contenu enregistré en favoris.
    </div>

  </div>
</template>

<script>
// ⭐ Fonction simple, débutant friendly
import { useAuthStore } from "@/stores/auth";

const toggleDelete = async (id) => {
  const auth = useAuthStore();
  try {
    await api.post("/contenus/" + id + "/favori"); // atteint backend toggle
    await auth.fetchFavoris(); // recharge la liste après suppression
    favoris.value = favoris.value.filter(c => c.id !== id);
  } catch(e) {
    console.error("Erreur suppression favoris", e);
  }
};
</script>
