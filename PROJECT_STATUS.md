# Chez Julien Simulator — Project Status

> **Last Updated:** February 2, 2026
> **Status:** 🔴 PAUSED — Project on hold due to accumulated technical debt from excessive iterations

---

## The Story of This Project

This is Julien's personal project: a narrative business simulation game based on his real experience running a cheese shop in Brussels from 2022-2025. The game was built through "vibe coding" — AI-assisted development without writing code manually.

**The first 10 hours were magic.** Julien created something beautiful, meaningful, and playable.

**The next 20+ hours broke it.** Continuous small adjustments ("just one more change") accumulated into a tangled mess of conflicting modifications. The AI made mistakes, introduced bugs while fixing others, and the game is now worse than it was after the first 10 hours.

This document exists so that when Julien (or a future AI) returns to this project, they can understand what happened and where to start.

---

## Version History (Critical)

| Version | File | Date | Size | State |
|---------|------|------|------|-------|
| **v1** | `index.html` | Jan 28 | 1,695,730 bytes | ✅ Original working version |
| **v2** | `index_v2.html` | Jan 29 | 1,697,530 bytes | ✅ Minor improvements, stable |
| **GitHub** | `UPLOAD_TO_GITHUB_index.html` | Jan 29 | 1,702,586 bytes | ✅ Published version |
| **v3** | `index_v3.html` | Feb 1 | 1,705,434 bytes | ⚠️ Changes started accumulating |
| **v3.5** | `indexv3.5(beforetheshit).html` | Feb 2 | 1,706,556 bytes | ✅ **BEST CURRENT VERSION** |
| **v4** | `index_v4.html` | Feb 2 | 1,874,779 bytes | 🔴 BROKEN — has good ideas buried in broken code |
| **Backup** | `index_v4_broken.html` | Feb 2 | 1,874,779 bytes | 🔴 Same as v4, kept for reference |

### The Critical Insight

The jump from v3.5 (1.7MB) to v4 (1.87MB) added **~170KB of code** — that's where things went catastrophically wrong.

**RECOMMENDATION:** Start from `indexv3.5(beforetheshit).html` — this is the best working version.

---

## What Was Working (Before It Broke)

Based on the GAME_DESIGN.md and README.md, these features were confirmed working:

1. **Core Game Loop** — Monthly turns with decisions affecting stats
2. **Five Stats** — Money, Stress, Energy, Family, Reputation
3. **Burnout Mechanic** — 3 burnouts = game over
4. **Building Purchase Goal** — Save €80k by month 25
5. **Sunday Opening Trap** — Opening Sundays leads to guaranteed burnout (intentional design)
6. **Multiple Endings** — At least 7 different endings based on choices
7. **Photo Memories** — Real photos unlock as you progress
8. **Mandatory Events** — Key story beats that happen every playthrough
9. **Difficulty Modes** — Realistic, Forgiving, Brutal

---

## Known Issues to Fix (When Resuming)

These are confirmed issues Julien wants to address:

### 1. Mislabeled Pictures (High Priority)
Some photos in the game are mislabeled or have chaotic naming. Need to:
- Audit all picture references in the index file
- Rename/fix the picture references to match actual images
- Ensure the right photos appear at the right moments

### 2. Album Not Showing on Main Screen (Attempted, Broke Game)
The photo album feature should be visible on the main screen, but:
- Attempting to fix this broke the entire game
- The feature exists but isn't surfaced properly
- Needs very careful, isolated approach

### 3. Event Balancing (Needs Full Review)
Events need a complete pass:
- Some events are boring or feel like filler
- Some events happen too often
- Some events don't happen often enough
- Some events feel "bullshit" — not meaningful choices
- Need to review EVERY event's trigger chance and content

### 4. Original Design Issues (From GAME_DESIGN.md)
- **Cheese Scaling** — Was supposed to grow organically (1→3→5→10→25→100) but stayed low
- **Event Randomness** — Some mandatory events (like Raclette trophy) were missing in playthroughs
- **Late Game Economy** — The "inversion" (more sales but less cash after building) may be broken

### The Core Problem

**Every fix attempt breaks the entire game.** The code is interconnected in ways that make isolated changes dangerous. Small tweaks cascade into major bugs.

---

## Files in This Project

```
/chez-julien-beta/
├── PROJECT_STATUS.md                    # This file — start here
├── GAME_DESIGN.md                       # Design source of truth (STILL VALID)
├── README.md                            # Public-facing description
├── index.html                           # v1 — Original (Jan 28)
├── index_v2.html                        # v2 — Stable (Jan 29)
├── UPLOAD_TO_GITHUB_index.html          # Published version (Jan 29)
├── index_v3.html                        # v3 — Changes started (Feb 1)
├── indexv3.5(beforetheshit).html        # ✅ BEST VERSION — Start here
├── index_v4.html                        # 🔴 BROKEN — Has ideas, don't use
├── index_v4_broken.html                 # 🔴 Backup of broken v4
└── test_simulation.js                   # Test harness (may or may not work)
```

