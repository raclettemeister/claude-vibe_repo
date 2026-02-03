# Chez Julien — Complete Event Map

> **Last Updated:** February 2, 2026
> **Purpose:** Complete list of all events with their timing, for deterministic (non-random) implementation
> **Status:** EXTRACTED FROM v3.5 — Needs review and assignment to fixed months

---

## The New Rule: No More Randomness

> "I might as well remove all chance factors and have complete control of which event happened which month."

This document lists EVERY event in the game. The goal is to assign each event to a specific month so every playthrough has the same story beats.

---

## Event Categories

| Category | Behavior | Count |
|----------|----------|-------|
| **MANDATORY** | Must happen at fixed month | ~10 |
| **STORY** | Important narrative beats, assign to specific month | ~15 |
| **CHOICE** | Player decisions, can be assigned or removed | ~30 |
| **FILLER** | Can be removed or used to fill gaps | ~20 |
| **CONDITIONAL** | Only appear if player made certain choices | ~15 |

---

## MANDATORY EVENTS (Story Spine)

These events MUST happen. They are the backbone of the narrative.

| Month | Event ID | Title | What Happens |
|-------|----------|-------|--------------|
| 1 | `sunday_opening` | The Sunday Question | First decision: open Sundays or not |
| 1-2 | `stock_reality` | The Inventory | Discover the dead stock problem |
| 2-4 | `insurance_decision` | The Insurance Question | Choose comprehensive or basic coverage |
| 2-4 | `first_cheese` | A Customer's Suggestion | Start the cheese journey |
| 6 | `first_christmas` | Your First Christmas Season | First December as shop owner |
| 14-16 | `adopt_dog` | The Dog Question | Poncho adoption (CRITICAL moment) |
| 17-18 | `building_offer` | Madame Malfait Calls | Building purchase opportunity announced |
| 18 | `christmas_market` | Christmas Market Opportunity | Second Christmas, market stand |
| 25 | `building_deadline` | July 2024: The Moment | Building deadline - €80k or not |
| 26 | `building_deadline_extended` | August 2024: Last Chance | Extended deadline if needed |
| 27-28 | `meet_lucas` | The Neighbor Kid | Lucas hire opportunity |
| 42 | `christmas_day` | Christmas Day | Final Christmas - family vs shop |

---

## STORY EVENTS (Important Beats)

These should be assigned to specific months for consistent narrative.

| Current Range | Event ID | Title | Suggested Month |
|---------------|----------|-------|-----------------|
| 3-12 | `shop_name` | What's In a Name? | Month 4 |
| 4-10 | `cheap_fridge` | The Barely-Working Fridge | Month 5 |
| 6-15 | `gradual_pivot` | The Gradual Transformation | Month 8 |
| 8-20 | `fine_food_choice` | A New Direction | Month 12 |
| 10-18 | `sunday_burnout` | The Crash | Month 10 (if Sunday open) |
| 12-25 | `stop_sunday` | The Sunday Decision | Month 11 (after burnout) |
| 19-24 | `building_countdown` | The Savings Push | Months 20, 22, 24 (recurring) |
| 28-42 | `lucas_brings_henry` | Lucas Has a Friend | Month 30 |
| 28-40 | `delegation_moment` | Learning to Let Go | Month 32 |
| 36-42 | `second_shop_offer` | The Call from Rue au Bois | Month 38 (if no building) |

---

## CHRISTMAS EVENTS (One Per Year)

| Month | Year | Event ID | Title |
|-------|------|----------|-------|
| 6 | 2022 | `first_christmas` | Your First Christmas Season |
| 18 | 2023 | `christmas_market` | Christmas Market Opportunity |
| 30 | 2024 | `christmas_rush` | The Christmas Chaos |
| 42 | 2025 | `christmas_day` | Christmas Day (finale) |

---

## CRISIS EVENTS

| Current Range | Event ID | Title | Notes |
|---------------|----------|-------|-------|
| Any | `cash_crisis` | No More Grace | Triggers when bank hits 0 |
| 13-37 (summer) | `summer_flood` | The Flood | 50% chance in summer, requires insurance decision |
| 10-18 | `sunday_burnout` | The Crash | If Sunday open + low energy or high stress |
| 18-36 | `poncho_cheese_emergency` | Poncho's Cheese Incident | If have dog + enough cheese |

---

## FAMILY/LIFE EVENTS

| Current Range | Event ID | Title | Emotional Weight |
|---------------|----------|-------|------------------|
| 8-18 | `the_invitation` | The Invitation | Marc's wedding - HIGH |
| 17-18 | `hospital_call` | The Hospital Call | Father in hospital - VERY HIGH |
| 1-42 | `family_dinner` | Sunday Dinner | Recurring family tension |
| 20-40 | `take_holiday` | A Week Off? | Can you leave the shop? |
| ? | `birthday_forgot` | Forgot Birthday | Family tension |
| ? | `old_friend` | Old Friend | Friend needs help |
| ? | `relationship_tension` | Relationship Tension | Partner conflict |

