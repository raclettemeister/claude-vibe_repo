# Chez Julien Simulator — Game Design Document

> **Status:** COMPLETE DESIGN SPEC (Updated Feb 2, 2026)
> **Source:** Julien's direct input + [Notion: Shop Simulator — Ideas](https://www.notion.so/2f5cbce566f881faae4ee28236603934)
>
> **Related Documents:**
> - `BALANCE_REFERENCE.md` — Actual numbers for game balance
> - `EVENT_MAP.md` — Complete event list with proposed fixed months
> - `PROJECT_STATUS.md` — Current state and recovery instructions

---

## 1. Core Concept

**Genre:** Event-based, turn-based narrative simulation (NOT card/Reigns-style)
**Theme:** Running a real shop — based on true events from Chez Julien
**Core loop:** Monthly decisions affecting cash, stress, reputation, family, and growth
**Game length:** 42 months (July 2022 → December 2025)

**One-sentence pitch:**
A narrative business sim where you transform a dying Brussels épicerie into a beloved cheese shop, while not destroying your health, relationships, or sanity.

---

## 2. Win & Lose Conditions

### Win Condition
**Finish the game alive.** That's it.

The building purchase is an IN-GAME GOAL that players will naturally chase, but it's not required to "win." You can finish without buying the building.

### Lose Conditions (Game Over)

| Condition | Trigger | Narrative |
|-----------|---------|-----------|
| **Burnout** | 3 burnouts total | Hospital. Shop must close. |
| **Bankruptcy** | Can't repay loans | Financial collapse. Shop must close. |
| **Family Collapse** | Family stat hits 0 | Depression. You never return to the shop. |

**Important:** Money CAN'T go negative. Players can take loans. Bankruptcy = unable to repay loans, not just €0 balance.

---

## 3. Design Philosophy

### The Game Should Feel Hard But Be Completable

> "Somehow it's not a hardcore game, so the game should make you feel like you are about to lose, but somehow anybody who wants to get the building should get the building on their first playthrough. You just have to make it look like you are very close."

- Players should feel tension and near-failure
- But careful play on first playthrough = success
- The drama is in the FEELING, not actual failure rate

### Story-Driven, Not Random

> "I want the game to be more story driven. Every playthrough you basically get the same options."

**Current bug:** Some events (like Raclette trophy) never pop up in some playthroughs.
**Fix needed:** Core events must be DETERMINISTIC, not random.

### Clear Paths Based on Choices

| Focus | Path | Outcome |
|-------|------|---------|
| **Family** | Always choose family | Beautiful moments, shop barely survives |
| **Money/Grind** | Always choose work | Very tough, likely to lose |
| **Empire** | Skip building, expand | Alternative ending: bigger business, always stressed, hints you won't stop |
| **Balance** | Mix of choices | Get building, survive, feel accomplished |

---

## 4. The Sunday Mechanic (Critical Balance Rule)

### How It Works
- If you open Sundays → stress increases MORE every month
- Burnout happens between **month 6-10** if Sunday open
- **It's impossible to open Sundays and avoid burnout** — this is intentional
- The game TEACHES players that it's not sustainable

### After First Burnout
- Game FORCES you to close on Sundays
- This is already implemented and works well

### Without Sunday Opening
- You can STILL burn out from other choices
- But it's manageable with careful play

---

## 4b. Stress & Burnout Thresholds (NEW)

### Stress Levels
| Level | State | Risk |
|-------|-------|------|
| 0-40% | Safe | No burnout risk |
| 40-60% | Elevated | Be careful |
| 60-70% | **DANGER ZONE** | High burnout risk |
| 70-80% | Critical | Very likely to burnout |
| 80%+ | **BURNOUT TRIGGERS** | Automatic burnout |

### Why 60-70% is Dangerous
Some events add up to **+20 stress**. If you're at 65% and hit a bad event, you jump to 85% = instant burnout.

### The Rule
**Burnout triggers at 80% stress.** Players should feel the danger starting at 60%.

---

## 5. Economy Design

### Starting Money
- **Real life:** €0, but first month brought in ~€12k (no expenses yet)
- **Game option A:** Start at €12,000 (simpler)
- **Game option B:** Start at €0, first month = €12k revenue with €0 spending (more dramatic)

