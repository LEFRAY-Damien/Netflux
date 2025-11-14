<!-- LoginView.vue -->

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const userStore = useUserStore();
const router = useRouter();

const submit = async () => {
    try {
        await userStore.login(email.value, password.value);
        router.push("/");
    } catch (error) {
        alert("Email ou mot de passe incorrect");
    }
};
</script>

<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">

                <div class="card shadow-sm">
                    <div class="card-body">
                        <h3 class="text-center mb-4">Connexion</h3>

                        <form @submit.prevent="submit">

                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="email" class="form-control" required />
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Mot de passe</label>
                                <input type="password" v-model="password" class="form-control" required />
                            </div>

                            <button type="submit" class="btn btn-primary w-100">
                                Se connecter
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<style scoped></style>
