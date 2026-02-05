# Pixel Art Scene — Complete Reference

> **Purpose:** Document everything implemented in the pixel art shop windows, and outline a safe workflow for reworking them (Tamagotchi-like dynamism, more events, more things happening).

---

## Architecture Overview

| Component | Location | Purpose |
|-----------|----------|---------|
| **Canvas** | `#shop-art` (320×180px) | Main game screen — visible during gameplay |
| **Canvas** | `#pixel-canvas` (320×180px) | End screen — same scene on game-over |
| **Module** | `js/pixel-scene.js` | Extracted pixel logic — `PixelScene.drawPixelScene(gameState)` |
| **Entry point** | `PixelScene.drawPixelScene(gameState)` | Renders to both canvases; receives state as parameter |
| **Main renderer** | `renderShopToCanvas(ctx, W, H, gameState)` | All scene logic in pixel-scene.js |
| **Animation loop** | `animatePixelScene()` in index.html | `requestAnimationFrame` → calls `PixelScene.drawPixelScene(gameState)` |
| **State source** | `gameState` (passed in) | All decisions, flags, stats drive what appears |

The scene is **re-rendered every frame** (~60fps). All drawing is procedural (canvas 2D API, no sprite sheets). `Date.now()` is used for simple time-based animation (bobbing, pecking, wing flaps).

---

## What's Currently Implemented

### Core Scene Elements
| Element | Function | gameState / condition |
|---------|----------|------------------------|
| Sky + gradient | Inline in `renderShopToCanvas` | Season (month 1–12) |
| Sun / Moon / Clouds | Inline | Winter → clouds; other seasons → sun |
| Distant buildings | Inline | Horizon silhouette |
| Left neighboring building | Inline | Fixed |
| Right neighboring building | Inline | Fixed |
| Main shop (brick wall) | `drawBrickWall()` | Fixed |
| Cornice / roof | Inline | Fixed |
| Seasonal critter on roof | `drawSeasonalCritter()` | Month: pigeon (autumn), squirrel (winter), bird (spring), butterfly (summer) |
| Upper-floor windows | `drawWindow16()` | 3 windows, lit |
| Awning | Inline | Green striped, scalloped |
| Shop window (display) | Inline + `drawCheeseDisplay()` | Cheese if `cheeseTypes >= 5` |
| Shop door | Inline | Fixed |
| Shop sign "CHEZ JULIEN" | Inline | `shopRenamed` or `monthsPlayed > 5`; gold trim if `signInstalled` |
| Sidewalk / street | Inline | Fixed |

### Dynamic Elements (Decision-Driven)
| Element | Function | Condition |
|---------|----------|-----------|
| Flower box | `drawFlowerBox()` | `monthsPlayed > 10`; flowers only if not winter |
| Julien | `drawJulienInShop()` | Present unless Lucas+Henry both hired; position shifts with Lucas |
| Lucas | `drawCharacter16(ctx, x, y, 'lucas')` | `hasLucas` |
| Henry | `drawCharacter16(ctx, x, y, 'henry', true)` | `hasHenry` (behind window) |
| Poncho | `drawPoncho16()` | `hasDog` |
| Customers (left) | `drawCharacter16(..., 'customer0/1/2')` | Count = floor(reputation / 30), max 3 |
| Customer queue (right) | `drawCustomerQueue()` | `reputation > 70`; count scales with rep |
| Cheese display | `drawCheeseDisplay()` | `cheeseTypes >= 5` |
| Wine display | `drawWineDisplay()` | `hasWineSelection` |
| Raclette steam | `drawRacletteSteam()` | `hasRaclette` or `racletteTypes > 0` |
| Belgian flag | `drawBelgianFlag()` | Month 7 (July 21) |
| Christmas decorations | `drawChristmasDecorations()` | Month 11 or 12 |
| Lucia painting | `drawLuciaPainting()` | Christmas + family > 50 + time-based chance |
| Anniversary party decorations | `drawPartyDecorations()` | `monthsPlayed` 12, 24, or 36 |
| SOLD banner | `drawSoldBanner()` | `ownsBuilding` + `monthsSinceBuilding < 2` |
| Building ownership badge (★) | Inline | `ownsBuilding` |

### Weather / Atmosphere
| Element | Function | Condition |
|---------|----------|-----------|
| Snow | `drawSnow()` | Winter (month 12, 1, 2) |
| Rain + flood water | `drawRain()`, `drawFloodWater()` | `floodActive` (summer flood event) |
| Leaves | `drawLeaves()` | Autumn |
| Petals | `drawPetals()` | Spring |
| Night mode (darkening) | `drawNightMode()` | `stress > 55` |

