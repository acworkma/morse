# Module Contract: MorsePlayer

**Module**: `src/audio/morsePlayer.js`  
**Purpose**: Morse code audio playback using Web Audio API  
**Dependencies**: `src/translator/morseData.js` (for timing constants)

## API Specification

### play(morseSequence, config, onProgress)

Plays Morse code audio with optional visual progress callback.

**Parameters**:
- `morseSequence` (string): Morse code to play (dots, dashes, spaces)
  - Example: `"... --- ..."`
- `config` (AudioConfig, optional): Playback configuration
  ```javascript
  {
    frequency: number,    // Hz (default: 600)
    unitDuration: number, // ms per unit (default: 60 = 20 WPM)
    volume: number       // 0.0-1.0 (default: 0.3)
  }
  ```
- `onProgress` (function, optional): Progress callback
  ```javascript
  (currentIndex: number, totalChars: number) => void
  ```

**Returns**: `Promise<void>`
- Resolves when playback completes
- Rejects if Web Audio API unavailable or playback fails

**Behavior**:
- Creates AudioContext if not exists
- Schedules tones for each dit (.) and dah (-)
- Inserts gaps per ITU-R M.1677-1 timing:
  - Dit: 1 unit
  - Dah: 3 units
  - Intra-character gap: 1 unit
  - Inter-character gap (space): 3 units
  - Word gap (`/`): 7 units
- Calls `onProgress(index, total)` for each character (enables visual highlighting)
- Handles stop() during playback gracefully

**Examples**:
```javascript
// Basic playback
await play("... --- ...");  // Plays SOS

// With configuration (slower speed)
await play(".-", { 
  frequency: 700, 
  unitDuration: 120,  // 10 WPM
  volume: 0.5 
});

// With progress callback (visual sync)
await play(".... .", null, (index, total) => {
  console.log(`Playing character ${index + 1} of ${total}`);
  highlightMorseChar(index);
});
```

**Error Handling**:
- Web Audio API unavailable: Throws `Error("Web Audio API not supported")`
- Invalid morseSequence: Plays silently for invalid characters
- Empty sequence: Returns immediately without error

**Performance**:
- Startup latency: <50ms (AudioContext creation + first tone)
- Playback accuracy: ±2ms timing precision
- Memory: <1MB for AudioContext

---

### stop()

Stops current playback immediately.

**Parameters**: None

**Returns**: `void`

**Behavior**:
- Cancels all scheduled audio nodes
- Resets playback state
- Safe to call even if nothing playing
- `play()` promise rejects with `Error("Playback stopped")`

**Example**:
```javascript
const playback = play("... --- ...");
setTimeout(() => stop(), 1000);  // Stop after 1 second
```

---

### setSpeed(wpm)

Adjusts playback speed (words per minute).

**Parameters**:
- `wpm` (number): Words per minute (5-40)
  - 5 WPM: Very slow (learning)
  - 20 WPM: Default (comfortable)
  - 40 WPM: Fast (advanced)

**Returns**: `void`

**Behavior**:
- Calculates new `unitDuration`: `1200 / wpm`
- Updates internal config for next `play()` call
- Does not affect currently playing audio
- Clamps to valid range (5-40 WPM)

**Examples**:
```javascript
setSpeed(10);   // Slow (120ms unit duration)
setSpeed(20);   // Default (60ms unit duration)
setSpeed(40);   // Fast (30ms unit duration)
setSpeed(100);  // Clamped to 40 WPM
```

---

### isSupported()

Checks if Web Audio API is available in current browser.

**Parameters**: None

**Returns**: `boolean`
- `true`: Web Audio API available
- `false`: Not supported (graceful degradation needed)

**Example**:
```javascript
if (!isSupported()) {
  showMessage("Audio playback not supported in this browser");
  disableAudioButton();
}
```

---

## Internal Functions (Not Exported)

### scheduleTone(frequency, duration, startTime)

Schedules a single tone (dit or dah) using Web Audio API.

**Implementation Details**:
- Creates OscillatorNode for tone generation
- Creates GainNode for volume control and envelope
- Applies 5ms attack/release envelope to prevent clicks
- Schedules using `audioContext.currentTime + startTime`

---

### calculateDurations(morseSequence, unitDuration)

Pre-calculates all tone and gap durations before playback.

