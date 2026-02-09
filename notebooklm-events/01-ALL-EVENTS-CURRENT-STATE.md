# Chez Julien — All Events Map

> Extracted 106 events — for review and planning changes

## Summary Table

| # | ID | Title | Type | Months | Mand. | Unique | Prior. | Choices |
|---|-----|-------|------|--------|-------|--------|--------|---------|
| 1 | `cash_crisis` | No More Grace | crisis | [1, 42] |  |  |  | 3 |
| 2 | `sunday_opening` | The Sunday Question | decision | [1, 1] |  | ✓ | 100 | 2 |
| 3 | `stock_reality` | The Inventory | crisis | [1, 2] |  |  | 95 | 3 |
| 4 | `shop_name` | What's In a Name? | decision | [3, 12] |  | ✓ |  | 3 |
| 5 | `insurance_decision` | The Insurance Question | decision | [2, 4] |  | ✓ | 90 | 2 |
| 6 | `summer_flood` | The Flood | crisis | [13, 37] |  | ✓ | 95 | 0 |
| 7 | `first_cheese` | A Customer's Suggestion | pivot | [2, 4] |  | ✓ | 95 | 3 |
| 8 | `charcuterie_question` | The Charcuterie Question | decision | [6, 38] |  | ✓ | 65 | 3 |
| 9 | `wine_dilemma` | The Wine Dilemma | decision | [10, 38] |  | ✓ | 65 | 3 |
| 10 | `corporate_opportunity` | The Corporate Inquiry | opportunity | [12, 35] |  | ✓ |  | 3 |
| 11 | `cheap_fridge` | The Barely-Working Fridge | decision | [4, 10] |  | ✓ |  | 2 |
| 12 | `fine_food_choice` | A New Direction | pivot | [8, 20] |  | ✓ |  | 2 |
| 13 | `gradual_pivot` | The Gradual Transformation | pivot | [6, 15] |  |  |  | 2 |
| 14 | `first_christmas` | Your First Christmas Season | milestone | [6, 6] | ✓ | ✓ |  | 3 |
| 15 | `christmas_market` | Christmas Market Opportunity | opportunity | [18, 18] | ✓ | ✓ |  | 2 |
| 16 | `corporate_client` | A Corporate Inquiry | opportunity | [8, 35] |  |  |  | 2 |
| 17 | `wine_pairing` | Wine & Cheese Evenings | opportunity | [10, 38] |  |  |  | 2 |
| 18 | `raclette_season` | Raclette Season! | opportunity | [17, 20] |  |  | 85 | 2 |
| 19 | `first_raclette_season` | The Raclette Question | decision | [16, 16] |  | ✓ | 90 | 3 |
| 20 | `swiss_invitation` | The Swiss Invitation | opportunity | [16, 32] |  | ✓ | 85 | 2 |
| 21 | `raclette_kingdom` | The Raclette Kingdom | decision | [24, 40] |  | ✓ | 88 | 2 |
| 22 | `parmigiano_invitation` | The King of Cheeses Calls | milestone | [38, 42] |  | ✓ | 95 | 2 |
| 23 | `birthday_party` | Your Birthday Approaches | personal | [28, 42] |  | ✓ | 70 | 2 |
| 24 | `regular_appreciation` | The Regulars' Gift | personal | [30, 42] |  | ✓ | 60 | 2 |
| 25 | `competitor_closes` | The Competition Closes | opportunity | [25, 42] |  | ✓ | 55 | 2 |
| 26 | `apprentice_request` | The Apprentice | opportunity | [28, 42] |  | ✓ | 60 | 2 |
| 27 | `food_blogger_visit` | The Food Blogger | opportunity | [20, 42] |  |  |  | 2 |
| 28 | `reflection_moment` | A Moment to Reflect | personal | [35, 42] |  | ✓ | 50 | 2 |
| 29 | `newspaper_feature` | Local Newspaper Calls | opportunity | [12, 36] |  | ✓ |  | 2 |
| 30 | `expand_hours` | Extended Hours? | decision | [6, 30] |  |  |  | 2 |
| 31 | `talk_to_customers` | The Listening Tour | opportunity | [4, 20] |  | ✓ |  | 2 |
| 32 | `christmas_rush` | The Christmas Chaos | crisis | [30, 30] | ✓ | ✓ |  | 2 |
| 33 | `summer_slowdown` | Summer Drought | crisis | [13, 14] |  |  | 85 | 3 |
| 34 | `heat_wave` | The Heat Wave | crisis | [12, 13] |  |  | 80 | 3 |
| 35 | `snow_day` | Brussels Under Snow | decision | [5, 7] |  | ✓ | 85 | 2 |
| 36 | `back_to_school` | September Rush | decision | [14, 15] |  |  | 85 | 2 |
| 37 | `supplier_price_hike` | The Lalero Letter | crisis | [8, 36] |  | ✓ |  | 3 |
| 38 | `delivery_disaster` | The Interbio No-Show | crisis | [3, 40] |  | ✓ |  | 2 |
| 39 | `health_inspection` | AFSCA Visit | crisis | [5, 40] |  | ✓ |  | 2 |
| 40 | `competitor_opens` | New Competition | crisis | [12, 30] |  | ✓ |  | 3 |
| 41 | `fridge_breakdown` | The Fridge Dies | crisis | [8, 38] |  | ✓ |  | 2 |
| 42 | `producer_visit_lalero` | The Lalero Invitation | opportunity | [8, 30] |  | ✓ |  | 3 |
| 43 | `cheese_course` | The Cheese Certification | opportunity | [10, 28] |  | ✓ |  | 2 |
| 44 | `bulk_supplier_deal` | The Lalero Bulk Offer | opportunity | [12, 36] |  | ✓ |  | 3 |
| 45 | `staff_training` | Training Lucas | decision | [8, 35] |  | ✓ |  | 2 |
| 46 | `sleep_problems` | The 3am Wake-ups | personal | [6, 40] |  | ✓ |  | 3 |
| 47 | `relationship_tension` | The Talk | personal | [8, 35] |  | ✓ |  | 3 |
| 48 | `friend_needs_help` | An Old Friend | personal | [10, 38] |  |  |  | 2 |
| 49 | `bad_review` | One Star | crisis | [5, 40] |  | ✓ |  | 3 |
| 50 | `difficult_customer` | The Complainer | crisis | [3, 40] |  | ✓ |  | 3 |
| 51 | `regular_moves_away` | Goodbye, Madame Dubois | personal | [15, 40] |  | ✓ |  | 2 |
| 52 | `theft_incident` | Sticky Fingers | crisis | [8, 40] |  | ✓ |  | 3 |
| 53 | `signature_cheese` | Creating Your Signature | milestone | [18, 35] |  | ✓ | 80 | 2 |
| 54 | `shop_philosophy` | What Do You Stand For? | decision | [12, 25] |  | ✓ | 75 | 3 |
| 55 | `mentor_opportunity` | The Old Fromager | opportunity | [10, 28] |  | ✓ | 85 | 2 |
| 56 | `neighborhood_collab` | The Neighborhood Collective | opportunity | [14, 30] |  | ✓ | 70 | 2 |
| 57 | `cookbook_idea` | The Recipe Collection | decision | [20, 38] |  | ✓ | 65 | 2 |
| 58 | `seasonal_ritual` | Creating a Tradition | decision | [8, 20] |  | ✓ | 70 | 3 |
| 59 | `lucas_growth` | Lucas Has an Idea | decision | [28, 40] |  | ✓ | 75 | 2 |
| 60 | `your_counter_story` | The Stories Behind the Counter | decision | [15, 35] |  | ✓ | 68 | 2 |
| 61 | `expansion_dream` | The Second Location | milestone | [28, 40] |  | ✓ | 90 | 2 |
| 62 | `documentary_approach` | The Documentary | opportunity | [24, 40] |  | ✓ | 75 | 2 |
| 63 | `charity_choice` | Giving Back | decision | [10, 35] |  | ✓ | 60 | 3 |
| 64 | `naming_ceremony` | The Naming Ceremony | decision | [6, 15] |  | ✓ | 65 | 2 |
| 65 | `special_order` | The Impossible Request | opportunity | [15, 38] |  | ✓ | 72 | 2 |
| 66 | `sunday_burnout` | The Crash | crisis | [10, 18] |  |  |  | 2 |
| 67 | `stop_sunday` | The Sunday Decision | decision | [12, 25] |  |  |  | 2 |
| 68 | `meet_lucas` | The Neighbor Kid | hiring | [27, 28] | ✓ | ✓ |  | 3 |
| 69 | `lucas_brings_henry` | Lucas Has a Friend | hiring | [28, 42] |  |  | 85 | 2 |
| 70 | `direct_hire_help` | Time to Get Help | hiring | [26, 40] |  | ✓ | 70 | 3 |
| 71 | `student_trap` | Student Workers | decision | [5, 30] |  | ✓ |  | 2 |
| 72 | `peak_performance` | In The Zone | opportunity | [13, 42] |  |  | 80 | 4 |
| 73 | `adopt_dog` | The Dog Question | personal | [14, 16] | ✓ | ✓ |  | 2 |
| 74 | `dog_in_shop` | Poncho Comes to Work | opportunity | [16, 35] |  |  |  | 2 |
| 75 | `poncho_cheese_emergency` | Poncho's Cheese Incident | crisis | [18, 36] |  | ✓ | 90 | 2 |
| 76 | `poncho_anniversary` | Poncho's First Year | milestone | [27, 27] | ✓ | ✓ |  | 1 |
| 77 | `building_offer` | Madame Malfait Calls | milestone | [17, 18] | ✓ | ✓ |  | 3 |
| 78 | `building_countdown` | The Savings Push | milestone | [19, 24] |  |  |  | 2 |
| 79 | `building_deadline` | July 2024: The Moment | milestone | [25, 25] | ✓ | ✓ |  | 0 |
| 80 | `building_deadline_extended` | August 2024: Last Chance | milestone | [26, 26] | ✓ | ✓ |  | 0 |
| 81 | `fancy_sign` | The Shop Sign | decision | [8, 30] |  |  |  | 2 |
| 82 | `producer_opportunity` | Visit the Producers | opportunity | [10, 40] |  | ✓ |  | 3 |
| 83 | `delegation_moment` | Learning to Let Go | personal | [28, 40] |  |  |  | 2 |
| 84 | `take_holiday` | A Week Off? | personal | [20, 40] |  | ✓ |  | 3 |
| 85 | `december_rush` | The December Rush | opportunity | [6, 42] |  |  |  | 2 |
| 86 | `family_dinner` | Sunday Dinner | personal | [1, 42] |  | ✓ |  | 2 |
| 87 | `the_invitation` | The Invitation | personal | [8, 18] |  | ✓ | 80 | 3 |
| 88 | `hospital_call` | The Hospital Call | crisis | [17, 18] |  | ✓ | 150 | 3 |
| 89 | `old_friend` | The Old Friend | personal | [6, 30] |  | ✓ |  | 3 |
| 90 | `birthday_forgot` | The Birthday You Forgot | crisis | [12, 36] |  | ✓ | 90 | 2 |
| 91 | `christmas_day` | Christmas Day | personal | [42, 42] | ✓ | ✓ |  | 3 |
| 92 | `second_shop_offer` | The Call from Rue au Bois | opportunity | [36, 42] |  | ✓ | 200 | 2 |
| 93 | `systems_project` | Time to Systematize | strategy | [8, 25] |  | ✓ | 70 | 3 |
| 94 | `visibility_push` | Building Visibility | strategy | [6, 20] |  | ✓ | 70 | 3 |
| 95 | `personal_recharge` | Taking Care of Yourself | strategy | [10, 28] |  | ✓ | 70 | 3 |
| 96 | `pricing_strategy` | The Pricing Question | strategy | [12, 30] |  | ✓ | 70 | 3 |
| 97 | `supplier_relationship` | Supplier Strategy | strategy | [14, 32] |  | ✓ | 65 | 3 |
| 98 | `weekly_rhythm` | Finding Your Rhythm | strategy | [10, 26] |  | ✓ | 65 | 3 |
| 99 | `learning_investment` | Investing in Knowledge | strategy | [18, 36] |  | ✓ | 60 | 3 |
| 100 | `shop_atmosphere` | The Shop Experience | strategy | [8, 24] |  | ✓ | 60 | 3 |
| 101 | `catering_opportunity` | Catering Request | opportunity | [8, 36] |  |  |  | 3 |
| 102 | `private_tasting` | Private Tasting Request | opportunity | [6, 42] |  |  |  | 3 |
| 103 | `bulk_order` | Restaurant Bulk Order | opportunity | [10, 38] |  |  |  | 3 |
| 104 | `market_stall` | Weekend Market Opportunity | opportunity | [6, 30] |  | ✓ |  | 3 |
| 105 | `good_month` | An Unexpectedly Good Month | milestone | [8, 40] |  |  |  | 3 |
| 106 | `quiet_month` | A Quiet Month | routine | [1, 42] |  |  |  | 2 |

