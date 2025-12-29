# Quickstart Guide: Morse Code Translator

**Last Updated**: 2025-12-29  
**Prerequisites**: Node.js 18+, npm 9+

## Project Setup

### 1. Clone and Install

```bash
# Clone repository (if needed)
git clone <repository-url>
cd morse

# Checkout feature branch
git checkout 001-morse-translator

# Install dependencies
npm install
```

### 2. Development Workflow

```bash
# Start development server (with HMR)
npm run dev
# → Opens http://localhost:5173

# Run unit tests (watch mode)
npm test

# Run unit tests (CI mode, coverage)
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
morse/
├── index.html              # Entry point
├── src/
│   ├── main.js            # App initialization
│   ├── translator/
│   │   ├── morseCodec.js  # Translation logic
│   │   └── morseData.js   # Character mappings
│   ├── audio/
│   │   └── morsePlayer.js # Audio playback
│   ├── ui/
│   │   ├── app.js         # UI controller
│   │   └── clipboard.js   # Clipboard utils
│   └── styles/
│       └── main.css       # Application styles
├── tests/
│   ├── unit/              # Vitest unit tests
│   └── e2e/               # Playwright E2E tests
├── public/                # Static assets
├── specs/                 # Feature specifications
│   └── 001-morse-translator/
│       ├── spec.md        # Feature spec
│       ├── plan.md        # This implementation plan
│       ├── research.md    # Technology decisions
│       ├── data-model.md  # Data structures
│       ├── contracts/     # Module contracts
│       └── quickstart.md  # This file
├── package.json
├── vite.config.js
├── vitest.config.js
└── playwright.config.js
```

---

## Development Guide

### Running Tests (TDD Workflow)

Per Constitution Principle III, follow TDD cycle strictly:

**1. Write Test** (based on acceptance criteria from [spec.md](spec.md)):
```bash
# Example: tests/unit/morseCodec.test.js
describe('MorseCodec.translate()', () => {
  it('translates SOS correctly', () => {
    const result = translate('SOS', 'toMorse');
    expect(result.output).toBe('... --- ...');
  });
});
```

**2. Run Test (verify it fails)**:
```bash
npm test
# → Red: "translate is not defined"
```

**3. Implement Minimal Code**:
```javascript
// src/translator/morseCodec.js
export function translate(input, direction) {
  if (direction === 'toMorse') {
    return { output: '... --- ...', errors: [], unsupportedChars: [], duration: 0 };
  }
}
```

**4. Run Test (verify it passes)**:
```bash
npm test
# → Green: All tests pass
```

**5. Refactor** (improve code quality while keeping tests green):
```javascript
export function translate(input, direction) {
  const startTime = performance.now();
  // ... proper implementation ...
  return { 
    output: result,
    errors: [],
    unsupportedChars: [],
    duration: performance.now() - startTime
  };
}
```

### Adding New Features

Follow incremental delivery (Constitution Principle II):

1. **Select User Story** (from [spec.md](spec.md))
   - P1: Text to Morse Translation
   - P2: Morse to Text Translation
   - P3: Copy and Share
   - P4: Interactive Learning

2. **Write Tests First**:
   - Unit tests for logic
   - Integration tests for UI
   - E2E tests for user flows

3. **Implement Feature**:
   - Follow module contracts ([contracts/](contracts/))
   - Meet acceptance criteria
   - Pass all tests

4. **Verify Quality Gates**:
   - 80%+ test coverage for critical paths
   - All linters pass
   - No console errors
   - Performance benchmarks met

---

## Module Contracts

Each module has a detailed contract defining its API:

- **[MorseCodec](contracts/morseCodec.md)**: Translation logic
- **[MorsePlayer](contracts/morsePlayer.md)**: Audio playback
- **[UI Controller](contracts/uiController.md)**: User interactions

Read contracts before implementation to understand:
- Expected function signatures
- Error handling requirements
- Test expectations
- Performance targets

---

## Common Tasks

### Adding New Morse Characters

1. Update `src/translator/morseData.js`:
```javascript
export const MORSE_CODE_MAP = {
  // ... existing mappings ...
  '€': '..--..',  // Add new character
};
```

2. Add test case:
```javascript
it('translates Euro symbol', () => {
  const result = translate('€', 'toMorse');
  expect(result.output).toBe('..--..');
});
```

3. Update documentation (if changing supported character set)

### Debugging Audio Issues

