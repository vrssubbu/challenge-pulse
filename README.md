# Challenge Pulse

A dependency-free Discord observation dashboard for TAMU Datathon. It includes official metadata for eight challenges and a traceable, partial Rev’s Casino sample: ten distinct observed messages, five sample-scoped display-label aliases, and six content categories. Two recorded snapshots contain the same ten message IDs, so repeated sightings do not increase the message count. The other seven channels are marked unread, with null counts.

## Run

Requires Node.js 18 or newer. From this directory:

```sh
node serve.mjs
```

Open http://127.0.0.1:4173. Do not open `dist/index.html` directly: browsers restrict JSON loading from local file URLs. The app is static and requires no package installation. Optional Google Fonts fall back to system fonts if unavailable.

## Use

- Overview includes eight equal-size challenge nodes. Select a node or use the challenge selector to filter the observed sample. Missing channels display “No sample”; node size does not imply popularity. The pulse animation is decorative, not a live feed. Pause it with the motion control; the app also honors the device’s reduced-motion preference while keeping all content visible.
- Click a content-category bar or a thematic question to open its matching evidence. Category shares always use the selected message sample as their denominator.
- Message explorer combines challenge, category, paraphrase search, snapshot, author-role and content-lens filters. Click a displayed-hour group to narrow the view, or reset the filters. The hour groups contain only sampled messages and are not a complete time series or an activity-rate calculation.
- Inspect a message to open its paraphrase, source link, display time, alias, role evidence, collection/coding provenance and authoritative snapshot membership. Where present, reaction counts are labeled as the latest recorded reaction reading, with their observation date and snapshot; they are not unique-reactor counts or counts as of every earlier snapshot. Original Discord links require server access.
- Coverage & method distinguishes partial samples from unread channels, explains deduplication and documents the written collection requirement alongside the user-reported organizer exception.
- Explore a scenario computes `min(3, N) / N` for a manually assumed entrant count. It is an equal-chance thought experiment, not a winning probability forecast.
- Export message JSON, message CSV and coverage JSON. Exports include all loaded records, regardless of current filters. JSON preserves the full normalized message schema and is the supported import/transfer format; CSV provides the core analytical fields plus role, snapshot and reaction fields.
- Import another coded-message JSON file to merge records by exact string message ID. The result reports added, enriched and unchanged records. Imports remain in this browser’s localStorage on this device; they are not synchronized to another device or the hosted source files. Export JSON to transfer them.

## Data and provenance

`dist/data/catalog.json` is public official challenge metadata. `discord-observations.json` is the per-channel coverage inventory. `discord-message-coding.json` contains aliases, paraphrased coded messages and a bundled `snapshots` inventory. See [Discord methodology](docs/DISCORD_METHODOLOGY.md), [metric dictionary](docs/METRIC_DICTIONARY.md) and [challenge review](docs/CHALLENGE_REVIEW.md).

No participant names, measured team/entrant counts, mental-health interpretations or fabricated observations are added to the observed dataset. Displayed posting timezones were not verified. No messages-per-hour calculation or cross-channel ranking is made because the observation windows are incomplete and unequal. Author roles are unknown for all ten current messages; quoting or replying to an organizer does not establish the author’s role. The sample does not claim to exclude staff or bots.

The reread captured reaction counts for two messages only. Missing reaction fields on other messages mean unmeasured, not zero. The current reaction reading is separate from the posting timestamp and initial observation. Sources and coding limitations remain attached to the records.

The written Build-A-Dataset guide requires physical-world primary data. The user reports organizer permission for remote observations; the scope has not been independently verified. Synthetic records remain synthetic and are never represented as team contacts or fieldwork.

## Message import contract

Import `{ "schema_version": 1, "records": [...] }`, or a record array. The UI accepts files smaller than 5 MB and up to 10,000 records per import. Every record needs:

