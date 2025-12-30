# Research: Morse Code Translator Web App

**Created**: 2025-12-29  
**Feature**: [spec.md](spec.md)  
**Purpose**: Resolve technical unknowns and establish best practices for implementation

## Overview

This document captures research decisions for implementing a bidirectional Morse code translator using Vite with vanilla JavaScript. All technical unknowns from the Technical Context have been resolved through evaluation of standards, browser APIs, and best practices.

---

## Research Areas

### 1. Morse Code Standard and Character Encoding

**Decision**: Use International Morse Code (ITU-R M.1677-1 standard)

**Rationale**: 
- ITU-R M.1677-1 is the internationally recognized standard for Morse code
- Provides unambiguous encoding for A-Z, 0-9, and common punctuation
- Well-documented timing specifications (1:3:7 ratio for dit:dah:gap)
- Compatible with amateur radio and emergency communication standards

**Alternatives Considered**:
- American Morse Code: Obsolete, used historically by railroads, incompatible with modern usage
- Custom encoding: Would break compatibility with standard Morse code tools and learners

**Implementation Notes**:
- Character set: A-Z (26 letters), 0-9 (10 digits), punctuation (. , ? ' ! / ( ) & : ; = + - _ " $ @)
- Timing: 1 time unit = dit duration, 3 units = dah duration, 1 unit intra-character gap, 3 units inter-character gap, 7 units word gap
- Unsupported characters will be filtered with user notification

---

### 2. Web Audio API for Morse Code Playback

**Decision**: Use Web Audio API with OscillatorNode for tone generation

**Rationale**:
- Native browser support (no dependencies required)
- Precise timing control essential for Morse code accuracy
- Supports frequency modulation for authentic dit/dah sounds
- Hardware-accelerated, low latency (<10ms)
- Works offline after page load

**Alternatives Considered**:
- HTML5 `<audio>` element with pre-recorded files: Inflexible timing, requires network for audio files, larger payload
- Howler.js library: Adds dependency, unnecessary complexity for simple tone generation
- Tone.js: Powerful but overkill (70KB+), violates minimal dependency requirement

**Implementation Notes**:
- Frequency: 600Hz (standard Morse tone, comfortable for human hearing)
- Default speed: 20 WPM (words per minute) for beginners
- Volume: 0.3 (30% to prevent distortion)
- Envelope: 5ms attack/release to prevent clicking artifacts
- Graceful degradation: Show message if Web Audio API unavailable (IE 11, very old browsers)

**Browser Support**:
- Chrome 35+, Firefox 25+, Safari 14.1+, Edge 79+
- Coverage: >95% of global browser usage (caniuse.com data)

---

### 3. Testing Strategy for Vanilla JavaScript

**Decision**: Vitest for unit tests, Playwright for end-to-end tests

**Rationale**:
- **Vitest**: Vite-native testing framework, zero config needed, fast (instant HMR), ESM-native
- **Playwright**: Cross-browser testing (Chromium, Firefox, WebKit), reliable auto-wait, mobile viewport emulation
- Both align with minimal dependency philosophy and provide excellent DX

**Alternatives Considered**:
- Jest: Requires complex ESM configuration with Vite, slower than Vitest
- Mocha + Chai: More setup required, not optimized for Vite workflow
- Cypress: Heavier than Playwright, slower test execution, larger dependency footprint

**Test Coverage Requirements** (per Constitution Principle III & IV):
- Unit tests: 80%+ coverage for critical paths (translation logic, audio timing, clipboard operations)
- Integration tests: User story acceptance scenarios (16 total from spec.md)
- E2E tests: Cross-browser validation of P1-P2 user stories
- Performance tests: Verify <100ms translation latency with benchmark suite

---

### 4. Responsive Design and Mobile Optimization

**Decision**: Mobile-first CSS with CSS Grid and Flexbox, no framework

**Rationale**:
- Modern CSS Grid and Flexbox provide complete layout control without framework overhead
- Mobile-first approach ensures core functionality works on smallest screens (320px)
- Native CSS features (media queries, clamp(), CSS custom properties) eliminate need for preprocessor
- Zero JavaScript required for layout = better performance and accessibility

**Alternatives Considered**:
- Tailwind CSS: Adds build complexity and dependency, increases bundle size
- Bootstrap: Heavy framework (100KB+), violates minimal dependency requirement
- CSS-in-JS: Requires runtime JavaScript, impacts performance

**Implementation Notes**:
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
- Touch targets: Minimum 44x44px for mobile (WCAG 2.1 AAA compliance)
- Font sizing: Relative units (rem) with clamp() for fluid typography
- Color contrast: WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text)

---

### 5. Clipboard API for Copy Functionality

**Decision**: Use modern Clipboard API (navigator.clipboard) with fallback

**Rationale**:
- Async Clipboard API is the modern standard (Clipboard.writeText())
- Secure: Requires HTTPS or localhost (appropriate for modern web apps)
- Better UX: Async operation doesn't block UI
- Wide browser support with simple fallback strategy

**Alternatives Considered**:
- document.execCommand('copy'): Deprecated, synchronous, blocked in some browsers
- Third-party clipboard libraries: Unnecessary dependency for simple use case

