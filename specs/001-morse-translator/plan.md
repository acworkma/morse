# Implementation Plan: Morse Code Translator Web App

**Branch**: `001-morse-translator` | **Date**: 2025-12-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-morse-translator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a web-based Morse code translator that enables bidirectional translation between English text and International Morse Code. The application will provide real-time translation, audio playback with standard timing, copy-to-clipboard functionality, and an interactive learning mode with visual feedback. Core technical approach uses Vite as the build tool with vanilla HTML, CSS, and JavaScript to minimize dependencies and enable offline-first functionality.

## Technical Context

**Language/Version**: JavaScript ES2022+ (modern browser support)  
**Primary Dependencies**: Vite 5.x (build tool only), Vitest (testing framework)  
**Storage**: None (client-side only, no persistence required)  
**Testing**: Vitest for unit tests, Playwright for end-to-end tests  
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: <100ms translation latency, <3s initial load time, 60fps UI responsiveness  
**Constraints**: Offline-first after initial load, no server-side processing, <200ms p95 translation latency for 500 char inputs  
**Scale/Scope**: Client-side only, supports inputs up to 2000 characters, responsive design 320px-4K resolution

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

- ✅ **I. Specification-First Development**: Complete specification exists at [spec.md](spec.md) with user stories, acceptance criteria, functional requirements, and success metrics
- ✅ **II. Incremental Delivery**: Feature decomposed into 4 independent user stories (P1-P4), each deliverable and testable standalone
- ✅ **III. Test-Driven Development**: Specification includes detailed acceptance scenarios in Given/When/Then format, ready for test implementation
- ✅ **IV. Code Quality & Maintainability**: Planning includes test coverage requirements (80%+ critical paths), linting (ESLint), and code review process
- ✅ **V. Documentation as Code**: All documentation in Markdown, version controlled, follows SpecKit structure

**Gate Status**: ✅ **PASS** - All constitutional principles satisfied. Proceeding to Phase 0 research.

### Post-Design Check (Phase 1)

*Completed after data-model.md and contracts/ generation*

- ✅ **I. Specification-First Development**: All design artifacts (data-model.md, contracts/) trace directly to spec requirements. Each module contract references specific functional requirements (FR-001 through FR-015)
- ✅ **II. Incremental Delivery**: Data model and contracts support independent implementation of P1-P4 user stories. MorseCodec, MorsePlayer, and UI Controller can be developed in parallel. Each story delivers standalone value
- ✅ **III. Test-Driven Development**: All contracts include comprehensive test specifications with 100%+ coverage of acceptance scenarios. Test-first development enabled by clear API contracts and expected behaviors
- ✅ **IV. Code Quality & Maintainability**: Contracts define clear module boundaries, error handling, performance targets, and accessibility requirements. Linting (ESLint), testing (Vitest/Playwright), and 80%+ coverage mandated
- ✅ **V. Documentation as Code**: All documentation in Markdown, version controlled in specs/ directory. Quickstart guide, module contracts, data model, and research all follow doc-as-code principles

**Gate Status**: ✅ **PASS** - All constitutional principles satisfied post-design. Ready to proceed to Phase 2 (task generation).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Single-page web application structure
index.html           # Entry point HTML
src/
├── main.js          # Application initialization
├── translator/
│   ├── morseCodec.js       # Morse encoding/decoding logic
│   └── morseData.js        # Character-to-Morse mappings (ITU-R M.1677-1)
├── audio/
│   └── morsePlayer.js      # Web Audio API for Morse playback
├── ui/
│   ├── app.js              # Main UI controller
│   └── clipboard.js        # Copy-to-clipboard functionality
└── styles/
    └── main.css            # Application styles (responsive, mobile-first)

tests/
├── unit/
│   ├── morseCodec.test.js
│   ├── morsePlayer.test.js
│   └── clipboard.test.js
└── e2e/
    ├── translation.spec.js
    ├── audio.spec.js
    └── mobile.spec.js

