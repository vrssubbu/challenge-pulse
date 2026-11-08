# Challenge Pulse

A dependency-free dashboard of observed challenge discussions at TAMU Datathon. It combines official metadata for eight challenges with traceable, partial observations of their Discord channels. The dashboard derives counts, categories, dates and coverage from the bundled message and snapshot records. Repeated sightings are deduplicated by message ID. Any unread channel remains missing, not zero.

## Dataset package

Start with the [central dataset folder](dataset/) or download the [Excel workbook](dataset/Participant_Pulse_Dataset.xlsx). The package contains **140 unique observed messages with all 30 source fields, eight channel summaries, 11 snapshots and 150 snapshot–message links**. The links include repeated sightings of the same ten Rev's Casino messages; they are not 150 distinct messages. Official challenge context and the nine-team, 21-allocation fictional scenario are stored separately from observed data.

The workbook stores Discord IDs as text to preserve all 19 digits. The folder also includes the five original JSON files, CSV views, a [field dictionary](dataset/DATA_DICTIONARY.csv), [collection method](dataset/METHOD.md), [eligibility status](dataset/ELIGIBILITY.md) and a [SHA-256 manifest](dataset/MANIFEST.json). Original JSON preserves source types, unknown values and nested provenance. See the [dataset README](dataset/README.md) for joins and safe CSV import instructions; double-clicking a CSV in Excel can round its identifiers.

These are partial online observations read November 7–8, 2026, not a channel census or a verified participant/team count. Displayed posting dates include two November 4 messages; the posting timezone and exact capture times remain unknown. Organizer agreement to the remote approach is user-reported, with its exact scope not independently verified. The demonstration video is pending and will be recorded later; completed packaging does not establish final eligibility or Devpost submission.

Rebuild the central JSON/CSV/documentation package from the repository root with Node.js 18 or newer:

```sh
node scripts/package-dataset.mjs
```

The script validates source identities and snapshot links, copies the original JSON bytes and refreshes the manifest. It does not create or modify the separately built Excel workbook; rerun it after finalizing the workbook to record its current hash.

## Run

Requires Node.js 18 or newer. From this directory:

```sh
node serve.mjs
```

Open http://127.0.0.1:4173. Do not open `dist/index.html` directly: browsers restrict JSON loading from local file URLs. The app is static and requires no package installation. Optional Google Fonts fall back to system fonts if unavailable.

## Use

- The creator-style presentation introduces **Ctr_.Alt_Defeat / Participant Pulse** with oversized silver typography, a kinetic sculpture, two rows of challenge artwork, an about section, contrasting light findings and three story cards that stack on scroll. “Explore the pulse” scrolls to the findings; section navigation also reaches the complete data workbench. See [design notes](docs/DESIGN_NOTES.md) for references and publication status.
- The challenge gallery contains eight original animated SVG scenes with counts from the loaded records. Selecting a gallery tile opens its challenge in the message explorer. Story cards follow the overview's selected sample and open clarification, strategy/progress/collaboration or participation evidence. Examples are labeled paraphrases. Artwork and editorial interpretation never represent participant footage, measured emotion, a live feed or competitive rankings. The motion control and reduced-motion preference preserve access to the data; no paid animation library or media subscription is required.

- Overview includes eight equal-size challenge nodes. Select a node or use the challenge selector to filter the observed sample. Missing channels display “No sample”; node size does not imply popularity. The pulse animation is decorative, not a live feed. Pause it with the motion control; the app also honors the device’s reduced-motion preference while keeping all content visible.
- Click a content-category bar or a thematic question to open its matching evidence. Category shares always use the selected message sample as their denominator. The overview counts coded help, rules, logistics, score and leaderboard discussion, including both questions and explanations; its suggested next step follows the strongest available actionable theme in that selected sample.
- Message explorer combines challenge, category, paraphrase search, snapshot, author-role and content-lens filters. Snapshot choices follow the selected challenge and use the recorded snapshot labels. Click a displayed-hour group to narrow the view, or reset the filters. The hour groups contain only sampled messages and are not a complete time series or an activity-rate calculation.
- Inspect a message to open its paraphrase, source link, display time, alias, role evidence, collection/coding provenance and authoritative snapshot membership. Where present, reaction counts are labeled as the latest recorded reaction reading, with their observation date and snapshot; they are not unique-reactor counts or counts as of every earlier snapshot. Original Discord links require server access.
- Coverage & method distinguishes partial samples from unread channels, shows the dates and times of the sampled messages without implying continuous coverage, explains deduplication and documents the written collection requirement alongside the user-reported organizer exception.
- Explore a scenario computes `min(3, N) / N` for a manually assumed entrant count. It is an equal-chance thought experiment, not a winning probability forecast.
- Export message JSON, message CSV and coverage JSON. Exports include all loaded records, regardless of current filters. JSON preserves the full normalized message schema and is the supported import/transfer format; CSV provides the core analytical fields plus role, snapshot and reaction fields.
- Import another coded-message JSON file to merge records by exact string message ID. The result reports added, enriched and unchanged records. Imports remain in this browser’s localStorage on this device; they are not synchronized to another device or the hosted source files. Export JSON to transfer them.

