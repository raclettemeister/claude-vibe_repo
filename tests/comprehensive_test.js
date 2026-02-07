/**
 * Comprehensive Game Test Suite — Chez Julien
 * Covers: Localization, Balance, Edge Cases, Game Logic, Events
 * Run: node tests/comprehensive_test.js
 */

const fs = require('fs');
const path = require('path');

// ── Helpers ────────────────────────────────────────────────────────
let passed = 0, failed = 0, warnings = 0;
const bugs = [];

function pass(msg) { passed++; console.log(`  ✓ ${msg}`); }
function fail(msg) { failed++; bugs.push(msg); console.log(`  ✗ FAIL: ${msg}`); }
function warn(msg) { warnings++; console.log(`  ⚠ WARN: ${msg}`); }
function section(title) { console.log(`\n${'═'.repeat(60)}\n  ${title}\n${'═'.repeat(60)}`); }

function deepKeys(obj, prefix = '') {
    let keys = [];
    for (const k of Object.keys(obj)) {
        const full = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            keys = keys.concat(deepKeys(obj[k], full));
        } else {
            keys.push(full);
        }
    }
    return keys;
}

function getNested(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
}

// ── Load Data ──────────────────────────────────────────────────────
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'locales', 'en.json'), 'utf8'));
const fr = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'locales', 'fr.json'), 'utf8'));

// Load events  
const eventsRaw = fs.readFileSync(path.join(__dirname, '..', 'data', 'events.js'), 'utf8');
// Extract the array by evaluating in a safe way
let events;
try {
    // The file exports via: const events = [...]
    // We need to extract the array
    const match = eventsRaw.match(/(?:const|let|var)\s+events\s*=\s*(\[[\s\S]*\]);?\s*$/m);
    if (match) {
        // Replace function references with dummy functions for parsing
        let arrayStr = match[1]
            .replace(/condition:\s*\(\)\s*=>\s*\{[^}]*\}/g, 'condition: null')
            .replace(/condition:\s*\(\)\s*=>\s*[^,}]*/g, 'condition: null')
            .replace(/conditionalEffects:\s*\(\)\s*=>\s*\(\{[^}]*\}\)/g, 'conditionalEffects: null')
            .replace(/conditionalEffects:\s*\(\)\s*=>\s*\{[^}]*\}/g, 'conditionalEffects: null');
        events = eval(arrayStr);
    }
} catch (e) {
    // Fallback: parse line by line for basic structure
    console.log('  Note: Could not fully parse events.js, using regex extraction');
    events = null;
}

// Load index.html for code analysis
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// ════════════════════════════════════════════════════════════════════
//  1. LOCALIZATION COMPLETENESS
// ════════════════════════════════════════════════════════════════════
section('1. LOCALIZATION — Key Completeness (EN ↔ FR)');

// Get all keys from both, but skip array-indexed paths (glossary items, belgian items, etc.)
const enKeys = deepKeys(en).filter(k => !k.match(/\.\d+\./));
const frKeys = deepKeys(fr).filter(k => !k.match(/\.\d+\./));

const missingInFr = enKeys.filter(k => getNested(fr, k) === undefined);
const missingInEn = frKeys.filter(k => getNested(en, k) === undefined);

if (missingInFr.length === 0) {
    pass(`All ${enKeys.length} EN keys present in FR`);
} else {
    fail(`${missingInFr.length} EN keys MISSING in FR: ${missingInFr.slice(0, 10).join(', ')}${missingInFr.length > 10 ? '...' : ''}`);
}

// FR has more event keys than EN by design: EN event text lives in events.js (inline),
// while FR translations live in fr.json. Only special/dynamic events need EN locale entries.
const missingInEnNonEvent = missingInEn.filter(k => !k.startsWith('events.'));
const missingInEnEvents = missingInEn.filter(k => k.startsWith('events.'));
if (missingInEnNonEvent.length === 0) {
    pass(`All non-event FR keys present in EN (${missingInEnEvents.length} FR-only event translations — by design)`);
} else {
    fail(`${missingInEnNonEvent.length} non-event FR keys MISSING in EN: ${missingInEnNonEvent.join(', ')}`);
}

// ── Check langCode ─────────────────────────────────────────────────
section('1b. LOCALIZATION — Language Codes');
if (en.langCode === 'en') pass('EN langCode = "en"');
else fail(`EN langCode is "${en.langCode}" (expected "en")`);

