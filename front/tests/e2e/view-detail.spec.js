import { test, expect } from '@playwright/test';

test("Navigation vers la page détail d’un film ou d’une série", async ({ page }) => {

  // 1. Ouvrir la liste
  await page.goto('/');

  // Vérifier la page d'accueil
  await expect(page.getByRole('heading', { name: 'Films & Séries' })).toBeVisible();

  // Attendre les contenus API
  await page.waitForLoadState('networkidle');

  //  Trouver la première carte
  const firstCard = page.locator('.card').first();
  await expect(firstCard).toBeVisible();

  //  Trouver le bouton Voir détail
  const btn = firstCard.getByRole('button', { name: /Voir détail/i });
  await expect(btn).toBeVisible();

  //  Cliquer et attendre navigation → /contenu/{id}
  await Promise.all([
    page.waitForURL(/\/contenu\/\d+$/),
    btn.click(),
  ]);

  //  Attendre chargement API
  await page.waitForLoadState('networkidle');

  //  Vérifier que l'affiche est visible
  const image = page.locator('img[alt="Affiche"]');
  await expect(image).toBeVisible();

  //  Vérifier que le titre (h2.fw-bold) est visible
  const titre = page.locator('h2.fw-bold');
  await expect(titre).toBeVisible();

  //  Vérifier le bloc Format :
  const format = page.getByText('Format :', { exact: false });
  await expect(format).toBeVisible();

  //  Vérifier la présence de "Description :"
  const descriptionLabel = page.getByText('Description :', { exact: false });
  await expect(descriptionLabel).toBeVisible();
});