## Full Event Details

### 1. No More Grace (`cash_crisis`)

- **Type:** crisis | **Month range:** [1, 42]
- **Special:** cash_crisis
- **Description:** (dynamic)
- **Choices:**
  1. "Take a bank loan" action: take_loan
  2. "Sell equipment at a loss" effects: {"reputation":-5} action: sell_equipment
  3. "Ask family for help" effects: {"family":-15} action: family_help

### 2. The Sunday Question (`sunday_opening`)

- **Type:** decision | **Month range:** [1, 1]
- **Unique**
- **Priority:** 100
- **Description:** Day one. The previous owner was closed Sundays. But you see other shops open. Th...
- **Choices:**
  1. "Open on Sundays" effects: {"stress":10,"energy":-5} flags: [openSunday]
  2. "Stay closed on Sundays" effects: {"stress":-5,"family":5,"energy":5} flags: [openSunday]

### 3. The Inventory (`stock_reality`)

- **Type:** crisis | **Month range:** [1, 2]
- **Priority:** 95
- **Description:** Two weeks in, you finally finish counting everything. The €38,000 in stock on pa...
- **Choices:**
  1. "Progressive liquidation - flea markets, deep discounts" effects: {"stress":15,"energy":-15} flags: [liquidatedStock, fleaMarketDone]
  2. "Find a "guy" to take the bulk stuff" effects: {"bank":1500,"stress":5,"energy":-5} flags: [shadyGuyContacted, liquidatedStock]
  3. "Keep trying to sell it normally" effects: {"stress":25,"bank":-1000}

### 4. What's In a Name? (`shop_name`)

- **Type:** decision | **Month range:** [3, 12]
- **Unique**
- **Description:** The shop came with a generic name. But customers have started calling it differe...
- **Choices:**
  1. ""Chez Julien" - embrace what customers already call it" effects: {"stress":-5} flags: [shopRenamed, shopName]
  2. ""Alix Corner" - modern and trendy" effects: {"bank":-200} flags: [shopRenamed, shopName]
  3. "Keep the current name" flags: [shopRenamed]

### 5. The Insurance Question (`insurance_decision`)

