import { test, expect } from '@playwright/test';

test('should have title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vue content sample/);
});

test('should substitute variables reactively', async ({ page }) => {
  await page.goto('/');
  const button = page.getByText(/count is/)
  await button.click()
  await button.click()

  await expect(button).toContainText(/count is 2/);
});

test('should switch locale', async ({ page }) => {
  await page.goto('/');

  await page.getByText(/^se$/).click()
  const currentLocaleSe = await page.getByText("Vald översättning")
  await expect(currentLocaleSe).toContainText(/Vald översättning: se/);

  await page.getByText(/^en$/).click()
  const currentLocaleEn = await page.getByText("Current locale")
  await expect(currentLocaleEn).toContainText(/Current locale: en/);
});