// @ts-check
/**
 * E2E: Discoverer playthrough – play as someone who doesn't know the mechanics
 * but tries to make "family friendly" / balanced choices. Picks choices that
 * sound like rest, family, saying no, or at random; does NOT always optimize for money.
 * Runs until building deadline then logs: bank, stress, burnout, got building?
 */
const { test, expect } = require('@playwright/test');

// Keywords that suggest a "family friendly" or work-life balance choice (discoverer might prefer these)
const FAMILY_FRIENDLY_KEYWORDS_STR = JSON.stringify([
  'family', 'rest', 'close', "don't", 'don’t', 'no', 'home', 'decline', 'skip',
  'refuse', 'weekend', 'day off', 'sunday', 'protect', 'balance', 'say no',
  'spend time', 'with them', 'turn down', 'not open', 'stay closed', 'rest day',
  'take care', 'health', 'enough', "won't", 'will not', 'skip it', 'later'
]);

test.describe('Discoverer playthrough to building deadline', () => {
  test('discoverer choices until building deadline and log findings', async ({ page }) => {
    test.setTimeout(300000);

    await page.goto('/index.html?automation=1', { waitUntil: 'networkidle' });

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
    // Use "Realistic" difficulty (default) – discoverer wouldn't change it
    await page.evaluate(() => {
      const sel = document.querySelector('.difficulty-btn.selected');
      if (!sel) document.querySelector('.difficulty-btn')?.classList.add('selected');
      if (typeof window.startGame === 'function') window.startGame();
    });
    await expect(page.locator('#game-screen')).toBeVisible({ timeout: 15000 });
    await page.evaluate(() => {
      const o = document.getElementById('polaroid-overlay');
      if (o && o.classList.contains('active') && typeof window.closePolaroid === 'function') {
        window.closePolaroid();
      }
    });
    await page.waitForTimeout(800);
    await page.waitForFunction(
      () => {
        const el = document.getElementById('event-title');
        return el && el.textContent !== 'Loading...' && el.textContent.trim().length > 0;
      },
      { timeout: 25000 }
    );

    let monthsPlayed = 0;
    let reachedBuilding = false;
    const maxIterations = 40;

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
      monthsPlayed = await page.evaluate(() => (window.gameState && window.gameState.monthsPlayed) || 0);
      if (eventId === 'building_deadline' || eventId === 'building_deadline_extended') {
        reachedBuilding = true;
        break;
      }
      // Stop after we've passed the building deadline month (25) even if we got the alt event (e.g. old_friend)
      if (monthsPlayed >= 25) break;

      // Discoverer: get choice texts and pick family-friendly or random
      const choiceIndex = await page.evaluate((keywordsJson) => {
        const keywords = JSON.parse(keywordsJson);
        const looksFamilyFriendly = (text) => {
          if (!text || typeof text !== 'string') return false;
          const lower = text.toLowerCase();
          return keywords.some(kw => lower.includes(kw));
        };
        const buttons = Array.from(document.querySelectorAll('.choice-btn'));
        if (buttons.length === 0) return 0;
        const texts = buttons.map(b => (b.textContent || '').trim());
        const familyIndices = texts.map((t, i) => (t && looksFamilyFriendly(t) ? i : -1)).filter(i => i >= 0);
        if (familyIndices.length > 0 && Math.random() < 0.55) {
          return familyIndices[Math.floor(Math.random() * familyIndices.length)];
        }
        return Math.floor(Math.random() * buttons.length);
      }, FAMILY_FRIENDLY_KEYWORDS_STR);

      const btn = page.locator('.choice-btn').nth(choiceIndex);
      await expect(btn).toBeVisible({ timeout: 5000 });
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

      if (reachedBuilding) break;
      await page.waitForTimeout(200);
    }

    const state = await page.evaluate(() => {
      const g = window.gameState || {};
      return {
        monthsPlayed: g.monthsPlayed,
        bank: g.bank,
        stress: g.stress,
        energy: g.energy,
        family: g.family,
        reputation: g.reputation,
        burnoutCount: g.burnoutCount || 0,
        burnoutCrashed: g.burnoutCrashed || false,
        ownsBuilding: g.ownsBuilding || false,
        gameOver: g.gameOver || false,
        gameOverReason: g.gameOverReason || '',
        buildingOfferReceived: g.buildingOfferReceived || false,
      };
    });

    // Log findings for playtest report
    const canAfford = state.bank >= 80000;
    console.log('\n--- Discoverer playthrough @ building deadline ---');
    console.log('Reached building deadline:', reachedBuilding);
    console.log('Month:', state.monthsPlayed);
    console.log('Bank: €' + state.bank + ' (need €80,000 → ' + (canAfford ? 'CAN afford' : 'CANNOT afford') + ')');
    console.log('Stress:', state.stress);
    console.log('Burnouts:', state.burnoutCount);
    console.log('Family:', state.family);
    console.log('Owns building:', state.ownsBuilding);
    console.log('Game over:', state.gameOver, state.gameOverReason);
    console.log('---\n');

    expect(state.monthsPlayed, 'Should reach at least month 24 (building deadline is month 25)').toBeGreaterThanOrEqual(24);
  });
});