- **Type:** decision | **Month range:** [2, 4]
- **Unique**
- **Priority:** 90
- **Description:** Your accountant sends you the annual insurance renewal. "Shop insurance covers f...
- **Choices:**
  1. "Get comprehensive coverage (€1,800/year)" effects: {"bank":-1800,"stress":-5} flags: [insuranceDecisionMade, hasComprehensiveInsurance, monthlyInsurance]
  2. "Basic coverage only" effects: {"stress":5} flags: [insuranceDecisionMade, hasComprehensiveInsurance]

### 6. The Flood (`summer_flood`)

- **Type:** crisis | **Month range:** [13, 37]
- **Unique**
- **Priority:** 95
- **Dynamic choices**
- **Description:** (dynamic)
- **Choices:**

### 7. A Customer's Suggestion (`first_cheese`)

- **Type:** pivot | **Month range:** [2, 4]
- **Unique**
- **Priority:** 95
- **Description:** A regular customer, Madame Dubois, sighs looking at your bulk bins. "What this n...
- **Choices:**
  1. "Start with ONE cheese - Tomme Larzac" effects: {"bank":-300,"energy":-10} flags: [cheeseTypes]
  2. "Go big - state of the art counter" effects: {"bank":-5000,"stress":20,"energy":-15} flags: [cheeseTypes, hasProCounter]
  3. "Stick to the bulk concept" effects: {"stress":10}

### 8. The Charcuterie Question (`charcuterie_question`)

- **Type:** decision | **Month range:** [6, 38]
- **Unique**
- **Priority:** 65
- **Description:** A customer lingers at the cheese counter. "Do you have any charcuterie? A nice s...
- **Choices:**
  1. "Add Belgian charcuterie (Coprosain)" effects: {"bank":-1500,"stress":10} flags: [hasCharcuterie]
  2. "Add Italian imports (premium)" effects: {"bank":-3000,"stress":15} flags: [hasCharcuterie]
  3. "Stay focused on cheese" effects: {"stress":-5}

### 9. The Wine Dilemma (`wine_dilemma`)

- **Type:** decision | **Month range:** [10, 38]
- **Unique**
- **Priority:** 65
- **Description:** "What wine goes with this cheese?" You get asked this daily. The wine shop on Ru...
- **Choices:**
  1. "Curated selection (15 bottles)" effects: {"bank":-2000,"stress":5} flags: [hasWineSelection]
  2. "Serious wine section" effects: {"bank":-8000,"stress":20,"energy":-15} flags: [hasWineSelection, hasWineEvents]
  3. "Partner with the wine shop" effects: {"stress":-5}

### 10. The Corporate Inquiry (`corporate_opportunity`)

- **Type:** opportunity | **Month range:** [12, 35]
- **Unique**
- **Description:** An email from a law firm downtown: "We're looking for a caterer for our weekly p...
- **Choices:**
  1. "Accept - reliable recurring revenue" effects: {"stress":15,"energy":-10} flags: [hasCorporateClient]
  2. "Negotiate better terms" effects: {"stress":10}
  3. "Decline politely" effects: {"stress":-10}

### 11. The Barely-Working Fridge (`cheap_fridge`)

- **Type:** decision | **Month range:** [4, 10]
- **Unique**
- **Description:** You found a used cheese display counter for €800. It's ugly. The compressor soun...
- **Choices:**
  1. "Buy the cheap ugly one (€800)" effects: {"bank":-800,"stress":5}
  2. "Finance a proper counter (€50,000)" effects: {"bank":-2000,"stress":20} flags: [monthlyPayment, hasProCounter]

### 12. A New Direction (`fine_food_choice`)

- **Type:** pivot | **Month range:** [8, 20]
- **Unique**
- **Description:** Looking at the shop, you realize it's becoming something different. The bulk bin...
- **Choices:**
  1. "Embrace fine food - this is who we are now" effects: {"stress":10,"reputation":6} flags: [fineFoodChoiceMade] action: set_fine_food
  2. "Stay hybrid - keep options open" effects: {"stress":5} flags: [fineFoodChoiceMade]

### 13. The Gradual Transformation (`gradual_pivot`)

- **Type:** pivot | **Month range:** [6, 15]
- **Description:** You've been slowly replacing bulk bins with cheese, charcuterie, local products....
- **Choices:**
  1. "Continue the slow pivot" effects: {"stress":10,"energy":-5}
  2. "Accelerate - transform faster" effects: {"bank":-2000,"stress":25,"energy":-15}

### 14. Your First Christmas Season (`first_christmas`)

- **Type:** milestone | **Month range:** [6, 6]
- **Mandatory**
- **Unique**
- **Description:** December arrives. Your first December as a shop owner. Other fromageries seem to...
- **Choices:**
  1. "Keep it simple - focus on quality" effects: {"stress":5,"bank":1500} flags: [firstChristmasDone]
  2. "Push hard - fake it till you make it" effects: {"stress":20,"energy":-15,"bank":3000} flags: [firstChristmasDone]
  3. "Ask other shop owners for advice" effects: {"stress":-5,"reputation":5} flags: [firstChristmasDone]

### 15. Christmas Market Opportunity (`christmas_market`)

- **Type:** opportunity | **Month range:** [18, 18]
- **Mandatory**
- **Unique**
- **Description:** The commune is organizing a Christmas market at Place Dumont. They're offering y...
- **Choices:**
  1. "Take the stand" effects: {"energy":-20,"stress":15} flags: [didChristmasMarket]
  2. "Focus on the shop" effects: {"stress":-5}

### 16. A Corporate Inquiry (`corporate_client`)

- **Type:** opportunity | **Month range:** [8, 35]
- **Description:** An architecture firm down the street wants monthly plateaux for their Friday apé...
- **Choices:**
  1. "Take the contract" effects: {"stress":10,"energy":-10} flags: [hasCorporateClient]
  2. "Stay focused on retail" effects: {"stress":-5}

### 17. Wine & Cheese Evenings (`wine_pairing`)

- **Type:** opportunity | **Month range:** [10, 38]
- **Description:** A local sommelier proposes hosting wine and cheese tasting evenings in your shop...
- **Choices:**
  1. "Start the wine evenings" effects: {"energy":-10,"stress":5} flags: [hasWineEvents]
  2. "Too much to organize"

### 18. Raclette Season! (`raclette_season`)

- **Type:** opportunity | **Month range:** [17, 20]
- **Priority:** 85
- **Description:** (dynamic)
- **Choices:**
  1. "Go all-in on raclette" effects: {"bank":-3000,"stress":10}
  2. "Normal winter stock"

### 19. The Raclette Question (`first_raclette_season`)

- **Type:** decision | **Month range:** [16, 16]
- **Unique**
- **Priority:** 90
- **Description:** October. Your second autumn in the shop. The temperature drops. Customers start ...
- **Choices:**
  1. "Go all-in for raclette season" effects: {"bank":-2000,"stress":10} flags: [raclettePathStarted]
  2. "Stock a few classics" effects: {"bank":-500}
  3. "Focus on other cheeses"

### 20. The Swiss Invitation (`swiss_invitation`)

- **Type:** opportunity | **Month range:** [16, 32]
- **Unique**
- **Priority:** 85
- **Description:** An email from Valais, Switzerland. A raclette producer you've been ordering from...
- **Choices:**
  1. "Go to Switzerland" effects: {"bank":-4000,"energy":-20,"family":10} flags: [swissVisitDone]
  2. "Can't afford it right now" effects: {"stress":5}

### 21. The Raclette Kingdom (`raclette_kingdom`)

