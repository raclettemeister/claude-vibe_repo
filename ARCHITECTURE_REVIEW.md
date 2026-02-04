# Chez Julien Simulator — Architecture Review & Rework Guide

**Purpose:** A comprehensive review of the current codebase (vibe-coded) and a practical guide to rework it before further development.

---

## Executive Summary

The game is **playable and feature-rich**, but the architecture is **monolithic and tightly coupled**. The main pain points:

| Area | Current state | Risk |
|------|----------------|------|
| **Single file** | ~7,745 lines in `index.html` (HTML + CSS + JS) | Hard to navigate, merge conflicts, slow tooling |
| **Data vs logic** | Events in `events.js` call `gameState` and mutate it | Can't test events in isolation; data not serializable |
| **Global state** | One big `gameState` + many globals (`currentEvent`, `usedEvents`, etc.) | Hidden dependencies; hard to reason about flow |
| **UI ↔ logic** | DOM IDs and `getElementById` scattered in game logic | Can't run headless; UI and rules are fused |
| **Debug code** | `fetch('http://127.0.0.1:7242/...')` in multiple places | Fails in prod; should be behind a flag or removed |
| **Duplication** | Finance math in `calculateMonthlyFinancials` and again in `updateBankStatement` | Bugs when one is updated and the other isn't |

This doc goes through **what’s wrong**, **what’s good**, and **concrete steps to rework** without a full rewrite.

---

## 1. File & Module Structure

### What’s wrong

- **One giant `index.html`** (~7,745 lines):
  - Inline `<style>` (~2,800 lines of CSS)
  - Inline `<script>` (~4,500+ lines of JS)
  - All game logic, UI updates, intro, pixel art, music, charts, burnout, end screen in one scope

- **`data/events.js`** (~3,195 lines):
  - Defines a single global `const events = [ ... ]`
  - Event objects contain **functions** that close over `gameState` (`condition`, `getChoices`, `description` as function, `conditionalEffects`)
  - 77+ events use `condition: () => gameState....` — **events depend on global state at runtime**, so they’re not pure data

- **No clear entry point or layers**: Everything loads in order; `events.js` runs after the first script block that defines `gameState`, so it relies on load order.

### What’s good

- **Data separated from HTML**: Events live in `data/events.js`; locales in `data/locales/*.json`.
- **i18n design**: `getUI(key, fallback)`, `templateStr()`, and locale JSON give a clear pattern for translated copy (even if not every string is in locale yet).

### Rework guide

1. **Split `index.html` into:**
   - `index.html` — minimal HTML, no big inline blocks.
   - `css/main.css` (or `css/screens.css`, `css/components.css` if you prefer) — all current `<style>` content.
   - `js/main.js` — bootstrap: load locale, init state, start app.
   - Additional JS modules (see below) loaded as ES modules or via a small bundler.

2. **Keep a single `data/events.js` for now**, but:
   - Stop passing `gameState` implicitly. Events should receive **state as an argument** (e.g. `condition(state)`, `getChoices(state)`), so event selection and effects are testable without the DOM.
   - Optionally split events by act or theme into multiple files (e.g. `data/events/crisis.js`, `data/events/milestones.js`) and concatenate or import in `main.js`.

3. **Introduce a minimal “layer” mental model:**
   - **Data**: `data/events.js`, `data/locales/*.json`, photo list (could move to JSON).
   - **Core**: state shape, event selection, effect application, month advance, game-over checks (no DOM).
   - **UI**: everything that does `document.getElementById`, `classList`, `innerHTML`, and event handlers that call into core.

---

## 2. State Management

### What’s wrong

- **One huge mutable object** `gameState` with 80+ properties (financial, flags, story, team, dog, building, burnout, etc.). Any code can read/write anything.
- **Other globals**: `currentEvent`, `usedEvents`, `eventCooldowns`, `unlockedPhotos`, `photoImages`, `currentChartView`, `introComplete`, `introAnimationId`, `difficultyModifiers`, `photoAlbumData`, `persistentTrophies`, etc. The real “state” is spread across many globals.
- **State and DOM are tied**: e.g. `showBurnoutPopup()` builds HTML and assigns to `eventCard.innerHTML`, and `displayEvent()` does the same. If you want to “replay” or “undo,” there’s no single source of truth to re-render from.
- **No serialization story**: Because events hold functions and state is mutated everywhere, saving/loading a game (or time-travel debug) would require significant refactoring.

### What’s good

