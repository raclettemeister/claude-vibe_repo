// @ts-check
/**
 * E2E: Reliable playthrough to building deadline using the in-game test API.
 * Uses __testPlayUntil so the game advances itself (no fragile DOM timing or click races).
 * Run: npm test (or npm run test:full for this flow only)
 */
const { test, expect } = require('@playwright/test');

test.describe('Playthrough via test API (reliable)', () => {
  test('play from start to building_deadline using __testPlayUntil', async ({ page }) => {
    test.setTimeout(120000); // 2 min

    await page.goto('/index.html?test=1&automation=1', { waitUntil: 'networkidle' });

    // Skip intro, show title (same as automation=1)
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

    // Select difficulty and start (no click – direct call for reliability)
    await page.evaluate(() => {
      const sel = document.querySelector('.difficulty-btn.selected');
      if (!sel) document.querySelector('.difficulty-btn')?.classList.add('selected');
      if (typeof window.startGame === 'function') window.startGame();
    });
    await expect(page.locator('#game-screen')).toBeVisible({ timeout: 15000 });

    // Wait for first event to be loaded (locale + timeline)
    await page.waitForFunction(
      () => window.currentEvent && window.currentEvent.choices && window.currentEvent.choices.length > 0,
      { timeout: 25000 }
    );

    // Run playthrough inside the page (no DOM clicks). Target either building event.
    const result = await page.evaluate(() => {
      if (typeof window.__testPlayUntil !== 'function') {
        throw new Error('__testPlayUntil not available');
      }
      return window.__testPlayUntil(['building_deadline', 'building_deadline_extended'], 'first', 35);
    });

    expect(result, 'PlayUntil should return a result').toBeDefined();
    expect(result.reached, 'Should reach building_deadline or building_deadline_extended').toBe(true);
    expect(result.monthsPlayed, 'Should be at least month 24').toBeGreaterThanOrEqual(24);
    expect(result.state).toBeDefined();
    expect(result.state.bank).toBeDefined();
  });

  test('discoverer-style playthrough via __testPlayUntil returns valid state', async ({ page }) => {
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
      return window.__testPlayUntil(['building_deadline', 'building_deadline_extended'], 'family', 40);
    });

    expect(result).toBeDefined();
    expect(result.monthsPlayed).toBeGreaterThanOrEqual(24);
    expect(result.state).toBeDefined();
    expect(typeof result.state.bank).toBe('number');
    expect(typeof result.state.stress).toBe('number');
    if (result.reached) {
      expect(['building_deadline', 'building_deadline_extended']).toContain(result.eventId);
    }
  });
});
