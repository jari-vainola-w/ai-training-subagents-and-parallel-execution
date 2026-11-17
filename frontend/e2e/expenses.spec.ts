import { test, expect } from '@playwright/test';

test('app loads and shows the expense tracker heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /expense tracker/i })).toBeVisible();
});

test('can add an expense and see it in the list', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Description').fill('Test expense');
  await page.getByLabel('Amount (€)').fill('25');
  await page.getByLabel('Date').fill('2024-03-01');
  await page.getByRole('button', { name: /add expense/i }).click();
  await expect(page.getByText('Test expense')).toBeVisible();
});
