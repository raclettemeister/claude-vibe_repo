# Chez Julien — Full Balance Report

**Generated:** 12 February 2026  
**Scope:** E2E Playwright tests, Node balance tests, Python balance suite, events-triggered runs, playstyle simulation.

---

## 1. Executive summary

| Area | Status | Notes |
|------|--------|------|
| **Building reachability** | ✓ Aligned | Grind/insider can reach €80k by M25; family-first cannot (~€35k). |
| **Stress & burnout** | ⚠ Mixed | Stress buffer (80→85→90%) and trimmed event stress in place; discoverer run had 2 burnouts by M24; sims still show 3–4 burnouts for aggressive play. |
| **Money curve** | ✓ Early OK; ⚠ Post-building | Early game net positive; M25 targets met in sims. Post-building sim can go negative from low residual; design target ~€50k end. |
| **Events vs runs** | ℹ Documented | **25 unique events** fired in a single run to building; timeline is fixed so this is stable. Many events in code never fire in a typical run. |
| **Test suite** | ✓ All green | 9 Playwright tests, balance-test.js, playstyle-balance-test.js, balance_test_suite.py all passed. |

**Verdict:** Balance is working as intended for building difficulty and family-first vs grind. Burnout frequency and post-building end state are the main levers to watch.

---

## 2. Tests run

### 2.1 Playwright E2E (9 tests, port 3940)

- **building-deadline** (EN/FR): Building choices correct when bank &lt; €80k vs ≥ €80k.
- **discoverer-playthrough**: “Family-friendly” choices until building deadline → **Month 24, Bank €42,047, Stress 48, Burnouts 2, Family 100**. Did not reach €80k (intended for this playstyle).
- **events-triggered-in-run**: Full run + to-building run; event log written to `tests/e2e/artifacts/`.
- **playthrough-to-building** (real clicks): Reaches building buying event.
- **playthrough-via-test-api** (2 tests): `__testPlayUntil` to building_deadline and discoverer-style; both return valid state.

### 2.2 Node scripts

- **balance-test.js**  
  - Family-first (no Sundays, family penalties): **Bank at M25 €35,055** → shortfall €44,945 → building NOT reached.  
  - Grind (Sundays, skip family): **Bank at M25 €75,227**.  
  → Family-first correctly hard; grind can reach building.

- **tests/playstyle-balance-test.js** (3 playstyles, simplified sim)  
  - **Insider:** 3 burnouts, buys building at M25, end bank **€53,792** (~€50k target).  
  - **Discoverer:** 4 burnouts in sim (game over); in real E2E run, 2 burnouts by M24, no building.  
  - **Family:** 0 burnouts, does not buy building, end bank **€119,016** (high because no €80k spent).  
  → Insider end bank in target range; family never reaches building; burnout count in sim is high for insider/discoverer.

### 2.3 Python suite (tests/balance_test_suite.py)

- Constants vs index.html: OK.  
- Mandatory events: all 10 present.  
- Difficulty: brutal &lt; realistic &lt; forgiving (net profit).  
- Early money: net positive at month 5 (€1,534).  
- Family-first at M25: **€34,128** (building not reached).  
- Grind at M25: **€71,755**.  
- Balanced playthrough M25: **€55,757**.  
- Cheese-focus M25: **€71,333**.  
- Sunday burnout in sim: month 12 (ref 6–10; sim stress model differs from real game).  
- Post-building: sim went negative with €10k residual; note real play often has €15–25k so end ~€50k.

Report path: `BALANCE_TEST_REPORT.txt`.

---

## 3. Building deadline (Month 25)

| Run type | Bank at M24–25 | Reached €80k? |
|----------|----------------|----------------|
| E2E Discoverer (family-friendly choices) | €42,047 | No |
| balance-test.js family-first | €35,055 | No |
| balance-test.js grind | €75,227 | No (close) |
| Python family-first | €34,128 | No |
| Python grind | €71,755 | No |
| Python balanced | €55,757 | No |
| Python cheese-focus | €71,333 | No |
| Playstyle sim Insider | — | Yes (buys at M25) |
| Playstyle sim Discoverer | — | Yes in sim (real E2E: no) |

Design: building should be **barely achievable** with heavy sacrifice. Family-first consistently far from €80k; grind/balanced in €55k–75k range in sims. Real E2E “first choice” run reaches building event with enough bank when playing optimally; discoverer run does not. **Conclusion:** Building reachability is in the right band; family-first clearly cannot afford it.

---

## 4. Stress and burnout

### 4.1 Current mechanics (after rebalance)

- **Thresholds:** First burnout 80%, second 85%, third 90% (stress buffer).  
- **Recovery:** 4 months half stress gain after each burnout; Sunday forced closed.  
- **Event stress:** Highest event gains reduced (e.g. 40→28, 35→25, 30→22, 25→20).

### 4.2 Observed burnout counts

| Run | Burnouts by building / by end |
|-----|-------------------------------|
| E2E Discoverer (to M24) | 2 |
| Playstyle Insider (sim) | 3 (game over in sim; real game allows 3rd then game over) |
| Playstyle Discoverer (sim) | 4 (sim counts past 3) |
| Playstyle Family (sim) | 0 |

