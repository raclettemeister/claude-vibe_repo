# Chez Julien — Event Conditions & Flags Reference

> Complete mapping of which gameState conditions gate which events, and which flags events set.

---

## All Event Conditions (What Must Be True for Event to Fire)

| Event ID | Condition | Meaning |
|----------|-----------|---------|
| `shop_name` | `!gameState.shopRenamed` | Shop hasn't been renamed yet |
| `insurance_decision` | `!gameState.insuranceDecisionMade` | Insurance not yet decided |
| `summer_flood` | Summer month (6-8), `insuranceDecisionMade`, `!floodHappened`, 50% random | Flood only in summer, once, coin flip |
| `first_cheese` | `cheeseTypes === 0` | No cheese added yet |
| `charcuterie_question` | `cheeseTypes >= 5`, `!hasCharcuterie` | Must have some cheese, no charcuterie yet |
| `wine_dilemma` | `cheeseTypes >= 20`, `!hasWineSelection` | Established cheese, no wine yet |
| `corporate_opportunity` | `cheeseTypes >= 25`, `reputation >= 55`, `!hasCorporateClient` | High reputation + cheese |
| `cheap_fridge` | `cheeseTypes >= 1 && < 15`, `!hasProCounter` | Started cheese but basic setup |
| `fine_food_choice` | `cheeseTypes >= 15`, `concept === 'Hybrid'`, `!fineFoodChoiceMade` | Pivoting from bulk |
| `gradual_pivot` | `cheeseTypes >= 5`, `bulkPercentage > 50` | Still mostly bulk |
| `corporate_client` | `cheeseTypes >= 30`, `reputation >= 55` | Established shop |
| `wine_pairing` | `cheeseTypes >= 40`, `!hasWineEvents` | Large selection, no tastings yet |
| `raclette_season` | `(month >= 11 \|\| month <= 2)`, `cheeseTypes >= 25` | Winter months, good selection |
| `first_raclette_season` | `month === 10`, `cheeseTypes >= 10` | October specifically |
| `swiss_invitation` | `raclettePathStarted`, `racletteTypes >= 5` | On raclette journey |
| `raclette_kingdom` | `swissVisitDone`, `racletteTypes >= 15` | Deep in raclette path |
| `parmigiano_invitation` | `reputation >= 90` | Near-perfect reputation (endgame) |
| `birthday_party` | `monthsPlayed >= 28` | Late game |
| `regular_appreciation` | `reputation >= 70` | Well-known shop |
| `competitor_closes` | `reputation >= 60` | Good reputation |
| `apprentice_request` | `cheeseTypes >= 50`, `reputation >= 65` | Big + respected |
| `food_blogger_visit` | `cheeseTypes >= 40` | Large selection |
| `reflection_moment` | `bank >= 50000` | Financially secure |
| `newspaper_feature` | `cheeseTypes >= 50`, `reputation >= 60` | Big + known |
| `expand_hours` | `!extendedHours`, `(hasLucas \|\| hasHenry)` | Has staff to cover |
| `supplier_price_hike` | `cheeseTypes >= 10` | Into cheese game |
| `competitor_opens` | `cheeseTypes >= 15` | Recognized as cheese shop |
| `fridge_breakdown` | `cheeseTypes >= 10` | Enough cheese to worry about |
| `producer_visit_lalero` | `cheeseTypes >= 10`, `autonomy >= 30` | Can leave the shop |
| `cheese_course` | `cheeseTypes >= 15`, `cheeseExpertise < 30`, `autonomy >= 35` | Room to learn |
| `bulk_supplier_deal` | `cheeseTypes >= 20`, `bank >= 6000` | Enough cash to commit |
| `staff_training` | `hasLucas`, `autonomy < 50` | Lucas hired but not trained |
| `sleep_problems` | `stress > 50` | High stress |
| `relationship_tension` | `family < 60`, `stress > 40` | Strained + stressed |
| `signature_cheese` | `cheeseTypes >= 40`, `producerRelationships >= 10` | Expert + connected |
| `shop_philosophy` | `cheeseTypes >= 20` | Established enough to have identity |
| `mentor_opportunity` | `cheeseTypes >= 15`, `!hasMentor` | Showing promise |
| `neighborhood_collab` | `reputation >= 50` | Known in neighborhood |
| `cookbook_idea` | `cheeseTypes >= 50`, `reputation >= 60` | Large + respected |
| `lucas_growth` | `hasLucas`, `lucasMonthsWorked >= 2` | Lucas settled in |
| `your_counter_story` | `producerVisits >= 1` | Visited at least one producer |
| `expansion_dream` | `bank >= 80000`, `reputation >= 80`, `hasHenry`, `!ownsBuilding` | Very successful |
| `documentary_approach` | `cheeseTypes >= 60`, `reputation >= 75` | Impressive shop |
| `charity_choice` | `cheeseTypes >= 30` | Established |
| `naming_ceremony` | `shopRenamed` | Already picked a name |
| `special_order` | `cheeseExpertise >= 15` or `producerRelationships >= 15` | Expert or connected |
| `sunday_burnout` | `openSunday`, `(energy < 40 \|\| stress > 70)` | Sunday + exhausted |
| `stop_sunday` | `openSunday`, `burnoutCrashed` | After burnout, still open Sunday |
| `meet_lucas` | `!hasLucas`, `!hasHenry` | No staff yet |
| `lucas_brings_henry` | `hasLucas`, `lucasMonthsWorked >= 12`, `!hasHenry` | Lucas been there 1+ year |
| `direct_hire_help` | `!hasLucas`, `!hasHenry`, `!directHireEventSeen`, `stress > 50`, `monthsPlayed >= 24` | Missed Lucas, desperate |
| `adopt_dog` | `!hasDog` | No dog yet |
| `dog_in_shop` | `hasDog`, `dogMonth > 3` | Dog settled in |
| `poncho_cheese_emergency` | `hasDog`, `!ponchoSurgery`, `cheeseTypes >= 20` | Dog + enough cheese |
| `poncho_anniversary` | `hasDog` | Has dog |
| `building_offer` | (none — mandatory) | Always fires |
| `building_countdown` | `buildingOfferReceived`, `!ownsBuilding` | Saving for building |
| `building_deadline` | `buildingOfferReceived`, `!ownsBuilding`, `!buildingDelayPaid` | D-day |
| `building_deadline_extended` | `buildingDelayPaid`, `!ownsBuilding` | Extended deadline |
| `producer_opportunity` | `autonomy >= 20` or `hasLucas` | Can leave shop |
| `delegation_moment` | `hasLucas`, `autonomy < 50` | Has staff but controlling |
| `take_holiday` | `autonomy >= 30` | Enough delegation |
| `december_rush` | `month === 12` | December |
| `the_invitation` | `family >= 40` | Has relationships |
| `birthday_forgot` | `stress >= 50` | Stressed enough to forget |
| `second_shop_offer` | `bank >= 80000`, `!ownsBuilding` | Rich but didn't buy building |
| `pricing_strategy` | `cheeseTypes >= 15` | Established |
| `supplier_relationship` | `cheeseTypes >= 20` | Ordering regularly |
| `learning_investment` | `cheeseTypes >= 25` | Ready to go deeper |
| `peak_performance` | `energy >= (maxEnergyCap * 0.9)`, 50% random | Near max energy |