- **Type:** decision | **Month range:** [24, 40]
- **Unique**
- **Priority:** 88
- **Description:** You've built something special. Customers come from across Brussels for your rac...
- **Choices:**
  1. "Build the Raclette Kingdom" effects: {"bank":-3000,"stress":15} flags: [racletteKingdom]
  2. "Stay balanced"

### 22. The King of Cheeses Calls (`parmigiano_invitation`)

- **Type:** milestone | **Month range:** [38, 42]
- **Unique**
- **Priority:** 95
- **Description:** An email arrives from Emilia-Romagna, Italy. A consortium of Parmigiano Reggiano...
- **Choices:**
  1. "Go to Emilia-Romagna" effects: {"bank":-6000,"stress":-25,"energy":20,"family":15} flags: [parmigianoVisitDone]
  2. "I can't justify €6,000" effects: {"stress":10}

### 23. Your Birthday Approaches (`birthday_party`)

- **Type:** personal | **Month range:** [28, 42]
- **Unique**
- **Priority:** 70
- **Description:** Your birthday is coming up. Your partner has been hinting. "We should do somethi...
- **Choices:**
  1. "Throw the big party at the shop" effects: {"bank":-4500,"stress":30,"energy":-25} flags: [hadBigBirthdayParty]
  2. "Keep it small—dinner with loved ones" effects: {"bank":-1200,"stress":-5}

### 24. The Regulars' Gift (`regular_appreciation`)

- **Type:** personal | **Month range:** [30, 42]
- **Unique**
- **Priority:** 60
- **Description:** A group of your most loyal customers shows up with a wrapped package. "Three yea...
- **Choices:**
  1. "Display it proudly in the shop" effects: {"stress":-15}
  2. "Keep it at home, use it for family dinners" effects: {"stress":-10}

### 25. The Competition Closes (`competitor_closes`)

- **Type:** opportunity | **Month range:** [25, 42]
- **Unique**
- **Priority:** 55
- **Description:** You hear the news: the cheese shop on Avenue Louise is closing. They couldn't ma...
- **Choices:**
  1. "Reach out to their suppliers" effects: {"stress":10,"energy":-5}
  2. "Just let the customers find you naturally"

### 26. The Apprentice (`apprentice_request`)

- **Type:** opportunity | **Month range:** [28, 42]
- **Unique**
- **Priority:** 60
- **Description:** A culinary school student emails you. They want to do a stage—an apprenticeship—...
- **Choices:**
  1. "Take them on for a month" effects: {"stress":15,"energy":-10}
  2. "Decline politely" effects: {"stress":-5}

### 27. The Food Blogger (`food_blogger_visit`)

- **Type:** opportunity | **Month range:** [20, 42]
- **Description:** Someone's been taking a lot of photos in the shop. You recognize her from Instag...
- **Choices:**
  1. "Give her the full tour and interview" effects: {"stress":10,"energy":-5}
  2. "Politely decline the spotlight"

### 28. A Moment to Reflect (`reflection_moment`)

- **Type:** personal | **Month range:** [35, 42]
- **Unique**
- **Priority:** 50
- **Description:** It's a quiet Tuesday afternoon. The shop is empty for once. You look around—at t...
- **Choices:**
  1. "Take stock and feel proud" effects: {"stress":-20,"energy":10}
  2. "Start planning the next chapter" effects: {"stress":5}

### 29. Local Newspaper Calls (`newspaper_feature`)

- **Type:** opportunity | **Month range:** [12, 36]
- **Unique**
- **Description:** A journalist from the local paper wants to write a feature about your shop. "The...
- **Choices:**
  1. "Welcome the journalist" effects: {"stress":10,"energy":-5}
  2. "Prefer to stay under the radar"

### 30. Extended Hours? (`expand_hours`)

- **Type:** decision | **Month range:** [6, 30]
- **Description:** Customers keep asking if you could stay open later. "I get off work at 6, you cl...
- **Choices:**
  1. "Extend to 7:30pm" effects: {"stress":10,"energy":-10} flags: [extendedHours]
  2. "Keep current hours" effects: {"family":5}

### 31. The Listening Tour (`talk_to_customers`)

- **Type:** opportunity | **Month range:** [4, 20]
- **Unique**
- **Description:** You've noticed something: the more you chat with customers, the more you underst...
- **Choices:**
  1. "Invest time in conversations" effects: {"energy":-10,"stress":5}
  2. "Keep service efficient" effects: {"stress":10}

### 32. The Christmas Chaos (`christmas_rush`)

- **Type:** crisis | **Month range:** [30, 30]
- **Mandatory**
- **Unique**
- **Description:** December hits like a truck. Raclette, Comté, Beaufort d'été—everyone wants chees...
- **Choices:**
  1. "Push through - this is your moment" effects: {"stress":25,"energy":-25,"bank":5000}
  2. "Set boundaries - close on time, limit orders" effects: {"stress":10,"energy":-10,"bank":2000}

### 33. Summer Drought (`summer_slowdown`)

- **Type:** crisis | **Month range:** [13, 14]
- **Priority:** 85
- **Description:** August. Brussels empties. Your regulars are at the coast. The Melon Charentais b...
- **Choices:**
  1. "Discount the cheese to move stock" effects: {"stress":15,"bank":-1500}
  2. "Hold prices, weather the storm" effects: {"stress":20,"bank":-500}
  3. "Take a week off - embrace it" effects: {"stress":-15,"energy":20,"family":15,"bank":-4500}

### 34. The Heat Wave (`heat_wave`)

- **Type:** crisis | **Month range:** [12, 13]
- **Priority:** 80
- **Description:** July. 38°C outside. The cheese display fridge is struggling. The AC can barely k...
- **Choices:**
  1. "Emergency ice and coolers" effects: {"bank":-400,"stress":20,"energy":-15}
  2. "Push summer products hard" effects: {"stress":10,"energy":-10}
  3. "Close early during the worst days" effects: {"bank":-800,"stress":-5}

### 35. Brussels Under Snow (`snow_day`)

- **Type:** decision | **Month range:** [5, 7]
- **Unique**
- **Priority:** 85
- **Description:** You wake up to 20cm of snow. Brussels is paralyzed. The tram isn't running. Cars...
- **Choices:**
  1. "Open anyway - be the hero" effects: {"stress":15,"energy":-20}
  2. "Stay closed - it's not worth it" effects: {"stress":-10,"family":10,"bank":-1800}

### 36. September Rush (`back_to_school`)

- **Type:** decision | **Month range:** [14, 15]
- **Priority:** 85
- **Description:** School's back. Everyone's returning from holidays. Suddenly they need everything...
- **Choices:**
  1. "Embrace the chaos" effects: {"stress":15,"energy":-15,"bank":3000} flags: [septemberRushExperienced]
  2. "Ease back in gradually" effects: {"stress":5,"bank":1500}

### 37. The Lalero Letter (`supplier_price_hike`)

- **Type:** crisis | **Month range:** [8, 36]
- **Unique**
- **Description:** Email from Lalero, your main cheese supplier: "Cher Julien, suite aux conditions...
- **Choices:**
  1. "Raise your prices to match" effects: {"stress":10}
  2. "Absorb the cost temporarily" effects: {"stress":5,"bank":-1200}
  3. "Negotiate - threaten to switch suppliers" effects: {"stress":15}

### 38. The Interbio No-Show (`delivery_disaster`)

- **Type:** crisis | **Month range:** [3, 40]
- **Unique**
- **Description:** Thursday morning. Your Interbio delivery hasn't arrived. You check email—their t...
- **Choices:**
  1. "Rush to the Marché Dumont" effects: {"stress":20,"energy":-15,"bank":-200}
  2. "Make do with what you have" effects: {"stress":15,"energy":-5}