- **State is centralized in one main object** for the bulk of the game; most logic reads/writes `gameState` rather than random variables.
- **LocalStorage** is used for language, unlocked photos, and persistent trophies — so the idea of “persistent” vs “session” state exists.

### Rework guide

1. **Define an explicit state shape** (e.g. in `js/state.js` or `js/game-state.js`):
   - One plain object (or a small set: `gameState`, `sessionState`) with all fields documented (JSDoc or a comment block).
   - A single `createInitialState(difficulty)` that returns the initial state so you never duplicate the 50+ field list (e.g. in `restartGame()`).

2. **Reduce global variables**:
   - `currentEvent`, `usedEvents`, `eventCooldowns` could live on `gameState` or a dedicated `sessionState` (e.g. `sessionState.currentEvent`, `sessionState.usedEventIds`, `sessionState.cooldowns`).
   - Keep `difficultyModifiers` as a constant map; keep `photoAlbumData` as static data (or move to JSON).

3. **Single place for “apply choice and advance”:**
   - One function that: takes `(state, eventId, choiceIndex)` → applies effects → updates flags → advances month → runs monthly logic (stress, energy, cheese growth, etc.) → returns new state or mutates one state object. The UI then only calls this and then refreshes the view from state.

4. **Optional but powerful:** Make the core **pure** (no DOM, no globals): `nextState = advanceGame(state, eventId, choiceIndex)`. Then the UI is a thin layer: “on choice click → newState = advanceGame(state, …) → state = newState → render(state).” That gives testability and a path to save/load.

---

## 3. Events: Data vs Logic

### What’s wrong

- **Events are not pure data**: They contain `condition: () => gameState....`, `description: () => { gameState.floodActive = true; return '...'; }`, `getChoices()`, `conditionalEffects: () => ({ ... })`. So:
  - You can’t serialize events for save/load or tooling.
  - You can’t unit-test “event X when state Y should show choices Z” without loading the whole app and mocking `gameState`.
  - Side effects inside `description` (e.g. setting `gameState.floodActive`) are hard to see and reason about.

- **Tight coupling to `gameState`**: 77+ conditions and many outcomes reference `gameState` directly. Changing the state shape forces edits across many events.

- **Duplicate / overlapping logic**: e.g. building deadline choices are built in `selectNextEvent()` with long inline strings and logic, and again in locale. Hard to keep in sync.

### What’s good

- **Event structure is clear**: `id`, `title`, `description`, `type`, `monthRange`, `choices`, `effects`, `flags`, `conditionalEffects` — the schema is understandable.
- **Locale fallback**: `getEventTitle`, `getEventDescription`, `getChoiceText`, etc. use locale first, then event copy — good for i18n.
- **Priority and mandatory events** are implemented (e.g. cash crisis → mandatory → priority → pool).

### Rework guide

1. **Pass state into every function that needs it:**
   - `condition(state)` instead of `condition: () => gameState.xyz`.
   - `getChoices(state)` instead of `getChoices()`.
   - `description` as function: `(state) => string` and **no side effects**; if you need to set `floodActive`, do it in the **effect application** step when the event is chosen or when the choice is applied, not inside the description getter.

2. **Keep events as data where possible:**
   - Static choices and effects stay as objects.
   - Only “dynamic” events (e.g. cash crisis text with amount, building deadline can/can’t afford) use functions that take `state` and return strings or choice arrays. Those can live in a small `eventHandlers.js` keyed by `event.id` if you prefer not to put functions inside the big events array.

3. **Centralize effect application:**
   - One `applyChoiceEffects(state, event, choice)` (or `applyEffects(state, effects, flags, conditionalEffects)`) that:
     - Applies numeric effects and flags to `state`.
     - Calls `conditionalEffects(state)` if present and applies the result.
   - So event objects describe “what,” and one place in code does “how.”

4. **Mandatory / special events (e.g. building_deadline, cash_crisis):**
   - Prefer one “builder” per special event: e.g. `getBuildingDeadlineEvent(state)` returns the event payload (title, description, choices) from state + locale. Then `selectNextEvent(state)` calls that builder instead of mutating a shared event object and patching `description`/`choices` in place.

---

## 4. UI and DOM Coupling

### What’s wrong

