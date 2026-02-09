# Complete Event Registry — Code + System + Docs

**Purpose:** Single source of truth for every "event" or event-like behaviour in the game: normal pool events, system-triggered events, photo unlocks, and game-over reasons. Use this for timeline planning, AI context, and ensuring no event is missed.

**Sources scanned:** `data/events.js`, `index.html`, `events-map.json`, `notebooklm-events/`, `EVENT_MAP.md`, `EVENT_SCHEMA.md`.

---

## 1. Events in the normal pool (data/events.js → events-map.json)

**106 events** live in `data/events.js` and are reflected in `events-map.json`. These are the only IDs that can be assigned to a month in the 42-month timeline.

| # | event_id | title | type | mandatory | special | implementation_notes |
|---|----------|-------|------|-----------|---------|----------------------|
| 1 | cash_crisis | No More Grace | crisis | no | cash_crisis | **Not chosen from pool.** Triggered only when `gameState.cashCrisisTriggered` (bank 0, supplier grace exhausted). Can recur. |
| 2 | sunday_opening | The Sunday Question | decision | no | — | priority 100, month 1 only |
| 3 | stock_reality | The Inventory | crisis | no | — | priority 95 |
| 4 | shop_name | What's In a Name? | decision | no | — | unique, condition: !shopRenamed |
| 5 | insurance_decision | The Insurance Question | decision | no | — | unique, priority 90 |
| 6 | summer_flood | The Flood | crisis | no | — | unique; **condition includes Math.random() &lt; 0.5** and summer month; only after insurance decision |
| 7 | first_cheese | A Customer's Suggestion | pivot | no | — | unique, priority 95, condition: cheeseTypes === 0 |
| 8 | charcuterie_question | The Charcuterie Question | decision | no | — | unique, condition: cheeseTypes >= 5, !hasCharcuterie |
| 9 | wine_dilemma | The Wine Dilemma | decision | no | — | unique, condition: cheeseTypes >= 20, !hasWineSelection |
| 10 | corporate_opportunity | The Corporate Inquiry | opportunity | no | — | unique, condition (cheese/reputation/corporate) |
| 11 | cheap_fridge | The Barely-Working Fridge | decision | no | — | unique |
| 12 | fine_food_choice | A New Direction | pivot | no | — | unique, condition (concept Hybrid, etc.) |
| 13 | gradual_pivot | The Gradual Transformation | pivot | no | — | |
| 14 | first_christmas | Your First Christmas Season | milestone | **yes** | — | month 6 only |
| 15 | christmas_market | Christmas Market Opportunity | opportunity | **yes** | — | month 18 only |
| 16 | corporate_client | A Corporate Inquiry | opportunity | no | — | |
| 17 | wine_pairing | Wine & Cheese Evenings | opportunity | no | — | |
| 18 | raclette_season | Raclette Season! | opportunity | no | — | recurring, cooldown 12, priority 85 |
| 19 | first_raclette_season | The Raclette Question | decision | no | — | unique, month 16, priority 90 |
| 20 | swiss_invitation | The Swiss Invitation | opportunity | no | — | unique, condition: raclettePathStarted |
| 21 | raclette_kingdom | The Raclette Kingdom | decision | no | — | unique, condition: swissVisitDone, racletteTypes |
| 22 | parmigiano_invitation | The King of Cheeses Calls | milestone | no | — | unique, month 38–42, condition: reputation >= 90 |
| 23 | birthday_party | Your Birthday Approaches | personal | no | — | unique, priority 70 |
| 24 | regular_appreciation | The Regulars' Gift | personal | no | — | unique, condition: reputation >= 70 |
| 25 | competitor_closes | The Competition Closes | opportunity | no | — | unique |
| 26 | apprentice_request | The Apprentice | opportunity | no | — | unique, condition (cheeseTypes, reputation) |
| 27 | food_blogger_visit | The Food Blogger | opportunity | no | — | recurring |
| 28 | reflection_moment | A Moment to Reflect | personal | no | — | unique, condition: bank >= 50000 |
| 29 | newspaper_feature | Local Newspaper Calls | opportunity | no | — | unique |
| 30 | expand_hours | Extended Hours? | decision | no | — | |
| 31 | talk_to_customers | The Listening Tour | opportunity | no | — | unique |
| 32 | christmas_rush | The Christmas Chaos | crisis | **yes** | — | month 30 only |
| 33 | summer_slowdown | Summer Drought | crisis | no | — | recurring, cooldown 12, condition: month === 8 |
| 34 | heat_wave | The Heat Wave | crisis | no | — | recurring, cooldown 12, month 7 or 8 |
| 35 | snow_day | Brussels Under Snow | decision | no | — | unique, condition: winter month |
| 36 | back_to_school | September Rush | decision | no | — | recurring, cooldown 12, month === 9 |
| 37 | supplier_price_hike | The Lalero Letter | crisis | no | — | unique |
| 38 | delivery_disaster | The Interbio No-Show | crisis | no | — | unique |
| 39 | health_inspection | AFSCA Visit | crisis | no | — | unique |
| 40 | competitor_opens | New Competition | crisis | no | — | unique, condition: cheeseTypes >= 15 |
| 41 | fridge_breakdown | The Fridge Dies | crisis | no | — | unique, condition: cheeseTypes >= 10 |
| 42 | producer_visit_lalero | The Lalero Invitation | opportunity | no | — | unique, condition (cheese, autonomy) |
| 43 | cheese_course | The Cheese Certification | opportunity | no | — | unique, condition (cheeseExpertise, autonomy) |
| 44 | bulk_supplier_deal | The Lalero Bulk Offer | opportunity | no | — | unique, condition (cheeseTypes, bank) |
| 45 | staff_training | Training Lucas | decision | no | — | unique, condition: hasLucas, autonomy &lt; 50 |
| 46 | sleep_problems | The 3am Wake-ups | personal | no | — | unique, condition: stress > 50 |
| 47 | relationship_tension | The Talk | personal | no | — | unique, condition: family &lt; 60, stress > 40 |
| 48 | friend_needs_help | An Old Friend | personal | no | — | |
| 49 | bad_review | One Star | crisis | no | — | unique |
| 50 | difficult_customer | The Complainer | crisis | no | — | unique |
| 51 | regular_moves_away | Goodbye, Madame Dubois | personal | no | — | unique |
| 52 | theft_incident | Sticky Fingers | crisis | no | — | unique |
| 53 | signature_cheese | Creating Your Signature | milestone | no | — | unique, priority 80 |
| 54 | shop_philosophy | What Do You Stand For? | decision | no | — | unique, priority 75 |
| 55 | mentor_opportunity | The Old Fromager | opportunity | no | — | unique, priority 85 |
| 56 | neighborhood_collab | The Neighborhood Collective | opportunity | no | — | unique, priority 70 |
| 57 | cookbook_idea | The Recipe Collection | decision | no | — | unique, priority 65 |
| 58 | seasonal_ritual | Creating a Tradition | decision | no | — | unique, priority 70 |
| 59 | lucas_growth | Lucas Has an Idea | decision | no | — | unique, condition: hasLucas, lucasMonthsWorked >= 2 |
| 60 | your_counter_story | The Stories Behind the Counter | decision | no | — | unique, condition: producerVisits >= 1 |
| 61 | expansion_dream | The Second Location | milestone | no | — | unique, condition (bank, reputation, hasHenry) |
| 62 | documentary_approach | The Documentary | opportunity | no | — | unique, priority 75 |
| 63 | charity_choice | Giving Back | decision | no | — | unique, priority 60 |
| 64 | naming_ceremony | The Naming Ceremony | decision | no | — | unique, condition: shopRenamed |
| 65 | special_order | The Impossible Request | opportunity | no | — | unique, priority 72 |
| 66 | sunday_burnout | The Crash | crisis | no | — | **Narrative event only.** Actual burnout is system-triggered (see §2). |
| 67 | stop_sunday | The Sunday Decision | decision | no | — | |
| 68 | meet_lucas | The Neighbor Kid | hiring | **yes** | — | month 27–28 only |
| 69 | lucas_brings_henry | Lucas Has a Friend | hiring | no | — | priority 85 |
| 70 | direct_hire_help | Time to Get Help | hiring | no | — | unique, priority 70 |
| 71 | student_trap | Student Workers | decision | no | — | unique |
| 72 | peak_performance | In The Zone | opportunity | no | — | recurring, cooldown 8, condition (energy high, random) |
| 73 | adopt_dog | The Dog Question | personal | **yes** | — | month 14–16 only |
| 74 | dog_in_shop | Poncho Comes to Work | opportunity | no | — | condition: hasDog |
| 75 | poncho_cheese_emergency | Poncho's Cheese Incident | crisis | no | — | unique, priority 90, condition: hasDog |
| 76 | poncho_anniversary | Poncho's First Year | milestone | **yes** | — | month 26–28, condition: hasDog |
| 77 | building_offer | Madame Malfait Calls | milestone | **yes** | — | month 17–18 only |
| 78 | building_countdown | The Savings Push | milestone | no | — | recurring, condition: buildingOfferReceived, !ownsBuilding |
| 79 | building_deadline | July 2024: The Moment | milestone | **yes** | — | month 25 only. **Choices built in index.html** from locale (choicesCanAfford/choicesCannotAfford). |
| 80 | building_deadline_extended | August 2024: Last Chance | milestone | **yes** | — | month 26 only. **Dynamic choices** like building_deadline. |
| 81 | fancy_sign | The Shop Sign | decision | no | — | |
| 82 | producer_opportunity | Visit the Producers | opportunity | no | — | unique |
| 83 | delegation_moment | Learning to Let Go | personal | no | — | unique, condition: autonomy >= 30 |
| 84 | take_holiday | A Week Off? | personal | no | — | unique |
| 85 | december_rush | The December Rush | opportunity | no | — | |
| 86 | family_dinner | Sunday Dinner | personal | no | — | unique |
| 87 | the_invitation | The Invitation | personal | no | — | unique, priority 80, condition: family >= 40 |
| 88 | hospital_call | The Hospital Call | crisis | no | — | unique, priority 150 |
| 89 | old_friend | The Old Friend | personal | no | — | unique |
| 90 | birthday_forgot | The Birthday You Forgot | crisis | no | — | unique, priority 90 |
| 91 | christmas_day | Christmas Day | personal | **yes** | — | month 42 only (finale) |
| 92 | second_shop_offer | The Call from Rue au Bois | opportunity | no | — | priority 200, condition (no building, etc.) |
| 93 | systems_project | Time to Systematize | strategy | no | — | unique, priority 70 |
| 94 | visibility_push | Building Visibility | strategy | no | — | unique, priority 70 |
| 95 | personal_recharge | Taking Care of Yourself | strategy | no | — | unique, priority 70 |
| 96 | pricing_strategy | The Pricing Question | strategy | no | — | unique, priority 70 |
| 97 | supplier_relationship | Supplier Strategy | strategy | no | — | unique, priority 65 |
| 98 | weekly_rhythm | Finding Your Rhythm | strategy | no | — | unique, priority 65 |
| 99 | learning_investment | Investing in Knowledge | strategy | no | — | unique, priority 60 |
| 100 | shop_atmosphere | The Shop Experience | strategy | no | — | unique, priority 60 |
| 101 | catering_opportunity | Catering Request | opportunity | no | — | |
| 102 | private_tasting | Private Tasting Request | opportunity | no | — | |
| 103 | bulk_order | Restaurant Bulk Order | opportunity | no | — | |
| 104 | market_stall | Weekend Market Opportunity | opportunity | no | — | unique |
| 105 | good_month | An Unexpectedly Good Month | milestone | no | — | recurring |
| 106 | quiet_month | A Quiet Month | routine | no | — | Fallback when pool is empty |

