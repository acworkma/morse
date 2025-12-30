/**
 * Unit tests for MorseCodec module
 * Following TDD - these tests MUST fail before implementation
 */

import { describe, it, expect } from 'vitest';
import { translate, getSupportedCharacters, validateMorse } from '../../src/translator/morseCodec.js';

describe('MorseCodec.translate()', () => {
  describe('Text to Morse (T015-T020)', () => {
    // T015: translate("SOS", "toMorse") returns "... --- ..."
    it('should translate SOS to Morse code correctly', () => {
      const result = translate('SOS', 'toMorse');
      expect(result.output).toBe('... --- ...');
      expect(result.errors).toHaveLength(0);
      expect(result.unsupportedChars).toHaveLength(0);
    });

    // T016: translate() handles lowercase input (converts to uppercase)
    it('should convert lowercase input to uppercase', () => {
      const result = translate('hello', 'toMorse');
      expect(result.output).toBe('.... . .-.. .-.. ---');
      expect(result.errors).toHaveLength(0);
    });

    // T017: translate() handles numbers "123" correctly
    it('should translate numbers correctly', () => {
      const result = translate('123', 'toMorse');
      expect(result.output).toBe('.---- ..--- ...--');
      expect(result.errors).toHaveLength(0);
    });

    // T018: translate() preserves word spacing with "/"
    it('should preserve word spacing with forward slash separator', () => {
      const result = translate('HELLO WORLD', 'toMorse');
      expect(result.output).toContain(' / ');
      const parts = result.output.split(' / ');
      expect(parts).toHaveLength(2);
    });

    // T019: translate() filters unsupported characters and returns warnings
    it('should filter unsupported characters and return warnings', () => {
      const result = translate('HI~#%', 'toMorse');  // ~, #, % are unsupported
      expect(result.unsupportedChars).toContain('~');
      expect(result.unsupportedChars).toContain('#');
      expect(result.unsupportedChars).toContain('%');
      expect(result.errors.length).toBeGreaterThan(0);
      // Output should still contain valid characters
      expect(result.output).toContain('....');  // H
      expect(result.output).toContain('..');    // I
    });

    // T020: getSupportedCharacters() returns all 54 characters
    it('should return all 54 supported characters', () => {
      const chars = getSupportedCharacters();
      expect(chars).toHaveLength(54);
      expect(chars).toContain('A');
      expect(chars).toContain('Z');
      expect(chars).toContain('0');
      expect(chars).toContain('9');
      expect(chars).toContain('.');
      expect(chars).toContain('@');
    });

    it('should handle empty input', () => {
      const result = translate('', 'toMorse');
      expect(result.output).toBe('');
      expect(result.errors).toHaveLength(0);
    });

    it('should complete within performance budget', () => {
      const longInput = 'A'.repeat(500);
      const result = translate(longInput, 'toMorse');
      expect(result.duration).toBeLessThan(100);
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid direction', () => {
      expect(() => translate('test', 'invalid')).toThrow();
    });

    it('should handle null input as empty string', () => {
      const result = translate(null, 'toMorse');
      expect(result.output).toBe('');
    });

    it('should handle undefined input as empty string', () => {
      const result = translate(undefined, 'toMorse');
      expect(result.output).toBe('');
    });
  });

  // ========================================
  // User Story 2: Morse to Text Translation
  // ========================================
  describe('MorseCodec.translate() > Morse to Text (T043-T046)', () => {
    // T043: translate() converts Morse to text
    it('should translate "... --- ..." to "SOS"', () => {
      const result = translate('... --- ...', 'toText');
      expect(result.isValid).toBe(true);
      expect(result.output).toBe('SOS');
      expect(result.errors).toEqual([]);
    });

    // T044: translate() handles word separators
    it('should handle word separators "/" correctly', () => {
      const result = translate('.... . .-.. .-.. --- / .-- --- .-. .-.. -..', 'toText');
      expect(result.isValid).toBe(true);
      expect(result.output).toBe('HELLO WORLD');
    });

    // T045: validateMorse() returns true/false for valid/invalid Morse
    it('should validate Morse patterns correctly', () => {
      expect(validateMorse('...')).toBe(true);    // Valid: S
      expect(validateMorse('...---...')).toBe(true);  // Valid: SOS
      expect(validateMorse('.... . .-.. .-.. ---')).toBe(true); // Valid: HELLO
      expect(validateMorse('.......')).toBe(false); // Invalid: no 7 consecutive dots
      expect(validateMorse('abc')).toBe(false);   // Invalid: letters not allowed
      expect(validateMorse('.-.-.-.-.-')).toBe(false); // Invalid: unknown pattern
    });

    // T046: translate() handles invalid Morse with error messages
    it('should handle invalid Morse gracefully with error messages', () => {
      const result = translate('.......', 'toText'); // Invalid sequence
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].toLowerCase()).toContain('invalid');
    });
  });
});