## Data and provenance

`dist/data/catalog.json` is public official challenge metadata. `discord-observations.json` is the per-channel coverage inventory. `discord-message-coding.json` contains aliases, paraphrased coded messages and a bundled `snapshots` inventory. See [Discord methodology](docs/DISCORD_METHODOLOGY.md), [metric dictionary](docs/METRIC_DICTIONARY.md) and [challenge review](docs/CHALLENGE_REVIEW.md).

No participant names, verified team/entrant counts, mental-health interpretations or fabricated observations are added to the observed dataset. Displayed posting timezones were not verified. No messages-per-hour calculation or cross-channel ranking is made because the observation windows are incomplete and unequal. Author roles are labeled only when explicit evidence is recorded; quoting or replying to an organizer does not establish the author’s role. Display-label aliases and counts are scoped to one channel’s observations and are never combined into a cross-channel person or team count. The sample does not claim to exclude staff or bots.

Reaction readings are recorded only where observed. Missing reaction fields mean unmeasured, not zero. The current reaction reading is separate from the posting timestamp and initial observation. Sources and coding limitations remain attached to the records.

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

Supported categories: `social_banter`, `strategy_discussion`, `progress_report`, `collaboration`, `unclassified_media`, `leaderboard_request`, `score_request`, `help_request`, `rule_clarification`, `logistics_request`, `organizer_update`, `participation_confirmation`, `other`. Only categories represented by the loaded observations contribute to the charts. Supporting a category in the application is not evidence that it was observed.

Message IDs are deduplicated. Matching IDs with conflicting challenge, coding/content, alias, posting time, source URL, timezone or reply metadata reject the import. Compatible duplicates can enrich snapshot membership, missing provenance, an unknown author role or human-review status without adding another message.

A known reaction reading can enrich a missing reading. A later observation date in the same timezone replaces the whole earlier reaction-provenance bundle; older incoming readings do not replace the current reading. Different known counts on the same observation date, or readings with incompatible observation timezones, reject the merge because ordering is not established.

Imported samples remain partial. The app withholds combined display-label counts, time ranges, concentration measures and reaction aggregates for affected channels rather than reusing stale bundled values. Per-message evidence remains inspectable. Export metadata identifies mixed bundled/imported records and preserves the original bundled metadata separately.

Participation-confirmation records may include `reported_team_alias` and `reported_team_alias_scope`. These preserve anonymous labels explicitly reported in the messages. The participation lens counts posts. Distinct labels are shown only after selecting one channel and only within a consistent reported-label scope; they are not verified teams, entrants, memberships or valid submissions. A missing label does not mean nonparticipation.

## Validation

```sh
npm test
```

The creator presentation passed all **31 tests** on November 8, 2026. Checks cover sample reconciliation, snapshot membership, duplicate enrichment, reaction ordering, role evidence, import validation, CSV escaping, scenario bounds, theme/lens filters, scoped participation labels, missing-data handling and DOM targets. Creator tests also verify the full and HEB-filtered story counts, exact source-record membership, empty-sample denominators, unchanged inputs and separation of synthetic data. Historical reel geometry tests remain in the suite; the old reel is not mounted in the current page.

Browser review at **1440 × 1000** and **390 × 844** found no horizontal overflow. The chrome-like hero sculpture fits the desktop viewport; the about section, white findings and story cards remain readable, with mobile story cards in normal document flow. Selecting HEB produced findings of **11, 2 and 11 out of 30** messages. Its building story opened two explorer records and the message inspector; the all-challenge clarification story contained **41 out of 140** messages. Pausing stopped SVG animation and kept all text and cards visible. The separate Simulation panel showed nine fictional teams and 21 allocations, while 30 assumed entrants produced a 10% hypothetical scenario baseline. No browser console errors were observed during these checks.

Gallery checks confirmed that the first click on Rev's Casino opened its 10-message sample at both 390- and 1440-pixel widths; keyboard Enter on Dashboard Royale opened the correct challenge. At widths up to 900 pixels, the gallery uses native horizontal scrolling while SVG artwork animates; desktop rows translate in opposite directions. Native operating-system reduced motion was not separately emulated, and these checks do not establish exhaustive browser coverage. The original Sites project still returned `NOT_FOUND` during this update; local browser checks do not establish publication to that hosted URL.

## Separate synthetic scenario

The Simulation panel loads `simulated-teams.json` and `simulated-team-challenges.json`. It contains nine fictional four-person teams and illustrative challenge allocations, difficulty and prize-influence inputs. No teams were contacted. All records preserve `source_type: synthetic`, `is_observed: false` and `scenario_only: true`. Synthetic rows are not imported into the observed-message dataset. The observed and simulated panels use separate data files and separate exports. See [simulation methodology](docs/SIMULATION_METHODOLOGY.md).

Regenerate the fixed illustrative scenario with `node scripts/generate-simulation.mjs`. Each fictional team has two or three challenge rows. This generator never reads Discord observations and cannot turn synthetic data into observations.
