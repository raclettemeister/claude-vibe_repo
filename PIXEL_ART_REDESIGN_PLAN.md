# Pixel Art Redesign Plan: Stardew Valley Quality Upgrade

## 🎯 Goal
Transform the pixel art from simple 16-bit style to Stardew Valley-level detail, polish, and charm. This is a **complete visual overhaul** affecting every element.

---

## 📊 Current State Analysis

### Resolution & Scale
- **Current**: 320×180 logical pixels (base resolution)
- **Display**: Can scale to 640×360 (2×) or higher
- **Target**: Maintain logical resolution but dramatically increase detail density

### Current Visual Elements Inventory

#### **Sky & Atmosphere**
- Basic gradient sky (seasonal colors)
- Simple sun/moon/stars
- Basic horizon line with building silhouettes
- No clouds, no weather effects

#### **Buildings**
- **Main Shop**: Simple rectangle with basic windows
- **Left Building**: 2 windows, basic shutters
- **Right Building**: 2 windows
- **Julien's Apartment**: 3 windows above shop
- All buildings: Flat colors, minimal detail, no texture

#### **Shop Interior**
- Basic counter
- Simple cheese display (colored rectangles)
- Wine corner (if unlocked)
- Raclette setup (if unlocked)
- No depth, no shadows, no detail

#### **Characters**
- **Julien**: Simple 16×16 sprite, basic animations
- **Lucas**: Basic employee sprite
- **Henry**: Basic employee sprite  
- **Poncho**: Simple dog sprite with tail wag
- **Customers**: 3 variants, very basic
- All characters: Limited animation frames, flat colors

#### **Windows**
- Basic rectangles with cross pattern
- Simple lighting (on/off)
- Basic silhouettes (newly added)
- No depth, no frames, no detail

#### **Environment**
- Basic ground/street
- Simple shadows
- No props, no decorations, no life

---

## 🎨 Stardew Valley Quality Standards

### Visual Characteristics
1. **Detail Density**: 2-4× more pixels per element
2. **Color Depth**: 4-8 colors per element (not flat)
3. **Shading**: Proper light/dark gradients
4. **Consistency**: Unified art style across all elements
5. **Animation**: 3-6 frames per animation cycle
6. **Depth**: Multiple layers, parallax, shadows
7. **Polish**: Dithering, outlines, highlights

### Technical Approach
- **Tile-based thinking**: Design elements as reusable tiles/sprites
- **Layered rendering**: Background → Midground → Foreground
- **Animation system**: Frame-based with timing
- **Color palette**: Consistent color scheme (16-32 colors)
- **Sprite sheets**: Organize sprites for easy iteration

---

## 📋 Phased Redesign Plan

### **PHASE 1: Foundation & Architecture** ⚙️
**Goal**: Set up infrastructure for detailed art without breaking existing code

**Tasks**:
1. ✅ Create modular sprite system (sprite definitions, animation frames)
2. ✅ Implement layered rendering system (background/midground/foreground)
3. ✅ Create color palette system (consistent colors across all elements)
4. ✅ Set up sprite sheet structure (organize sprites by category)
5. ✅ Create helper functions for advanced drawing (shading, dithering, outlines)

**Deliverable**: Architecture that supports detailed sprites without visual changes yet

**Estimated Time**: 2-3 hours

---

### **PHASE 2: Sky & Atmosphere** 🌤️
**Goal**: Create beautiful, dynamic sky that sets the mood

**Tasks**:
1. Redesign sky gradients (more color stops, smoother transitions)
2. Add animated clouds (3-4 cloud types, movement)
3. Enhance sun/moon (detailed sprites, glow effects)
4. Improve stars (more variety, better twinkling)
5. Add weather effects (rain, snow, fog - optional)
6. Redesign horizon (more detailed buildings, parallax layers)

**Deliverable**: Stunning sky that changes beautifully with time/season

**Estimated Time**: 3-4 hours

---

### **PHASE 3: Buildings Exterior** 🏢
**Goal**: Transform flat buildings into detailed, charming structures

**Tasks**:
1. **Main Shop**:
   - Detailed brick/stone texture
   - Proper window frames with depth
   - Decorative elements (signs, awnings, plants)
   - Door with handle, doorframe detail
   - Roof tiles with proper shading
   - Foundation/base detail

2. **Left Building**:
   - Apartment building detail
   - Window frames, balconies (if applicable)
   - Building materials texture
   - Roof detail

3. **Right Building**:
   - Similar treatment to left building
   - Unique character (different style)

4. **Julien's Apartment**:
   - Distinctive design
   - Balcony detail (if applicable)
   - Window frames

**Deliverable**: Buildings that look hand-crafted and full of character

**Estimated Time**: 4-5 hours

---

### **PHASE 4: Windows & Lighting** 💡
**Goal**: Windows that feel alive and tell stories

**Tasks**:
1. Redesign window frames (depth, wood/metal texture)
2. Enhanced glass effects (reflections, transparency)
3. Detailed interior silhouettes (more animation frames)
4. Window decorations (curtains, plants, objects)
5. Dynamic lighting (multiple light sources, shadows)
6. Shop window display (detailed cheese arrangement, lighting)

**Deliverable**: Windows that are mini-scenes themselves

**Estimated Time**: 3-4 hours

---

### **PHASE 5: Shop Interior** 🧀
**Goal**: Interior that feels like a real cheese shop

**Tasks**:
1. **Counter**:
   - Detailed wood texture
   - Countertop detail (marble/wood grain)
   - Display case detail

