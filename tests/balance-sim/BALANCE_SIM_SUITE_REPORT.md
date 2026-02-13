# Balance simulation — full test suite report

**Generated:** 2026-02-13T17:22:06Z
**Event chain:** Fixed (`data/timeline.json`)
**Playstyles:** aggressive, family, reasonable, money_first, health_first, neutral

---

## 1. Results by playstyle

| Playstyle   | Building (M25) | Bank @ M25 | Burnouts | Game over | Final bank | Final stress | Months |
|------------|----------------|------------|----------|-----------|------------|--------------|--------|
| aggressive | NO             | €61,486    | 3        | burnout   | €64,486     | 30           | 25     |
| family     | NO             | €39,103    | 0        | —         | €70,298     | 3            | 43     |
| reasonable | NO             | €54,779    | 2        | —         | €115,536    | 0            | 43     |
| money_first | NO             | €68,572    | 2        | —         | €137,881    | 87           | 43     |
| health_first | NO             | €63,665    | 2        | —         | €130,932    | 0            | 43     |
| neutral    | NO             | €62,810    | 2        | —         | €129,180    | 0            | 43     |

---

## 2. Cross-check with BALANCE_REFERENCE.md

| Reference requirement | Expected (BALANCE_REFERENCE) | Sim result | Status |
|------------------------|-------------------------------|------------|--------|
| Month 25 building cost | €80,000 — barely achievable | None reached €80k in this run (max money_first €68,572) | ⚠️ Tune or accept |
| Family-first at M25 | ~€35k (building very hard) | family: €39,103 | ✅ Aligns |
| Burnout thresholds | 82% / 87% / 92% (82 + 5×n) | Sim uses 82 + 5×burnoutCount | ✅ Match |
| 3 burnouts = game over | Yes | aggressive: game over at 3 burnouts | ✅ |
| Runs that reach building | 0–2 burnouts target | No playstyle reached building | — |
| End state (post-building) | ~€50k | Sim runs to M43; full post-building expenses not modeled here | — |

### Verdict

- **Family-first:** Building correctly hard when prioritising family (bank at M25 in €35k–40k range).
- **Burnout:** Aggressive playstyle hits 3 burnouts and game over; others 0–2. Matches reference.
- **Building achievable:** In this sim no playstyle reaches €80k by M25; if design goal is "barely achievable", consider raising early revenue or lowering costs in the event registry.

---

## 3. How to run

```bash
npm run sim:balance
# or
node tests/balance-sim/run-balance-sim.js
```
