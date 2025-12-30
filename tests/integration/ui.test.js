/**
 * Integration Tests for UI interactions
 * Tests overall UI controller behavior with DOM elements
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { init } from '../../src/ui/app.js';

describe('UI Integration Tests', () => {
  beforeEach(() => {
    // Set up DOM structure matching app.js requirements
    document.body.innerHTML = `
      <div class="container">
        <div class="input-section">
          <label for="text-input">English Text</label>
          <input type="text" id="text-input" placeholder="Type text to translate to Morse..."/>
        </div>
        <div class="morse-section">
          <label for="morse-input">Morse Code</label>
          <textarea id="morse-input" placeholder="Enter Morse code (use / for word breaks)..."></textarea>
        </div>
        <div class="output-section">
          <label>Morse Code Output</label>
          <div id="morse-output"></div>
        </div>
        <div class="output-section">
          <label>Text Output</label>
          <div id="text-output"></div>
        </div>
        <div id="error-messages"></div>
        <button id="play-audio">Play</button>
        <button id="copy-morse">Copy Morse</button>
        <button id="copy-text">Copy Text</button>
        <button id="clear-all">Clear</button>
      </div>
    `;

    // Mock Web Audio API
    global.AudioContext = class MockAudioContext {
      constructor() {
        this.currentTime = 0;
        this.destination = {};
      }
      createOscillator() {
        return {
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
          frequency: { value: 600 }
        };
      }
      createGain() {
        return {
          connect: vi.fn(),
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn()
          }
        };
      }
    };

    // Initialize app
    init();
  });

  // T047: Morse-to-text integration test
  describe('Morse to Text Translation (T047)', () => {
    it('should display decoded text when user enters Morse code', async () => {
      const morseInput = document.getElementById('morse-input');
      const textOutput = document.getElementById('text-output');

      // Simulate user entering Morse code
      morseInput.value = '... --- ...';
      morseInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Wait for debounce (300ms)
      await new Promise(resolve => setTimeout(resolve, 350));

      // Verify text output displays "SOS"
      expect(textOutput.textContent).toContain('SOS');
    });
  });

  // T048: Clear button integration test
  describe('Clear Button (T048)', () => {
    it('should reset both inputs and outputs when clicked', async () => {
      const textInput = document.getElementById('text-input');
      const morseInput = document.getElementById('morse-input');
      const morseOutput = document.getElementById('morse-output');
      const textOutput = document.getElementById('text-output');
      const clearButton = document.getElementById('clear-all');

      // Set some values
      textInput.value = 'HELLO';
      morseInput.value = '... --- ...';
      morseOutput.textContent = '.... . .-.. .-.. ---';
      textOutput.textContent = 'SOS';

      // Click clear button
      clearButton.click();

      // Verify everything is cleared
      expect(textInput.value).toBe('');
      expect(morseInput.value).toBe('');
      expect(morseOutput.textContent).toBe('');
      expect(textOutput.textContent).toBe('');
    });
  });
});
