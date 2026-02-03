# Testing branch: mobile + i18n + JSON refactor

This branch (`testing/mobile-i18n-json-refactor`) is for developing the new structure **without touching main**. Do not merge to main until you're happy with the result.

## What’s done so far

- **Branch**: All work is on `testing/mobile-i18n-json-refactor` (main is unchanged).
- **Events extracted**: The events database is no longer inline in `index.html`. It lives in **`data/events.js`** and is loaded via `<script src="data/events.js"></script>`.
- **Same behavior**: Game logic is unchanged; only the location of the events array moved. `index.html` is shorter; the rest of the plan (locales, responsive, etc.) can follow.

## How to run

- Open `index.html` in a browser (file:// or via a local server).
- If you use a simple HTTP server (e.g. `python3 -m http.server` or `npx serve`), run it from the project root so `data/events.js` is served correctly.

## Next steps (from the plan)

1. Convert events to `events.json` + `eventLogic.js` (optional; current setup already works).
2. Add `data/locales/en.json` and `fr.json` + language switcher.
3. Extract CSS to `css/styles.css` and add responsive + mobile options (scrollable layout, optional landscape hint).

## Rollback

To go back to the previous single-file version:

- Checkout `main`, or
- Restore from `index.html` history and remove/ignore `data/events.js` and this README.
