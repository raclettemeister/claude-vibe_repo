/**
 * Balance Constants for Chez Julien Simulator
 * 
 * Centralized balance values referenced in BALANCE_REFERENCE.md
 * These should be the single source of truth for game balance.
 */

// ============================================
// FINANCIAL CONSTANTS
// ============================================

/** Starting bank balance (realistic difficulty) */
export const STARTING_BANK = 15000;

/** Building purchase cost */
export const BUILDING_COST = 80000;

/** Building purchase deadline (month index, 0-based) */
export const BUILDING_DEADLINE_MONTH = 25; // July 2024

/** Building delay penalty (if you need one more month) */
export const BUILDING_DELAY_PENALTY = 5000;

/** Base monthly sales (starting point) */
export const BASE_MONTHLY_SALES = 19000;

/** Monthly rent (before building purchase) */
export const MONTHLY_RENT = 1900;

/** Building loan payment (after purchase) */
export const BUILDING_LOAN_PAYMENT = 2500;

/** Monthly utilities */
export const MONTHLY_UTILITIES = 400;

/** Base insurance/accounting */
export const BASE_INSURANCE_ACCOUNTING = 200;

/** Comprehensive insurance (if chosen) */
export const COMPREHENSIVE_INSURANCE_MONTHLY = 150;

/** Tax rate on profit */
export const TAX_RATE = 0.20; // 20%

/** Loan interest rate (monthly) */
export const LOAN_INTEREST_RATE = 0.06; // 6% per month

/** Maximum loan before bankruptcy */
export const MAX_LOAN_BEFORE_BANKRUPTCY = 40000;

// ============================================
// STAFF COSTS
// ============================================

/** Lucas monthly salary */
export const LUCAS_SALARY = 1400;

/** Henry monthly salary */
export const HENRY_SALARY = 1800;

// ============================================
// POST-BUILDING LIFESTYLE COSTS
// ============================================

/** Base owner salary (starts after building purchase) */
export const OWNER_BASE_SALARY = 2800;

/** Owner salary growth per month (after building) */
export const OWNER_SALARY_GROWTH_PER_MONTH = 60;

/** Maximum owner salary growth */
export const OWNER_SALARY_MAX_GROWTH = 1000; // Total: 2800 + 1000 = 3800

/** Car cost (starts 6 months after building) */
export const CAR_MONTHLY_COST = 450;

/** Apartment cost (starts 12 months after building) */
export const APARTMENT_MONTHLY_COST = 1400;

/** Lifestyle creep per month (after building) */
export const LIFESTYLE_CREEP_PER_MONTH = 60;

/** Maximum lifestyle creep */
export const LIFESTYLE_CREEP_MAX = 1000;

/** Business reinvestment base */
export const REINVESTMENT_BASE = 200;

/** Business reinvestment growth per month */
export const REINVESTMENT_GROWTH_PER_MONTH = 30;

/** Maximum reinvestment growth */
export const REINVESTMENT_MAX_GROWTH = 500;

/** Social obligations cost (after 6 months post-building) */
export const SOCIAL_OBLIGATIONS_COST = 300;

// ============================================
// STRESS & BURNOUT
// ============================================

/** Stress threshold for burnout crash */
export const STRESS_BURNOUT_THRESHOLD = 80;

/** Stress danger zone start */
export const STRESS_DANGER_ZONE = 60;

/** Stress critical zone start */
export const STRESS_CRITICAL_ZONE = 70;

/** Maximum burnout count before game over */
export const MAX_BURNOUT_COUNT = 3;

/** Energy reduction per burnout */
export const ENERGY_REDUCTION_PER_BURNOUT = 20; // Percentage points

/** Minimum energy cap after burnouts */
export const MIN_ENERGY_CAP = 20;

/** Burnout recovery period (months) */
export const BURNOUT_RECOVERY_MONTHS = 4;

/** Minimum months before burnout can occur (honeymoon period) */
export const BURNOUT_MIN_MONTH = 6;

// ============================================
// SUPPLIER GRACE PERIODS
// ============================================

/** Maximum supplier grace periods */
export const MAX_SUPPLIER_GRACE_PERIODS = 3;

// ============================================
// STAT RANGES
// ============================================

/** Minimum stat value */
export const STAT_MIN = 0;

/** Maximum stat value */
export const STAT_MAX = 100;

/** Starting stress */
export const STARTING_STRESS = 30;

/** Starting energy */
export const STARTING_ENERGY = 100;

/** Starting family */
export const STARTING_FAMILY = 70;

/** Starting autonomy */
export const STARTING_AUTONOMY = 20;

/** Starting reputation */
export const STARTING_REPUTATION = 50;

// ============================================
// GAME LENGTH
// ============================================

/** Total months in game */
export const TOTAL_MONTHS = 42;

/** Starting month (July = 7) */
export const STARTING_MONTH = 7;

/** Starting year */
export const STARTING_YEAR = 2022;

// ============================================
// DIFFICULTY MODIFIERS
// ============================================

export const DIFFICULTY_MODIFIERS = {
    realistic: {
        salesMod: 1.0,
        costMod: 1.0
    },
    forgiving: {
        salesMod: 1.1,
        costMod: 0.9
    },
    brutal: {
        salesMod: 0.9,
        costMod: 1.15
    }
};

// ============================================
// DIFFICULTY STARTING VALUES
// ============================================

export const DIFFICULTY_STARTING_VALUES = {
    realistic: {
        bank: STARTING_BANK,
        stress: STARTING_STRESS
    },
    forgiving: {
        bank: 20000,
        stress: 20
    },
    brutal: {
        bank: 10000,
        stress: 40
    }
};
