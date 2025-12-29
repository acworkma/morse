# Module Contract: MorseCodec

**Module**: `src/translator/morseCodec.js`  
**Purpose**: Bidirectional translation between text and Morse code  
**Dependencies**: `src/translator/morseData.js`

## API Specification

### translate(input, direction)

Translates input string to/from Morse code based on direction parameter.

**Parameters**:
- `input` (string): Text or Morse code to translate
  - Text: A-Z, 0-9, supported punctuation (case-insensitive)
  - Morse: Dots (.), dashes (-), spaces, word separators (/)
  - Max length: 2000 characters
- `direction` (string): Translation direction
  - `'toMorse'`: Text → Morse code
  - `'toText'`: Morse code → Text

**Returns**: `TranslationResult` object
```javascript
{
  output: string,              // Translated result
  errors: string[],            // Error/warning messages
  unsupportedChars: string[],  // Characters not in mapping
  duration: number             // Translation time (ms)
}
```

**Behavior**:
- **Text to Morse**:
  - Converts input to uppercase
  - Translates each character to Morse code
  - Separates characters with spaces
  - Separates words with ` / `
  - Filters unsupported characters, adds to `unsupportedChars` array
  - Returns empty string for empty input
  
- **Morse to Text**:
  - Splits input by spaces into Morse sequences
  - Translates each sequence to character
  - Handles word separators (`/`) as spaces
  - Returns best-effort translation for invalid patterns
  - Adds error messages for unrecognized sequences

**Examples**:
```javascript
// Text to Morse
translate("HELLO", "toMorse")
// → { output: ".... . .-.. .-.. ---", errors: [], unsupportedChars: [], duration: 2.3 }

// Morse to Text
translate("... --- ...", "toText")
// → { output: "SOS", errors: [], unsupportedChars: [], duration: 1.8 }

// With unsupported characters
translate("HELLO@WORLD", "toMorse")
// → { 
//     output: ".... . .-.. .-.. --- .-- --- .-. .-.. -..",
//     errors: ["Warning: Removed unsupported character: @"],
//     unsupportedChars: ["@"],
//     duration: 3.1
//   }

// Invalid Morse code
translate("....... ----", "toText")
// → { 
//     output: "?",
//     errors: ["Invalid Morse sequence: ......."],
//     unsupportedChars: [],
//     duration: 2.5
//   }
```

**Performance**:
- Time complexity: O(n) where n = input length
- Target latency: <50ms for 500 characters
- Max latency: <100ms for 2000 characters

**Error Handling**:
- Invalid `direction`: Throws `Error("Invalid direction")`
- Null/undefined `input`: Treated as empty string
- Empty `input`: Returns `{ output: "", errors: [], unsupportedChars: [], duration: 0 }`

---

### validateMorse(morseSequence)

Validates if a string is a valid Morse code sequence.

**Parameters**:
- `morseSequence` (string): Morse code pattern to validate

**Returns**: `boolean`
- `true`: Valid Morse pattern (matches known character)
- `false`: Invalid pattern

**Examples**:
```javascript
validateMorse("...")    // → true  (letter S)
validateMorse("-.-.") // → true  (letter C)
validateMorse("........") // → false (no matching character)
validateMorse("abc")    // → false (invalid characters)
```

**Usage**: Internal validation, can be exposed for testing

---

### getSupportedCharacters()

Returns list of all supported characters for translation.

**Parameters**: None

**Returns**: `string[]` - Array of supported characters
```javascript
[
  'A', 'B', 'C', ..., 'Z',  // Letters
  '0', '1', '2', ..., '9',  // Numbers
  '.', ',', '?', ...        // Punctuation
]
```

**Usage**: UI documentation, input validation

---

## Test Contract

**Unit Tests** (100% coverage required for translation logic):

