import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {

  test('Admin can log in successfully', async ({ page }) => {
    // Navigate to your login page (adjust URL if needed)
    await page.goto('http://localhost:4200/login');

    // Fill in the admin credentials created earlier
    await page.fill('input[type="email"]', 'admin@admin.com');
    await page.fill('input[type="password"]', 'password123');

    // Click the login button
    await page.click('button[type="submit"]');

    // Assert that the user is redirected to the admin dashboard
    await expect(page).toHaveURL(/.*admin/);
    
    // Check that a specific dashboard element is visible
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('New user can register successfully', async ({ page }) => {
    // Navigate to the registration page
    await page.goto('http://localhost:4200/register');

    // Fill out the registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', 'testuser1@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Click the register button
    await page.click('button[type="submit"]');

    // Assert successful registration (e.g., redirect to login or check for success message)
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('text=Registration successful')).toBeVisible();
  });

});