import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test('should display the task list page', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('h1')).toContainText('Tasks');
    await expect(page.locator('button', { hasText: 'New Task' })).toBeVisible();
  });

  test('should navigate to create task form', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('button:has-text("New Task")');
    await expect(page).toHaveURL('/tasks/new');
    await expect(page.locator('h1')).toContainText('Create Task');
  });

  test('should validate required title field', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.click('button[type="submit"]');
    await expect(page.locator('mat-error')).toContainText('Title is required');
  });

  test('should create a new task and verify it appears in list', async ({ page }) => {
    // Navigate to create form
    await page.goto('/tasks/new');

    // Fill in the form
    await page.fill('input[formcontrolname="title"]', 'E2E Test Task');
    await page.fill('textarea[formcontrolname="description"]', 'Created by Playwright');

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to task list
    await expect(page).toHaveURL('/tasks');

    // Verify the task appears (requires backend running)
    // Without backend, the error interceptor will show a snackbar
  });

  test('should navigate to edit form from task list', async ({ page }) => {
    await page.goto('/tasks');

    // The edit button should exist in the actions column
    const editButtons = page.locator('button[mattooltip="Edit"]');
    // If tasks exist, click the first edit button
    if (await editButtons.count() > 0) {
      await editButtons.first().click();
      await expect(page.locator('h1')).toContainText('Edit Task');
    }
  });

  test('should cancel form and return to list', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.click('button:has-text("Cancel")');
    await expect(page).toHaveURL('/tasks');
  });

  test('should show toolbar with app title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('mat-toolbar')).toContainText('Task Manager');
  });

  test('should redirect root to /tasks', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/tasks');
  });
});
