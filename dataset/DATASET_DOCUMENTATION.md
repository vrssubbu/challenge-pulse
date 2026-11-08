# Participant Pulse — Dataset documentation

**Team: CTRL_ALT_DEFEAT** · TAMU Datathon 2026 · November 8, 2026

[Excel workbook](Participant_Pulse_Dataset.xlsx) · [Verified package contents](VERIFIED_CONTENTS.md) · [Field dictionary](DATA_DICTIONARY.csv)

Participant Pulse connects findings about observed challenge discussions to their source records. This package contains **140 unique messages across eight challenge channels, 11 observation snapshots and 150 snapshot–message associations**. The associations include ten repeat sightings; they are not 150 different messages. The website, workbook and analytical exports use the same bundled observations.

The seven sections below document collection, processing and interpretation.

## 1. Collection location and context

The source was the TAMU Datathon Discord server’s eight challenge channels. The assistant observed visible discussions remotely through an authorized browser interface. This was online observation, not an in-person survey or physical measurement.

The unit of analysis is a **message in the inspected sample**. Questions, explanations, progress claims, collaboration invitations and social conversation provide context about the discussions. The sample does not represent every attendee or all channel activity. Official challenge descriptions are stored separately as contextual metadata.

## 2. Collection and coding method

The assistant read visible content in the authorized native Chrome interface and recorded exact message IDs, rendered dates and times, source references, channel-scoped display-label aliases and neutral paraphrases. Collection used bounded loaded samples rather than random selection or a channel census. Additional batches and a Rev’s Casino reread were retained as separate snapshots.

Each message received one content category through **AI-assisted, single-assistant qualitative coding**. All 140 records have `human_reviewed: false`; no independent human review or second-coder agreement measurement is recorded. All author roles remain `unknown`, with no verified role evidence.

Unassessed media remains unclassified. Reported scores and progress remain self-reports. Reply references were retained where explicit parent IDs were available; a nearby message was not automatically treated as a reply or resolution. The [detailed method](METHOD.md) explains the coding rules.

## 3. Timing

Collection occurred on **November 7–8, 2026**, recorded in `America/Chicago`. Exact capture times were not recorded. Displayed posting dates range from **November 4–8, 2026**, and their timezone was not verified. Dashboard Royale and Build-A-Dataset each include one November 4 post.

Collection dates and displayed posting dates are separate fields. The collection timezone cannot establish the posting timezone. Exact capture timestamps and posting timezones remain null. The first and last sampled messages describe displayed endpoints, not continuous coverage between them. Reaction observations retain their own observation date and snapshot.

## 4. Sample size and coverage

| Channel | Unique messages | Snapshots |
| --- | ---: | ---: |
| Rev’s Casino | 10 | 2 |
| Dashboard Royale | 9 | 1 |
| Build-A-Dataset | 11 | 1 |
| House Edge | 30 | 2 |
| Heads Up | 30 | 1 |
| Hitachi | 10 | 1 |
| H-E-B | 30 | 2 |
| Databricks | 10 | 1 |
| **Total** | **140** | **11** |

All eight samples have **partial coverage**. Ten Rev’s Casino messages were sighted twice. Deduplication retains 140 message rows; the bridge retains 150 memberships, including those ten extra sightings. The snapshot inventories embedded in the two observed JSON files are identical and must not be appended together.

There are 25 recorded reply-parent IDs, all present in the sample. Only two messages have inspected reaction counts, of 15 and 1 events; the other 138 are unmeasured. Eleven H-E-B participation posts contain nine scoped reported labels. These are not verified team or entrant counts.

## 5. Fields, records and joins

The workbook preserves all **30 source message fields** and exact identifiers as text. The [field dictionary](DATA_DICTIONARY.csv) describes all 135 fields across eight analytical tables, including types, presence and null counts. Original JSON remains authoritative for metadata and nested values.

| File/table | Unit | Rows |
| --- | --- | ---: |
| [Messages](observed/discord-message-coding.csv) | Unique `message_id` | 140 |
| [Coverage](observed/discord-observations.csv) | Partial channel summary | 8 |
| [Snapshots](observed/snapshots.csv) | Observation session | 11 |
| [Snapshot links](observed/snapshot-message-links.csv) | Snapshot/message membership | 150 |
| [Category codebook](observed/category-codebook.csv) | Observed category and definition | 12 |
| [Challenge context](context/catalog.csv) | Official challenge record | 8 |
| [Synthetic teams](synthetic/simulated-teams.csv) | Fictional team | 9 |
| [Synthetic allocations](synthetic/simulated-team-challenges.csv) | Fictional team/challenge selection | 21 |

