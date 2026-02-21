# Mobile testing checklist

Manual testing after mobile UX fixes. Use DevTools device emulation or real devices.

## Viewports

- **iPhone SE**: 375×667
- **iPhone 14 Pro**: 393×852
- **iPad Mini**: 768×1024
- **Desktop**: 1280×800 (regression)

## Per viewport

- [ ] Title screen: content reachable, buttons tappable, tabs work
- [ ] Language picker → splash → intro cutscene
- [ ] "Tap to skip" visible and tappable (intro/outro)
- [ ] Game screen: pixel art + event panel visible, no overflow
- [ ] Choice buttons tappable (44px), `:active` feedback
- [ ] Stat tooltips: open on tap, above music bar, close on outside tap
- [ ] Music: play/pause 44px; volume slider hidden on mobile
- [ ] Polaroid: close button visible and tappable
- [ ] Modals: bottom not clipped by address bar
- [ ] Bug report button tappable, not obscured by home indicator
- [ ] Chart tab: renders, no jank on orientation change
- [ ] End screen: achievements scrollable
- [ ] Landscape phone: "rotate to portrait" hint appears
- [ ] iPad: side-by-side layout, both panels visible
- [ ] No console spam
