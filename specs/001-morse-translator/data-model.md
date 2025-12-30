# Data Model: Morse Code Translator Web App

**Created**: 2025-12-29  
**Feature**: [spec.md](spec.md)  
**Purpose**: Define data structures, state management, and entity relationships

## Overview

This application is stateless and client-side only. No persistence layer or database is required. All data structures are runtime-only and represent translation mappings, application state, and audio configuration.

---

## Core Data Structures

### 1. Morse Code Character Mapping

**Purpose**: Bidirectional translation between characters and Morse code sequences

**Structure**:
```javascript
// Static lookup table (src/translator/morseData.js)
const MORSE_CODE_MAP = {
  // Letters A-Z
  'A': '.-',    'B': '-...',  'C': '-.-.', 'D': '-..',
  'E': '.',     'F': '..-.',  'G': '--.',  'H': '....',
  'I': '..',    'J': '.---',  'K': '-.-',  'L': '.-..',
  'M': '--',    'N': '-.',    'O': '---',  'P': '.--.',
  'Q': '--.-',  'R': '.-.',   'S': '...',  'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',  'X': '-..-',
  'Y': '-.--',  'Z': '--..',
  
  // Numbers 0-9
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  
  // Punctuation
  '.': '.-.-.-',  ',': '--..--',  '?': '..--..',
  "'": '.----.',  '!': '-.-.--',  '/': '-..-.',
  '(': '-.--.',   ')': '-.--.-',  '&': '.-...',
  ':': '---...',  ';': '-.-.-.',  '=': '-...-',
  '+': '.-.-.',   '-': '-....-',  '_': '..--.-',
  '"': '.-..-.',  '$': '...-..-', '@': '.--.-.'
};

// Reverse mapping (generated at runtime)
const TEXT_FROM_MORSE = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([char, morse]) => [morse, char])
);
```

**Characteristics**:
- Immutable: Never modified at runtime
- Static: Loaded once, reused throughout session
- Total entries: 26 letters + 10 digits + 18 punctuation = 54 characters
- Validation: Any character not in map is filtered or triggers warning

**Relationships**:
- Used by: `MorseCodec` for translation operations
- Referenced by: UI for character set documentation

---

### 2. Translation Request

**Purpose**: Represents a single translation operation (ephemeral state)

**Structure**:
```javascript
// Runtime object (not persisted)
const translationRequest = {
  input: string,           // User-provided text or Morse code
  direction: 'toMorse' | 'toText',  // Translation direction
  timestamp: number        // Performance timing (Date.now())
}
```

**Lifecycle**:
1. Created when user types input
2. Processed by `MorseCodec.translate()`
3. Result rendered to UI
4. Discarded (garbage collected)

**Validation Rules**:
- `input`: Max 2000 characters (enforced by UI)
- `direction`: Must be one of two enum values
- `timestamp`: Used for performance tracking (optional)

---

### 3. Translation Result

**Purpose**: Encapsulates translation output with metadata

**Structure**:
```javascript
const translationResult = {
  output: string,          // Translated text or Morse code
  errors: string[],        // Validation errors or warnings
  unsupportedChars: string[], // Characters not in mapping table
  duration: number         // Translation time in milliseconds
}
```

**Example** (Text to Morse):
```javascript
{
  output: "... --- ...",
  errors: [],
  unsupportedChars: [],
  duration: 2.4
}
```

**Example** (with unsupported characters):
```javascript
{
  output: ".... . .-.. .-.. ---",
  errors: ["Warning: Unsupported characters removed: #, %"],
  unsupportedChars: ["#", "%"],
  duration: 3.1
}
```

**Usage**:
- Returned by `MorseCodec.translate()`
- Consumed by UI controller for rendering
- Error messages displayed to user

---

### 4. Audio Configuration

**Purpose**: Settings for Morse code audio playback

**Structure**:
```javascript
const audioConfig = {
  frequency: number,       // Tone frequency in Hz (default: 600)
  unitDuration: number,    // Base unit duration in ms (default: 60ms = 20 WPM)
  volume: number,          // Volume level 0.0-1.0 (default: 0.3)
  wpm: number             // Words per minute (default: 20, range: 5-40)
}
```

**Defaults**:
```javascript
const DEFAULT_AUDIO_CONFIG = {
  frequency: 600,      // Standard Morse tone (comfortable pitch)
  unitDuration: 60,    // 20 WPM (beginner-friendly)
  volume: 0.3,         // 30% to prevent distortion
  wpm: 20              // Derived: 1200ms/60ms = 20 WPM
}
```

**WPM Calculation**:
- Formula: `unitDuration = 1200 / wpm`
- Examples:
  - 5 WPM: 240ms unit duration (very slow, learning)
  - 20 WPM: 60ms unit duration (default, comfortable)
  - 40 WPM: 30ms unit duration (advanced, fast)

**Timing Constants** (ITU-R M.1677-1):
```javascript
const MORSE_TIMING = {
  DIT: 1,              // 1 unit
  DAH: 3,              // 3 units
  INTRA_CHAR_GAP: 1,   // 1 unit between dits/dahs within a character
  INTER_CHAR_GAP: 3,   // 3 units between characters
  WORD_GAP: 7          // 7 units between words
}
```

**Validation**:
- `frequency`: 200-1200 Hz (human-audible comfort range)
- `volume`: 0.0-1.0 (Web Audio API range)
- `wpm`: 5-40 (practical Morse code speed range)