Message fields cover identity and source links, displayed time, alias, category, paraphrase, reply reference, snapshot membership, role/review status, reported labels, reaction readings and collection/coding provenance. Null means unknown or unmeasured, not zero.

Join messages, coverage, snapshots and context on `challenge_id`. Join snapshot links to messages on text `message_id` and to snapshots on `snapshot_id`; the bridge key is `(snapshot_id, message_id)`. `reply_to_message_id` supports a nullable message self-join. Synthetic allocations join synthetic teams on `team_id`; they remain separate from observations. Display aliases match only within their channel, and reported labels only within their explicit scope.

## 6. Cleaning, processing and reproducible findings

Original displayed names were replaced with scoped aliases, and content was paraphrased. Exact IDs support deduplication; repeat sightings remain snapshot associations. Unknown timestamps, reactions, roles and population measures were preserved rather than filled with estimates.

Each message has one of 12 observed categories. The source category counts sum to 140. The three principal website findings are reproducible from those categories:

| Finding | Included categories | Full sample |
| --- | --- | ---: |
| Help, rules and logistics | `help_request`, `rule_clarification`, `logistics_request` | **41 / 140 · 29.3%** |
| Strategy, progress and collaboration | `strategy_discussion`, `progress_report`, `collaboration` | **24 / 140 · 17.1%** |
| Participation self-report posts | `participation_confirmation` | **11 / 140 · 7.9%** |

The 41-message finding includes questions **and explanations**, not 41 unresolved problems. These are selected themes, not an exhaustive category partition. Filtered findings use the selected unique-message sample as their denominator.

Packaging checks exact text IDs, challenge joins, snapshot memberships and reply references. Five original JSON files are copied byte-for-byte from `dist/data/`; CSV views are derived, and file hashes are recorded in [MANIFEST.json](MANIFEST.json).

CSV arrays and objects are serialized as JSON text. Null/missing values become blanks; `false` and zero remain explicit. JSON distinguishes null from missing properties. **Excel can round 19-digit IDs even in quoted CSV.** Use the supplied workbook or import identifier columns as Text before loading.

## 7. Limitations and source separation

Unequal, partial, nonrandom samples cannot establish channel popularity, complete activity rates or event-wide totals. Missing threads, intervening messages, edits and deletions may affect context. Unverified posting timezones and absent capture times prevent precise observation-rate calculations.

Coding reflects one assistant’s interpretation. Unknown author roles mean the sample may include staff or bots. Display labels do not establish unique people or team membership. Replies do not establish resolution; progress claims do not establish valid submissions or judging outcomes. The data does not measure mental health, difficulty ratings, prize motivation or winning probability.

Original handles and verbatim messages are omitted, but message IDs and source URLs remain. Authorized server readers can locate originals and their authors. This is **pseudonymized data, not guaranteed anonymity**.

Official challenge facts are separate external context. The Simulation panel contains **nine fictional teams and 21 fictional allocations**, marked `source_type: synthetic`, `is_observed: false` and `scenario_only: true`. No teams were contacted to produce them. Their invented effort and rating values never contribute to observed findings. The scenario calculator uses a user-supplied hypothetical entrant count, not an inferred actual total.

## Application and local package

The website displays full-sample hero counts, challenge artwork, filtered findings, category charts and an evidence explorer. Selecting a finding opens its messages; the inspector shows paraphrases, source references and provenance. Coverage notes explain the sample. Animation is illustrative and can be paused; it does not represent live activity.

| Resource | Local location |
| --- | --- |
| Excel dataset | [Participant_Pulse_Dataset.xlsx](Participant_Pulse_Dataset.xlsx) |
| Package contents | [VERIFIED_CONTENTS.md](VERIFIED_CONTENTS.md) |
| Definitions and collection detail | [DATA_DICTIONARY.csv](DATA_DICTIONARY.csv), [METHOD.md](METHOD.md) |
| Original records | [observed/](observed/), [context/](context/), [synthetic/](synthetic/) |
| Application source and instructions | [dist/](../dist/), [repository README](../README.md) |

From the repository root, with Node.js 18 or newer:

```sh
node serve.mjs
```

Open `http://127.0.0.1:4173`. No package installation is required. Use the server rather than opening `dist/index.html` directly, because the application loads JSON files. Run application checks with `npm test`.

`node scripts/package-dataset.mjs` rebuilds the JSON/CSV package and refreshes its manifest. The workbook is produced separately; rerun packaging after finalizing it to record its current hash. This document describes the local review package.
