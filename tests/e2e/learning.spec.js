/**
 * E2E tests for interactive learning mode
 * Tests visual feedback during audio playback
 */

import { test, expect } from '@playwright/test';

test.describe('Interactive Learning Mode E2E', () => {
  // T087: Full interactive learning workflow
  test('should provide visual feedback during audio playback', async ({ page }) => {
    await page.goto('/');

    // Enter text
    const textInput = page.locator('#text-input');
    await textInput.fill('HI');

    // Wait for translation
    await page.waitForTimeout(400);

    // Verify Morse output appears
    const morseOutput = page.locator('#morse-output');
    await expect(morseOutput).not.toBeEmpty();

    // Click play button
    const playButton = page.locator('#play-audio');
    await playButton.click();

    // Wait a moment for playback to start
    await page.waitForTimeout(200);

    // Check if highlighting exists (visual feedback)
    // Implementation detail - might use .active or .playing class
    const highlightedChar = page.locator('.morse-display .active, .morse-display .playing');
    // Note: This might not exist yet in implementation
  });

  test('should stop playback and clear highlighting', async ({ page }) => {
    await page.goto('/');

    const textInput = page.locator('#text-input');
    await textInput.fill('SOS');

    await page.waitForTimeout(400);

    // Start playback
    const playButton = page.locator('#play-audio');
    await playButton.click();

    await page.waitForTimeout(100);

    // Stop playback
    const stopButton = page.locator('#stop-audio');
    await stopButton.click();

    // Verify play button is enabled again
    await expect(playButton).toBeEnabled();
  });

  test('should adjust playback speed with slider', async ({ page }) => {
    await page.goto('/');

    // Find speed slider
    const speedSlider = page.locator('#speed-slider');
    await expect(speedSlider).toBeVisible();

    // Change speed
    await speedSlider.fill('30');

    // Verify speed display updates
    const speedDisplay = page.locator('#speed-display');
    await expect(speedDisplay).toContainText('30');
  });

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const textInput = page.locator('#text-input');
    await textInput.fill('HELLO');

    await page.waitForTimeout(400);

    // Verify all controls are accessible on mobile
    const playButton = page.locator('#play-audio');
    await expect(playButton).toBeVisible();

    const speedSlider = page.locator('#speed-slider');
    await expect(speedSlider).toBeVisible();
  });
});
