import { mount } from "@vue/test-utils";
import MovieListView from "@/views/MovieListView.vue";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createMemoryHistory } from "vue-router";

describe("MovieListView.vue", () => {

  // ➤ FAKE ROUTER minimal
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: MovieListView }
    ]
  });

  it("affiche 'Aucun contenu trouvé' si API retourne vide", async () => {
    
    const wrapper = mount(MovieListView, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { token: null }
            }
          }),
          router
        ]
      }
    });

    await router.isReady();   // important !
    await new Promise(resolve => setTimeout(resolve, 50)); // attendre loadContenus()

    expect(wrapper.html()).toContain("Aucun contenu trouvé");
  });

});
