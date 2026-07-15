import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('CSV/Excel data import flow', () => {
  test('user can upload and preview a suppliers CSV file', async ({ page }) => {
    // 1. Sign up a new user to access the dashboard
    const uniqueEmail = `e2e-import-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.getByLabel('Your name').fill('Import Test User');
    await page.getByLabel('Organization name').fill('Import Test Org');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('TestPassword123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    // 2. Navigate to the Upload page
    await page.goto('/upload');
    await expect(page.getByRole('heading', { name: 'Upload data' })).toBeVisible();

    // 3. Ensure we are on the Suppliers tab (it should be the default, but let's click it to be safe)
    const suppliersTab = page.getByRole('tab', { name: 'Suppliers' });
    await suppliersTab.click();

    // 4. Set the file on the input
    const fileInput = page.locator('input[type="file"]').first();
    const filePath = path.join(__dirname, 'fixtures', 'suppliers.csv');
    await fileInput.setInputFiles(filePath);

    // 5. Assert that the data is parsed and displayed in the preview table
    await expect(page.getByText('4 rows detected')).toBeVisible();
    
    // Check for specific data from the CSV fixture
    await expect(page.getByRole('cell', { name: 'Acme Corp' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Special Chars & Co.' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'San Francisco, CA' })).toBeVisible();
    
    // 6. Confirm the import
    await page.getByRole('button', { name: 'Confirm & process' }).click();

    // 7. Wait for success toast
    await expect(page.getByText('Upload complete')).toBeVisible();
    await expect(page.getByText('4 suppliers imported')).toBeVisible();
  });
});