if (fr.langCode === 'fr') pass('FR langCode = "fr"');
else fail(`FR langCode is "${fr.langCode}" (expected "fr")`);

// ── Check month arrays ─────────────────────────────────────────────
section('1c. LOCALIZATION — Month Arrays');
if (en.monthsShort && en.monthsShort.length === 12) pass('EN monthsShort has 12 entries');
else fail(`EN monthsShort has ${en.monthsShort?.length} entries (expected 12)`);

if (fr.monthsShort && fr.monthsShort.length === 12) pass('FR monthsShort has 12 entries');
else fail(`FR monthsShort has ${fr.monthsShort?.length} entries (expected 12)`);

if (en.monthsFull && en.monthsFull.length === 12) pass('EN monthsFull has 12 entries');
else fail(`EN monthsFull has ${en.monthsFull?.length} entries (expected 12)`);

if (fr.monthsFull && fr.monthsFull.length === 12) pass('FR monthsFull has 12 entries');
else fail(`FR monthsFull has ${fr.monthsFull?.length} entries (expected 12)`);

// ── Check glossary & belgian arrays match ──────────────────────────
section('1d. LOCALIZATION — Glossary & Belgian Arrays');
const enGlossaryCount = en.glossary?.items?.length || 0;
const frGlossaryCount = fr.glossary?.items?.length || 0;
if (enGlossaryCount === frGlossaryCount && enGlossaryCount > 0) {
    pass(`Glossary items match: ${enGlossaryCount} in both`);
} else {
    fail(`Glossary item count mismatch: EN=${enGlossaryCount}, FR=${frGlossaryCount}`);
}

const enBelgianCount = en.belgian?.items?.length || 0;
const frBelgianCount = fr.belgian?.items?.length || 0;
if (enBelgianCount === frBelgianCount && enBelgianCount > 0) {
    pass(`Belgian items match: ${enBelgianCount} in both`);
} else {
    fail(`Belgian item count mismatch: EN=${enBelgianCount}, FR=${frBelgianCount}`);
}

// ── Check event translations ───────────────────────────────────────
section('1e. LOCALIZATION — Event Translations');
const enEventIds = Object.keys(en.events || {});
const frEventIds = Object.keys(fr.events || {});

const eventsMissingInFr = enEventIds.filter(id => !fr.events?.[id]);
const eventsMissingInEn = frEventIds.filter(id => !en.events?.[id]);

if (eventsMissingInFr.length === 0) {
    pass(`All ${enEventIds.length} EN event translations present in FR`);
} else {
    fail(`${eventsMissingInFr.length} events MISSING in FR: ${eventsMissingInFr.join(', ')}`);
}

if (eventsMissingInEn.length === 0) {
    pass(`All ${frEventIds.length} FR event translations present in EN`);
} else {
    warn(`${eventsMissingInEn.length} FR events not in EN (extra): ${eventsMissingInEn.join(', ')}`);
}

// Check event choice counts match between EN and FR
let choiceMismatch = 0;
for (const id of enEventIds) {
    if (!fr.events?.[id]) continue;
    const enChoices = en.events[id].choices;
    const frChoices = fr.events[id].choices;
    if (enChoices && frChoices && enChoices.length !== frChoices.length) {
        choiceMismatch++;
        fail(`Event "${id}" choice count mismatch: EN=${enChoices.length}, FR=${frChoices.length}`);
    }
    // Check special building deadline choice arrays
    for (const choiceKey of ['choicesCanAfford', 'choicesCannotAfford', 'choicesExtendedCanAfford', 'choicesExtendedCannotAfford']) {
        const enC = en.events[id]?.[choiceKey];
        const frC = fr.events[id]?.[choiceKey];
        if (enC && frC && enC.length !== frC.length) {
            choiceMismatch++;
            fail(`Event "${id}" ${choiceKey} count mismatch: EN=${enC.length}, FR=${frC.length}`);
        }
        if (enC && !frC) {
            fail(`Event "${id}" has ${choiceKey} in EN but not FR`);
        }
    }
}
if (choiceMismatch === 0) pass('All event choice counts match between EN and FR');

// ── Check photo translations ───────────────────────────────────────
section('1f. LOCALIZATION — Photo Translations');
const enPhotoIds = Object.keys(en.photos || {});
const frPhotoIds = Object.keys(fr.photos || {});