public/
└── favicon.ico

vite.config.js       # Vite configuration
vitest.config.js     # Test configuration
playwright.config.js # E2E test configuration
package.json         # Dependencies and scripts
.eslintrc.json       # Linting rules
.gitignore
README.md
```

**Structure Decision**: Selected single-page web application structure as this is a client-side only application with no backend. Vite provides fast development server and optimized production builds. Vanilla JavaScript modules enable clean separation of concerns (translation logic, audio, UI) without framework overhead. All source files in `src/` directory with clear functional organization.

## Complexity Tracking

**No constitutional violations requiring justification.**

All complexity is justified by functional requirements:
- **Web Audio API**: Required by FR-006 (audio playback) - no simpler alternative for precise Morse timing
- **Service Worker**: Required by NFR-015 (offline functionality) - standard PWA pattern
- **Debouncing**: Required by NFR-001 (<100ms latency) - prevents excessive translations during typing
- **Module separation**: Required by Principle IV (maintainability) - enables testing and parallel development

## Phase 0: Research & Technology Selection

**Status**: ✅ **COMPLETE**

**Output**: [research.md](research.md)

**Key Decisions**:
1. **Morse Standard**: ITU-R M.1677-1 International Morse Code
2. **Audio**: Web Audio API with OscillatorNode (native, no dependencies)
3. **Testing**: Vitest (unit) + Playwright (E2E)
4. **Build Tool**: Vite 5.x (fast HMR, optimized builds)
5. **Styling**: Vanilla CSS (Grid/Flexbox, mobile-first)
6. **Clipboard**: Modern Clipboard API with execCommand fallback
7. **Offline**: Service Worker with cache-first strategy

**Dependencies**: 3 total (all dev dependencies: Vite, Vitest, Playwright)

## Phase 1: Design & Contracts

**Status**: ✅ **COMPLETE**

**Outputs**:
- [data-model.md](data-model.md) - Data structures and state management
- [contracts/morseCodec.md](contracts/morseCodec.md) - Translation module API
- [contracts/morsePlayer.md](contracts/morsePlayer.md) - Audio playback module API
- [contracts/uiController.md](contracts/uiController.md) - UI controller API
- [quickstart.md](quickstart.md) - Development setup guide
- [.github/agents/copilot-instructions.md](../../.github/agents/copilot-instructions.md) - Updated agent context

**Design Summary**:
- **5 Core Entities**: Morse Code Map (54 characters), Translation Request/Result, Audio Configuration, Playback State
- **3 Primary Modules**: MorseCodec (translation), MorsePlayer (audio), UI Controller (interactions)
- **State Management**: Module-level state (no framework needed)
- **API Contracts**: Complete test specifications for TDD workflow

## Next Steps

This implementation plan is now **COMPLETE** through Phase 1. 

**To continue development**:

1. **Generate Task List** (Phase 2):
   ```bash
   /speckit.tasks
   ```
   This will create `tasks.md` with specific implementation tasks organized by user story priority (P1-P4).

2. **Begin Implementation** (Phase 3):
   ```bash
   /speckit.implement
   ```
   Follow TDD workflow from quickstart guide. Implement P1 (Text to Morse) first for MVP.

3. **Quality Checks**:
   - Run `/speckit.analyze` after task generation to verify consistency
   - Ensure 80%+ test coverage before story completion
   - Verify Constitution compliance throughout implementation

**Branch**: `001-morse-translator`  
**Estimated Effort**: 
- P1 (Text to Morse): 8-12 hours
- P2 (Morse to Text): 4-6 hours
- P3 (Copy/Share): 2-3 hours
- P4 (Interactive Learning): 4-6 hours
- **Total**: 18-27 hours for full feature set

**MVP Definition**: P1 + P2 complete = Bidirectional translator (12-18 hours)

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
