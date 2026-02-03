# Testing branch: mobile + i18n + JSON refactor

This branch (`testing/mobile-i18n-json-refactor`) is for developing the new structure **without touching main**. Do not merge to main until you're happy with the result.

## What’s done so far

- **Branch**: All work is on `testing/mobile-i18n-json-refactor` (main is unchanged).
- **Events extracted**: The events database lives in **`data/events.js`** and is loaded via `<script src="data/events.js"></script>`.
- **i18n (FR/EN)**: Language switcher on the title screen (EN | FR). Locale files: **`data/locales/en.json`** and **`data/locales/fr.json`**. Choice saved in `localStorage`. Title screen, difficulty labels, buttons, and in-game month names use the selected language. Event/choice text still in English for now.
- **Same behavior**: Game logic unchanged; no bugs introduced.

## How to run

- Open `index.html` in a browser (file:// or via a local server).
- If you use a simple HTTP server (e.g. `python3 -m http.server` or `npx serve`), run it from the project root so `data/events.js` is served correctly.

## Next steps (from the plan)

1. Convert events to `events.json` + `eventLogic.js` (optional).
2. Add more UI strings to locale files (e.g. story tab, glossary, end screen) and optionally event/choice text.
3. Extract CSS to `css/styles.css` and add responsive + mobile options (scrollable layout, optional landscape hint).

## Rollback

To go back to the previous single-file version:

- Checkout `main`, or
- Restore from `index.html` history and remove/ignore `data/events.js` and this README.