---

## PRODUCT/BUSINESS EVENTS

| Current Range | Event ID | Title | Type |
|---------------|----------|-------|------|
| 6-38 | `charcuterie_question` | The Charcuterie Question | Add product line |
| 10-38 | `wine_dilemma` | The Wine Dilemma | Add wine |
| 12-35 | `corporate_opportunity` | The Corporate Inquiry | B2B opportunity |
| ? | `raclette_season` | Raclette Season | Seasonal boost |
| ? | `swiss_invitation` | Swiss Invitation | Producer visit |
| ? | `raclette_kingdom` | Raclette Kingdom | Achievement |
| ? | `parmigiano_invitation` | Parmigiano Invitation | Italy trip |

---

## HIRING EVENTS

| Current Range | Event ID | Title | Who |
|---------------|----------|-------|-----|
| 27-28 | `meet_lucas` | The Neighbor Kid | Lucas (MANDATORY) |
| 28-42 | `lucas_brings_henry` | Lucas Has a Friend | Henry |
| 26-40 | `direct_hire_help` | Time to Get Help | Sophie (backup) |
| 5-30 | `student_trap` | Student Workers | Warning event |

---

## STRATEGY EVENTS (One-Time Decisions)

| Current Range | Event ID | Title | Type |
|---------------|----------|-------|------|
| 8-25 | `systems_project` | Time to Systematize | Operations |
| 6-20 | `visibility_push` | Building Visibility | Marketing |
| 10-28 | `personal_recharge` | Taking Care of Yourself | Self-care |
| 12-30 | `pricing_strategy` | The Pricing Question | Positioning |
| ? | `supplier_relationship` | Supplier Strategy | Sourcing |
| ? | `weekly_rhythm` | Weekly Rhythm | Routine |
| ? | `learning_investment` | Learning Investment | Skills |
| ? | `shop_atmosphere` | Shop Atmosphere | Experience |

---

## SEASONAL/RECURRING EVENTS

| Season | Event ID | Title |
|--------|----------|-------|
| December | `december_rush` | The December Rush |
| Summer | `summer_slowdown` | Summer Slowdown |
| Summer | `heat_wave` | Heat Wave |
| Winter | `snow_day` | Snow Day |
| September | `back_to_school` | Back to School |

---

## FILLER EVENTS (Can Be Removed or Assigned)

These are less critical and can be cut if the game feels too cluttered:

| Event ID | Title | Notes |
|----------|-------|-------|
| `regular_appreciation` | Regular Appreciation | Feel-good moment |
| `competitor_closes` | Competitor Closes | Market shift |
| `apprentice_request` | Apprentice Request | Teaching opportunity |
| `food_blogger_visit` | Food Blogger Visit | Marketing event |
| `reflection_moment` | Reflection Moment | Narrative pause |
| `newspaper_feature` | Newspaper Feature | Press coverage |
| `expand_hours` | Expand Hours | Operations decision |
| `talk_to_customers` | Talk to Customers | Customer insight |
| `supplier_price_hike` | Supplier Price Hike | Cost pressure |
| `delivery_disaster` | Delivery Disaster | Crisis |
| `health_inspection` | Health Inspection | Compliance |
| `competitor_opens` | Competitor Opens | Market pressure |
| `fridge_breakdown` | Fridge Breakdown | Equipment crisis |
| `bad_review` | Bad Review | Reputation hit |
| `difficult_customer` | Difficult Customer | Service challenge |
| `regular_moves_away` | Regular Moves Away | Loss |
| `theft_incident` | Theft Incident | Security |
| `signature_cheese` | Signature Cheese | Product development |
| `shop_philosophy` | Shop Philosophy | Identity |
| `mentor_opportunity` | Mentor Opportunity | Teaching |
| `neighborhood_collab` | Neighborhood Collab | Partnership |
| `cookbook_idea` | Cookbook Idea | Creative project |
| `seasonal_ritual` | Seasonal Ritual | Tradition |
| `lucas_growth` | Lucas Growth | Employee development |
| `your_counter_story` | Your Counter Story | Reflection |
| `expansion_dream` | Expansion Dream | Future planning |
| `documentary_approach` | Documentary Approach | Media opportunity |
| `charity_choice` | Charity Choice | Values decision |
| `naming_ceremony` | Naming Ceremony | Milestone |
| `special_order` | Special Order | Customer request |
| `catering_opportunity` | Catering Opportunity | B2B |
| `private_tasting` | Private Tasting | Premium service |
| `bulk_order` | Bulk Order | Sales event |
| `market_stall` | Market Stall | Expansion |
| `good_month` | Good Month | Positive event |
| `quiet_month` | Quiet Month | Slow period |

