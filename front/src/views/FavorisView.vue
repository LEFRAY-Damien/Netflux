<!-- FavoritesView.vue -->

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const favoris = ref([]);

// Charger les favoris depuis /me
const loadFavoris = async () => {
  try {
    const res = await api.get("/me");
    favoris.value = res.data.favoris || [];
  } catch (e) {
    console.error("Erreur chargement favoris :", e);
  }
};

// Ajouter / supprimer un favori
const toggleFavori = async (id) => {
  try {
    const { data } = await api.post(`/contenus/${id}/favori`);
    
    // Si retiré
    if (!data.favori) {
      favoris.value = favoris.value.filter(item => item.id !== id);
    }
  } catch (e) {
    console.error("Erreur toggle favori :", e);
  }
};

// Aller vers la page détail
const openDetail = (id) => {
  router.push(`/contenu/${id}`);
};

onMounted(() => {
  if (!authStore.token) {
    router.push("/login");
    return;
  }
  loadFavoris();
});
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">❤️ Mes Favoris</h2>

    <div v-if="favoris.length === 0" class="text-center text-muted mt-5">
      <p>Aucun favori pour le moment.</p>
    </div>

    <div class="row">
      <div
        class="col-md-3 mb-4"
        v-for="item in favoris"
        :key="item.id"
      >
        <div class="card h-100 position-relative">

          <!-- Bouton favori -->
          <button
            class="btn btn-light position-absolute"
            style="top: 10px; right: 10px; z-index: 10;"
            @click.stop="toggleFavori(item.id)"
          >
            ❤️
          </button>

          <div style="cursor: pointer;" @click="openDetail(item.id)">
            <img 
              :src="item.affiche" 
              class="img-fluid"
              style="max-height: 200px; object-fit: cover;"
              alt="Affiche"
            />

            <div class="card-body">
              <h5 class="card-title">{{ item.titre }}</h5>
              <p class="text-muted text-capitalize">
                {{ item.format }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
