# Chez Julien — Balance Reference

> **Last Updated:** February 2, 2026
> **Source:** Direct conversation with Julien
> **Purpose:** Actual numbers for game balance — what GAME_DESIGN.md was missing

---

## The Core Concept (Critical)

The game is about **sacrifice vs. lifestyle**.

**Early game:** You can save aggressively because expenses are low. But you sacrifice everything — family, health, sanity.

**Building purchase:** Barely achievable. Requires maximum sacrifice. Should feel like "I barely made it."

**Late game:** You choose comfort. Expenses go UP (car, insurance, staff, lifestyle). Cash generation goes DOWN. But stress is low, energy is high, family is happy.

> "As soon as you get the building, the guy wants to have a lifestyle, so he starts spending more money. You get more comfortable, energy stays high, stress levels stay low, family goes higher — all in exchange for more money."

---

## Money Targets

| Phase | Target Balance | Notes |
|-------|----------------|-------|
| Start | Low (€0 or €12k) | Beginning of journey |
| Month 10 | Building up savings | Sacrifice mode |
| Month 17-18 | Building announced | Player feels "shit, I'm not ready" |
| Month 25 | €80,000 | Building deadline — barely achievable |
| Month 42 (End) | ~€50,000 | NOT €100,000 — expenses ate into savings |

### The Problem to Fix
Currently the game ends at ~€100,000. This is WRONG.

After buying the building, expenses should increase dramatically:
- Building loan payments
- Higher rent/insurance
- Business car
- More staff (Lucas, Henry)
- Your own salary
- Lifestyle upgrades

**Result:** High income but high expenses = net savings decrease. End at ~€50k, not €100k.

---

## Economy Formula

### Early Game (Months 1-15)
- **Income:** Low to medium
- **Expenses:** Very low
- **Net:** Positive, allows saving
- **Player state:** Sacrifice everything, build cash pile

### Building Countdown (Months 15-25)
- **Income:** Growing
- **Expenses:** Still low
- **Net:** Maximum saving potential
- **Player state:** Panic, sacrifice harder, barely reach €80k

### Post-Building (Months 25-42)
- **Income:** HIGH
- **Expenses:** HIGH (lifestyle upgrade)
- **Net:** Much smaller than before, possibly negative months
- **Player state:** Comfortable, spending money on quality of life

### The Inversion
```
Early:  Low income  + Very low expenses = Can save aggressively
Late:   High income + High expenses     = Hard to save, but life is good
```

---

## Stress & Burnout

### Thresholds
| Level | State |
|-------|-------|
| 0-40% | Safe |
| 40-60% | Elevated, be careful |
| 60-70% | **DANGER ZONE** — high burnout risk |
| 70-80% | Critical — burnout very likely |
| 80%+ | **BURNOUT TRIGGERS** |

### Event Impact
Some events add up to **+20 stress**. This means:
- At 60% stress, a bad event can push you to 80% → instant burnout
- At 70% stress, you're one bad choice away from collapse

### Sunday Opening
- Opening Sundays adds stress EVERY month
- Burnout is **guaranteed** between month 6-10 if Sundays open
- This is intentional — teaches player it's unsustainable

---

## Stat Trade-offs (Post-Building)

After buying the building, player can choose comfort:

| Choice | Money | Stress | Energy | Family |
|--------|-------|--------|--------|--------|
| Hire Lucas | −−− | −− | + | + |
| Hire Henry | −−− | −− | ++ | + |
| Get car | −− | − | + | + |
| Take salary | −− | 0 | 0 | ++ |
| Apartment upstairs | −− | − | + | ++ |
| Cleaning service | − | − | + | 0 |

**The pattern:** Spend money → reduce stress → improve energy/family

With full team + all comforts:
- Game becomes EASY
- Income flattens (high costs)
- But life is good
- This is the REWARD for surviving the building grind

---

## Cheese Count (In-Game Mechanic)

The game tracks how many cheeses you have on display. This is a visible stat that grows throughout the game based on your choices.

### Progression
| Cheese Count | Stage | Notes |
|--------------|-------|-------|
| 1 | Start | Your first cheese |
| 5 | Early growth | Building selection |
| 10 | Getting known | Customers notice variety |
| 20 | Established | Respectable selection |
| **25** | 🏆 Achievement unlocks | Event triggers, need new counter |
| 35-40 | Growing reputation | Becoming a destination |
| **50** | 🏆 Achievement unlocks | Where most players end |
| 75 | Dedicated focus | Serious cheese shop |
| **100** | 🏆 Achievement unlocks | Maximum, requires full commitment |