**Full machine-readable list:** `events-map.json` (generated from `data/events.js`). Use that file for id/title/type/monthRange/mandatory/choicesCount.

---

## 2. System-triggered “events” (not in the event pool)

These are **not** in `data/events.js` and **cannot** be assigned in the 42-month CSV. They are triggered by the engine.

| id / name | When it happens | Where in code |
|-----------|------------------|----------------|
| **Burnout** | When `gameState.stress >= 80` and `gameState.monthsPlayed >= 6`. Shown as a popup with a synthetic event `id: 'burnout_popup'`, `special: 'burnout'`. | index.html: advanceMonth → check burnout → show popup; acknowledgeBurnout() then selectNextEvent(). |
| **Burnout #2 / #3** | Same trigger; 2nd and 3rd burnout reduce max energy again. **3rd burnout = game over** (`gameOverReason: 'burnout'`). | index.html: burnoutCount, maxEnergyCap reduction, burnoutRecoveryMonths = 4. |
| **Cash crisis (trigger)** | When bank would go negative and supplier grace periods are exhausted; sets `cashCrisisTriggered` and next month `selectNextEvent()` picks the `cash_crisis` event (from the array). | index.html: advanceMonth financial check; selectNextEvent() checks crisis first. |
| **Game over (suppliers)** | After cash_crisis if player still can’t pay; `gameOverReason: 'suppliers'`. | checkGameOver() |
| **Game over (bankruptcy)** | `gameState.loan > 40000`. | checkGameOver() |
| **Game over (health)** | Energy 0 and other conditions. | checkGameOver() |
| **Game over (relationships)** | Family 0. | checkGameOver() |
| **Game over (completed)** | Month 42 finished successfully. | endGame() |

