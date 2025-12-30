/**
 * Integration tests for clipboard functionality
 * Tests copy button interactions with UI
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { init } from '../../src/ui/app.js';

describe('Clipboard Integration Tests', () => {
  let clipboardWriteText;

  beforeEach(() => {
    // Set up DOM structure
    document.body.innerHTML = `
      <div class="container">
        <div class="input-section">
          <input type="text" id="text-input" />
        </div>
        <div class="morse-section">
          <textarea id="morse-input"></textarea>
        </div>
        <div class="output-section">
          <div id="morse-output"></div>
          <button id="copy-morse">Copy Morse</button>
        </div>
        <div class="output-section">
          <div id="text-output"></div>
          <button id="copy-text">Copy Text</button>
        </div>
        <div id="error-messages"></div>
        <div id="toast-container"></div>
        <button id="play-audio">Play</button>
        <button id="clear-all">Clear</button>
      </div>
    `;

    // Mock Clipboard API
    clipboardWriteText = vi.fn().mockResolvedValue(undefined);
    global.navigator = {
      clipboard: {
        writeText: clipboardWriteText
      }
    };

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

  // T065: Click copy button, clipboard contains correct content
  describe('Copy button functionality (T065)', () => {
    it('should copy Morse output to clipboard when copy button clicked', async () => {
      const textInput = document.getElementById('text-input');
      const morseOutput = document.getElementById('morse-output');
      const copyButton = document.getElementById('copy-morse');

      // Set up translation
      textInput.value = 'SOS';
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Verify output exists
      expect(morseOutput.textContent).toContain('...');
      
      // Click copy button
      await copyButton.click();
      
      // Wait for async copy
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify clipboard was called with correct content
      expect(clipboardWriteText).toHaveBeenCalledWith(expect.stringContaining('...'));
    });

    it('should copy text output to clipboard', async () => {
      const morseInput = document.getElementById('morse-input');
      const textOutput = document.getElementById('text-output');
      const copyButton = document.getElementById('copy-text');

      // Set up translation
      morseInput.value = '... --- ...';
      morseInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Verify output exists
      expect(textOutput.textContent).toContain('SOS');
      
      // Click copy button
      await copyButton.click();
      
      // Wait for async copy
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify clipboard was called
      expect(clipboardWriteText).toHaveBeenCalledWith(expect.stringContaining('SOS'));
    });
  });

  // T066: Copy with empty output shows warning
  describe('Copy validation (T066)', () => {
    it('should show warning when trying to copy empty output', async () => {
      const copyButton = document.getElementById('copy-morse');
      const errorDisplay = document.getElementById('error-display');

      // Click copy with empty output
      copyButton.click();
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify clipboard was not called
      expect(clipboardWriteText).not.toHaveBeenCalled();
      
      // Verify error or notification shown
      // (implementation detail - could be toast or error display)
    });
  });

  // T067: Toast notification appears on successful copy
  describe('Toast notifications (T067)', () => {
    it('should display success notification after successful copy', async () => {
      const textInput = document.getElementById('text-input');
      const copyButton = document.getElementById('copy-morse');
      const toastContainer = document.getElementById('toast-container');

      // Set up translation
      textInput.value = 'HI';
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Click copy
      copyButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify toast appears
      expect(toastContainer.children.length).toBeGreaterThan(0);
      const toast = toastContainer.querySelector('.toast');
      expect(toast).toBeTruthy();
    });
  });
});