### 39. AFSCA Visit (`health_inspection`)

- **Type:** crisis | **Month range:** [5, 40]
- **Unique**
- **Description:** Two inspectors from AFSCA walk in unannounced. Clipboards. Thermometers. Questio...
- **Choices:**
  1. "Stay calm, show them everything" effects: {"stress":5}
  2. "Panic internally but act professional" effects: {"stress":15,"energy":-10}

### 40. New Competition (`competitor_opens`)

- **Type:** crisis | **Month range:** [12, 30]
- **Unique**
- **Description:** A new "artisan fromagerie" opens three streets away. Slick branding. Instagram p...
- **Choices:**
  1. "Double down on what makes you different" effects: {"stress":15,"energy":-10}
  2. "Visit them, learn from them" effects: {"stress":10}
  3. "Ignore them and focus on your work" effects: {"stress":20}

### 41. The Fridge Dies (`fridge_breakdown`)

- **Type:** crisis | **Month range:** [8, 38]
- **Unique**
- **Description:** The main display fridge starts making a horrible noise. Then stops. The temperat...
- **Choices:**
  1. "Emergency repair - pay whatever it takes" effects: {"stress":25,"bank":-1200}
  2. "Move everything to the backup fridge" effects: {"stress":20,"energy":-20}

### 42. The Lalero Invitation (`producer_visit_lalero`)

- **Type:** opportunity | **Month range:** [8, 30]
- **Unique**
- **Description:** Email from Lalero: "Cher Julien, we're inviting our best clients to visit our ca...
- **Choices:**
  1. "Go - close the shop for 2 days" effects: {"bank":-2000,"stress":15,"energy":-10} flags: [producerVisits]
  2. "Send Henry (if available)" effects: {"stress":5}
  3. "Decline - can't leave the shop" effects: {"stress":5}

### 43. The Cheese Certification (`cheese_course`)

- **Type:** opportunity | **Month range:** [10, 28]
- **Unique**
- **Description:** A prestigious 3-day cheese certification course in Lyon. €1,200 plus travel. The...
- **Choices:**
  1. "Take the course" effects: {"bank":-1500,"stress":10}
  2. "Learn from YouTube instead" effects: {"stress":-5}

### 44. The Lalero Bulk Offer (`bulk_supplier_deal`)

- **Type:** opportunity | **Month range:** [12, 36]
- **Unique**
- **Description:** Lalero offers 20% off if you commit to 3 months of orders upfront. That's €4,000...
- **Choices:**
  1. "Take the deal - €4,000 upfront" effects: {"bank":-4000,"stress":5}
  2. "Negotiate payment terms" effects: {"stress":10}
  3. "Keep flexibility"

### 45. Training Lucas (`staff_training`)

- **Type:** decision | **Month range:** [8, 35]
- **Unique**
- **Description:** Lucas is eager but clumsy with customers. You could spend a week really training...
- **Choices:**
  1. "Invest a week in training" effects: {"energy":-20,"stress":10}
  2. "Let him learn on the job" effects: {"stress":5}

### 46. The 3am Wake-ups (`sleep_problems`)

- **Type:** personal | **Month range:** [6, 40]
- **Unique**
- **Description:** For the past two weeks, you've been waking up at 3am. Mind racing. Did you order...
- **Choices:**
  1. "Push through - it'll pass" effects: {"stress":15,"energy":-20}
  2. "See a doctor" effects: {"stress":-5,"bank":-100}
  3. "Start evening walks with Poncho" effects: {"stress":-10,"energy":5}

### 47. The Talk (`relationship_tension`)

- **Type:** personal | **Month range:** [8, 35]
- **Unique**
- **Description:** "We need to talk about the shop." Your partner sits you down. They're worried. Y...
- **Choices:**
  1. "Promise to find better balance" effects: {"stress":10,"family":15,"bank":-1500}
  2. ""This is temporary - I need support right now"" effects: {"stress":-5,"family":-10}
  3. "Hire more help so you can be present" effects: {"family":25,"bank":-2500}

### 48. An Old Friend (`friend_needs_help`)

- **Type:** personal | **Month range:** [10, 38]
- **Description:** Your best friend from before the shop days calls. They're going through a rough ...
- **Choices:**
  1. "Make time - friendship matters" effects: {"stress":10,"energy":-10,"family":10}
  2. ""I'm really busy, but call anytime"" effects: {"stress":5}

### 49. One Star (`bad_review`)

- **Type:** crisis | **Month range:** [5, 40]
- **Unique**
- **Description:** You open Google Maps. Someone left a 1-star review. "Overpriced cheese, rude own...
- **Choices:**
  1. "Respond professionally" effects: {"stress":-5}
  2. "Ignore it" effects: {"stress":10}
  3. "Ask loyal customers for reviews" effects: {"stress":5,"energy":-5}

### 50. The Complainer (`difficult_customer`)

- **Type:** crisis | **Month range:** [3, 40]
- **Unique**
- **Description:** A customer brings back cheese, claiming it was "off." It wasn't - it's a washed-...
- **Choices:**
  1. "Refund and apologize" effects: {"stress":10,"bank":-25}
  2. "Explain the cheese patiently" effects: {"stress":15,"energy":-5}
  3. "Exchange it for something milder" effects: {"stress":5}

### 51. Goodbye, Madame Dubois (`regular_moves_away`)

- **Type:** personal | **Month range:** [15, 40]
- **Unique**
- **Description:** Madame Dubois - your very first regular, the one who suggested cheese - comes in...
- **Choices:**
  1. "Give her a farewell cheese basket" effects: {"bank":-80,"family":10}
  2. "Thank her for everything" effects: {"stress":5}

### 52. Sticky Fingers (`theft_incident`)

- **Type:** crisis | **Month range:** [8, 40]
- **Unique**
- **Description:** You notice the expensive truffle cheese is missing from the display. Then you se...
- **Choices:**
  1. "Confront them next time they come" effects: {"stress":20}
  2. "Let it go, improve security" effects: {"stress":10,"bank":-200}
  3. "Post about it (anonymously) in local groups" effects: {"stress":15}

### 53. Creating Your Signature (`signature_cheese`)

- **Type:** milestone | **Month range:** [18, 35]
- **Unique**
- **Priority:** 80
- **Description:** You've been thinking... what if you created something unique? A cheese aged spec...
- **Choices:**
  1. "Yes - create my signature cheese" effects: {"bank":-2000,"stress":10} flags: [hasSignatureCheese]
  2. "Not yet - focus on curation over creation" effects: {"stress":-5}

### 54. What Do You Stand For? (`shop_philosophy`)

- **Type:** decision | **Month range:** [12, 25]
- **Unique**
- **Priority:** 75
- **Description:** A journalist asks you: "What's your philosophy?" You realize you've never articu...
- **Choices:**
  1. ""Accessibility - great cheese for everyone, not just the eli" effects: {"stress":-5} flags: [shopPhilosophy]
  2. ""Education - I want people to discover, not just buy"" effects: {"energy":-5} flags: [shopPhilosophy]
  3. ""Connection - I'm building relationships, not transactions"" flags: [shopPhilosophy]

### 55. The Old Fromager (`mentor_opportunity`)

- **Type:** opportunity | **Month range:** [10, 28]
- **Unique**
- **Priority:** 85
- **Description:** Pierre, a retired fromager who ran a famous shop in Ixelles for 40 years, stops ...
- **Choices:**
  1. "Accept his mentorship gratefully" effects: {"energy":-5} flags: [hasMentor]
  2. "Politely decline - forge your own path"

### 56. The Neighborhood Collective (`neighborhood_collab`)

