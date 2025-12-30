/**
 * UI Controller - Main application controller
 * Coordinates user interactions with translation and audio modules
 */

import { translate } from '../translator/morseCodec.js';
import { play, stop as stopAudio, setSpeed, isSupported as audioSupported } from '../audio/morsePlayer.js';
import { debounce } from './utils.js';
import { copy } from './clipboard.js';

// DOM element references
let elements = {};

// Application state
const state = {
  currentMorse: '',
  currentText: '',
  isPlaying: false,
  audioSupported: false
};

/**
 * Initialize the application
 */
export function init() {
  try {
    // Bind DOM elements
    elements = {
      textInput: document.getElementById('text-input'),
      morseInput: document.getElementById('morse-input'),
      morseOutput: document.getElementById('morse-output'),
      textOutput: document.getElementById('text-output'),
      playAudio: document.getElementById('play-audio'),
      stopAudio: document.getElementById('stop-audio'),
      speedSlider: document.getElementById('speed-slider'),
      speedDisplay: document.getElementById('speed-display'),
      copyMorse: document.getElementById('copy-morse'),
      copyText: document.getElementById('copy-text'),
      clearAll: document.getElementById('clear-all'),
      errorMessages: document.getElementById('error-messages')
    };

    // Check if all required elements exist
    const missingElements = Object.entries(elements)
      .filter(([, el]) => !el)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      console.error('[Init Error] Missing DOM elements:', missingElements);
      showError('Application initialization failed. Please refresh the page.');
      return;
    }

    // Check audio support
    state.audioSupported = audioSupported();
    if (!state.audioSupported) {
      elements.playAudio.disabled = true;
      elements.playAudio.title = 'Audio not supported in this browser';
      console.warn('[Audio] Web Audio API not supported in this browser');
    }

    // Attach event listeners
    attachEventListeners();

  } catch (error) {
    console.error('[Init Error] Failed to initialize app:', error);
    showError('An unexpected error occurred. Please refresh the page.');
  }
}

/**
 * Attach event listeners to UI elements
 * @private
 */
function attachEventListeners() {
  // Text input - debounced
  const debouncedTextInput = debounce(handleTextInput, 300);
  elements.textInput.addEventListener('input', debouncedTextInput);

  // Morse input - debounced
  const debouncedMorseInput = debounce(handleMorseInput, 300);
  elements.morseInput.addEventListener('input', debouncedMorseInput);

  // Buttons
  elements.playAudio.addEventListener('click', handlePlayAudio);
  elements.stopAudio?.addEventListener('click', handleStopAudio);
  elements.speedSlider?.addEventListener('input', handleSpeedChange);
  elements.clearAll.addEventListener('click', handleClear);
  elements.copyMorse.addEventListener('click', () => handleCopy('morse'));
  elements.copyText.addEventListener('click', () => handleCopy('text'));
}

/**
 * Handle text input changes
 * @param {Event} event
 */
function handleTextInput(event) {
  const text = event.target.value;
  
  if (!text.trim()) {
    updateOutput({ output: '', errors: [], unsupportedChars: [] }, elements.morseOutput);
    state.currentMorse = '';
    return;
  }

  try {
    const result = translate(text, 'toMorse');
    state.currentMorse = result.output;
    updateOutput(result, elements.morseOutput);
  } catch (error) {
    console.error('Translation error:', error);
    showError('Translation failed. Please try again.');
  }
}

/**
 * Handle Morse input changes
 * @param {Event} event
 */
function handleMorseInput(event) {
  const morse = event.target.value;
  
  if (!morse.trim()) {
    updateOutput({ output: '', errors: [], unsupportedChars: [] }, elements.textOutput);
    state.currentText = '';
    return;
  }

  try {
    const result = translate(morse, 'toText');
    state.currentText = result.output;
    updateOutput(result, elements.textOutput);
  } catch (error) {
    console.error('Translation error:', error);
    showError('Translation failed. Please try again.');
  }
}

/**
 * Update output display with translation result
 * @param {TranslationResult} result
 * @param {HTMLElement} outputElement
 */
function updateOutput(result, outputElement) {
  // Update output text
  outputElement.textContent = result.output;

  // Display errors if any
  if (result.errors && result.errors.length > 0) {
    showError(result.errors.join('\n'));
  } else {
    hideError();
  }
}

/**
 * Handle play audio button click
 */
