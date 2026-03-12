import { expect, test } from "@playwright/test";

test("deve exibir cards de criadoras na home", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Criadoras proximas de voce" })).toBeVisible();
  await expect(page.getByText("Ana Souza")).toBeVisible();
});
