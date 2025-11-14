// front/src/main.js

import { createApp } from "vue";
import App from "./App.vue";

// Router
import router from "@/router/index.js";

// Pinia
import { createPinia } from "pinia";

// 🔥 Import CSS + JS Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

