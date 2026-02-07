#!/usr/bin/env node
/**
 * Chez Julien — 3-Playstyle Balance Simulation
 * 
 * Simulates 42 months of gameplay for 3 distinct playstyles:
 * 1. INSIDER: Knows Julien's story, plays optimally for the building
 * 2. DISCOVERER: Doesn't know the story, motivated to win but no meta-knowledge
 * 3. FAMILY-FIRST: Prioritizes Julien's wellbeing — no burnouts, no family sacrifices
 * 
 * Uses actual game constants from balance-constants.js and event effects from events.js
 * Run: node tests/playstyle-balance-test.js
 */

// ============================================
// GAME CONSTANTS (from balance-constants.js)
// ============================================
const STARTING_BANK = 15000;
const BUILDING_COST = 80000;
const BUILDING_DEADLINE_MONTH = 25; // Month index
const TOTAL_MONTHS = 42;
const STARTING_MONTH = 7; // July
const STARTING_STRESS = 30;
const STARTING_ENERGY = 100;
const STARTING_FAMILY = 70;
const STARTING_AUTONOMY = 20;
const STARTING_REPUTATION = 50;
const STRESS_BURNOUT_THRESHOLD = 80;
const ENERGY_REDUCTION_PER_BURNOUT = 20;
const TAX_RATE = 0.20;

// Seasonal modifiers (from calculateMonthlyFinancials)
const SEASONAL_MOD = {
    1: 0.85, 2: 0.88, 3: 0.92, 4: 0.95, 5: 0.98, 6: 1.0,
    7: 0.82, 8: 0.75, 9: 0.92, 10: 1.0, 11: 1.10, 12: 1.35
};

// ============================================
// HELPER: Calculate monthly financials (mirrors index.html)
// ============================================
function calculateMonthlyFinancials(state) {
    let baseSales = 19000;

    // Cheese bonus
    let cheeseBonus = 0;
    if (state.cheeseTypes <= 20) {
        cheeseBonus = state.cheeseTypes * 100;
    } else if (state.cheeseTypes <= 50) {
        cheeseBonus = 2000 + (state.cheeseTypes - 20) * 120;
    } else {
        cheeseBonus = 2000 + 3600 + (state.cheeseTypes - 50) * 60;
    }
    baseSales += cheeseBonus;

    // Reputation multiplier
    baseSales *= 0.75 + (state.reputation * 0.005);

    // Autonomy multiplier
    baseSales *= 0.90 + (state.autonomy * 0.002);

    // Energy penalty
    if (state.energy < 60) {
        baseSales *= 1 - ((60 - state.energy) * 0.002);
    }

    // Product mix bonuses
    if (state.hasCharcuterie) baseSales += 800;
    if (state.hasWineSelection) baseSales *= 1.04;
    if (state.hasCorporateClient) baseSales += 1200;
    if (state.hasWineEvents) baseSales += 600;
    if (state.extendedHours) baseSales += 800;
    if (state.ownsBuilding) baseSales *= 1.03;

    // Seasonal modifier
    const calendarMonth = ((state.monthIndex - 1 + STARTING_MONTH - 1) % 12) + 1;
    baseSales *= SEASONAL_MOD[calendarMonth];

    // Sunday bonus
    if (state.openSunday) baseSales += 1000;

    // Use average variance (0.98) instead of random for deterministic simulation
    baseSales *= 0.98;

    // Margin
    let marginPercent = 30;
    marginPercent += Math.min(10, state.cheeseTypes * 0.10);
    marginPercent += Math.max(0, (state.reputation - 50) * 0.08);
    marginPercent += Math.max(0, (state.autonomy - 40) * 0.04);
    if (state.hasCharcuterie) marginPercent += 1;
    if (state.hasWineSelection) marginPercent += 2;
    marginPercent = Math.min(45, marginPercent);

    // Fixed costs
    let fixedCosts = 1900 + 400 + 200; // Rent + Utilities + Insurance

    if (state.salaryStarted) {
        const msb = state.monthsSinceBuilding || 0;
        fixedCosts += 2800 + Math.min(1000, msb * 60); // Owner salary
        if (state.hasCar) fixedCosts += 450;
        if (state.hasApartment) fixedCosts += 1400;
        fixedCosts += Math.min(1000, msb * 60); // Lifestyle creep
        fixedCosts += 200 + Math.min(500, msb * 30); // Reinvestment
        if (msb >= 6) fixedCosts += 300; // Social obligations
    } else {
        fixedCosts += 1200; // Survival salary
    }

    if (state.hasLucas) fixedCosts += 1400;
    if (state.hasHenry) fixedCosts += 1800;
    if (state.monthlyPayment) fixedCosts += state.monthlyPayment;
    if (state.monthlyInsurance) fixedCosts += state.monthlyInsurance;
    if (state.cheeseTypes > 50) fixedCosts += 150;
    if (state.cheeseTypes > 80) fixedCosts += 200;

    if (state.ownsBuilding) {
        fixedCosts -= 1900; // Remove rent
        fixedCosts += 2500; // Add loan payment
    }

    const cogs = baseSales * (1 - marginPercent / 100);
    let totalExpenses = cogs + fixedCosts;

    let netProfit = baseSales - totalExpenses;
    let taxes = 0;
    if (netProfit > 0) {
        taxes = netProfit * TAX_RATE;
        netProfit -= taxes;
    }

    return {
        baseSales: Math.round(baseSales),
        totalExpenses: Math.round(totalExpenses),
        taxes: Math.round(taxes),
        netProfit: Math.round(netProfit),
        marginPercent: Math.round(marginPercent),
        fixedCosts: Math.round(fixedCosts)
    };
}

// ============================================
// STATE FACTORY
// ============================================
function createState() {
    return {
        bank: STARTING_BANK,
        stress: STARTING_STRESS,
        energy: STARTING_ENERGY,
        family: STARTING_FAMILY,
        autonomy: STARTING_AUTONOMY,
        reputation: STARTING_REPUTATION,
        cheeseTypes: 0,
        monthIndex: 1,
        openSunday: false,
        hasCharcuterie: false,
        hasWineSelection: false,
        hasWineEvents: false,
        hasCorporateClient: false,
        extendedHours: false,
        hasLucas: false,
        hasHenry: false,
        hasDog: false,
        ownsBuilding: false,
        salaryStarted: false,
        hasCar: false,
        hasApartment: false,
        monthlyPayment: 0,
        monthlyInsurance: 0,
        monthsSinceBuilding: undefined,
        burnoutCount: 0,
        raclettePathStarted: false,
        swissVisitDone: false,
        racletteTypes: 0,
        producerRelationships: 0,
        producerVisits: 0,
        hasComprehensiveInsurance: false,
        buildingOfferReceived: false,
        concept: 'Bulk',
        bulkPercentage: 100,
        conceptPivotProgress: 0,
        maxEnergy: 100,
        totalRevenue: 0,
        gameOver: false,
        gameOverMonth: null,
        log: []
    };
}

