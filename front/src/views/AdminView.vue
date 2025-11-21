<!-- AdminView.vue -->

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios.js";
import { useUserStore } from "@/stores/user.js";

const userStore = useUserStore();

// Liste des contenus
const contenus = ref([]);

// Modal
const showModal = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

// Formulaire
const form = ref({
  titre: "",
  affiche: "",
  description: "",
  anneeSortie: "",
  video: "",
  format: "film",
});

// Charger tous les contenus
const loadContenus = async () => {
  const res = await api.get("/contenus");
  contenus.value = res.data.member;
};

// Ouvrir modal ajout
const openAddModal = () => {
  isEditing.value = false;
  resetForm();
  showModal.value = true;
};

// Ouvrir modal édition
const openEditModal = (item) => {
  isEditing.value = true;
  currentId.value = item.id;
  form.value = {
    titre: item.titre,
    affiche: item.affiche,
    description: item.description,
    anneeSortie: item.anneeSortie,
    video: item.video,
    format: item.format,
  };
  showModal.value = true;
};

// Réinitialiser formulaire
const resetForm = () => {
  form.value = {
    titre: "",
    affiche: "",
    description: "",
    anneeSortie: "",
    video: "",
    format: "film",
  };
};

// Submit création ou édition
const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      anneeSortie: new Date(form.value.anneeSortie),
    };

    if (isEditing.value) {
      await api.put(`/contenus/${currentId.value}`, payload);
    } else {
      await api.post("/contenus", payload);
    }

    showModal.value = false;
    await loadContenus();
  } catch (err) {
    console.error("Erreur API :", err);
  }
};

// Supprimer un contenu
const deleteContenu = async (id) => {
  if (!confirm("Supprimer ce contenu ?")) return;

  await api.delete(`/contenus/${id}`);
  await loadContenus();
};

onMounted(loadContenus);
</script>

<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Administration</h1>

    <!-- Bouton d'ajout -->
    <div class="text-end mb-3">
      <button class="btn btn-primary" @click="openAddModal">
        ➕ Ajouter un contenu
      </button>
    </div>

    <!-- Tableau des contenus -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Titre</th>
          <th>Format</th>
          <th>Affiche</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in contenus" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.titre }}</td>
          <td>{{ c.format }}</td>
          <td>
            <img
              :src="c.affiche"
              style="height: 60px; border-radius: 4px;"
              alt=""
            />
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="openEditModal(c)">
               Modifier
            </button>

            <button class="btn btn-danger btn-sm" @click="deleteContenu(c.id)">
               Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL -->
    <div
      class="modal"
      tabindex="-1"
      style="display: block;"
      v-if="showModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Modifier un contenu" : "Ajouter un contenu" }}
            </h5>

            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <!-- Titre -->
              <div class="mb-3">
                <label class="form-label">Titre</label>
                <input type="text" class="form-control" v-model="form.titre" required />
              </div>

              <!-- Affiche -->
              <div class="mb-3">
                <label class="form-label">URL Affiche</label>
                <input type="text" class="form-control" v-model="form.affiche" required />
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="form.description"></textarea>
              </div>

              <!-- Année de sortie -->
              <div class="mb-3">
                <label class="form-label">Année de sortie</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="form.anneeSortie"
                  required
                />
              </div>

              <!-- Vidéo -->
              <div class="mb-3">
                <label class="form-label">URL Vidéo</label>
                <input type="text" class="form-control" v-model="form.video" />
              </div>

              <!-- Format -->
              <div class="mb-3">
                <label class="form-label">Format</label>
                <select class="form-control" v-model="form.format">
                  <option value="film">Film</option>
                  <option value="serie">Série</option>
                </select>
              </div>

              <button class="btn btn-success w-100" type="submit">
                {{ isEditing ? "Enregistrer les modifications" : "Créer le contenu" }}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
