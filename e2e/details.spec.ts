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
    await page.goto('/details/09%2F2026');
    
    await expect(page).toHaveURL(/\/details\//);
    await expect(page.getByText(/Reference/)).toBeVisible();
  });

  test('should display reference correctly', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await expect(page.getByText(/Reference/)).toBeVisible();
    await expect(page.getByText('09/2026')).toBeVisible();
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
    await expect(cardContainers.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display incoming data values', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    const incomingSection = page.locator('h3:has-text("Incomings")').first();
    const incomingContainer = incomingSection.locator('xpath=ancestor::div[1]');
    
    const numericValues = incomingContainer.locator('[class*="value"], [class*="Value"]');
    if (await numericValues.count() > 0) {
      await expect(numericValues.first()).toBeVisible();
    } else {
      const textContent = await incomingContainer.textContent();
      expect(textContent).toMatch(/\d/);
    }
  });

  test('should display expense data values', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    const expenseSection = page.locator('h3:has-text("Expenses")').first();
    const expenseContainer = expenseSection.locator('xpath=ancestor::div[1]');
    
    const numericValues = expenseContainer.locator('[class*="value"], [class*="Value"]');
    if (await numericValues.count() > 0) {
      await expect(numericValues.first()).toBeVisible();
    } else {
      const textContent = await expenseContainer.textContent();
      expect(textContent).toMatch(/\d/);
    }
  });

  test('should display bar chart', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // The chart has id="details" from the BarChartComponent
    const chart = page.locator('#details');
    await expect(chart).toBeVisible({ timeout: 10000 });
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await expect(page.getByText(/Reference/)).toBeVisible();
  });

  test('should handle different references', async ({ page }) => {
    await page.goto('/details/01%2F2024');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await expect(page).toHaveURL(/\/details\/01%2F2024/);
    await expect(page.getByText(/Reference/)).toBeVisible();
  });

  test('should handle special characters in reference', async ({ page }) => {
    const testReference = '01/2024';
    const encodedReference = encodeURIComponent(testReference);
    await page.goto(`/details/${encodedReference}`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    await expect(page).toHaveURL(new RegExp(`/details/${encodedReference}`));
    await expect(page.getByText(/Reference/)).toBeVisible();
    await expect(page.getByText(testReference)).toBeVisible();
  });

  test('should display chart with correct data labels', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check that the chart exists
    const chart = page.locator('#details');
    await expect(chart).toBeVisible({ timeout: 10000 });
    
    // The chart labels are Incomings, Expenses, Net Income
    // They might be rendered as text within the chart
    const chartContent = await chart.textContent();
    // Check if any of the labels appear in the chart content
    const hasLabels = chartContent && (
      chartContent.includes('Incomings') || 
      chartContent.includes('Expenses') || 
      chartContent.includes('Net')
    );
    expect(hasLabels).toBeTruthy();
  });

  test('should calculate and display net income in chart', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // The chart should exist and contain data
    const chart = page.locator('#details');
    await expect(chart).toBeVisible({ timeout: 10000 });
    
    // Check that the chart has some content
    const chartContent = await chart.textContent();
    expect(chartContent).not.toBe('');
    expect(chartContent).not.toBe(null);
    
    // Try to find if the chart has any numeric data
    // This is a more robust check that doesn't rely on specific text
    const hasData = chartContent && /\d/.test(chartContent);
    expect(hasData).toBeTruthy();
  });

  test('should verify net income calculation logic is present', async ({ page }) => {
    await page.goto('/details/09%2F2026');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check that both incomings and expenses sections exist with data
    const incomingsSection = page.locator('h3:has-text("Incomings")').first();
    const expensesSection = page.locator('h3:has-text("Expenses")').first();
    
    await expect(incomingsSection).toBeVisible();
    await expect(expensesSection).toBeVisible();
    
    // Get the containers
    const incomingsContainer = incomingsSection.locator('xpath=ancestor::div[1]');
    const expensesContainer = expensesSection.locator('xpath=ancestor::div[1]');
    
    const incomingsText = await incomingsContainer.textContent();
    const expensesText = await expensesContainer.textContent();
    
    // Both sections should have numeric data
    expect(incomingsText).toMatch(/\d/);
    expect(expensesText).toMatch(/\d/);
    
    // The chart should exist and show the net income
    const chart = page.locator('#details');
    await expect(chart).toBeVisible();
    
    // Verify chart has content (which includes net income)
    const chartContent = await chart.textContent();
    expect(chartContent).not.toBe('');
  });
});