// ============================================
// CLAMP STATS
// ============================================
function clampStats(state) {
    state.stress = Math.max(0, Math.min(100, state.stress));
    state.energy = Math.max(0, Math.min(state.maxEnergy, state.energy));
    state.family = Math.max(0, Math.min(100, state.family));
    state.autonomy = Math.max(0, Math.min(100, state.autonomy));
    state.reputation = Math.max(0, Math.min(100, state.reputation));
}

// ============================================
// CHECK BURNOUT
// ============================================
function checkBurnout(state, monthLabel) {
    if (state.stress >= STRESS_BURNOUT_THRESHOLD && state.monthIndex >= 6) {
        state.burnoutCount++;
        state.maxEnergy = Math.max(20, state.maxEnergy - ENERGY_REDUCTION_PER_BURNOUT);
        state.energy = Math.min(state.energy, state.maxEnergy);
        state.stress = 30; // Recovery
        state.family -= 10;
        state.bank -= 2000; // Lost sales during recovery
        state.log.push(`  *** BURNOUT #${state.burnoutCount} at ${monthLabel} (stress was ${state.stress + 50}+) ***`);
        if (state.burnoutCount >= 3) {
            state.log.push(`  *** GAME OVER — 3 burnouts ***`);
        }
    }
}

// ============================================
// APPLY EFFECTS
// ============================================
function applyEffects(state, effects, label) {
    if (effects.bank) state.bank += effects.bank;
    if (effects.stress) state.stress += effects.stress;
    if (effects.energy) state.energy += effects.energy;
    if (effects.family) state.family += effects.family;
    if (effects.reputation) state.reputation += effects.reputation;
    if (effects.autonomy) state.autonomy += effects.autonomy;
    clampStats(state);
}

// ============================================
// EVENT DECISIONS PER PLAYSTYLE
// Each returns { effects, description, bankDelta }
// ============================================

function getCalendarMonth(monthIndex) {
    return ((monthIndex - 1 + STARTING_MONTH - 1) % 12) + 1;
}

function getMonthLabel(monthIndex) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const calMonth = getCalendarMonth(monthIndex);
    const year = 2022 + Math.floor((monthIndex - 1 + STARTING_MONTH - 1) / 12);
    return `${months[calMonth - 1]} ${year}`;
}

