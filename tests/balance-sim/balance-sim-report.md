# Balance simulation report

Fixed event chain from `data/timeline.json`. One run per playstyle.

## Summary: which playstyles achieve the building / avoid 3 burnouts

| Playstyle   | Building (€80k by month 25) | Bank at month 25 | Burnouts | Game over |
|------------|------------------------------|------------------|----------|-----------|
| aggressive | NO                           | €61,486          | 3        | burnout    |
| family     | NO                           | €39,103          | 0        | —          |
| reasonable | NO                           | €54,779          | 2        | —          |
| money_first | NO                           | €68,572          | 2        | —          |
| health_first | NO                           | €63,665          | 2        | —          |
| neutral    | NO                           | €62,810          | 2        | —          |

## Interpretation

- **Building**: Only counted if the playstyle has bank ≥ €80,000 at the deadline (month 25) and chooses to sign.
- **Burnouts**: Stress threshold 82 + 5×burnoutCount; 3 burnouts = game over.
- Events and effects are defined in `data/balance-sim/triggered-events-registry.json`.