**Game over reasons** used in code: `completed`, `burnout`, `suppliers`, `bankruptcy`, `health`, `relationships`.

---

## 3. Photo unlock keys (not event IDs)

These strings are used for **photo album unlocks** and polaroid triggers. They are **not** event IDs in the pool. Some match an event id (e.g. `first_christmas`), others are different (e.g. `adopt_poncho` vs event `adopt_dog`).

| key | Triggered by | Notes |
|-----|----------------|--------|
| game_start | Start game | Initial unlock |
| game_end | End game | checkPhotoUnlocks('game_end') |
| adopt_poncho | Flag `hasDog` set (after event **adopt_dog**) | photoMapping in index.html |
| hire_lucas | Flag `hasLucas` set (after event **meet_lucas**) | |
| hire_henry | Flag `hasHenry` set (after event **lucas_brings_henry**) | |
| building_purchased | Flag `ownsBuilding` set | |
| cheese_milestone_50 | When `cheeseTypes >= 50` in applyEffects (any choice that sets cheeseTypes) | |
| birthday_party | Flag `hadBigBirthdayParty` set | |
| september_rush | Flag `septemberRushExperienced` set | |
| first_cheese, first_christmas, summer_flood, wine_pairing, wine_dilemma, producer_visit, swiss_invitation, parmigiano_invitation, poncho_cheese_emergency, christmas_market, poncho_anniversary | Same-named **event id** when that event is played | triggerEventPolaroid(currentEvent.id) |

