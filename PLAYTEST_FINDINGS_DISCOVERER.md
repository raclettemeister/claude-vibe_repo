# Playtest Findings: Discoverer Profile (Family-Friendly Run)

**Date:** February 10, 2026  
**Profile:** Discoverer — someone who doesn’t know the mechanics but tries to make good, family-friendly decisions.  
**Scope:** Play until the building deadline (month 25).  
**Method:** Automated E2E run with a “discoverer” strategy: ~55% preference for choices that sound family-friendly (rest, family, say no, close, balance, etc.), otherwise random among options. No insider knowledge; Realistic difficulty.

---

## Summary

- **Getting the building on time (€80k by month 25):** With **optimal play** (always first choice), the existing E2E test shows you can reach the building deadline event and pass. So it’s **achievable** for an insider.
- **As a discoverer:** In the run we captured, the run **passed month 25** but in that instance **did not see the building_deadline event** (timeline can show an alt event at month 25, or eligibility can depend on prior choices). By the time the run was stopped it had reached **month 38** with **€175,094** in the bank — so **affording the building was not the issue** in that run; the moment of “getting or not getting the building” was not clearly presented at the expected time.
- **Burnout:** In the same discoverer run we saw **2 burnouts**. So a family-friendly / balanced style of play **does not prevent burnout**; the run still hit the burnout mechanic twice.
- **Stress:** At the end of that run, stress was **0** (recovery after burnouts and choices), so the game did not end from stress, but the cost was two burnout events.

---

## 1. How hard was it to get the building?

- **Insider (optimal):** The “play from start until building buying event” E2E test passes: you can reach `building_deadline` (or extended) and have the option to sign. So with full knowledge, **getting the building is doable**.
- **Discoverer (one run):** In our automated discoverer run we did **not** see the building_deadline event at month 25 (we either got the alt event for that slot or the event was ineligible). So for a discoverer, **reaching the actual “building decision” moment** can be **unreliable or feel random** depending on timeline/eligibility. When we stopped the run at month 38, the player had **€175k** — so **not getting the building** in that run was **not** due to lack of money, but to not getting the deadline event at the expected time (or not having it offered in that run).

**Conclusion:** Getting the building is **achievable for an insider**. For a discoverer, **affording it** can happen (we saw 175k by month 38), but **getting the building** depends on reliably hitting the building_deadline moment and choosing to sign; that moment was not observed in this discoverer run.

---

## 2. How hard was it to NOT get the building?

- If the **building_deadline** (or extended) event is shown and the player has **&lt; €80k**, the only options are “Ask for one more month” or “Watch it slip away” — so **not** getting the building is straightforward.
- If the player has **≥ €80k**, they can still choose “Let it go anyway” and deliberately not buy. So for an insider, **not** getting the building is **easy** (either by being short on cash or by choice).
- For a discoverer who **does** see the deadline: choosing the “family / let it go” style option would lead to not getting the building; the difficulty is only in **reaching that event** and having the choice clear.

---

## 3. Burnout

- In the **discoverer** run (family-friendly bias + random choices), we observed **2 burnouts** before stopping.
- So **family-friendly choices do not remove the risk of burnout**; the run still crossed the stress/energy thresholds twice and triggered the burnout mechanic.
- That suggests the **balance is tight**: a player who favors rest/family can still accumulate enough stress (or low energy) to burn out, which feels **realistic** but can be **punishing** for a discoverer who expects “balance” to protect them.

**Conclusion:** Burnout is a real threat for a discoverer. Two burnouts in one run may feel **too harsh** for a “family-friendly” playstyle; consider whether you want to soften stress gain or recovery when the player consistently picks balance/family options.

---

## 4. Other observations

- **Family:** In the discoverer run, family was **69** at the end — not bad, but not “family first” maxed out, which fits with also having had 2 burnouts (trade-offs).
- **Stopping after the building deadline:** The discoverer test was set to stop when we either see `building_deadline` / `building_deadline_extended` or when **monthsPlayed ≥ 25**. In the run we captured, the loop had not been limited to month 25 yet, so the run continued to month 38. The test has since been updated to **stop at month 25** if the deadline event is not shown, so future discoverer runs will report state **at the building deadline** (e.g. bank, stress, burnouts) even when the event is skipped.

---

## 5. Recommendations

1. **Building deadline visibility:** Consider making the **building_deadline** event **always** (or almost always) appear at month 25 when `buildingOfferReceived` is true, so a discoverer consistently gets the “did I get the building?” moment. Right now, timeline/alt or eligibility can cause that moment to be missed.
2. **Burnout vs family-friendly play:** If the design goal is that “family-friendly / balanced” play should reduce burnout risk, consider:
   - Slightly lower stress gain when the player has recently chosen “rest / family / no” options, or
   - A small stress recovery when choosing clearly family-friendly choices.
3. **Discoverer test:** The new E2E test `discoverer-playthrough.spec.js` automates a discoverer-style run (family-friendly bias + random choices) and logs at the end: bank, stress, burnouts, family, whether the building was reached/owned. Run it multiple times (e.g. `npm test -- --grep "discoverer choices"`) to get a distribution of outcomes (building reached or not, burnout count, bank at month 25).

---

## 6. How to reproduce

- **Insider (optimal):**  
  `npm test -- --grep "play from start until building"`  
  Expect: reaches `building_deadline` or `building_deadline_extended`, passes.

- **Discoverer (family-friendly + random):**  
  `npm test -- --grep "discoverer choices until building"`  
  Expect: runs until building deadline (or month 25); logs bank, stress, burnouts, family, ownsBuilding.  
  (Ensure no other server is using the test port, or set `PLAYWRIGHT_PORT` if needed.)
