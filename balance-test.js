#!/usr/bin/env node
/**
 * Balance test: can a "family first" player reach €80k by month 25?
 * Simulates the economy from index.html with conservative family-choice penalties.
 * Run: node balance-test.js
 */

const BUILDING_COST = 80000;
const BUILDING_DEADLINE_MONTH = 25;
const START_BANK = 12000;

// Approximate monthly net profit (from calculateMonthlyFinancials) for early game:
// baseSales ~19k + cheese, rep/autonomy mults, - fixedCosts ~3700, - cogs, - tax.
// Conservative "grind" path: no Sunday, moderate cheese growth, rep ~50, autonomy ~25.
function estimateNetProfit(month, cheeseTypes, reputation, autonomy, openSunday) {
  let baseSales = 19000;
  let cheeseBonus = 0;
  if (cheeseTypes <= 20) cheeseBonus = cheeseTypes * 100;
  else if (cheeseTypes <= 50) cheeseBonus = 2000 + (cheeseTypes - 20) * 120;
  else cheeseBonus = 2000 + 3600 + (cheeseTypes - 50) * 60;
  baseSales += cheeseBonus;
  baseSales *= 0.75 + reputation * 0.005;
  baseSales *= 0.90 + autonomy * 0.002;
  const seasonal = { 1: 0.85, 2: 0.88, 3: 0.92, 4: 0.95, 5: 0.98, 6: 1.0, 7: 0.82, 8: 0.75, 9: 0.92, 10: 1.0, 11: 1.10, 12: 1.35 };
  const m = ((month - 1) % 12) + 1;
  baseSales *= seasonal[m];
  if (openSunday) baseSales += 1000;
  baseSales *= 0.98; // avg random variance
  const margin = 30 + Math.min(10, cheeseTypes * 0.10);
  const cogs = baseSales * (1 - margin / 100);
  const fixedCosts = 1900 + 400 + 200 + 1200; // rent, utils, insurance, survival salary
  let net = baseSales - cogs - fixedCosts;
  if (net > 0) net *= 0.80; // 20% tax
  return Math.round(net);
}

// Family-first events that cost bank (typical schedule by month range)
// Based on EVENT_MAP and events.js: wedding, hospital, holiday, dinner penalties, etc.
const FAMILY_PENALTIES = [
  { month: 10, bank: -2000, desc: 'Marc wedding' },
  { month: 18, bank: -4000, desc: 'Hospital (father)' },
  { month: 14, bank: -1800, desc: 'Poncho adoption / dog' },
  { month: 12, bank: -1500, desc: 'Relationship balance' },
  { month: 20, bank: -4500, desc: 'Week off' },
  { month: 16, bank: -1000, desc: 'Family dinner (sales penalty x2)' },
  { month: 8, bank: -1000, desc: 'Family dinner' },
  { month: 22, bank: -2500, desc: 'Long weekend' },
  { month: 11, bank: -1200, desc: 'Close Sundays after burnout' },
  { month: 19, bank: -2000, desc: 'Delegation / training' },
  { month: 9, bank: -800, desc: 'Old friend / Poncho brand' },
];
// Total family penalties in test: 22.3k

function runFamilyFirstSimulation() {
  let bank = START_BANK;
  let cheeseTypes = 0;
  let reputation = 50;
  let autonomy = 20;
  const openSunday = false; // family-first often closes Sundays for health

  const penaltiesByMonth = {};
  FAMILY_PENALTIES.forEach(p => {
    if (p.month <= BUILDING_DEADLINE_MONTH) {
      penaltiesByMonth[p.month] = (penaltiesByMonth[p.month] || 0) + p.bank;
    }
  });

  console.log('--- Family-first balance test (months 1–25) ---\n');
  console.log('Assumptions: no Sundays, moderate cheese growth, family choices when offered.\n');

  for (let month = 1; month <= BUILDING_DEADLINE_MONTH; month++) {
    cheeseTypes = Math.min(35, 5 + Math.floor(month * 1.2)); // slow growth if prioritizing family
    const net = estimateNetProfit(month, cheeseTypes, reputation, autonomy, openSunday);
    const penalty = penaltiesByMonth[month] || 0;
    bank += net;
    bank += penalty; // penalty is negative
    const status = bank >= BUILDING_COST ? ' ✓ CAN BUY' : '';
    if (month === 1 || month === 12 || month === 18 || month === 24 || month === 25 || penalty < 0) {
      console.log(`Month ${String(month).padStart(2)}: net ${String(net).padStart(6)}  penalty ${String(penalty).padStart(6)}  bank ${String(Math.round(bank)).padStart(7)}${status}`);
    }
  }

  console.log('\n--- Result ---');
  console.log(`Bank at month ${BUILDING_DEADLINE_MONTH}: €${Math.round(bank).toLocaleString()}`);
  console.log(`Building cost: €${BUILDING_COST.toLocaleString()}`);
  const shortfall = BUILDING_COST - bank;
  if (bank >= BUILDING_COST) {
    console.log('OUTCOME: Building ACHIEVABLE with family-first (may be too easy for design goal).');
  } else {
    console.log(`SHORTFALL: €${shortfall.toLocaleString()} — Building NOT reached with this family-first run.`);
    console.log('OUTCOME: Family-first makes building very hard (aligns with design).');
  }
  return bank;
}

function runGrindSimulation() {
  let bank = START_BANK;
  let cheeseTypes = 0;
  let reputation = 52;
  let autonomy = 30;
  const openSunday = true; // grind = open Sundays for more revenue

  console.log('\n--- Grind path (for comparison): open Sundays, skip family ---\n');

  for (let month = 1; month <= BUILDING_DEADLINE_MONTH; month++) {
    cheeseTypes = Math.min(45, 8 + Math.floor(month * 1.5));
    const net = estimateNetProfit(month, cheeseTypes, reputation, autonomy, openSunday);
    bank += net;
    if (month === 1 || month === 12 || month === 18 || month === 24 || month === 25) {
      console.log(`Month ${String(month).padStart(2)}: net ${String(net).padStart(6)}  bank ${String(Math.round(bank)).padStart(7)}`);
    }
  }

  console.log(`\nGrind path bank at month ${BUILDING_DEADLINE_MONTH}: €${Math.round(bank).toLocaleString()}`);
  return bank;
}

const familyBank = runFamilyFirstSimulation();
const grindBank = runGrindSimulation();

console.log('\n--- Recommendation ---');
if (familyBank >= BUILDING_COST) {
  console.log('To make the building "very hard" when choosing family, consider:');
  console.log('1. Increasing building cost to €85,000 or €90,000');
  console.log('2. Increasing family-choice bank penalties in data/events.js');
  console.log('3. Slightly reducing base sales (e.g. 18500) so grind is tighter');
} else {
  console.log('Current balance already makes the building hard for family-first players.');
  console.log('If it still feels too easy in play, increase family event costs or building cost.');
}
