import { test, expect } from '@playwright/test';

test('Affichage de la page Films & Séries', async ({ page }) => {

  // Aller sur la page d'accueil Vue
  await page.goto('/');

  // Vérifier que le titre principal apparaît
  await expect(page.getByRole('heading', { name: 'Films & Séries' })).toBeVisible();

  // Attendre que les contenus soient chargés (API Platform)
  await page.waitForLoadState('networkidle');

  // Vérifier que l’API renvoie au moins 1 film ou série
  const films = page.locator('h4', { hasText: "🎬 Films" });
  const series = page.locator('h4', { hasText: "📺 Séries" });

  const filmsVisible = await films.isVisible().catch(() => false);
  const seriesVisible = await series.isVisible().catch(() => false);

  expect(filmsVisible || seriesVisible).toBeTruthy();

  // Vérifier que le message "Aucun contenu trouvé" n'est pas affiché
  await expect(page.locator('text=Aucun contenu trouvé')).toHaveCount(0);

});