// ============================================
// SIMULATE ONE PLAYSTYLE
// ============================================
function simulate(playstyle) {
    const state = createState();
    const isInsider = playstyle === 'insider';
    const isDiscoverer = playstyle === 'discoverer';
    const isFamily = playstyle === 'family';

    state.log.push(`\n${'='.repeat(70)}`);
    state.log.push(`  PLAYSTYLE: ${playstyle.toUpperCase()}`);
    state.log.push(`${'='.repeat(70)}`);

    for (let m = 1; m <= TOTAL_MONTHS; m++) {
        state.monthIndex = m;
        const calMonth = getCalendarMonth(m);
        const label = getMonthLabel(m);
        const isPreBuilding = m <= BUILDING_DEADLINE_MONTH;

        // === POST-BUILDING LIFESTYLE UPGRADES (automatic in-game) ===
        if (state.ownsBuilding) {
            if (state.monthsSinceBuilding !== undefined) state.monthsSinceBuilding++;
            if (!state.salaryStarted) state.salaryStarted = true;
            if (state.monthsSinceBuilding >= 6 && !state.hasCar) state.hasCar = true;
            if (state.monthsSinceBuilding >= 12 && !state.hasApartment) state.hasApartment = true;
        }

        // === CHECK GAME OVER ===
        if (state.burnoutCount >= 3 && !state.gameOver) {
            state.gameOver = true;
            state.gameOverMonth = m;
            state.log.push(`  *** GAME OVER at ${label} — 3 burnouts reached ***`);
        }

        // === NATURAL MONTHLY STAT DRIFT ===
        // Stress recovery if low, stress buildup if working hard
        if (!isFamily) {
            state.stress += (state.openSunday ? 3 : -2); // Sunday workers get stressed
        } else {
            state.stress -= 3; // Family player prioritizes de-stressing
        }

        // Energy natural recovery
        state.energy += (state.stress > 60 ? -3 : 2);

        // === INSIDER: SMART STRESS MANAGEMENT ===
        // Close Sundays BEFORE hitting burnout (smart player reads the signs)
        if (isInsider && state.openSunday && state.stress > 60 && m >= 5) {
            state.openSunday = false;
            applyEffects(state, { stress: -10, energy: 5, family: 5 });
            state.log.push(`M${m} (${label}): Smart → Close Sundays (stress at ${Math.round(state.stress + 10)})`);
        }

        // ============================================================
        // EVENT DECISIONS — by month
        // ============================================================

        // --- MONTH 1: Sunday Decision ---
        if (m === 1) {
            if (isInsider) {
                // Insider knows: Sundays are needed early for cash, but must be careful about burnout
                // Strategic: open early, close later when stress rises
                state.openSunday = true;
                applyEffects(state, { stress: 10, energy: -5 });
                state.log.push(`M${m} (${label}): Sunday Opening → OPEN (need early cash)`);
            } else if (isDiscoverer) {
                // Discoverer thinks more revenue = good
                state.openSunday = true;
                applyEffects(state, { stress: 10, energy: -5 });
                state.log.push(`M${m} (${label}): Sunday Opening → OPEN (more revenue sounds good)`);
            } else {
                // Family: no way, rest matters
                state.openSunday = false;
                applyEffects(state, { stress: -5, family: 5, energy: 5 });
                state.log.push(`M${m} (${label}): Sunday Opening → CLOSED (family/rest priority)`);
            }
        }

        // --- MONTH 1-2: Stock Reality ---
        if (m === 1) {
            if (isInsider) {
                // Progressive liquidation - best long-term value
                applyEffects(state, { stress: 15, energy: -15, reputation: 5, autonomy: 5 });
                state.log.push(`M${m} (${label}): Stock Reality → Progressive liquidation (reputation+5)`);
            } else if (isDiscoverer) {
                // Find a guy - quick and easy
                applyEffects(state, { bank: 1500, stress: 5, energy: -5 });
                state.log.push(`M${m} (${label}): Stock Reality → Find a guy (+€1,500)`);
            } else {
                // Family: progressive but less stressful - finds a guy (less stress)
                applyEffects(state, { bank: 1500, stress: 5, energy: -5 });
                state.log.push(`M${m} (${label}): Stock Reality → Find a guy (less stress)`);
            }
        }

        // --- MONTH 2-4: Insurance Decision ---
        if (m === 2) {
            if (isInsider) {
                // Insider knows flood can cost €18k, insurance costs €1,800/year = easy yes
                state.hasComprehensiveInsurance = true;
                state.monthlyInsurance = 150;
                applyEffects(state, { bank: -1800, stress: -5 });
                state.log.push(`M${m} (${label}): Insurance → Comprehensive (-€1,800)`);
            } else if (isDiscoverer) {
                // Discoverer is frugal, skips it
                applyEffects(state, { stress: 5 });
                state.log.push(`M${m} (${label}): Insurance → Basic only (save money)`);
            } else {
                // Family: comprehensive for peace of mind
                state.hasComprehensiveInsurance = true;
                state.monthlyInsurance = 150;
                applyEffects(state, { bank: -1800, stress: -5 });
                state.log.push(`M${m} (${label}): Insurance → Comprehensive (peace of mind)`);
            }
        }

        // --- MONTH 2-4: First Cheese ---
        if (m === 3) {
            if (isInsider) {
                // Insider knows cheese is THE growth lever; buys cheap fridge at M4-5 too
                state.cheeseTypes = 1;
                applyEffects(state, { bank: -300, energy: -10, reputation: 3 });
                state.log.push(`M${m} (${label}): First Cheese → Start with Tomme Larzac (+1 cheese)`);
            } else if (isDiscoverer) {
                // Discoverer is ambitious - might go big
                state.cheeseTypes = 15;
                state.monthlyPayment = 800;
                applyEffects(state, { bank: -5000, stress: 20, energy: -15, reputation: 10 });
                state.log.push(`M${m} (${label}): First Cheese → PRO COUNTER (15 cheeses, -€5000, €800/mo payment)`);
            } else {
                // Family: conservative start
                state.cheeseTypes = 1;
                applyEffects(state, { bank: -300, energy: -10, reputation: 3 });
                state.log.push(`M${m} (${label}): First Cheese → Start with Tomme Larzac`);
            }
        }

        // --- MONTH 3-5: Shop Name ---
        if (m === 4) {
            // All playstyles: name it Chez Julien (universally good choice)
            applyEffects(state, { stress: -5, reputation: 5 });
            state.log.push(`M${m} (${label}): Shop Name → "Chez Julien"`);
        }

        // --- MONTH 4-5: Cheap Fridge (if didn't buy pro counter) ---
        if (m === 5 && state.cheeseTypes < 15) {
            if (isInsider) {
                // Cheap fridge - save money for building!
                state.cheeseTypes += 9;
                applyEffects(state, { bank: -800, stress: 5 });
                state.log.push(`M${m} (${label}): Cheap Fridge → €800 ugly fridge (+9 cheeses = ${state.cheeseTypes})`);
            } else if (isFamily) {
                state.cheeseTypes += 9;
                applyEffects(state, { bank: -800, stress: 5 });
                state.log.push(`M${m} (${label}): Cheap Fridge → €800 ugly fridge (+9 cheeses)`);
            }
        }

        // --- MONTH 6: First Christmas ---
        if (m === 6) {
            if (isInsider) {
                // Ask advice - best balanced option (+€2000, +rep5, -stress5)
                applyEffects(state, { stress: -5, reputation: 5, bank: 2000 });
                state.log.push(`M${m} (${label}): First Christmas → Ask advice (+€2,000, +rep5)`);
            } else if (isDiscoverer) {
                // Push hard - more money
                applyEffects(state, { stress: 20, energy: -15, bank: 3000 });
                state.log.push(`M${m} (${label}): First Christmas → Push hard (+€3,000)`);
            } else {
                // Family: keep it simple
                applyEffects(state, { stress: 5, bank: 1500 });
                state.log.push(`M${m} (${label}): First Christmas → Keep it simple (+€1,500)`);
            }
        }

        // --- MONTH 6-8: Gradual Pivot ---
        if (m === 7 && state.cheeseTypes >= 5 && state.bulkPercentage > 50) {
            if (isInsider) {
                // Continue slow pivot
                state.bulkPercentage = Math.max(0, state.bulkPercentage - 15);
                state.conceptPivotProgress = Math.min(100, state.conceptPivotProgress + 15);
                state.cheeseTypes += 20;
                applyEffects(state, { stress: 10, energy: -5, reputation: 5 });
                state.log.push(`M${m} (${label}): Gradual Pivot → Slow pivot (+20 cheeses = ${state.cheeseTypes})`);
            } else if (isDiscoverer) {
                // Accelerate (with pro counter, already has 15+ cheeses probably)
                state.bulkPercentage = Math.max(0, state.bulkPercentage - 40);
                state.conceptPivotProgress = Math.min(100, state.conceptPivotProgress + 30);
                state.cheeseTypes += 50;
                applyEffects(state, { bank: -2000, stress: 25, energy: -15, reputation: state.reputation > 60 ? 10 : -5 });
                state.log.push(`M${m} (${label}): Gradual Pivot → Accelerate (+50 cheeses = ${state.cheeseTypes})`);
            } else {
                // Family: slow pivot
                state.bulkPercentage = Math.max(0, state.bulkPercentage - 15);
                state.conceptPivotProgress = Math.min(100, state.conceptPivotProgress + 15);
                state.cheeseTypes += 20;
                applyEffects(state, { stress: 10, energy: -5, reputation: 5 });
                state.log.push(`M${m} (${label}): Gradual Pivot → Slow pivot (+20 cheeses = ${state.cheeseTypes})`);
            }
        }

        // --- MONTH 6-8: Extended Hours ---
        if (m === 8) {
            if (isInsider || isDiscoverer) {
                state.extendedHours = true;
                applyEffects(state, { stress: 10, energy: -10 });
                state.log.push(`M${m} (${label}): Extended Hours → YES (+€800/mo)`);
            }
            // Family: no extended hours
        }

        // --- MONTH 8-10: Charcuterie ---
        if (m === 8 && state.cheeseTypes >= 5) {
            if (isInsider) {
                // Belgian charcuterie - modest investment, good complement
                state.hasCharcuterie = true;
                applyEffects(state, { bank: -1500, stress: 10, reputation: 3, autonomy: -5 });
                state.log.push(`M${m} (${label}): Charcuterie → Belgian (Coprosain)`);
            } else if (isDiscoverer) {
                // Italian imports - premium
                state.hasCharcuterie = true;
                applyEffects(state, { bank: -3000, stress: 15, reputation: 5 });
                state.log.push(`M${m} (${label}): Charcuterie → Italian imports (-€3,000)`);
            } else {
                // Family: stay focused on cheese - simpler
                applyEffects(state, { stress: -5, autonomy: 10 });
                state.log.push(`M${m} (${label}): Charcuterie → Stay focused on cheese`);
            }
        }

        // --- MONTH 8-10: Systems Project ---
        if (m === 9) {
            if (isInsider) {
                applyEffects(state, { stress: 5, energy: -10, bank: -200, autonomy: 8 });
                state.log.push(`M${m} (${label}): Systems → Email automations (+autonomy8)`);
            } else if (isDiscoverer) {
                applyEffects(state, { stress: 5, energy: -10, bank: -200, autonomy: 8 });
                state.log.push(`M${m} (${label}): Systems → Email automations`);
            } else {
                applyEffects(state, { bank: -300, stress: -8, energy: 5 });
                state.log.push(`M${m} (${label}): Systems → Cleaning service (less stress)`);
            }
        }

        // --- MONTH 8-10: Visibility Push ---
        if (m === 9) {
            if (isInsider || isDiscoverer) {
                applyEffects(state, { stress: 10, energy: -15, bank: -150, reputation: 6 });
                state.log.push(`M${m} (${label}): Visibility → Instagram campaign (+rep6)`);
            } else {
                applyEffects(state, { stress: -5 });
                state.log.push(`M${m} (${label}): Visibility → Focus existing customers`);
            }
        }

        // --- MONTH 8-12: The Invitation (Marc's wedding) ---
        if (m === 10) {
            if (isInsider) {
                // Skip wedding to save money
                applyEffects(state, { family: -20, stress: 5 });
                state.log.push(`M${m} (${label}): Marc's Wedding → Skip (save €2,000)`);
            } else if (isDiscoverer) {
                // Staff covers if available
                if (state.hasLucas) {
                    applyEffects(state, { stress: 10, bank: -800, family: 3 });
                    state.log.push(`M${m} (${label}): Marc's Wedding → Staff covers (-€800)`);
                } else {
                    applyEffects(state, { bank: -2000, stress: 15, family: 10 });
                    state.log.push(`M${m} (${label}): Marc's Wedding → Close shop and go (-€2,000)`);
                }
            } else {
                // Family: absolutely goes!
                applyEffects(state, { bank: -2000, stress: 15, family: 10 });
                state.log.push(`M${m} (${label}): Marc's Wedding → Close shop and go (-€2,000)`);
            }
        }

        // --- MONTH 10-12: Personal Recharge ---
        if (m === 11) {
            if (isInsider) {
                // Business dinner - networking
                applyEffects(state, { bank: -150, energy: -5, stress: -8 });
                state.log.push(`M${m} (${label}): Recharge → Business dinner`);
            } else if (isDiscoverer) {
                applyEffects(state, { stress: 8, autonomy: 3 });
                state.log.push(`M${m} (${label}): Recharge → Keep pushing`);
            } else {
                // Family weekend
                applyEffects(state, { bank: -200, stress: -10, family: 12, energy: 10 });
                state.log.push(`M${m} (${label}): Recharge → Family weekend (+family12)`);
            }
        }

        // --- MONTH 10-12: Wine Dilemma ---
        if (m === 12 && state.cheeseTypes >= 20) {
            if (isInsider) {
                // Curated selection - modest investment
                state.hasWineSelection = true;
                applyEffects(state, { bank: -2000, stress: 5, reputation: 5 });
                state.log.push(`M${m} (${label}): Wine → Curated 15 bottles (-€2,000)`);
            } else if (isDiscoverer) {
                // Serious wine section
                state.hasWineSelection = true;
                state.hasWineEvents = true;
                applyEffects(state, { bank: -8000, stress: 20, energy: -15, reputation: 6, autonomy: -10 });
                state.log.push(`M${m} (${label}): Wine → Serious section (-€8,000)`);
            } else {
                // Family: partner with wine shop (no cost)
                applyEffects(state, { stress: -5, autonomy: 8, reputation: 3 });
                state.log.push(`M${m} (${label}): Wine → Partner with wine shop (no cost)`);
            }
        }

        // --- MONTH 12: Family Dinner ---
        if (m === 12) {
            if (isInsider) {
                // Work comes first
                applyEffects(state, { family: -15, stress: 10, autonomy: 5 });
                state.log.push(`M${m} (${label}): Family Dinner → Work comes first`);
            } else if (isDiscoverer) {
                // Goes to dinner
                applyEffects(state, { family: 15, energy: 10 });
                if (state.openSunday) state.bank -= 1000;
                state.log.push(`M${m} (${label}): Family Dinner → Go to dinner`);
            } else {
                applyEffects(state, { family: 15, energy: 10 });
                state.log.push(`M${m} (${label}): Family Dinner → Go to dinner (+family15)`);
            }
        }

        // --- MONTH ~13: Summer Flood (50% chance, we simulate it happening) ---
        if (m === 13 && calMonth >= 6 && calMonth <= 8) {
            if (state.hasComprehensiveInsurance) {
                applyEffects(state, { stress: 15, energy: -20, bank: 6500, reputation: 3 });
                state.log.push(`M${m} (${label}): Summer Flood → Insured! (+€6,500)`);
            } else {
                // Ask family for help
                applyEffects(state, { stress: 35, energy: -30, family: -25, bank: -13000, reputation: -3 });
                state.log.push(`M${m} (${label}): Summer Flood → Family help (-€13,000, family-25)`);
            }
        }

        // --- MONTH 14-16: Adopt Dog (Poncho) ---
        if (m === 15) {
            if (isInsider) {
                // Knows Poncho is essential, adopts
                state.hasDog = true;
                applyEffects(state, { bank: -800, stress: 5, energy: -5, family: 20 });
                state.log.push(`M${m} (${label}): Dog → Adopt Poncho (+family20)`);
            } else if (isDiscoverer) {
                // Hesitates but adopts
                state.hasDog = true;
                applyEffects(state, { bank: -800, stress: 5, energy: -5, family: 20 });
                state.log.push(`M${m} (${label}): Dog → Adopt Poncho`);
            } else {
                // Family: absolutely yes
                state.hasDog = true;
                applyEffects(state, { bank: -800, stress: 5, energy: -5, family: 20 });
                state.log.push(`M${m} (${label}): Dog → Adopt Poncho! (+family20)`);
            }
        }

        // --- MONTH 16: Raclette Season Decision ---
        if (m === 16 && state.cheeseTypes >= 10) {
            if (isInsider) {
                // Go all-in (knows raclette is massive money)
                state.raclettePathStarted = true;
                state.racletteTypes = 8;
                state.cheeseTypes += 8;
                applyEffects(state, { bank: -2000, stress: 10, reputation: 3 });
                state.log.push(`M${m} (${label}): Raclette → All-in (+8 raclette, +8 cheese)`);
            } else if (isDiscoverer) {
                // Stock a few classics
                state.racletteTypes = 3;
                state.cheeseTypes += 3;
                applyEffects(state, { bank: -500 });
                state.log.push(`M${m} (${label}): Raclette → Few classics (+3 cheese)`);
            } else {
                // Family: few classics (moderate)
                state.racletteTypes = 3;
                state.cheeseTypes += 3;
                applyEffects(state, { bank: -500 });
                state.log.push(`M${m} (${label}): Raclette → Few classics`);
            }
        }

        // --- MONTH 17-18: Building Announcement ---
        if (m === 17) {
            state.buildingOfferReceived = true;
            if (isInsider) {
                // "I'll find a way" - starts aggressive saving
                applyEffects(state, { stress: 20, energy: -10 });
                state.log.push(`M${m} (${label}): Building Offer → "I'll find a way!" (target €80k)`);
            } else if (isDiscoverer) {
                // Accepts the challenge
                applyEffects(state, { stress: 20, energy: -10 });
                state.log.push(`M${m} (${label}): Building Offer → "I'll find a way!"`);
            } else {
                // Family considers it but stress is a concern
                applyEffects(state, { stress: 20, energy: -10 });
                state.log.push(`M${m} (${label}): Building Offer → Accepted but prioritizing health`);
            }
        }

        // --- MONTH 17-18: Raclette Season Money ---
        // Event effects: invest €3k, get back revenue from machines/bulk.
        // These are the event's direct bank effects, ON TOP of monthly financials.
        if (m === 17 && state.cheeseTypes >= 25) {
            if (isInsider && state.raclettePathStarted) {
                applyEffects(state, { bank: 18000 - 3000, stress: 10, reputation: 5 });
                state.racletteTypes += 2;
                state.log.push(`M${m} (${label}): Raclette Season → All-in (event: -€3k invest, +€18k return = +€15k net)`);
            } else if (state.cheeseTypes >= 25) {
                applyEffects(state, { bank: 12000 - 3000, stress: 10, reputation: 3 });
                state.log.push(`M${m} (${label}): Raclette Season → All-in (event: +€9k net)`);
            }
        }

        // --- MONTH 17-18: Hospital Call ---
        if (m === 18) {
            if (isInsider) {
                // Go after closing each day (maximize money)
                applyEffects(state, { stress: 35, energy: -30, family: 5 });
                state.log.push(`M${m} (${label}): Hospital Call → Go after closing (save the shop)`);
            } else if (isDiscoverer) {
                // Go after closing (tries to do both)
                applyEffects(state, { stress: 35, energy: -30, family: 5 });
                state.log.push(`M${m} (${label}): Hospital Call → Go after closing`);
            } else {
                // Family: Close and go immediately
                applyEffects(state, { bank: -4000, stress: 20, reputation: -10, family: 20 });
                state.log.push(`M${m} (${label}): Hospital Call → Close and go immediately (-€4,000, +family20)`);
            }
        }

        // --- MONTH 18: Christmas Market ---
        if (m === 18) {
            if (isInsider || isDiscoverer) {
                applyEffects(state, { energy: -20, stress: 15, bank: 3000, reputation: 5 });
                state.log.push(`M${m} (${label}): Christmas Market → Take the stand (+€3,000)`);
            } else {
                applyEffects(state, { stress: -5 });
                state.log.push(`M${m} (${label}): Christmas Market → Focus on shop (less stress)`);
            }
        }

        // --- MONTH 19-24: Building Countdown (savings push, recurring) ---
        if (m >= 19 && m <= 24 && m % 2 === 1 && state.buildingOfferReceived) {
            if (isInsider) {
                // Maximum savings mode
                applyEffects(state, { stress: 15, reputation: -3 });
                state.bank += 2000;
                state.log.push(`M${m} (${label}): Building Savings → Maximum mode (+€2,000 boost)`);
            } else if (isDiscoverer) {
                // Balance savings with operations
                applyEffects(state, { stress: 10 });
                state.bank += 1000;
                state.log.push(`M${m} (${label}): Building Savings → Balanced (+€1,000 boost)`);
            } else {
                // Family: balanced (can't sacrifice everything)
                applyEffects(state, { stress: 10 });
                state.bank += 1000;
                state.log.push(`M${m} (${label}): Building Savings → Balanced (+€1,000)`);
            }
        }

        // --- MONTH 20: Relationship Tension (if family < 60 and stress > 40) ---
        if (m === 20 && state.family < 60 && state.stress > 40) {
            if (isInsider) {
                // "It's temporary" - sacrifice family
                applyEffects(state, { stress: -5, family: -10 });
                state.log.push(`M${m} (${label}): Relationship Tension → "It's temporary" (family-10)`);
            } else if (isDiscoverer) {
                // Promise balance
                applyEffects(state, { stress: 10, family: 15, bank: -1500 });
                state.log.push(`M${m} (${label}): Relationship Tension → Promise balance (-€1,500)`);
            } else {
                // Family player never reaches this (family should be high)
                applyEffects(state, { stress: 10, family: 15, bank: -1500 });
                state.log.push(`M${m} (${label}): Relationship Tension → Promise balance`);
            }
        }

        // --- MONTH 20: Holiday ---
        if (m === 20 && state.autonomy >= 30) {
            if (isInsider) {
                // No holiday before building
                applyEffects(state, { stress: 10, family: -15 });
                state.log.push(`M${m} (${label}): Holiday → Not this time (save money)`);
            } else if (isDiscoverer) {
                // Long weekend
                applyEffects(state, { energy: 15, stress: -10, family: 10, bank: -2500 });
                state.log.push(`M${m} (${label}): Holiday → Long weekend (-€2,500)`);
            } else {
                // Family: FULL HOLIDAY
                applyEffects(state, { energy: 40, stress: -30, family: 25, bank: -6000, autonomy: 10 });
                state.log.push(`M${m} (${label}): Holiday → Full week off! (-€6,000, +family25)`);
            }
        }

        // --- Discoverer: might close sundays after a burnout ---
        if (isDiscoverer && state.burnoutCount >= 1 && state.openSunday && m > 6) {
            state.openSunday = false;
            applyEffects(state, { stress: -10, energy: 5, family: 5 });
            state.log.push(`M${m} (${label}): Learned → Close Sundays after burnout`);
        }

        // --- Staff hiring: Lucas (around month 8-12 for Insider/Discoverer, later for Family) ---
        if (m === 10 && !state.hasLucas && (isInsider || isDiscoverer)) {
            state.hasLucas = true;
            applyEffects(state, { stress: -5, autonomy: 10 });
            state.log.push(`M${m} (${label}): Hired Lucas (-€1,400/mo staff cost)`);
        }
        if (m === 14 && !state.hasLucas && isFamily) {
            state.hasLucas = true;
            applyEffects(state, { stress: -5, autonomy: 10 });
            state.log.push(`M${m} (${label}): Hired Lucas (-€1,400/mo staff cost)`);
        }

        // --- Staff hiring: Henry (post-building or later) ---
        if (m === 28 && state.ownsBuilding && !state.hasHenry && (isInsider || isDiscoverer)) {
            state.hasHenry = true;
            applyEffects(state, { stress: -10, autonomy: 15 });
            state.log.push(`M${m} (${label}): Hired Henry (-€1,800/mo staff cost)`);
        }
        if (m === 32 && state.ownsBuilding && !state.hasHenry && isFamily) {
            state.hasHenry = true;
            applyEffects(state, { stress: -10, autonomy: 15 });
            state.log.push(`M${m} (${label}): Hired Henry (-€1,800/mo staff cost)`);
        }

        // --- MONTH ~22: Swiss Invitation (if raclette path) ---
        if (m === 22 && state.raclettePathStarted && state.racletteTypes >= 5) {
            if (isInsider) {
                // Can't afford pre-building
                applyEffects(state, { stress: 5 });
                state.log.push(`M${m} (${label}): Swiss Invitation → Can't afford (saving for building)`);
            } else if (isDiscoverer) {
                applyEffects(state, { stress: 5 });
                state.log.push(`M${m} (${label}): Swiss Invitation → Can't afford now`);
            } else {
                applyEffects(state, { stress: 5 });
                state.log.push(`M${m} (${label}): Swiss Invitation → Can't afford`);
            }
        }

        // --- MONTH 25: BUILDING DEADLINE ---
        if (m === 25) {
            const canAfford = state.bank >= BUILDING_COST;
            if (canAfford) {
                state.ownsBuilding = true;
                state.bank -= BUILDING_COST;
                state.monthsSinceBuilding = 0;
                applyEffects(state, { stress: -20, energy: 20, reputation: 5, family: 10 });
                state.log.push(`M${m} (${label}): *** BUILDING PURCHASED *** Bank was €${(state.bank + BUILDING_COST).toLocaleString()} → €${state.bank.toLocaleString()}`);
            } else {
                // Ask for one more month
                applyEffects(state, { stress: 20 });
                state.log.push(`M${m} (${label}): Building Deadline → Need more time. Bank: €${state.bank.toLocaleString()} / €${BUILDING_COST.toLocaleString()}`);
            }
        }

        // --- MONTH 26: Extended Deadline ---
        if (m === 26 && !state.ownsBuilding && state.buildingOfferReceived) {
            const canAfford = state.bank >= BUILDING_COST;
            if (canAfford) {
                const totalPay = Math.min(state.bank, BUILDING_COST + 5000);
                state.ownsBuilding = true;
                state.bank -= totalPay;
                state.monthsSinceBuilding = 0;
                applyEffects(state, { stress: -10, energy: 20, reputation: 5, family: 10 });
                state.log.push(`M${m} (${label}): *** BUILDING PURCHASED (extended) *** Paid €${totalPay.toLocaleString()}, Bank: €${state.bank.toLocaleString()}`);
            } else {
                applyEffects(state, { stress: 30, family: -15 });
                state.log.push(`M${m} (${label}): Building MISSED. Bank: €${state.bank.toLocaleString()} / €${BUILDING_COST.toLocaleString()}`);
            }
        }

        // --- MONTH 28+: Delegation ---
        if (m === 28 && state.hasLucas && state.autonomy < 50) {
            if (isInsider || isFamily) {
                applyEffects(state, { stress: -15, energy: 20, family: 15, bank: -2000, autonomy: 25 });
                state.log.push(`M${m} (${label}): Delegation → Start delegating (+autonomy25)`);
            } else {
                applyEffects(state, { stress: -15, energy: 20, family: 15, bank: -2000, autonomy: 25 });
                state.log.push(`M${m} (${label}): Delegation → Start delegating`);
            }
        }

        // --- MONTH 28+: Birthday Party ---
        if (m === 30) {
            if (isInsider) {
                // Small dinner
                applyEffects(state, { bank: -1200, stress: -5, family: 15, energy: 10 });
                state.log.push(`M${m} (${label}): Birthday → Small dinner (-€1,200)`);
            } else if (isDiscoverer) {
                applyEffects(state, { bank: -1200, stress: -5, family: 15, energy: 10 });
                state.log.push(`M${m} (${label}): Birthday → Small dinner`);
            } else {
                // Family: big party if stress is manageable, otherwise small dinner
                if (state.stress < 40) {
                    applyEffects(state, { bank: -4500, stress: 30, energy: -25, family: 35, reputation: 8 });
                    state.log.push(`M${m} (${label}): Birthday → BIG PARTY! (-€4,500, +family35, +rep8)`);
                } else {
                    applyEffects(state, { bank: -1200, stress: -5, family: 15, energy: 10 });
                    state.log.push(`M${m} (${label}): Birthday → Small dinner (stress too high for party)`);
                }
            }
        }

        // --- MONTH 30: Third Christmas Rush ---
        // Note: salesBoost is already factored into the seasonal×1.35 December multiplier.
        // The event gives additional ONE-TIME bonus on top (platters, gift baskets, extra orders).
        // Using more conservative numbers since the seasonal multiplier already captures holiday peak.
        if (m === 30) {
            if (isInsider || isDiscoverer) {
                applyEffects(state, { energy: -35, stress: 20 });
                const xmasBonus = 4000 + Math.min(state.cheeseTypes * 20, 2000);
                state.bank += xmasBonus;
                state.log.push(`M${m} (${label}): December Rush → All out (+€${xmasBonus} bonus)`);
            } else {
                applyEffects(state, { energy: -10, stress: 5 });
                const xmasBonus = 2000 + Math.min(state.cheeseTypes * 10, 1000);
                state.bank += xmasBonus;
                state.log.push(`M${m} (${label}): December Rush → Sustainable (+€${xmasBonus} bonus)`);
            }
        }

        // --- Good Month events (recurring every ~6 months) ---
        if ((m === 14 || m === 22 || m === 34) && state.reputation >= 45 && state.stress < 70) {
            if (isInsider) {
                state.bank += 2000;
                state.log.push(`M${m} (${label}): Good Month → Save it all (+€2,000)`);
            } else if (isDiscoverer) {
                state.bank += 1500;
                applyEffects(state, { reputation: 4, autonomy: 3 });
                state.log.push(`M${m} (${label}): Good Month → Invest in shop (+€1,500)`);
            } else {
                state.bank += 800;
                applyEffects(state, { stress: -10, family: 8 });
                state.log.push(`M${m} (${label}): Good Month → Celebrate with family (+€800, +family8)`);
            }
        }

        // --- Catering/Bulk Orders (recurring revenue events) ---
        if (m === 15 && state.cheeseTypes >= 15) {
            if (isInsider || isDiscoverer) {
                applyEffects(state, { stress: 8, energy: -10, bank: 2400, reputation: 4 });
                state.log.push(`M${m} (${label}): Catering → Take contract (+€2,400)`);
            } else {
                applyEffects(state, { stress: 3, bank: 1200, reputation: 2 });
                state.log.push(`M${m} (${label}): Catering → Pickup only (+€1,200)`);
            }
        }

        // --- Month 32+: Post-building Swiss Visit (if not done) ---
        if (m === 32 && state.raclettePathStarted && state.racletteTypes >= 5 && !state.swissVisitDone && state.ownsBuilding) {
            if (isInsider) {
                state.swissVisitDone = true;
                state.racletteTypes += 10;
                state.cheeseTypes += 10;
                applyEffects(state, { bank: -4000, energy: -20, family: 10, reputation: 8 });
                state.log.push(`M${m} (${label}): Swiss Visit → Go! (+10 raclettes, +rep8, -€4,000)`);
            }
        }

        // --- Month 35+: Holiday post-building ---
        if (m === 35 && state.ownsBuilding && state.autonomy >= 30) {
            if (isInsider || isDiscoverer) {
                applyEffects(state, { energy: 15, stress: -10, family: 10, bank: -2500 });
                state.log.push(`M${m} (${label}): Holiday → Long weekend (-€2,500)`);
            } else {
                applyEffects(state, { energy: 40, stress: -30, family: 25, bank: -6000, autonomy: 10 });
                state.log.push(`M${m} (${label}): Holiday → Full week off! (-€6,000)`);
            }
        }

        // --- Month 42: Christmas Day (finale) ---
        if (m === 42) {
            if (isInsider || isDiscoverer) {
                applyEffects(state, { family: 15, stress: 10 });
                state.log.push(`M${m} (${label}): Christmas Day → Go straight to family`);
            } else {
                applyEffects(state, { family: 15, stress: 10 });
                state.log.push(`M${m} (${label}): Christmas Day → Go straight to family (+family15)`);
            }
        }

        // === CALCULATE MONTHLY FINANCIALS ===
        const financials = calculateMonthlyFinancials(state);
        state.bank += financials.netProfit;
        state.totalRevenue += financials.baseSales;

        // === CHECK BURNOUT ===
        checkBurnout(state, label);

        // === LOG KEY MONTHS ===
        if (m === 1 || m === 6 || m === 12 || m === 17 || m === 18 || m === 24 || m === 25 || m === 26 || m === 30 || m === 36 || m === 42 || state.ownsBuilding && m === (state.monthsSinceBuilding === 0 ? m : -1)) {
            state.log.push(`  → Bank: €${Math.round(state.bank).toLocaleString()} | Stress: ${Math.round(state.stress)} | Energy: ${Math.round(state.energy)} | Family: ${Math.round(state.family)} | Rep: ${Math.round(state.reputation)} | Cheese: ${state.cheeseTypes} | Auto: ${Math.round(state.autonomy)}`);
        }
    }

    return state;
}

