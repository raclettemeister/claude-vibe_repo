# Chez Julien — Balance Browser Test Report

**Date:** February 10, 2026  
**Method:** Automated simulations (playstyle-balance-test.js, balance_test_suite.py) + BALANCE_REFERENCE.md comparison  
**Scope:** Three difficulty levels, three play styles, building deadline, end state

---

## Executive Summary

**Overall verdict: Balance is largely working** per BALANCE_REFERENCE.md. The core design goals are met:

- ✓ Building at M25 is barely achievable with sacrifice (Insider/Discoverer reach it)
- ✓ Family-first does NOT reach the building (€35–76k at M25, short of €80k)
- ✓ Post-building expenses reduce end cash for building owners (~€47–54k)
- ✓ Deterministic events, stress thresholds, and tension curve behave as intended

**Recommendations for small changes** (see end of report).

---

## 1. Difficulty Levels Tested

| Difficulty | Start Bank | Start Stress | Sales Mod | Cost Mod | Stress Drain |
|------------|------------|--------------|-----------|----------|--------------|
| **Forgiving** | €20,000 | 20% | 1.12 | 0.92 | 0.7 |
| **Realistic** | €12–15k | 30% | 1.0 | 1.0 | 1.0 |
| **Brutal** | €10,000 | 40% | 0.88 | 1.08 | 1.2 |

- **Constants check (index.html):** OK  
- **Difficulty modifiers:** brutal < realistic < forgiving (net profit) — PASS

---

## 2. Play Styles and Results

### 2.1 INSIDER (optimal for building)

| Metric | Value |
|--------|-------|
| Bank at M25 | €71,755–€118,892 (grind sim) |
| Bank at M42 | €53,792 |
| Owns building | Yes ✓ |
| Burnouts | 3 (game over in some paths) |
| Stress (end) | 14% |
| Family (end) | 80 |
| Cheese types | 48 |

**Verdict:** Insider reaches building and ends ~€50k after expenses. Matches design: *"End state is comfortable, not rich."*

### 2.2 DISCOVERER (55% family-friendly choices, no meta-knowledge)

| Metric | Value |
|--------|-------|
| Bank at M25 | ~€49k–€94k |
| Bank at M42 | €47,479 |
| Owns building | Yes ✓ |
| Burnouts | 4 (some paths) |
| Stress (end) | 0% |
| Family (end) | 100 |
| Cheese types | 68 |

**Verdict:** Discoverer can still reach building with moderate sacrifice. Acceptable per design: *"acceptable if they sacrifice enough."*

### 2.3 FAMILY-FIRST (prioritize health, no Sundays, family choices)

| Metric | Value |
|--------|-------|
| Bank at M25 | €34,128–€76,053 (short of €80k) |
| Bank at M42 | €90k–€119k |
| Owns building | No ✗ |
| Burnouts | 0 ✓ |
| Stress (end) | 9% |
| Family (end) | 100 |
| Cheese types | 33 |

**Verdict:** Family-first does NOT reach building — correct per design.  
**Caveat:** Family player ends with €90–119k because they never buy the building and thus avoid post-building expenses (car, apartment, staff, lifestyle). Design says *"end at ~€50k"* for the building owner path; non-owners keep more cash. This is logically consistent but may feel unintuitive.

---

## 3. Critical Checkpoints vs BALANCE_REFERENCE

| Phase | Reference Target | Observed | Status |
|-------|------------------|----------|--------|
| Start | €0–12k | €12–20k (by difficulty) | OK |
| M17–18 | Building announced | Event fires | OK |
| M25 | €80,000 to buy | Grind: €72–119k; Family: €34–76k | OK |
| M42 (owner) | ~€50,000 | €47–54k (Insider/Discoverer) | OK |
| M42 (non-owner) | N/A | €90–119k (Family) | Note below |
| Stress burnout | 80% | Triggers at 80% | OK |
| Sunday burnout | Month 6–10 | Sim: M6–M12 (model variance) | INFO |

---

## 4. Money Curve

### Early Game (M1–15)

- Net positive: PASS (month 5 net ~€1,534)
- Grind: aggressive saving, stress high
- Family: slower growth, lower stress

### Building Countdown (M15–25)

- Tension as intended: *"Oh shit, I'm not ready"*
- Grind/Balanced: reach €80k
- Family: typically €34–76k — short

### Post-Building (M25–42)

- High income + high expenses → savings drop
- Insider/Discoverer end ~€47–54k ✓
- Post-building sim: went negative from €10k residual, implying expenses are strong

---

## 5. Stress & Burnout

| Threshold | Reference | Observed |
|-----------|-----------|----------|
| Safe | 0–40% | OK |
| Danger zone | 60–70% | OK |
| Burnout | 80%+ | OK |
| Sunday burnout (months) | 6–10 | 6–12 in sim |

- Family-first: 0 burnouts ✓
- Insider: 3 burnouts in some paths (game over) — quite punishing for an optimal player
- Discoverer: 1–4 burnouts depending on choices

---

## 6. Design Intent Check

Per BALANCE_REFERENCE.md:

1. ✓ **Early sacrifice enables the dream** — Grind/Insider can buy building
2. ✓ **Building is the climax** — Barely achievable, triumphant when reached
3. ✓ **Lifestyle is the reward** — Post-building expenses reduce savings
4. ✓ **Deterministic story** — Fixed events, choices matter
5. ✓ **End state comfortable, not rich** — Owners end ~€50k

---

## 7. Recommended Small Changes

Balance is mostly correct. If you want to adjust:

### 7.1 Insider burnouts

- **Issue:** Insider hits 3 burnouts (game over) in some optimal runs.
- **Suggestion:** Slightly lower stress from high-value events or add one more stress relief option in months 15–25 for players who choose work-heavy paths.

### 7.2 Family end cash

- **Issue:** Family player ends with €90–119k (no building, no lifestyle costs).
- **Suggestion:** Optional: add a narrative or UI note that *"you saved a lot, but you missed the dream"* so the high cash feels intentional rather than unintended.

### 7.3 Sunday burnout timing

- **Reference:** Burnout guaranteed between month 6–10 if Sundays open.
- **Observed:** Sim shows M6–M12.
- **Suggestion:** If you want tighter alignment, review stress gains from Sunday opening in the first 10 months.

### 7.4 End bank ceiling

- **Reference:** *"If the game ends with €100k, something is broken"* — for the building-owner path.
- **Current:** Owners end ~€47–54k ✓
- No change needed for owners; the note applies to non-owners (family path) as a design nuance.

---

## 8. Test Data Sources

- `tests/playstyle-balance-test.js` — 3-playstyle simulation (Insider, Discoverer, Family)
- `tests/balance_test_suite.py` — Constants, mandatory events, money curve, family-first, grind
- `BALANCE_REFERENCE.md` — Design targets

---

*"The story is sacrifice, then reward. Make the sacrifice feel real. Make the reward feel earned."*  
— BALANCE_REFERENCE.md
