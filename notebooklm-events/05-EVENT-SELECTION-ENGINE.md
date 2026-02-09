# Chez Julien — Event Selection Engine (How Events Are Picked)

> Extracted from `index.html` — the actual code that decides which event plays each month.

---

## Overview

Each game month, the function `selectNextEvent()` runs after `advanceMonth()`. It picks ONE event to show the player. Events are selected through a priority cascade:

1. **Cash Crisis** (special flag) — if bank hit 0 and supplier grace ran out
2. **Mandatory Events** — events with `mandatory: true` that MUST fire in their window
3. **High-Priority Events** — events with a `priority` value, sorted highest first
4. **Normal Events** — everything else, picked randomly from eligible pool

---

## Selection Logic (Step by Step)

### Step 1: Cash Crisis Check
```
if (gameState.cashCrisisTriggered) → show cash_crisis event immediately
```

### Step 2: Mandatory Events
```
Find first event where:
  - e.mandatory === true
  - NOT already used (if unique)
  - currentMonthIndex is within e.monthRange[0]..e.monthRange[1]
  - e.condition() returns true (if condition exists)
→ Show first match
```

### Step 3: Priority Events
```
Find ALL events where:
  - e.priority exists (is a number)
  - NOT special, NOT mandatory
  - NOT already used (if unique)
  - NOT on cooldown (for recurring events)
  - currentMonthIndex within monthRange
  - condition passes
→ Sort by priority descending
→ Show highest priority
```

### Step 4: Normal Events (Random Pool)
```
Find ALL events where:
  - NOT special, NOT mandatory, NOT priority
  - Within monthRange
  - NOT used (if unique) / NOT on cooldown (if recurring)
  - condition passes
→ Pick one randomly
```

---

## Key Properties That Control Event Eligibility

| Property | Type | Effect |
|----------|------|--------|
| `monthRange: [start, end]` | Array[2] | Event can only fire between these month indices (1-42) |
| `mandatory: true` | Boolean | Event MUST fire when eligible (Priority 2) |
| `priority: N` | Number | Higher = fires sooner. Used for Priority 3 selection |
| `unique: true` | Boolean | Can only fire once per playthrough |
| `recurring: true` | Boolean | Can fire multiple times |
| `cooldown: N` | Number | Months between recurring triggers |
| `condition: () => bool` | Function | Dynamic check against `gameState` |
| `special: 'cash_crisis'` | String | Bypasses normal selection (Priority 1) |
| `dynamicChoices: true` | Boolean | Choices are generated at display time via `getChoices()` |

---

## Month Index Mapping

The game runs 42 months (July 2022 to December 2025):

| Month Index | Calendar Month | Notes |
|-------------|---------------|-------|
| 1 | July 2022 | Game start |
| 2 | August 2022 | |
| 3 | September 2022 | |
| 4 | October 2022 | |
| 5 | November 2022 | |
| 6 | December 2022 | First Christmas |
| 7 | January 2023 | |
| 8 | February 2023 | |
| 9 | March 2023 | |
| 10 | April 2023 | |
| 11 | May 2023 | |
| 12 | June 2023 | |
| 13 | July 2023 | |
| 14 | August 2023 | |
| 15 | September 2023 | |
| 16 | October 2023 | |
| 17 | November 2023 | |
| 18 | December 2023 | Second Christmas |
| 19 | January 2024 | |
| 20 | February 2024 | |
| 21 | March 2024 | |
| 22 | April 2024 | |
| 23 | May 2024 | |
| 24 | June 2024 | |
| 25 | July 2024 | Building deadline |
| 26 | August 2024 | Building deadline extended |
| 27 | September 2024 | Lucas joins |
| 28 | October 2024 | |
| 29 | November 2024 | |
| 30 | December 2024 | Third Christmas |
| 31 | January 2025 | |
| 32 | February 2025 | |
| 33 | March 2025 | |
| 34 | April 2025 | |
| 35 | May 2025 | |
| 36 | June 2025 | |
| 37 | July 2025 | |
| 38 | August 2025 | |
| 39 | September 2025 | |
| 40 | October 2025 | |
| 41 | November 2025 | Henry joins |
| 42 | December 2025 | Final Christmas, game end |

---

## gameState.month vs monthIndex

IMPORTANT DISTINCTION:
- `gameState.month` = calendar month (1-12, where 1=January, 7=July, 12=December)
- `monthIndex` (used in `monthRange`) = sequential month count from game start (1-42)
- Game starts in July, so monthIndex 1 = gameState.month 7

Many event `condition` functions check `gameState.month` for seasonal logic (e.g., "only in winter" checks `month >= 11 || month <= 2`), while `monthRange` uses the sequential month index.

---

## Monthly Stress/Recovery Mechanics (from advanceMonth)

Each month, BEFORE event selection:

### Stress Increases:
- Base: +3 (running a shop is stressful)
- Sunday open (months 1-4): +1
- Sunday open (months 5-8): +3
- Sunday open (months 9-14): +5 (DANGER ZONE)
- Sunday open (months 15+): +3
- Henry mitigates Sunday: -3
- Lucas mitigates Sunday: -1
- Working alone (no staff): +2
- Has loan after month 6: +1
- Bank < €5,000 after month 4: +2
- Low energy (<40): +1 to +3
- Low family (<50): +1 to +4
- Autonomy reduces stress: 0 to -2 based on autonomy level

### Natural Recovery:
- Energy: +4 per month (capped at maxEnergyCap)
- Stress recovery: 5 if closed Sunday, 3 if open Sunday
- High autonomy (50+/70+): +1/+2 additional stress recovery
- Family drain: -1 per month

### Staff/Pet Bonuses:
- Dog: -2 energy, +3 family, -2 stress per month
- Henry: +3 energy, -2 stress per month
- Lucas: -1 stress per month

### Burnout:
- Triggers at 80% stress (after month 6)
- Forces Sunday closure
- Loses 25% of monthly sales
- Reduces max energy cap by 20 (stacking)
- 3 burnouts = game over

---

## Event Effects System

When a choice is selected, effects are applied in this order:

1. `effects: { stat: value }` — Direct stat changes (bank, stress, energy, family, reputation)
2. `flags: { flag: value }` — Set gameState flags
3. `conditionalEffects: () => ({ ... })` — Dynamic effects calculated at runtime
4. `action: 'string'` — Special action handlers (e.g., 'take_loan', 'set_fine_food')

Some choices also have:
- `condition: () => bool` — Choice only shown if condition is met
- Dynamic `text`, `hint`, `outcome` — Can be functions returning strings based on gameState
