# Module Contract: UI Controller

**Module**: `src/ui/app.js`  
**Purpose**: Main application controller coordinating user interactions  
**Dependencies**: `MorseCodec`, `MorsePlayer`, `Clipboard`

## API Specification

### init()

Initializes the application and sets up event listeners.

**Parameters**: None

**Returns**: `void`

**Behavior**:
- Binds DOM elements to internal references
- Attaches event listeners to inputs, buttons
- Checks Web Audio API support
- Initializes default state
- Called once on page load from `main.js`

**Example**:
```javascript
// In main.js
import { init } from './ui/app.js';
init();
```

**Error Handling**:
- Missing DOM elements: Logs error, graceful degradation
- Event listener errors: Caught and logged

---

### handleTextInput(event)

Handles input changes from text input field.

**Parameters**:
- `event` (InputEvent): DOM input event

**Returns**: `void`

**Behavior**:
- Extracts text from event.target.value
- Calls `MorseCodec.translate(text, 'toMorse')`
- Updates Morse output display
- Displays error messages if unsupported characters
- Debounced (300ms) for performance

**Example**:
```javascript
<input 
  type="text" 
  id="text-input" 
  oninput="handleTextInput(event)"
  placeholder="Enter text"
/>
```

---

### handleMorseInput(event)

Handles input changes from Morse input field.

**Parameters**:
- `event` (InputEvent): DOM input event

**Returns**: `void`

**Behavior**:
- Extracts Morse code from event.target.value
- Validates Morse characters (., -, space, /)
- Calls `MorseCodec.translate(morse, 'toText')`
- Updates text output display
- Displays error messages if invalid patterns
- Debounced (300ms) for performance

---

### handlePlayAudio()

Plays Morse code audio for current translation.

**Parameters**: None

**Returns**: `Promise<void>`

**Behavior**:
- Gets current Morse output from display
- Calls `MorsePlayer.play()` with progress callback
- Updates UI state (disable play button, show stop button)
- Highlights Morse characters during playback
- Re-enables controls after playback completes

**Example**:
```javascript
<button id="play-audio" onclick="handlePlayAudio()">
  ▶ Play Audio
</button>
```

**Error Handling**:
- Web Audio not supported: Shows error message, disables button
- Empty Morse code: Shows warning "Nothing to play"
- Playback error: Logs error, resets UI state

---

### handleStopAudio()

Stops current audio playback.

**Parameters**: None

**Returns**: `void`

**Behavior**:
- Calls `MorsePlayer.stop()`
- Resets UI state (enable play button, hide stop button)
- Removes character highlighting

---

### handleCopy(outputType)

Copies translation result to clipboard.

**Parameters**:
- `outputType` (string): `'morse'` or `'text'`

**Returns**: `Promise<void>`

**Behavior**:
- Gets output content based on outputType
- Calls `Clipboard.copy(content)`
- Shows success toast notification
- Handles permission denied gracefully

**Examples**:
```javascript
<button onclick="handleCopy('morse')">📋 Copy Morse</button>
<button onclick="handleCopy('text')">📋 Copy Text</button>
```

**Error Handling**:
- Empty output: Shows "Nothing to copy" message
- Clipboard permission denied: Shows fallback instructions
- Copy failed: Logs error, shows error message

---

### handleClear()

Clears all input and output fields.

**Parameters**: None

**Returns**: `void`

**Behavior**:
- Clears text input field
- Clears Morse input field
- Clears all output displays
- Resets error messages
- Stops any playing audio

**Example**:
```javascript
<button onclick="handleClear()">🗑️ Clear All</button>
```

---

### handleSpeedChange(event)

Updates Morse code playback speed.

**Parameters**:
- `event` (InputEvent): Range slider change event

**Returns**: `void`

**Behavior**:
- Extracts WPM value from slider
- Calls `MorsePlayer.setSpeed(wpm)`
- Updates speed display label
- Applies to next audio playback

**Example**:
```javascript
<input 
  type="range" 
  min="5" 
  max="40" 
  value="20" 
  oninput="handleSpeedChange(event)"
/>
<span id="speed-display">20 WPM</span>
```

---

### updateOutput(result, outputElement)

Updates DOM with translation result.

**Parameters**:
- `result` (TranslationResult): Translation output object
- `outputElement` (HTMLElement): DOM element to update

**Returns**: `void`

**Behavior**:
- Sets outputElement.textContent to result.output
- Displays errors in error message area
- Highlights unsupported characters
- Applies appropriate styling (monospace for Morse)

**Internal Use**: Called by handleTextInput and handleMorseInput

---

### showNotification(message, type)

Displays temporary toast notification.

**Parameters**:
- `message` (string): Notification text
- `type` (string): `'success'`, `'error'`, `'warning'`, `'info'`

**Returns**: `void`

**Behavior**:
- Creates toast element
- Applies styling based on type
- Auto-dismisses after 3 seconds
- Stacks multiple notifications

**Examples**:
```javascript
showNotification("Copied to clipboard!", "success");
showNotification("Web Audio not supported", "error");
showNotification("Unsupported characters removed", "warning");
```

---

## Internal State

```javascript
const state = {
  currentMorse: '',         // Current Morse output
  currentText: '',          // Current text output
  isPlaying: false,         // Audio playback state
  audioSupported: boolean,  // Web Audio API availability
  currentSpeed: 20          // Playback speed (WPM)
}
```