---

## PROPOSED FIXED SCHEDULE (Draft)

Here's a proposed assignment of events to specific months. **Julien should review and adjust.**

### Year 1 (Months 1-12)

| Month | Event | Notes |
|-------|-------|-------|
| 1 | `sunday_opening` | First decision |
| 1 | `stock_reality` | Second event of month 1 |
| 2 | `insurance_decision` | Setup for flood |
| 3 | `first_cheese` | Start cheese journey |
| 4 | `shop_name` | Identity |
| 5 | `cheap_fridge` | Equipment decision |
| 6 | `first_christmas` | MANDATORY |
| 7 | `visibility_push` | Marketing |
| 8 | `gradual_pivot` | Transformation |
| 9 | `charcuterie_question` | Add product |
| 10 | `sunday_burnout` | IF Sunday open |
| 11 | `stop_sunday` | After burnout |
| 12 | `fine_food_choice` | Identity shift |

### Year 2 (Months 13-24)

| Month | Event | Notes |
|-------|-------|-------|
| 13 | `summer_slowdown` | Seasonal |
| 14 | `adopt_dog` | MANDATORY - Poncho |
| 15 | `wine_dilemma` | Add wine |
| 16 | `dog_in_shop` | Poncho adjustment |
| 17 | `building_offer` | MANDATORY |
| 17 | `hospital_call` | Family crisis |
| 18 | `christmas_market` | MANDATORY |
| 19 | `pricing_strategy` | Business decision |
| 20 | `building_countdown` | Savings push |
| 21 | `the_invitation` | Marc's wedding |
| 22 | `building_countdown` | Savings push |
| 23 | `corporate_opportunity` | B2B chance |
| 24 | `building_countdown` | Final push |

### Year 3 (Months 25-36)

| Month | Event | Notes |
|-------|-------|-------|
| 25 | `building_deadline` | MANDATORY |
| 26 | `building_deadline_extended` | If needed |
| 27 | `meet_lucas` | MANDATORY |
| 28 | `poncho_cheese_emergency` | Crisis |
| 29 | `systems_project` | Operations |
| 30 | `christmas_rush` | December |
| 31 | `lucas_brings_henry` | Henry hire |
| 32 | `delegation_moment` | Growth |
| 33 | `take_holiday` | Can you leave? |
| 34 | `supplier_relationship` | Business |
| 35 | `personal_recharge` | Self-care |
| 36 | `summer_flood` | IF no insurance |

### Year 4 (Months 37-42)

| Month | Event | Notes |
|-------|-------|-------|
| 37 | `expansion_dream` | Reflection |
| 38 | `second_shop_offer` | IF no building |
| 39 | `lucas_growth` | Employee arc |
| 40 | `shop_philosophy` | Identity |
| 41 | `reflection_moment` | Pre-finale |
| 42 | `christmas_day` | MANDATORY finale |

---

## CONDITIONAL EVENT CHAINS

Some events only make sense if earlier choices were made:

### Sunday Path
1. `sunday_opening` (choose open) →
2. `sunday_burnout` (month 6-10) →
3. `stop_sunday` (after burnout)

### Dog Path
1. `adopt_dog` (month 14-16) →
2. `dog_in_shop` (few months later) →
3. `poncho_cheese_emergency` (if enough cheese)

### Building Path
1. `building_offer` (month 17-18) →
2. `building_countdown` (recurring 19-24) →
3. `building_deadline` (month 25) →
4. `building_deadline_extended` (month 26, if needed)

### Employee Path
1. `meet_lucas` (month 27-28) →
2. `lucas_brings_henry` (2+ months later) →
3. `delegation_moment` (after both hired)

### No Building Path
1. Decline/fail building →
2. `second_shop_offer` (month 36-42) →
3. Empire ending OR contentment ending

---

## ACTION ITEMS

To make events fully deterministic:

1. **Review this list** — Mark which events to keep/cut
2. **Assign fixed months** — No more ranges, exact months
3. **Remove random conditions** — No more `Math.random()`
4. **Test the flow** — Play through to check pacing
5. **Document choices** — Note what each choice should feel like

---

## For Future AI Assistants

When implementing deterministic events:

1. Remove all `Math.random()` calls from event conditions
2. Change `monthRange: [X, Y]` to `month: X` (exact)
3. Keep `condition` for player-choice dependencies only
4. Test that mandatory events always fire
5. Verify story beats hit at the right emotional moments

---

*"Every playthrough tells the same story. Choices matter, but the journey is consistent."*
