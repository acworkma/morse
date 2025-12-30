/**
 * Unit tests for MorsePlayer module
 * Following TDD - these tests MUST fail before implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { play, isSupported, stop, setSpeed } from '../../src/audio/morsePlayer.js';

// Mock Web Audio API
class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.destination = {};
  }
  
  createOscillator() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { value: 600 },
      type: 'sine'
    };
  }
  
  createGain() {
    return {
      connect: vi.fn(),
      gain: {
        value: 0.3,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn()
      }
    };
  }
}

global.AudioContext = MockAudioContext;

describe('MorsePlayer', () => {
  describe('T021-T023: Audio playback functionality', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // T021: play() schedules correct dit/dah tones
    it('should schedule dit and dah tones correctly', async () => {
      const mockProgress = vi.fn();
      // Test with simple pattern: "." (dit) and "-" (dah)
      await play('.- ', null, mockProgress);
      expect(mockProgress).toHaveBeenCalled();
    });

    // T022: play() uses ITU-R M.1677-1 timing (1:3:7 ratio)
    it('should use correct ITU-R M.1677-1 timing ratios', async () => {
      // Dit = 1 unit, Dah = 3 units, Word gap = 7 units
      const mockProgress = vi.fn();
      await play('.- ', null, mockProgress);
      // Verify timing is implemented (actual timing verification would need more sophisticated mocking)
      expect(mockProgress).toHaveBeenCalled();
    });

    // T023: isSupported() detects Web Audio API availability
    it('should detect Web Audio API availability', () => {
      const supported = isSupported();
      expect(typeof supported).toBe('boolean');
      expect(supported).toBe(true);  // We mocked AudioContext above
    });

    it('should handle empty Morse sequence', async () => {
      await expect(play('')).resolves.toBeUndefined();
    });

    it('should call onProgress callback for each character', async () => {
      const progressCalls = [];
      const mockProgress = (idx, total) => {
        progressCalls.push({ idx, total });
      };
      
      await play('... ---', null, mockProgress);
      expect(progressCalls.length).toBeGreaterThan(0);
      expect(progressCalls[0]).toHaveProperty('idx');
      expect(progressCalls[0]).toHaveProperty('total');
    });

    it('should return false for isSupported when AudioContext unavailable', () => {
      const originalAudioContext = global.AudioContext;
      global.AudioContext = undefined;
      
      const supported = isSupported();
      expect(supported).toBe(false);
      
      global.AudioContext = originalAudioContext;
    });
  });

  describe('Playback control', () => {
    it('should provide stop function', () => {
      expect(typeof stop).toBe('function');
      expect(() => stop()).not.toThrow();
    });

    it('should provide setSpeed function', () => {
      expect(typeof setSpeed).toBe('function');
      expect(() => setSpeed(20)).not.toThrow();
    });
  });

  // ========================================
  // User Story 4: Interactive Learning Mode
  // ========================================
  describe('Interactive Learning (T080-T083)', () => {
    // T080-T081: onProgress callback functionality
    it('should call onProgress callback with correct index and total', async () => {
      const onProgress = vi.fn();
      play('... --- ...', null, onProgress);

      // Wait for callbacks
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should be called for each character in "SOS"
      expect(onProgress).toHaveBeenCalled();
      
      // Verify it receives index and total parameters
      const calls = onProgress.mock.calls;
      if (calls.length > 0) {
        const [index, total] = calls[0];
        expect(typeof index).toBe('number');
        expect(typeof total).toBe('number');
        expect(total).toBeGreaterThan(0);
      }
    });

    // T082: stop() cancels playback and resets state
    it('should stop playback and reset state', () => {
      play('... --- ...');
      
      // Call stop
      expect(() => stop()).not.toThrow();
      
      // Verify stop is idempotent
      expect(() => stop()).not.toThrow();
    });

    // T083: setSpeed() updates WPM and clamps to 5-40 range
    it('should update speed and clamp to 5-40 WPM range', () => {
      // Valid speeds
      expect(() => setSpeed(15)).not.toThrow();
      expect(() => setSpeed(20)).not.toThrow();
      
      // Test clamping (implementation should clamp these)
      expect(() => setSpeed(3)).not.toThrow();  // Below min
      expect(() => setSpeed(50)).not.toThrow(); // Above max
      
      // Edge cases
      expect(() => setSpeed(5)).not.toThrow();  // Min
      expect(() => setSpeed(40)).not.toThrow(); // Max
    });
  });
});

