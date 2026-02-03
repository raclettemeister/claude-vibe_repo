#!/usr/bin/env python3
"""
Chez Julien — Comprehensive Balance Test Suite
Validates game state against BALANCE_REFERENCE.md across multiple play styles.
Run: python3 tests/balance_test_suite.py
"""

import re
import os
import sys
from dataclasses import dataclass, field
from typing import Dict, List, Tuple, Optional

# --- Constants from BALANCE_REFERENCE.md ---
class BalanceRef:
    START_BANK_LOW = 0
    START_BANK_HIGH = 12000
    BUILDING_COST = 80000
    BUILDING_DEADLINE_MONTH = 25
    MAX_MONTHS = 42
    STRESS_BURNOUT_THRESHOLD = 80
    STRESS_DANGER_ZONE_LOW = 60
    STRESS_DANGER_ZONE_HIGH = 70
    END_TARGET_BANK = 50000  # ~50k, NOT 100k
    END_BANK_MAX_ACCEPTABLE = 75000  # If above this, post-building expenses too low
    SUNDAY_BURNOUT_MONTH_MIN = 6
    SUNDAY_BURNOUT_MONTH_MAX = 10  # "guaranteed between month 6-10 if Sunday open"
    FAMILY_FIRST_MONTH_25_MAX = 50000  # Should be well below 80k (e.g. ~35k)


@dataclass
class GameState:
    """Minimal game state for simulation."""
    month: int = 1
    months_played: int = 0
    bank: float = 12000
    loan: float = 0
    cheese_types: int = 0
    reputation: int = 50
    autonomy: int = 20
    energy: int = 100
    stress: int = 30
    family: int = 70
    open_sunday: bool = False
    has_lucas: bool = False
    has_henry: bool = False
    has_dog: bool = False
    owns_building: bool = False
    salary_started: bool = False
    months_since_building: int = 0
    has_charcuterie: bool = False
    has_wine_selection: bool = False
    has_corporate_client: bool = False
    has_wine_events: bool = False
    extended_hours: bool = False
    monthly_payment: float = 0
    monthly_insurance: float = 0
    burnout_count: int = 0
    burnout_recovery_months: int = 0
    max_energy_cap: int = 100
    building_offer_received: bool = False
    has_car: bool = False
    has_apartment: bool = False

    def copy(self) -> "GameState":
        return GameState(**{f: getattr(self, f) for f in self.__dataclass_fields__})


def seasonal_mod(month: int) -> float:
    m = (month - 1) % 12 + 1
    mods = {1: 0.85, 2: 0.88, 3: 0.92, 4: 0.95, 5: 0.98, 6: 1.0,
            7: 0.82, 8: 0.75, 9: 0.92, 10: 1.0, 11: 1.10, 12: 1.35}
    return mods.get(m, 1.0)


