import { expect, test } from "@playwright/test";

test("deve redirecionar a home para a tela de login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole("heading", { name: /Bem-vindo de volta/i })).toBeVisible();
});
