# Chez Julien Simulator - UI/UX Guide

> **Version:** v2.5 - Balanced Edition
> **Last Updated:** February 2026
> **Status:** 🚧 Work in Progress

---

## 📚 Terminology Reference

### UI vs UX vs Graphics

| Term | Definition | Responsibility |
|------|------------|----------------|
| **UI** (User Interface) | The visual elements players see and interact with | Buttons, menus, text, icons, layouts |
| **UX** (User Experience) | How the interface *feels* to use | Flow, intuitiveness, satisfaction, frustration points |
| **Graphics/Visuals** | The artistic assets and styling | Pixel art, photos, colors, animations |

### Common Game UI Terms

| Term | Definition | In Chez Julien |
|------|------------|----------------|
| **HUD** | Heads-Up Display - always-visible game info | Top stats bar (bank, stress, energy, family, reputation) |
| **Modal** | Popup window that requires interaction | Event popups, polaroid photos, choice dialogs |
| **Card** | Contained unit of information/action | Event choice buttons |
| **Progress Bar** | Visual representation of a numeric value | Stress bar, energy bar, bank balance graph |
| **Navigation (Nav)** | Elements for moving between views | Stats / Team / Log / Bank tabs |
| **Viewport** | The visible area of the game | The entire game window |
| **Toast** | Small temporary notification | (Not currently implemented) |
| **Tooltip** | Info shown on hover | (Not currently implemented) |
| **Sidebar** | Secondary panel alongside main content | Right panel with events/stats |
| **Header** | Top section of a page/component | "The Shop" title bar |

### UX Concepts

| Term | Definition | Good Example | Bad Example |
|------|------------|--------------|-------------|
| **Affordance** | Element looks like what it does | Button looks clickable | Clickable text with no styling |
| **Feedback** | System responds to actions | Button animates on click | Nothing happens visually |
| **Cognitive Load** | Mental effort to understand | Clear labels | Too many numbers at once |
| **Flow** | Uninterrupted engagement | Smooth event transitions | Confusing navigation |
| **Friction** | Barriers to completion | Intentional (confirm delete) | Unintentional (broken button) |
| **Onboarding** | Teaching new players | Tutorial, hints | Thrown in without explanation |

### Visual Design Terms

| Term | Definition |
|------|------------|
| **Color Palette** | Consistent set of colors used throughout |
| **Typography** | Font choices, sizes, weights, line heights |
| **Hierarchy** | Visual importance order (what you see first) |
| **Whitespace** | Empty space that aids readability |
| **Contrast** | Difference between elements (for readability) |
| **Responsive** | Adapts to different screen sizes |
| **Breakpoint** | Screen width where layout changes |

---

## 🔍 Current State Analysis

### What We Have

#### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  HEADER: The Shop | Month | Phase | Version         │
├─────────────────────────────────────────────────────┤
│  HUD: €Bank | 😰 Stress | ⚡ Energy | ❤️ Family | ⭐ Rep │
├─────────────────────────────────────────────────────┤
│                    │                                │
│   SHOP VISUAL      │    EVENT PANEL                 │
│   (Pixel Art)      │    - Title                     │
│                    │    - Description               │
│   BANK GRAPH       │    - Choices                   │
│                    │                                │
├────────────────────┴────────────────────────────────┤
│  TABS: Stats | Team | Log | Bank                    │
├─────────────────────────────────────────────────────┤
│  BOTTOM STATS: Sales | Profit | Autonomy | Cheese   │
└─────────────────────────────────────────────────────┘
```

#### Current Color Palette
| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Green | 🟢 | `#2d5a3d` | Headers, buttons |
| Accent Gold | 🟡 | `#c9a227` | Highlights, bank |
| Danger Red | 🔴 | `#c0392b` | Stress, warnings |
| Energy Yellow | 🟡 | `#f39c12` | Energy stat |
| Family Pink | 💗 | `#e91e63` | Family stat |
| Background | ⬜ | `#f5f5f5` | Page background |
| Card White | ⬜ | `#ffffff` | Content cards |
| Text Dark | ⬛ | `#333333` | Body text |

#### Typography
| Element | Current Font | Size | Weight |
|---------|-------------|------|--------|
| Headers | Georgia | 24-32px | Bold |
| Body | System default | 14-16px | Normal |
| Stats | Monospace | 14px | Bold |
| Buttons | Georgia | 16px | Normal |

---

## 🚨 Known Issues (Priority: HIGH)

### 1. Responsive/Mobile - BROKEN

**Symptoms:**
- ❌ Game unplayable on mobile devices
- ❌ Elements clip/overlap when window resized
- ❌ Content overflows viewport on small screens
- ❌ Touch targets too small for fingers
- ❌ Text becomes unreadable on mobile
- ❌ Modals extend beyond screen
- ❌ Bank graph doesn't resize