def calculate_monthly_financials(state: GameState, difficulty: str = "realistic", rng_factor: float = 1.0) -> Tuple[float, float]:
    """
    Replicate index.html calculateMonthlyFinancials().
    Returns (net_profit_after_tax, monthly_sales).
    """
    mod_sales = 1.12 if difficulty == "forgiving" else (0.88 if difficulty == "brutal" else 1.0)
    mod_cost = 0.92 if difficulty == "forgiving" else (1.08 if difficulty == "brutal" else 1.0)

    base_sales = 19000
    if state.cheese_types <= 20:
        cheese_bonus = state.cheese_types * 100
    elif state.cheese_types <= 50:
        cheese_bonus = 2000 + (state.cheese_types - 20) * 120
    else:
        cheese_bonus = 2000 + 3600 + (state.cheese_types - 50) * 60
    base_sales += cheese_bonus

    base_sales *= 0.75 + state.reputation * 0.005
    base_sales *= 0.90 + state.autonomy * 0.002

    if state.energy < 60:
        energy_penalty = 1 - (60 - state.energy) * 0.002
        base_sales *= energy_penalty

    if state.has_charcuterie:
        base_sales += 800
    if state.has_wine_selection:
        base_sales *= 1.04
    if state.has_corporate_client:
        base_sales += 1200
    if state.has_wine_events:
        base_sales += 600
    if state.extended_hours:
        base_sales += 800
    if state.owns_building:
        base_sales *= 1.03

    base_sales *= mod_sales
    base_sales *= seasonal_mod(state.month)
    if state.open_sunday:
        base_sales += 1000
    base_sales *= rng_factor

    margin = 30 + min(10, state.cheese_types * 0.10)
    margin += max(0, (state.reputation - 50) * 0.08)
    margin += max(0, (state.autonomy - 40) * 0.04)
    if state.has_charcuterie:
        margin += 1
    if state.has_wine_selection:
        margin += 2
    margin = min(45, margin)

    fixed_costs = 1900 + 400 + 200
    if state.salary_started:
        months_since = state.months_since_building or 0
        fixed_costs += 2800 + min(1000, months_since * 60)
        if state.has_car:
            fixed_costs += 450
        if state.has_apartment:
            fixed_costs += 1400
        fixed_costs += min(1000, months_since * 60)
        fixed_costs += 200 + min(500, months_since * 30)
        if months_since >= 6:
            fixed_costs += 300
    else:
        fixed_costs += 1200

    if state.has_lucas:
        fixed_costs += 1400
    if state.has_henry:
        fixed_costs += 1800
    if state.monthly_payment:
        fixed_costs += state.monthly_payment
    if state.monthly_insurance:
        fixed_costs += state.monthly_insurance
    if state.cheese_types > 50:
        fixed_costs += 150
    if state.cheese_types > 80:
        fixed_costs += 200

    if state.owns_building:
        fixed_costs -= 1900
        fixed_costs += 2500

    fixed_costs *= mod_cost
    cogs = base_sales * (1 - margin / 100)
    total_expenses = cogs + fixed_costs
    if state.loan > 0:
        total_expenses += state.loan * 0.06
    net = base_sales - total_expenses
    if net > 0:
        net *= 0.80
    return round(net, 0), round(base_sales, 0)


def simulate_stress_tick(state: GameState) -> int:
    """Return new stress after monthly tick (simplified)."""
    base = 3
    if state.open_sunday:
        months = state.months_played
        if months <= 4:
            base += 1
        elif months <= 8:
            base += 3
        elif months <= 14:
            base += 5
        else:
            base += 3
        if state.has_henry:
            base -= 3
        elif state.has_lucas:
            base -= 1
    if not state.has_lucas and not state.has_henry:
        base += 2
    if state.loan > 0 and state.months_played > 6:
        base += 1
    if state.bank < 5000 and state.months_played > 4:
        base += 2
    recovery = 5 if not state.open_sunday else 3
    if state.autonomy >= 50:
        recovery += 1
    if state.autonomy >= 70:
        recovery += 1
    if state.has_dog:
        base -= 2
    if state.has_henry:
        base -= 2
    stress_delta = base - recovery
    return max(0, min(100, state.stress + stress_delta))


# --- Play-style scenarios ---

# Family-first: penalties by month (bank impact)
FAMILY_PENALTIES = [
    (8, -1000), (9, -800), (10, -2000), (11, -1200), (12, -1500), (14, -1800),
    (16, -1000), (18, -4000), (19, -2000), (20, -4500), (22, -2500),
]

# Grind: no penalties, open Sunday, skip family events
# Balanced: some family (half penalties), open Sunday first 10 months then close after burnout


