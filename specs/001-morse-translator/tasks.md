# Tasks: Morse Code Translator Web App

**Input**: Design documents from `/specs/001-morse-translator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly required in the feature specification. Tasks focus on implementation with test infrastructure setup for future use.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure: src/, tests/, public/ directories at repository root
- [ ] T002 Initialize Node.js project with package.json (Vite 5.x, Vitest, Playwright dev dependencies)
- [ ] T003 [P] Create vite.config.js with base path './' and target 'es2022'
- [ ] T004 [P] Create vitest.config.js for unit test configuration
- [ ] T005 [P] Create playwright.config.js for E2E test configuration
- [ ] T006 [P] Create .eslintrc.json with ES2022 recommended rules
- [ ] T007 [P] Create .gitignore with node_modules, dist, coverage entries
- [ ] T008 Create index.html entry point at repository root
- [ ] T009 [P] Create src/styles/main.css with CSS reset and responsive base styles

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create Morse code mapping data in src/translator/morseData.js (54 characters: A-Z, 0-9, punctuation)
- [ ] T011 [P] Create base HTML structure in index.html with text-input, morse-input, output areas, and control buttons
- [ ] T012 [P] Setup main.js entry point in src/main.js with app initialization
- [ ] T013 [P] Create utility functions for debouncing in src/ui/utils.js
- [ ] T014 Create responsive CSS Grid layout in src/styles/main.css (mobile-first, 320px-4K breakpoints)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Text to Morse Translation (Priority: P1) 🎯 MVP

**Goal**: Users can convert English text into Morse code with real-time translation and audio playback

**Independent Test**: Enter "HELLO" in text input, verify output shows ".... . .-.. .-.. ---", click play to hear audio

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement translate() function for text-to-Morse in src/translator/morseCodec.js
- [ ] T016 [P] [US1] Implement getSupportedCharacters() function in src/translator/morseCodec.js
- [ ] T017 [US1] Add input validation and unsupported character filtering in src/translator/morseCodec.js
- [ ] T018 [P] [US1] Create Web Audio API context initialization in src/audio/morsePlayer.js
- [ ] T019 [P] [US1] Implement play() function with OscillatorNode tone generation in src/audio/morsePlayer.js
- [ ] T020 [US1] Implement Morse timing (dit/dah/gaps) per ITU-R M.1677-1 in src/audio/morsePlayer.js
- [ ] T021 [US1] Add isSupported() check for Web Audio API in src/audio/morsePlayer.js
- [ ] T022 [US1] Create UI controller init() function in src/ui/app.js
- [ ] T023 [US1] Implement handleTextInput() with debouncing in src/ui/app.js
- [ ] T024 [US1] Implement updateOutput() to display translation results in src/ui/app.js
- [ ] T025 [US1] Implement handlePlayAudio() for audio playback control in src/ui/app.js
- [ ] T026 [US1] Add error message display for unsupported characters in src/ui/app.js
- [ ] T027 [US1] Style text input, Morse output, and play button in src/styles/main.css
- [ ] T028 [US1] Add mobile-responsive touch targets (44x44px minimum) in src/styles/main.css

**Checkpoint**: At this point, User Story 1 should be fully functional - users can type text and get Morse code with audio playback

---

## Phase 4: User Story 2 - Morse to Text Translation (Priority: P2)

**Goal**: Users can decode Morse code back to English text for learning and message verification

**Independent Test**: Enter "... --- ..." in Morse input, verify output shows "SOS", test with word separators

### Implementation for User Story 2

- [ ] T029 [P] [US2] Implement translate() function for Morse-to-text direction in src/translator/morseCodec.js
- [ ] T030 [P] [US2] Implement validateMorse() for pattern validation in src/translator/morseCodec.js
- [ ] T031 [US2] Add reverse mapping (Morse to character) lookup in src/translator/morseCodec.js
- [ ] T032 [US2] Handle word separators (/) and invalid sequences in src/translator/morseCodec.js
- [ ] T033 [US2] Implement handleMorseInput() with debouncing in src/ui/app.js
- [ ] T034 [US2] Add Morse input validation (dots, dashes, spaces, /) in src/ui/app.js
- [ ] T035 [US2] Display malformed Morse warnings in error area in src/ui/app.js
- [ ] T036 [US2] Implement handleClear() to reset both inputs and outputs in src/ui/app.js
- [ ] T037 [US2] Style Morse input textarea and text output display in src/styles/main.css
- [ ] T038 [US2] Add clear button styling in src/styles/main.css

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - bidirectional translation is complete

---

## Phase 5: User Story 3 - Copy and Share Results (Priority: P3)

**Goal**: Users can quickly copy translation results to clipboard for sharing and external use

**Independent Test**: Translate "HELLO", click copy Morse button, paste to verify clipboard contains correct Morse code

### Implementation for User Story 3

- [ ] T039 [P] [US3] Implement copy() function using Clipboard API in src/ui/clipboard.js
- [ ] T040 [P] [US3] Add execCommand('copy') fallback for older browsers in src/ui/clipboard.js
- [ ] T041 [US3] Handle clipboard permission errors gracefully in src/ui/clipboard.js
- [ ] T042 [US3] Implement handleCopy() for both Morse and text outputs in src/ui/app.js
- [ ] T043 [US3] Create showNotification() toast system in src/ui/app.js
- [ ] T044 [US3] Add copy success/error notifications in src/ui/app.js
- [ ] T045 [US3] Validate non-empty output before copy in src/ui/app.js
- [ ] T046 [US3] Style copy buttons with clipboard icon in src/styles/main.css
- [ ] T047 [US3] Create toast notification styles with auto-dismiss in src/styles/main.css

**Checkpoint**: All core translation and sharing features complete - app is fully functional for practical use

---

## Phase 6: User Story 4 - Interactive Learning Mode (Priority: P4)

**Goal**: Visual feedback during audio playback helps users learn Morse code by associating sounds with symbols

**Independent Test**: Enter "HI", play audio, verify each Morse character highlights sequentially during playback

### Implementation for User Story 4

- [ ] T048 [P] [US4] Implement onProgress callback support in play() function in src/audio/morsePlayer.js
- [ ] T049 [P] [US4] Add character-level timing calculations in src/audio/morsePlayer.js
- [ ] T050 [US4] Call progress callback at each character boundary in src/audio/morsePlayer.js
- [ ] T051 [US4] Implement stop() function to cancel playback in src/audio/morsePlayer.js
- [ ] T052 [US4] Implement setSpeed() for WPM adjustment (5-40 range) in src/audio/morsePlayer.js
- [ ] T053 [US4] Add character highlighting during playback in src/ui/app.js
- [ ] T054 [US4] Implement handleStopAudio() to stop playback and reset UI in src/ui/app.js
- [ ] T055 [US4] Implement handleSpeedChange() for speed slider in src/ui/app.js
- [ ] T056 [US4] Update speed display label in real-time in src/ui/app.js
- [ ] T057 [US4] Add speed slider control to HTML in index.html
- [ ] T058 [US4] Style character highlighting animation in src/styles/main.css
- [ ] T059 [US4] Style speed slider and stop button in src/styles/main.css

**Checkpoint**: All user stories complete - full educational experience with visual and audio learning features

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [ ] T060 [P] Add WCAG 2.1 AA accessibility attributes (aria-labels, keyboard navigation) in index.html
- [ ] T061 [P] Optimize CSS with color contrast validation (4.5:1 minimum) in src/styles/main.css
- [ ] T062 [P] Add fluid typography with clamp() for responsive text sizing in src/styles/main.css
- [ ] T063 [P] Create README.md with project overview and quickstart instructions at repository root
- [ ] T064 [P] Add performance monitoring (measure translation duration) in src/translator/morseCodec.js
- [ ] T065 [P] Add console error logging for audio and clipboard failures in src/ui/app.js
- [ ] T066 Create favicon.ico in public/ directory
- [ ] T067 [P] Add meta tags for mobile viewport and PWA in index.html
- [ ] T068 [P] Configure Service Worker for offline support using Vite PWA plugin in vite.config.js
- [ ] T069 Run production build test with npm run build and verify bundle size <100KB
- [ ] T070 Validate all quickstart.md test scenarios manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - MVP**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses MorseCodec from US1 but extends it independently
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Works with existing outputs from US1/US2
- **User Story 4 (P4)**: Depends on User Story 1 completion (extends audio playback) - Should start after US1 complete

### Within Each User Story

#### User Story 1 (Text to Morse + Audio)
1. T015-T017 (Codec) can run in parallel with T018-T021 (Audio)
2. T022-T026 (UI) depends on both Codec and Audio complete
3. T027-T028 (Styling) can run in parallel with UI implementation

#### User Story 2 (Morse to Text)
1. T029-T032 (Codec extension) first
2. T033-T036 (UI handlers) depends on Codec
3. T037-T038 (Styling) can run in parallel with UI

#### User Story 3 (Copy/Share)
1. T039-T041 (Clipboard utility) can run in parallel with T042-T045 (UI integration)
2. T046-T047 (Styling) can run in parallel with implementation

#### User Story 4 (Interactive Learning)
1. T048-T052 (Audio enhancements) can run in parallel with T057 (HTML)
2. T053-T056 (UI integration) depends on Audio enhancements
3. T058-T059 (Styling) can run in parallel with UI

### Parallel Opportunities

- **Setup Phase**: T003, T004, T005, T006, T007, T009 all parallel after T001-T002
- **Foundational Phase**: T011, T012, T013 can run in parallel after T010
- **Between User Stories**: US2, US3 can start in parallel after Foundational complete (US4 should wait for US1)
- **Polish Phase**: T060-T065, T067-T068 all parallel, T066 independent

---

## Parallel Example: User Story 1

```bash
# Step 1: Launch codec and audio in parallel
Task T015-T017: "Implement translation and validation in src/translator/morseCodec.js"
Task T018-T021: "Implement audio playback in src/audio/morsePlayer.js"

