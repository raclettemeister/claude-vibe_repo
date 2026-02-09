# Chez Julien — Raw Events Data (Code Reference)

> This file contains the raw JavaScript event definitions from `data/events.js`, converted to a readable reference format. This is the ACTUAL code — not a design document.

---

## How to Read This

Each event entry shows:
- **ID**: Internal identifier
- **Title**: Display name
- **Type**: crisis | decision | opportunity | milestone | personal | hiring | pivot | strategy | routine
- **MonthRange**: `[start, end]` — which sequential months (1-42) the event can fire
- **Mandatory**: If true, fires automatically
- **Unique**: If true, fires only once
- **Recurring**: If true, can fire multiple times (with cooldown)
- **Priority**: Higher number = fires before lower priority events
- **Condition**: JavaScript condition that must be true (references gameState)
- **Choices**: Player options with effects, flags, and outcomes

---

## The 106 Events (Verbatim from Code)

### cash_crisis — "No More Grace"
- Type: crisis | Months: [1, 42] | Special: cash_crisis
- Triggered when bank hits 0 AND no more supplier grace
- Description: Dynamic (filled at runtime with shortage amount)
- Choices:
  1. "Take a bank loan" — 6% monthly interest, action: take_loan
  2. "Sell equipment at a loss" — reputation: -5, action: sell_equipment
  3. "Ask family for help" — family: -15, action: family_help

### sunday_opening — "The Sunday Question"
- Type: decision | Months: [1, 1] | Unique | Priority: 100
- Description: Day one. Previous owner closed Sundays. More revenue vs no days off.
- Choices:
  1. "Open on Sundays" — stress: +10, energy: -5, flag: openSunday=true
  2. "Stay closed on Sundays" — stress: -5, family: +5, energy: +5, flag: openSunday=false

### stock_reality — "The Inventory"
- Type: crisis | Months: [1, 2] | Priority: 95
- Description: €38k stock on paper doesn't match reality. Bulk quinoa from 2019.
- Choices:
  1. "Progressive liquidation" — stress: +15, energy: -15, flags: liquidatedStock, fleaMarketDone. Conditional: reputation +5, autonomy +5
  2. "Find a 'guy'" — bank: +1500, stress: +5, energy: -5, flags: shadyGuyContacted, liquidatedStock
  3. "Keep trying normally" — stress: +25, bank: -1000. Conditional: reputation -10, monthlyPenalty 500

### shop_name — "What's In a Name?"
- Type: decision | Months: [3, 12] | Unique
- Condition: !gameState.shopRenamed
- Choices:
  1. "Chez Julien" — stress: -5, flag: shopRenamed, shopName='Chez Julien'. Conditional: reputation +5
  2. "Alix Corner" — bank: -200, flag: shopRenamed, shopName='Alix Corner'. Conditional: reputation +5
  3. "Keep the current name" — flag: shopRenamed

### insurance_decision — "The Insurance Question"
- Type: decision | Months: [2, 4] | Unique | Priority: 90
- Condition: !gameState.insuranceDecisionMade
- Choices:
  1. "Comprehensive coverage (€1,800/year)" — bank: -1800, stress: -5, flags: insuranceDecisionMade, hasComprehensiveInsurance=true, monthlyInsurance=150
  2. "Basic coverage only" — stress: +5, flags: insuranceDecisionMade, hasComprehensiveInsurance=false

### summer_flood — "The Flood"
- Type: crisis | Months: [13, 37] | Unique | Priority: 95 | Dynamic choices
- Condition: Summer month (6-8), insuranceDecisionMade, !floodHappened, Math.random() < 0.5
- Description: Dynamic (changes based on insurance status)
- If insured: "File insurance claim" — stress: +15, energy: -20. Conditional: bank +6500, reputation +3
- If uninsured:
  1. "Clean up and absorb loss" — stress: +40, energy: -35, family: -15. Conditional: bank -18000, reputation -5
  2. "Ask family for help" — stress: +35, energy: -30, family: -25. Conditional: bank -13000, reputation -3

### first_cheese — "A Customer's Suggestion"
- Type: pivot | Months: [2, 4] | Unique | Priority: 95
- Condition: gameState.cheeseTypes === 0
- Choices:
  1. "Start with ONE cheese - Tomme Larzac" — bank: -300, energy: -10. Conditional: reputation +3, conceptPivotProgress +10
  2. "Go big - state of the art counter" — bank: -5000, stress: +10, energy: -10, flags: cheeseTypes=15, hasProCounter. Conditional: reputation +10, conceptPivotProgress +40, monthlyPayment=800
  3. "Stick to bulk" — stress: +10

