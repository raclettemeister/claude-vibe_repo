// @ts-check
/**
 * Balance tuning: run multiple playthroughs to the building and record
 * burnout count + building success. Output written to tests/e2e/artifacts/balance-stress-runs.json.
 * Use this to find the right stress balance (see BALANCE_REFERENCE.md "Stress balance levers").
 *
 * Run: npm run test:balance   or   npx playwright test tests/e2e/balance-stress-runs.spec.js
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const NUM_RUNS = 5;
const TARGET_EVENTS = ['building_deadline', 'building_deadline_extended'];
const MAX_MONTHS = 35;
const ARTIFACTS_DIR = path.join(__dirname, 'artifacts');
const OUTPUT_FILE = path.join(ARTIFACTS_DIR, 'balance-stress-runs.json');

async function runOnePlaythrough(page) {
  await page.goto('/index.html?test=1&automation=1', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const intro = document.getElementById('intro-screen');
    if (intro) intro.style.display = 'none';
    const title = document.getElementById('title-screen');
    if (title) {
      title.style.display = 'flex';
      title.classList.add('visible');
    }
  });
  await page.waitForSelector('button.start-btn', { state: 'visible', timeout: 15000 });
  await page.evaluate(() => {
    const sel = document.querySelector('.difficulty-btn.selected');
    if (!sel) document.querySelector('.difficulty-btn')?.classList.add('selected');
    if (typeof window.startGame === 'function') window.startGame();
  });
  await expect(page.locator('#game-screen')).toBeVisible({ timeout: 15000 });
  await page.waitForFunction(
    () => window.currentEvent && window.currentEvent.choices && window.currentEvent.choices.length > 0,
    { timeout: 25000 }
  );
  const result = await page.evaluate(({ targetEvents, maxMonths }) => {
    return window.__testPlayUntil(targetEvents, 'first', maxMonths);
  }, { targetEvents: TARGET_EVENTS, maxMonths: MAX_MONTHS });
  return result;
}

test.describe('Balance: stress/burnout runs', () => {
  test('run multiple playthroughs and record burnout + building stats', async ({ page }) => {
    test.setTimeout(300000); // 5 runs can be slow

    const runs = [];
    for (let i = 0; i < NUM_RUNS; i++) {
      const result = await runOnePlaythrough(page);
      const state = result.state || {};
      runs.push({
        run: i + 1,
        reached: !!result.reached,
        eventId: result.eventId || null,
        monthsPlayed: result.monthsPlayed ?? 0,
        burnoutCount: state.burnoutCount ?? 0,
        ownsBuilding: state.ownsBuilding ?? false,
        gameOver: state.gameOver ?? false,
        stress: state.stress ?? 0,
        bank: state.bank ?? 0,
        energy: state.energy ?? 0,
      });
    }

    const summary = {
      timestamp: new Date().toISOString(),
      numRuns: NUM_RUNS,
      runs,
      summary: {
        reachedBuilding: runs.filter((r) => r.reached).length,
        gameOverBeforeBuilding: runs.filter((r) => r.gameOver && !r.ownsBuilding).length,
        burnoutDistribution: runs.reduce((acc, r) => {
          const k = String(r.burnoutCount);
          acc[k] = (acc[k] || 0) + 1;
          return acc;
        }, {}),
        avgBurnoutsWhenReached: (() => {
          const reached = runs.filter((r) => r.reached);
          if (reached.length === 0) return null;
          return reached.reduce((s, r) => s + r.burnoutCount, 0) / reached.length;
        })(),
      },
    };

    if (!fs.existsSync(ARTIFACTS_DIR)) {
      fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2), 'utf8');

    // Log so we can read in CI/terminal
    console.log('\n--- Balance stress runs ---');
    console.log('Reached building:', summary.summary.reachedBuilding, '/', NUM_RUNS);
    console.log('Burnouts per run:', summary.summary.burnoutDistribution);
    console.log('Avg burnouts when reached building:', summary.summary.avgBurnoutsWhenReached);
    console.log('Written to', OUTPUT_FILE);

    expect(runs.length).toBe(NUM_RUNS);
  });
});
