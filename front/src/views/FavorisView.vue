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

async function toggleDelete(id) {
  if (!id) {
    console.error("❌ ID est undefined");
    return alert("Erreur, impossible de retirer, ID invalide !");
  }

  try {
    // ✅ Appel backend (même route que dans MovieListView)
    const res = await api.post(`/contenus/${id}/favori`, {}, {
      headers: { Authorization: "Bearer " + authStore.token }
    });

    // ✅ Mise à jour dans Pinia comme dans MovieListView
    authStore.favoris = authStore.favoris.filter(f => f !== id);
    localStorage.setItem("favoris", JSON.stringify(authStore.favoris));

    // ✅ On retire l’item localement de la vue (copié de la page qui marche)
    favoris.value = favoris.value.filter(c => c.id !== id);

    console.log("✅ retrait favori OK", res.data);
  } catch (e) {
    console.error("Erreur retrait favoris", e);
    alert("Erreur backend !");
  }
}



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

      <div class="card border-0 text-center position-relative shadow-sm" style="width:220px; min-width:220px;"
        v-for="contenu in favoris" :key="contenu.id">

        {{ console.log("🎯 contenu dans v-for :", contenu) }}


        <!-- IMAGE -->
        <img :src="contenu.affiche" class="card-img-top img-fluid rounded-top"
          style="height:280px; width:100%; object-fit:cover;" loading="lazy"
          @error="(e) => e.target.src = 'https://placehold.co/200x280?text=Image+indispo'" />

        <!-- BODY -->
        <div class="card-body p-2">
          <h6 class="small fw-bold m-0">{{ contenu.titre }}</h6>

          <!-- FORMAT à la place de TYPE -->
          <div class="text-muted small mt-1">
            {{ contenu.format === "film" ? "🎬 Film" : "📺 Série" }}
          </div>

          <!-- BOUTON DETAIL -->
          <button class="btn btn-primary btn-sm w-100 mt-2" @click.stop="router.push('/contenu/' + contenu.id)">
            🔍 Voir détail
          </button>

          <!-- BOUTON SUPPRIMER DU BACKEND -->
          <button class="btn btn-warning btn-sm w-100 mt-1" @click.stop="toggleDelete(contenu.id)"
            title="Retirer des favoris">
            ❌ Retirer
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