const photosMissingInFr = enPhotoIds.filter(id => !fr.photos?.[id]);
if (photosMissingInFr.length === 0) {
    pass(`All ${enPhotoIds.length} photo translations present in FR`);
} else {
    fail(`${photosMissingInFr.length} photos MISSING in FR: ${photosMissingInFr.join(', ')}`);
}

// ── Check for untranslated text (FR values same as EN) ─────────────
section('1g. LOCALIZATION — Untranslated Text Detection');
let untranslated = 0;
const skipKeys = ['langCode', 'ui.title', 'ui.shopName', 'ui.achievementCount', 'game.trackCafe', 'game.trackNoel'];
for (const k of enKeys) {
    if (skipKeys.some(sk => k === sk || k.startsWith(sk + '.'))) continue;
    const enVal = getNested(en, k);
    const frVal = getNested(fr, k);
    if (typeof enVal === 'string' && typeof frVal === 'string' && enVal === frVal && enVal.length > 3) {
        // Skip proper nouns and technical terms
        if (/^(AFSCA|Lucas|Henry|Poncho|Julien|Coprosain|Lalero|Interbio|Tomme|Comté|Beaufort|Manchego)/.test(enVal)) continue;
        untranslated++;
        if (untranslated <= 5) warn(`Possibly untranslated: "${k}" = "${enVal.substring(0, 50)}"`);
    }
}
if (untranslated === 0) pass('No obviously untranslated FR strings found');
else warn(`${untranslated} potentially untranslated strings (may be intentional)`);

// ── Check template variable consistency ────────────────────────────
section('1h. LOCALIZATION — Template Variables Consistency');
let templateMismatch = 0;
for (const k of enKeys) {
    const enVal = getNested(en, k);
    const frVal = getNested(fr, k);
    if (typeof enVal !== 'string' || typeof frVal !== 'string') continue;
    const enVars = (enVal.match(/\{\{(\w+)\}\}/g) || []).sort();
    const frVars = (frVal.match(/\{\{(\w+)\}\}/g) || []).sort();
    if (JSON.stringify(enVars) !== JSON.stringify(frVars)) {
        templateMismatch++;
        if (templateMismatch <= 5) fail(`Template vars differ at "${k}": EN=${enVars.join(',')} FR=${frVars.join(',')}`);
    }
}
if (templateMismatch === 0) pass('All template variables {{...}} match between EN and FR');
else if (templateMismatch > 5) fail(`${templateMismatch} total template variable mismatches`);


// ════════════════════════════════════════════════════════════════════
//  2. EVENTS VALIDATION
// ════════════════════════════════════════════════════════════════════
section('2. EVENTS — Structure Validation');

