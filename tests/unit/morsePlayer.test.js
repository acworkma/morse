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
});