async function handlePlayAudio() {
  if (!state.audioSupported) {
    showError('Audio playback not supported in this browser');
    return;
  }

  if (!state.currentMorse || state.currentMorse.trim() === '') {
    showError('Nothing to play. Enter text first.');
    return;
  }

  if (state.isPlaying) {
    return;
  }

  try {
    state.isPlaying = true;
    elements.playAudio.disabled = true;
    elements.playAudio.textContent = '⏸ Playing...';
    
    if (elements.stopAudio) {
      elements.stopAudio.disabled = false;
    }

    // T094: Character highlighting during playback
    const onProgress = (index, total) => {
      highlightCharacter(index);
    };

    await play(state.currentMorse, null, onProgress);

    elements.playAudio.disabled = false;
    elements.playAudio.textContent = '▶ Play Audio';
    state.isPlaying = false;
    
    if (elements.stopAudio) {
      elements.stopAudio.disabled = true;
    }
    
    // Clear highlighting
    clearHighlighting();

  } catch (error) {
    console.error('[Audio Error] Playback failed:', error);
    showError('Audio playback failed: ' + error.message);
    elements.playAudio.disabled = false;
    elements.playAudio.textContent = '▶ Play Audio';
    state.isPlaying = false;
    
    if (elements.stopAudio) {
      elements.stopAudio.disabled = true;
    }
    
    clearHighlighting();
  }
}

/**
 * Handle stop audio button click
 * T095: Stop playback and reset UI
 */
function handleStopAudio() {
  stopAudio();
  
  state.isPlaying = false;
  elements.playAudio.disabled = false;
  elements.playAudio.textContent = '▶ Play Audio';
  
  if (elements.stopAudio) {
    elements.stopAudio.disabled = true;
  }
  
  clearHighlighting();
}

/**
 * Handle speed slider change
 * T096-T097: Update speed and display
 */
function handleSpeedChange(event) {
  const wpm = parseInt(event.target.value, 10);
  setSpeed(wpm);
  
  if (elements.speedDisplay) {
    elements.speedDisplay.textContent = `${wpm} WPM`;
  }
}

/**
 * Highlight a character during playback
 * T094: Visual feedback
 * @param {number} index - Character index
 * @private
 */
function highlightCharacter(index) {
  clearHighlighting();
  
  const morseChars = state.currentMorse.split(' ');
  if (index >= 0 && index < morseChars.length) {
    // Wrap each character in spans for highlighting
    const highlighted = morseChars.map((char, i) => {
      if (i === index) {
        return `<span class="active">${char}</span>`;
      }
      return `<span>${char}</span>`;
    }).join(' ');
    
    elements.morseOutput.innerHTML = highlighted;
  }
}

/**
 * Clear character highlighting
 * @private
 */
function clearHighlighting() {
  if (elements.morseOutput && state.currentMorse) {
    elements.morseOutput.textContent = state.currentMorse;
  }
}

/**
 * Handle clear all button click
 */
function handleClear() {
  elements.textInput.value = '';
  elements.morseInput.value = '';
  elements.morseOutput.textContent = '';
  elements.textOutput.textContent = '';
  
  state.currentMorse = '';
  state.currentText = '';
  
  hideError();

  if (state.isPlaying) {
    stopAudio();
    state.isPlaying = false;
    elements.playAudio.disabled = false;
    elements.playAudio.textContent = '▶ Play Audio';
  }
}

/**
 * Show error message
 * @param {string} message
 */
function showError(message) {
  elements.errorMessages.textContent = message;
  elements.errorMessages.classList.add('active');
}

/**
 * Hide error message
 */
function hideError() {
  elements.errorMessages.textContent = '';
  elements.errorMessages.classList.remove('active');
}
/**
 * Handle copy button click
 * T073: Copy Morse or text output to clipboard
 * @param {string} type - 'morse' or 'text'
 */
async function handleCopy(type) {
  const content = type === 'morse' 
    ? elements.morseOutput.textContent.trim()
    : elements.textOutput.textContent.trim();

  // T076: Validate non-empty output before copy
  if (!content) {
    showNotification('Nothing to copy', 'warning');
    return;
  }

  // T073: Perform copy operation
  const result = await copy(content);

  // T075: Show success/error notification
  if (result.success) {
    showNotification(`${type === 'morse' ? 'Morse code' : 'Text'} copied to clipboard!`, 'success');
  } else {
    console.error('[Clipboard Error] Copy failed:', result.error);
    showNotification(`Failed to copy: ${result.error || 'Unknown error'}`, 'error');
  }
}

/**
 * Show toast notification
 * T074: Toast notification system
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', or 'warning'
 */
function showNotification(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

/**
 * Create toast container if it doesn't exist
 * @private
 * @returns {HTMLElement}
 */
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}