---

### 5. Playback State

**Purpose**: Tracks audio playback progress for visual feedback

**Structure**:
```javascript
const playbackState = {
  isPlaying: boolean,          // Currently playing audio
  currentIndex: number,        // Index of current Morse character being played
  totalCharacters: number,     // Total Morse characters in sequence
  audioContext: AudioContext | null  // Web Audio API context
}
```

**Example**:
```javascript
{
  isPlaying: true,
  currentIndex: 3,
  totalCharacters: 11,
  audioContext: [AudioContext object]
}
```

**State Transitions**:
- Idle: `{ isPlaying: false, currentIndex: 0, ... }`
- Playing: `{ isPlaying: true, currentIndex: N, ... }`
- Stopped: Reset to Idle state

**Synchronization**:
- `currentIndex` updates in sync with audio playback
- UI highlights corresponding Morse character based on `currentIndex`
- Enables visual learning mode (User Story 4)

---

## Entity Relationships

```
┌─────────────────────────┐
│  MORSE_CODE_MAP         │
│  (Static Data)          │
│  - 54 character mappings│
└────────┬────────────────┘
         │ used by
         ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│  MorseCodec             │      │  TranslationRequest     │
│  (Translation Logic)    │◄─────┤  - input                │
│  - translate()          │      │  - direction            │
│  - validate()           │      └─────────────────────────┘
└────────┬────────────────┘
         │ produces
         ▼
┌─────────────────────────┐
│  TranslationResult      │
│  - output               │
│  - errors               │───────► UI Controller
│  - unsupportedChars     │
└─────────────────────────┘


┌─────────────────────────┐      ┌─────────────────────────┐
│  AudioConfig            │      │  PlaybackState          │
│  - frequency            │      │  - isPlaying            │
│  - unitDuration         │◄─────┤  - currentIndex         │
│  - volume               │      │  - audioContext         │
│  - wpm                  │      └─────────────────────────┘
└────────┬────────────────┘
         │ used by
         ▼
┌─────────────────────────┐
│  MorsePlayer            │
│  - play()               │───────► Web Audio API
│  - stop()               │
│  - setSpeed()           │
└─────────────────────────┘
```

---

## State Management

**Approach**: No state management library (minimal dependency requirement)

**Strategy**: Module-level state with functional updates

```javascript
// Example: app.js (UI Controller)
let currentTranslationResult = null;
let currentPlaybackState = { isPlaying: false, currentIndex: 0 };

function updateTranslation(input, direction) {
  const result = MorseCodec.translate(input, direction);
  currentTranslationResult = result; // Functional update
  renderOutput(result);
}
```

**Rationale**:
- Simple application with minimal state
- No complex state interactions or global shared state
- Functional updates prevent mutation bugs
- Easy to test (pure functions)

---

## Data Validation

### Input Validation

**Text Input**:
- Length: 0-2000 characters
- Character set: A-Z, 0-9, supported punctuation + spaces
- Case: Normalized to uppercase before translation
- Unsupported characters: Filtered with warning notification

**Morse Input**:
- Valid characters: `.` (dit), `-` (dah), ` ` (space), `/` (word separator)
- Pattern validation: Each Morse sequence must match known pattern
- Error handling: Best-effort translation with error message for invalid patterns

### Output Validation

**Translation Output**:
- Never null/undefined (empty string if no input)
- Always includes error array (empty if no errors)
- Duration always positive number

**Audio Output**:
- AudioContext validated before playback
- Timing values always positive
- Graceful failure if Web Audio API unavailable

---

## Performance Considerations

**Character Mapping Lookup**: O(1) - Direct object key access  
**Translation Algorithm**: O(n) - Linear scan of input string  
**Memory Footprint**: 
- Morse map: ~2KB
- Translation result: <1KB per operation
- Total runtime memory: <10KB

**Optimization**:
- Morse map created once at module load
- Reverse map generated lazily on first Morse-to-text translation
- No unnecessary object creation in translation loop

---

## Testing Strategy

**Unit Tests**:
- Validate MORSE_CODE_MAP completeness (all 54 characters)
- Test bidirectional translation accuracy
- Verify error handling for unsupported characters
- Validate WPM to unitDuration conversion
- Test audio timing calculations

**Integration Tests**:
- End-to-end translation with UI input/output
- Audio playback with visual synchronization
- Error message display for invalid inputs

**Test Data**:
```javascript
// Example test cases
const TEST_CASES = [
  { input: "SOS", expected: "... --- ..." },
  { input: "HELLO WORLD", expected: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.." },
  { input: "TEST123", expected: "- . ... - .---- ..--- ...--" },
  { input: "A@B", expectedErrors: ["Unsupported character: @"] }
];
```

---

## Future Extensibility

**Potential Enhancements** (Out of current scope):
- Custom Morse code mappings (user-defined)
- Translation history (localStorage)
- Prosigns support (e.g., <SK>, <AR>)
- Multiple Morse variants (American Morse, etc.)

**Data Model Impact**:
- Custom mappings: Add user settings entity
- History: Add translation history array with timestamps
- Prosigns: Extend MORSE_CODE_MAP with multi-character keys
- Variants: Multiple mapping tables with selection state

All future enhancements maintain backwards compatibility with current data structures.
