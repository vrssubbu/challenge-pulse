# Nine-team simulation methodology

This optional scenario contains **nine invented teams with four hypothetical members each**. No teams were contacted, approached, surveyed, interviewed, or observed to create these rows. The records are generated examples for exploring the dashboard, not event findings or evidence of participation.

The scenario is separate from the ten actually observed Rev's Casino message items. It is not calibrated to those messages, and it must never increase the app's observed-message, observed-author, or verified-team counts.

## Files and units

- `dist/data/simulated-teams.json`: nine synthetic team records, `SIM-T01` through `SIM-T09`, each with an assumed `team_size` of four.
- `dist/data/simulated-team-challenges.json`: 21 synthetic team–challenge records from a fixed illustrative selection matrix, covering all eight challenge IDs. Each team has two or three selections in the scenario.

Every row carries `source_type: "synthetic"`, `is_observed: false`, and `scenario_only: true`. File metadata and the app's Simulation tab must preserve that designation. Export filenames and contents must continue to distinguish the scenario from observed records.

Nine times four equals 36 hypothetical members by construction. It is not a count of people at the event, people reached, or Discord participants. Twenty-one rows represent selected team–challenge pairs in the scenario, not 21 independent teams.

## Generation assumptions

The generator uses an author-designed challenge selection matrix and the Mulberry32 pseudorandom generator with seed `20261108` for illustrative effort and rating values. The selection matrix is chosen to exercise the interface across all challenges; it is not estimated from channel volume or official entrant data. The generated values do not establish a real distribution of difficulty, motivation, or effort.

Statuses include considering, active, submitting, and stopped. Current hypothetical member allocations are whole numbers. Active/submitting selections may receive members; considering/stopped selections receive zero current allocation. Allocation totals cannot exceed four members per team. A stopped selection can still have prior hypothetical effort; zero current allocation does not erase prior work.

`effort_hours` means assumed elapsed working hours on that challenge, not summed person-hours. `simulated_difficulty_1_5` and `simulated_prize_importance_1_5` are synthetic ratings, not participant answers. Do not rename these fields to measured difficulty or surveyed prize motivation.

| Hypothetical status | Effort range | Difficulty values |
| --- | --- | --- |
| Considering | 0 hours | Null: no assumed attempt |
| Active | 1–7 hours in half-hour steps | Integers 2–5 |
| Submitting | 3–7.5 hours in half-hour steps | Integers 1–3 |
| Stopped | 0.5–3 hours in half-hour steps | Integers 3–5 |

Prize-importance ratings are integers 1–5 across statuses. These conditional ranges deliberately bake relationships into the example. For instance, lower difficulty among submitting selections is a generation assumption, not a discovered event relationship. The fixed allocation matrix assigns 34 hypothetical members and leaves two unallocated; this is a scenario property, not a measured staffing pattern.

The generator source records the concrete seed and parameter choices. Re-running it can reproduce the example; reproducibility does not make the example an empirical dataset.

## Interpretation and presentation

Use this scenario to test filtering, multi-challenge counting, member-allocation totals, missing ratings, and hypothetical comparisons. It can illustrate questions that richer data might answer. It cannot answer those questions about the actual event.

All scenario charts should visibly say simulation or synthetic. Keep their denominator explicit: nine simulated teams, 36 hypothetical members, or the relevant subset of 21 simulated team–challenge selections. Never combine these denominators with the five display labels or ten observed messages.

Any rank, opportunity score, or top-three calculation derived from this scenario is an assumption-driven illustration. In particular, `min(3, N) / N` is only an equal-chance scenario for an assumed entrant count; simulated team selection counts are not measured entrants and do not produce a personal winning probability.

The user reports a remote-observation exception to the written challenge rules. That report concerns collection mode. It does not establish that generated rows or invented approaches qualify as observations. If the scenario is included in a submission, identify it as supplementary synthetic material and describe the actual online observation process separately.

