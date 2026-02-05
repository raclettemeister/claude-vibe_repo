# Pixel Art Foundation Guide

## 🏗️ Phase 1 Complete: Foundation Architecture

The foundation systems are now in place. This guide explains how to use them.

---

## 📚 Available Systems

### 1. Color Palette System (`PALETTE`)

**Location**: `window.PixelSceneHelpers.PALETTE`

**Usage**:
```javascript
const helpers = window.PixelSceneHelpers;
const skyColor = helpers.PALETTE.sky.morning[0]; // '#FFB347'
const brickColor = helpers.PALETTE.buildings.brick[0]; // '#8B7355'
```

**Structure**:
- Organized by category (sky, buildings, characters, windows, environment)
- Each category has sub-categories (e.g., `sky.morning`, `buildings.brick`)
- Colors are arrays ordered from darkest to lightest (for shading)

**Example - Drawing a shaded brick wall**:
```javascript
const brickColors = helpers.PALETTE.buildings.brick;
helpers.DrawingHelpers.drawShadedRect(ctx, x, y, w, h, brickColors, 'top-left');
```

---

### 2. Sprite System (`SpriteSystem`)

**Location**: `window.PixelSceneHelpers.SpriteSystem`

**Purpose**: Define reusable sprites with animation support

**Usage**:
```javascript
const sprite = helpers.SpriteSystem.createSprite({
    width: 32,
    height: 32,
    frames: [
        { data: [...], duration: 200 }, // frame 1
        { data: [...], duration: 200 }, // frame 2
    ],
    palette: ['#color1', '#color2'],
    hasShadow: true,
    hasOutline: true,
    layer: 'foreground'
});

// Draw sprite
helpers.SpriteSystem.drawSprite(ctx, sprite, x, y, frameIndex);
```

**Note**: Sprite data format will be defined as we create actual sprites in later phases.

---

### 3. Layered Rendering System (`LayerSystem`)

**Location**: `window.PixelSceneHelpers.LayerSystem`

**Purpose**: Organize rendering order (background → foreground)

**Usage**:
```javascript
// Add draw calls to layers
helpers.LayerSystem.addToLayer('background', (ctx) => {
    // Draw sky
}, 0);

helpers.LayerSystem.addToLayer('midground', (ctx) => {
    // Draw buildings
}, 0);

helpers.LayerSystem.addToLayer('foreground', (ctx) => {
    // Draw characters
}, 0);

// Render all layers in order
helpers.LayerSystem.renderLayers(ctx);

// Clear when done
helpers.LayerSystem.clear();
```

**Layers** (in render order):
1. `background` - Sky, distant elements
2. `midground` - Buildings, shop interior
3. `foreground` - Characters, close objects
4. `effects` - Particles, overlays

---

### 4. Advanced Drawing Helpers (`DrawingHelpers`)

**Location**: `window.PixelSceneHelpers.DrawingHelpers`

#### `drawShadedRect(ctx, x, y, w, h, colors, lightDirection)`

Draws a rectangle with proper shading (Stardew Valley style).

**Parameters**:
- `colors`: Array of 4 colors `[base, dark, light, highlight]`
- `lightDirection`: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`

**Example**:
```javascript
const woodColors = helpers.PALETTE.buildings.wood;
helpers.DrawingHelpers.drawShadedRect(ctx, 100, 100, 50, 30, woodColors, 'top-left');
```

#### `drawDither(ctx, x, y, w, h, color1, color2, patternSize)`

Creates a dithering pattern for texture.

**Example**:
```javascript
helpers.DrawingHelpers.drawDither(ctx, 100, 100, 50, 30, '#8B7355', '#9B8365', 2);
```

#### `drawWithOutline(ctx, drawFn, outlineColor, outlineWidth)`

Draws a shape with an outline (for sprites).

**Example**:
```javascript
helpers.DrawingHelpers.drawWithOutline(ctx, (ctx) => {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(100, 100, 32, 32);
}, '#000000', 1);
```

#### `drawShadow(ctx, x, y, w, h, offsetX, offsetY, blur)`

Draws a shadow beneath a shape.

**Example**:
```javascript
helpers.DrawingHelpers.drawShadow(ctx, 100, 100, 32, 32, 2, 2, 3);
```

#### `drawMultiGradient(ctx, x, y, w, h, colors, direction)`

Draws a gradient with multiple color stops.

**Example**:
```javascript
helpers.DrawingHelpers.drawMultiGradient(ctx, 0, 0, 320, 100, [
    { offset: 0, color: '#FFB347' },
    { offset: 0.5, color: '#FFD700' },
    { offset: 1, color: '#FFE4B5' }
], 'vertical');
```

---

## 🎯 Next Steps

### Phase 2: Sky & Atmosphere

When ready to start Phase 2, use these systems:

1. **Use `PALETTE.sky`** for consistent sky colors
2. **Use `drawMultiGradient`** for smooth sky transitions
3. **Use `LayerSystem`** to organize sky rendering
4. **Create cloud sprites** using `SpriteSystem`

### Migration Strategy

The existing code in `renderShopToCanvas` will gradually be migrated to use these systems. For now:

- **New code**: Use the foundation systems
- **Old code**: Keep working as-is (backwards compatible)
- **Gradual migration**: Update elements phase by phase

---

## 📝 Best Practices

1. **Always use `PALETTE`** for colors - don't hardcode hex values
2. **Use `drawShadedRect`** instead of flat `fillRect` for depth
3. **Organize with `LayerSystem`** for complex scenes
4. **Add shadows** with `drawShadow` for depth
5. **Use outlines** with `drawWithOutline` for character sprites

---

## 🔍 Testing

Test the foundation in `pixel-playground.html`:

```javascript
// In browser console
const helpers = window.PixelSceneHelpers;
console.log(helpers.PALETTE); // See all colors
console.log(helpers.DrawingHelpers); // See all helpers
```

---

## 📖 Reference

- **Plan**: See `PIXEL_ART_REDESIGN_PLAN.md` for full roadmap
- **Current Phase**: Phase 1 ✅ Complete
- **Next Phase**: Phase 2 - Sky & Atmosphere
