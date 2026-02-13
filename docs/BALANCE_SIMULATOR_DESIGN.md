# Balance Simulator — Design (Triggered Events + Playstyles)

**Goal:** An accurate balance simulator that doesn’t depend on the messy in-game code. The game is **highly scriptable** because only a fixed set of events actually trigger each run, and the math is deterministic once you know the sequence and the choice effects.

---

## Balance from your game logs (source of truth)

**You tell me which events trigger by sharing a few game logs. I then focus all balance work only on those events.**

- **Preferred format — event ids + month:**  
  Share the **triggered-events** JSON from a run. For example from the E2E test: `tests/e2e/artifacts/triggered-events-last-run.json` or `triggered-events-to-building.json`. They contain an `events` array like `[{ "id": "sunday_opening", "month": 0 }, ...]`. That’s all I need to know the exact trigger set.
- **Alternative — in-game JOURNAL:**  
  Paste 2–3 JOURNAL DE PARTIE logs (the in-game copy). I’ll map the event titles to event ids using the locale files and derive the trigger set. Slightly more ambiguity, but fine if you don’t have the JSON.
- **What I do with it:**  
  I take the **union of event ids** from your logs and treat that as the canonical “events that matter for balance”. I only create or update registry entries, stress values, and playstyle labels for those events. Everything else is ignored for balance.

So: you run a few games (or run the test), share the logs; I focus on that list only.

**Current canonical list:** From 3 full JOURNAL runs you shared, the union of event ids is in **`data/balance-sim/triggered-events-from-logs.json`** (`triggeredEventIds`: 45 events). All balance work (registry, stress, playstyles) should target only those 45 events.

---

## 1. What Actually Triggers In-Game

- **Source of truth for “which event when”:** `data/timeline.json`.  
  It maps **month index (1–43)** → **one main event** (and optionally an `alt` if the main is skipped by conditions).
- So **most runs see the same event sequence**. No randomness in which event appears when, except when `condition()` fails and the engine falls back to `alt` or the normal pool.
- The **events that really matter for balance** are exactly the ~43 event ids that appear in that timeline. The rest of the 100+ events in `data/events.js` are either alts or legacy; they don’t run in a typical playthrough.

**Implication:** The “balance surface” is small: one event per month, each with 1–3 choices. That’s easy to script.

---

## 2. What’s Missing for a Simulator

Today:

- **Event definitions** live in `data/events.js` (large, mixed with conditions, flags, locale, etc.).
- **Choice effects** (stress, bank, family, energy) are buried inside those objects.
- There is **no playstyle label** on any choice. So we can’t say “simulate family-oriented run” = “always pick the family choice when available” without hand-mapping every event.

To get an **accurate, scriptable balance simulator** we need:

1. **A clean list of events that actually trigger**  
   = timeline event ids (and optionally which month they run), with no legacy or unused events.

2. **For each of those events, each choice labeled by playstyle**  
   e.g. `family` | `aggressive` | `reasonable` | `money_first` | `health_first` | `neutral`, so the simulator can pick “choice index for playstyle X” without parsing the game UI or events.js.

3. **Per-choice effect summary** (stress, bank, family, energy) in one place  
   so the simulator can advance state month-by-month without loading the full game or DOM.

With that, the simulator is trivial: for each month, look up event id → get choices → pick the one matching the desired playstyle → apply effects → update state → check burnout/bankruptcy. No browser, no `index.html`, no duplication.

---

## 3. Playstyle Labels (Proposal)

| Playstyle    | Meaning (short) |
|-------------|------------------|
| `aggressive` | Maximize money/speed, accept stress/risk (e.g. open Sundays, big investments). |
| `family`    | Prioritize family, rest, say no to extra work (e.g. close Sundays, skip some opportunities). |
| `reasonable`| Middle ground, sustainable (e.g. moderate investments, some rest). |
| `money_first`| Explicitly choose the option that maximizes bank when it’s the main trade-off. |
| `health_first`| Choose the option that reduces stress/improves energy when it’s the main trade-off. |
| `neutral`   | No strong slant; or only one choice. |

