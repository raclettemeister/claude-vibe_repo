# Planning Guide for AI (Opus 4.6) — 42-Month Event Timeline

**Goal:** Fill `42-months-template.csv` so that **every month (1–42) has exactly one `event_id`**. This replaces random event selection with a fixed story timeline. The human will review the CSV and iterate with you (ping-pong).

**Output:** A completed CSV (or a clear list month → event_id) that the human can paste into the template and then discuss with you.

---

## 1. Calendar and story phases (month index → meaning)

| Month | Calendar | Story phase / milestones |
|-------|----------|---------------------------|
| 1 | Jul 2022 | **Game start.** First big decision (Sunday). |
| 2 | Aug 2022 | Early setup: insurance, first cheese, inventory fallout. |
| 3 | Sep 2022 | Shop identity, operations. |
| 4 | Oct 2022 | |
| 5 | Nov 2022 | |
| 6 | **Dec 2022** | **First Christmas** (mandatory). |
| 7 | Jan 2023 | |
| 8 | Feb 2023 | |
| 9 | Mar 2023 | |
| 10 | Apr 2023 | |
| 11 | May 2023 | |
| 12 | Jun 2023 | |
| 13 | Jul 2023 | Second summer. |
| 14 | Aug 2023 | **Poncho adoption window** (mandatory 14–16). |
| 15 | Sep 2023 | |
| 16 | **Oct 2023** | **Raclette question** (first_raclette_season) — narrative anchor. |
| 17 | Nov 2023 | **Building offer** (Madame Malfait) typically 17–18. |
| 18 | **Dec 2023** | **Second Christmas** (christmas_market, mandatory). |
| 19 | Jan 2024 | Building countdown can start. |
| 20–24 | Feb–Jun 2024 | Building savings push (recurring building_countdown possible). |
| 25 | **Jul 2024** | **Building deadline** (mandatory). |
| 26 | **Aug 2024** | **Building deadline extended** (mandatory if not bought at 25). |
| 27 | **Sep 2024** | **Lucas joins** (meet_lucas, mandatory). |
| 28–29 | Oct–Nov 2024 | Post-Lucas, Henry can be introduced (lucas_brings_henry). |
| 30 | **Dec 2024** | **Third Christmas** (christmas_rush, mandatory). |
| 31–35 | Jan–May 2025 | Late game, delegation, reflection. |
| 36–41 | Jun–Nov 2025 | Second shop offer possible; Henry if not yet; endgame beats. |
| 42 | **Dec 2025** | **Final Christmas / game end** (christmas_day, mandatory). |

---

## 2. Mandatory events (do not move these months)

These events **must** happen in these months for the story spine to work. Use exactly this event_id in this month when filling the CSV.

| Month | event_id | Title |
|-------|----------|--------|
| 1 | `sunday_opening` | The Sunday Question |
| 6 | `first_christmas` | Your First Christmas Season |
| 18 | `christmas_market` | Christmas Market Opportunity |
| 25 | `building_deadline` | July 2024: The Moment |
| 26 | `building_deadline_extended` | August 2024: Last Chance |
| 27 | `meet_lucas` | The Neighbor Kid (Lucas) |
| 30 | `christmas_rush` | The Christmas Chaos |
| 42 | `christmas_day` | Christmas Day (finale) |

**Also mandatory but with a small window (pick one month in range):**

- **Poncho:** `adopt_dog` — must occur in **14, 15, or 16** (Aug–Oct 2023).
- **Building offer:** `building_offer` — must occur in **17 or 18** (Nov–Dec 2023).
- **Poncho anniversary:** `poncho_anniversary` — must occur around **27** (Sep 2024, ~1 year after adoption) if the player has the dog.
- **First raclette:** `first_raclette_season` — narrative anchor for **month 16** (Oct 2023).

You can keep these in the suggested months above when filling the template.

---

## 3. Event chains (order matters)

Respect these dependencies when assigning events:

- **Sunday path:** `sunday_opening` (1) → later optionally `sunday_burnout` → `stop_sunday`. Place burnout/stop only in months where they make sense (e.g. 10–18).
- **Start-up:** `stock_reality` (1 or 2) → `insurance_decision` (2–4) → `first_cheese` (2–4). Often: month 1 = sunday_opening, month 2 = stock_reality or insurance or first_cheese.
- **Dog path:** `adopt_dog` (14–16) → `dog_in_shop` (after) → `poncho_cheese_emergency` / `poncho_anniversary` later.
- **Building path:** `building_offer` (17–18) → `building_countdown` (19–24, can repeat) → `building_deadline` (25) → `building_deadline_extended` (26 if needed).
- **Employee path:** `meet_lucas` (27) → `lucas_brings_henry` (e.g. 28–31) → `lucas_growth` / `delegation_moment` later.
- **Raclette arc:** `first_raclette_season` (16) → later `raclette_season` (recurring), `swiss_invitation`, `raclette_kingdom`, `parmigiano_invitation` (endgame).

---

## 4. Event types (for your choices)

