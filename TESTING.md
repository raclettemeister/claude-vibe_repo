# Testing Chez Julien

## Why automated tests?

- **No hallucinations:** The test runs the real game in a real browser. If it passes, the behavior is verified by execution, not by description.
- **Fast:** You don’t have to play to July 2024 by hand to check the building-deadline fix.
- **Repeatable:** Every run checks the same thing; safe to re-run after changes.

## E2E tests (Playwright)

E2E tests load `index.html` in a headless browser, set language and game state, and assert on the DOM (e.g. which choices are shown at the building deadline).

### Setup (once)

```bash
npm install
npx playwright install chromium   # install browser for Playwright
```

### Run

```bash
npm test
```

Or with a visible browser:

```bash
npm run test:headed
```

### What is tested

- **Building deadline when you can’t afford (FR):** Bank = 75 000 €, French locale. Asserts that the “Sign – I have €80k” option is **not** shown, and that options like “Demander un mois de plus” / “Laisser filer” **are** shown.
- **Building deadline when you can afford (FR):** Bank = 82 000 €. Asserts that the Sign option **is** shown.

### Test hook

When the URL contains `?test=1`, the game exposes:

- `window.__testJumpToBuildingDeadline(bank)`  
  Sets state to July 2024 (building deadline), sets `gameState.bank` to `bank`, shows the game screen, runs `selectNextEvent()`, and returns the **choice button labels** (as shown in the DOM).  
  Used by the E2E test to assert correct options. Not available in production (no `?test=1`).

## Other tests

- **Balance / design:** `tests/balance_test_suite.py` (Python) checks balance assumptions from `BALANCE_REFERENCE.md`; it does **not** run the game’s JavaScript.

## If you change building-deadline logic or locales

After changing:

- The logic that picks choices when `canAfford` / `!canAfford`, or  
- The French (or English) strings for building_deadline,

run:

```bash
npm test
```

If the E2E test passes, the building-deadline behavior in the browser matches what the test expects (no “Sign” when short, Sign when you have enough).