- `message_id` as a string, preserving the exact Discord snowflake rather than a potentially rounded JSON number.
- A known `challenge_id`, `source_type: "discord_ui_observation"`, and `source_url` linking to that exact message in the matching TAMU Datathon challenge channel.
- `display_date` in YYYY-MM-DD, `display_time` in HH:mm, `timezone` as a valid timezone name or null, a short sample-scoped `display_alias`, `category`, and a paraphrase of 1–1,000 characters.

Optional fields retained by normalization include `reply_to_message_id`, `human_reviewed`, `captured_at`, `collector`, `collection_method`, `coding_method` and `identity_unit`. Unknown fields are discarded. Records explicitly marked synthetic or scenario-only are rejected from the observed-message import.

`snapshot_ids` is an array of up to 100 short identifiers. Bundled `snapshots[].message_ids` establishes authoritative membership for the explorer’s snapshot filter. Imported per-message snapshot identifiers are preserved and merged, but imported top-level snapshot metadata is not treated as verified coverage. Such records can be explored through “Records imported on this device”; a claimed snapshot identifier alone cannot place a new message in a bundled snapshot.

`author_role` is `unknown` by default, or `organizer` with nonempty `role_evidence`. The `organizer_update` category requires that explicit organizer role evidence. Do not infer organizer status from a quoted message or reply context.

Reaction fields are nullable: `reaction_count_observed`, `reaction_types_observed`, `reaction_observed_on_local`, `reaction_observed_timezone`, `reaction_capture_time`, `reaction_snapshot_id` and `reaction_observation_note`. A known count requires a valid observation date, timezone and a reaction snapshot listed in `snapshot_ids`. Reaction-type counts cannot exceed total reaction counts. These fields describe a particular reading, not unique people or a growth rate.

Supported categories: `social_banter`, `strategy_discussion`, `progress_report`, `collaboration`, `unclassified_media`, `leaderboard_request`, `help_request`, `rule_clarification`, `logistics_request`, `organizer_update`, `other`. The initial observed sample uses only the first six. Supporting a category in the application is not evidence that it was observed.

Message IDs are deduplicated. Matching IDs with conflicting challenge, coding/content, alias, posting time, source URL, timezone or reply metadata reject the import. Compatible duplicates can enrich snapshot membership, missing provenance, an unknown author role or human-review status without adding another message.

A known reaction reading can enrich a missing reading. A later observation date in the same timezone replaces the whole earlier reaction-provenance bundle; older incoming readings do not replace the current reading. Different known counts on the same observation date, or readings with incompatible observation timezones, reject the merge because ordering is not established.

Imported samples remain partial. The app withholds combined display-label counts, time ranges, concentration measures and reaction aggregates for affected channels rather than reusing stale bundled values. Per-message evidence remains inspectable. Export metadata identifies mixed bundled/imported records and preserves the original bundled metadata separately.

## Validation

```sh
npm test
```

Model checks cover sample reconciliation, snapshot membership, duplicate enrichment, reaction ordering, role evidence, input validation, removal of unknown identity fields, CSV escaping, scenario bounds, theme/lens filters, displayed-time groups, missing-data handling and DOM target consistency. Browser visual QA was unavailable because the computer-use runtime could not verify the target URL. Local HTTP checks and model tests do not establish visual verification.

## Separate synthetic scenario

The Simulation panel loads `simulated-teams.json` and `simulated-team-challenges.json`. It contains nine fictional four-person teams and illustrative challenge allocations, difficulty and prize-influence inputs. No teams were contacted. All records preserve `source_type: synthetic`, `is_observed: false` and `scenario_only: true`. Synthetic rows are not imported into the observed-message dataset. The observed and simulated panels use separate data files and separate exports. See [simulation methodology](docs/SIMULATION_METHODOLOGY.md).

Regenerate the fixed illustrative scenario with `node scripts/generate-simulation.mjs`. Each fictional team has two or three challenge rows. This generator never reads Discord observations and cannot turn synthetic data into observations.