**Root Causes:**
- Fixed pixel widths instead of responsive units
- No CSS media queries for different screen sizes
- No mobile-first design approach
- Absolute positioning causing overlap
- No viewport meta tag optimization

**Technical Debt:**
```css
/* PROBLEM: Fixed widths */
.shop-container { width: 450px; }  /* Should be: max-width or % */

/* PROBLEM: No breakpoints */
/* Missing: @media (max-width: 768px) { ... } */

/* PROBLEM: Absolute positioning */
.element { position: absolute; left: 300px; }  /* Breaks on resize */
```

### 2. Window Resize Handling

**Symptoms:**
- Elements overlap when minimizing
- Layout breaks when enlarging
- Graph doesn't redraw on resize
- Scrollbars appear unexpectedly

**Needed Fix:**
- CSS Grid or Flexbox for flexible layouts
- JavaScript resize event handlers
- Relative/percentage-based sizing

### 3. Modal/Popup Issues

**Symptoms:**
- Polaroid photos may clip on small screens
- Event modals can extend beyond viewport
- No way to scroll long event text
- Close/continue areas inconsistent

---

## 📋 Improvement Wishlist

### Priority 1: Critical (Blocking Issues)

| Issue | Solution | Effort |
|-------|----------|--------|
| Mobile breakage | Implement responsive CSS | High |
| Resize handling | Use CSS Grid/Flexbox | High |
| Modal overflow | Constrain modals to viewport | Medium |

### Priority 2: High (User Experience)

| Feature | Benefit | Effort |
|---------|---------|--------|
| Touch-friendly buttons | Mobile usability | Medium |
| Tooltips on stats | Explain what numbers mean | Low |
| Loading states | Feedback during transitions | Low |
| Keyboard navigation | Accessibility | Medium |

### Priority 3: Medium (Polish)

| Feature | Benefit | Effort |
|---------|---------|--------|
| Animations on stat changes | Visual feedback | Medium |
| Sound toggle UI | User control | Low |
| Settings menu | Customization | Medium |
| Save/Load UI | Game persistence | High |

### Priority 4: Nice-to-Have (Future)

| Feature | Benefit | Effort |
|---------|---------|--------|
| Dark mode | User preference | Medium |
| Font size options | Accessibility | Low |
| Colorblind mode | Accessibility | Medium |
| Tutorial/Onboarding | New player experience | High |
| Achievement popups | Engagement | Medium |

---

## 🎨 Style Guide (Target)

### Responsive Breakpoints

| Name | Width | Target Devices |
|------|-------|----------------|
| Mobile S | 320px | Small phones |
| Mobile M | 375px | iPhone, standard phones |
| Mobile L | 425px | Large phones |
| Tablet | 768px | iPad, tablets |
| Laptop | 1024px | Small laptops |
| Desktop | 1440px+ | Monitors |

### Spacing Scale

| Name | Size | Usage |
|------|------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Related elements |
| md | 16px | Standard padding |
| lg | 24px | Section spacing |
| xl | 32px | Major sections |
| xxl | 48px | Page margins |

### Button Styles

| Type | Usage | Visual |
|------|-------|--------|
| Primary | Main actions (Sign papers) | Green background, white text |
| Secondary | Alternative actions | White background, green border |
| Danger | Destructive actions | Red background |
| Ghost | Subtle actions | No background, text only |

### Touch Targets

| Element | Minimum Size | Reason |
|---------|--------------|--------|
| Buttons | 44x44px | Apple HIG guideline |
| Links | 44x44px | Finger tap accuracy |
| Close buttons | 48x48px | Easy to dismiss |

---

## 🛠️ Implementation Roadmap

### Phase 1: Emergency Fixes (Week 1)
- [ ] Add viewport meta tag
- [ ] Convert fixed widths to max-width
- [ ] Add basic media queries
- [ ] Fix modal overflow

### Phase 2: Responsive Rewrite (Week 2-3)
- [ ] Implement CSS Grid layout
- [ ] Mobile-first approach
- [ ] Test all breakpoints
- [ ] Fix touch targets

### Phase 3: Polish (Week 4+)
- [ ] Add transitions/animations
- [ ] Implement tooltips
- [ ] Loading states
- [ ] Accessibility audit

---

## 📱 Testing Checklist

### Before Each Release

- [ ] Test on iPhone SE (320px)
- [ ] Test on iPhone 12 (390px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1440px)
- [ ] Test window resize (drag to resize)
- [ ] Test landscape orientation
- [ ] Test with zoom (125%, 150%)
- [ ] Test keyboard navigation
- [ ] Test screen reader (VoiceOver)

---

## 📚 Resources

### Learning
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Responsive Design Basics](https://web.dev/responsive-web-design-basics/)

### Tools
- Chrome DevTools Device Mode (F12 → Toggle device toolbar)
- [Responsively App](https://responsively.app/) - Test multiple sizes at once
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Accessibility audit

---

*This document should be updated as UI/UX improvements are made.*