- **Direct DOM access everywhere**: Hundreds of `document.getElementById(...)`, `querySelector`, `innerHTML`, `classList.add/remove` inside game logic (e.g. `updateUI()`, `displayEvent()`, `showBurnoutPopup()`, `endGame()`). The “view” is not isolated.
- **Inline handlers**: `onclick="makeChoice(0)"` and similar. Hard to test and to swap UI (e.g. for accessibility or another front-end).
- **Long HTML strings in JS**: e.g. `eventCard.innerHTML = '...'` with huge template literals. No single “template” layer; copy and structure are mixed with logic.
- **Duplicate state in DOM**: e.g. bank, stress, energy are both in `gameState` and in DOM. Correctness depends on always calling `updateUI()` after every change.

### What’s good

- **Consistent IDs**: Key elements have stable IDs (`game-screen`, `event-card`, `choices-container`, etc.), so refactoring to a single “render” function is feasible.
- **CSS variables** (`:root` with `--primary`, `--bp-mobile`, etc.) — good for theming and layout.
- **Locale-driven UI**: Many labels come from `getUI()`, so the UI is already partly data-driven.

### Rework guide

1. **Single “render” or “refresh” entry point** for the game screen:
   - One function `renderGameScreen(state)` (or `updateGameUI(state)`) that:
     - Updates header (month, shop name, phase).
     - Updates stats bar (bank, stress, energy, family, etc.).
     - Updates warnings, chart, bank tab, team tab, etc.
   - All game logic that changes state should call this (or a smaller `updateStatsBar(state)` etc.) instead of manually touching 20 different elements.

2. **Event card as a single component:**
   - One function `renderEventCard(event, state)` (or `displayEvent(event, state)`) that:
     - Resolves title, description, choices from locale/event and state.
     - Builds the card HTML or DOM once.
   - No innerHTML overwrites from other places (e.g. burnout popup shouldn’t manually replace the same card structure; it should call the same renderer with a “burnout” pseudo-event or a dedicated view).

3. **Prefer event delegation** over many inline `onclick`:
   - One listener on the choices container: “if target is a choice button, get choice index from data attribute and call `makeChoice(index)`.” Same for other buttons. Easier to test and to add keyboard/accessibility.

4. **Optional:** Use a tiny “view” layer (e.g. small helpers that create elements and set text/attributes) so you don’t rely on one giant string. Can be vanilla JS; no need for a framework if you don’t want one.

---

## 5. Finance and Balance Logic

### What’s wrong

- **`calculateMonthlyFinancials()` is huge** (~200 lines) and does everything: base sales, cheese bonus, reputation, autonomy, energy penalty, product mix, seasonality, margin, fixed costs, salary, staff, loan interest, taxes, bank update, supplier grace, employee months, Sunday stress. Hard to tune or test a single part.
- **Logic duplicated in `updateBankStatement()`**: Rent, building loan, owner salary, staff, insurance, etc. are recomputed from `gameState` with slightly different formulas or labels. Risk of drift (e.g. one place says 1700 rent, another 1900).
- **Magic numbers everywhere**: 19000 base sales, 0.06 loan rate, 0.20 tax, 80000 building cost, 25 deadline month, stress thresholds 60/80, etc. No single “balance constants” file.

### What’s good

- **Comments in `calculateMonthlyFinancials()`** explain the design (e.g. cheese bonus tiers, autonomy multiplier). That’s a good basis for extracting named constants and small functions.
- **Difficulty modifiers** (`difficultyModifiers[difficulty]`) centralize some tuning (salesMod, costMod).

### Rework guide

1. **Extract balance constants** (e.g. `js/balance.js` or `data/balance.json`):
   - Base sales, building cost, deadline month, tax rate, loan interest rate, stress crash threshold, burnout count max, supplier grace count, etc.
   - Refer to `BALANCE_REFERENCE.md` and keep one source of truth.

2. **Split finance into small functions:**
   - `getBaseSales(state)`, `getReputationMultiplier(state)`, `getAutonomyMultiplier(state)`, `getFixedCosts(state)`, `getMarginPercent(state)`, etc.
   - `calculateMonthlyFinancials()` becomes a short orchestrator that calls these and then updates `state.monthlySales`, `state.monthlyExpenses`, `state.bank`, etc. Each helper is unit-testable.

3. **Single source for “breakdown” used by both game logic and bank statement:**
   - e.g. `getMonthlyBreakdown(state)` returns `{ revenue, cogs, rent, staff, loanInterest, ... }`. Game logic uses it to compute profit and update bank; `updateBankStatement()` uses the same object to fill the statement. No second set of formulas.

---

## 6. Debug and Production Hygiene

### What’s wrong

- **Agent/debug `fetch` to `http://127.0.0.1:7242/...`** in at least:
  - `startGame()`
  - `selectNextEvent()`
  - `makeChoice()`
  - `closeOutcome()`
  - `advanceMonth()`
  These run on every game action; in production they’re useless and can cause console errors or delays. They’re wrapped in `.catch(()=>{})` but still should not ship.

