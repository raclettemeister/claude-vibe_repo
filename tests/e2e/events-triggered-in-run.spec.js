// @ts-check
/**
 * E2E: Record which events actually trigger during a playthrough.
 * Used for rebalancing — the game has many events but only a subset fire in a run
 * (timeline + conditions). This script runs the game and saves the list.
 *
 * Run: npx playwright test events-triggered-in-run
 * Output: tests/e2e/artifacts/triggered-events-last-run.json
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join(__dirname, 'artifacts');
const OUTPUT_FILE = path.join(ARTIFACTS_DIR, 'triggered-events-last-run.json');

function ensureArtifactsDir() {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }
}

test.describe('Events triggered in a run (balance reference)', () => {
  test('full playthrough and record triggered event ids + months', async ({ page }) => {
    test.setTimeout(180000); // 3 min for full run

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

    // Play to a late event or max 42 months so we get a long run and full event log
    const result = await page.evaluate(() => {
      if (typeof window.__testPlayUntil !== 'function') {
        throw new Error('__testPlayUntil not available');
      }
      return window.__testPlayUntil(
        ['christmas_day', 'reflection_moment', 'building_deadline', 'building_deadline_extended'],
        'first',
        42
      );
    });

    expect(result).toBeDefined();
    expect(result.state).toBeDefined();
    const log = result.state.triggeredEventLog || [];
    expect(Array.isArray(log)).toBe(true);

    ensureArtifactsDir();
    const payload = {
      runAt: new Date().toISOString(),
      monthsPlayed: result.monthsPlayed,
      reached: result.reached,
      reason: result.reason,
      eventCount: log.length,
      events: log,
      // Summary: event id -> list of months it appeared (for recurring)
      byId: log.reduce((acc, { id, month }) => {
        if (!acc[id]) acc[id] = [];
        acc[id].push(month);
        return acc;
      }, {}),
    };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');

    // Also log a short summary to the test output
    const uniqueIds = [...new Set(log.map((e) => e.id))];
    console.log(`[events-triggered] Months: ${result.monthsPlayed}, Events shown: ${log.length}, Unique event ids: ${uniqueIds.length}`);
    console.log(`[events-triggered] Written to ${OUTPUT_FILE}`);
  });

  test('playthrough to building deadline and record events (shorter run)', async ({ page }) => {
    test.setTimeout(120000);

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

    const result = await page.evaluate(() => {
      if (typeof window.__testPlayUntil !== 'function') throw new Error('__testPlayUntil not available');
      return window.__testPlayUntil(['building_deadline', 'building_deadline_extended'], 'first', 35);
    });

    expect(result.state).toBeDefined();
    const log = result.state.triggeredEventLog || [];
    ensureArtifactsDir();
    const buildingRunFile = path.join(ARTIFACTS_DIR, 'triggered-events-to-building.json');
    fs.writeFileSync(
      buildingRunFile,
      JSON.stringify(
        {
          runAt: new Date().toISOString(),
          monthsPlayed: result.monthsPlayed,
          reached: result.reached,
          eventCount: log.length,
          events: log,
          byId: log.reduce((acc, { id, month }) => {
            if (!acc[id]) acc[id] = [];
            acc[id].push(month);
            return acc;
          }, {}),
        },
        null,
        2
      ),
      'utf8'
    );
    console.log(`[events-triggered] To-building run: ${log.length} events, written to ${buildingRunFile}`);
  });
});