### Early Game (Months 1-12)
- **Easy to generate cash**
- No salary, no employees, minimal expenses
- Sacrifice = savings accumulate fast
- This enables the building purchase

### Late Game (After Building)
- **More sales but LESS cash**
- Expenses pile up:
  - Your salary
  - Employee salaries (Lucas, Henry)
  - Building insurance
  - Better equipment
  - Cleaning service
  - Business car
  - Apartment upstairs

### The Inversion
> "It's easier to generate a lot of cash to buy the building in the beginning because you can just sacrifice everything. But then once you want to stop sacrificing everything, it's starting to be harder and harder to generate cash, but you're more and more happy and less stressed."

**End state:** With full team + all comforts, you might have NEGATIVE months. But bank balance is high, life is good. Income flattens = success, not failure.

---

## 6. The Building Mechanic

### Timing
- Announcement comes **EARLY** (player isn't ready)
- Player thinks: "Shit, I wish I had more time to build up"
- This mirrors real life — opportunities don't wait

### Balance
- To get the building, you MUST sacrifice heavily
- You'll be close to burnout, low on family
- Should feel like "barely made it"

### The Math
- Need to save aggressively from announcement (~month 15) to purchase (~month 24)
- ~9 months of intense saving
- Achievable on first playthrough IF you commit

---

## 7. Cheese Count (In-Game Stat)

### Current Problem
Cheese count stays low, only increases on random events.

### How It Works
The game tracks how many cheeses you have on display. This is a visible in-game stat that grows based on your choices (buying counters, visiting producers, focusing on cheese selection).

### Intended Progression
```
Start:   1 cheese
Early:   5 cheeses
Month 6: 10 cheeses
Month 12: 20 cheeses
Month 18: 25 cheeses → 🏆 Achievement unlocks
Month 30: 50 cheeses → 🏆 Achievement unlocks (normal end)
Month 42: 100 cheeses → 🏆 Achievement unlocks (dedicated focus)
```

### Achievement Milestones
| Cheese Count | Achievement | Achievability |
|--------------|-------------|---------------|
| 25 | 🏆 Unlocks | Natural progression |
| 50 | 🏆 Unlocks | Normal playthrough ends here |
| 100 | 🏆 Unlocks | Requires entire playthrough dedicated to cheese |

### Key Point
Getting 100 cheeses means sacrificing other goals. Most players end around 50.

---

## 8. Mandatory Events (Must Happen Every Playthrough)

> **IMPLEMENTED in index_v2.html (Jan 29, 2026)**

| Event ID | Title | Month | Real Date | Description |
|----------|-------|-------|-----------|-------------|
| `first_christmas` | Your First Christmas Season | 6 | Dec 2022 | Uncertain first holiday - learning the ropes |
| `adopt_dog` | The Dog Question | 14-16 | Sept 2023 | Poncho adoption opportunity |
| `building_offer` | Madame Malfait Calls | 17-18 | Nov 2023 | Building purchase opportunity announced |
| `christmas_market` | Christmas Market Opportunity | 18 | Dec 2023 | Stand at Place Dumont |
| `building_deadline` | July 2024: The Moment | 25 | July 2024 | €80k deadline for building |
| `building_deadline_extended` | One More Month | 26 | Aug 2024 | Pay €5k to extend deadline |
| `meet_lucas` | The Neighbor Kid | 27-28 | Sept 2024 | Lucas hire opportunity |
| `christmas_rush` | The Christmas Chaos | 30 | Dec 2024 | December chaos - you're established now |
| `christmas_day` | Christmas Day | 42 | Dec 2025 | Family vs. shop finale |

### Event Categories
- **MANDATORY** = Fixed to specific month, always happens (`mandatory: true` in code)
- **PRIORITY** = High chance to appear but not guaranteed (`priority: X` in code)
- **FLUFF** = Random, adds variety but not essential

### Poncho Specifics
- **NOT a gameplay buff** — mostly fluff
- Effects should be MILD and mixed:
  - Sometimes slight stress (dog responsibilities)
  - Sometimes slight family boost
  - Fluffy, emotional, not mechanical

---

## 9. Employee System

### Lucas (Mandatory Event)
- First employee opportunity
- Chaotic but CLUTCH in December
- If you skip Lucas → alternative hire appears later

### Henry
- Only available AFTER Lucas
- Ultra-reliable workhorse
- Lucas's friend

### With Full Team (Lucas + Henry)
- Game becomes **EASY**
- No more stress/energy/family problems
- Trade-off: income growth flattens
- This is INTENTIONAL — hiring = comfort, not growth

---

## 10. Difficulty Modes

### Realistic ("The actual journey")
- Following Julien's real choices = guaranteed win
- Knowing the true story = easy mode
- Balanced for first-time players to succeed with effort

### Forgiving ("Gentler margins")
- Pure storytelling experience
- **Impossible to really mess up**
- For players who want the narrative without stress

### Brutal ("No room for error")
- **Impossible to get building AND survive**
- You CAN get the building, but you'll crash after
- Goal: survive 42 turns
- Very careful play = survival
- Game over ONLY if you overreach (chasing building or empire)
- For masochists who want the real struggle

---

## 11. Real Timeline Reference

| Date | Real Event | Game Event |
|------|------------|------------|
| **July 2022** | Take over. €0 bank. €38k promised stock = €10k actual. | ✅ Start |
| **July-Dec 2022** | Work alone, 7 days/week, no salary, liquidation. | ✅ First arc |
| **Late 2022** | First fridge. Pivot to fine food. | ✅ Pivot |
| **Early 2023** | Cheese counter. Instant success. | ✅ Cheese |
| **May 2023** | BURNOUT. Panic attacks. Close 1 week. Drop Sundays. | ✅ ~Month 10 |
| **Sept 2023** | Adopt Poncho. | ✅ Mandatory |
| **Oct 2023** | Building sale announced. | ✅ Early pressure |
| **July 2024** | Buy building. Bank error = €5k fine. | ✅ Achievement |
| **Sept 2024** | Lucas joins. | ✅ Mandatory |
| **Early 2025** | Henry joins. | ✅ After Lucas |

---

## 12. Characters

| Name | Role | Notes |
|------|------|-------|
| **Julien** | Player | Passionate, disorganized, resilient |
| **Poncho** | Dog | Mandatory. Fluffy. Mild effects. |
| **Lucas** | Employee | Chaotic, clutch in December, mandatory event |
| **Henry** | Employee | Reliable, only after Lucas |
| **Madame Malfait** | Building owner | Triggers building arc |
| **Geneviève** | Previous owner | Sold the struggling shop |

---

## 13. Known Issues to Fix

| Issue | Status | Priority |
|-------|--------|----------|
| **Events should be deterministic** | 🔴 Needs fix | CRITICAL |
| **End-game money too high (~€100k vs €50k target)** | 🔴 Needs fix | HIGH |
| **Post-building expenses too low** | 🔴 Needs fix | HIGH |
| Cheese scaling is broken (stays low) | 🔴 Needs fix | HIGH |
| Mislabeled pictures | 🔴 Needs fix | HIGH |
| Album not showing on main screen | 🔴 Needs fix | MEDIUM |
| Some events are boring/filler | 🟡 Review | MEDIUM |
| Some events happen too often/rarely | 🟡 Review | MEDIUM |
| Raclette trophy event can be missed | 🟡 Now documented | LOW |
| Starting money is €13k not €12k or €0 | 🟡 Minor | LOW |
| Family=0 game over needs better narrative | 🟡 Polish | LOW |

### New Documentation (Feb 2, 2026)
- See `BALANCE_REFERENCE.md` for exact target numbers
- See `EVENT_MAP.md` for complete event list and proposed fixed schedule

---

## 14. Alternative Endings

| Ending | Path | Tone |
|--------|------|------|
| **Building + Survival** | Balance sacrifices, get building, keep family | Triumphant |
| **No Building, Shop Survives** | Play it safe, skip building | Bittersweet |
| **Empire Builder** | Skip building, expand aggressively | Dark success — "you'll never stop" |
| **Family First** | Always choose family | Beautiful but shop barely makes it |
| **Burnout** | Push too hard | Game over — hospital |
| **Bankruptcy** | Loans you can't repay | Game over — financial ruin |
| **Family Collapse** | Neglect relationships | Game over — depression |

---

## 15. Change Log

| Date | Change | Source |
|------|--------|--------|
| Jan 29, 2026 | Created document | Claude reconstruction |
| Jan 29, 2026 | Added Notion source material | Notion page |
| Jan 29, 2026 | **COMPLETE REWRITE** with Julien's full design vision | Direct conversation |
