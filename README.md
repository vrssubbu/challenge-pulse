# Challenge Pulse

A dependency-free Discord observation dashboard for TAMU Datathon. It includes official metadata for eight challenges and a traceable, partial Rev’s Casino sample: ten observed messages, five anonymous visible display labels, and six content categories. The other seven channels are marked unread, with null counts.

## Run

Requires Node.js 18 or newer. From this directory:

```sh
node serve.mjs
```

Open http://127.0.0.1:4173. Do not open `dist/index.html` directly: browsers restrict JSON loading from local file URLs. The app is static and requires no package installation. Optional Google Fonts fall back to system fonts if unavailable.

## Use

- Overview filters the observed sample by challenge and shows category shares, coverage and a cautious actionable finding.
- Message explorer filters by challenge, category and paraphrase. Each record links to its original Discord message for users with server access.
- Coverage & method distinguishes partial samples from unread channels and documents the eligibility gap.
- Explore a scenario computes `min(3, N) / N` for a manually assumed entrant count. It is an equal-chance thought experiment, not a winning probability forecast.
- Export message JSON, CSV and coverage JSON. Imports merge message JSON by exact string message ID; conflicting duplicates are rejected. Imports stay in localStorage on the current browser. Export to transfer them.

## Data and provenance

`dist/data/catalog.json` is public official challenge metadata. `discord-observations.json` is the per-channel coverage inventory. `discord-message-coding.json` contains anonymous aliases and paraphrased coded messages. See `docs/DISCORD_METHODOLOGY.md`, `docs/METRIC_DICTIONARY.md` and `docs/CHALLENGE_REVIEW.md`.

No participant names, team counts, entrant counts, mental-health interpretations or fabricated observations are added. Visible timezones were not verified. No messages-per-hour calculation or cross-channel ranking is made because the observation windows are incomplete and unequal. Author roles are unverified, so this sample does not claim to exclude staff or bots.

The written Build-A-Dataset guide requires physical-world primary data. The user reports organizer permission for remote observations; the scope has not been independently verified. Synthetic records remain synthetic and are never represented as team contacts or fieldwork.

## Message import contract

Import `{ "schema_version": 1, "records": [...] }`, or a record array. Every record needs: `message_id` as a string, `challenge_id`, `source_type: "discord_ui_observation"`, `source_url` linking to that exact Discord message, `display_date` in YYYY-MM-DD, `display_time` in HH:mm, `timezone` as an IANA timezone or null, anonymous `display_alias`, `category` and `paraphrase`. Optional fields are `reply_to_message_id` and `human_reviewed`. Unknown fields are discarded to keep exports within this analytical schema.

Supported categories: `social_banter`, `strategy_discussion`, `progress_report`, `collaboration`, `unclassified_media`, `leaderboard_request`, `help_request`, `rule_clarification`, `organizer_update`, `other`. The initial observed sample uses only the first six. Adding a supported category is not evidence that it was observed.

Message IDs are deduplicated; matching IDs with different content, time, timezone or reply metadata reject the import. Imported samples remain partial. Display-label counts are withheld after imports for an affected channel because aliases from different samples may collide.

## Validation

```sh
npm test
```

Model checks cover sample reconciliation, duplicate handling, conflict detection, input validation, removal of unknown identity fields, safe CSV escaping, scenario bounds and DOM target consistency. Browser visual QA was unavailable because the computer-use runtime could not verify the target URL. Local HTTP checks and model tests do not establish visual verification.

## Separate synthetic scenario

The Simulation panel loads simulated-teams.json and simulated-team-challenges.json. It contains nine fictional four-person teams and illustrative challenge allocations, difficulty and prize-influence inputs. No teams were contacted. All records preserve source_type: synthetic, is_observed: false and scenario_only: true. Synthetic rows are not imported into the observed-message dataset. The observed and simulated panels use separate data files and separate exports.

Regenerate the fixed illustrative scenario with `node scripts/generate-simulation.mjs`. Each fictional team has two or three challenge rows. This generator never reads Discord observations and cannot turn synthetic data into observations.