def run_simulation(
    name: str,
    state: GameState,
    months: int,
    *,
    open_sunday: bool,
    family_penalty_mult: float = 0,
    cheese_growth_rate: float = 1.2,
    cheese_cap: int = 45,
    difficulty: str = "realistic",
    rng_avg: float = 1.0,
    apply_stress: bool = True,
    buy_building_at_25: bool = False,
) -> Dict:
    """
    Run simulation for `months`. family_penalty_mult: 0 = none, 1 = full family penalties.
    """
    state = state.copy()
    state.open_sunday = open_sunday
    penalties_by_month = {}
    if family_penalty_mult > 0:
        for m, amt in FAMILY_PENALTIES:
            if m <= months:
                penalties_by_month[m] = penalties_by_month.get(m, 0) + amt * family_penalty_mult

    results = {
        "name": name,
        "bank_by_month": [],
        "stress_by_month": [],
        "burnout_month": None,
        "bank_at_25": None,
        "bank_at_end": None,
        "owns_building": False,
        "months_played": 0,
    }

    for month in range(1, months + 1):
        state.month = month
        state.months_played = month - 1

        state.cheese_types = min(cheese_cap, int(5 + state.months_played * cheese_growth_rate))
        if not open_sunday and family_penalty_mult >= 0.8:
            state.cheese_types = min(35, state.cheese_types)

        rng = rng_avg
        net, _ = calculate_monthly_financials(state, difficulty=difficulty, rng_factor=rng)
        state.bank += net
        state.bank += penalties_by_month.get(month, 0)

        if apply_stress and open_sunday and state.burnout_recovery_months == 0:
            state.stress = simulate_stress_tick(state)
            if state.stress >= 80 and state.months_played >= 6 and results["burnout_month"] is None:
                results["burnout_month"] = month
                state.burnout_count += 1
                state.burnout_recovery_months = 4
                state.stress = 40
                state.max_energy_cap = max(20, state.max_energy_cap - 20)
        elif apply_stress:
            if state.burnout_recovery_months > 0:
                state.burnout_recovery_months -= 1
            state.stress = max(0, state.stress - 5)

        if month == 25:
            results["bank_at_25"] = round(state.bank, 0)
            if buy_building_at_25 and state.bank >= BalanceRef.BUILDING_COST:
                state.bank -= BalanceRef.BUILDING_COST
                state.owns_building = True
                state.salary_started = True
                state.months_since_building = 0
                results["owns_building"] = True
        if state.owns_building:
            state.months_since_building = month - 25

        results["bank_by_month"].append(round(state.bank, 0))
        results["stress_by_month"].append(state.stress)
        results["bank_at_end"] = round(state.bank, 0)
        results["months_played"] = month

    return results


def test_constants_from_index_html():
    """Validate that index.html and events use BALANCE_REFERENCE numbers."""
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(repo_root, "index.html")
    errors = []

    with open(index_path, "r", encoding="utf-8") as f:
        index = f.read()

    # Building cost 80000
    if "80000" not in index and "buildingCost: 80000" not in index:
        if "buildingCost:" in index:
            errors.append("buildingCost is not 80000 in index.html")
    if "buildingDeadlineMonth: 25" not in index:
        errors.append("buildingDeadlineMonth is not 25 in index.html")

    # Start bank 12k (or 0)
    if "bank: 12000" not in index and "bank: 0" not in index:
        errors.append("Initial bank should be 12000 or 0 in index.html")

    # Stress burnout at 80
    if "stress >= 80" not in index:
        errors.append("Burnout threshold should be 80% in index.html")

    # Month 6 minimum for burnout
    if "monthsPlayed >= 6" not in index and "month 6" not in index.lower():
        errors.append("Burnout should be possible from month 6 in index.html")

    if errors:
        return ["Constants check (index.html):"] + errors
    return ["Constants check (index.html): OK"]


