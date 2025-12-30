/**
 * Unit tests for clipboard functionality
 * Tests copy() function with Clipboard API and fallback
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { copy } from '../../src/ui/clipboard.js';

describe('Clipboard', () => {
  let originalNavigator;
  let originalDocument;

  beforeEach(() => {
    originalNavigator = global.navigator;
    originalDocument = global.document;
  });

  afterEach(() => {
    global.navigator = originalNavigator;
    global.document = originalDocument;
    vi.restoreAllMocks();
  });

  // T062: copy() successfully writes to clipboard
  describe('copy() with Clipboard API (T062)', () => {
    it('should successfully write to clipboard using Clipboard API', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      global.navigator = {
        clipboard: {
          writeText: writeTextMock
        }
      };

      const result = await copy('Hello World');
      
      expect(result.success).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith('Hello World');
    });
  });

  // T063: copy() falls back to execCommand when Clipboard API unavailable
  describe('copy() fallback to execCommand (T063)', () => {
    it('should use execCommand when Clipboard API is unavailable', async () => {
      // No clipboard API
      global.navigator = {};
      
      const execCommandMock = vi.fn().mockReturnValue(true);
      const createElementMock = vi.fn().mockReturnValue({
        value: '',
        select: vi.fn(),
        setSelectionRange: vi.fn(),
        style: {}
      });
      const appendChildMock = vi.fn();
      const removeChildMock = vi.fn();
      
      global.document = {
        createElement: createElementMock,
        body: {
          appendChild: appendChildMock,
          removeChild: removeChildMock
        },
        execCommand: execCommandMock
      };

      const result = await copy('Fallback Test');
      
      expect(result.success).toBe(true);
      expect(execCommandMock).toHaveBeenCalledWith('copy');
      expect(createElementMock).toHaveBeenCalledWith('textarea');
    });

    it('should return false when execCommand fails', async () => {
      global.navigator = {};
      
      const execCommandMock = vi.fn().mockReturnValue(false);
      const createElementMock = vi.fn().mockReturnValue({
        value: '',
        select: vi.fn(),
        setSelectionRange: vi.fn(),
        style: {}
      });
      
      global.document = {
        createElement: createElementMock,
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn()
        },
        execCommand: execCommandMock
      };

      const result = await copy('Test');
      
      expect(result.success).toBe(false);
    });
  });

  // T064: copy() handles permission denied gracefully
  describe('copy() error handling (T064)', () => {
    it('should handle permission denied errors gracefully', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
      global.navigator = {
        clipboard: {
          writeText: writeTextMock
        }
      };

      const result = await copy('Test');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Permission denied');
    });

    it('should handle generic clipboard errors', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard error'));
      global.navigator = {
        clipboard: {
          writeText: writeTextMock
        }
      };

      const result = await copy('Test');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
