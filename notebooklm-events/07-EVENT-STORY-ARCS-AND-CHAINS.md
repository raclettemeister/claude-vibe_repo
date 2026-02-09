# Chez Julien — Event Story Arcs & Chains

> How events connect narratively and mechanically. Which events unlock others, and which storylines exist.

---

## Major Story Arcs

### 1. The Cheese Pivot Arc (Core Progression)
The central arc of the game: transforming from a bulk organic shop into a fine food/cheese shop.

**Chain:**
1. `stock_reality` (Month 1-2) — Discover the dead stock problem
2. `first_cheese` (Month 2-4) — Madame Dubois suggests cheese → sets `cheeseTypes`
3. `cheap_fridge` (Month 4-10) — Buy a counter for cheese (if `cheeseTypes >= 1`)
4. `gradual_pivot` (Month 6-15) — Transition from bulk to cheese
5. `fine_food_choice` (Month 8-20) — Commit to fine food identity (if `cheeseTypes >= 15`)
6. `charcuterie_question` (Month 6-38) — Add charcuterie (if `cheeseTypes >= 5`)
7. `wine_dilemma` (Month 10-38) — Add wine (if `cheeseTypes >= 20`)
8. `signature_cheese` (Month 18-35) — Create your own cheese (if `cheeseTypes >= 40` + producer relationships)

### 2. The Raclette Mastery Path
A specialization arc that builds unique identity and revenue.

**Chain:**
1. `first_raclette_season` (Month 16) — October decision to invest in raclette → sets `raclettePathStarted`
2. `raclette_season` (Month 17+ recurring) — Seasonal revenue events (enhanced if `raclettePathStarted`)
3. `swiss_invitation` (Month 16-32) — Visit Swiss producers (needs `raclettePathStarted` + 5 raclette types)
4. `raclette_kingdom` (Month 24-40) — Build dedicated raclette corner (needs `swissVisitDone` + 15 raclette types)

### 3. The Building Arc (Central Financial Goal)
The biggest financial challenge and a major narrative milestone.

**Chain:**
1. `building_offer` (Month 17-18, MANDATORY) — Madame Malfait offers the building → sets `buildingOfferReceived`
2. `building_countdown` (Month 19-24, recurring) — Monthly savings push events
3. `building_deadline` (Month 25, MANDATORY) — Must have €80,000 or ask for extension
4. `building_deadline_extended` (Month 26, MANDATORY if delayed) — Last chance with €5,000 penalty

