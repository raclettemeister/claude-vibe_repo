// @ts-check
/**
 * E2E: Building deadline choices when player CANNOT afford (bank < 80k).
 * Ensures we never show "Sign – I have €80,000" when the player is short.
 * Run: npm test  (or npx playwright test)
 */
const { test, expect } = require('@playwright/test');

test.describe('Building deadline (July 2024)', () => {
  test('when bank < 80k and FR: must NOT show "Sign" / "Signer" option; must show extend or let go', async ({ page }) => {
    // Load with test hook and French
    await page.goto('/index.html?test=1');
    await page.evaluate(() => localStorage.setItem('chezjulien_lang', 'fr'));
    await page.reload();
    
    // Wait for test hook and game state to be ready
    await page.waitForFunction(
      () => typeof window.__testJumpToBuildingDeadline === 'function' && window.gameState && typeof window.selectNextEvent === 'function',
      { timeout: 10000 }
    );
    
    // Wait for locale to load (async fetch)
    await page.waitForFunction(
      () => window.currentLocale && window.currentLocale.langCode === 'fr',
      { timeout: 20000 }
    );

    // Small delay to ensure DOM is ready
    await page.waitForTimeout(500);
    
    const choiceTexts = await page.evaluate(() => {
      try {
        return window.__testJumpToBuildingDeadline(75000);
      } catch (e) {
        console.error('Test hook error:', e);
        throw e;
      }
    });

    // Must not show the "I have the money" sign option (FR: "Signer – j'ai les 80 000 €" or similar)
    const signOption = choiceTexts.find(t => /Signer.*80\s*000|Sign.*80,?000|j'ai les 80/i.test(t));
    expect(signOption, 'When short on cash, "Sign – I have €80k" must not appear').toBeUndefined();

    // Must show the "cannot afford" options (FR: extend or let go)
    const hasExtendOrLetGo = choiceTexts.some(t =>
      /Demander un mois|Laisser filer|Ask for one more|Watch it slip|Let it go/i.test(t)
    );
    expect(hasExtendOrLetGo, 'Must show "ask for more time" or "let it go"').toBe(true);
  });

  test('when bank >= 80k and FR: must show Sign option', async ({ page }) => {
    await page.goto('/index.html?test=1');
    await page.evaluate(() => localStorage.setItem('chezjulien_lang', 'fr'));
    await page.reload();
    
    await page.waitForFunction(
      () => typeof window.__testJumpToBuildingDeadline === 'function' && window.gameState && typeof window.selectNextEvent === 'function',
      { timeout: 10000 }
    );
    
    await page.waitForFunction(
      () => window.currentLocale && window.currentLocale.langCode === 'fr',
      { timeout: 20000 }
    );

    await page.waitForTimeout(500);
    
    const choiceTexts = await page.evaluate(() => {
      try {
        return window.__testJumpToBuildingDeadline(82000);
      } catch (e) {
        console.error('Test hook error:', e);
        throw e;
      }
    });

    const hasSignOption = choiceTexts.some(t => /Signer|Sign the papers/i.test(t));
    expect(hasSignOption, 'When player has €80k+, Sign option must appear').toBe(true);
  });

  test('when bank < 80k and FR (extended deadline): must NOT show "Sign" option', async ({ page }) => {
    await page.goto('/index.html?test=1');
    await page.evaluate(() => localStorage.setItem('chezjulien_lang', 'fr'));
    await page.reload();
    
    await page.waitForFunction(
      () => typeof window.__testJumpToBuildingDeadline === 'function' && window.gameState && typeof window.selectNextEvent === 'function',
      { timeout: 10000 }
    );
    
    await page.waitForFunction(
      () => window.currentLocale && window.currentLocale.langCode === 'fr',
      { timeout: 20000 }
    );

    await page.waitForTimeout(500);
    
    // Test extended deadline (€85k total, need at least €80k base)
    const choiceTexts = await page.evaluate(() => {
      try {
        return window.__testJumpToBuildingDeadline(78000, true); // Extended deadline, can't afford
      } catch (e) {
        console.error('Test hook error:', e);
        throw e;
      }
    });

    // Must not show "Signer" when short on cash (extended deadline)
    const signOption = choiceTexts.find(t => /Signer.*85|Sign.*85,?000|J'ai les 85/i.test(t));
    expect(signOption, 'Extended deadline: When short on cash, "Sign – I have €85k" must not appear').toBeUndefined();
  });
});
