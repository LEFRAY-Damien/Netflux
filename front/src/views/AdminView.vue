<template>
  <div class="container mt-4">
    <h1 class="mb-4">Administration des contenus</h1>

    <div class="mb-3 text-end">
      <button class="btn btn-primary" @click="openCreate">
        ➕ Ajouter un contenu
      </button>
    </div>

    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Titre</th>
          <th>Affiche</th>
          <th>Format</th>
          <th>Genres</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in contenus" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.titre }}</td>
          <td><img :src="c.affiche" class="img-thumbnail" width="60" /></td>
          <td>{{ c.format }}</td>
          <td>
            <span v-if="Array.isArray(c.genres)" v-for="g in c.genres" :key="g.id" class="badge bg-secondary me-1">{{ g.nom }}</span>
            <span v-else>—</span>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="openEdit(c.id)">Modifier</button>
            <button class="btn btn-danger btn-sm" @click="deleteItem(c.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="modalForm" tabindex="-1" aria-hidden="true" ref="modalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="submitForm">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? "Modifier le contenu" : "Créer un contenu" }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

              <div class="mb-3">
                <label class="form-label">Titre</label>
                <input class="form-control" v-model="form.titre" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Affiche (URL)</label>
                <input class="form-control" v-model="form.affiche" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="form.description" required></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Année de sortie</label>
                <input type="date" class="form-control" v-model="form.anneeSortie" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Vidéo (URL)</label>
                <input class="form-control" v-model="form.video" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Format</label>
                <select class="form-select" v-model="form.format" required>
                  <option value="film">Film</option>
                  <option value="serie">Série</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Genres (Ctrl + clic pour multisélection)</label>
                <select class="form-select" multiple v-model="form.genres">
                  <option v-for="g in allGenres" :key="g.id" :value="g['@id']">{{ g.nom }}</option>
                </select>
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? "Enregistrer" : "Créer" }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from "@/api/axios.js";
import * as bootstrap from "bootstrap";

export default {
  data() {
    return {
      contenus: [],
      allGenres: [],
      isEditing: false,
      currentId: null,
      modalInstance: null,
      form: {
        titre: "",
        affiche: "",
        description: "",
        anneeSortie: "",
        video: "",
        format: "film",
        genres: []
      }
    };
  },

  methods: {
    async loadContenus() {
      const r = await api.get("/contenus");
      this.contenus = r.data.member || [];
    },

    async loadGenres() {
      const r = await api.get("/genres");
      this.allGenres = r.data.member || [];
    },

    openCreate() {
      this.isEditing = false;
      this.resetForm();
      this.showModal();
    },

    async openEdit(id) {
      const r = await api.get(`/contenus/${id}`);
      const item = r.data;

      this.isEditing = true;
      this.currentId = id;

      this.form.titre = item.titre;
      this.form.affiche = item.affiche;
      this.form.description = item.description;
      this.form.anneeSortie = item.anneeSortie?.split("T")[0] || "";
      this.form.video = item.video;
      this.form.format = item.format;

      this.form.genres = Array.isArray(item.genres)
        ? item.genres.map(g => g["@id"])
        : [];

      this.showModal();
    },

    resetForm() {
      this.form = {
        titre: "",
        affiche: "",
        description: "",
        anneeSortie: "",
        video: "",
        format: "film",
        genres: []
      };
    },

    showModal() {
      if (!this.modalInstance) {
        const el = document.getElementById("modalForm");
        this.modalInstance = new bootstrap.Modal(el);
      }
      this.modalInstance.show();
    },

    closeModal() {
      if (this.modalInstance) this.modalInstance.hide();
    },

    async submitForm() {
      const payload = {
        titre: this.form.titre,
        affiche: this.form.affiche,
        description: this.form.description,
        anneeSortie: this.form.anneeSortie,
        video: this.form.video,
        format: this.form.format,
        genres: this.form.genres
      };

      if (this.isEditing) {
        await api.patch(`/contenus/${this.currentId}`, payload, {
          headers: { "Content-Type": "application/merge-patch+json" }
        });
      } else {
        await api.post(`/contenus`, payload, {
          headers: { "Content-Type": "application/ld+json" }
        });
      }

      await this.loadContenus();
      this.closeModal();
    },

    async deleteItem(id) {
      if (!confirm("Confirmer la suppression ?")) return;
      await api.delete(`/contenus/${id}`);
      this.loadContenus();
    }
  },

  async mounted() {
    await this.loadContenus();
    await this.loadGenres();
  }
};
</script>