// ============================================
// RUN ALL 3 SIMULATIONS
// ============================================
console.log('\n' + '█'.repeat(70));
console.log('  CHEZ JULIEN — 3-PLAYSTYLE BALANCE TEST');
console.log('█'.repeat(70));

const results = {};
for (const style of ['insider', 'discoverer', 'family']) {
    const state = simulate(style);
    results[style] = state;
    state.log.forEach(l => console.log(l));
}

// ============================================
// SUMMARY TABLE
// ============================================
console.log('\n' + '='.repeat(70));
console.log('  FINAL RESULTS COMPARISON (Month 42)');
console.log('='.repeat(70));
console.log('');
console.log(
    'Metric'.padEnd(22) +
    'INSIDER'.padStart(12) +
    'DISCOVERER'.padStart(14) +
    'FAMILY'.padStart(14)
);
console.log('-'.repeat(62));

const metrics = [
    ['Bank (€)', s => `€${Math.round(s.bank).toLocaleString()}`],
    ['Owns Building', s => s.ownsBuilding ? 'YES ✓' : 'NO ✗'],
    ['Building Month', s => s.ownsBuilding ? `M${s.monthsSinceBuilding !== undefined ? (42 - s.monthsSinceBuilding) : '?'}` : 'N/A'],
    ['Stress', s => `${Math.round(s.stress)}%`],
    ['Energy', s => `${Math.round(s.energy)}/${s.maxEnergy}`],
    ['Family', s => `${Math.round(s.family)}/100`],
    ['Reputation', s => `${Math.round(s.reputation)}/100`],
    ['Autonomy', s => `${Math.round(s.autonomy)}/100`],
    ['Cheese Types', s => `${s.cheeseTypes}`],
    ['Burnout Count', s => `${s.burnoutCount}`],
    ['Has Lucas', s => s.hasLucas ? 'Yes' : 'No'],
    ['Has Henry', s => s.hasHenry ? 'Yes' : 'No'],
    ['Has Dog', s => s.hasDog ? 'Yes' : 'No'],
    ['Owns Car', s => s.hasCar ? 'Yes' : 'No'],
    ['Owns Apartment', s => s.hasApartment ? 'Yes' : 'No'],
];

