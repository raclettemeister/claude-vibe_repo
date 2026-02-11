# AFSCA (health_inspection) earlier — implementation options

**Goal:** Have the AFSCA visit happen **earlier** in the run, and only in the phase **before buying the building** (i.e. before month 25/26), instead of only as a fallback at month 22 when the Poncho cheese emergency doesn’t trigger.

**Current state:**
- `health_inspection` in `data/events.js`: `monthRange: [5, 40]`, `unique: true`, no condition.
- In **timeline**: AFSCA appears **only** as **alt** on month 22 (`poncho_cheese_emergency` main, `health_inspection` alt). So in practice it only happens at month 22 when the player doesn’t get the Poncho event.
- So today AFSCA is “late” and feels like a generic fallback.

*(Assuming “Mount Fyfe” = early months, e.g. from month 5 onward, and “up until buying the building” = cap at month 24 or 25.)*

---

## Option A — Dedicated early slot (replace one month’s main event)

**Idea:** Give AFSCA a **fixed early month** as the **main** event for that month.

- In `data/timeline.json`, pick one month in **6–12** (e.g. **9** or **10**) and set that month to `"event": "health_inspection"` (no alt, or alt = current event for that month).
- The event that currently occupies that month (e.g. month 9 = `student_trap`, month 10 = `delivery_disaster`) is moved: either becomes the **alt** for that same month (so either AFSCA or that event), or is moved to another month / pool.
- In `data/events.js`, optionally narrow `monthRange` to e.g. `[5, 24]` and add `condition: () => !gameState.ownsBuilding` so AFSCA never fires after the building purchase.

**Pros:** AFSCA always happens once, early; clear “surprise inspection when you’re still finding your feet.”  
**Cons:** One month is locked to AFSCA; you have to decide which current event to displace or share the slot with.

---

## Option B — AFSCA as main on an early month, with alt (shared slot)

**Idea:** One early month (e.g. **9**) has **two** candidates: AFSCA first, current event as alt.

- Timeline for that month: `{ "event": "health_inspection", "alt": { "event": "student_trap" } }` (example for month 9).
- Selection logic (already in place): try main first; if already used or not eligible, try alt. So first run gets AFSCA at 9; if for some reason it’s already seen, player gets student_trap.
- Optionally cap `health_inspection` in events.js to `monthRange: [5, 24]` and `condition: () => !gameState.ownsBuilding`.

**Pros:** AFSCA is the “default” for that month; no need to remove the other event from the game.  
**Cons:** If you want *both* AFSCA and the other event in the same run, you’d need a different month for one of them (or a second slot).

---

## Option C — Two timeline slots: one early (main), one mid (alt elsewhere)

**Idea:** AFSCA appears in **two** places in the timeline: one **early** as main, one **mid** (before building) as alt.

- **Early:** e.g. month **9** or **10** → `"event": "health_inspection"` (main), with current month-9/10 event as alt.
- **Mid:** Remove AFSCA from month 22. So month 22 is only `poncho_cheese_emergency` (no alt), or give month 22 a different alt (e.g. another crisis). Alternatively, keep AFSCA as alt on another month in [11–24] so that if the early slot was skipped (e.g. condition not met in a future design), there’s still one more chance before building.

**Pros:** Most runs get AFSCA early; rare edge cases can still get it later.  
**Cons:** Slightly more to maintain (two slots); need to ensure “only one AFSCA per run” via `unique: true` (already the case).

---

## Option D — Narrow window + condition “before building” only (no new timeline slot)

**Idea:** Don’t add a new timeline slot; only restrict **when** AFSCA is allowed.

- In `data/events.js`: set `monthRange` to `[5, 24]` (or 25 if you want it possible in the building-deadline month) and add `condition: () => !gameState.ownsBuilding`.
- In **timeline**: **remove** `health_inspection` from month 22’s alt. So month 22 = only `poncho_cheese_emergency` (or poncho + a different alt, not AFSCA).
- AFSCA then only appears if the **pool/random** path is used for some month in [5, 24]. In **strict timeline** mode, with no AFSCA in timeline at all, AFSCA would **never** trigger.

So this option only makes sense **combined with A, B, or C** (i.e. add at least one timeline slot for AFSCA in the early window). Used alone, it would effectively remove AFSCA from strict-timeline runs.

---

## Option E — Early slot + cap and condition (recommended combination)

**Idea:** One concrete way to get “AFSCA earlier, only before buying the building”:

1. **Timeline**
   - Choose an **early month** (e.g. **9**): set `"event": "health_inspection"` as **main**, and the current month-9 event (e.g. `student_trap`) as **alt**.
   - **Month 22:** set to `"event": "poncho_cheese_emergency"` only (remove `health_inspection` from alt). Optionally add a different alt (e.g. `quiet_month` or another crisis) if you want a fallback when Poncho doesn’t trigger.

2. **events.js**
   - `health_inspection`: set `monthRange` to `[5, 24]` (or `[5, 25]` if you want it possible in the building-deadline month).
   - Add `condition: () => !gameState.ownsBuilding` so it never fires after the purchase.

**Result:** AFSCA is a defining early moment (e.g. month 9), always before the building storyline, and no longer a “generic” fallback at month 22.

---

## Option F — “First inspection” window (earliest possible)

**Idea:** Make AFSCA the **earliest** crisis that can happen once the shop is clearly a food shop.

- Put AFSCA as **main** on **month 7** or **8** (after first Christmas, after cheap fridge — so there is something to inspect). Month 7 = `cheap_fridge`, month 8 = `difficult_customer`. So either:
  - Month 7: `health_inspection` (main), `cheap_fridge` (alt), or  
  - Month 8: `health_inspection` (main), `difficult_customer` (alt).
- Cap in events.js as in E: `monthRange: [5, 24]`, `condition: () => !gameState.ownsBuilding`.
- Month 22: remove AFSCA from alt.

**Pros:** AFSCA happens in the first year; strong “we’re a real food business now” beat.  
**Cons:** Pushes cheap_fridge or difficult_customer to alt for that month (or relocates them).

---

## Summary table

| Option | Timeline change | events.js change | When AFSCA happens |
|--------|-----------------|------------------|--------------------|
| A | One early month = AFSCA main (displace or share) | Optional: cap + `!ownsBuilding` | Fixed early month |
| B | One early month = AFSCA main + current event alt | Optional: cap + `!ownsBuilding` | That month (or alt if already seen) |
| C | Early month = AFSCA main; keep one mid alt elsewhere; remove from 22 | Optional: cap + `!ownsBuilding` | Early + possible second chance |
| D | Remove AFSCA from timeline (e.g. month 22) | Cap + `!ownsBuilding` | Only via pool (not in strict timeline) |
| E | Early month (e.g. 9) = AFSCA main + alt; month 22 = no AFSCA | `monthRange [5,24]` + `!ownsBuilding` | Once, early, before building |
| F | Very early (7 or 8) = AFSCA main + alt; month 22 = no AFSCA | Same as E | Once, first year, before building |

Recommendation: **E or F** for “AFSCA earlier, up until buying the building” with a single, intentional slot and no generic fallback at 22. Pick the month (7, 8, 9, or 10) based on how early you want the beat and which event you’re comfortable making the alt for that month.