### Achievement Milestones
- **25 cheeses:** Achievable naturally through normal play
- **50 cheeses:** Where a normal playthrough ends
- **100 cheeses:** Requires dedicating entire playthrough to growing cheese count — you'll sacrifice other goals to get here

---

## Tension Curve (The Emotional Journey)

### Act 1: Survival (Months 1-10)
**Feeling:** Learning, experimenting, sometimes panic

- Player discovers that choices have drastic effects
- Sunday opening teaches the burnout lesson
- First Christmas is uncertain, learning the ropes
- First burnout likely if not careful

### Act 2: The Grind (Months 11-25)
**Feeling:** Intense pressure, sacrifice, "can I make it?"

- Month 17-18: Building announced → "Oh shit, I'm not ready"
- Countdown begins — 8 months to save €80k
- Must sacrifice: skip weddings, ignore friends, risk burnouts
- Every choice becomes "money vs. everything else"
- Tension builds and builds

### Act 3: The Climax (Month 25)
**Feeling:** Maximum tension → release

- Building deadline arrives
- Player either has €80k or doesn't
- If yes: **TRIUMPH** — should feel like standing up and cheering
- If no: Option to extend (€5k for one month) or let go

### Act 4: The Reward (Months 26-42)
**Feeling:** Relief, comfort, completion

- Building owned, pressure drops
- Now spending on lifestyle (car, staff, apartment)
- Game becomes easier
- Focus shifts to fluff, achievements, closure
- Final Christmas — family vs. shop choice
- End with ~€50k, good stats, feeling accomplished

---

## Events: The New Rule

### NO MORE RANDOMNESS

> "I might as well remove all chance factors and have complete control of which event happened which month."

**Old system:** Events had % chances, some never appeared, inconsistent experience
**New system:** Every event has a FIXED month, same story every playthrough

### Event Categories (Revised)

| Type | Behavior |
|------|----------|
| **MANDATORY** | Fixed month, always happens |
| **STORY** | Fixed month, always happens (story beats) |
| **CHOICE** | Fixed month, player picks between options |
| **FILLER** | Can be removed or assigned to specific months |

### What's Needed
A complete EVENT_MAP.md that lists:
- Every event in the game
- Which month it should trigger
- What stats it affects
- What choices are available

---

## Choice Impact Values

Every choice should feel meaningful. The player should always be thinking:

> "What am I willing to sacrifice to achieve this goal?"

### Good Choice Design
- Clear trade-off (money vs. family, stress vs. income)
- Impactful numbers (not +1/-1, but +10/-15)
- No "obviously correct" answer
- Reflects real dilemmas from the shop

### Bad Choice Design
- One option clearly better
- Tiny stat changes (feels pointless)
- Random outcome (player can't plan)
- No connection to the story

---

## Summary: What Makes This Game Work

1. **Early sacrifice enables the dream** — You CAN buy the building, but only by giving up everything else

2. **The building is the climax** — Maximum tension, barely achievable, triumphant release

3. **Lifestyle is the reward** — After the grind, you EARN the right to spend money and be happy

4. **Deterministic story** — Same events, same order, choices matter but narrative is consistent

5. **End state is comfortable, not rich** — €50k, good stats, employees, car, apartment. Life is good. Money is "enough."

---

## For Future AI Assistants

This document contains the ACTUAL NUMBERS that GAME_DESIGN.md was missing. When balancing:

1. **Check money curve** — Should end at ~€50k, not €100k
2. **Check stress thresholds** — Burnout at 80%, danger at 60-70%
3. **Check post-building expenses** — Must be HIGH enough to eat into savings
4. **Check event determinism** — No random triggers, fixed months
5. **Check tension curve** — Building purchase should feel triumphant

If the game feels too easy late-game, expenses are too low.
If the game ends with €100k, something is broken.
If events feel random, the deterministic system isn't working.

---

## Family-First Balance (Tested Feb 2026)

**Design goal:** It should be **very hard** to get the building if you consistently choose family over work.

**Simulation (balance-test.js / Python):** A "family first" run with:
- No Sunday opening (prioritise rest/family)
- Family choices when offered: wedding (-€2k), hospital (-€4k), week off (-€4.5k), long weekend (-€2.5k), relationship balance (-€1.5k), close Sundays (-€1.2k), delegation (-€2k), smaller family costs
- Moderate cheese/reputation growth (less time grinding business)

**Result:** Bank at month 25 ≈ **€35k** — short of €80k by **~€45k**. Building is **not** reached.

**Conclusion:** Current economy and event costs already make the building very hard when choosing family. No change required unless playtesting shows it still feels achievable; then consider increasing building cost (e.g. €85k) or family-choice penalties.

---

*"The story is sacrifice, then reward. Make the sacrifice feel real. Make the reward feel earned."*