- **Type:** opportunity | **Month range:** [14, 30]
- **Unique**
- **Priority:** 70
- **Description:** The bakery, the wine shop, and the butcher want to form a collective. Shared mar...
- **Choices:**
  1. "Join the collective" effects: {"stress":5} flags: [inNeighborhoodCollective]
  2. "Stay independent"

### 57. The Recipe Collection (`cookbook_idea`)

- **Type:** decision | **Month range:** [20, 38]
- **Unique**
- **Priority:** 65
- **Description:** You've been collecting cheese recipes from customers for two years now. Madame D...
- **Choices:**
  1. "Create "Recipes from Chez Julien"" effects: {"bank":-1500,"stress":15,"energy":-10} flags: [hasCookbook]
  2. "Keep the recipes as a personal collection"

### 58. Creating a Tradition (`seasonal_ritual`)

- **Type:** decision | **Month range:** [8, 20]
- **Unique**
- **Priority:** 70
- **Description:** You want to create something special - a yearly tradition that customers look fo...
- **Choices:**
  1. ""Beaufort Season" - a spring celebration of alpine cheese" effects: {"bank":-500,"stress":10} flags: [hasBeaufortSeason]
  2. ""Fromage et Vendanges" - autumn cheese and wine pairing" effects: {"bank":-800,"stress":10} flags: [hasFromageVendanges]
  3. ""Cheese School" - monthly workshops for enthusiasts" effects: {"energy":-10} flags: [hasCheeseSchool]

### 59. Lucas Has an Idea (`lucas_growth`)

- **Type:** decision | **Month range:** [28, 40]
- **Unique**
- **Priority:** 75
- **Description:** Lucas approaches you nervously. "I've been thinking... what if we did TikToks? S...
- **Choices:**
  1. "Let Lucas run the social media" effects: {"stress":-5} flags: [lucasSocialMedia]
  2. "Not yet - focus on the fundamentals"

### 60. The Stories Behind the Counter (`your_counter_story`)

- **Type:** decision | **Month range:** [15, 35]
- **Unique**
- **Priority:** 68
- **Description:** You realize every cheese in your counter has a story. The Tomme from the farm yo...
- **Choices:**
  1. "Create "Story Cards" for each cheese" effects: {"energy":-10,"bank":-200} flags: [hasStoryCards]
  2. "Keep the stories verbal"

### 61. The Second Location (`expansion_dream`)

- **Type:** milestone | **Month range:** [28, 40]
- **Unique**
- **Priority:** 90
- **Description:** A space opened up in Uccle. Nice neighborhood, no cheese shop. Your accountant s...
- **Choices:**
  1. "Open the second shop" effects: {"bank":-40000,"stress":30,"energy":-20} flags: [hasSecondShop]
  2. "Stay focused on one perfect shop" effects: {"stress":-10} flags: [declinedExpansion]

### 62. The Documentary (`documentary_approach`)

- **Type:** opportunity | **Month range:** [24, 40]
- **Unique**
- **Priority:** 75
- **Description:** A filmmaker wants to make a short documentary about your shop. "The pivot from b...
- **Choices:**
  1. "Let her film the documentary" effects: {"stress":15,"energy":-10} flags: [hasDocumentary]
  2. "Decline - keep your privacy"

### 63. Giving Back (`charity_choice`)

- **Type:** decision | **Month range:** [10, 35]
- **Unique**
- **Priority:** 60
- **Description:** The local food bank asks if you'd donate cheese that's near its sell-by date. Al...
- **Choices:**
  1. "Partner with the food bank" effects: {"bank":-100} flags: [foodBankPartner]
  2. "Do the school sessions" effects: {"energy":-10} flags: [schoolProgram]
  3. "Do both - find the time" effects: {"energy":-15,"bank":-100,"stress":10} flags: [foodBankPartner, schoolProgram]

### 64. The Naming Ceremony (`naming_ceremony`)

- **Type:** decision | **Month range:** [6, 15]
- **Unique**
- **Priority:** 65
- **Description:** It's official: customers have started calling your shop by a nickname. Some say ...
- **Choices:**
  1. "Embrace "Chez Julien" with a new sign" effects: {"bank":-800} flags: [hasNewSign, signInstalled]
  2. "Keep it understated"

### 65. The Impossible Request (`special_order`)

- **Type:** opportunity | **Month range:** [15, 38]
- **Unique**
- **Priority:** 72
- **Description:** A customer asks: "Can you get Époisses aged by Berthaut himself? The one from be...
- **Choices:**
  1. "Take on the challenge" effects: {"energy":-15,"stress":10}
  2. "Explain why it's not possible"

### 66. The Crash (`sunday_burnout`)

- **Type:** crisis | **Month range:** [10, 18]
- **Description:** It's been a year. You've worked every single day. Sunday was supposed to be "jus...
- **Choices:**
  1. "Close for a week, recover" effects: {"energy":50,"stress":-40,"family":20,"bank":-5000} flags: [burnoutCrashed, openSunday]
  2. "Push through somehow" effects: {"energy":-20,"stress":20,"family":-25}

### 67. The Sunday Decision (`stop_sunday`)

- **Type:** decision | **Month range:** [12, 25]
- **Description:** After the crash, you're rethinking everything. Sunday was only your 4th best day...
- **Choices:**
  1. "Close Sundays permanently" effects: {"stress":-20,"energy":15,"family":20,"bank":-1200} flags: [openSunday]
  2. "Keep Sundays, hire help" effects: {"stress":5,"bank":-800}

### 68. The Neighbor Kid (`meet_lucas`)

- **Type:** hiring | **Month range:** [27, 28]
- **Mandatory**
- **Unique**
- **Description:** Lucas works at a shop next door. Young, chaotic energy, passionate about food. H...
- **Choices:**
  1. "Hire Lucas part-time" effects: {"bank":-1200,"stress":-10,"energy":15} flags: [hasLucas]
  2. "Look for someone more reliable" effects: {"stress":10,"energy":-10}
  3. "Not yet, keep doing it yourself" effects: {"stress":15,"energy":-10,"family":-10}

### 69. Lucas Has a Friend (`lucas_brings_henry`)

- **Type:** hiring | **Month range:** [28, 42]
- **Priority:** 85
- **Description:** Lucas has been great. Unreliable sometimes, but customers adore him. One day he ...
- **Choices:**
  1. "Hire Henry" effects: {"bank":-1500,"stress":-20,"energy":25} flags: [hasHenry]
  2. "One employee is enough" effects: {"stress":10}

### 70. Time to Get Help (`direct_hire_help`)

- **Type:** hiring | **Month range:** [26, 40]
- **Unique**
- **Priority:** 70
- **Description:** You've been running yourself ragged for over two years now. The shop needs anoth...
- **Choices:**
  1. "Hire Sophie full-time" effects: {"bank":-1600,"stress":-15,"energy":20} flags: [hasHenry, directHireEventSeen]
  2. "Hire part-time help" effects: {"bank":-900,"stress":-8,"energy":10} flags: [hasLucas, directHireEventSeen]
  3. "Keep doing it alone" effects: {"stress":15,"energy":-15,"family":-10} flags: [directHireEventSeen]

### 71. Student Workers (`student_trap`)

- **Type:** decision | **Month range:** [5, 30]
- **Unique**
- **Description:** A business advisor suggests hiring students. "Cheap labor! Flexible! Perfect for...
- **Choices:**
  1. "Hire students anyway" effects: {"bank":-400,"stress":5} flags: [studentHired]
  2. "Pass - find adults who can commit" effects: {"stress":10}

### 72. In The Zone (`peak_performance`)