### Helper / Drawing Functions
| Function | Purpose |
|----------|---------|
| `drawCloud()` | Winter clouds |
| `drawBrickWall()` | Brick texture |
| `drawWindow16()` | Lit/unlit windows, optional shutters |
| `drawCheeseDisplay()` | Cheese shelves + variety scaling |
| `drawSeasonalCritter()` | Pigeon / squirrel / bird / butterfly |
| `drawFlowerBox()` | Box + seasonal flowers |
| `drawCharacter16()` | Lucas, Henry, customers (lucas, henry, customer0/1/2) |
| `drawJulienInShop()` | Julien with apron, breathing animation |
| `drawPoncho16()` | Dog sprite with wag animation |
| `drawSnow()` | Falling snow particles |
| `drawRain()` | Rain streaks |
| `drawFloodWater()` | Water level at bottom |
| `drawLeaves()` | Falling autumn leaves |
| `drawPetals()` | Falling spring petals |
| `drawChristmasDecorations()` | Lights, wreath, etc. |
| `drawNightMode()` | Overlay darkening by stress |
| `drawRacletteSteam()` | Steam effect |
| `drawWineDisplay()` | Wine bottles in window |
| `drawCustomerQueue()` | Queue of small customer sprites |
| `drawBelgianFlag()` | Belgian flag |
| `drawPartyDecorations()` | Banners, balloons |
| `drawLuciaPainting()` | Lucia at window |
| `drawSoldBanner()` | "VENDU!" banner |

### gameState Fields Used by Pixel Scene
- `month`, `monthsPlayed`, `year`
- `openSunday`, `hasDog`, `hasLucas`, `hasHenry`
- `cheeseTypes`, `racletteTypes`, `hasRaclette`, `hasWineSelection`
- `shopRenamed`, `signInstalled`
- `reputation`, `stress`
- `ownsBuilding`, `monthsSinceBuilding`
- `floodActive`
- `family`

---

## Safe Workflow for Reworking

### 1. Use a Git Branch
```bash
git checkout -b pixel-art-rework
```
All pixel art changes stay isolated. Merge only when stable.

### 2. Extract to Separate Module (DONE)
Pixel logic is now in `js/pixel-scene.js`:
- `PixelScene.drawPixelScene(gameState)` — renders to both canvases
- `PixelScene.renderShopToCanvas(ctx, W, H, gameState)` — core renderer (also exposed for testing/playground)
- All `draw*` helpers are internal to the module
- State is passed as parameter — no global dependency

### 3. Pixel Scene Playground (Optional)
Create `pixel-playground.html`:

- Loads only `pixel-scene.js` + a minimal `gameState` mock
- UI sliders for: `month`, `reputation`, `stress`, `hasDog`, `hasLucas`, etc.
- Live canvas that updates when sliders change
- No events, no game logic — pure visual iteration

This lets you:
- Test new sprites/animations without playing through the game
- Quickly see how the scene looks at different states
- Avoid breaking `index.html` during heavy pixel work

### 4. Regression Checklist
Before merging pixel-art-rework into main:

- [ ] `drawPixelScene()` still renders to both `#shop-art` and `#pixel-canvas`
- [ ] `animatePixelScene()` is still started when the game screen is shown
- [ ] `gameState` fields used by the scene are unchanged (or migration is documented)
- [ ] No new dependencies that could fail in production
- [ ] Balance tests still pass: `python3 tests/balance_test_suite.py`

---

## Ideas for Tamagotchi-like Dynamism

*For future expansion — not yet implemented:*

- **Idle animations:** Characters occasionally wave, scratch head, serve a customer
- **Time-of-day:** Morning/afternoon/evening lighting (e.g. based on `month` + `stress` or phase)
- **More events in scene:** Delivery van, AFSCA inspector, wedding march, ambulance (hospital event)
- **Poncho behavior:** Sleeping, playing, begging at door
- **Window lights:** Turn on/off based on time or stress
- **Queue animation:** Customers move slowly toward door
- **Open/closed sign:** Flip when Sunday vs not
- **Seasonal produce:** Pumpkins in autumn, Easter eggs in spring
- **Burnt-out mode:** Dim lights, closed sign, no Julien visible
- **Building work:** Scaffolding during upgrade events

---

## Line Ranges (for quick navigation)

| Block | Location |
|-------|----------|
| Pixel scene CSS | index.html ~1482–1497 |
| Canvas HTML | index.html ~2460, 2654–2655 |
| `animatePixelScene` | index.html ~6131–6137 |
| All pixel logic | `js/pixel-scene.js` (full file) |
