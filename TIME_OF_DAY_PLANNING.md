# Pixel art: time-of-day implementation

**Branch:** `feature/pixel-time-of-day`  
**Goal:** Use the existing morning / afternoon / evening / night mechanics in the pixel scene so that **event-specific** time of day is shown when an event is displayed. Some events are pinned to a time that matches their story (e.g. “3am wake-ups” → night, “Sunday opening” → morning).

---

## 1. What already exists

### In `js/pixel-scene.js`

- **`gameState.timeOfDay`** is read and drives the sky, sun/moon, and horizon:
  - **0 = morning** — warm orange/gold sky, sun low left
  - **1 = afternoon** — blue sky (seasonal), sun high right (default)
  - **2 = evening** — sunset gradient, orange/purple
  - **3 = night** — dark blue, moon and stars

- The **outro/game-over** scene already forces `timeOfDay: 2` (evening) when drawing the final pixel scene.

### In the game loop

- **Initial `gameState`** sets `timeOfDay: 0` in at least one place (e.g. copy-log template).
- **During play**, `animatePixelScene()` calls `PixelScene.drawPixelScene(gameState)` every frame. So whatever is in `gameState.timeOfDay` is what the player sees.
- **Today:** `timeOfDay` is never updated when an event is shown, so the scene is effectively always “afternoon” (default in pixel-scene.js when `timeOfDay` is undefined) or whatever was last set.

### Conclusion

- No new pixel art is required. We only need to:
  1. **Set `gameState.timeOfDay`** when we are about to show an event, using a **per-event time** (or a default).
  2. **Store** that per-event time in a small mapping (e.g. `eventId → timeOfDay`) or on the event config.

---

## 2. Implementation outline

1. **Define a mapping**  
   `eventId → timeOfDay` (0–3), e.g. in `index.html` as a const object or in `data/` (e.g. `data/event-time-of-day.json`). Default for unmapped events: `1` (afternoon).

2. **Apply when showing an event**  
   When we set `currentEvent` and call `displayEvent(currentEvent)`:
   - Look up `timeOfDay` for `currentEvent.id` (or use default 1).
   - Set `gameState.timeOfDay = timeOfDay` so the next frame of `animatePixelScene()` uses it.

3. **Optional:** persist or reset `timeOfDay` when leaving the event (e.g. back to 1 for next month) so the next event can override again.

No changes needed inside `pixel-scene.js`; it already respects `gameState.timeOfDay`.

---

## 3. Proposed event → time-of-day (for discussion / Linear)

Below is a **first pass** based on event **titles and descriptions** (EN/FR). Use this to discuss and lock choices in Linear; then we implement the mapping accordingly.

**Legend:**  
M = morning (0), A = afternoon (1), E = evening (2), N = night (3).

### Timeline events (in order) — proposal

| Month | event_id                  | Proposed | Reason (from description / title) |
|-------|---------------------------|----------|------------------------------------|
| 1     | sunday_opening            | **M**    | “First morning”, opening decision   |
| 2     | stock_reality            | **M** or A | Weekend counting, inventory       |
| 3     | first_cheese             | **A**    | Madame Dubois, Tuesday, shop       |
| 4     | insurance_decision       | **A**    | Broker, shop context               |
| 5     | shop_name                | **A**    | Shop identity, “chez Julien”       |
| 6     | first_christmas          | **A**    | December, customers trickle in     |
| 7     | cheap_fridge             | **A**    | Finding/buying equipment           |
| 8     | difficult_customer       | **A**    | In-shop complaint                  |
| 9     | student_trap             | **A**    | Student in shop                    |
| 10    | delivery_disaster        | **M** or A | Delivery no-show, morning prep   |
| 11    | producer_opportunity     | **A**    | Invitation, daytime                |
| 12    | wine_dilemma             | **A**    | “What wine goes with this cheese?” |
| 13    | systems_project          | **A**    | Organisation, shop                 |
| 14    | quiet_month              | **A**    | Default calm day                    |
| 15    | adopt_dog                | **A** or E | Partner, “those eyes” — flexible |
| 16    | first_raclette_season    | **A**    | October, temperature drops         |
| 17    | building_offer           | **A** or E | Phone call from landlord         |
| 18    | christmas_market         | **M**    | “Early mornings in the cold”       |
| 19    | snow_day                 | **M**    | “You wake up to 20cm of snow”      |
| 20    | the_invitation           | **E**    | “Saturday 14h”, dinner/reception   |
| 21    | charcuterie_question     | **A**    | Customer at counter                 |
| 22    | poncho_cheese_emergency / health_inspection | **A** | In-shop incident / inspection |
| 23    | building_countdown / family_dinner | **E** or **A** | Countdown = daytime; family dinner = evening |
| 24    | bad_review               | **A** or E | Review online, could be evening  |
| 25    | building_deadline / old_friend | **A** or **E** | Deadline = daytime; Thomas “tonight” = E |
| 26    | building_deadline_extended / visibility_push | **A** | Big moment, daytime |
| 27    | meet_lucas               | **A**    | “Stops by”, shop context           |
| 28    | poncho_anniversary       | **A**    | Celebration at shop                |
| 29    | raclette_season          | **A**    | Winter, shop                       |
| 30    | christmas_rush           | **A**    | “Haven’t eaten lunch in three days”|
| 31    | reflection_moment        | **A**    | “Quiet Tuesday afternoon”         |
| 32    | fancy_sign               | **A**    | Sign, shop front                   |
| 33    | swiss_invitation         | **A** or E | Email, trip invitation            |
| 34    | theft_incident           | **E** or N | “Inventory of the evening”       |
| 35    | summer_flood             | **M**    | “You arrive at the shop to find water” |
| 36    | expansion_dream / shop_atmosphere | **A** | Shop, “two boutiques?” |
| 37    | parmigiano_invitation    | **A** or E | Email, trip                      |
| 38    | heat_wave                | **A**    | “38°C outside”, daytime            |
| 39    | back_to_school           | **A**    | September, shop                    |
| 40    | raclette_kingdom         | **A**    | Shop, raclette corner              |
| 41    | lucas_brings_henry       | **A**    | “Lucas drops in one morning”       |
| 42    | christmas_day            | **M**    | “Pop in for a few hours this morning” / family 13h |
| 43    | birthday_party           | **E**    | Party at shop, “chaos”             |