for (const [name, fn] of metrics) {
    console.log(
        name.padEnd(22) +
        fn(results.insider).padStart(12) +
        fn(results.discoverer).padStart(14) +
        fn(results.family).padStart(14)
    );
}

// ============================================
// BALANCE ANALYSIS
// ============================================
console.log('\n' + '='.repeat(70));
console.log('  BALANCE ANALYSIS vs BALANCE_REFERENCE.md');
console.log('='.repeat(70));

const checks = [];

// Check 1: Insider should end ~€50k
const insiderBank = Math.round(results.insider.bank);
if (insiderBank > 30000 && insiderBank < 70000) {
    checks.push(`✓ Insider end bank €${insiderBank.toLocaleString()} — within target range (~€50k)`);
} else if (insiderBank >= 70000) {
    checks.push(`✗ Insider end bank €${insiderBank.toLocaleString()} — TOO HIGH (target: ~€50k). Post-building expenses may be too low.`);
} else {
    checks.push(`⚠ Insider end bank €${insiderBank.toLocaleString()} — LOWER than expected (target: ~€50k)`);
}

// Check 2: Building should be achievable with sacrifice
if (results.insider.ownsBuilding) {
    checks.push(`✓ Insider CAN buy building — good, this is the intended path`);
} else {
    checks.push(`✗ Insider CANNOT buy building — PROBLEM: insider should always be able to`);
}