### Rework guide

1. **Remove or guard all 127.0.0.1 fetch calls:**
   - Either delete them, or wrap in something like `if (window.__CHEZ_JULIEN_DEBUG__) { ... }` and never set that in production.
2. **Search for** `127.0.0.1`, `7242`, `#region agent` (or similar) and clean in one pass.

---

## 7. Testing and Maintainability

### What’s wrong

- **No automated tests** for core rules (only `tests/balance_test_suite.py` and `balance-test.js` exist for balance). Event selection, effect application, month advance, and game-over conditions are not covered by tests.
- **Hard to test**: Because the core depends on `document`, `window.currentLocale`, and global `gameState`, you can’t easily run “given state X, applying choice Y should give state Z” in Node or a test runner.

### What’s good

- You have **balance test files** and **design docs** (`GAME_DESIGN.md`, `BALANCE_REFERENCE.md`, `EVENT_MAP.md`), which is a good basis for “expected behavior” tests.

### Rework guide

1. **After** extracting a pure core (state in, state out):
   - Add unit tests for: `applyEffects(state, effects, flags)`, `advanceMonth(state)` (stress, energy, bank, game over), and for 2–3 key events (e.g. Sunday decision, building purchase).
2. **Event selection**: Test `getEligibleEvents(state)` or `selectNextEvent(state)` (if you make it return the chosen event without touching DOM) with a fixed `state` and mock event list; assert which event is chosen (e.g. mandatory first, then priority, then pool).
3. Keep balance tests and, if possible, drive them from the same constants used in the game so balance changes are validated by tests.

---

## 8. Suggested Order of Work (No Full Rewrite)

Do these in order so each step reduces risk and gives a clearer codebase for the next.

1. **Remove debug fetches** and any other debug-only code (quick win).
2. **Extract balance constants** and use them in `calculateMonthlyFinancials()` and `updateBankStatement()`; unify the bank breakdown (single source of truth).
3. **Split HTML/CSS/JS**: Move CSS to `css/main.css`, move the big script to `js/main.js` (or several files that run in order). Keep behavior identical.
4. **Introduce explicit state shape** and `createInitialState()`. Replace the big `Object.assign(gameState, { ... })` in `restartGame()` with `Object.assign(gameState, createInitialState(gameState.difficulty))`.
5. **Refactor event system** so that:
   - All condition/description/getChoices/conditionalEffects receive `state` as first argument.
   - No side effects inside description getters; move them to effect application.
6. **Single “apply choice and advance” function** that the UI calls; internally it applies effects, then advances month, then runs game-over and next-event selection. UI only updates from state after that.
7. **Single render pass** for the game screen (and optionally for event card) so all UI updates go through one place.
8. **Add a few unit tests** for the pure parts (effects, advance month, event selection) once the core is decoupled from DOM.

---

## 9. What to Avoid in Further Development

- **Adding more globals** — put new runtime state on `gameState` or a dedicated session object.
- **Adding more inline event logic** in `selectNextEvent()` (e.g. building_deadline) — use “event builder” functions that return an event payload from state.
- **New “balance” numbers in the middle of functions** — add them to the balance constants file and reference by name.
- **New DOM updates scattered in random functions** — add the data to state and update the single “render” path instead.
- **Event objects that mutate `gameState` inside `condition` or `description`** — keep events pure (read-only state in, return value out).

---

## 10. Summary Table

| Topic | Current | Target |
|-------|--------|--------|
| **Files** | 1 HTML (7.7k lines) + 1 events (3.2k) | HTML + CSS + several JS modules; events as data + small handlers |
| **State** | One big object + many globals | One state object + one session object; createInitialState() |
| **Events** | Functions closing over gameState | condition(state), getChoices(state); no side effects in getters |
| **UI** | getElementById / innerHTML everywhere | Single render path; event delegation for buttons |
| **Finance** | One huge function + duplicate breakdown | Constants file + small pure helpers + one breakdown for game + UI |
| **Debug** | fetch to localhost in 5+ places | Removed or behind a debug flag |
| **Tests** | Only balance-related | Unit tests for effects, advance month, event selection |

This should give you a clear map of what’s wrong, what to keep, and how to rework the project step by step without a full rewrite. If you tell me which part you want to tackle first (e.g. “extract CSS and JS” or “refactor events to take state”), I can outline the exact code changes in those files.