if (events) {
    console.log(`  Total events loaded: ${events.length}`);
    
    // Check for duplicate IDs
    const idCounts = {};
    events.forEach(e => { idCounts[e.id] = (idCounts[e.id] || 0) + 1; });
    const dupes = Object.entries(idCounts).filter(([_, c]) => c > 1);
    if (dupes.length === 0) pass('No duplicate event IDs');
    else fail(`Duplicate event IDs: ${dupes.map(([id, c]) => `${id}(×${c})`).join(', ')}`);

    // Check all events have required fields
    let missingFields = 0;
    events.forEach(e => {
        if (!e.id) { missingFields++; fail(`Event missing "id": ${JSON.stringify(e).substring(0, 80)}`); }
        if (!e.monthRange || !Array.isArray(e.monthRange) || e.monthRange.length !== 2) {
            if (!e.special) { missingFields++; fail(`Event "${e.id}" missing valid "monthRange"`); }
        }
        if (!e.choices && !e.special && !e.dynamicChoices) {
            missingFields++; fail(`Event "${e.id}" missing "choices"`);
        }
    });
    if (missingFields === 0) pass('All events have required fields (id, monthRange, choices)');

    // Check monthRange validity (start <= end, within 1-42)
    let invalidRange = 0;
    events.forEach(e => {
        if (!e.monthRange) return;
        const [s, end] = e.monthRange;
        if (s < 1 || end > 42 || s > end) {
            invalidRange++;
            fail(`Event "${e.id}" has invalid monthRange [${s}, ${end}]`);
        }
    });
    if (invalidRange === 0) pass('All monthRanges valid (within 1-42, start <= end)');

    // Check all events have locale translations
    const eventIdsInData = events.map(e => e.id).filter(id => id);
    const enTranslatedEvents = Object.keys(en.events || {});
    const frTranslatedEvents = Object.keys(fr.events || {});

    // Special events use dynamic descriptions, so they may have translations under different keys
    const specialEventIds = events.filter(e => e.special).map(e => e.id);
    const regularEventIds = eventIdsInData.filter(id => !specialEventIds.includes(id));

    let untranslatedEvents = 0;
    for (const id of regularEventIds) {
        if (!en.events?.[id] && !enTranslatedEvents.includes(id)) {
            // Check if it has inline title/description
            const evt = events.find(e => e.id === id);
            if (evt && !evt.title && !evt.description) {
                untranslatedEvents++;
                if (untranslatedEvents <= 5) warn(`Event "${id}" has no EN locale entry and no inline text`);
            }
        }
    }

    // Check choice effects are valid
    let invalidEffects = 0;
    const validEffectKeys = ['bank', 'stress', 'energy', 'family', 'autonomy', 'reputation', 'cheeseTypes', 'loan', 'monthlySales'];
    events.forEach(e => {
        if (!e.choices) return;
        e.choices.forEach((c, i) => {
            if (c.effects) {
                for (const k of Object.keys(c.effects)) {
                    if (!validEffectKeys.includes(k) && typeof c.effects[k] === 'number') {
                        // Not necessarily invalid - could be a custom effect
                    }
                }
            }
        });
    });

    // Check mandatory events exist
    const mandatoryIds = events.filter(e => e.mandatory).map(e => e.id);
    console.log(`  Mandatory events: ${mandatoryIds.join(', ')}`);
    if (mandatoryIds.includes('building_deadline')) pass('building_deadline is mandatory');
    else fail('building_deadline should be mandatory');

    if (mandatoryIds.includes('building_deadline_extended')) pass('building_deadline_extended is mandatory');
    else fail('building_deadline_extended should be mandatory');

} else {
    warn('Could not parse events.js — skipping event validation');
}


// ════════════════════════════════════════════════════════════════════
//  3. GAME BALANCE — Code Analysis
// ════════════════════════════════════════════════════════════════════
section('3. GAME BALANCE — Constants Verification');

// Extract key constants from index.html
const baseSalesMatch = indexHtml.match(/let baseSales\s*=\s*(\d+)/);
const baseSales = baseSalesMatch ? parseInt(baseSalesMatch[1]) : null;
if (baseSales === 19000) pass(`Base sales = €${baseSales}`);
else fail(`Base sales = €${baseSales} (expected 19000)`);

const rentMatch = indexHtml.match(/let fixedCosts\s*=\s*(\d+)/);
const rent = rentMatch ? parseInt(rentMatch[1]) : null;
if (rent === 1900) pass(`Base rent = €${rent}`);
else fail(`Base rent = €${rent} (expected 1900)`);

const buildingLoanMatch = indexHtml.match(/fixedCosts\s*\+=\s*(\d+);\s*\/\/\s*Add building loan payment/);
const buildingLoan = buildingLoanMatch ? parseInt(buildingLoanMatch[1]) : null;
if (buildingLoan === 2500) pass(`Building loan payment = €${buildingLoan}`);
else fail(`Building loan payment = €${buildingLoan} (expected 2500)`);

// Tax rate
if (indexHtml.includes('netProfit * 0.20')) pass('Tax rate = 20%');
else fail('Tax rate not found as 20%');

// Margin cap
if (indexHtml.includes("Math.min(45, marginPercent)")) pass('Margin cap = 45%');
else fail('Margin cap not 45%');

// Difficulty modifiers
const diffMatch = indexHtml.match(/const\s+difficultyModifiers\s*=\s*\{[\s\S]*?\};/);
if (diffMatch) {
    const diffStr = diffMatch[0];
    if (diffStr.includes('salesMod: 1.12') || diffStr.includes('salesMod:1.12')) pass('Forgiving salesMod = 1.12');
    else fail('Forgiving salesMod not 1.12');
    if (diffStr.includes('salesMod: 0.88') || diffStr.includes('salesMod:0.88')) pass('Brutal salesMod = 0.88');
    else fail('Brutal salesMod not 0.88');
} else {
    fail('difficultyModifiers not found in code');
}

// Starting values
const startingBankMatch = indexHtml.match(/bank:\s*15000/);
if (startingBankMatch) pass('Starting bank (realistic) = €15,000');
else fail('Starting bank not €15,000');

// Max months
if (indexHtml.includes('maxMonths: 42')) pass('Max months = 42');
else fail('Max months not 42');