// Check 3: Discoverer should struggle with building
if (results.discoverer.ownsBuilding) {
    checks.push(`⚠ Discoverer CAN buy building — acceptable if they sacrifice enough`);
} else {
    checks.push(`✓ Discoverer CANNOT buy building — expected for non-optimal play`);
}

// Check 4: Family player should NOT get building
if (!results.family.ownsBuilding) {
    checks.push(`✓ Family player CANNOT buy building — correct per design`);
} else {
    checks.push(`✗ Family player CAN buy building — PROBLEM: family-first should make it very hard`);
}

// Check 5: Family player should have highest family stat
if (results.family.family > results.insider.family && results.family.family > results.discoverer.family) {
    checks.push(`✓ Family player has highest family stat (${Math.round(results.family.family)}) — correct`);
} else {
    checks.push(`⚠ Family player doesn't have highest family stat — unexpected`);
}

// Check 6: Insider should have most burnouts or none (risk management)
if (results.insider.burnoutCount <= 1) {
    checks.push(`✓ Insider burnouts: ${results.insider.burnoutCount} — managed risk well`);
} else {
    checks.push(`⚠ Insider burnouts: ${results.insider.burnoutCount} — too many for a "smart" player`);
}

// Check 7: Discoverer may have burnouts (learning)
checks.push(`ℹ Discoverer burnouts: ${results.discoverer.burnoutCount} (expected: 1-2 from learning)`);

