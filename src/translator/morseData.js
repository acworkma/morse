/**
 * International Morse Code character mapping (ITU-R M.1677-1)
 * 54 total characters: 26 letters + 10 digits + 18 punctuation marks
 */

export const MORSE_CODE_MAP = {
  // Letters A-Z
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',

  // Numbers 0-9
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',

  // Punctuation
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '\'': '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  '_': '..--.-',
  '"': '.-..-.',
  '$': '...-..-',
  '@': '.--.-.'
};

/**
 * Reverse mapping: Morse code → Character
 * Generated at module load for efficient lookups
 */
export const TEXT_FROM_MORSE = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([char, morse]) => [morse, char])
);

/**
 * Morse timing constants per ITU-R M.1677-1
 * All values are in "units" where 1 unit = base duration
 */
export const MORSE_TIMING = {
  DIT: 1,              // Dot duration: 1 unit
  DAH: 3,              // Dash duration: 3 units
  INTRA_CHAR_GAP: 1,   // Gap between dits/dahs within a character: 1 unit
  INTER_CHAR_GAP: 3,   // Gap between characters: 3 units
  WORD_GAP: 7          // Gap between words: 7 units
};

/**
 * Get array of all supported characters
 * @returns {string[]} Array of 54 supported characters
 */
export function getSupportedCharacters() {
  return Object.keys(MORSE_CODE_MAP);
}