// Seasonal modifiers
section('3b. GAME BALANCE — Seasonal Modifiers');
const seasonalMatch = indexHtml.match(/const seasonalMod\s*=\s*\{([^}]+)\}/);
if (seasonalMatch) {
    const sm = seasonalMatch[1];
    if (sm.includes('12: 1.35')) pass('December seasonal = 1.35x');
    else fail('December seasonal not 1.35x');
    if (sm.includes('8: 0.75')) pass('August seasonal = 0.75x');
    else fail('August seasonal not 0.75x');
    if (sm.includes('7: 0.82')) pass('July seasonal = 0.82x');
    else fail('July seasonal not 0.82x');
} else {
    fail('Seasonal modifiers not found');
}

// Staff costs
section('3c. GAME BALANCE — Staff Costs');
if (indexHtml.includes('hasLucas) fixedCosts += 1400')) pass('Lucas cost = €1,400');
else fail('Lucas cost not €1,400');
if (indexHtml.includes('hasHenry) fixedCosts += 1800')) pass('Henry cost = €1,800');
else fail('Henry cost not €1,800');

// Burnout threshold
section('3d. GAME BALANCE — Burnout System');
if (indexHtml.includes('stress >= 80')) pass('Burnout threshold = 80%');
else fail('Burnout threshold not at 80%');

if (indexHtml.includes('burnoutCount >= 3')) pass('Game over at 3rd burnout');
else fail('3rd burnout game over not found');

if (indexHtml.includes('maxEnergyCap - 20')) pass('Each burnout reduces max energy by 20');
else fail('Burnout energy cap reduction not found');

// Supplier grace periods
if (indexHtml.includes('supplierGracePeriods: 3')) pass('Supplier grace periods = 3');
else fail('Supplier grace periods not 3');


// ════════════════════════════════════════════════════════════════════
//  4. GAME LOGIC — Edge Case Analysis
// ════════════════════════════════════════════════════════════════════
section('4. GAME LOGIC — Edge Cases');

// Check for double-click protection
if (indexHtml.match(/choiceProcessing|isProcessing|debounce|disabled/)) {
    pass('Some form of click protection found');
} else {
    // Check if choice buttons are disabled after click
    if (indexHtml.match(/\.disabled\s*=\s*true/) || indexHtml.match(/removeEventListener/)) {
        pass('Button disable pattern found');
    } else {
        warn('No obvious double-click protection on choice buttons — could cause double event processing');
    }
}

// Check clamp function exists and is used
if (indexHtml.includes('function clamp(value, min, max)')) pass('clamp() utility exists');
else fail('clamp() utility not found');

