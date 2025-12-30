/**
 * Integration tests for translation workflow
 * Following TDD - these tests MUST fail before implementation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { init } from '../../src/ui/app.js';

describe('Translation Integration Tests', () => {
  let container;

  beforeEach(() => {
    // Setup DOM for testing
    container = document.createElement('div');
    container.innerHTML = `
      <input id="text-input" type="text" />
      <div id="morse-output"></div>
      <input id="morse-input" type="text" />
      <div id="text-output"></div>
      <button id="play-audio"></button>
      <button id="stop-audio"></button>
      <input type="range" id="speed-slider" min="5" max="40" value="20" />
      <span id="speed-display">20 WPM</span>
      <button id="copy-morse"></button>
      <button id="copy-text"></button>
      <button id="clear-all"></button>
      <div id="error-messages"></div>
      <div id="toast-container"></div>
    `;
    document.body.appendChild(container);
    
    // Initialize app
    init();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // T024: User types "HELLO", output displays ".... . .-.. .-.. ---"
  it('should display Morse code output when user types text', async () => {
    const textInput = document.getElementById('text-input');
    const morseOutput = document.getElementById('morse-output');

    // Simulate user typing
    textInput.value = 'HELLO';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Wait for debounced update
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(morseOutput.textContent).toBe('.... . .-.. .-.. ---');
  });

  it('should handle real-time translation as user types', async () => {
    const textInput = document.getElementById('text-input');
    const morseOutput = document.getElementById('morse-output');

    textInput.value = 'SOS';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(morseOutput.textContent).toContain('...');
    expect(morseOutput.textContent).toContain('---');
  });
});
