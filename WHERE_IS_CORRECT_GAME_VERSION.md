# Where is your correct game version?

## Short answer

**Your timeline-based game with the “right” events lives on the branch `operation-wildcard`** (and is pushed to `origin/operation-wildcard`).

You are currently on **`main`**. On `main`, the game does **not** use `data/timeline.json` and does not have the strict month→event timeline, so it’s easy to think the “correct” version is missing.

---

## What each branch has

| What | **main** (current) | **operation-wildcard** |
|------|--------------------|-------------------------|
| **data/timeline.json** (game’s timeline) | ❌ **Does not exist** | ✅ **Exists** (month 1→42 event map) |
| **data/timeline/** (planning docs) | ✅ Exists | ✅ Exists |
| **data/events.js** | ✅ Big file (pool of events) | ✅ Refactored, used with timeline |
| **index.html** | Old event system (pool/random) | **Timeline-driven**: loads `data/timeline.json`, picks event per month |
| **data/policies.json** | ❌ No | ✅ Yes |
| **Timeline planner, CHE-* features** | ❌ No | ✅ Yes (policies, outro, achievements, etc.) |

So the version that “has the right event” and uses the timeline is **operation-wildcard**.

---

## How to get the correct game version

**Option A – Use the branch (recommended)**

```bash
git checkout operation-wildcard
```

Then open the project and run the game as usual. You’ll have:

- `data/timeline.json` (the 42-month event map)
- `index.html` that uses it
- All event and policy data that goes with it

**Option B – Copy the timeline into main (if you must stay on main)**

```bash
git show operation-wildcard:data/timeline.json > data/timeline.json
```

That only restores the timeline file. Your `index.html` on main still won’t use it (main’s index doesn’t load `timeline.json`). So for the “correct” game behaviour you still need the code from operation-wildcard; the branch is the right place to work.

---

## Commit refs (for reference)

- **main**: `c5507b9` — "yuj" — no `data/timeline.json`, old event system.
- **operation-wildcard**: `a4cc9f5` — "rereqeerreer" — has `data/timeline.json`, timeline-driven events, policies, CHE-* work.
- **Stash** (`stash@{0}`): Same timeline + event data as in 46dd303; useful if you ever need to recover uncommitted changes.
- **46dd303**: Merge commit with that stash content; not on any branch, but the same “correct” event/timeline data.

---

## Why it felt “lost”

1. You were on **main**, which never had the timeline-based game.
2. The version that does (with `data/timeline.json` and the right events) is on **operation-wildcard**.
3. So the correct game version is **not** on main; it’s on **operation-wildcard**. Check out that branch to get it back.
