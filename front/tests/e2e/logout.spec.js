import { test, expect } from '@playwright/test';

test("Déconnexion utilisateur – logout fonctionne", async ({ page }) => {

  // -------------------------------------------------------
  // 1. Login
  // -------------------------------------------------------
  await page.goto('/login');

  await page.locator('input[type="email"]').fill("lucie.allard@example.org");
  await page.locator('input[type="password"]').fill("password");

  await page.getByRole('button', { name: /se connecter/i }).click();

  // Attendre la redirection vers "/"
  await page.waitForURL('/');
  await expect(page.getByRole('heading', { name: /films & séries/i })).toBeVisible();

  // Vérifier que le token existe après login
  const tokenBefore = await page.evaluate(() => localStorage.getItem("token"));
  expect(tokenBefore).not.toBeNull();


  // -------------------------------------------------------
  //  bouton "Déconnexion"
  // -------------------------------------------------------
  const logoutButton = page.getByRole('button', { name: /déconnexion|logout|se déconnecter/i });

  await expect(logoutButton).toBeVisible();
  await logoutButton.click();


  // -------------------------------------------------------
  //  APP redirige vers "/" 
  // -------------------------------------------------------
  await page.waitForURL('/');

  // Vérifier que l'utilisateur est bien revenu sur la liste
  await expect(page.getByRole('heading', { name: /films & séries/i })).toBeVisible();


  // -------------------------------------------------------
  //  Vérifier que le token est supprimé
  // -------------------------------------------------------
  const tokenAfter = await page.evaluate(() => localStorage.getItem("token"));
  expect(tokenAfter).toBeNull();


  // -------------------------------------------------------
  //  Vérifier que le bouton logout n'est PLUS visible
  // -------------------------------------------------------
  await expect(logoutButton).not.toBeVisible();
});
