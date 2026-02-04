# GitHub Repository Cleanup Checklist

## ✅ Completed

- [x] Created `.gitignore` file
- [x] Updated README.md with v3.1 and v3.2

## ⚠️ Action Required

### 1. Remove tracked files that should be ignored

**Run these commands** (they will remove files from git tracking but keep them locally):

```bash
# Remove node_modules from git (but keep locally)
git rm -r --cached node_modules/

# Remove system files
git rm --cached .DS_Store
git rm --cached .cursor/debug.log

# Remove test results (if any tracked)
git rm -r --cached test-results/ 2>/dev/null || true
```

### 2. Stage the new files

```bash
git add .gitignore
git add README.md
git add index.html  # (if you have v3.2 changes)
```

### 3. Commit

```bash
git commit -m "chore: Add .gitignore and update README for v3.2

- Add .gitignore to exclude node_modules, test-results, OS files
- Update README with v3.1 and v3.2 changelog
- Remove node_modules and system files from tracking"
```

### 4. Check what branch you're on

You're currently on `refactor/architecture-cleanup` and ahead by 1 commit.

**Decide:**
- Merge to `main`? → `git checkout main && git merge refactor/architecture-cleanup`
- Or push this branch? → `git push origin refactor/architecture-cleanup`

## 📋 Repository Structure Review

### ✅ Good Structure

```
claude-vibe_repo/
├── index.html              # Main game file
├── data/
│   ├── events.js          # Event definitions
│   └── locales/
│       ├── en.json        # English translations
│       └── fr.json        # French translations
├── js/
│   └── balance-constants.js
├── tests/
│   ├── e2e/               # Playwright E2E tests
│   └── balance_test_suite.py
├── extracted_photos/      # Photo assets
├── old versions/          # Version history backups
├── docs/                  # Documentation files
│   ├── README.md
│   ├── TESTING.md
│   ├── GAME_DESIGN.md
│   ├── UI_UX_GUIDE.md
│   └── ...
└── package.json           # Node dependencies
```

### 📝 Documentation Files

- ✅ `README.md` - Main project readme
- ✅ `TESTING.md` - Testing documentation
- ✅ `GAME_DESIGN.md` - Game design document
- ✅ `UI_UX_GUIDE.md` - UI/UX guidelines
- ✅ `BALANCE_REFERENCE.md` - Balance numbers reference
- ✅ `EVENT_MAP.md` - Event mapping
- ✅ `PHOTO_REFERENCE.md` - Photo reference
- ✅ `PROJECT_STATUS.md` - Project status

### 🗂️ Files That Should NOT Be in Git

- ❌ `node_modules/` - Dependencies (install with `npm install`)
- ❌ `test-results/` - Test output (generated)
- ❌ `.DS_Store` - macOS system file
- ❌ `.cursor/debug.log` - IDE debug logs
- ❌ `package-lock.json` - Can be tracked or ignored (your choice)

## 🎯 Next Steps After Cleanup

1. **Clean up tracked files** (commands above)
2. **Commit and push** your changes
3. **Verify on GitHub** that node_modules is not visible
4. **Consider:** Should `old versions/` be in git? (It's fine for now, but could be moved to releases)

## 📊 Current Branch Status

- **Current branch:** `refactor/architecture-cleanup`
- **Ahead of origin:** 1 commit
- **Remote:** `origin` → `https://github.com/raclettemeister/claude-vibe_repo.git`