---

## DOM Element References

Required elements in `index.html`:

```html
<!-- Inputs -->
<input id="text-input" type="text" />
<textarea id="morse-input"></textarea>

<!-- Outputs -->
<div id="morse-output"></div>
<div id="text-output"></div>

<!-- Controls -->
<button id="play-audio">▶ Play</button>
<button id="stop-audio">⏹ Stop</button>
<button id="copy-morse">📋 Copy Morse</button>
<button id="copy-text">📋 Copy Text</button>
<button id="clear-all">🗑️ Clear</button>

<!-- Speed control -->
<input id="speed-slider" type="range" min="5" max="40" value="20" />
<span id="speed-display">20 WPM</span>

<!-- Error display -->
<div id="error-messages"></div>

<!-- Toast container -->
<div id="toast-container"></div>
```

---

## Test Contract

**Integration Tests** (User story scenarios):

```javascript
describe('UI Controller', () => {
  beforeEach(() => {
    document.body.innerHTML = /* ... load fixture HTML ... */;
    init();
  });
  
  describe('Text to Morse translation', () => {
    it('displays Morse code when text entered', async () => {
      const textInput = document.getElementById('text-input');
      const morseOutput = document.getElementById('morse-output');
      
      textInput.value = 'SOS';
      textInput.dispatchEvent(new Event('input'));
      
      await waitFor(() => {
        expect(morseOutput.textContent).toBe('... --- ...');
      });
    });
    
    it('shows warning for unsupported characters', async () => {
      const textInput = document.getElementById('text-input');
      textInput.value = 'HELLO@';
      textInput.dispatchEvent(new Event('input'));
      
      await waitFor(() => {
        const errors = document.getElementById('error-messages');
        expect(errors.textContent).toContain('Unsupported character');
      });
    });
  });
  
  describe('Morse to Text translation', () => {
    it('displays text when Morse entered', async () => {
      const morseInput = document.getElementById('morse-input');
      const textOutput = document.getElementById('text-output');
      
      morseInput.value = '... --- ...';
      morseInput.dispatchEvent(new Event('input'));
      
      await waitFor(() => {
        expect(textOutput.textContent).toBe('SOS');
      });
    });
  });
  
  describe('Audio playback', () => {
    it('plays audio when play button clicked', async () => {
      const textInput = document.getElementById('text-input');
      textInput.value = 'HI';
      textInput.dispatchEvent(new Event('input'));
      
      const playButton = document.getElementById('play-audio');
      playButton.click();
      
      expect(state.isPlaying).toBe(true);
    });
    
    it('stops audio when stop button clicked', async () => {
      // Start playback
      const playButton = document.getElementById('play-audio');
      playButton.click();
      
      // Stop playback
      const stopButton = document.getElementById('stop-audio');
      stopButton.click();
      
      expect(state.isPlaying).toBe(false);
    });
  });
  
  describe('Copy functionality', () => {
    it('copies Morse to clipboard', async () => {
      const textInput = document.getElementById('text-input');
      textInput.value = 'SOS';
      textInput.dispatchEvent(new Event('input'));
      
      const copyButton = document.getElementById('copy-morse');
      await copyButton.click();
      
      const clipboardText = await navigator.clipboard.readText();
      expect(clipboardText).toBe('... --- ...');
    });
  });
  
  describe('Clear functionality', () => {
    it('clears all fields', () => {
      // Set up inputs
      document.getElementById('text-input').value = 'TEST';
      document.getElementById('morse-input').value = '... ---';
      
      // Clear
      document.getElementById('clear-all').click();
      
      expect(document.getElementById('text-input').value).toBe('');
      expect(document.getElementById('morse-input').value).toBe('');
      expect(document.getElementById('morse-output').textContent).toBe('');
      expect(document.getElementById('text-output').textContent).toBe('');
    });
  });
});
```

---

## Dependencies

**Required Modules**:
- `src/translator/morseCodec.js`: Translation logic
- `src/audio/morsePlayer.js`: Audio playback
- `src/ui/clipboard.js`: Clipboard operations

**Browser APIs**:
- DOM API (querySelector, addEventListener)
- Input events
- Storage API (optional, for settings persistence)

---

## Performance Considerations

**Debouncing**:
- Input handlers debounced by 300ms
- Prevents excessive translations while user typing
- Improves UX on slower devices

**Virtual Scrolling** (future):
- If translation history added
- Render only visible items for large lists

**Memory**:
- Remove event listeners on cleanup
- Clear timeouts on component unmount
- Minimize DOM updates (batch changes)

---

## Accessibility

**ARIA Labels**:
```html
<input 
  id="text-input" 
  aria-label="Text input for Morse code translation"
  aria-describedby="text-help"
/>
<div id="text-help" class="sr-only">
  Enter text to translate to Morse code
</div>
```

**Keyboard Navigation**:
- All buttons focusable (tab order)
- Enter key triggers button actions
- Escape key stops audio playback
- Clear button has Ctrl+K shortcut

**Screen Reader Support**:
- Live regions for translation output
- Status messages announced
- Error messages associated with inputs

**Color Contrast**:
- WCAG 2.1 AA minimum (4.5:1)
- Error messages use both color and icons
- Focus indicators visible (2px outline)