2. **Cheese Display**:
   - Individual cheese sprites (not rectangles)
   - Proper arrangement and stacking
   - Labels/signs
   - Lighting on display

3. **Wine Corner** (if unlocked):
   - Wine bottle sprites
   - Wine rack detail
   - Proper lighting

4. **Raclette Setup** (if unlocked):
   - Detailed equipment sprite
   - Steam/smoke effects
   - Proper positioning

5. **Floor & Walls**:
   - Floor tiles/texture
   - Wall detail (brick, paint, decorations)
   - Shadows from objects

**Deliverable**: Interior that makes you want to visit

**Estimated Time**: 4-5 hours

---

### **PHASE 6: Characters** 👥
**Goal**: Characters with personality, smooth animations, and charm

**Tasks**:
1. **Julien**:
   - Detailed sprite (32×32 or larger)
   - Multiple animation frames (idle, working, stressed, happy)
   - Directional sprites (facing different directions)
   - Clothing detail (apron, shirt texture)
   - Facial expressions

2. **Lucas**:
   - Unique design (different from Julien)
   - Work animations (handling cheese, serving)
   - Idle animations

3. **Henry**:
   - Distinctive appearance
   - Work animations
   - Character-specific details

4. **Poncho**:
   - Detailed dog sprite
   - Multiple states (sleeping, playing, sitting, walking)
   - More animation frames
   - Fur texture detail

5. **Customers**:
   - 5-8 unique customer designs
   - Idle animations
   - Shopping animations (looking, pointing, buying)

**Deliverable**: Characters that feel alive and expressive

**Estimated Time**: 5-6 hours

---

### **PHASE 7: Environment & Props** 🌳
**Goal**: Fill the scene with life and detail

**Tasks**:
1. **Street/Ground**:
   - Cobblestone/pavement texture
   - Cracks, wear, detail
   - Proper shadows

2. **Props**:
   - Street lamps (detailed)
   - Plants/pots
   - Signs
   - Trash cans
   - Bicycles (if applicable)
   - Other street furniture

3. **Decorative Elements**:
   - Seasonal decorations
   - Shop decorations (banners, flags)
   - Window boxes with plants

4. **Depth & Shadows**:
   - Proper shadow casting
   - Multiple shadow layers
   - Ambient occlusion hints

**Deliverable**: Scene feels lived-in and detailed

**Estimated Time**: 3-4 hours

---

### **PHASE 8: Animation & Polish** ✨
**Goal**: Smooth animations and final polish pass

**Tasks**:
1. Smooth all animations (ease-in/out, proper timing)
2. Add micro-animations (leaves rustling, flags waving)
3. Particle effects (dust motes, steam, sparkles)
4. Color grading pass (consistent color temperature)
5. Dithering and texture passes
6. Performance optimization
7. Final detail pass (highlights, shadows, outlines)

**Deliverable**: Polished, smooth, delightful pixel art

**Estimated Time**: 3-4 hours

---

## 🛠️ Technical Implementation Strategy

### Sprite System Architecture
```javascript
// Sprite definition structure
const sprite = {
    width: 32,
    height: 32,
    frames: [
        { data: [...], duration: 200 }, // frame data + timing
    ],
    palette: ['#color1', '#color2', ...],
    shadows: true,
    outline: true
};
```

### Layered Rendering
```javascript
// Render order
1. Sky (background)
2. Distant buildings (parallax layer 1)
3. Main buildings (parallax layer 2)
4. Shop interior (midground)
5. Characters (foreground)
6. Effects/particles (top layer)
```

### Color Palette System
```javascript
const PALETTE = {
    sky: { morning: [...], day: [...], evening: [...], night: [...] },
    buildings: { brick: [...], wood: [...], stone: [...] },
    characters: { skin: [...], hair: [...], clothing: [...] },
    // ... etc
};
```

---

## 📈 Progress Tracking

- [ ] Phase 1: Foundation & Architecture
- [ ] Phase 2: Sky & Atmosphere  
- [ ] Phase 3: Buildings Exterior
- [ ] Phase 4: Windows & Lighting
- [ ] Phase 5: Shop Interior
- [ ] Phase 6: Characters
- [ ] Phase 7: Environment & Props
- [ ] Phase 8: Animation & Polish

---

## 🎯 Success Criteria

1. **Visual Quality**: Matches or exceeds Stardew Valley's pixel art detail level
2. **Performance**: Maintains 30+ FPS on target devices
3. **Consistency**: Unified art style across all elements
4. **Animation**: Smooth, expressive character animations
5. **Polish**: No flat colors, proper shading, depth everywhere
6. **Gameplay Integration**: All gameState-driven visuals work perfectly

---

## 🚀 Getting Started

**Next Step**: Begin Phase 1 - Foundation & Architecture

This phase sets up the infrastructure without changing visuals, making it safe to iterate on. Once complete, each subsequent phase can be worked on independently.

**Recommendation**: Complete Phase 1, then review before proceeding. Each phase should be tested in the pixel-playground.html before moving forward.

---

## 📝 Notes

- **Iteration**: Each phase should be tested and reviewed before moving on
- **Backwards Compatibility**: Keep gameState interface the same
- **Modularity**: Each element should be independently updatable
- **Documentation**: Document sprite formats and conventions as we go
- **Reference**: Keep Stardew Valley screenshots/references handy for inspiration

---

**Total Estimated Time**: 25-35 hours of focused work
**Recommended Approach**: 1-2 phases per session, with breaks for review