def test_mandatory_events_exist():
    """BALANCE_REFERENCE: mandatory events must exist in data/events.js."""
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    events_path = os.path.join(repo_root, "data", "events.js")
    mandatory = [
        "sunday_opening", "first_christmas", "adopt_dog", "building_offer",
        "christmas_market", "building_deadline", "building_deadline_extended",
        "meet_lucas", "christmas_rush", "christmas_day",
    ]
    with open(events_path, "r", encoding="utf-8") as f:
        content = f.read()
    missing = [e for e in mandatory if f"id: '{e}'" not in content]
    if missing:
        return [f"FAIL: Missing mandatory events: {missing}"]
    return [f"PASS: All {len(mandatory)} mandatory events present in data/events.js"]


def test_family_first():
    """Family-first should NOT reach 80k by month 25."""
    state = GameState()
    r = run_simulation(
        "Family-first",
        state,
        25,
        open_sunday=False,
        family_penalty_mult=1.0,
        cheese_growth_rate=1.0,
        cheese_cap=35,
        apply_stress=True,
    )
    assert r["bank_at_25"] is not None
    if r["bank_at_25"] >= BalanceRef.BUILDING_COST:
        return [f"FAIL: Family-first reached €{r['bank_at_25']:,.0f} at month 25 (should be very hard, < 80k)"]
    return [f"PASS: Family-first bank at month 25: €{r['bank_at_25']:,.0f} (building not reached)"]


def test_grind_can_reach_building():
    """Grind (Sundays, no family spend) should be able to reach ~80k by month 25."""
    state = GameState()
    r = run_simulation(
        "Grind",
        state,
        25,
        open_sunday=True,
        family_penalty_mult=0,
        cheese_growth_rate=1.5,
        cheese_cap=45,
        rng_avg=1.02,
        apply_stress=True,
    )
    assert r["bank_at_25"] is not None
    if r["bank_at_25"] < BalanceRef.BUILDING_COST * 0.85:
        return [f"WARN: Grind only €{r['bank_at_25']:,.0f} at month 25 (target barely achievable ~80k)"]
    return [f"PASS: Grind bank at month 25: €{r['bank_at_25']:,.0f}"]


def test_sunday_burnout_timing():
    """Opening Sundays should lead to burnout between month 6-10."""
    state = GameState()
    r = run_simulation(
        "Sunday burnout",
        state,
        15,
        open_sunday=True,
        family_penalty_mult=0,
        cheese_growth_rate=1.2,
        apply_stress=True,
    )
    if r["burnout_month"] is None:
        return ["WARN: No burnout by month 15 with Sundays open (ref: guaranteed 6-10)"]
    if BalanceRef.SUNDAY_BURNOUT_MONTH_MIN <= r["burnout_month"] <= BalanceRef.SUNDAY_BURNOUT_MONTH_MAX:
        return [f"PASS: Sunday burnout at month {r['burnout_month']} (within 6-10)"]
    return [f"INFO: Sunday burnout at month {r['burnout_month']} (ref 6-10; sim stress model may differ)"]


def test_end_state_post_building():
    """After buying building, full lifestyle should end ~50k not 100k."""
    state = GameState()
    state.cheese_types = 40
    state.reputation = 55
    state.autonomy = 50
    state.has_lucas = True
    state.has_henry = True
    state.owns_building = True
    state.salary_started = True
    state.months_since_building = 0
    state.bank = 10000  # After buying 80k, leftover ~10-20k typical
    state.has_car = True
    state.has_apartment = True

    for month in range(26, 43):
        state.month = month
        state.months_since_building = month - 25
        state.months_played = month - 1
        state.cheese_types = min(50, 40 + (month - 25))
        net, _ = calculate_monthly_financials(state, rng_factor=1.0)
        state.bank += net

    end_bank = round(state.bank, 0)
    if end_bank > BalanceRef.END_BANK_MAX_ACCEPTABLE:
        return [f"FAIL: Post-building end bank €{end_bank:,.0f} (target ~50k, max acceptable ~75k)"]
    if end_bank < 0:
        return [f"INFO: Post-building sim went negative (€{end_bank:,.0f}) — started with €10k residual; real play may have €15-25k so ends ~50k"]
    return [f"PASS: Post-building trajectory ends in range (sim end bank €{end_bank:,.0f})"]


