# Achievements & Photo Album — Audit

Branch: `feature/achievements-audit`. This doc answers: what achievements exist, how to get them, what happens for platinum, how achievements relate to the album, and whether every achievement is achievable in the current version.

---

## 1. All achievements and how to get them

**End screen:** 20 achievements (shown once per run).  
**Persistent (title screen bar):** 19 trophies saved in `localStorage` under `chezJulien_trophies`. **Family First** is end-screen only (not saved to the persistent list).

| # | Key | Display name (EN) | How to unlock |
|---|-----|-------------------|----------------|
| 1 | `ach_homeowner` | Homeowner | Own the building (buy it by the deadline). |
| 2 | `ach_family_first` | Family First | Complete 43 months without owning the building, 0 burnouts, family ≥ 80%. *(End-screen only; not in persistent bar.)* |
| 3 | `ach_empire` | Empire Builder | Open a second shop (choose expansion in `expansion_dream` or `second_shop_offer`). |
| 4 | `ach_enough` | Enough | Decline expansion in a second-shop event, end with family ≥ 60% and stress ≤ 40%. |
| 5 | `ach_cheese_master` | Cheese Master | Have ≥ 80 cheese types at end. |
| 6 | `ach_raclette` | Raclette Master | Unlock Raclette Kingdom and have ≥ 20 raclette types. |
| 7 | `ach_dog` | Dog Parent | Adopt Poncho (event `adopt_poncho`). |
| 8 | `ach_team` | Team Builder | Hire both Lucas and Henry. |
| 9 | `ach_balance` | Work-Life Balance | Complete with family ≥ 70%, stress ≤ 40%, no burnout; if you own the building, must have “chez soi” for (months after purchase − 1) months. |
| 10 | `ach_generous` | Maximum Effort | Complete with Salary policy = High (and salary started). |
| 11 | `ach_delegation` | Delegation Master | Autonomy ≥ 60% at end. |
| 12 | `ach_sunday` | Sunday Protector | Never open on Sundays and complete the game. *(Persistent save only when game completed.)* |
| 13 | `ach_producer` | Producer Friend | Visit producers ≥ 2 times. |
| 14 | `ach_king` | King of Cheeses | Do the Parmigiano trip (event `parmigiano_invitation`). |
| 15 | `ach_party` | Life of the Party | Throw the big birthday party (`birthday_party`). |
| 16 | `ach_survivor` | Survivor | Reach month 43 (game over reason = completed). |
| 17 | `ach_mogul` | The Mogul | End with bank ≥ €100,000. |
| 18 | `ach_debt_free` | Debt Free | Complete with loan = 0. |
| 19 | `ach_never_crashed` | Never Crashed | Complete without ever having a burnout. |
| 20 | `ach_full_menu` | Full Menu | Have both charcuterie and wine selection. |


**Events that set Empire / Enough:**  
- `expansion_dream` (months 28–40): condition `bank >= 80000 && reputation >= 80 && hasHenry && !ownsBuilding`. One choice sets `hasSecondShop: true`, the other `declinedExpansion: true`.  
- `second_shop_offer` (months 36–42): condition `bank >= 80000 && !ownsBuilding`. Same two flags.  
So **Empire Builder** and **Enough** are both achievable in the current version.

---

## 2. What happens when you get the platinum?

There is **no separate “platinum event”**. Platinum is a **title-screen display** only:

- **When:** On load and when opening the title screen, `updatePersistentAchievementDisplay()` runs.
- **Logic:** It counts `persistentTrophies.length`. If `count >= OBTAINABLE_TROPHY_COUNT` (currently **16**), the platinum block shows as **unlocked** (🏆 PLATINUM TROPHY + description). Otherwise it shows 🔒 Platinum Trophy + “Unlock all 16 achievements across multiple runs”.
- **Storage:** Persistent trophies are saved at **game end** in `checkAndSaveTrophies()` (called from `populateAndShowEndScreen()`). No extra popup or cutscene for platinum; the bar and platinum status just update the next time the player sees the title screen.

So: get 16 of the 18 persistent trophies across any number of runs → next time you’re on the title screen, platinum appears as unlocked.

---

## 3. Relationship between achievements and the photo album

