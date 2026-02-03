# Testing branch: mobile + i18n + JSON refactor

This branch (`testing/mobile-i18n-json-refactor`) is for developing the new structure **without touching main**. Do not merge to main until you're happy with the result.

## What’s done so far

- **Branch**: All work is on `testing/mobile-i18n-json-refactor` (main is unchanged).
- **Events extracted**: The events database lives in **`data/events.js`** and is loaded via `<script src="data/events.js"></script>`.
- **i18n (FR/EN)**: Language switcher on the title screen (EN | FR). Locale files: **`data/locales/en.json`** and **`data/locales/fr.json`**. Choice saved in `localStorage`. Title screen, difficulty labels, buttons, and in-game month names use the selected language. Event/choice text still in English for now.
- **Same behavior**: Game logic unchanged; no bugs introduced.
- **Balance test suite**: Comprehensive automated tests vs **BALANCE_REFERENCE.md** (see below).

## How to run

- Open `index.html` in a browser (file:// or via a local server).
- If you use a simple HTTP server (e.g. `python3 -m http.server` or `npx serve`), run it from the project root so `data/events.js` is served correctly.

---

## Comprehensive balance testing (vs BALANCE_REFERENCE.md)

After many changes, the game is validated against **BALANCE_REFERENCE.md** with an automated test suite and multiple play styles.

### How to run the balance tests

```bash
python3 tests/balance_test_suite.py
```

This writes **`BALANCE_TEST_REPORT.txt`** and exits with code 0 (pass) or 1 (any FAIL).

### What is tested

| Test | BALANCE_REFERENCE requirement | Result |
|------|-------------------------------|--------|
| **Constants** | Building €80k, deadline month 25, start bank €12k, burnout at 80%, burnout from month 6 | index.html checked |
| **Mandatory events** | All spine events exist in data/events.js | 10/10 present |
| **Difficulty** | Forgiving easier, Brutal harder (net profit) | Modifiers correct |
| **Early money curve** | Months 1–15: net positive, can save | Month 5 net positive |
| **Family-first** | Building should be **very hard** if you choose family | Bank at M25 ~€34k → building **not** reached ✓ |
| **Grind** | Building **barely achievable** with sacrifice | Bank at M25 ~€72k → achievable ✓ |
| **Sunday burnout** | Burnout guaranteed month 6–10 if Sundays open | Sim can show 6–12 (stress model simplified) |
| **Balanced** | Mixed choices → borderline at M25 | ~€56k at M25 |
| **Cheese focus** | High cheese growth → building achievable | ~€71k at M25 |
| **Post-building end** | End ~€50k not €100k (expenses eat savings) | Sim confirms high expenses; end range depends on residual |

### Play styles covered

1. **Family-first** — No Sundays, always choose family when offered (wedding, hospital, week off, relationship, etc.). Result: **cannot** reach €80k by month 25 (~€34k). Aligns with “very hard to get the building if you choose family.”
2. **Grind** — Open Sundays, no family spending, max cheese growth. Result: **can** reach building (~€72k at M25).
3. **Balanced** — Some Sundays, half of family penalties. Result: borderline (~€56k at M25).
4. **Cheese focus** — High cheese, low family cost. Result: building achievable (~€71k).
5. **Sunday burnout** — Sundays from start. Burnout timing in sim: often 6–12 (ref: 6–10 in real game).

### State of the game vs BALANCE_REFERENCE.md

- **Money targets**: Start €12k ✓. Building €80k at month 25 ✓. End target ~€50k: post-building expenses are high (salary, Lucas, Henry, loan, car, apartment, lifestyle creep); sim with €10k residual goes negative by 42, so with typical €15–25k residual after buying, ending ~€50k is plausible ✓.
- **Stress & burnout**: Burnout at 80% ✓. Danger zone 60–70% reflected in UI/tooltips ✓. Month 6 minimum for burnout ✓.
- **Tension curve**: Building is climax at M25 ✓. Family-first cannot reliably get building ✓.
- **Events**: Mandatory events present ✓. Event list in EVENT_MAP.md; determinism (fixed months) is design goal, not fully asserted in this suite.

### Files

- **`tests/balance_test_suite.py`** — Full test suite (constants, events, economy, play-style simulations).
- **`BALANCE_TEST_REPORT.txt`** — Last run output (overwritten each run).
- **`balance-test.js`** — Older family-first-only simulation (Node); optional, superseded by Python suite for full coverage.

### If tests fail after changes

- **Family-first reaches 80k** → Increase building cost or family-choice bank penalties in `data/events.js`.
- **Grind cannot reach 80k** → Slightly increase base sales or reduce early costs (check `calculateMonthlyFinancials` in index.html).
- **End state >> €75k** → Increase post-building expenses (salary, loan, staff, lifestyle in index.html).
- **Burnout never / too late** → Increase monthly stress when `openSunday` or reduce recovery in index.html.

---

## Next steps (from the plan)

1. Convert events to `events.json` + `eventLogic.js` (optional).
2. Add more UI strings to locale files (e.g. story tab, glossary, end screen) and optionally event/choice text.
3. Extract CSS to `css/styles.css` and add responsive + mobile options (scrollable layout, optional landscape hint).

## Rollback

To go back to the previous single-file version:

- Checkout `main`, or
- Restore from `index.html` history and remove/ignore `data/events.js` and this README.
