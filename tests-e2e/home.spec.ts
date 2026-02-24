import { test, expect } from '@playwright/test';

test('has expected title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Auris/);
});
