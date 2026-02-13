# Balance test suite (simulation)

Standalone **balance simulator** that runs the game with a **fixed event chain** (from `data/timeline.json`) and reports **which playstyles achieve the building** and **which avoid 3 burnouts**.

## What it does

- **No browser**: pure Node simulation.
- **Fixed timeline**: events follow `data/timeline.json` (month 1 → event 1, …, month 25 → `building_deadline`, etc.).
- **One run per playstyle**: `aggressive`, `family`, `reasonable`, `money_first`, `health_first`.
- **Mechanics**: stress, energy, family, bank, burnout (threshold 82 + 5×burnoutCount; 3 burnouts = game over), monthly finance (sales, costs, margin), building at €80k.

## Run

```bash
node tests/balance-sim/run-balance-sim.js
```

Outputs:

- `tests/balance-sim/balance-sim-report.json` – full per-playstyle results (bank at month 25, burnouts, game over, etc.).
- `tests/balance-sim/balance-sim-report.md` – summary table: which playstyles get the building and which don’t.
- **`tests/balance-sim/BALANCE_SIM_SUITE_REPORT.md`** – **full suite report**: all playstyles (aggressive, family, reasonable, money_first, health_first, neutral), full metrics table, and **cross-check with BALANCE_REFERENCE.md** (expected vs sim result, status ✅/⚠️).

## Data

- **Timeline**: `data/timeline.json` (which event runs each month).
- **Event effects**: `data/balance-sim/triggered-events-registry.json` (per-event choices with stress/bank/family/energy/flags and playstyle labels). Events not in the registry are no-ops (no stat changes).

## Extending

- Add or tweak events in `triggered-events-registry.json` (match choice order to `data/events.js`).
- Add playstyles in the runner and in the registry’s `_playstyles` list.
- Adjust constants in `run-balance-sim.js`: `BURNOUT_THRESHOLD_BASE`, `BUILDING_COST`, `BUILDING_MONTH`, initial state.

Design details: `docs/BALANCE_SIMULATOR_DESIGN.md`.
