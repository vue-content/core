import { test, expect } from '@playwright/test'

test('should have title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Vue content sample/)
})

test('should substitute variables reactively', async ({ page }) => {
  await page.goto('/')
  const button = page.getByText(/count is/)
  await button.click()
  await button.click()

  await expect(button).toContainText(/count is 2/)
})

test('should switch locale', async ({ page }) => {
  await page.goto('/')

  await page.getByText(/^se$/).click()
  const currentLocaleSe = page.getByText('Vald översättning')
  await expect(currentLocaleSe).toContainText(/Vald översättning: se/)

  await page.getByText(/^en$/).click()
  const currentLocaleEn = page.getByText('Current locale')
  await expect(currentLocaleEn).toContainText(/Current locale: en/)
})

test('should toggle buttons', async ({ page }) => {
  await page.goto('/')

  const header = page.locator('h3')
  const previousButton = page.getByText('Previous')
  const nextButton = page.getByText('Next')

  await expect(header).toContainText(/Wizard step 1/)
  await expect(previousButton).not.toBeVisible()
  await expect(nextButton).toBeVisible()

  await page.getByText(/^Next$/).click()
  await expect(header).toContainText(/Wizard step 2/)
  await expect(previousButton).toBeVisible()
  await expect(nextButton).toBeVisible()

  await page.getByText(/^Next$/).click()
  await expect(header).toContainText(/Wizard step 3/)
  await expect(previousButton).toBeVisible()
  await expect(nextButton).not.toBeVisible()
})