**They are separate systems.**

- **Achievements:** 20 on end screen; 18 persistent (Family First is end-screen only and not saved to the bar). Stored in `chezJulien_trophies`. No photos.
- **Album:** 25 photos in `POLAROID_PHOTOS`. Unlocked by events / state; stored in `chezJulien_photos`. First unlock can trigger a **polaroid overlay** (popup). Album is openable from the title screen and in-game (📸 Photo Album).

**Not every achievement has a matching photo**, and **not every photo has a matching achievement**. Overlap by theme:

| Achievement | Album photo(s) that match thematically |
|-------------|----------------------------------------|
| Homeowner | `building_keys` (The Keys) |
| Empire Builder | — |
| Enough | — |
| Cheese Master | `cheese_wall` (50+ varieties; achievement is 80+) |
| Raclette Master | `raclette_kingdom` |
| Dog Parent | `poncho`, `poncho_grown`, `poncho_surgery`, `family_visit` |
| Team Builder | `team_photo`, `henry_joins`, `lucas_joins` |
| King of Cheeses | `parmigiano_dream` |
| Life of the Party | `shop_party` |
| Survivor / general | Many story photos (shop_front, flood, etc.) |
| Full Menu | `julien_cheese`, `wine_evening` |

**Update (unified design):** Achievement and album are the same system for unlocks: **every achievement unlocks one photo**. The album is bigger than the achievement list (27 photos total; 18+1 achievements each unlock one photo; the rest are story-only). See `ACHIEVEMENT_TO_PHOTO` in `index.html` and new photos `second_shop`, `sunday_rest`. Family First unlocks `family_visit`.

---

## 4. Is every achievement achievable in the current version?

**Yes.** All 20 end-screen achievements can be earned in the current build:

- **Empire Builder** and **Enough:** Set by `expansion_dream` and `second_shop_offer` in `data/events.js` (see §1). The in-code comment that “Empire Builder and Enough have no in-game triggers” is **outdated**; the triggers exist.
- All other achievements are gated only by normal game state and events that already exist.

**Platinum:** The game treats **16** of the 18 persistent trophies as “obtainable” for platinum (`OBTAINABLE_TROPHY_COUNT = 16`). Empire and Enough are **not** required to show platinum as unlocked. So you can get platinum without ever seeing the second-shop events. If you want platinum to mean “all 18 persistent trophies”, change `OBTAINABLE_TROPHY_COUNT` to `18` and update the UI string (e.g. “Unlock all 18 achievements”) accordingly.

---

## 5. Where in the code

| What | Where |
|------|--------|
| End-screen achievement list (unlock conditions) | `index.html`: `populateAndShowEndScreen()` → `achievements` array (~7638–7659) |
| Persistent trophy definitions | `index.html`: `allTrophies` (~3917–3936) |
| Persistent save / platinum display | `index.html`: `checkAndSaveTrophies()`, `updatePersistentAchievementDisplay()` (~3950–4004) |
| OBTAINABLE_TROPHY_COUNT | `index.html`: ~3941 |
| Photo album entries | `index.html`: `POLAROID_PHOTOS` (~3695–3719) |
| Photo unlock check | `index.html`: `checkPhotoUnlocks(eventId)` (~3835), called after events and at game end |
| Empire / Enough events | `data/events.js`: `expansion_dream`, `second_shop_offer` |

---

## 6. Album entries without a proper photo (icon only)

All album entries that are linked to achievements now have real photos in `extracted_photos/`: `second_shop`, `sunday_rest`, `raclette_kingdom`, and `burnout_recovery` (La remontée).

**“La remontée”** = the burnout recovery moment: after you had a burnout, you came back. Different, but stronger. The FR/EN descriptions now spell this out (“Après un burnout : …” / “After a burnout: …”).

---

## 7. Summary

- **20** achievements on end screen; **19** persistent trophies (Family First not saved).
- **Platinum** = 17/19 persistent trophies (OBTAINABLE_TROPHY_COUNT); no special event, just title-screen display.
- **Album** = 27 photos; every achievement unlocks one photo; all achievement-linked entries have real photos (see §6).
- **All achievements are achievable** in the current version; Empire and Enough are set by existing events.