# Step 2: After both complete, launch UI
Task T022-T026: "Implement UI controller in src/ui/app.js"

# Step 3: Styling in parallel with UI
Task T027-T028: "Style components in src/styles/main.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended for Solo Development

1. Complete Phase 1: Setup (T001-T009) → ~2 hours
2. Complete Phase 2: Foundational (T010-T014) → ~2 hours
3. Complete Phase 3: User Story 1 (T015-T028) → ~8-12 hours
4. **STOP and VALIDATE**: Test text-to-Morse translation with audio
5. Optional: Deploy MVP for early feedback

**Total MVP Effort**: 12-16 hours
**MVP Value**: Functional Morse code translator with audio playback

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~4 hours)
2. Add User Story 1 → Test independently → **Deploy/Demo MVP** (~8-12 hours)
3. Add User Story 2 → Test independently → **Deploy bidirectional translator** (+4-6 hours)
4. Add User Story 3 → Test independently → **Deploy with sharing** (+2-3 hours)
5. Add User Story 4 → Test independently → **Deploy complete learning app** (+4-6 hours)
6. Polish (Phase 7) → **Production ready** (+3-4 hours)

**Total Full Feature**: 25-35 hours

### Parallel Team Strategy

With 3 developers after Foundational phase:

1. **Developer A**: User Story 1 (T015-T028) → 8-12 hours
2. **Developer B**: User Story 2 (T029-T038) → 4-6 hours, then User Story 3 (T039-T047) → 2-3 hours
3. **Developer C**: Setup test infrastructure, then User Story 4 after US1 complete (T048-T059) → 4-6 hours

All stories integrate at completion for full feature delivery.

---

## Notes

- **[P] tasks**: Different files, no dependencies, safe to parallelize
- **[Story] label**: Maps task to specific user story (US1, US2, US3, US4) for traceability
- **File paths**: All paths are absolute from repository root
- **Test infrastructure**: Setup included in Phase 1, but test writing is deferred (not in specification)
- **Constitution compliance**: 
  - ✅ Specification-first (all tasks from spec.md)
  - ✅ Incremental delivery (4 independent stories)
  - ✅ Test-ready (infrastructure in place for future TDD)
  - ✅ Maintainability (clear module boundaries from contracts/)
  - ✅ Documentation as code (all specs in markdown)
- **Performance targets**: 
  - Translation: <100ms (tracked in T064)
  - Initial load: <3s (verified in T069)
  - Audio latency: <50ms (built into T018-T020)
- **Browser support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (Web Audio + Clipboard API)
- **Offline-first**: Service Worker in T068 enables offline use after initial load
- **Accessibility**: WCAG 2.1 AA compliance in T060-T061

**Commit Strategy**: Commit after each completed user story phase (checkpoints) for clean rollback points
