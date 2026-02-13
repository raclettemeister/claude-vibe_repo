# 🧀 Chez Julien Simulator

A narrative business simulation game based on the true story of a cheese shop in Brussels.

## Play Now
**[Play the game](https://julien.care/game)** — hosted on [julien.care](https://julien.care) (website and blog).  
*Version 5.0 beta*

## About

You are Julien. It's July 2022. You've just taken over a small bulk grocery store in Uccle, Brussels. The previous owner left you with modest savings, loyal customers, and a decision to make: stay the course, or pivot to something new?

This game covers 43 months of running a small business—the real decisions, the burnouts, the relationships, and the dream of owning your own building.

## Features

- **Real story**: Based on the actual journey of Chez Julien in Brussels
- **French & English**: Full translation (FR/EN) with language switcher on the title screen
- **Meaningful choices**: Every decision affects your finances, stress, energy, family, and reputation
- **Burnout mechanics**: Push too hard and face real consequences
- **Building purchase goal**: Save €80,000 by month 25 to buy your building
- **Photo memories**: Unlock real photos from the shop as you progress
- **Multiple endings**: Your choices shape how the story ends

## The Challenge

Can you balance:
- 💰 **Money** - Pay bills, grow the business, save for the building
- 😰 **Stress** - Too much leads to burnout
- ⚡ **Energy** - You can't do everything alone
- 👨‍👩‍👧 **Family** - Success means nothing if you lose what matters
- ⭐ **Reputation** - Build a name in the neighborhood

## Testing

To run automated E2E tests (e.g. building-deadline choices in FR when you can’t afford):

```bash
npm install
npx playwright install chromium
npm test
```

See [TESTING.md](TESTING.md) for why and what is tested.

## Version History

- **v5.0 beta** — **Balance & version** — Pre-building survival salary raised (€1,200 → €1,600) for ~€10K less by building deadline; no event changes. In-game version badge and README set to V5.0 beta.
- **v4.4** — **Bug Report** — Minimal bug report button (fixed bottom-left). Click → instant POST with game state, optional note overlay, 30s cooldown. Replaced old bug links.
- **cheat code** — **Cheat codes** — Small “cheat codes” link (top-left on title and in-game). Enter a code when prompted; no hints. Codes: **unlock all** (all album photos + trophies), **god mode** (invincible: no burnout/health game over), **bazooka** (Rambo bandana + RPG in both hands in pixel art). Platinum trophy requires 20/20 pictures.
- **v4.1** — **FR/EN fixes** — Translation pass (credits, achievements, wrong-language strings). Main menu title: Shop Simulator V2.0. Version badge and README updated.
- **v4** — **Maximum Effort** — 43 months (party month in Jan 2026). Policy: Living (chez soi vs parents); Work-Life Balance requires "chez soi" for (months after building − 1). New achievement: Maximum Effort (complete with High Salary). Salary and living costs from policies; extra end-game expenses. Version badge and README updated.
- **v4.3** — **Copy & i18n** — Intro title "Il était une fois" / "Once upon a time". Cutscene: "rôle principal" / "Julien Thibaut", "Es-tu prêt à relever le défi ?" (FR/EN). Menu subtitle: "A family business story" (EN) / "L'aventure d'une épicerie familiale" (FR). Shakespeare attribution in EN. Version badge and README updated.
- **v4.1** — **Bug Crush** — Fixed all reported bugs: mobile charts rendering, tooltip clipping on mobile/desktop, pixel art scene clipping and repositioning, Henry hire timing, cutscene French translation (WhatsApp message + all scenes), phone UI sizing on mobile, polaroid photo popup layout, and full browser/mobile testing pass.
- **v4.0** — **Cinematic Edition** — Complete intro cutscene rework (Stardew Valley-style pixel art scenes: tropical island, Brussels cityscape, shop meeting with Geneviève). Click-to-advance beat system. Multiple Julien sprites (Hawaiian shirt for island, T-shirt + backpack for Brussels, T-shirt for shop). Real audio files for all scenes (ocean waves, city ambiance, phone ring, shop music, epic ending). File-based game music system with 4 tracks (start, countdown to shop, after buying, happy). iPhone WhatsApp UI for phone message scene. "Click to begin" overlay for audio unlock.
- **v3.2** — **Mobile + Bugfixes** — Mobile-responsive layout (event-first stack, Chart tab, touch-friendly). Fixed building deadline choices (no "Sign" when can't afford). Fixed burnout event localization. Added automated E2E tests.
- **v3.1** — **Building Choice Fix** — Fixed building deadline showing "Sign" option when player can't afford (FR locale bug).
- **v3.0** — **FR/EN** — Full French/English translation (UI, events, photos, end screen, warnings, bank, burnout). Language switcher on title screen. Raclette event order fix.
- **v2.1** - Endgame cost escalation (salary, car, apartment grow over time)
- **v2.0** - Balance overhaul (tighter economy, family choices cost real money)
- **v1.0** - Initial release

## Credits

Created with ❤️ and 🧀

---

*"Chez Julien... chez moi, chez vous, chez mes potes!"*
