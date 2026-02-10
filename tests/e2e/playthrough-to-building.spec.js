// @ts-check
/**
 * E2E: Browser test – play from start up to (and including) the building buying event.
 * Uses ?automation=1 to skip intro. Makes choices and continues until building_deadline or building_deadline_extended.
 */
const { test, expect } = require('@playwright/test');

test.describe('Playthrough to building', () => {
  test('play from start until building buying event', async ({ page }) => {
    test.setTimeout(300000); // 5 min

    await page.goto('/index.html?automation=1', { waitUntil: 'networkidle' });

    // Ensure title screen is visible (automation=1)
    await page.evaluate(() => {
      const intro = document.getElementById('intro-screen');
      if (intro) intro.style.display = 'none';
      const title = document.getElementById('title-screen');
      if (title) {
        title.style.display = 'flex';
        title.classList.add('visible');
      }
    });
    await page.waitForSelector('button.start-btn', { state: 'visible', timeout: 20000 });
    await page.evaluate(() => {
      const sel = document.querySelector('.difficulty-btn.selected');
      if (!sel) document.querySelector('.difficulty-btn')?.classList.add('selected');
      if (typeof window.startGame === 'function') window.startGame();
    });
    await expect(page.locator('#game-screen')).toBeVisible({ timeout: 15000 });
    // Dismiss polaroid if it appears after start
    await page.evaluate(() => {
      const o = document.getElementById('polaroid-overlay');
      if (o && o.classList.contains('active') && typeof window.closePolaroid === 'function') {
        window.closePolaroid();
      }
    });
    await page.waitForTimeout(800);
    // First event loads after locale + timeline; allow time
    await page.waitForFunction(
      () => {
        const el = document.getElementById('event-title');
        return el && el.textContent !== 'Loading...' && el.textContent.trim().length > 0;
      },
      { timeout: 25000 }
    );

    let monthsPlayed = 0;
    let reachedBuilding = false;
    const maxIterations = 35;

    for (let i = 0; i < maxIterations; i++) {
      await page.waitForFunction(
        () => {
          const el = document.getElementById('event-title');
          return el && el.textContent !== 'Loading...' && el.textContent.trim().length > 0;
        },
        { timeout: 20000 }
      );

      if (await page.locator('#end-screen').isVisible().catch(() => false)) break;

      await page.evaluate(() => {
        const overlay = document.getElementById('polaroid-overlay');
        if (overlay && overlay.classList.contains('active') && typeof window.closePolaroid === 'function') {
          window.closePolaroid();
        }
      });
      await page.waitForTimeout(300);

      const eventId = await page.evaluate(() => (window.currentEvent && window.currentEvent.id) || '');
      if (eventId === 'building_deadline' || eventId === 'building_deadline_extended') {
        reachedBuilding = true;
        break;
      }

      const btn = page.locator('.choice-btn').first();
      await expect(btn).toBeVisible({ timeout: 5000 });
      await page.evaluate(() => {
        const overlay = document.getElementById('polaroid-overlay');
        if (overlay && overlay.classList.contains('active') && typeof window.closePolaroid === 'function') {
          window.closePolaroid();
        }
      });
      await page.waitForTimeout(200);
      await btn.click();

      const modal = page.locator('#outcome-modal.active');
      await modal.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      if (await modal.isVisible().catch(() => false)) {
        for (let k = 0; k < 3; k++) {
          await page.evaluate(() => {
            const o = document.getElementById('polaroid-overlay');
            if (o && o.classList.contains('active') && typeof window.closePolaroid === 'function') {
              window.closePolaroid();
            }
          });
          await page.waitForTimeout(400);
        }
        await page.locator('#outcome-modal .continue-btn').click({ force: true });
      }

      await page.waitForFunction(
        () => {
          const m = document.getElementById('outcome-modal');
          return !m || !m.classList.contains('active');
        },
        { timeout: 8000 }
      ).catch(() => {});

      monthsPlayed = await page.evaluate(() => (window.gameState && window.gameState.monthsPlayed) || 0);
      if (reachedBuilding) break;
      await page.waitForTimeout(200);
    }

    expect(reachedBuilding, 'Should reach building_deadline or building_deadline_extended event').toBe(true);
    expect(monthsPlayed, 'Should be at least month 24').toBeGreaterThanOrEqual(24);
  });
});