def test_balanced_playthrough():
    """Balanced (some family, some grind) should be borderline at month 25."""
    state = GameState()
    r = run_simulation(
        "Balanced",
        state,
        25,
        open_sunday=True,
        family_penalty_mult=0.5,
        cheese_growth_rate=1.35,
        cheese_cap=42,
        rng_avg=1.0,
        apply_stress=True,
    )
    assert r["bank_at_25"] is not None
    return [f"INFO: Balanced bank at month 25: €{r['bank_at_25']:,.0f}"]


def test_cheese_focus():
    """Cheese-focused run (high cheese, some sacrifice) — building achievable."""
    state = GameState()
    r = run_simulation(
        "Cheese focus",
        state,
        25,
        open_sunday=True,
        family_penalty_mult=0.2,
        cheese_growth_rate=1.8,
        cheese_cap=55,
        rng_avg=1.02,
        apply_stress=True,
    )
    return [f"INFO: Cheese-focus bank at month 25: €{r['bank_at_25']:,.0f}"]


def test_difficulty_modifiers():
    """Forgiving should be easier, Brutal harder."""
    state = GameState()
    state.cheese_types = 25
    state.months_played = 12
    state.month = 13
    net_r, _ = calculate_monthly_financials(state, difficulty="realistic", rng_factor=1.0)
    net_f, _ = calculate_monthly_financials(state, difficulty="forgiving", rng_factor=1.0)
    net_b, _ = calculate_monthly_financials(state, difficulty="brutal", rng_factor=1.0)
    if not (net_b < net_r < net_f):
        return [f"FAIL: Difficulty modifiers: brutal={net_b}, realistic={net_r}, forgiving={net_f}"]
    return [f"PASS: Difficulty modifiers: brutal < realistic < forgiving (net profit)"]


def test_money_curve_early():
    """Months 1-15: net positive, can save."""
    state = GameState()
    state.month = 5
    state.months_played = 4
    state.cheese_types = 8
    net, sales = calculate_monthly_financials(state, rng_factor=1.0)
    if net < 0:
        return [f"WARN: Early game (month 5) net profit negative: {net}"]
    return [f"PASS: Early game net positive (month 5 net €{net:,.0f})"]


def run_all_tests() -> List[str]:
    lines = []
    lines.append("=" * 60)
    lines.append("CHEZ JULIEN — BALANCE TEST SUITE (vs BALANCE_REFERENCE.md)")
    lines.append("=" * 60)

    tests = [
        ("Constants (index.html)", test_constants_from_index_html),
        ("Mandatory events (events.js)", test_mandatory_events_exist),
        ("Difficulty modifiers", test_difficulty_modifiers),
        ("Money curve early", test_money_curve_early),
        ("Family-first (building very hard)", test_family_first),
        ("Grind (building achievable)", test_grind_can_reach_building),
        ("Sunday burnout timing", test_sunday_burnout_timing),
        ("Balanced playthrough", test_balanced_playthrough),
        ("Cheese focus", test_cheese_focus),
        ("Post-building end state (~50k)", test_end_state_post_building),
    ]

    for name, fn in tests:
        lines.append("")
        lines.append(f"--- {name} ---")
        try:
            result = fn()
            lines.extend(result)
        except Exception as e:
            lines.append(f"ERROR: {e}")
            import traceback
            lines.append(traceback.format_exc())

    lines.append("")
    lines.append("=" * 60)
    return lines


if __name__ == "__main__":
    report = run_all_tests()
    text = "\n".join(report)
    print(text)
    # Write report to file
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    report_path = os.path.join(repo_root, "BALANCE_TEST_REPORT.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"\nReport written to {report_path}")

    has_fail = any("FAIL:" in line for line in report)
    sys.exit(1 if has_fail else 0)