### charcuterie_question — "The Charcuterie Question"
- Type: decision | Months: [6, 38] | Unique | Priority: 65
- Condition: cheeseTypes >= 5, !hasCharcuterie
- Choices:
  1. "Belgian charcuterie (Coprosain)" — bank: -1500, stress: +10, flag: hasCharcuterie. Conditional: reputation +3, autonomy -5
  2. "Italian imports (premium)" — bank: -3000, stress: +15, flag: hasCharcuterie. Conditional: reputation +5
  3. "Stay focused on cheese" — stress: -5. Conditional: autonomy +10, cheeseExpertise +5

### wine_dilemma — "The Wine Dilemma"
- Type: decision | Months: [10, 38] | Unique | Priority: 65
- Condition: cheeseTypes >= 20, !hasWineSelection
- Choices:
  1. "Curated selection (15 bottles)" — bank: -2000, stress: +5, flag: hasWineSelection. Conditional: reputation +5
  2. "Serious wine section" — bank: -8000, stress: +20, energy: -15, flags: hasWineSelection, hasWineEvents. Conditional: reputation +6, autonomy -10
  3. "Partner with wine shop" — stress: -5. Conditional: autonomy +8, reputation +3

### corporate_opportunity — "The Corporate Inquiry"
- Type: opportunity | Months: [12, 35] | Unique
- Condition: cheeseTypes >= 25, reputation >= 55, !hasCorporateClient
- Choices:
  1. "Accept" — stress: +15, energy: -10, flag: hasCorporateClient. Conditional: autonomy -10, reputation +5
  2. "Negotiate" — stress: +10. Conditional: reputation +3, bank +1000
  3. "Decline" — stress: -10. Conditional: autonomy +10

### cheap_fridge — "The Barely-Working Fridge"
- Type: decision | Months: [4, 10] | Unique
- Condition: cheeseTypes >= 1 && < 15, !hasProCounter
- Choices:
  1. "Buy cheap (€800)" — bank: -800, stress: +5. Conditional: cheeseTypes +9, conceptPivotProgress +20
  2. "Finance proper counter (€50,000)" — bank: -2000, stress: +20, flags: monthlyPayment=800, hasProCounter. Conditional: cheeseTypes +20, conceptPivotProgress +35, reputation +6

### fine_food_choice — "A New Direction"
- Type: pivot | Months: [8, 20] | Unique
- Condition: cheeseTypes >= 15, concept === 'Hybrid', !fineFoodChoiceMade
- Choices:
  1. "Embrace fine food" — stress: +10, reputation: +6, flag: fineFoodChoiceMade, action: set_fine_food
  2. "Stay hybrid" — stress: +5, flag: fineFoodChoiceMade

[NOTE: The remaining 94 events follow the same detailed format. The full event data is available in file 01-ALL-EVENTS-CURRENT-STATE.md. Key events are documented in detail in file 07-EVENT-STORY-ARCS-AND-CHAINS.md. The complete raw JavaScript source with all conditions, dynamic descriptions, and conditional effects is in data/events.js (3,196 lines).]

---

## Event Types Distribution

| Type | Count | Purpose |
|------|-------|---------|
| crisis | 16 | Bad things happening, tests player response |
| decision | 17 | Shape the shop's identity and strategy |
| opportunity | 16 | Growth chances, often with cost |
| milestone | 10 | Major story beats and achievements |
| personal | 14 | Family, health, relationships |
| hiring | 4 | Building the team |
| pivot | 3 | Transforming the shop concept |
| strategy | 8 | Business optimization choices |
| routine | 1 | Filler/quiet month |
| **Total** | **106** | |

## Priority Values in Use

| Priority | Events |
|----------|--------|
| 200 | second_shop_offer |
| 150 | hospital_call |
| 100 | sunday_opening |
| 95 | stock_reality, first_cheese, summer_flood, parmigiano_invitation |
| 90 | insurance_decision, first_raclette_season, poncho_cheese_emergency, birthday_forgot |
| 88 | raclette_kingdom |
| 85 | raclette_season, swiss_invitation, lucas_brings_henry, summer_slowdown, snow_day, back_to_school, mentor_opportunity |
| 80 | heat_wave, signature_cheese, peak_performance, the_invitation |
| 75 | shop_philosophy, lucas_growth, documentary_approach |
| 72 | special_order |
| 70 | direct_hire_help, birthday_party, neighborhood_collab, seasonal_ritual, systems_project, visibility_push, personal_recharge, pricing_strategy |
| 68 | your_counter_story |
| 65 | charcuterie_question, wine_dilemma, cookbook_idea, naming_ceremony, supplier_relationship, weekly_rhythm |
| 60 | regular_appreciation, apprentice_request, charity_choice, learning_investment, shop_atmosphere |
| 55 | competitor_closes |
| 50 | reflection_moment |
| (none) | 40+ events — selected randomly from eligible pool |