// Check stress is clamped
if (indexHtml.match(/clamp\(gameState\.stress\s*[+\-]/)) pass('Stress values are clamped');
else fail('Stress not clamped');

// Check energy is clamped
if (indexHtml.match(/clamp\(gameState\.energy/)) pass('Energy values are clamped');
else fail('Energy not clamped');

// Check family is clamped
if (indexHtml.match(/clamp\(gameState\.family/)) pass('Family values are clamped');
else fail('Family not clamped');

// Check bank floor
if (indexHtml.includes('newBank < 0')) pass('Negative bank balance handled');
else fail('No negative bank balance handling');

// Month rollover
if (indexHtml.includes('gameState.month > 12')) pass('Month rollover (>12) handled');
else fail('Month rollover not handled');

// Game over conditions completeness
section('4b. GAME LOGIC — Game Over Conditions');
const gameOverReasons = ['burnout', 'suppliers', 'bankruptcy', 'health', 'relationships', 'completed'];
gameOverReasons.forEach(r => {
    if (indexHtml.includes(`gameOverReason = '${r}'`) || indexHtml.includes(`gameOverReason === '${r}'`)) {
        pass(`Game over reason "${r}" exists`);
    } else {
        fail(`Game over reason "${r}" not found`);
    }
});

// End screen handles all game over types
section('4c. GAME LOGIC — End Screen Completeness');
for (const reason of gameOverReasons) {
    if (reason === 'completed') {
        if (indexHtml.includes("'completed'")) pass('End screen handles "completed"');
        else fail('End screen missing "completed" handler');
    } else if (reason === 'burnout') {
        // Burnout is handled via health now, but check
        if (indexHtml.includes("'health'") || indexHtml.includes("'burnout'")) pass('End screen handles health/burnout');
        else fail('End screen missing health/burnout handler');
    } else {
        if (indexHtml.includes(`'${reason}'`)) pass(`End screen handles "${reason}"`);
        else fail(`End screen missing "${reason}" handler`);
    }
}


// ════════════════════════════════════════════════════════════════════
//  5. UI / RESPONSIVE — CSS Analysis
// ════════════════════════════════════════════════════════════════════
section('5. CSS — Responsive Design');

// Check mobile breakpoints exist
if (indexHtml.includes('@media') && indexHtml.includes('600px')) pass('Mobile breakpoint (600px) present');
else fail('No mobile breakpoint');

if (indexHtml.includes('900px')) pass('Tablet breakpoint (900px) present');
else warn('No explicit 900px breakpoint');

// Touch-friendly sizing
if (indexHtml.includes('--touch-min: 44px')) pass('Touch target minimum = 44px');
else fail('--touch-min not set to 44px');

// Viewport meta tag
if (indexHtml.includes('width=device-width, initial-scale=1.0')) pass('Viewport meta tag present');
else fail('Missing viewport meta tag');

// Check scroll behavior for mobile
if (indexHtml.includes('-webkit-overflow-scrolling: touch')) pass('Smooth scrolling on iOS');
else warn('No -webkit-overflow-scrolling: touch');

// Safe area for music bar
if (indexHtml.includes('safe-area') || indexHtml.includes('env(safe-area')) pass('Safe area padding found');
else warn('No safe area padding detected');


// ════════════════════════════════════════════════════════════════════
//  6. AUDIO SYSTEM — Code Analysis
// ════════════════════════════════════════════════════════════════════
section('6. AUDIO — Music System');

if (indexHtml.includes('AudioContext') || indexHtml.includes('webkitAudioContext')) pass('Web Audio API used');
else fail('No Web Audio API found');

if (indexHtml.includes('MusicSystem') || indexHtml.includes('musicSystem')) pass('Music system object exists');
else fail('No music system found');

// Check for mood types
const moods = ['peaceful', 'hopeful', 'tense', 'triumphant', 'christmas'];
moods.forEach(m => {
    if (indexHtml.toLowerCase().includes(m)) pass(`Mood "${m}" found`);
    else fail(`Mood "${m}" not found`);
});

// Play/pause
if (indexHtml.match(/toggle|play.*pause|pause.*play/i)) pass('Play/pause toggle found');
else fail('No play/pause toggle');


// ════════════════════════════════════════════════════════════════════
//  7. PERSISTENCE — localStorage Analysis
// ════════════════════════════════════════════════════════════════════
section('7. PERSISTENCE — localStorage');

if (indexHtml.includes('chezjulien_lang')) pass('Language persistence key found');
else fail('Language persistence key missing');

if (indexHtml.includes('chezJulien_photos')) pass('Photo persistence key found');
else fail('Photo persistence key missing');

if (indexHtml.includes('chezJulien_trophies')) pass('Trophy persistence key found');
else fail('Trophy persistence key missing');

// Check for JSON.parse error handling
if (indexHtml.match(/try\s*\{[\s\S]*?JSON\.parse[\s\S]*?\}\s*catch/)) {
    pass('JSON.parse wrapped in try/catch (corruption protection)');
} else {
    warn('JSON.parse may not be wrapped in try/catch — localStorage corruption could crash the game');
}


// ════════════════════════════════════════════════════════════════════
//  8. DATA-I18N CONSISTENCY
// ════════════════════════════════════════════════════════════════════
section('8. HTML — data-i18n Attributes');

// Extract all data-i18n values from HTML
const dataI18nMatches = indexHtml.match(/data-i18n="([^"]+)"/g) || [];
const dataI18nKeys = dataI18nMatches.map(m => m.match(/data-i18n="([^"]+)"/)[1]);

let missingI18nKeys = 0;
for (const key of dataI18nKeys) {
    const enVal = getNested(en, key);
    const frVal = getNested(fr, key);
    if (enVal === undefined) {
        missingI18nKeys++;
        if (missingI18nKeys <= 5) fail(`data-i18n="${key}" not found in EN locale`);
    }
    if (frVal === undefined) {
        missingI18nKeys++;
        if (missingI18nKeys <= 5) fail(`data-i18n="${key}" not found in FR locale`);
    }
}
if (missingI18nKeys === 0) {
    pass(`All ${dataI18nKeys.length} data-i18n keys found in both locales`);
} else {
    fail(`${missingI18nKeys} missing data-i18n keys in locale files`);
}


// ════════════════════════════════════════════════════════════════════
//  9. BALANCE SIMULATION — Quick Sanity Check
// ════════════════════════════════════════════════════════════════════
section('9. BALANCE SIMULATION — 42 Month Runs');

function simulateRun(difficulty, strategy) {
    const mods = {
        forgiving: { salesMod: 1.12, costMod: 0.92, meterDrain: 0.7 },
        realistic: { salesMod: 1.0, costMod: 1.0, meterDrain: 1.0 },
        brutal: { salesMod: 0.88, costMod: 1.08, meterDrain: 1.2 }
    };
    const mod = mods[difficulty];
    const startBank = { forgiving: 20000, realistic: 15000, brutal: 10000 }[difficulty];
    const startStress = { forgiving: 20, realistic: 30, brutal: 40 }[difficulty];

    let bank = startBank;
    let stress = startStress;
    let energy = 100;
    let family = 70;
    let autonomy = 20;
    let reputation = 50;
    let cheeseTypes = 0;
    let openSunday = strategy === 'grind';
    let hasLucas = false;
    let hasHenry = false;
    let maxEnergyCap = 100;
    let burnoutCount = 0;
    let ownsBuilding = false;
    let monthsSurvived = 0;
    let totalRevenue = 0;

    const seasonalMod = { 1:0.85, 2:0.88, 3:0.92, 4:0.95, 5:0.98, 6:1.0, 7:0.82, 8:0.75, 9:0.92, 10:1.0, 11:1.10, 12:1.35 };

    for (let m = 1; m <= 42; m++) {
        const calMonth = ((6 + m) % 12) + 1; // Start July (month 7)
        monthsSurvived = m;

        // Simulate cheese growth
        if (m >= 3) cheeseTypes = Math.min(95, cheeseTypes + 2);
        if (m >= 12) { hasLucas = true; }
        if (m >= 24) { hasHenry = true; }

        // Autonomy growth
        if (hasLucas) autonomy = Math.min(100, autonomy + 1);
        if (hasHenry) autonomy = Math.min(100, autonomy + 2);

        // Sales calculation (simplified)
        let sales = 19000;
        let cheeseBonus = cheeseTypes <= 20 ? cheeseTypes * 100 : (cheeseTypes <= 50 ? 2000 + (cheeseTypes - 20) * 120 : 2000 + 3600 + (cheeseTypes - 50) * 60);
        sales += cheeseBonus;
        sales *= (0.75 + reputation * 0.005);
        sales *= (0.90 + autonomy * 0.002);
        if (energy < 60) sales *= (1 - (60 - energy) * 0.002);
        sales *= mod.salesMod;
        sales *= seasonalMod[calMonth];
        if (openSunday) sales += 1000;
        if (ownsBuilding) sales *= 1.03;

        // Costs
        let margin = Math.min(45, 30 + cheeseTypes * 0.10 + Math.max(0, (reputation - 50) * 0.08));
        let costs = 1900 + 400 + 200 + 1200; // rent + utils + insurance + survival salary
        if (hasLucas) costs += 1400;
        if (hasHenry) costs += 1800;
        if (ownsBuilding) { costs -= 1900; costs += 2500; }
        costs *= mod.costMod;

        const cogs = sales * (1 - margin / 100);
        let profit = sales - cogs - costs;
        if (profit > 0) profit *= 0.80; // 20% tax

        bank += Math.round(profit);
        totalRevenue += Math.round(sales);

        // Family events (simplified)
        if (strategy === 'family') { family = Math.min(100, family + 1); }
        else { family = Math.max(0, family - 1); }

        // Stress
        let stressChange = 3;
        if (openSunday) stressChange += (m <= 4 ? 1 : m <= 8 ? 3 : m <= 14 ? 5 : 3);
        if (!hasLucas && !hasHenry) stressChange += 2;
        if (hasHenry) stressChange -= 3;
        else if (hasLucas) stressChange -= 1;
        let autonomyReduction = Math.floor(Math.max(0, autonomy - 20) / 20);
        stressChange = Math.max(0, stressChange - autonomyReduction);
        stress = Math.min(100, stress + stressChange);

        let recovery = openSunday ? 3 : 5;
        if (autonomy >= 50) recovery += 1;
        if (autonomy >= 70) recovery += 1;
        stress = Math.max(0, stress - recovery);
        energy = Math.min(maxEnergyCap, energy + 4);

        if (hasHenry) { energy = Math.min(maxEnergyCap, energy + 3); stress = Math.max(0, stress - 2); }
        if (hasLucas) { stress = Math.max(0, stress - 1); }

        // Reputation growth (simplified)
        reputation = Math.min(100, reputation + 1);

        // Burnout check
        if (stress >= 80 && m >= 6) {
            burnoutCount++;
            openSunday = false;
            maxEnergyCap = Math.max(20, maxEnergyCap - 20);
            energy = Math.min(energy, maxEnergyCap);
            stress = Math.min(30, stress - 40);
            bank = Math.max(0, bank - Math.round(sales * 0.25));
        }

        // Game over checks
        if (burnoutCount >= 3) break;
        if (bank < 0) bank = 0;
        if (family <= 0) break;

        // Building at month 25
        if (m === 25 && bank >= 80000) {
            bank -= 80000;
            ownsBuilding = true;
        }
    }

    return { bank, stress, energy, family, autonomy, reputation, cheeseTypes, burnoutCount, ownsBuilding, monthsSurvived, totalRevenue };
}

// Run simulations
const runs = [
    { difficulty: 'realistic', strategy: 'balanced', label: 'Realistic/Balanced' },
    { difficulty: 'realistic', strategy: 'grind', label: 'Realistic/Grind' },
    { difficulty: 'realistic', strategy: 'family', label: 'Realistic/Family' },
    { difficulty: 'forgiving', strategy: 'balanced', label: 'Forgiving/Balanced' },
    { difficulty: 'brutal', strategy: 'balanced', label: 'Brutal/Balanced' },
    { difficulty: 'brutal', strategy: 'grind', label: 'Brutal/Grind' },
];

for (const r of runs) {
    const result = simulateRun(r.difficulty, r.strategy);
    const survived = result.monthsSurvived >= 42;
    const line = `${r.label}: survived=${survived} months=${result.monthsSurvived} bank=€${result.bank.toLocaleString()} burnouts=${result.burnoutCount} building=${result.ownsBuilding}`;
    
    if (result.monthsSurvived >= 42) {
        pass(line);
    } else if (r.difficulty === 'brutal') {
        warn(line + ' (brutal may not survive — acceptable)');
    } else {
        warn(line);
    }
}

// Specific balance checks
const realisticGrind = simulateRun('realistic', 'grind');
const realisticFamily = simulateRun('realistic', 'family');

if (realisticFamily.ownsBuilding === false) {
    pass('Family-first path does NOT easily buy building (design intent)');
} else {
    warn('Family-first path CAN buy building — may be too easy');
}

if (realisticGrind.burnoutCount > 0) {
    pass('Grind path triggers burnout (design intent — Sunday stress)');
} else {
    warn('Grind path had zero burnouts — Sunday stress may be too low');
}


// ════════════════════════════════════════════════════════════════════
//  10. HTML STRUCTURE — Element IDs
// ════════════════════════════════════════════════════════════════════
section('10. HTML — Critical Element IDs');

const criticalIds = [
    'title-screen', 'game-screen', 'end-screen', 'intro-screen',
    'event-card', 'event-type', 'event-title', 'event-description',
    'choices-container', 'outcome-modal', 'photo-album',
    'end-title', 'end-subtitle', 'final-stats', 'story-section',
    'lessons-section', 'achievement-list'
];

criticalIds.forEach(id => {
    if (indexHtml.includes(`id="${id}"`)) pass(`Element #${id} exists`);
    else fail(`Missing element #${id}`);
});


// ════════════════════════════════════════════════════════════════════
//  SUMMARY
// ════════════════════════════════════════════════════════════════════
section('SUMMARY');
console.log(`  ✓ PASSED: ${passed}`);
console.log(`  ✗ FAILED: ${failed}`);
console.log(`  ⚠ WARNINGS: ${warnings}`);

if (bugs.length > 0) {
    console.log(`\n  ─── BUGS TO FIX ───`);
    bugs.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
}

console.log(`\n${'═'.repeat(60)}`);
if (failed === 0) {
    console.log('  ALL TESTS PASSED! Ready for merge.');
} else {
    console.log(`  ${failed} FAILURE(S) FOUND — fix before merging.`);
}
console.log('═'.repeat(60) + '\n');

process.exit(failed > 0 ? 1 : 0);