```javascript
describe('MorseCodec.translate()', () => {
  describe('Text to Morse', () => {
    it('translates uppercase letters correctly', () => {
      const result = translate("SOS", "toMorse");
      expect(result.output).toBe("... --- ...");
      expect(result.errors).toHaveLength(0);
    });
    
    it('handles lowercase input (converts to uppercase)', () => {
      const result = translate("hello", "toMorse");
      expect(result.output).toBe(".... . .-.. .-.. ---");
    });
    
    it('translates numbers correctly', () => {
      const result = translate("123", "toMorse");
      expect(result.output).toBe(".---- ..--- ...--");
    });
    
    it('preserves word spacing with /', () => {
      const result = translate("HELLO WORLD", "toMorse");
      expect(result.output).toContain(" / ");
    });
    
    it('filters unsupported characters', () => {
      const result = translate("HI@#", "toMorse");
      expect(result.unsupportedChars).toContain("@");
      expect(result.unsupportedChars).toContain("#");
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    it('handles empty input', () => {
      const result = translate("", "toMorse");
      expect(result.output).toBe("");
      expect(result.errors).toHaveLength(0);
    });
    
    it('completes within performance budget', () => {
      const longInput = "A".repeat(500);
      const result = translate(longInput, "toMorse");
      expect(result.duration).toBeLessThan(100);
    });
  });
  
  describe('Morse to Text', () => {
    it('translates valid Morse code', () => {
      const result = translate("... --- ...", "toText");
      expect(result.output).toBe("SOS");
    });
    
    it('handles word separators', () => {
      const result = translate(".... . .-.. .-.. --- / .-- --- .-. .-.. -..", "toText");
      expect(result.output).toBe("HELLO WORLD");
    });
    
    it('handles invalid Morse sequences gracefully', () => {
      const result = translate("....... invalid", "toText");
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    it('handles empty input', () => {
      const result = translate("", "toText");
      expect(result.output).toBe("");
    });
  });
  
  describe('Error handling', () => {
    it('throws error for invalid direction', () => {
      expect(() => translate("test", "invalid")).toThrow();
    });
    
    it('handles null input as empty string', () => {
      const result = translate(null, "toMorse");
      expect(result.output).toBe("");
    });
  });
});

describe('MorseCodec.validateMorse()', () => {
  it('validates correct Morse patterns', () => {
    expect(validateMorse(".-")).toBe(true);    // A
    expect(validateMorse("...")).toBe(true);   // S
  });
  
  it('rejects invalid patterns', () => {
    expect(validateMorse(".......")).toBe(false);
    expect(validateMorse("abc")).toBe(false);
  });
});

describe('MorseCodec.getSupportedCharacters()', () => {
  it('returns all 54 supported characters', () => {
    const chars = getSupportedCharacters();
    expect(chars).toHaveLength(54);
    expect(chars).toContain('A');
    expect(chars).toContain('0');
    expect(chars).toContain('.');
  });
});
```

**Integration Tests**:
- Verify translation through UI input/output
- Test all user story acceptance scenarios
- Validate error message display

---

## Dependencies

**Required**:
- `src/translator/morseData.js`: Exports `MORSE_CODE_MAP` constant

**Optional**: None (pure JavaScript, no external libraries)

---

## Implementation Notes

**Algorithm** (Text to Morse):
1. Normalize input to uppercase
2. Split into characters
3. For each character:
   - Lookup in MORSE_CODE_MAP
   - If found: Append Morse code + space
   - If not found: Add to unsupportedChars, log warning
4. Handle word boundaries (multiple spaces → ` / `)
5. Trim trailing spaces
6. Return TranslationResult

**Algorithm** (Morse to Text):
1. Split input by single spaces
2. For each Morse sequence:
   - If `/`: Append space to output
   - Else: Lookup in reverse map (TEXT_FROM_MORSE)
   - If found: Append character
   - If not found: Append `?`, log error
3. Return TranslationResult

**Optimization**:
- Pre-compute reverse map at module load
- Use `Map` instead of plain object for faster lookups (optional)
- Avoid string concatenation in loops (use array join)

**Extensibility**:
- Easy to add new characters to MORSE_CODE_MAP
- Support for custom mappings via dependency injection
- Pluggable validation strategies