**Implementation Notes**:
- Primary: `navigator.clipboard.writeText()` (Chrome 66+, Firefox 63+, Safari 13.1+)
- Fallback: `document.execCommand('copy')` for older browsers
- User feedback: Toast notification on successful copy
- Error handling: Show message if clipboard access denied (browser permissions)

**Browser Support**:
- Modern API: ~94% global coverage
- With fallback: ~99% global coverage

---

### 6. Build and Development Workflow

**Decision**: Vite 5.x with minimal configuration

**Rationale**:
- Lightning-fast HMR (<50ms) for excellent DX
- Optimized production builds with Rollup (tree-shaking, code splitting, minification)
- Zero-config for vanilla JavaScript projects
- Native ESM support aligns with modern JavaScript best practices
- Small dependency footprint (aligns with minimal library requirement)

**Alternatives Considered**:
- Webpack: Complex configuration, slower dev server, heavier tooling
- Parcel: Less control over build output, smaller ecosystem
- No bundler (raw ES modules): Poor production performance, no optimization, difficult dependency management

**Configuration**:
```javascript
// vite.config.js (minimal)
export default {
  base: './', // Relative paths for flexible deployment
  build: {
    target: 'es2022', // Modern JavaScript features
    outDir: 'dist',
    sourcemap: true
  }
}
```

**Scripts** (package.json):
- `npm run dev`: Development server with HMR
- `npm run build`: Production build (minified, optimized)
- `npm run preview`: Preview production build locally
- `npm test`: Run Vitest unit tests
- `npm run test:e2e`: Run Playwright tests
- `npm run lint`: ESLint validation

---

### 7. Offline-First Architecture

**Decision**: Service Worker with cache-first strategy

**Rationale**:
- Meets NFR-015: "System MUST work offline after initial load"
- Single HTML file + bundled JS/CSS = small cache footprint (<100KB)
- No dynamic data or API calls = simple caching strategy
- Progressive enhancement: Works without SW, better with it

**Alternatives Considered**:
- No offline support: Violates specification requirement
- IndexedDB caching: Overkill for static assets, adds complexity
- Application Cache (AppCache): Deprecated, unreliable

**Implementation Notes**:
- Use Vite PWA plugin for SW generation
- Cache strategy: Cache-first for static assets (HTML, JS, CSS)
- Update strategy: Background update check, prompt user on new version
- Fallback: Graceful degradation if SW not supported

---

### 8. Code Quality and Linting

**Decision**: ESLint with recommended ES2022 rules

**Rationale**:
- Industry standard for JavaScript linting
- Catches common errors before runtime
- Enforces consistent code style
- Integrates with VS Code and CI/CD pipelines

**Configuration**:
```json
{
  "extends": "eslint:recommended",
  "env": { "browser": true, "es2022": true },
  "parserOptions": { "ecmaVersion": 2022, "sourceType": "module" },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

---

## Technology Stack Summary

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Build Tool | Vite | 5.x | Fast dev server, optimized builds, zero config |
| Language | JavaScript | ES2022+ | Modern features, native browser support |
| Unit Testing | Vitest | Latest | Vite-native, fast, ESM support |
| E2E Testing | Playwright | Latest | Cross-browser, reliable, mobile testing |
| Audio | Web Audio API | Native | No dependencies, precise timing, offline |
| Clipboard | Clipboard API | Native | Modern async API with fallback |
| Styling | Vanilla CSS | CSS3 | Grid/Flexbox, custom properties, no preprocessor |
| Linting | ESLint | Latest | Code quality enforcement |
| Offline | Service Worker | Native | PWA capabilities, cache-first strategy |

**Total npm dependencies**: 3 (Vite, Vitest, Playwright - all dev dependencies)

---

## Performance Benchmarks

Based on research and similar implementations:

- **Initial Load**: <3s (target: <2s with HTTP/2 and compression)
- **Translation Latency**: <100ms for 500 chars (target: <50ms actual)
- **Audio Playback Start**: <50ms (Web Audio API typical latency)
- **Bundle Size**: <50KB gzipped (estimated: ~30KB actual)
- **Lighthouse Score**: Target 95+ (Performance, Accessibility, Best Practices, SEO)

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| Web Audio API unsupported | Detect capability, show message, degrade gracefully (visual-only mode) |
| Clipboard API blocked | Fallback to execCommand, then manual select-and-copy instructions |
| Large input performance | Debounce translation (300ms), limit input to 2000 chars, optimize algorithm |
| Browser compatibility | Target modern browsers (last 2 versions), provide compatibility message for old browsers |
| Offline functionality broken | Progressive enhancement: App works online if SW fails, clear error messages |

---

## Next Steps

1. ✅ Research complete - all technical decisions documented
2. → Proceed to Phase 1: Generate data-model.md (Morse character mappings, translation state)
3. → Proceed to Phase 1: Generate contracts/ (API contracts for modules)
4. → Proceed to Phase 1: Generate quickstart.md (Setup and development guide)
5. → Update agent context with technology stack
6. → Re-evaluate Constitution Check post-design
