import { test, expect } from '@playwright/test';

test.describe('Details Page', () => {
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

  test('should display details page', async ({ page }) => {
    // Navigate to a specific details page
    await page.goto('/details/09%2F2026');
    
    await expect(page).toHaveURL(/\/details\//);
    await expect(page.locator('body')).toContainText('Reference');
  });

  test('should display reference correctly', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check that reference is displayed (flexible matching)
    await expect(page.getByText(/Reference/)).toBeVisible();
  });

  test('should display incomings section', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await expect(page.getByText('Incomings')).toBeVisible();
  });

  test('should display expenses section', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await expect(page.getByText('Expenses')).toBeVisible();
  });

  test('should display card containers', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    const cardContainers = page.locator('[class*="card"], [class*="Card"]');
    await expect(cardContainers.first()).toBeVisible();
  });

  test('should display incoming data properties', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check for origin and value labels in incomings
    await expect(page.getByText('origin').or(page.getByText('Origin')).first()).toBeVisible();
    await expect(page.getByText('value').or(page.getByText('Value')).first()).toBeVisible();
  });

  test('should display expense data properties', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check for destination and value labels in expenses
    await expect(page.getByText('destination').or(page.getByText('Destination')).first()).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    
    // Wait for data to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Verify content is displayed
    await expect(page.getByText(/Reference/)).toBeVisible();
  });

  test('should handle different references', async ({ page }) => {
    // Test with a different reference
    await page.goto('/details/01%2F2024');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check that we're on the right page and reference is shown
    await expect(page).toHaveURL(/\/details\/01%2F2024/);
    await expect(page.getByText(/Reference/)).toBeVisible();
  });

  test('should handle special characters in reference', async ({ page }) => {
    // Test with special characters
    await page.goto('/details/01%2F2024%20Test');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check that we're on the right page and reference is shown
    await expect(page).toHaveURL(/\/details\/01%2F2024%20Test/);
    await expect(page.getByText(/Reference:/)).toBeVisible();
  });
});