### Strong “time” cues from text (good candidates to pin first)

| event_id          | Proposed | Why |
|-------------------|----------|-----|
| sunday_opening    | M        | First morning, opening |
| christmas_market   | M        | “Early mornings in the cold” |
| snow_day           | M        | “You wake up to 20cm of snow” |
| summer_flood       | M        | “You arrive at the shop to find…” |
| christmas_day      | M        | “Just pop in for a few hours this morning” |
| reflection_moment  | A        | “Quiet Tuesday afternoon” |
| the_invitation     | E        | “Saturday 14h”, reception until late |
| old_friend         | E        | “He’s free tonight only”, “Drinks? Dinner?” |
| theft_incident     | E or N   | “Evening inventory” |
| sleep_problems     | N        | “Waking up at 3am” |
| birthday_forgot    | N        | “It’s 22h. You’re finally home.” |
| delegation_moment  | N        | “It’s 23h. You’re still at the computer.” |
| family_dinner      | E        | “Sunday dinner” |

---

## 4. Next steps (Linear)

1. **Issue: Implement time-of-day in game loop**  
   - Add `eventId → timeOfDay` map (data or const).  
   - In the code path that sets `currentEvent` and calls `displayEvent(currentEvent)`, set `gameState.timeOfDay` from the map (default 1).  
   - Confirm one event that’s clearly morning (e.g. `sunday_opening`) and one clearly evening (e.g. `the_invitation` or `old_friend`) for QA.

2. **Issue: Finalise event → time selection**  
   - In Linear (or a doc linked from Linear), go through the table in §3 and the “strong cues” table.  
   - For each event: confirm M/A/E/N or “keep default (afternoon)”.  
   - Optionally: only pin events with a clear time in the text; leave the rest as afternoon.

3. **Issue (optional): Data file and i18n**  
   - If we want events to declare their own time: add optional `timeOfDay` (0–3) to event config or to a small JSON used at runtime.  
   - No need to expose time-of-day in UI/localisation unless we add labels like “Morning” later.

---

## 5. Files to touch (implementation)

| File | Change |
|------|--------|
| `index.html` | Add `EVENT_TIME_OF_DAY` map (or load from data); when setting `currentEvent` before `displayEvent()`, set `gameState.timeOfDay` from map (default 1). |
| Optional: `data/event-time-of-day.json` | New file: `{ "sunday_opening": 0, "christmas_market": 0, … }` and load it like timeline. |
| `js/pixel-scene.js` | No change (already uses `gameState.timeOfDay`). |
| `PIXEL_ART_REFERENCE.md` | Add a line that `timeOfDay` is set per event from `EVENT_TIME_OF_DAY` (or data). |

---

*Use this doc and the tables above in Linear to decide the final event → time mapping, then implement the mapping and the single game-loop change.*
