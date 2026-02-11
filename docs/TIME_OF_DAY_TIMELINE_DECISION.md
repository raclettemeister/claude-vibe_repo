# Time of day — timeline events only (decision doc)

**Scope:** Only the **hard-coded timeline events** (months 1–43, main + alts). Not the 52 unused events.  
**Goal:** Pin **a few** events to morning / evening / night so the pixel art matches the story. Rest stay default **afternoon**.

**Codes:** **M** = morning (0), **A** = afternoon (1), **E** = evening (2), **N** = night (3). Default = A.

---

## Timeline events that actually run (for reference)

From `data/timeline.json` — these are the only events we’re deciding on:

| Month | Main event | Alt event(s) |
|-------|------------|--------------|
| 1 | sunday_opening | — |
| 2 | stock_reality | — |
| 3 | first_cheese | — |
| 4 | insurance_decision | — |
| 5 | shop_name | — |
| 6 | first_christmas | — |
| 7 | cheap_fridge | — |
| 8 | difficult_customer | — |
| 9 | health_inspection | student_trap |
| 10 | delivery_disaster | — |
| 11 | producer_opportunity | — |
| 12 | wine_dilemma | — |
| 13 | systems_project | — |
| 14 | quiet_month | — |
| 15 | adopt_dog | — |
| 16 | first_raclette_season | — |
| 17 | building_offer | — |
| 18 | christmas_market | — |
| 19 | snow_day | — |
| 20 | the_invitation | — |
| 21 | charcuterie_question | — |
| 22 | poncho_cheese_emergency | — |
| 23 | building_countdown | family_dinner |
| 24 | bad_review | — |
| 25 | building_deadline | old_friend |
| 26 | building_deadline_extended | visibility_push |
| 27 | meet_lucas | — |
| 28 | poncho_anniversary | — |
| 29 | raclette_season | — |
| 30 | christmas_rush | — |
| 31 | reflection_moment | — |
| 32 | fancy_sign | — |
| 33 | swiss_invitation | — |
| 34 | theft_incident | — |
| 35 | summer_flood | — |
| 36 | expansion_dream | shop_atmosphere |
| 37 | parmigiano_invitation | — |
| 38 | heat_wave | — |
| 39 | back_to_school | — |
| 40 | raclette_kingdom | — |
| 41 | lucas_brings_henry | — |
| 42 | christmas_day | — |
| 43 | birthday_party | — |

---

## Proposed shortlist (only non-afternoon)

**“Not too much”** = a small set. Everything not listed here stays **afternoon (1)**.

### Morning (0) — text says “morning”, “wake up”, “early”, “arrive at the shop”

| event_id | Why (from in-game text) | Your call |
|----------|-------------------------|-----------|
| **sunday_opening** | First day, “first morning” / opening decision | M ? |
| **christmas_market** | “Early mornings in the cold” (FR/EN) | M ? |
| **snow_day** | “You wake up to 20cm of snow” | M ? |
| **summer_flood** | “You arrive at the shop to find water” | M ? |
| **christmas_day** | “Just pop in for a few hours this morning” / family 13h | M ? |
| **lucas_brings_henry** | “Lucas drops in one morning” (optional) | M or A ? |

### Evening (2) — text says “tonight”, “dinner”, “14h” ceremony, “party”

| event_id | Why (from in-game text) | Your call |
|----------|-------------------------|-----------|
| **the_invitation** | Marc’s wedding “Saturday 14h”, reception until late | E ? |
| **old_friend** | “Thomas … free tonight only”, “Drinks? Dinner?” | E ? |
| **family_dinner** | “Sunday dinner”, family gathering | E ? |
| **birthday_party** | Party at the shop, “chaos” / evening vibe | E ? |

### Night (3) — timeline has no event that clearly says “night” or “3am”

None of the current timeline events are explicitly at night. Events like `sleep_problems` (“3am”) or `birthday_forgot` (“22h”) are in the unused pool. So for **timeline-only** we can leave **night = 0 events** unless you want to add one later.

---

## Suggested “first batch” to implement

To keep it small and high-impact:

- **Morning (4):** sunday_opening, christmas_market, snow_day, christmas_day  
  (summer_flood and lucas_brings_henry optional)
- **Evening (3):** the_invitation, old_friend, birthday_party  
  (family_dinner optional — could stay afternoon if you prefer “Sunday lunch”)
- **Night:** 0 for now (all timeline events feel day-based)

**Total: 7–9 events** with a set time; the rest stay afternoon.

---

## Locked implementation

Implemented in `index.html` (`EVENT_TIME_OF_DAY` + `setTimeOfDayForEvent` before each `displayEvent`):

- **Morning (0):** sunday_opening, christmas_market, snow_day, summer_flood, christmas_day, lucas_brings_henry
- **Evening (2):** the_invitation, old_friend, family_dinner
- **Night (3):** birthday_party, poncho_cheese_emergency
- **Default afternoon (1):** all other timeline events

Birthday party and poncho cheese emergency are explicitly **night**.