Each event choice gets **one** primary playstyle. Some choices may fit two (e.g. “reasonable” and “health_first”); pick the one that best matches the *main* player fantasy (e.g. “close Sundays” → `family`).

---

## 4. Clean Registry Format

A single, machine-readable file that only describes **events that appear in the timeline**, with one record per choice: effects + playstyle.

- **Location (proposal):** `data/balance-sim/triggered-events-registry.json` (or `.js` if we want to reuse gameState for conditional effects later).
- **Content (per event id):**
  - `event`: event id (must match timeline).
  - `choices`: array of `{ stress?, bank?, family?, energy?, playstyle, label? }`.  
  - Order of choices must match `data/events.js` (choice index 0, 1, 2…) so we can cross-check.

Example:

```json
{
  "sunday_opening": {
    "choices": [
      { "stress": 10, "energy": -5, "playstyle": "aggressive", "label": "Open Sundays" },
      { "stress": -5, "family": 5, "energy": 5, "playstyle": "family", "label": "Close Sundays" }
    ]
  },
  "first_christmas": {
    "choices": [
      { "stress": 5, "bank": 1500, "playstyle": "money_first", "label": "Moderate" },
      { "stress": 14, "energy": -15, "bank": 3000, "playstyle": "aggressive", "label": "Go big" },
      { "stress": -5, "reputation": 5, "playstyle": "reasonable", "label": "Simple" }
    ]
  }
}
```

The simulator then:

- Loads `data/timeline.json` (month → event id).
- Loads `data/balance-sim/triggered-events-registry.json` (event id → choices with effects + playstyle).
- For a given playstyle (e.g. `"family"`), each month: get event id from timeline → get choices from registry → pick choice whose `playstyle` equals the run’s strategy (or first matching, or fallback to `reasonable`).
- Apply effects to a minimal state (stress, bank, family, energy, flags if needed for conditions).
- Apply baseline monthly rules (e.g. stress +2, burnout at 82%) from a small, copied formula or config.

No need to touch the main codebase for balance iteration.

---

## 5. Why the Current Code Makes This Hard

- **Events:** One big `events` array in `data/events.js` (2400+ lines) with many events that **never** appear in the timeline. Finding “only the ones that trigger” requires cross-referencing with `timeline.json` and with runtime conditions.
- **Selection logic:** In `index.html`, mixed with UI, locale, and special cases (building_deadline, cash_crisis, etc.). Not reusable as a standalone “next event + apply choice” library.
- **Duplication:** `old versions/`, `notebooklm-events/`, multiple EVENT_MAP / EVENT_SCHEMA docs. Unclear which event set is authoritative.
- **No playstyle metadata:** Choices are “text + effects + flags”; nothing says “this is the family choice” or “this is the aggressive choice,” so any simulator has to hardcode or guess.

**So:** Building the **triggered-event registry + playstyle labels** is a one-time extraction and tagging job. Once that exists, the balance simulator can be a small script (Node or Python) that reads the registry and timeline and runs thousands of runs in seconds. The messy code stays for the real game; the simulator stays clean and accurate.

---

## 6. Next Steps

1. **Populate the registry** for all event ids that appear in `data/timeline.json`, with effects and playstyle per choice (see `data/balance-sim/triggered-events-registry.json`).
2. **Implement a minimal simulator** (e.g. Node script) that: loads timeline + registry, runs N months, applies monthly baseline stress/bank rules, records burnout count and building success per run. Optionally support multiple strategies (e.g. “family” vs “aggressive”) and output distributions.
3. **Tune balance** using the simulator (and/or the existing E2E balance test) by changing numbers in the registry or in a small “baseline rules” config, without editing the main game until the target curves look right.
