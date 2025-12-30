# Tasks: Morse Code Translator Web App

**Input**: Design documents from `/specs/001-morse-translator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Following Constitution Principle III (TDD is NON-NEGOTIABLE), test tasks are included BEFORE implementation tasks for each user story. Tests must be written first, verified to fail, then implementation proceeds.

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

### Tests for User Story 1 (Write FIRST per TDD Principle III)

⚠️ **CRITICAL**: All tests below MUST be written and verified to FAIL before any US1 implementation tasks begin

- [ ] T015 [P] [US1-TEST] Write unit test: translate("SOS", "toMorse") returns "... --- ..." in tests/unit/morseCodec.test.js
- [ ] T016 [P] [US1-TEST] Write unit test: translate() handles lowercase input (converts to uppercase) in tests/unit/morseCodec.test.js
- [ ] T017 [P] [US1-TEST] Write unit test: translate() handles numbers "123" correctly in tests/unit/morseCodec.test.js
- [ ] T018 [P] [US1-TEST] Write unit test: translate() preserves word spacing with "/" in tests/unit/morseCodec.test.js
- [ ] T019 [P] [US1-TEST] Write unit test: translate() filters unsupported characters and returns warnings in tests/unit/morseCodec.test.js
- [ ] T020 [P] [US1-TEST] Write unit test: getSupportedCharacters() returns all 54 characters in tests/unit/morseCodec.test.js
- [ ] T021 [P] [US1-TEST] Write unit test: play() schedules correct dit/dah tones in tests/unit/morsePlayer.test.js
- [ ] T022 [P] [US1-TEST] Write unit test: play() uses ITU-R M.1677-1 timing (1:3:7 ratio) in tests/unit/morsePlayer.test.js
- [ ] T023 [P] [US1-TEST] Write unit test: isSupported() detects Web Audio API availability in tests/unit/morsePlayer.test.js
- [ ] T024 [US1-TEST] Write integration test: User types "HELLO", output displays ".... . .-.. .-.. ---" in tests/integration/translation.test.js
- [ ] T025 [US1-TEST] Write integration test: Click play button triggers audio playback in tests/integration/audio.test.js
- [ ] T026 [US1-TEST] Write E2E test: Full text-to-Morse workflow with audio in tests/e2e/translation.spec.js
- [ ] T027 [US1-TEST] **VERIFY ALL US1 TESTS FAIL** - Run `npm test` and confirm all 13 US1 tests fail appropriately

**Checkpoint**: Tests written and failing ✅ - Ready to begin US1 implementation

### Implementation for User Story 1

- [ ] T028 [P] [US1] Implement translate() function for text-to-Morse in src/translator/morseCodec.js (depends on T015-T020 passing)
- [ ] T029 [P] [US1] Implement getSupportedCharacters() function in src/translator/morseCodec.js (depends on T020 passing)
- [ ] T030 [US1] Add input validation and unsupported character filtering in src/translator/morseCodec.js (depends on T019 passing)
- [ ] T031 [P] [US1] Create Web Audio API context initialization in src/audio/morsePlayer.js (depends on T023 passing)
- [ ] T032 [P] [US1] Implement play() function with OscillatorNode tone generation in src/audio/morsePlayer.js (depends on T021-T022 passing)
- [ ] T033 [US1] Implement Morse timing (dit/dah/gaps) per ITU-R M.1677-1 in src/audio/morsePlayer.js (depends on T022 passing)
- [ ] T034 [US1] Add isSupported() check for Web Audio API in src/audio/morsePlayer.js (depends on T023 passing)
- [ ] T035 [US1] Create UI controller init() function in src/ui/app.js
- [ ] T036 [US1] Implement handleTextInput() with debouncing in src/ui/app.js (depends on T024 passing)
- [ ] T037 [US1] Implement updateOutput() to display translation results in src/ui/app.js (depends on T024 passing)
- [ ] T038 [US1] Implement handlePlayAudio() for audio playback control in src/ui/app.js (depends on T025 passing)
- [ ] T039 [US1] Add error message display for unsupported characters in src/ui/app.js
- [ ] T040 [US1] Style text input, Morse output, and play button in src/styles/main.css
- [ ] T041 [US1] Add mobile-responsive touch targets (44x44px minimum) in src/styles/main.css
- [ ] T042 [US1] **RUN ALL US1 TESTS** - Verify all 13 tests pass, 80%+ coverage achieved

**Checkpoint**: At this point, User Story 1 should be fully functional - users can type text and get Morse code with audio playback

---

## Phase 4: User Story 2 - Morse to Text Translation (Priority: P2)

**Goal**: Users can decode Morse code back to English text for learning and message verification

**Independent Test**: Enter "... --- ..." in Morse input, verify output shows "SOS", test with word separators

### Tests for User Story 2 (Write FIRST per TDD Principle III)

⚠️ **CRITICAL**: All tests below MUST be written and verified to FAIL before any US2 implementation tasks begin

- [ ] T043 [P] [US2-TEST] Write unit test: translate("... --- ...", "toText") returns "SOS" in tests/unit/morseCodec.test.js
- [ ] T044 [P] [US2-TEST] Write unit test: translate() handles word separators "/" correctly in tests/unit/morseCodec.test.js
- [ ] T045 [P] [US2-TEST] Write unit test: validateMorse("...") returns true, validateMorse(".......") returns false in tests/unit/morseCodec.test.js
- [ ] T046 [P] [US2-TEST] Write unit test: translate() handles invalid Morse gracefully with error messages in tests/unit/morseCodec.test.js
- [ ] T047 [US2-TEST] Write integration test: User enters Morse, output displays decoded text in tests/integration/translation.test.js
- [ ] T048 [US2-TEST] Write integration test: Clear button resets both inputs and outputs in tests/integration/ui.test.js
- [ ] T049 [US2-TEST] Write E2E test: Full Morse-to-text workflow in tests/e2e/translation.spec.js
- [ ] T050 [US2-TEST] **VERIFY ALL US2 TESTS FAIL** - Run `npm test` and confirm all 7 US2 tests fail appropriately

**Checkpoint**: Tests written and failing ✅ - Ready to begin US2 implementation

### Implementation for User Story 2

- [ ] T051 [P] [US2] Implement translate() function for Morse-to-text direction in src/translator/morseCodec.js (depends on T043-T044 passing)
- [ ] T052 [P] [US2] Implement validateMorse() for pattern validation in src/translator/morseCodec.js (depends on T045 passing)
- [ ] T053 [US2] Add reverse mapping (Morse to character) lookup in src/translator/morseCodec.js (depends on T043 passing)
- [ ] T054 [US2] Handle word separators (/) and invalid sequences in src/translator/morseCodec.js (depends on T044, T046 passing)
- [ ] T055 [US2] Implement handleMorseInput() with debouncing in src/ui/app.js (depends on T047 passing)
- [ ] T056 [US2] Add Morse input validation (dots, dashes, spaces, /) in src/ui/app.js (depends on T045 passing)
- [ ] T057 [US2] Display malformed Morse warnings in error area in src/ui/app.js (depends on T046 passing)
- [ ] T058 [US2] Implement handleClear() to reset both inputs and outputs in src/ui/app.js (depends on T048 passing)
- [ ] T059 [US2] Style Morse input textarea and text output display in src/styles/main.css
- [ ] T060 [US2] Add clear button styling in src/styles/main.css
- [ ] T061 [US2] **RUN ALL US2 TESTS** - Verify all 7 tests pass, bidirectional translation working

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - bidirectional translation is complete

---

## Phase 5: User Story 3 - Copy and Share Results (Priority: P3)

**Goal**: Users can quickly copy translation results to clipboard for sharing and external use

**Independent Test**: Translate "HELLO", click copy Morse button, paste to verify clipboard contains correct Morse code

### Tests for User Story 3 (Write FIRST per TDD Principle III)

⚠️ **CRITICAL**: All tests below MUST be written and verified to FAIL before any US3 implementation tasks begin

- [ ] T062 [P] [US3-TEST] Write unit test: copy() successfully writes to clipboard in tests/unit/clipboard.test.js
- [ ] T063 [P] [US3-TEST] Write unit test: copy() falls back to execCommand when Clipboard API unavailable in tests/unit/clipboard.test.js
- [ ] T064 [P] [US3-TEST] Write unit test: copy() handles permission denied gracefully in tests/unit/clipboard.test.js
- [ ] T065 [US3-TEST] Write integration test: Click copy button, clipboard contains correct content in tests/integration/clipboard.test.js
- [ ] T066 [US3-TEST] Write integration test: Copy with empty output shows warning in tests/integration/clipboard.test.js
- [ ] T067 [US3-TEST] Write integration test: Toast notification appears on successful copy in tests/integration/ui.test.js
- [ ] T068 [US3-TEST] Write E2E test: Full copy workflow with clipboard verification in tests/e2e/clipboard.spec.js
- [ ] T069 [US3-TEST] **VERIFY ALL US3 TESTS FAIL** - Run `npm test` and confirm all 7 US3 tests fail appropriately

**Checkpoint**: Tests written and failing ✅ - Ready to begin US3 implementation

### Implementation for User Story 3

- [ ] T070 [P] [US3] Implement copy() function using Clipboard API in src/ui/clipboard.js (depends on T062 passing)
- [ ] T071 [P] [US3] Add execCommand('copy') fallback for older browsers in src/ui/clipboard.js (depends on T063 passing)
- [ ] T072 [US3] Handle clipboard permission errors gracefully in src/ui/clipboard.js (depends on T064 passing)
- [ ] T073 [US3] Implement handleCopy() for both Morse and text outputs in src/ui/app.js (depends on T065 passing)
- [ ] T074 [US3] Create showNotification() toast system in src/ui/app.js (depends on T067 passing)
- [ ] T075 [US3] Add copy success/error notifications in src/ui/app.js (depends on T067 passing)
- [ ] T076 [US3] Validate non-empty output before copy in src/ui/app.js (depends on T066 passing)
- [ ] T077 [US3] Style copy buttons with clipboard icon in src/styles/main.css
- [ ] T078 [US3] Create toast notification styles with auto-dismiss in src/styles/main.css
- [ ] T079 [US3] **RUN ALL US3 TESTS** - Verify all 7 tests pass, clipboard functionality working

**Checkpoint**: All core translation and sharing features complete - app is fully functional for practical use

---

## Phase 6: User Story 4 - Interactive Learning Mode (Priority: P4)

**Goal**: Visual feedback during audio playback helps users learn Morse code by associating sounds with symbols

**Independent Test**: Enter "HI", play audio, verify each Morse character highlights sequentially during playback

### Tests for User Story 4 (Write FIRST per TDD Principle III)

⚠️ **CRITICAL**: All tests below MUST be written and verified to FAIL before any US4 implementation tasks begin

- [ ] T080 [P] [US4-TEST] Write unit test: play() accepts onProgress callback and calls it correctly in tests/unit/morsePlayer.test.js
- [ ] T081 [P] [US4-TEST] Write unit test: onProgress receives correct index and total values in tests/unit/morsePlayer.test.js
- [ ] T082 [P] [US4-TEST] Write unit test: stop() cancels playback and resets state in tests/unit/morsePlayer.test.js
- [ ] T083 [P] [US4-TEST] Write unit test: setSpeed() updates WPM and clamps to 5-40 range in tests/unit/morsePlayer.test.js
- [ ] T084 [US4-TEST] Write integration test: Character highlighting syncs with audio playback in tests/integration/audio.test.js
- [ ] T085 [US4-TEST] Write integration test: Stop button halts playback and removes highlighting in tests/integration/audio.test.js
- [ ] T086 [US4-TEST] Write integration test: Speed slider updates playback rate in tests/integration/audio.test.js
- [ ] T087 [US4-TEST] Write E2E test: Full interactive learning workflow with visual feedback in tests/e2e/learning.spec.js
- [ ] T088 [US4-TEST] **VERIFY ALL US4 TESTS FAIL** - Run `npm test` and confirm all 8 US4 tests fail appropriately

**Checkpoint**: Tests written and failing ✅ - Ready to begin US4 implementation

### Implementation for User Story 4

- [ ] T089 [P] [US4] Implement onProgress callback support in play() function in src/audio/morsePlayer.js (depends on T080-T081 passing)
- [ ] T090 [P] [US4] Add character-level timing calculations in src/audio/morsePlayer.js (depends on T081 passing)
- [ ] T091 [US4] Call progress callback at each character boundary in src/audio/morsePlayer.js (depends on T081 passing)
- [ ] T092 [US4] Implement stop() function to cancel playback in src/audio/morsePlayer.js (depends on T082 passing)
- [ ] T093 [US4] Implement setSpeed() for WPM adjustment (5-40 range) in src/audio/morsePlayer.js (depends on T083 passing)
- [ ] T094 [US4] Add character highlighting during playback in src/ui/app.js (depends on T084 passing)
- [ ] T095 [US4] Implement handleStopAudio() to stop playback and reset UI in src/ui/app.js (depends on T085 passing)
- [ ] T096 [US4] Implement handleSpeedChange() for speed slider in src/ui/app.js (depends on T086 passing)
- [ ] T097 [US4] Update speed display label in real-time in src/ui/app.js (depends on T086 passing)
- [ ] T098 [US4] Add speed slider control to HTML in index.html
- [ ] T099 [US4] Style character highlighting animation in src/styles/main.css
- [ ] T100 [US4] Style speed slider and stop button in src/styles/main.css
- [ ] T101 [US4] **RUN ALL US4 TESTS** - Verify all 8 tests pass, interactive learning mode complete

**Checkpoint**: All user stories complete - full educational experience with visual and audio learning features

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [ ] T102 [P] Add WCAG 2.1 AA accessibility attributes (aria-labels, keyboard navigation) in index.html
- [ ] T103 [P] Optimize CSS with color contrast validation (4.5:1 minimum) in src/styles/main.css
- [ ] T104 [P] Add fluid typography with clamp() for responsive text sizing in src/styles/main.css
- [ ] T105 [P] Create README.md with project overview and quickstart instructions at repository root
- [ ] T106 [P] Add performance monitoring (measure translation duration) in src/translator/morseCodec.js
- [ ] T107 [P] Add console error logging for audio and clipboard failures in src/ui/app.js
- [ ] T108 Create favicon.ico in public/ directory
- [ ] T109 [P] Add meta tags for mobile viewport and PWA in index.html
- [ ] T110 [P] Configure Service Worker for offline support using Vite PWA plugin in vite.config.js
- [ ] T111 Run production build test with npm run build and verify bundle size <100KB
- [ ] T112 Validate all quickstart.md test scenarios manually
- [ ] T113 [P] Verify all 18 punctuation marks translate correctly (addresses coverage gap G1)
- [ ] T114 **FINAL TEST RUN** - Execute full test suite, verify 80%+ coverage, all tests passing

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
3. Complete Phase 3: User Story 1 (T015-T042) → ~12-16 hours
   - Write tests (T015-T027): ~4 hours
   - Implement & verify (T028-T042): ~8-12 hours
4. **STOP and VALIDATE**: All US1 tests passing, text-to-Morse translation with audio working
5. Optional: Deploy MVP for early feedback

**Total MVP Effort**: 16-20 hours (includes test writing)
**MVP Value**: Functional Morse code translator with audio playback + 80%+ test coverage

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~4 hours)
2. Add User Story 1 → Write tests → Implement → All tests pass → **Deploy/Demo MVP** (~12-16 hours)
3. Add User Story 2 → Write tests → Implement → All tests pass → **Deploy bidirectional translator** (+6-8 hours)
4. Add User Story 3 → Write tests → Implement → All tests pass → **Deploy with sharing** (+4-5 hours)
5. Add User Story 4 → Write tests → Implement → All tests pass → **Deploy complete learning app** (+6-8 hours)
6. Polish (Phase 7) → **Production ready** (+4-5 hours)

**Total Full Feature**: 36-46 hours (TDD cycle included)
**Test Coverage**: 35 test tasks ensuring 80%+ coverage across all user stories

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
- **[Story-TEST] label**: Test tasks that MUST be completed before implementation tasks
- **File paths**: All paths are absolute from repository root
- **TDD Cycle**: For each user story: Write tests → Verify they fail → Implement → Verify tests pass
- **Constitution compliance**: 
  - ✅ Specification-first (all tasks from spec.md)
  - ✅ Incremental delivery (4 independent stories)
  - ✅ Test-Driven Development (35 test tasks follow strict TDD cycle - Principle III NON-NEGOTIABLE)
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