- **Type:** opportunity | **Month range:** [13, 42]
- **Priority:** 80
- **Description:** You wake up feeling... incredible. Rested. Clear-headed. Ready. It's been months...
- **Choices:**
  1. "Deep clean and reorganize the shop" effects: {"energy":-15,"stress":-10}
  2. "Visit a supplier you've been meaning to see" effects: {"energy":-20,"bank":-300}
  3. "Take a spontaneous day off with your partner" effects: {"energy":-10,"bank":-2200}
  4. "Just enjoy the feeling" effects: {"stress":-5}

### 73. The Dog Question (`adopt_dog`)

- **Type:** personal | **Month range:** [14, 16]
- **Mandatory**
- **Unique**
- **Description:** Your partner has been hinting for months. A friend's Australian Shepherd just ha...
- **Choices:**
  1. "Adopt the Australian Shepherd puppy" effects: {"bank":-1800,"energy":-25,"stress":15} flags: [hasDog, dogBreed]
  2. "Not now, too much already" effects: {"family":-10,"stress":5}

### 74. Poncho Comes to Work (`dog_in_shop`)

- **Type:** opportunity | **Month range:** [16, 35]
- **Description:** Poncho has become a shop mascot. He greets customers with boundless enthusiasm. ...
- **Choices:**
  1. "Lean into it - Poncho is part of the brand" effects: {"stress":-15,"family":10,"energy":-10,"bank":-800}
  2. "Keep him at home more" effects: {"family":5,"energy":5}

### 75. Poncho's Cheese Incident (`poncho_cheese_emergency`)

- **Type:** crisis | **Month range:** [18, 36]
- **Unique**
- **Priority:** 90
- **Description:** You turn your back for ONE minute. Poncho found the cheese samples meant for tom...
- **Choices:**
  1. "Rush him to the emergency vet" effects: {"bank":-2500,"stress":30,"energy":-20} flags: [ponchoSurgery]
  2. "Wait and see if he passes it naturally" effects: {"stress":40,"energy":-30} flags: [ponchoSurgery]

### 76. Poncho's First Year (`poncho_anniversary`)

- **Type:** milestone | **Month range:** [27, 27]
- **Mandatory**
- **Unique**
- **Description:** One year ago, those eyes looked up at you from the shelter. Now Poncho owns the ...
- **Choices:**
  1. "Give him extra treats" effects: {"stress":-10,"family":10} flags: [ponchoAnniversary]

### 77. Madame Malfait Calls (`building_offer`)

- **Type:** milestone | **Month range:** [17, 18]
- **Mandatory**
- **Unique**
- **Description:** Your landlord, Madame Malfait, calls with news: "I'm selling the building. €380,...
- **Choices:**
  1. ""I'll find a way. I want it."" effects: {"stress":20,"energy":-10} flags: [buildingOfferReceived]
  2. "Ask for more time" effects: {"stress":20} flags: [buildingOfferReceived]
  3. ""I can't afford it. Thank you anyway."" effects: {"stress":15,"family":5}

### 78. The Savings Push (`building_countdown`)

- **Type:** milestone | **Month range:** [19, 24]
- **Description:** (dynamic)
- **Choices:**
  1. "Maximum savings mode" effects: {"stress":15,"reputation":-3}
  2. "Balance savings with operations" effects: {"stress":10}

### 79. July 2024: The Moment (`building_deadline`)

- **Type:** milestone | **Month range:** [25, 25]
- **Mandatory**
- **Unique**
- **Dynamic choices**
- **Description:** (dynamic)
- **Choices:**

### 80. August 2024: Last Chance (`building_deadline_extended`)

- **Type:** milestone | **Month range:** [26, 26]
- **Mandatory**
- **Unique**
- **Dynamic choices**
- **Description:** (dynamic)
- **Choices:**

### 81. The Shop Sign (`fancy_sign`)

- **Type:** decision | **Month range:** [8, 30]
- **Description:** Everyone says you need a proper sign. "People don't even notice the shop!" A des...
- **Choices:**
  1. "Install the fancy sign" effects: {"bank":-2000,"stress":15} flags: [signInstalled]
  2. "Keep the old sign" effects: {"stress":-5}

### 82. Visit the Producers (`producer_opportunity`)

- **Type:** opportunity | **Month range:** [10, 40]
- **Unique**
- **Description:** A cheese supplier invites you to visit their farm in Wallonia. "See where it com...
- **Choices:**
  1. "Go visit the producer" effects: {"energy":-10,"family":5}
  2. "Can't leave the shop" effects: {"stress":5}
  3. "Send Lucas to visit" effects: {"bank":-100}

### 83. Learning to Let Go (`delegation_moment`)

- **Type:** personal | **Month range:** [28, 40]
- **Description:** You've been doing everything yourself. Opening, closing, ordering, pricing, clea...
- **Choices:**
  1. "Start delegating seriously" effects: {"stress":-15,"energy":20,"family":15,"bank":-2000}
  2. "Keep control" effects: {"stress":10,"energy":-10,"family":-10}

### 84. A Week Off? (`take_holiday`)

- **Type:** personal | **Month range:** [20, 40]
- **Unique**
- **Description:** You haven't taken a real holiday since you started. Your partner is begging. "Ju...
- **Choices:**
  1. "Take the holiday" effects: {"energy":40,"stress":-30,"family":25,"bank":-6000}
  2. "Just a long weekend" effects: {"energy":15,"stress":-10,"family":10,"bank":-2500}
  3. "Not this time" effects: {"stress":10,"family":-15}

### 85. The December Rush (`december_rush`)

- **Type:** opportunity | **Month range:** [6, 42]
- **Description:** December. The month that makes or breaks the year. Cheese platters, gift baskets...
- **Choices:**
  1. "Go all out" effects: {"energy":-35,"stress":20}
  2. "Sustainable push" effects: {"energy":-10,"stress":5}

### 86. Sunday Dinner (`family_dinner`)

- **Type:** personal | **Month range:** [1, 42]
- **Unique**
- **Description:** Your family is gathering this Sunday. You haven't been to a family dinner in mon...
- **Choices:**
  1. "Go to dinner" effects: {"family":15,"energy":10}
  2. "Work comes first" effects: {"family":-15,"stress":10,"autonomy":5}

### 87. The Invitation (`the_invitation`)

- **Type:** personal | **Month range:** [8, 18]
- **Unique**
- **Priority:** 80
- **Description:** Your friend Marc is getting married. Saturday, of course. You're invited - actua...
- **Choices:**
  1. "Close the shop and go" effects: {"bank":-2000,"stress":15}
  2. "Have staff cover" effects: {"stress":10,"bank":-800}
  3. "Skip the wedding" effects: {"family":-20,"stress":5} flags: [skippedWedding]

### 88. The Hospital Call (`hospital_call`)

- **Type:** crisis | **Month range:** [17, 18]
- **Unique**
- **Priority:** 150
- **Description:** Your mother calls. Your father had a fall - he's in the hospital in Liège. Not l...
- **Choices:**
  1. "Close and go immediately" effects: {"bank":-4000,"stress":20,"reputation":-10}
  2. "Go after closing each day" effects: {"stress":35,"energy":-30,"family":5}
  3. "Stay, call every day" effects: {"family":-25,"stress":15}

### 89. The Old Friend (`old_friend`)

- **Type:** personal | **Month range:** [6, 30]
- **Unique**
- **Description:** Thomas is passing through Brussels. You haven't seen him in three years - he mov...
- **Choices:**
  1. "Go out with Thomas" effects: {"energy":-25,"family":10,"stress":-10}
  2. "Invite him to the shop instead" effects: {"family":5,"reputation":3}
  3. "Decline" effects: {"family":-10}

### 90. The Birthday You Forgot (`birthday_forgot`)

