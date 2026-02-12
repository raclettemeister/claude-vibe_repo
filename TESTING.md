# Testing Chez Julien

## Pre-release / video phase (run smooth the first time)

When the game is done and you’re in **intense testing** (e.g. video implemented, test & fix):

1. **One command** – avoids port conflicts, runs the full E2E suite:
   ```bash
   npm run test:check
   ```
   Uses port **3960** so it doesn’t clash with 3333 or an existing dev server. All 7 Playwright tests run (~2–3 min).

2. **Track in Linear** – Project **Video phase – Release testing** with issues:
   - **CHE-70** E2E full suite – all 7 tests green
   - **CHE-71** Building deadline choices (FR/EN)
   - **CHE-72** Playthrough to building (test API)
   - **CHE-73** Playthrough to building (real clicks)
   - **CHE-74** Discoverer playthrough
   - **CHE-75** Manual smoke test

   Run `npm run test:check`, fix any failure, re-run until green, then close the relevant issues.

3. **If port is in use** – use another: `PLAYWRIGHT_PORT=3940 npm test` (or `npm run test:check` which already uses 3960).

---

## Why automated tests?

- **No hallucinations:** The test runs the real game in a real browser. If it passes, the behavior is verified by execution, not by description.
- **Fast:** You don’t have to play to July 2024 by hand to check the building-deadline fix.
- **Repeatable:** Every run checks the same thing; safe to re-run after changes.

---

## Testing options (reliable and at scale)

| Approach | Tool | What it does | When to use |
|----------|------|--------------|-------------|
| **E2E via test API** | Playwright + `?test=1` | Loads game, starts it, calls `__testPlayUntil(...)` so the game advances itself in-page. No DOM timing or click races. | **Primary:** Reliable, fast, scalable. Run on every change. |
| **E2E building choices** | Playwright + `__testJumpToBuildingDeadline` | Jumps to building deadline with a given bank, returns choice labels. | Assert correct FR/EN options when you can / can’t afford. |
| **E2E real clicks** | Playwright | Clicks buttons, waits for modals/polaroids. | Optional; full UI path when you need it (slower, more flaky). |
| **Node simulation** | `playstyle-balance-test.js`, `balance_test_suite.py` | Runs game logic (balance, finances) without browser. | Balance and design checks; no DOM. |
| **Manual in browser** | Cursor browser MCP or any browser | You (or an agent) play with `?automation=1` to skip intro. | Exploratory / one-off playthroughs. |

The **test API** (`__testPlayUntil`) is what makes “play like a player” reliable at scale: the game drives itself inside the page, and Playwright only loads the page, starts the game, waits for the first event, then calls one function and asserts on the result.

---

## E2E tests (Playwright)

### Setup (once)

```bash
npm install
npx playwright install chromium
```

### Run

```bash
npm test                    # all E2E tests
npm run test:headed         # same, visible browser
npm run test:full           # playthrough via test API only (reliable full-game flow)
npm run test:building       # building-deadline choice assertions only
```

Port: server and tests use **3333** by default. If you get “Address already in use”:

```bash
PLAYWRIGHT_PORT=3940 npm test
```

### Test hooks (URL `?test=1`)

Only available when the page is loaded with `?test=1` (not in production).

- **`window.__testJumpToBuildingDeadline(bank [, extended])`**  
  Sets state to building deadline month, sets `gameState.bank` to `bank`, runs `selectNextEvent()`, and returns the **choice button labels**.  
  Used to assert correct options (Sign vs extend/let go) in FR/EN.

- **`window.__testPlayUntil(targetEventId, strategy, maxMonths)`**  
  Plays from the **current** event until:
  - the event id matches `targetEventId` (or any id in `targetEventId` if it’s an array), or
  - `gameState.monthsPlayed >= maxMonths`, or
  - game over.  

  **Strategy:** `'first'` = always first choice, `'random'` = random choice, `'family'` = prefer family-friendly keywords.  
  Returns `{ reached, eventId, monthsPlayed, state }`.  
  `state.triggeredEventLog` is `[{ id, month }, ...]` — which events actually fired (for balance/reference).  
  Call after `startGame()` and once the first event is visible (e.g. after waiting for `currentEvent` in E2E).

- **Events triggered in a run**  
  `npx playwright test events-triggered-in-run` runs one or two playthroughs and writes **which event ids fired and in which month** to `tests/e2e/artifacts/triggered-events-last-run.json` and `triggered-events-to-building.json`. Use for rebalancing (many events exist but only a subset trigger per run).

Use **`test=1&automation=1`** in E2E when you want to skip intro and start the game programmatically.

### What is tested

- **Building deadline choices (FR):** Via `__testJumpToBuildingDeadline(75000)` / `82000`. Asserts Sign option is hidden when short, shown when enough.
- **Playthrough to building:** Via `__testPlayUntil(['building_deadline','building_deadline_extended'], 'first', 35)`. Asserts the run reaches the building event in a real browser using real game code.
- **Discoverer-style run:** Same API with strategy `'family'`; asserts state and months.

---

## Other tests

- **Balance / design:** `tests/balance_test_suite.py` checks balance assumptions from `BALANCE_REFERENCE.md`; it does **not** run the game’s JavaScript.
- **Playstyle simulation:** `tests/playstyle-balance-test.js` simulates Insider / Discoverer / Family-first over 42 months in Node (no browser).

---

## If you change building-deadline logic or locales

After changing the logic that picks choices when `canAfford` / `!canAfford`, or the French (or English) strings for building_deadline:

```bash
npm test
# or
npm run test:building
```

If the E2E tests pass, the building-deadline behavior in the browser matches what the tests expect.
