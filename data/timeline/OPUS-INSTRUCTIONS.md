# Instructions for Opus 4.6 — Fill the 42-Month Timeline

You are helping plan the **event timeline** for the game *Chez Julien*: one event per month for 42 months, **no more random** selection.

## Your task

1. **Read** (in this order):
   - **COMPLETE-EVENT-REGISTRY.md** — single source of truth: all 106 pool events, system-triggered (burnout, cash_crisis), photo keys, implementation quirks. Ensures you have everything from the code.
   - **PLANNING-GUIDE-FOR-AI.md** — calendar, mandatory events, event chains, suggested draft, rules.
   - **EVENTS-REFERENCE.md** — full list of valid `event_id` values (use only these in the CSV).

2. **Open** `42-months-template.csv`. It has 42 rows (month 1–42), columns:
   - `month_index` (1–42)
   - `calendar` (e.g. Jul 2022, Dec 2025)
   - `event_id` — **you fill this** with one event ID per month
   - `notes` — optional short note for the human

3. **Fill** the `event_id` column:
   - Use **exactly** the mandatory events in the months specified in the planning guide (months 1, 6, 18, 25, 26, 27, 30, 42, plus adopt_dog in 14–16, building_offer in 17–18, first_raclette_season in 16 if desired).
   - For other months, pick one event from EVENTS-REFERENCE that fits the story phase and dependency chains (see planning guide).
   - Use `quiet_month` for a month with no strong event, or leave `event_id` empty if that is allowed.
   - Each **unique** event must appear at most **once** in the 42 months. **Recurring** events can appear multiple times.

4. **Output** for the human:
   - Either the **full filled CSV** (all 42 rows with your `event_id` and optional `notes`), or
   - A clear **list**: `month_index, event_id` (and optional notes) so they can paste into the template.

The human will **review** your CSV and iterate with you (ping-pong) to adjust events and pacing.

## Files in this folder

| File | Purpose |
|------|--------|
| **42-months-template.csv** | Template to fill (one row per month). |
| **PLANNING-GUIDE-FOR-AI.md** | All context: calendar, mandatory events, chains, suggested draft, rules. |
| **EVENTS-REFERENCE.md** | Every valid `event_id` with title and month range. |
| **OPUS-INSTRUCTIONS.md** | This file — your task and steps. |
| **README.md** | Human-facing overview of the timeline project. |
| **timeline.json** | Optional: same plan as JSON for future game import. |

## Important

- **Mandatory events** and their months are fixed; do not move them.
- **Order matters:** e.g. adopt_dog before dog_in_shop; meet_lucas before lucas_brings_henry; building_offer before building_deadline.
- Use only **event_id** values that exist in EVENTS-REFERENCE.md (exact spelling, e.g. `first_christmas`, not `first Christmas`).