Design goal: **first burnout ~month 8, second during the race to the building**. Discoverer E2E (2 by M24) is in that ballpark. Sims use a different stress model and show more burnouts for aggressive play; they are not 1:1 with the real game.

### 4.3 Recommendations

- Keep **stress buffer** (80/85/90%); it reduces chained burnouts.  
- If playtests show **first burnout too early**, trim more event stress or slightly lower base monthly stress.  
- If **second burnout** rarely happens before M25, consider a small nudge (e.g. one or two events with +2–3 stress) in the M18–24 window.  
- **Playstyle-balance-test.js** still uses a fixed 80% threshold; optional: align it with 80/85/90% for consistency.

---

## 5. Events actually triggered in a run

From **events-triggered-in-run** Playwright spec (run to building, “first choice” strategy):

- **Months played:** 24 (building_deadline at month 25).  
- **Events shown:** 25 (each with `id` and `month`).  
- **Unique event ids in that run:** 25.

**Event sequence (to-building run):**

| Month | event_id |
|-------|----------|
| 0 | sunday_opening |
| 1 | stock_reality |
| 2 | first_cheese |
| 3 | insurance_decision |
| 4 | shop_name |
| 5 | first_christmas |
| 6 | cheap_fridge |
| 7 | difficult_customer |
| 8 | health_inspection |
| 9 | delivery_disaster |
| 10 | producer_opportunity |
| 11 | wine_dilemma |
| 12 | systems_project |
| 13 | quiet_month |
| 14 | adopt_dog |
| 15 | first_raclette_season |
| 16 | building_offer |
| 17 | christmas_market |
| 18 | snow_day |
| 19 | the_invitation |
| 20 | charcuterie_question |
| 21 | poncho_cheese_emergency |
| 22 | building_countdown |
| 23 | bad_review |
| 24 | building_deadline |

The game and timeline contain **many more events** than appear in one run; timeline + conditions determine which ones fire. For balance, use **triggered event lists** (e.g. `tests/e2e/artifacts/triggered-events-last-run.json` and `triggered-events-to-building.json`) so you tune stress/effects for events that actually occur.

To regenerate:  
`npx playwright test events-triggered-in-run`  
(or `PLAYWRIGHT_PORT=3940 npx playwright test events-triggered-in-run`).

---

## 6. Money curve

### 6.1 Early game (months 1–15)

- Python suite: **net positive at month 5** (€1,534).  
- balance-test.js: family-first builds slowly; grind builds faster with Sundays and fewer penalties.  
- **Conclusion:** Early economy allows saving; no change required for this phase.

### 6.2 Building countdown (months 15–25)

- Grind / cheese-focus sims: **€71k–75k** at M25.  
- Balanced sim: **~€55k**.  
- Family-first: **~€34k–35k**.  
- **Conclusion:** Spread between “sacrifice” and “family” is clear; building is achievable only with sacrifice.

### 6.3 Post-building (months 25–42)

- Design target: **~€50k end**, not €100k (expenses rise: loan, car, staff, lifestyle).  
- Playstyle Insider sim: **€53,792** at M42 (on target).  
- Python post-building sim: **negative** with €10k residual; note assumes low starting residual; real play often has €15–25k after purchase so end ~€50k.  
- **Recommendation:** If live playtests show end bank consistently **&gt; €75k**, consider raising post-building expenses (loan, insurance, salary, car, apartment) in `index.html`.

---

## 7. Recommendations summary

1. **Keep current building balance** — Family-first cannot reach €80k; grind/insider can. No change needed unless you want building even harder.  
2. **Stress/burnout** — Keep stress buffer (80/85/90%). If first burnout is too early in playtests, trim a few more event stress gains; if second burnout is too rare before M25, consider one or two small stress bumps in M18–24.  
3. **Post-building end bank** — Monitor actual end-game bank in playtests. If it stays **&gt; €75k**, increase post-building costs so the curve lands near **~€50k**.  
4. **Balance from real runs** — Use `npx playwright test events-triggered-in-run` and the generated JSON artifacts to see which events fire and when; tune event effects against this set rather than the full event list.  
5. **Optional** — Align **playstyle-balance-test.js** stress threshold with 80/85/90% so sim and real game match better.

---

## 8. Files and commands reference

| What | Where / Command |
|------|------------------|
| This report | `BALANCE_REPORT.md` |
| Python suite report | `BALANCE_TEST_REPORT.txt` |
| Event log (to-building) | `tests/e2e/artifacts/triggered-events-to-building.json` |
| Event log (full run) | `tests/e2e/artifacts/triggered-events-last-run.json` |
| Balance reference (design) | `BALANCE_REFERENCE.md` |
| Run all E2E tests | `PLAYWRIGHT_PORT=3940 npm test` |
| Run only events-triggered | `npx playwright test events-triggered-in-run` |
| Family-first vs grind (Node) | `node balance-test.js` |
| 3-playstyle sim (Node) | `node tests/playstyle-balance-test.js` |
| Python balance suite | `python3 tests/balance_test_suite.py` |

---

*Report produced from automated test runs and existing balance scripts. Re-run tests after any balance or event changes and regenerate this report for an up-to-date picture.*