**Alternative Path (didn't buy building):**
- `second_shop_offer` (Month 36-42) — If bank >= €80,000 but didn't buy building → offered second shop instead

### 4. The Sunday Burnout Arc
The cautionary tale about work-life balance. Intentionally designed to punish opening Sundays.

**Chain:**
1. `sunday_opening` (Month 1, first event) — Choose to open Sundays
2. Monthly stress accumulation (if open Sunday: +1 to +5 stress/month)
3. `sunday_burnout` (Month 10-18) — Collapse if `openSunday` + low energy/high stress
4. `stop_sunday` (Month 12-25) — After burnout, option to close Sundays permanently
5. Burnout system: at 80% stress → forced crash, -20 max energy, 3 crashes = game over

### 5. The Hiring Arc
Building a team to make the shop sustainable.

**Chain:**
1. `meet_lucas` (Month 27-28, MANDATORY) — Lucas introduced → can hire → sets `hasLucas`
2. `staff_training` (Month 8-35) — Train Lucas (if `hasLucas`, `autonomy < 50`)
3. `lucas_growth` (Month 28-40) — Lucas proposes TikTok (if `hasLucas`, 2+ months)
4. `lucas_brings_henry` (Month 39-42) — Lucas introduces Henry (if `hasLucas`, 12+ months) → sets `hasHenry`
5. `delegation_moment` (Month 28-40) — Learn to delegate (if `hasLucas`)

**Alternative Path (missed Lucas):**
- `direct_hire_help` (Month 26-40) — Backup hiring event if no Lucas and high stress

### 6. The Poncho Arc (Dog Story)
A beloved personal story thread tied to stress relief and family.

**Chain:**
1. `adopt_dog` (Month 14-16, MANDATORY) — Adopt Poncho → sets `hasDog`
2. `dog_in_shop` (Month 16-35) — Poncho becomes shop mascot (3+ months after adoption)
3. `poncho_cheese_emergency` (Month 18-36) — Poncho eats cheese, needs surgery
4. `poncho_anniversary` (Month 26-28, MANDATORY) — Poncho's first birthday

### 7. The Family vs Shop Arc
Persistent tension between shop demands and personal relationships.

**Events in this arc:**
- `relationship_tension` — Partner confrontation (if `family < 60` + `stress > 40`)
- `family_dinner` — Miss or attend family Sunday dinner
- `the_invitation` — Marc's wedding vs Saturday sales
- `hospital_call` — Father in hospital vs Christmas rush
- `birthday_forgot` — Forgot mother's birthday (if `stress >= 50`)
- `old_friend` — Thomas visits vs shop demands
- `christmas_day` (MANDATORY, Month 42) — Final choice: family or shop

### 8. The Expertise & Reputation Arc
Building credibility as a true fromager.

**Chain (non-linear):**
1. `talk_to_customers` (Month 4-20) — Learn from customers
2. `cheese_course` (Month 10-28) — Certification course
3. `mentor_opportunity` (Month 10-28) — Pierre mentors you
4. `producer_visit_lalero` (Month 8-30) — Visit Lalero caves
5. `producer_opportunity` (Month 10-40) — Visit local producers
6. `shop_philosophy` (Month 12-25) — Define your identity
7. `your_counter_story` (Month 15-35) — Story cards for cheeses
8. `food_blogger_visit` (Month 20-42) — Social media attention
9. `newspaper_feature` (Month 12-36) — Local press coverage
10. `documentary_approach` (Month 24-40) — Documentary about your shop
11. `parmigiano_invitation` (Month 38-42) — CROWNING event, needs reputation >= 90

---

## Event Categories by Type

### Mandatory Events (MUST fire)
These fire automatically when their month window opens:
1. `first_christmas` — Month 6
2. `adopt_dog` — Month 14-16
3. `building_offer` — Month 17-18
4. `christmas_market` — Month 18
5. `building_deadline` — Month 25
6. `building_deadline_extended` — Month 26 (if delayed)
7. `poncho_anniversary` — Month 26-28
8. `meet_lucas` — Month 27-28
9. `christmas_rush` — Month 30
10. `christmas_day` — Month 42

### Recurring Events (Can Fire Multiple Times)
- `raclette_season` — Every winter (cooldown 12)
- `building_countdown` — Every 2 months during saving period
- `summer_slowdown` — Every August (cooldown 12)
- `heat_wave` — Every July/August (cooldown 12)
- `back_to_school` — Every September (cooldown 12)
- `december_rush` — Every December
- `food_blogger_visit` — Every year (cooldown 12)
- `peak_performance` — Every 8 months when energy is high

### One-Time Strategic Events
These fire once and shape long-term shop identity:
- `pricing_strategy`, `supplier_relationship`, `weekly_rhythm`
- `learning_investment`, `shop_atmosphere`, `systems_project`
- `visibility_push`, `personal_recharge`, `seasonal_ritual`

### Crisis Events (Bad Things Happen)
- `cash_crisis` — Ran out of money
- `summer_flood` — Random disaster (50%)
- `supplier_price_hike` — Costs go up
- `delivery_disaster` — Supplier no-show
- `health_inspection` — AFSCA visit
- `fridge_breakdown` — Equipment failure
- `theft_incident` — Shoplifting
- `bad_review` — 1-star review
- `difficult_customer` — Complaint
- `birthday_forgot` — Personal crisis
- `hospital_call` — Family emergency

---

## Revenue/Economy Events

These events directly affect financial trajectory:

### Big Money Makers:
- `raclette_season` (go all-in): -€3,000 cost → +€12,000-18,000 return
- `december_rush` (go all out): Variable, scales with cheeseTypes + reputation
- `christmas_market`: +€3,000 (if taken)
- `corporate_client`/`corporate_opportunity`: Recurring income
- `wine_pairing`: +€2,000

### Big Money Drains:
- `building_deadline`: -€80,000 to -€85,000
- `second_shop_offer` / `expansion_dream`: -€40,000 to -€60,000
- `summer_flood` (no insurance): -€13,000 to -€18,000
- `take_holiday`: -€2,500 to -€6,000
- `sunday_burnout` (close for a week): -€5,000 + lost sales
- `parmigiano_invitation`: -€6,000
- `birthday_party` (big party): -€4,500
- `swiss_invitation`: -€4,000
- `hospital_call` (close and go): -€4,000

---

## Known Issues with Events (as of v4.2)

1. **Some events overlap in timing** — Multiple events competing for the same month
2. **Randomness still exists** — `summer_flood` has 50% chance, `peak_performance` has 50% chance
3. **Seasonal events may not trigger consistently** — Condition checks for `gameState.month` can be tricky with the monthIndex system
4. **Event density varies wildly** — Early game has fewer events; mid-to-late game can feel overwhelming
5. **Some condition thresholds may be unreachable** — e.g., `reputation >= 90` for Parmigiano, `bank >= 80000 + !ownsBuilding` for second shop
6. **Event order within same priority is non-deterministic** — First match wins for mandatory, highest priority for priority events
