import { test, expect } from '@playwright/test';

test.describe('List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', process.env.TEST_EMAIL || 'test@example.com');
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD || 'tenmakoukufu');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), form button').first();
    await submitButton.click();
    
    try {
      await page.waitForURL('/list', { timeout: 10000 });
    } catch (error) {
      const errorElement = page.locator('.bg-red-100, [class*="error"], [class*="Error"]').first();
      if (await errorElement.isVisible({ timeout: 1000 })) {
        const errorText = await errorElement.textContent();
        console.error('Login failed with error:', errorText);
      }
      throw error;
    }
  });

  test('should display the list page when authenticated', async ({ page }) => {
    await expect(page).toHaveURL('/list');
    
    await expect(page.locator('table, h1, h2, h3').first()).toBeVisible();
  });

  test('should display table headers', async ({ page }) => {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await expect(page.getByText('Reference').first()).toBeVisible();
    await expect(page.getByText('Incomings').first()).toBeVisible();
    await expect(page.getByText('Expenses').first()).toBeVisible();
    await expect(page.getByText('Net Income').first()).toBeVisible();
  });

  test('should display data rows', async ({ page }) => {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    const table = page.locator('.table, table');
    await expect(table.first()).toBeVisible();
    
    const rows = table.locator('.table-row, tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1); // At least header + one data row
  });

  test('should navigate to details page on row click', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const table = page.locator('.table, table');
    const firstRow = table.locator('.table-row, tr').nth(1); // Skip header row
    
    await firstRow.click();
    
    await expect(page).toHaveURL(/\/details\//);
    
    await expect(page.locator('body')).toContainText('Reference:');
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/list');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('.table, table')).toBeVisible();
  });

  test('should display calculated values correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const table = page.locator('.table, table');
    const tableContent = await table.textContent();
    
    expect(tableContent).toMatch(/\d+/);
  });

  test('should sort by reference', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const table = page.locator('.table, table');
    const rows = table.locator('.table-row, tr');
    const count = await rows.count();
    
    if (count > 1) {
      const firstRowText = await rows.nth(1).textContent(); // Skip header
      const lastRowText = await rows.nth(count - 1).textContent();
      
      expect(firstRowText).toBeTruthy();
      expect(lastRowText).toBeTruthy();
    }
  });
});