So: **event_id** in the timeline is always one of the 106 from §1. Photo keys are for the album only.

---

## 4. Implementation quirks (code behaviour to keep in mind)

- **building_deadline / building_deadline_extended:** Choices (text, hint, outcome) are built in index.html from `window.currentLocale.events.building_deadline.choicesCanAfford` / `choicesCannotAfford` (and same for extended). Event object in events.js has `dynamicChoices: true` and `getChoices()`.
- **cash_crisis:** Description is dynamic (locale `dynamicDescription` with amount). Not added to `usedEvents`, so it can appear again.
- **summer_flood:** Condition includes `Math.random() < 0.5` and summer month; only one occurrence per game.
- **Burnout:** There is also a narrative event `sunday_burnout` ("The Crash") in the pool; the **actual** burnout (stress >= 80) is a separate system popup. For timeline, you can assign `sunday_burnout` to a month as a story beat; the real burnout is automatic when conditions are met.
- **Mandatory events:** If conditions are not met (e.g. building_deadline when already owning building), the event is skipped by the selection logic. For a fixed timeline, you still assign the id to that month; the engine can be extended later to force that id when using a timeline file.

---

## 5. Docs vs code

- **notebooklm-events/01-ALL-EVENTS-CURRENT-STATE.md** and **EVENT_MAP.md** list the same 106 events as in `data/events.js` / `events-map.json`. No extra “doc-only” event IDs were found that are missing from the code.
- **EVENT_SCHEMA.md** lists mandatory event IDs and photo/unlock behaviour; consistent with this registry.

---

**Summary for timeline/AI:** Use the **106 event_id** values from §1 (or from `events-map.json`) for the 42-month CSV. Do **not** use: `burnout_popup`, `cash_crisis` as a planned month (it’s trigger-only), or photo keys like `adopt_poncho`/`hire_lucas`. For system behaviour (burnout, game over), refer to §2.
