# Balance simulator data

**Which events to include:** Prefer **game logs** as source of truth. Share 2–3 runs (triggered-events JSON or JOURNAL paste); balance work then focuses only on the event ids that appear there. See `docs/BALANCE_SIMULATOR_DESIGN.md` § “Balance from your game logs”.

- **`triggered-events-from-logs.json`** — Canonical list of **45 event ids** that triggered in 3 full JOURNAL runs (43 months, realistic). Use `triggeredEventIds` for balance; only these events get registry entries, stress tuning, playstyle labels. Includes `titleToId` (FR title → id) for parsing future logs.
- **`triggered-events-registry.json`** — Events that actually run (from timeline / logs), with per-choice **effects** (stress, bank, family, energy) and **playstyle** (aggressive, family, reasonable, money_first, health_first, neutral). Used by a scripted balance simulator so it doesn’t depend on the main game code.
- **Design:** See `docs/BALANCE_SIMULATOR_DESIGN.md`.

Currently only the first 6 timeline events + `building_deadline` are in the registry. To complete it:

1. For each event id in **`triggered-events-from-logs.json`** (`triggeredEventIds`), copy its `choices` from `data/events.js` (effects only; ignore flags/conditionalEffects for a first pass).
2. Assign each choice a `playstyle` and optional `label`.
3. Keep choice order identical to `events.js` so the simulator can match “strategy = family” → pick choice index with `playstyle: "family"`.

The simulator can then: load timeline + this registry, for each month apply the chosen choice’s effects to a minimal state, apply baseline monthly stress (from `index.html`), and record burnout count / building success per run.