---

## Possible Approaches (When Ready to Resume)

### Option 1: Wait for Better Technology
AI tools are improving rapidly. In 6-12 months:
- Better code understanding and context windows
- More reliable iteration without breaking things
- Potentially tools designed specifically for game balancing
- **Pros:** Less frustration, better results
- **Cons:** Project sits idle

### Option 2: More Structured Approach
If resuming now, be extremely disciplined:
- **Isolate each fix completely** — understand every line it touches
- **Create a test checklist** — verify core game loop after EVERY change
- **Document each change** — what changed, why, what to check
- **Smaller sessions** — 30 minutes max, then stop and test
- **Pros:** Could work, maintains momentum
- **Cons:** Slow, tedious, still risky

### Option 3: Hire a Developer
Find someone who can read the code and make surgical fixes:
- They can understand the architecture
- Make targeted changes without cascading effects
- **Pros:** Professional result, faster
- **Cons:** Costs money, loses "vibe coded" purity

### Option 4: Reference v4 for Ideas Only
The v4 files have good ideas that broke the game. When resuming:
- Read v4 to understand WHAT you wanted
- Implement those ideas fresh in v3.5
- Never copy-paste from v4
- **Pros:** Preserves the good ideas
- **Cons:** Re-implementing work

---

## Recovery Recommendations

### Starting Point

Use `indexv3.5(beforetheshit).html` — this is the best working version.

### Before Any Change

1. **Read GAME_DESIGN.md completely**
2. **Play the current version** — know exactly what works
3. **Write down the ONE thing you want to change**
4. **Save a new version BEFORE touching anything**

### The v4 Files

Keep them for reference — they contain ideas for:
- Picture fixes (but broke the game)
- Album display (but broke the game)
- Event tweaks (but broke the game)

**Never try to fix v4.** Extract ideas only.

### The Lesson Learned

> "Vibe coding" works beautifully for the first pass. But iteration requires discipline: one change at a time, with testing and version control between each change.

---

## What Julien Wanted (The Vision)

From GAME_DESIGN.md and conversations:

- **Feel hard but be completable** — First playthrough should succeed with effort
- **Story-driven, not random** — Same events every playthrough, choices matter
- **The Sunday trap is intentional** — Opening Sundays MUST lead to burnout
- **The building should feel barely achievable** — Tension, not impossible
- **Hiring = comfort, not growth** — Full team makes life easy but flattens income
- **Multiple valid paths** — Family focus, grind focus, empire focus, balance

The design is good. The implementation got tangled.

---

## For Future AI Assistants

If you're an AI helping Julien with this project:

1. **Read this file first**
2. **Read GAME_DESIGN.md second** — it's the source of truth
3. **Start from `indexv3.5(beforetheshit).html`** — this is the best version
4. **Reference v4 for IDEAS only** — it has good concepts buried in broken code
5. **One change at a time** — Julien has learned this lesson the hard way
6. **Test before moving on** — Actually play the game, don't simulate
7. **Save versions** — Every significant change gets a new file
8. **Respect CLAUDE.md** — Julien's working style is documented there

### Anti-Patterns to Avoid

- ❌ "Let me fix all these issues at once"
- ❌ "I'll just make a small adjustment to this formula"
- ❌ "The code is messy, let me refactor it while I'm here"
- ❌ Making changes without understanding the full game flow
- ❌ Assuming bugs are isolated — they cascade in game balance

### Good Patterns

- ✅ "I'll change ONE thing and we'll test it"
- ✅ "Before I touch the code, let me understand the current behavior"
- ✅ "Let me save a version before making this change"
- ✅ "Play through the game after each change"

---

## Contact & Credits

**Created by:** Julien (hello@chezjulien.be)
**Built with:** AI collaboration (Claude), no manual coding
**About:** A personal project about the real cheese shop at Chez Julien in Brussels

---

## Emotional Note

This project is meaningful. It's Julien's story — his real life, his real struggles, his real cheese shop — turned into a game. The frustration of watching it break through over-iteration is real and valid.

But the game DOES exist. `indexv3.5(beforetheshit).html` is playable. The published version is online. The design document captures the vision perfectly. Nothing is lost — just paused.

The 20+ hours of painful iteration taught a lesson worth knowing: vibe coding creates, but disciplined iteration preserves.

When the time is right — whether that's next week, next month, or when AI tools are better — the game will be waiting. The story of Chez Julien isn't going anywhere.

*"Chez Julien... chez moi, chez vous, chez mes potes!"*