- **MANDATORY:** Already fixed above; do not reassign to another month.
- **UNIQUE:** Use **once** in the whole 42 months (e.g. `shop_name`, `first_cheese`, `insurance_decision`, `building_offer`).
- **RECURRING:** Can appear **multiple times** (e.g. `building_countdown`, `family_dinner`, `good_month`, `december_rush`, `summer_slowdown`, `back_to_school`, `snow_day`, `heat_wave`, `raclette_season`). Use them to fill months where no unique beat is needed.
- **FILLER / FLEX:** Events that can go in many months (crises, one-star review, difficult customer, etc.). Use to add variety in months that are otherwise empty.
- **quiet_month:** Use when you want “no strong event” for that month (or leave `event_id` empty if the game supports it).

---

## 5. Suggested starting assignment (from design doc)

Use this as a **draft**. You can change any non-mandatory month to better match the “42 months story” or pacing. Keep mandatory months as in section 2.

| Month | Suggested event_id | Notes |
|-------|--------------------|--------|
| 1 | sunday_opening | MANDATORY |
| 2 | stock_reality | Inventory discovery |
| 3 | insurance_decision | Or first_cheese |
| 4 | first_cheese | Or shop_name |
| 5 | shop_name | Or cheap_fridge |
| 6 | first_christmas | MANDATORY |
| 7 | visibility_push | Or gradual_pivot |
| 8 | gradual_pivot | Transformation |
| 9 | charcuterie_question | Or back_to_school |
| 10 | sunday_burnout | If Sunday open; else filler |
| 11 | stop_sunday | Or filler |
| 12 | fine_food_choice | Identity |
| 13 | summer_slowdown | Or heat_wave |
| 14 | adopt_dog | MANDATORY (Poncho) |
| 15 | wine_dilemma | Or back_to_school |
| 16 | first_raclette_season | Raclette question |
| 17 | building_offer | Or hospital_call |
| 18 | christmas_market | MANDATORY |
| 19 | building_countdown | Or pricing_strategy |
| 20 | building_countdown | Savings push |
| 21 | the_invitation | Or filler |
| 22 | building_countdown | Or filler |
| 23 | corporate_opportunity | Or filler |
| 24 | raclette_kingdom | Or building_countdown |
| 25 | building_deadline | MANDATORY |
| 26 | building_deadline_extended | MANDATORY |
| 27 | meet_lucas | MANDATORY |
| 28 | poncho_cheese_emergency | Or lucas_brings_henry |
| 29 | systems_project | Or filler |
| 30 | christmas_rush | MANDATORY |
| 31 | lucas_brings_henry | Henry hire |
| 32 | delegation_moment | Or take_holiday |
| 33 | take_holiday | Or filler |
| 34 | supplier_relationship | Or filler |
| 35 | personal_recharge | Or reflection_moment |
| 36 | second_shop_offer | Or filler (if no building) |
| 37 | expansion_dream | Or filler |
| 38 | documentary_approach | Or filler |
| 39 | lucas_growth | Or filler |
| 40 | shop_philosophy | Or filler |
| 41 | reflection_moment | Pre-finale |
| 42 | christmas_day | MANDATORY |

---

## 6. Full event list (reference for id and narrative role)

**Canonical source:** **COMPLETE-EVENT-REGISTRY.md** has every event from the code (106), plus system-triggered (burnout, cash_crisis), photo unlock keys, and implementation notes. Use it to ensure nothing is missed.

See **EVENTS-REFERENCE.md** in this folder for the quick list of `event_id` and titles. Use only those IDs in the CSV. Summary:

- **Crisis / one-off:** cash_crisis (special, do not place), summer_flood, delivery_disaster, health_inspection, fridge_breakdown, bad_review, theft_incident, hospital_call, etc.
- **Decisions / pivot:** sunday_opening, stock_reality, insurance_decision, first_cheese, shop_name, cheap_fridge, fine_food_choice, gradual_pivot, charcuterie_question, wine_dilemma, etc.
- **Christmas:** first_christmas, christmas_market, christmas_rush, christmas_day (all fixed above).
- **Building:** building_offer, building_countdown, building_deadline, building_deadline_extended.
- **Staff:** meet_lucas, lucas_brings_henry, direct_hire_help, staff_training, apprentice_request, lucas_growth, delegation_moment.
- **Dog:** adopt_dog, dog_in_shop, poncho_cheese_emergency, poncho_anniversary.
- **Recurring / seasonal:** december_rush, summer_slowdown, heat_wave, snow_day, back_to_school, raclette_season, good_month, family_dinner.
- **Filler / optional:** quiet_month, many “crisis” or “personal” events that can fill a month.

---

## 7. Rules when filling the CSV

1. **One event per month:** Each row in the CSV = one month. Set `event_id` to exactly one value from EVENTS-REFERENCE.md, or `quiet_month`, or leave empty if the format allows.
2. **Do not change mandatory months** (1, 6, 18, 25, 26, 27, 30, 42) — use the event_ids from section 2.
3. **Unique events:** Each unique event appears at most once in the 42 months.
4. **Recurring events:** Can repeat (e.g. building_countdown, family_dinner, good_month).
5. **Dependencies:** Place events after their prerequisites (e.g. adopt_dog before dog_in_shop; meet_lucas before lucas_brings_henry).
6. **Pacing:** Spread crises and big decisions; use filler or quiet_month so the story doesn’t feel overloaded.
7. **Notes column:** Use it to explain a choice (e.g. “Poncho year 1”, “Building push”) for the human reviewer.

After you fill the template, the human will review the CSV and iterate with you (ping-pong).
