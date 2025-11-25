<template>
  <div class="container mt-4">

    <!-- TABS -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'contenus' }" @click="activeTab = 'contenus'">
          🎬 Contenus
        </button>
      </li>

      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
          👤 Utilisateurs
        </button>
      </li>
    </ul>

    <!-- ======================================================================
         ONGLET CONTENUS  (TON CODE ORIGINAL)
    ====================================================================== -->
    <div v-if="activeTab === 'contenus'">

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
            <td><img :src="c.affiche" width="60" class="img-thumbnail" /></td>
            <td>{{ c.format }}</td>
            <td>
              <span v-if="Array.isArray(c.genres)" v-for="g in c.genres" :key="g.id"
                    class="badge bg-secondary me-1">
                {{ g.nom }}
              </span>
              <span v-else>—</span>
            </td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="openEdit(c.id)">Modifier</button>
              <button class="btn btn-danger btn-sm" @click="deleteItem(c.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Contenu -->
      <div class="modal fade" id="modalForm" tabindex="-1" ref="modalEl">
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="submitForm">
              <div class="modal-header">
                <h5 class="modal-title">
                  {{ isEditing ? "Modifier le contenu" : "Créer un contenu" }}
                </h5>
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
                  <select class="form-select" v-model="form.format">
                    <option value="film">Film</option>
                    <option value="serie">Série</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Genres</label>
                  <select class="form-select" multiple v-model="form.genres">
                    <option v-for="g in allGenres" :value="g['@id']" :key="g.id">
                      {{ g.nom }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? "Enregistrer" : "Créer" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================================
         ONGLET UTILISATEURS
    ====================================================================== -->
    <div v-if="activeTab === 'users'">

      <h2 class="mb-4">Gestion des utilisateurs</h2>

      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rôles</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.roles.join(', ') }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="openUserEdit(u)">
                Modifier
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteUser(u.id)">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Utilisateur -->
      <div class="modal fade" id="modalUser" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="submitUser">

              <div class="modal-header">
                <h5 class="modal-title">Modifier utilisateur</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">

                <div class="mb-3">
                  <label>Email</label>
                  <input class="form-control" v-model="userForm.email" />
                </div>

                <div class="mb-3">
                  <label>Rôles (séparés par virgule)</label>
                  <input class="form-control" v-model="rolesInput" />
                </div>

              </div>

              <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">
                  Annuler
                </button>
                <button class="btn btn-primary">Enregistrer</button>
              </div>

            </form>
          </div>
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
      activeTab: "contenus",

      // contenus
      contenus: [],
      allGenres: [],
      form: {},
      isEditing: false,
      currentId: null,
      modalInstance: null,

      // utilisateurs
      users: [],
      userForm: {},
      rolesInput: "",
      modalUser: null
    };
  },

  methods: {
    /* ===========================
       CONTENUS
    ============================ */
    async loadContenus() {
      const r = await api.get("/contenus");
      this.contenus = r.data.member || r.data["hydra:member"] || [];
    },

    async loadGenres() {
      const r = await api.get("/genres");
      this.allGenres = r.data.member || r.data["hydra:member"] || [];
    },

    openCreate() {
      this.isEditing = false;
      this.form = {
        titre: "",
        affiche: "",
        description: "",
        anneeSortie: "",
        video: "",
        format: "film",
        genres: []
      };
      this.showModal();
    },

    async openEdit(id) {
      const r = await api.get(`/contenus/${id}`);
      const item = r.data;

      this.isEditing = true;
      this.currentId = id;

      this.form = {
        titre: item.titre,
        affiche: item.affiche,
        description: item.description,
        anneeSortie: item.anneeSortie?.split("T")[0],
        video: item.video,
        format: item.format,
        genres: item.genres?.map(g => g["@id"]) || []
      };

      this.showModal();
    },

    showModal() {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal("#modalForm");
      }
      this.modalInstance.show();
    },

    closeModal() {
      if (this.modalInstance) this.modalInstance.hide();
    },

    async submitForm() {
      const payload = { ...this.form };

      if (this.isEditing) {
        await api.patch(`/contenus/${this.currentId}`, payload, {
          headers: { "Content-Type": "application/merge-patch+json" }
        });
      } else {
        await api.post("/contenus", payload);
      }

      this.loadContenus();
      this.closeModal();
    },

    async deleteItem(id) {
      if (!confirm("Confirmer la suppression ?")) return;
      await api.delete(`/contenus/${id}`);
      this.loadContenus();
    },

    /* ===========================
       UTILISATEURS
    ============================ */
    async loadUsers() {
      const r = await api.get("/utilisateurs");
      this.users = r.data["hydra:member"] || r.data.member || [];
    },

    openUserEdit(user) {
      this.userForm = { ...user };
      this.rolesInput = user.roles.join(", ");

      if (!this.modalUser) {
        this.modalUser = new bootstrap.Modal("#modalUser");
      }
      this.modalUser.show();
    },

    async submitUser() {
      const payload = {
        email: this.userForm.email,
        roles: this.rolesInput.split(",").map(r => r.trim())
      };

      await api.patch(`/utilisateurs/${this.userForm.id}`, payload, {
        headers: { "Content-Type": "application/merge-patch+json" }
      });

      this.loadUsers();
      this.modalUser.hide();
    },

    async deleteUser(id) {
      if (!confirm("Supprimer cet utilisateur ?")) return;
      await api.delete(`/utilisateurs/${id}`);
      this.loadUsers();
    }
  },

  async mounted() {
    await this.loadContenus();
    await this.loadGenres();
    await this.loadUsers();
  }
};
</script>
