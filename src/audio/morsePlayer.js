/**
 * MorsePlayer - Audio playback for Morse code using Web Audio API
 * Implements ITU-R M.1677-1 timing standards
 */

import { MORSE_TIMING } from '../translator/morseData.js';

// Audio configuration
const DEFAULT_CONFIG = {
  frequency: 600,      // Hz - Standard Morse tone
  unitDuration: 60,    // ms - 20 WPM (1200ms / 20)
  volume: 0.3          // 0.0-1.0
};

let currentConfig = { ...DEFAULT_CONFIG };
let audioContext = null;
let isPlaying = false;
let scheduledNodes = [];

/**
 * Check if Web Audio API is supported
 * @returns {boolean}
 */
export function isSupported() {
  return typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined';
}

/**
 * Get or create AudioContext
 * @private
 */
function getAudioContext() {
  if (!audioContext && isSupported()) {
    audioContext = new (AudioContext || webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play Morse code as audio
 * @param {string} morseSequence - Morse code to play (dots, dashes, spaces)
 * @param {Object} config - Audio configuration (optional)
 * @param {Function} onProgress - Progress callback (index, total)
 * @returns {Promise<void>}
 */
export function play(morseSequence, config = null, onProgress = null) {
  return new Promise((resolve, reject) => {
    if (!isSupported()) {
      reject(new Error('Web Audio API not supported'));
      return;
    }

    if (!morseSequence || morseSequence.trim() === '') {
      resolve();
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) {
      reject(new Error('Failed to create AudioContext'));
      return;
    }

    // Use provided config or default
    const audioConfig = config || currentConfig;
    
    // Reset playing state
    stop();
    isPlaying = true;
    scheduledNodes = [];

    try {
      let currentTime = ctx.currentTime;
      let charIndex = 0;
      const totalChars = morseSequence.length;

      // Parse and schedule tones
      for (let i = 0; i < morseSequence.length; i++) {
        const symbol = morseSequence[i];
        
        if (symbol === '.') {
          // Dit: 1 unit
          scheduleTone(ctx, audioConfig, currentTime, MORSE_TIMING.DIT * audioConfig.unitDuration / 1000);
          currentTime += (MORSE_TIMING.DIT * audioConfig.unitDuration) / 1000;
          
          if (onProgress) {
            setTimeout(() => onProgress(charIndex, totalChars), (currentTime - ctx.currentTime) * 1000);
          }
          charIndex++;
          
          // Intra-character gap
          currentTime += (MORSE_TIMING.INTRA_CHAR_GAP * audioConfig.unitDuration) / 1000;
          
        } else if (symbol === '-') {
          // Dah: 3 units
          scheduleTone(ctx, audioConfig, currentTime, MORSE_TIMING.DAH * audioConfig.unitDuration / 1000);
          currentTime += (MORSE_TIMING.DAH * audioConfig.unitDuration) / 1000;
          
          if (onProgress) {
            setTimeout(() => onProgress(charIndex, totalChars), (currentTime - ctx.currentTime) * 1000);
          }
          charIndex++;
          
          // Intra-character gap
          currentTime += (MORSE_TIMING.INTRA_CHAR_GAP * audioConfig.unitDuration) / 1000;
          
        } else if (symbol === ' ') {
          // Inter-character gap (already have 1 unit from intra-char, add 2 more for total of 3)
          currentTime += (2 * audioConfig.unitDuration) / 1000;
          
        } else if (symbol === '/') {
          // Word gap (7 units total, subtract space already added)
          currentTime += (4 * audioConfig.unitDuration) / 1000;
        }
      }

      // Schedule completion
      const totalDuration = (currentTime - ctx.currentTime) * 1000;
      setTimeout(() => {
        isPlaying = false;
        scheduledNodes = [];
        resolve();
      }, totalDuration);

    } catch (error) {
      isPlaying = false;
      reject(error);
    }
  });
}

/**
 * Schedule a single tone
 * @private
 */
function scheduleTone(ctx, config, startTime, duration) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = config.frequency;
  oscillator.type = 'sine';

  // Envelope to prevent clicks
  const attackTime = 0.005;  // 5ms attack
  const releaseTime = 0.005; // 5ms release

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(config.volume, startTime + attackTime);
  gainNode.gain.setValueAtTime(config.volume, startTime + duration - releaseTime);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);

  scheduledNodes.push({ oscillator, gainNode });
}

/**
 * Stop current playback
 */
export function stop() {
  isPlaying = false;
  
  // Stop all scheduled nodes
  scheduledNodes.forEach(({ oscillator }) => {
    try {
      oscillator.stop();
    } catch (e) {
      // Already stopped
    }
  });
  
  scheduledNodes = [];
}

/**
 * Set playback speed in words per minute (WPM)
 * @param {number} wpm - Words per minute (5-40)
 */
export function setSpeed(wpm) {
  // Clamp to valid range
  wpm = Math.max(5, Math.min(40, wpm));
  
  // Calculate unit duration: 1200ms / WPM
  currentConfig.unitDuration = 1200 / wpm;
}