```bash
# Check Web Audio API support
console.log('AudioContext' in window);

# Enable audio debug logging
localStorage.setItem('DEBUG_AUDIO', 'true');

# Check browser console for timing logs
# Verify frequency, duration, gaps match ITU-R M.1677-1
```

### Performance Testing

```bash
# Run benchmark suite
npm run benchmark

# Expected results:
# - Translation: <50ms for 500 chars
# - Audio start: <50ms latency
# - Bundle size: <50KB gzipped
```

---

## Testing Strategy

### Unit Tests (Vitest)

Test individual functions in isolation:

```javascript
// tests/unit/morseCodec.test.js
import { translate } from '@/translator/morseCodec';

describe('translate()', () => {
  it('handles empty input', () => {
    const result = translate('', 'toMorse');
    expect(result.output).toBe('');
  });
});
```

**Run**: `npm test`  
**Coverage**: `npm run test:coverage`

### E2E Tests (Playwright)

Test complete user journeys:

```javascript
// tests/e2e/translation.spec.js
test('translates text to Morse', async ({ page }) => {
  await page.goto('/');
  await page.fill('#text-input', 'SOS');
  const output = await page.textContent('#morse-output');
  expect(output).toBe('... --- ...');
});
```

**Run**: `npm run test:e2e`  
**UI Mode**: `npm run test:e2e -- --ui`

---

## Deployment

### Production Build

```bash
# Build optimized bundle
npm run build

# Output: dist/
# - index.html
# - assets/*.js (minified, hashed)
# - assets/*.css (minified)

# Verify build
npm run preview
```

### Static Hosting

**Recommended Platforms**:
- Netlify: Drop `dist/` folder or connect GitHub
- Vercel: Zero-config deployment
- GitHub Pages: `gh-pages` branch
- Cloudflare Pages: GitHub integration

**Deploy to Netlify**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Environment Configuration

No environment variables needed (client-side only).

Optional: Configure base path for subdirectory deployment:

```javascript
// vite.config.js
export default {
  base: '/morse-translator/'  // For example.com/morse-translator/
}
```

---

## Troubleshooting

### Vite Dev Server Issues

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Test Failures

```bash
# Run specific test file
npm test -- morseCodec.test.js

# Run tests in UI mode (visual debugger)
npm test -- --ui

# Update snapshots (if applicable)
npm test -- -u
```

### Audio Not Working

**Checklist**:
- [ ] Browser supports Web Audio API (Chrome 35+, Firefox 25+, Safari 14.1+)
- [ ] HTTPS or localhost (required for Web Audio security)
- [ ] User interaction triggered playback (autoplay policy)
- [ ] Volume not muted
- [ ] No console errors

### Performance Issues

```bash
# Analyze bundle size
npm run build -- --mode analyze

# Check for large dependencies
npm ls --depth=0

# Profile in browser DevTools:
# 1. Open DevTools > Performance tab
# 2. Record while translating
# 3. Look for long tasks (>100ms)
```

---

## Code Quality Standards

Follow Constitution Principle IV guidelines:

**Linting**:
```bash
npm run lint
# Fix auto-fixable issues:
npm run lint -- --fix
```

**Code Review Checklist**:
- [ ] All tests pass (unit + E2E)
- [ ] Test coverage ≥80% for critical paths
- [ ] No console.log statements (use proper logging)
- [ ] Code follows existing style conventions
- [ ] Functions have JSDoc comments for public APIs
- [ ] Accessibility requirements met (ARIA, keyboard nav)
- [ ] Performance benchmarks met

---

## Resources

**Documentation**:
- [Feature Specification](spec.md)
- [Implementation Plan](plan.md)
- [Research Decisions](research.md)
- [Data Model](data-model.md)
- [Module Contracts](contracts/)

**External References**:
- [ITU-R M.1677-1](https://www.itu.int/rec/R-REC-M.1677-1-200910-I/) - Morse code standard
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

**Constitution**:
- [Morse Constitution](../../.specify/memory/constitution.md)

---

## Getting Help

**Common Commands Reference**:
```bash
npm run dev          # Start dev server
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Check code quality
npm run build        # Production build
npm run preview      # Preview build
```

**File an Issue**:
Include:
1. What you expected to happen
2. What actually happened
3. Steps to reproduce
4. Browser/OS version
5. Console errors (if any)

**Pull Request Guidelines**:
1. Create feature branch from `001-morse-translator`
2. Write tests first (TDD)
3. Ensure all tests pass
4. Update documentation
5. Request code review
6. Verify CI passes
