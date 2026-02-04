# Event Schema Reference

> **Purpose:** Document the effect keys, flags with special handling, and actions used by the game engine. Use this when editing events in `data/events.js` to avoid breakage.

---

## Effect Keys (applyEffects)

These are the only keys processed by `applyEffects()` in `index.html`. Any other key in `choice.effects` or `conditionalEffects()` is **ignored**.

| Key | Behavior |
|-----|----------|
| `bank` | Adds to `gameState.bank` |
| `salesBoost` | Adds to `gameState.bank` (one-time revenue) |
| `savingsBoost` | Adds to `gameState.bank` (one-time savings) |
| `salesPenalty` | Subtracts from `gameState.bank` |
| `energy` | Clamped 0–100. Negative values are multiplied by `mod.meterDrain * 0.5` (energy costs halved v2.3). |
| `stress` | Clamped 0–100. During burnout recovery, stress gains are halved. Positive values use `mod.meterDrain`. |
| `family` | Clamped 0–100. Negative values use `mod.meterDrain`. |
| `autonomy` | Clamped 0–100. |
| `reputation` | Clamped 0–100. |
| `cheeseTypes` | Sets `gameState.cheeseTypes` (replaces, not adds). Calls `updateConcept()`. If >= 50, triggers cheese milestone photo. |
| `racletteTypes` | Sets `gameState.racletteTypes` (replaces, not adds). |
| `bulkPercentage` | Sets `gameState.bulkPercentage`. |
| `conceptPivotProgress` | Sets `gameState.conceptPivotProgress`. Calls `updateConcept()`. |
| `producerVisits` | Sets `gameState.producerVisits` (replaces, not adds). |
| `holidaysTaken` | Sets `gameState.holidaysTaken` (replaces, not adds). |

**Note:** For additive effects (bank, stress, energy, etc.), `conditionalEffects()` can return objects that get merged with `choice.effects` before application. Values are summed per key.

---

## Flags with Special Handling (makeChoice)

When a choice sets `flags`, each key is assigned to `gameState`. These flags trigger **extra behavior** in `makeChoice()` — do not rename them.

| Flag | Special Behavior |
|------|------------------|
| `ownsBuilding` | When `true`, sets `gameState.monthsSinceBuilding = 0` and unlocks `building_purchased` photo. |
| `hasLucas` | When `true`, unlocks `hire_lucas` photo. |
| `hasHenry` | When `true`, unlocks `hire_henry` photo. |
| `hadBigBirthdayParty` | When `true`, unlocks `birthday_party` photo. |
| `hasDog` | When `true`, unlocks `adopt_poncho` photo. |
| `septemberRushExperienced` | When `true`, unlocks `september_rush` photo. |
| `cheeseTypes` | Triggers `updateConcept()`. If `gameState.cheeseTypes >= 50`, triggers `cheese_milestone_50` photo unlock. |

Other flags (e.g. `openSunday`, `liquidatedStock`, `firstChristmasDone`) are written to `gameState` without special logic. You can add new flags freely; only the ones above have hardcoded handlers.

---

## Special Actions (choice.action)

Used for cash crisis and identity choices. Only these values are handled; others are ignored.

| Action | Behavior |
|--------|----------|
| `take_loan` | Takes loan = `shortfall * 1.2`, adds to `gameState.loan`. Bank = loan amount minus shortfall. Clears `unpaidAmount` and `monthsUnpaid`. |
| `sell_equipment` | Bank = `shortfall * 0.3`. Sets `gameState.equipmentSold = true`. Clears unpaid. |
| `family_help` | Bank = `shortfall * 0.5`. Increments `gameState.familyHelpUsed`. Clears unpaid. |
| `set_fine_food` | Sets `gameState.concept = 'Fine Food'`. No shortfall logic. |

`shortfall` comes from `gameState.cashCrisisAmount` or `gameState.unpaidAmount`. These actions are primarily used in the `cash_crisis` event.

---

## Mandatory Event IDs

The balance test suite (`tests/balance_test_suite.py`) expects these event IDs to exist:

- `sunday_opening`
- `first_christmas`
- `adopt_dog`
- `building_offer`
- `christmas_market`
- `building_deadline`
- `building_deadline_extended`
- `meet_lucas`
- `christmas_rush`
- `christmas_day`

Do not remove or rename these.

---

## Event IDs and Photo Unlocks

Photos in `photoAlbumData` use `unlockEvent` to tie an event to a photo. When `checkPhotoUnlocks(eventId)` is called after a choice, it checks `photo.unlockEvent === eventId`. Changing an event's `id` breaks photo unlocks for that event.

`triggerEventPolaroid(eventId)` uses a `photoMapping` object in `index.html` to show polaroids for specific events. Event IDs in that mapping: `adopt_poncho`, `first_cheese`, `hire_lucas`, `hire_henry`, `first_christmas`, `summer_flood`, `wine_pairing`, `wine_dilemma`, `producer_visit`, `building_purchased`, `swiss_invitation`, `parmigiano_invitation`, `cheese_milestone_50`, `poncho_cheese_emergency`, `birthday_party`, `september_rush`, `christmas_market`, `poncho_anniversary`.

---

## Locale and Choice Indices

Locale lookup for choices is **index-based**: `window.currentLocale.events[eventId].choices[choiceIndex]`. If you reorder or insert choices, you must update the `choices` array in `data/locales/en.json` and `fr.json` to match. Removing a choice shifts indices for all choices after it.

---

## Validation

Run `window.validateEvents()` in the browser console, or use the "Validate Events" button on the title screen (when served from localhost). The validator checks:

- Every event has `id` and `choices`
- Each choice has `text` and at least one of: `effects`, `flags`, `action`, `conditionalEffects`
- All mandatory event IDs exist
- Unknown effect keys and actions produce warnings
