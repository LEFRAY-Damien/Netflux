import { mount } from "@vue/test-utils";
import MovieListView from "@/views/MovieListView.vue";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createMemoryHistory } from "vue-router";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";

server.use(
  http.get("http://localhost:8000/api/contenus", () => {
    return HttpResponse.json({
      "@context": "/api/contexts/Contenu",
      "@id": "/api/contenus",
      "@type": "Collection",
      totalItems: 3,
      member: [
        { id: 1, titre: "Inception", format: "film", affiche: "" },
        { id: 2, titre: "Avatar", format: "film", affiche: "" },
        { id: 3, titre: "Breaking Bad", format: "serie", affiche: "" }
      ]
    })
  })
);

describe("MovieListView.vue - affichage des films et séries", () => {

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: MovieListView }]
  });

  it("affiche 2 films et 1 série", async () => {

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

    await router.isReady();

    await new Promise(resolve => setTimeout(resolve, 60));

    const html = wrapper.html();
 
    expect(html).toContain("🎬 Films");
    expect(html).toContain("Inception");
    expect(html).toContain("Avatar");

    expect(html).toContain("📺 Séries");
    expect(html).toContain("Breaking Bad");
  });

});
