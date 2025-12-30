/**
 * E2E tests for clipboard copy functionality
 * Tests full copy workflow with clipboard verification
 */

import { test, expect } from '@playwright/test';

test.describe('Clipboard Copy E2E', () => {
  // T068: Full copy workflow with clipboard verification
  test('should copy Morse code to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');

    // Enter text
    const textInput = page.locator('#text-input');
    await textInput.fill('HELLO');

    // Wait for translation
    await page.waitForTimeout(400);

    // Click copy Morse button
    const copyMorseButton = page.locator('#copy-morse');
    await copyMorseButton.click();

    // Wait a bit for copy to complete
    await page.waitForTimeout(200);

    // Verify toast notification appears
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/copied/i);

    // Verify clipboard contents
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('....');
    expect(clipboardText).toContain('---');
  });

  test('should copy text output to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');

    // Enter Morse code
    const morseInput = page.locator('#morse-input');
    await morseInput.fill('... --- ...');

    await page.waitForTimeout(400);

    // Click copy text button
    const copyTextButton = page.locator('#copy-text');
    await copyTextButton.click();

    await page.waitForTimeout(200);

    // Verify clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('SOS');
  });

  test('should show warning when copying empty output', async ({ page }) => {
    await page.goto('/');

    // Try to copy with no content
    const copyButton = page.locator('#copy-morse');
    await copyButton.click();

    // Should show some feedback (toast or error)
    const feedback = page.locator('.toast, #error-display');
    await expect(feedback).toBeVisible();
  });

  test('should auto-dismiss toast notification', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');

    const textInput = page.locator('#text-input');
    await textInput.fill('TEST');

    await page.waitForTimeout(400);

    const copyButton = page.locator('#copy-morse');
    await copyButton.click();

    // Toast should appear
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();

    // Toast should disappear after 3 seconds
    await page.waitForTimeout(3500);
    await expect(toast).not.toBeVisible();
  });
});
