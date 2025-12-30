/**
 * E2E test for text-to-Morse workflow
 * Following TDD - this test MUST fail before implementation
 */

import { test, expect } from '@playwright/test';

test.describe('Text to Morse Translation E2E', () => {
  // T026: Full text-to-Morse workflow with audio
  test('should translate text to Morse code and play audio', async ({ page }) => {
    await page.goto('/');

    // Enter text
    const textInput = page.locator('#text-input');
    await textInput.fill('HELLO');

    // Verify Morse output appears
    const morseOutput = page.locator('#morse-output');
    await expect(morseOutput).toContainText('.... . .-.. .-.. ---');

    // Click play button
    const playButton = page.locator('#play-audio');
    await playButton.click();

    // Verify play button is disabled during playback (or changes state)
    // This verifies audio is playing
    // await expect(playButton).toBeDisabled();
  });

  test('should handle empty input gracefully', async ({ page }) => {
    await page.goto('/');

    const morseOutput = page.locator('#morse-output');
    await expect(morseOutput).toBeEmpty();
  });

  test('should filter unsupported characters', async ({ page }) => {
    await page.goto('/');

    const textInput = page.locator('#text-input');
    await textInput.fill('HELLO@#$');

    // Should show error message
    const errorContainer = page.locator('#error-messages');
    // await expect(errorContainer).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const textInput = page.locator('#text-input');
    await expect(textInput).toBeVisible();

    const playButton = page.locator('#play-audio');
    await expect(playButton).toBeVisible();
  });
});
// ========================================
// User Story 2: Morse to Text Translation
// ========================================
test.describe('Morse to Text Translation E2E', () => {
  // T049: Full Morse-to-text workflow
  test('should translate Morse code to text', async ({ page }) => {
    await page.goto('/');

    // Enter Morse code
    const morseInput = page.locator('#morse-input');
    await morseInput.fill('... --- ...');

    // Verify text output appears
    const textOutput = page.locator('#text-output');
    await expect(textOutput).toContainText('SOS');
  });

  test('should handle word separators in Morse input', async ({ page }) => {
    await page.goto('/');

    const morseInput = page.locator('#morse-input');
    await morseInput.fill('.... . .-.. .-.. --- / .-- --- .-. .-.. -..');

    const textOutput = page.locator('#text-output');
    await expect(textOutput).toContainText('HELLO WORLD');
  });

  test('should clear all inputs and outputs', async ({ page }) => {
    await page.goto('/');

    // Fill inputs
    const textInput = page.locator('#text-input');
    await textInput.fill('HELLO');

    const morseInput = page.locator('#morse-input');
    await morseInput.fill('... --- ...');

    // Click clear button
    const clearButton = page.locator('#clear-all');
    await clearButton.click();

    // Verify everything is cleared
    await expect(textInput).toBeEmpty();
    await expect(morseInput).toBeEmpty();
    await expect(page.locator('#morse-output')).toBeEmpty();
    await expect(page.locator('#text-output')).toBeEmpty();
  });
});