---

## All Flags Set by Events

| Flag | Set By Event(s) | Used By (Conditions) |
|------|-----------------|---------------------|
| `openSunday` | sunday_opening, sunday_burnout, stop_sunday | sunday_burnout, stop_sunday, december_rush, stress calc |
| `liquidatedStock` | stock_reality | — |
| `fleaMarketDone` | stock_reality | — |
| `shadyGuyContacted` | stock_reality | — |
| `shopRenamed` | shop_name | naming_ceremony |
| `shopName` | shop_name | UI display |
| `insuranceDecisionMade` | insurance_decision | summer_flood |
| `hasComprehensiveInsurance` | insurance_decision | summer_flood |
| `monthlyInsurance` | insurance_decision | financial calc |
| `floodHappened` | summer_flood | summer_flood |
| `cheeseTypes` | first_cheese, various | Many events |
| `hasProCounter` | first_cheese, cheap_fridge | cheap_fridge, cheese growth |
| `hasCharcuterie` | charcuterie_question | — |
| `hasWineSelection` | wine_dilemma | — |
| `hasWineEvents` | wine_pairing, wine_dilemma | wine_pairing |
| `hasCorporateClient` | corporate_opportunity, corporate_client | — |
| `fineFoodChoiceMade` | fine_food_choice | fine_food_choice |
| `firstChristmasDone` | first_christmas | — |
| `didChristmasMarket` | christmas_market | — |
| `raclettePathStarted` | first_raclette_season | raclette_season, swiss_invitation |
| `swissVisitDone` | swiss_invitation | raclette_kingdom |
| `racletteKingdom` | raclette_kingdom | — |
| `parmigianoVisitDone` | parmigiano_invitation | cheese auto-growth cap |
| `hadBigBirthdayParty` | birthday_party | — |
| `extendedHours` | expand_hours | expand_hours |
| `septemberRushExperienced` | back_to_school | — |
| `signInstalled` | naming_ceremony, fancy_sign | fancy_sign |
| `hasNewSign` | naming_ceremony | — |
| `hasSignatureCheese` | signature_cheese | — |
| `shopPhilosophy` | shop_philosophy | — |
| `hasMentor` | mentor_opportunity | mentor_opportunity |
| `inNeighborhoodCollective` | neighborhood_collab | — |
| `hasCookbook` | cookbook_idea | — |
| `lucasSocialMedia` | lucas_growth | — |
| `hasStoryCards` | your_counter_story | — |
| `hasSecondShop` | expansion_dream, second_shop_offer | — |
| `declinedExpansion` | expansion_dream, second_shop_offer | — |
| `hasDocumentary` | documentary_approach | — |
| `foodBankPartner` | charity_choice | — |
| `schoolProgram` | charity_choice | — |
| `burnoutCrashed` | sunday_burnout, stress crash | stop_sunday |
| `hasLucas` | meet_lucas, direct_hire_help | Many events |
| `hasHenry` | lucas_brings_henry, direct_hire_help | Many events |
| `directHireEventSeen` | direct_hire_help | direct_hire_help |
| `studentHired` | student_trap | — |
| `hasDog` | adopt_dog | Many dog events |
| `dogBreed` | adopt_dog | — |
| `ponchoSurgery` | poncho_cheese_emergency | poncho_cheese_emergency |
| `ponchoAnniversary` | poncho_anniversary | — |
| `buildingOfferReceived` | building_offer | building_countdown, deadline |
| `ownsBuilding` | building_deadline, building_deadline_extended | Many |
| `buildingDelayPaid` | building_deadline | building_deadline_extended |
| `buildingPenaltyOwed` | building_deadline | — |
| `hasBeaufortSeason` | seasonal_ritual | — |
| `hasFromageVendanges` | seasonal_ritual | — |
| `hasCheeseSchool` | seasonal_ritual | — |
| `skippedWedding` | the_invitation | — |
| `workedChristmas` | christmas_day | — |

---

## Key gameState Variables Used by Conditions

| Variable | Starting Value | How It Changes |
|----------|---------------|----------------|
| `cheeseTypes` | 0 | Events + auto-growth (2-4/month) |
| `reputation` | 50 | Events, choices |
| `autonomy` | 20 | Events, staff, delegation |
| `stress` | 20 | Monthly mechanics, events |
| `energy` | 80 | Monthly mechanics, events |
| `family` | 70 | Monthly drain, events |
| `bank` | 12000 | Financial calculations, events |
| `month` | 7 (July) | Cycles 1-12 |
| `monthsPlayed` | 0 | Increments each turn |
| `maxEnergyCap` | 100 | Reduced by 20 per burnout |
| `burnoutCount` | 0 | 3 = game over |
| `producerRelationships` | 0 | Events (visits, suppliers) |
| `producerVisits` | 0 | Events |
| `cheeseExpertise` | 0 | Events (courses, mentorship) |
| `supplierDiscount` | 0 | Events |
| `racletteTypes` | 0 | Events (raclette path) |
| `lucasMonthsWorked` | 0 | Increments when hasLucas |
| `buildingCost` | 80000 | Fixed |