// Check 8: Family player should have 0 burnouts
if (results.family.burnoutCount === 0) {
    checks.push(`✓ Family player burnouts: 0 — correct, they prioritize health`);
} else {
    checks.push(`✗ Family player burnouts: ${results.family.burnoutCount} — PROBLEM: family-first should avoid all burnouts`);
}

// Check 9: Post-building money drain
if (results.insider.ownsBuilding) {
    const bankAtPurchase = results.insider.bank + BUILDING_COST; // Rough estimate
    checks.push(`ℹ Insider post-building money: dropped to €${insiderBank.toLocaleString()} (expenses eating savings)`);
}

// Check 10: Stress levels
checks.push(`ℹ Final stress — Insider: ${Math.round(results.insider.stress)}%, Discoverer: ${Math.round(results.discoverer.stress)}%, Family: ${Math.round(results.family.stress)}%`);

console.log('');
checks.forEach(c => console.log(`  ${c}`));

// ============================================
// KEY MOMENTS: Bank at critical months
// ============================================
console.log('\n' + '='.repeat(70));
console.log('  DESIGN INTENT CHECK');
console.log('='.repeat(70));
console.log('');
console.log('  Per BALANCE_REFERENCE.md:');
console.log('  • Building at M25 should feel "barely achievable" with sacrifice');
console.log('  • End game at ~€50k, NOT €100k');
console.log('  • Family-first should NOT reach building (confirmed in previous test)');
console.log('  • Post-building: high income + high expenses = comfortable but not rich');
console.log('  • 3 burnouts = game over');
console.log('');
console.log('  Verdict:');
if (results.insider.ownsBuilding && !results.family.ownsBuilding && insiderBank < 70000) {
    console.log('  ✓ BALANCE IS WORKING — Insider succeeds, Family fails, end bank reasonable');
} else if (!results.insider.ownsBuilding) {
    console.log('  ✗ BALANCE ISSUE — Even the Insider can\'t get the building. Economy too tight?');
} else if (results.family.ownsBuilding) {
    console.log('  ✗ BALANCE ISSUE — Family player gets building. Not enough sacrifice required.');
} else if (insiderBank >= 70000) {
    console.log('  ⚠ BALANCE CONCERN — End bank too high. Post-building expenses need increase.');
} else {
    console.log('  ⚠ CHECK DETAILS ABOVE');
}
console.log('');
