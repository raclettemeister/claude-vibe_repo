# NotebookLM Sources — Chez Julien Events

Upload these files as sources into Google NotebookLM to analyze and rework the event system.

## Files

| # | File | What It Contains |
|---|------|-----------------|
| 01 | `01-ALL-EVENTS-CURRENT-STATE.md` | Complete list of all 106 events with their current properties, effects, and choices (extracted from code) |
| 02 | `02-EVENT-MAP-DESIGN-INTENT.md` | Design document with proposed deterministic event schedule and categorization |
| 03 | `03-GAME-DESIGN.md` | Full game design document — philosophy, mechanics, win/lose conditions, difficulty |
| 04 | `04-BALANCE-REFERENCE.md` | Numerical balance targets — money, stress, difficulty, post-building economy |
| 05 | `05-EVENT-SELECTION-ENGINE.md` | How the code picks which event to show each month (priority cascade, month mapping) |
| 06 | `06-EVENT-CONDITIONS-AND-FLAGS.md` | Every condition that gates an event + every flag that events set (dependency map) |
| 07 | `07-EVENT-STORY-ARCS-AND-CHAINS.md` | How events connect into story arcs (cheese pivot, raclette, building, Sunday, hiring, Poncho, family) |
| 08 | `08-EVENTS-RAW-CODE-REFERENCE.md` | Raw event data from JavaScript with types, priorities, and effects breakdown |
| 09 | `09-REAL-LIFE-TIMELINE.md` | Real-life timeline mapped to game timeline, real characters, suppliers, locations |

## Suggested Questions for NotebookLM

- "Which events can never fire because their conditions are too strict?"
- "What happens in a playthrough where the player opens Sundays and buys the building?"
- "Which months have no events available? Which months are overcrowded?"
- "Map out the optimal path to get the Parmigiano invitation"
- "Which events feel like filler and could be removed or improved?"
- "What's the ideal deterministic schedule for all 42 months?"
- "Which story arcs have dead ends or missing conclusions?"
- "How does the raclette path interact with the building savings timeline?"
