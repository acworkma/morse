# Morse Code Translator

A modern, accessible web application for translating between text and International Morse Code with audio playback support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tests](https://img.shields.io/badge/tests-104%2F104-success.svg)
![Coverage](https://img.shields.io/badge/coverage-80%25%2B-success.svg)

## Features

✨ **Bidirectional Translation**
- Text to Morse code conversion
- Morse code to text decoding
- Support for 54 characters: A-Z, 0-9, and 18 punctuation marks

🔊 **Audio Playback**
- ITU-R M.1677-1 compliant timing
- Adjustable speed (5-40 WPM)
- Visual character highlighting during playback
- Stop/pause controls

📋 **Copy & Share**
- One-click clipboard copy
- Toast notifications for user feedback
- Cross-browser compatibility

🎯 **Interactive Learning**
- Real-time character highlighting
- Visual feedback during audio playback
- Adjustable playback speed for learning

♿ **Accessible**
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- ARIA labels and live regions

📱 **Responsive Design**
- Mobile-first approach
- Works on all screen sizes
- Touch-optimized controls

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Modern web browser with Web Audio API support

### Installation

```bash
# Clone the repository
git clone https://github.com/acworkma/morse.git
cd morse

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Usage

**Text to Morse:**
1. Type text in the "Text Input" field
2. See Morse code appear in the output
3. Click "▶ Play Audio" to hear the Morse code
4. Click "📋 Copy Morse" to copy to clipboard

**Morse to Text:**
1. Enter Morse code using dots (.), dashes (-), and spaces
2. Use `/` to separate words
3. See decoded text in the output
4. Click "📋 Copy Text" to copy to clipboard

**Interactive Learning:**
- Adjust playback speed with the slider (5-40 WPM)
- Watch characters highlight as they play
- Use the stop button to pause at any time

## Development

### Available Scripts

```bash
npm run dev          # Start dev server with HMR
npm test             # Run unit & integration tests
npm run test:e2e     # Run E2E tests (Playwright)
npm run test:coverage # Run tests with coverage report
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code (if configured)
```

### Testing

The project includes comprehensive test coverage:
- **Unit tests**: 21 tests for core modules (Vitest)
- **Integration tests**: 23 tests for UI workflows (Vitest + jsdom)
- **E2E tests**: 60 tests across 4 browsers (Playwright)

```bash
# Run all tests
npm test -- --run

# Run specific test file
npm test -- --run tests/unit/morseCodec.test.js

# Run E2E tests
npx playwright test

# Run E2E tests in headed mode
npx playwright test --headed

# View test report
npx playwright show-report
```

### Project Structure

```
morse/
├── src/
│   ├── audio/
│   │   └── morsePlayer.js      # Web Audio API integration
│   ├── translator/
│   │   ├── morseCodec.js       # Translation logic
│   │   └── morseData.js        # Character mappings
│   ├── ui/
│   │   ├── app.js              # Main UI controller
│   │   ├── clipboard.js        # Clipboard operations
│   │   └── utils.js            # Utility functions
│   ├── styles/
│   │   └── main.css            # Application styles
│   └── main.js                 # Entry point
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── index.html                  # Main HTML file
└── package.json
```

## Technical Details

### Morse Code Standard

Implements ITU-R M.1677-1 International Morse Code:
- **Dit (dot)**: 1 unit
- **Dah (dash)**: 3 units
- **Intra-character gap**: 1 unit
- **Inter-character gap**: 3 units
- **Word gap**: 7 units

### Supported Characters

- **Letters**: A-Z (26)
- **Numbers**: 0-9 (10)
- **Punctuation**: . , ? ' ! / ( ) & : ; = + - _ " $ @ (18)

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with Web Audio API

### Performance

- Translation: <100ms for 2000 characters
- Page load: <3 seconds
- Audio latency: <50ms
- UI updates: 60fps

## Architecture

**Design Patterns:**
- Modular ES6 architecture
- Event-driven UI updates
- Separation of concerns (codec, player, UI)
- Progressive enhancement

**Key Technologies:**
- Vite 5.x (build tool & dev server)
- Vanilla JavaScript ES2022+
- Web Audio API (OscillatorNode)
- Vitest (unit/integration testing)
- Playwright (E2E testing)

## Accessibility

WCAG 2.1 AA compliant:
- Minimum 4.5:1 color contrast ratio
- ARIA labels and landmarks
- Keyboard navigation support
- Screen reader announcements
- Focus indicators
- Reduced motion support

## Contributing

This is a personal learning project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- ITU-R M.1677-1 for Morse code specification
- Web Audio API documentation
- WCAG 2.1 accessibility guidelines

## Resources

- [ITU-R M.1677-1 Morse Code](https://www.itu.int/rec/R-REC-M.1677-1-200910-I/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Built with ❤️ using vanilla JavaScript and modern web standards**
