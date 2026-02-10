# Chez Julien Simulator — Beta Tester Review

**Role:** Beta tester (automated playthrough + codebase review)  
**Build:** main-with-timeline-events (timeline-driven events, FR/EN)  
**Date:** February 2026

---

## Executive summary

**Verdict: Strong concept, clear identity, a few rough edges.**

The game does what it sets out to do: it makes you feel the weight of running a small shop, the tension of the building deadline, and the trade-off between money and life. The true story and the 42-month arc give it a clear identity. The timeline-driven event order fixes “story-driven, not random” and makes each run coherent. To reach “anyone who wants the building can get it on a first run, but it feels close,” a few balance and UX tweaks would help.

---

## What works well

### 1. **Concept and stakes**
- One sentence is clear: *transform a dying épicerie into a cheese shop without burning out or losing your people.*
- The €80k building by month 25 is a concrete, emotional goal.
- Win = “finish alive” works: building is a milestone, not the only success.

### 2. **Timeline and story**
- Fixed month→event map (sunday_opening → … → building_offer → building_deadline → meet_lucas → … → christmas_day) makes the story legible and repeatable.
- Alt events (e.g. building_countdown vs family_dinner) add variety without breaking the spine.
- Mandatory beats (first Christmas, building offer, Lucas, Henry, final Christmas) land in the right places.

### 3. **Systems that teach**
- **Sunday opening:** Feels good short-term, then stress catches up. The game teaches that it’s unsustainable; that’s well communicated.
- **Stress bands (40 / 60 / 70 / 80%):** Clear idea of “danger zone” and “one bad event away.”
- **Family vs work:** Choices like “Go to dinner” vs “Work comes first” have visible consequences (family stat, later endings).

### 4. **Tone and authenticity**
- Real photos, real place (Woluwe-Saint-Pierre), real milestones (Poncho, Lucas, Henry, building).
- End screen copy (“You OWN the building. That €80,000 scramble in 2024 was worth every stressed-out month.”) lands.
- FR/EN and Belgian terms (épicerie, fromagerie, AFSCA) support the tone.

### 5. **Technical**
- Timeline + locale load before first event avoids “Loading…” or wrong language.
- Building-deadline logic (no “Sign” when bank < 80k) is correct and tested.
- Playthrough from start to building event completes in a reasonable time (~1–2 min automated).

---

## Pain points & UX

### 1. **First-time clarity**
- New players may not know that **stress 60%+** is the danger zone until they hit a burnout. A short line in the stress tooltip (“Danger from 60%”) or one early event that says “Your stress is creeping up…” would help.
- **Building countdown:** “X months until July 2024 deadline” is clear once you know the story; a one-time hint (“Save €80,000 for the down payment”) could help casual players.

### 2. **Polaroid flow**
- Photo unlocks (polaroid overlay) can cover the **Continue** button after a choice. Players can feel stuck. Dismissing the polaroid (click or close) should always be obvious; consider a small “Next” or “Close” on the overlay so it’s clear the game is waiting on them.

### 3. **Choice feedback**
- After a choice, the outcome modal explains what happened; that’s good. Showing a short “Stress +10” (or similar) on the modal reinforces that choices have cost. If that exists, making it a bit more visible would help; if not, consider adding a one-line effect summary.

### 4. **Tabs and info**
- Stats / Team / Log / Bank give depth. For a first run, “what should I look at?” isn’t obvious. A single sentence on the first event (“Check the Stats tab to see how your choices affect you”) could ease people in.

### 5. **Mobile**
- UI/UX guide mentions mobile layout and touch. If polaroid or modals behave differently on small screens, that’s a good candidate for a dedicated pass (tap targets, scroll, overlay sizing).

---

## Balance & difficulty

### 1. **Building achievable but tense**
- Design goal: “Feel like you’re about to lose, but anyone who wants the building can get it on first playthrough.” With a family-oriented, “don’t hurt Julien” style (Sundays closed, family dinner, balance savings), the run reaches the building and can buy it. So the curve is in the right ballpark.
- Suggestion: If data shows many first-time players *just* miss 80k (e.g. 75–78k), consider one extra “catch-up” moment (e.g. a small bonus for high reputation or one optional side income) so the line between “made it” and “almost” stays narrow but fair.

### 2. **Stress and burnout**
- Sunday opening → burnout in 6–10 months is clear in design and feels that way in play.
- Post-burnout: forcing Sunday closure is a good lesson. Making it explicit in the burnout message (“From now on, you close on Sundays”) would reinforce it.

### 3. **Endgame economy**
- BALANCE_REFERENCE says: after building, expenses go up (loan, lifestyle, staff), so end balance should be ~€50k, not ~€100k. If the live build still trends toward €100k at month 42, tuning expenses/salary growth to match the “life is good but money normalizes” fantasy would complete the arc.

### 4. **Difficulty modes**
- Realistic / Forgiving / Brutal set different starting bank and stress. Forgiving should feel “I can afford a few mistakes”; Brutal “every euro and every choice matter.” A quick pass on Forgiving (e.g. building still tight but less punishing) and Brutal (building very hard, survival possible) would round out the offering.

---

## Narrative & authenticity

- **Strengths:** Real story, real stakes, real names and places. The mix of business (suppliers, AFSCA, raclette season) and personal (family dinner, birthday missed, Poncho) feels true.
- **Suggestions:**
  - One or two events that explicitly reference “you’re saving for the building” (e.g. “Every euro goes to the building fund”) would tie the middle months to the goal.
  - If “Family first” / “Life balance” endings are meant to feel like valid wins, the end screen copy already helps; making sure they’re unmissable (e.g. in the achievements list or a short “Your story” summary) would underline that not buying the building can still be a satisfying ending.

---

## Bugs & technical notes

1. **Merge conflicts (fixed in branch):** `index.html` had leftover conflict markers in `startGame()` (locale/timeline + `selectNextEvent`). Resolved so the game starts and the first event loads. **Recommendation:** Before next release, run a quick search for `<<<<<<<`, `=======`, `>>>>>>>` in the repo.
2. **Event validation:** Console reports validation issues (e.g. `summer_flood` empty choices, building_deadline choices). These don’t block play but are worth fixing so all events have valid choice arrays and no validator warnings.
3. **Test hook:** `?test=1` and `__testJumpToBuildingDeadline` are correctly gated; ensure they’re never linked or exposed in production.

---

## Recommendations (priority)

| Priority | Item |
|----------|------|
| **P0** | No merge conflicts or validation errors in shipped build. |
| **P1** | Polaroid overlay: always an obvious way to dismiss (and never block Continue). |
| **P1** | Stress: make “danger from 60%” visible (tooltip or one early message). |
| **P2** | One sentence of onboarding (e.g. “Check Stats to see how choices affect you”). |
| **P2** | Endgame economy: if not already there, tune so post-building balance trends toward ~€50k. |
| **P3** | Optional “building countdown” hint for first-time players (€80k, July 2024). |
| **P3** | Forgiving/Brutal pass so they feel distinct and both winnable in the intended way. |

---

## One-liner for the box

*“A narrative business sim that makes you feel the weight of every month—and the cost of the dream.”*

---

*Review based on automated playthrough to building event, design docs (GAME_DESIGN.md, BALANCE_REFERENCE.md, UI_UX_GUIDE.md), timeline and locale content, and TESTING.md. No human playthrough of the full 42 months.*
