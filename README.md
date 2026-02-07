# 🧀 Chez Julien Simulator

A narrative business simulation game based on the true story of a cheese shop in Brussels.

## Play Now
**[Play the game](https://raclettemeister.github.io/chez-julien-simulatorV3/)**

## About

You are Julien. It's July 2022. You've just taken over a small bulk grocery store in Uccle, Brussels. The previous owner left you with modest savings, loyal customers, and a decision to make: stay the course, or pivot to something new?

This game covers 42 months of running a small business—the real decisions, the burnouts, the relationships, and the dream of owning your own building.

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
