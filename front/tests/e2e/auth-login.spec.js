import { test, expect } from '@playwright/test';

test("Connexion utilisateur – login fonctionne", async ({ page }) => {

  // 1. Aller sur /login
  await page.goto('/login');

  // 2. Vérifier que la page login s'affiche bien
  await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible();

  // 3. Remplir email + mot de passe
  await page.locator('input[type="email"]').fill("lucie.allard@example.org");
  await page.locator('input[type="password"]').fill("password");

  // 4. Cliquer sur "Se connecter"
  await page.getByRole('button', { name: /se connecter/i }).click();

  // 5. Attendre redirection vers la liste
  await page.waitForURL('/');
  await page.waitForLoadState('networkidle');

  // 6. Vérifier que l'accueil Films & Séries est bien affiché
  await expect(page.getByRole('heading', { name: /films & séries/i })).toBeVisible();

  // 7. Vérifier que le token a bien été enregistré
  const token = await page.evaluate(() => localStorage.getItem("token"));
  expect(token).not.toBeNull();
});
