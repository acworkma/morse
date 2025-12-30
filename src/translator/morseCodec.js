/**
 * MorseCodec - Bidirectional translation between text and Morse code
 * Implements ITU-R M.1677-1 International Morse Code standard
 */

import { MORSE_CODE_MAP, TEXT_FROM_MORSE, getSupportedCharacters as getChars } from './morseData.js';

/**
 * Translation result structure
 * @typedef {Object} TranslationResult
 * @property {string} output - Translated text or Morse code
 * @property {string[]} errors - Error or warning messages
 * @property {string[]} unsupportedChars - Characters not in mapping
 * @property {number} duration - Translation time in milliseconds
 */

/**
 * Translate input string to/from Morse code
 * @param {string} input - Text or Morse code to translate
 * @param {string} direction - 'toMorse' or 'toText'
 * @returns {TranslationResult}
 */
export function translate(input, direction) {
  const startTime = performance.now();

  // Validate direction
  if (direction !== 'toMorse' && direction !== 'toText') {
    throw new Error('Invalid direction. Must be "toMorse" or "toText"');
  }

  // Handle null/undefined input
  if (input == null) {
    input = '';
  }

  // Handle empty input
  if (input.trim() === '') {
    return {
      output: '',
      errors: [],
      unsupportedChars: [],
      isValid: true,
      duration: performance.now() - startTime
    };
  }

  let result;
  if (direction === 'toMorse') {
    result = translateToMorse(input, startTime);
  } else {
    result = translateToText(input, startTime);
  }

  // Performance monitoring (log if translation takes >50ms)
  if (result.duration > 50) {
    console.warn(`[Performance] Translation took ${result.duration.toFixed(2)}ms (${direction}, ${input.length} chars)`);
  }

  return result;
}

/**
 * Translate text to Morse code
 * @private
 */
function translateToMorse(input, startTime) {
  // Normalize to uppercase
  const normalized = input.toUpperCase();
  
  const result = [];
  const errors = [];
  const unsupportedChars = new Set();
  
  // Split into words
  const words = normalized.split(/\s+/);
  
  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    const wordMorse = [];
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const morse = MORSE_CODE_MAP[char];
      
      if (morse) {
        wordMorse.push(morse);
      } else {
        unsupportedChars.add(char);
      }
    }
    
    if (wordMorse.length > 0) {
      result.push(wordMorse.join(' '));
    }
  }
  
  // Add errors for unsupported characters
  if (unsupportedChars.size > 0) {
    const unsupportedList = Array.from(unsupportedChars);
    errors.push(`Warning: Removed unsupported character${unsupportedList.length > 1 ? 's' : ''}: ${unsupportedList.join(', ')}`);
  }
  
  return {
    output: result.join(' / '),
    errors,
    unsupportedChars: Array.from(unsupportedChars),
    isValid: true, // Text-to-Morse always succeeds (just filters unsupported chars)
    duration: performance.now() - startTime
  };
}

/**
 * Translate Morse code to text
 * @private
 */
function translateToText(input, startTime) {
  const result = [];
  const errors = [];
  let isValid = true;
  
  // Split by word separator
  const words = input.split('/');
  
  for (let w = 0; w < words.length; w++) {
    const word = words[w].trim();
    if (!word) continue;
    
    // Split by spaces to get individual characters
    const morseChars = word.split(/\s+/);
    const wordChars = [];
    
    for (let i = 0; i < morseChars.length; i++) {
      const morse = morseChars[i].trim();
      if (!morse) continue;
      
      const char = TEXT_FROM_MORSE[morse];
      if (char) {
        wordChars.push(char);
      } else {
        isValid = false;
        errors.push(`Invalid Morse sequence: ${morse}`);
        wordChars.push('?');
      }
    }
    
    if (wordChars.length > 0) {
      result.push(wordChars.join(''));
    }
  }
  
  return {
    output: result.join(' '),
    errors,
    unsupportedChars: [],
    isValid,
    duration: performance.now() - startTime
  };
}

/**
 * Validate if a Morse code sequence is valid
 * @param {string} morseSequence - Morse pattern to validate
 * @returns {boolean}
 */
export function validateMorse(morseSequence) {
  if (!morseSequence || typeof morseSequence !== 'string') return false;
  
  // Check if contains only valid Morse characters (., -, space, /)
  if (!/^[\.\-\s\/]+$/.test(morseSequence)) {
    return false;
  }
  
  // If no spaces and no slashes, it's continuous Morse - only accept short sequences
  // that could plausibly be a single character (max 6 symbols) or very simple patterns
  if (!morseSequence.includes(' ') && !morseSequence.includes('/')) {
    // Reject overly long runs of a single symbol
    if (/^\.{7,}$/.test(morseSequence) || /^\-{6,}$/.test(morseSequence)) {
      return false;
    }
    // Reject alternating patterns that are too long
    if (/^(\.\-){6,}$/.test(morseSequence) || /^(\-\.){6,}$/.test(morseSequence)) {
      return false;
    }
    // Accept short sequences that might be valid
    return morseSequence.length <= 9; // Allow SOS without spaces: ...---...
  }
  
  // Split by word separator
  const words = morseSequence.split('/');
  
  for (const word of words) {
    // Split by spaces to get individual Morse codes
    const codes = word.trim().split(/\s+/).filter(c => c);
    
    for (const code of codes) {
      // Check if each code is valid (exists in mapping)
      if (!TEXT_FROM_MORSE[code]) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Get array of all supported characters
 * @returns {string[]}
 */
export function getSupportedCharacters() {
  return getChars();
}
