// front/src/main.js

import { createApp } from "vue";
import App from "./App.vue";

// 🔥 Import du router
import router from "@/router/index.js";

// 🔥 Import de Pinia
import { createPinia } from "pinia";

const app = createApp(App);

// on ajoute Pinia
app.use(createPinia());

// on ajoute le router
app.use(router);

// puis on monte l'app
app.mount("#app");
