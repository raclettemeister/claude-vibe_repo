# Translation plan: EN ↔ FR (planning only)

**Branch:** `translation/en-fr-plan` (from `last-efforts`)  
**Scope:** Move all user-facing hardcoded EN/FR into `data/locales/en.json` and `data/locales/fr.json`; fix any wrong-language strings in the JSON.  
**No implementation in this doc — planning and dissection only.**

---

## 1. Source of truth

| File | Role |
|------|------|
| `data/locales/en.json` | All English UI, events, story, glossary, belgian, photos, achievements, end screen, policies. |
| `data/locales/fr.json` | All French equivalents. Same key structure as en.json. |
| `index.html` | Should only reference keys via `getUI()`, `getNested()`, `data-i18n`, or inject from locale (e.g. story, glossary, belgian). No user-facing EN/FR strings. |
| `data/events.js` | Event structure and effects only. User-visible text should come from locale; any `description: () => \`...\`` or inline strings are fallbacks and should exist in locale. |
| `data/policies.json` | Uses `nameKey` / `descKey`; actual text is in locale under `policies.*`. |

---

## 2. Dissection: hardcoded strings to move or fix

### 2.1 `index.html` — by section

| Location (approx line) | Current state | Action |
|-------------------------|---------------|--------|
| **Easter egg modal** (~3203–3211) | "You found the secret egg!", "Thank you for playing...", "- Julien", "Thank you!" | Add keys to `ui` or `misc` in both JSON; replace with `getUI()` / `data-i18n`. |
| **Music control** (~3244–3246) | "Café Julien", "Peaceful", title="Play/Pause Music" | Add keys; use getUI or data-i18n. |
| **Test panel** (~2885) | "Test: Jump to building deadline (€75k)", alert "Start the game first (Begin Your Journey)" | Optional: add keys for consistency or leave as dev-only. |
| **Bug report mailto** (~3286–3287) | "Chez Julien Simulator – Bug Report", "What happened:" | Add keys if UI is shown in both languages; else keep EN. |
| **Version badge** (~3277) | `GAME_VERSION = "v4 — Maximum Effort"` | Could be keyed (e.g. `ui.gameVersion`) or stay as single string. |
| **Tab "Who is Julien?" content** (~2721–2759) | Static HTML paragraphs | **Already overridden by locale:** `setLanguage()` injects from `locale.story` (title + p1–p8). Initial HTML can stay as EN fallback or be emptied. Verify en.json story = EN, fr.json story = FR. |
| **Cheese Glossary / Belgian Terms** (~2762–2867) | Static HTML (terms + definitions) | **Already overridden by locale:** `setLanguage()` injects from `locale.glossary` and `locale.belgian`. Verify en.json and fr.json have correct language. |
| **Polaroid / photos** (POLAROID_PHOTOS ~3695–3719) | `title`, `description`, `date` in JS objects (mostly EN; one FR: "Chez Julien a 1 an!") | Used as fallbacks for `getPhotoTitle(id, fallback)`. Ensure `photos.<id>.title/description/date` exist in **both** en.json and fr.json with correct language; remove or fix wrong-language fallbacks in index.html. |
| **Achievements** (ACHIEVEMENT_DEFS ~3918–3936) | `name`, `description` in JS (EN) | Ensure `achievements` (or equivalent) in both JSON with correct language; code should use getUI/photo-style lookup. |
| **Status row warnings** (~6463–6498) | `warnings.push({ text: \`...\` })` with hardcoded EN | Replace with `getUI('game.warning_*', fallback)` and ensure keys exist in en/fr. |
| **Building deadline fallbacks** (~6573–6687, 6639–6687) | Many `choiceSrc[0]?.text || 'Sign the papers'`, outcome/hint strings in EN | Fallbacks when locale missing. Ensure `events.building_deadline` and `events.building_deadline_extended` in both JSON are complete; then fallbacks can stay EN for dev only or be removed. |
| **Cash crisis** (~6543) | `getNested(..., 'events.cash_crisis.dynamicDescription') || "You've used all 3..."` | Ensure key exists in both locales; fallback is EN. |
| **Polaroid caption/date** (~5313–5314) | Hardcoded "Chez Julien... chez moi...", "July 2022" | Use getPhotoDescription / getPhotoDate with keys; ensure photos.shop_front in both JSON. |
| **End screen** | Most use data-i18n or getUI; verify `end.*` and story/lessons built from locale. | Audit that all end-screen copy is keyed and correct in both JSON. |

### 2.2 `data/events.js`