- **Type:** crisis | **Month range:** [12, 36]
- **Unique**
- **Priority:** 90
- **Description:** It's 22h. You're finally home, exhausted. Your phone buzzes - a photo in the fam...
- **Choices:**
  1. "Go see her right now" effects: {"family":-10,"stress":10}
  2. "Send flowers tomorrow with a long apology" effects: {"family":-15,"bank":-100}

### 91. Christmas Day (`christmas_day`)

- **Type:** personal | **Month range:** [42, 42]
- **Mandatory**
- **Unique**
- **Description:** December 25th. The shop is closed today and tomorrow - finally. Your family expe...
- **Choices:**
  1. "Go straight to family" effects: {"family":15,"stress":10}
  2. ""Just a few hours" at the shop first" effects: {"stress":-5,"family":-10,"energy":-10}
  3. "Work through Christmas" effects: {"family":-30,"stress":-15,"autonomy":5} flags: [workedChristmas]

### 92. The Call from Rue au Bois (`second_shop_offer`)

- **Type:** opportunity | **Month range:** [36, 42]
- **Unique**
- **Priority:** 200
- **Description:** Your phone rings. It's Marie, a fellow fromagère. "Julien, I'm retiring. My shop...
- **Choices:**
  1. "Let's do it - expand the empire" effects: {"bank":-60000,"stress":10} flags: [hasSecondShop]
  2. "I'm happy with one shop" effects: {"stress":-10} flags: [declinedExpansion]

### 93. Time to Systematize (`systems_project`)

- **Type:** strategy | **Month range:** [8, 25]
- **Unique**
- **Priority:** 70
- **Description:** You've been thinking about efficiency. There are tools and systems that could he...
- **Choices:**
  1. "Set up email automations" effects: {"stress":5,"energy":-10,"bank":-200}
  2. "Hire a weekly cleaning service" effects: {"bank":-300,"stress":-8}
  3. "Keep doing things yourself" effects: {"stress":5}

### 94. Building Visibility (`visibility_push`)

- **Type:** strategy | **Month range:** [6, 20]
- **Unique**
- **Priority:** 70
- **Description:** The shop is good, but does the neighborhood know? You could invest time in getti...
- **Choices:**
  1. "Instagram campaign" effects: {"stress":10,"energy":-15,"bank":-150}
  2. "Visit other shops for inspiration" effects: {"stress":-5,"energy":-10,"bank":-100}
  3. "Focus on existing customers" effects: {"stress":-5}

### 95. Taking Care of Yourself (`personal_recharge`)

- **Type:** strategy | **Month range:** [10, 28]
- **Unique**
- **Priority:** 70
- **Description:** The shop demands everything. But this month, you're thinking about yourself for ...
- **Choices:**
  1. "Business dinner with a supplier" effects: {"bank":-150,"energy":-5}
  2. "Family weekend" effects: {"bank":-200,"stress":-10}
  3. "Keep pushing through" effects: {"stress":8,"autonomy":3}

### 96. The Pricing Question (`pricing_strategy`)

- **Type:** strategy | **Month range:** [12, 30]
- **Unique**
- **Priority:** 70
- **Description:** You've been thinking about your margins. Some shops charge premium prices and ow...
- **Choices:**
  1. "Go premium - quality justifies price" effects: {"stress":5}
  2. "Stay accessible - volume matters" effects: {"stress":3}
  3. "Mixed strategy - everyday and special occasion" effects: {"stress":8,"energy":-5}

### 97. Supplier Strategy (`supplier_relationship`)

- **Type:** strategy | **Month range:** [14, 32]
- **Unique**
- **Priority:** 65
- **Description:** You're ordering regularly now. Do you consolidate with fewer suppliers for bette...
- **Choices:**
  1. "Consolidate - negotiate better terms" effects: {"stress":-5}
  2. "Diversify - unique products win" effects: {"stress":8,"energy":-8}
  3. "Keep current balance"

### 98. Finding Your Rhythm (`weekly_rhythm`)

- **Type:** strategy | **Month range:** [10, 26]
- **Unique**
- **Priority:** 65
- **Description:** The shop has a pattern now. But you're wondering if you could optimize the week ...
- **Choices:**
  1. "Theme days - Tasting Tuesday, etc." effects: {"stress":10,"energy":-10,"bank":-200}
  2. "Quiet mornings for admin" effects: {"stress":-8}
  3. "Stay flexible" effects: {"stress":3}

### 99. Investing in Knowledge (`learning_investment`)

- **Type:** strategy | **Month range:** [18, 36]
- **Unique**
- **Priority:** 60
- **Description:** There's a cheese certification course. Three weekends, €800. Or you could visit ...
- **Choices:**
  1. "Take the certification course" effects: {"bank":-800,"stress":15,"energy":-20}
  2. "Visit producers in France" effects: {"bank":-600,"stress":-5,"energy":-10}
  3. "Learn by doing" effects: {"stress":3}

### 100. The Shop Experience (`shop_atmosphere`)

- **Type:** strategy | **Month range:** [8, 24]
- **Unique**
- **Priority:** 60
- **Description:** The shop works, but could it feel better? Music, lighting, the smell when people...
- **Choices:**
  1. "Invest in ambiance" effects: {"bank":-400,"stress":5,"energy":-8}
  2. "Focus on the product display" effects: {"bank":-300,"stress":8,"energy":-10}
  3. "Keep it authentic"

### 101. Catering Request (`catering_opportunity`)

- **Type:** opportunity | **Month range:** [8, 36]
- **Description:** A local business wants cheese platters for their monthly client meetings. It's r...
- **Choices:**
  1. "Take the contract" effects: {"stress":8,"energy":-10}
  2. "Negotiate for pickup only" effects: {"stress":3}
  3. "Decline politely"

### 102. Private Tasting Request (`private_tasting`)

- **Type:** opportunity | **Month range:** [6, 42]
- **Description:** Someone wants to book the shop for a private cheese tasting - their partner's 40...
- **Choices:**
  1. "Host an elaborate tasting" effects: {"stress":12,"energy":-15}
  2. "Simple tasting, reasonable price" effects: {"stress":5,"energy":-8}
  3. "Suggest they visit during open hours" effects: {"stress":-3}

### 103. Restaurant Bulk Order (`bulk_order`)

- **Type:** opportunity | **Month range:** [10, 38]
- **Description:** (dynamic)
- **Choices:**
  1. "Full partnership" effects: {"stress":8,"energy":-5}
  2. "Occasional supply only" effects: {"stress":3}
  3. "Decline - retail focus"

### 104. Weekend Market Opportunity (`market_stall`)

- **Type:** opportunity | **Month range:** [6, 30]
- **Unique**
- **Description:** A spot opened up at the Dumont market. Every Wednesday afternoon. It's good expo...
- **Choices:**
  1. "Take the spot" effects: {"stress":15,"energy":-12}
  2. "Take it temporarily" effects: {"stress":8,"energy":-8}
  3. "Pass on it"

### 105. An Unexpectedly Good Month (`good_month`)

- **Type:** milestone | **Month range:** [8, 40]
- **Description:** (dynamic)
- **Choices:**
  1. "Save it all"
  2. "Invest in the shop" effects: {"bank":-500}
  3. "Celebrate with family" effects: {"stress":-10}

### 106. A Quiet Month (`quiet_month`)

- **Type:** routine | **Month range:** [1, 42]
- **Description:** Nothing dramatic. The rhythm continues. Customers come, cheese sells, the sun ri...
- **Choices:**
  1. "Rest and recover" effects: {"energy":15,"stress":-10}
  2. "Plan and improve" effects: {"energy":-5,"stress":5}
