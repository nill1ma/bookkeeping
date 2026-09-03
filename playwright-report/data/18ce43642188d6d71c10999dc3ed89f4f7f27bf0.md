# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: details.spec.ts >> Details Page >> should display details page
- Location: e2e/details.spec.ts:24:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Details Page', () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto('/login');
      |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  6   |     await page.fill('input[name="email"]', process.env.TEST_EMAIL || 'test@example.com');
  7   |     await page.fill('input[name="password"]', process.env.TEST_PASSWORD || 'tenmakoukufu');
  8   |     
  9   |     const submitButton = page.locator('button[type="submit"], button:has-text("Login"), form button').first();
  10  |     await submitButton.click();
  11  |     
  12  |     try {
  13  |       await page.waitForURL('/list', { timeout: 10000 });
  14  |     } catch (error) {
  15  |       const errorElement = page.locator('.bg-red-100, [class*="error"], [class*="Error"]').first();
  16  |       if (await errorElement.isVisible({ timeout: 1000 })) {
  17  |         const errorText = await errorElement.textContent();
  18  |         console.error('Login failed with error:', errorText);
  19  |       }
  20  |       throw error;
  21  |     }
  22  |   });
  23  | 
  24  |   test('should display details page', async ({ page }) => {
  25  |     // Navigate to a specific details page
  26  |     await page.goto('/details/09%2F2026');
  27  |     
  28  |     await expect(page).toHaveURL(/\/details\//);
  29  |     await expect(page.locator('body')).toContainText('Reference');
  30  |   });
  31  | 
  32  |   test('should display reference correctly', async ({ page }) => {
  33  |     await page.goto('/details/09%2F2026');
  34  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  35  |     
  36  |     // Check that reference is displayed (flexible matching)
  37  |     await expect(page.getByText(/Reference/)).toBeVisible();
  38  |   });
  39  | 
  40  |   test('should display incomings section', async ({ page }) => {
  41  |     await page.goto('/details/09%2F2026');
  42  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  43  |     
  44  |     await expect(page.getByText('Incomings')).toBeVisible();
  45  |   });
  46  | 
  47  |   test('should display expenses section', async ({ page }) => {
  48  |     await page.goto('/details/09%2F2026');
  49  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  50  |     
  51  |     await expect(page.getByText('Expenses')).toBeVisible();
  52  |   });
  53  | 
  54  |   test('should display card containers', async ({ page }) => {
  55  |     await page.goto('/details/09%2F2026');
  56  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  57  |     
  58  |     const cardContainers = page.locator('[class*="card"], [class*="Card"]');
  59  |     await expect(cardContainers.first()).toBeVisible();
  60  |   });
  61  | 
  62  |   test('should display incoming data properties', async ({ page }) => {
  63  |     await page.goto('/details/09%2F2026');
  64  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  65  |     
  66  |     // Check for origin and value labels in incomings
  67  |     await expect(page.getByText('origin').or(page.getByText('Origin')).first()).toBeVisible();
  68  |     await expect(page.getByText('value').or(page.getByText('Value')).first()).toBeVisible();
  69  |   });
  70  | 
  71  |   test('should display expense data properties', async ({ page }) => {
  72  |     await page.goto('/details/09%2F2026');
  73  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  74  |     
  75  |     // Check for destination and value labels in expenses
  76  |     await expect(page.getByText('destination').or(page.getByText('Destination')).first()).toBeVisible();
  77  |   });
  78  | 
  79  |   test('should handle loading state', async ({ page }) => {
  80  |     await page.goto('/details/09%2F2026');
  81  |     
  82  |     // Wait for data to load
  83  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  84  |     
  85  |     // Verify content is displayed
  86  |     await expect(page.getByText(/Reference/)).toBeVisible();
  87  |   });
  88  | 
  89  |   test('should handle different references', async ({ page }) => {
  90  |     // Test with a different reference
  91  |     await page.goto('/details/01%2F2024');
  92  |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  93  |     
  94  |     // Check that we're on the right page and reference is shown
  95  |     await expect(page).toHaveURL(/\/details\/01%2F2024/);
  96  |     await expect(page.getByText(/Reference/)).toBeVisible();
  97  |   });
  98  | 
  99  |   test('should handle special characters in reference', async ({ page }) => {
  100 |     // Test with special characters
  101 |     await page.goto('/details/01%2F2024%20Test');
  102 |     await page.waitForLoadState('networkidle', { timeout: 15000 });
  103 |     
  104 |     // Check that we're on the right page and reference is shown
  105 |     await expect(page).toHaveURL(/\/details\/01%2F2024%20Test/);
```