| Location | Current state | Action |
|----------|---------------|--------|
| **building_countdown** (~1707) | `description: () => \`Building fund: €${...}\`...` (EN) | Event text should come from locale; this is fallback. Ensure `events.building_countdown.description` (or dynamic) in en/fr; optionally keep this as EN fallback. |
| **building_deadline** (~1727) | `description: () => \`The deadline is here...\`` (EN) | Same: locale has dynamicDescriptionCanAfford/CannotAfford; fallback is EN. |
| **building_deadline_extended** (~1775) | Same pattern | Same. |
| **Random restaurant** (~2322) | `\`A restaurant in ${[...]} wants...\`` (EN) | Add or use locale key with placeholder for area. |
| **Quiet month** (~2368) | `\`Something clicked this month...\`` (EN) | Ensure quiet_month in locale; fallback EN. |
| **Summer flood** (~121) | `description: () => { ... return \`...\` }` (EN) | Locale should have event; fallback EN. |

No other event copy should be in events.js; choices/outcomes come from locale by event id.

### 2.3 `data/locales/en.json` and `data/locales/fr.json`

| Check | Action |
|-------|--------|
| **Wrong language in en.json** | Any value that is French must be replaced with English. |
| **Wrong language in fr.json** | Any value that is English must be replaced with French. |
| **Missing keys** | If a key exists in one file but not the other, add it so structure is identical. |
| **Placeholders** | Keep `{{var}}` and placeholder names in sync between en and fr. |
| **photos.* and achievements** | Ensure every polaroid and achievement has title/description (and date where needed) in both files, in the correct language. |

---

## 3. Multi-agent assignment

Work is split so each agent has a bounded set of files/sections. No agent should change game logic or add features.

| Agent | Scope | Deliverables |
|-------|--------|--------------|
| **Agent A — Title & static content** | Title screen only. | (1) List every user-facing string in index.html for: tab-story initial HTML (or confirm locale only), tab-glossary/tab-belgian initial HTML (or confirm locale only), easter-egg modal, music control labels, version badge if keyed, bug report strings if keyed. (2) For each: either add a locale key and use getUI/data-i18n in index.html, or document "leave as-is (reason)". (3) Verify en.json/fr.json `story`, `glossary`, `belgian` are correct language. |
| **Agent B — In-game UI & fallbacks** | index.html in-game only. | (1) List all status-row warnings and replace with getUI keys; add keys to en/fr. (2) List all building_deadline/building_deadline_extended and cash_crisis fallback strings; ensure locale keys exist and document fallback policy. (3) Polaroid: ensure POLAROID_PHOTOS fallbacks match locale; list photos.* keys and ensure both locales have correct language. (4) Achievements: ensure ACHIEVEMENT_DEFS use locale; list keys; ensure both locales correct. (5) End screen: list any remaining hardcoded strings and key them. |
| **Agent C — Events & events.js** | data/events.js and event-related locale. | (1) List every `description: () => \`...\`` and any other user-visible string in events.js. (2) For each event id, ensure en.json and fr.json have the corresponding `events.<id>` entry with correct language. (3) Document which strings in events.js are kept as fallbacks (EN) and which are removed. (4) No change to event logic or effects. |
| **Agent D — Locale audit EN vs FR** | data/locales/en.json and data/locales/fr.json only. | (1) Full pass: list every key in en.json whose value is or contains French; list every key in fr.json whose value is or contains English. (2) Produce a checklist of key paths and suggested fix (e.g. "en.json story.p1: replace French phrase X with English Y"). (3) Verify key parity (same keys in both files). (4) No edits to index.html or events.js. |

---

## 4. Execution order (recommended)

1. **Agent D** first: locale audit so we have a single list of wrong-language strings.
2. **Agent C**: events.js and event locale keys so in-game events are clearly keyed.
3. **Agent A**: title screen and static content so language switch is complete.
4. **Agent B**: in-game UI, warnings, polaroids, achievements, end screen.

Then: fix all wrong-language values (from Agent D list), then pass tests and manual EN/FR playthrough.

---

## 5. Files to touch (summary)

| File | Agents | Changes |
|------|--------|---------|
| `data/locales/en.json` | A, B, C, D | Add keys if missing; fix any FR text; ensure structure matches fr.json. |
| `data/locales/fr.json` | A, B, C, D | Add keys if missing; fix any EN text; ensure structure matches en.json. |
| `index.html` | A, B | Replace hardcoded strings with getUI/data-i18n/inject from locale; add no new features. |
| `data/events.js` | C | Only document or minimal change (e.g. remove redundant EN if locale guaranteed). |
| `docs/TRANSLATION_PLAN.md` | All | This file; update when dissection or assignment changes. |

---

## 6. Out of scope

- Changing game balance, event logic, or new content.
- Adding new events or new UI features.
- Translating developer-only strings (e.g. test panel, console logs) unless product decision is to show them in both languages.

---

*Planning only. No implementation in this document. Implement in branch `translation/en-fr-plan` per CHE-62.*