**Returns**: Array of timing events
```javascript
[
  { type: 'tone', duration: 60, char: '.' },
  { type: 'gap', duration: 60 },
  { type: 'tone', duration: 180, char: '-' },
  // ...
]
```

---

## Test Contract

**Unit Tests** (80%+ coverage required):

```javascript
describe('MorsePlayer', () => {
  describe('play()', () => {
    it('plays SOS correctly', async () => {
      const mockProgress = vi.fn();
      await play("... --- ...", null, mockProgress);
      expect(mockProgress).toHaveBeenCalled();
    });
    
    it('respects custom configuration', async () => {
      const config = { frequency: 700, unitDuration: 120, volume: 0.5 };
      await play(".-", config);
      // Verify audio properties (requires Web Audio API mocking)
    });
    
    it('calls onProgress with correct indices', async () => {
      const progressCalls = [];
      await play("... ---", null, (idx, total) => {
        progressCalls.push({ idx, total });
      });
      expect(progressCalls[0]).toEqual({ idx: 0, total: 7 });  // First '.'
    });
    
    it('handles empty sequence', async () => {
      await expect(play("")).resolves.toBeUndefined();
    });
    
    it('starts playback within 50ms', async () => {
      const start = performance.now();
      const playPromise = play(".");
      // Verify first tone scheduled within 50ms
      const latency = performance.now() - start;
      expect(latency).toBeLessThan(50);
      await playPromise;
    });
  });
  
  describe('stop()', () => {
    it('stops ongoing playback', async () => {
      const playPromise = play("... --- ...");
      setTimeout(() => stop(), 100);
      await expect(playPromise).rejects.toThrow("Playback stopped");
    });
    
    it('is safe to call when nothing playing', () => {
      expect(() => stop()).not.toThrow();
    });
  });
  
  describe('setSpeed()', () => {
    it('updates unit duration correctly', () => {
      setSpeed(20);
      // Verify internal config.unitDuration === 60
    });
    
    it('clamps to valid range', () => {
      setSpeed(100);  // Should clamp to 40
      setSpeed(1);    // Should clamp to 5
    });
  });
  
  describe('isSupported()', () => {
    it('returns true in modern browsers', () => {
      expect(isSupported()).toBe(true);
    });
    
    it('returns false when AudioContext unavailable', () => {
      // Mock environment without AudioContext
      global.AudioContext = undefined;
      expect(isSupported()).toBe(false);
    });
  });
});
```

**Integration Tests**:
- Play audio through UI button click
- Verify visual highlighting syncs with audio
- Test stop button during playback
- Validate speed slider updates playback rate

---

## Dependencies

**Browser APIs**:
- `AudioContext` (or `webkitAudioContext` for Safari)
- `OscillatorNode`
- `GainNode`
- `performance.now()` for timing

**Polyfills**: None required (graceful degradation)

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 35+ | ✅ Full | AudioContext native |
| Firefox 25+ | ✅ Full | AudioContext native |
| Safari 14.1+ | ✅ Full | Requires webkit prefix check |
| Edge 79+ | ✅ Full | AudioContext native |
| IE 11 | ❌ None | Graceful degradation |

**Fallback Strategy**:
- Check `isSupported()` on page load
- If false: Hide/disable audio buttons, show message
- Application remains functional without audio (visual-only mode)

---

## Implementation Notes

**Timing Precision**:
- Use `audioContext.currentTime` for scheduling (high precision)
- Avoid `setTimeout` (±10ms jitter, not suitable for Morse timing)
- Pre-calculate all event times before playback starts

**Memory Management**:
- Disconnect audio nodes after use
- Close AudioContext on page unload
- Avoid creating multiple AudioContexts (reuse singleton)

**Envelope Shaping** (prevent clicks):
```javascript
gainNode.gain.setValueAtTime(0, startTime);
gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.005);  // 5ms attack
gainNode.gain.linearRampToValueAtTime(volume, startTime + duration - 0.005);
gainNode.gain.linearRampToValueAtTime(0, startTime + duration);    // 5ms release
```

**Optimization**:
- Pool OscillatorNodes (create once, reuse)
- Pre-compute timing arrays
- Use `requestAnimationFrame` for visual sync (not audio scheduling)

**Extensibility**:
- Support different waveforms (sine, square, sawtooth)
- Adjustable envelope shapes
- Support for Farnsworth timing (character speed ≠ overall speed)
