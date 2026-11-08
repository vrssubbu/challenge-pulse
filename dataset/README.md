# Participant Pulse dataset

This is the central data package for the Challenge Pulse application: **140 unique observed Discord messages, 8 challenge-channel samples, 11 observation snapshots and 150 snapshot–message links**. It also contains official challenge context and a **separate synthetic scenario of 9 fictional teams and 21 fictional team–challenge allocations**. No teams were contacted to create the scenario.

The original five JSON files are copied byte-for-byte from the application’s `dist/data/` directory. CSV files are derived analytical views. Original JSON remains authoritative for exact types, null versus missing properties, metadata and nested structures.

## Start here

- [Participant_Pulse_Dataset.xlsx](Participant_Pulse_Dataset.xlsx) is the included companion workbook, with separate sheets for observations, context, provenance and synthetic scenarios.
- [METHOD.md](METHOD.md) explains acquisition, coding, processing and limitations.
- [DATA_DICTIONARY.csv](DATA_DICTIONARY.csv) describes all 135 fields across the eight analytical tables, including field presence, nulls and actual source types.
- [ELIGIBILITY.md](ELIGIBILITY.md) records written requirements, the user-reported organizer exception and outstanding submission status.
- [DEMO_OUTLINE.md](DEMO_OUTLINE.md) is a roughly two-minute recording outline. **Video: pending; the user will record it later.**
- [MANIFEST.json](MANIFEST.json) records original-source hashes, packaged-file hashes and table counts.

## Files and record units

| Path | Rows | Unit / classification |
| --- | ---: | --- |
| `observed/discord-message-coding.json` and `.csv` | 140 | One unique observed message; 30 original fields |
| `observed/discord-observations.json` and `.csv` | 8 | One partial channel coverage summary; 35 original fields |
| `observed/snapshots.csv` | 11 | One recorded observation snapshot; 18 original fields |
| `observed/snapshot-message-links.csv` | 150 | One authoritative snapshot/message membership |
| `observed/category-codebook.csv` | 12 | Category, source definition and observed-message count |
| `context/catalog.json` and `.csv` | 8 | Official contextual challenge metadata |
| `synthetic/simulated-teams.json` and `.csv` | 9 | Fictional four-person scenario team |
| `synthetic/simulated-team-challenges.json` and `.csv` | 21 | Fictional team/challenge selection and allocation |
| `provenance/` | — | Independent source audit, original field definitions and requirements review |

The JSON files contain metadata beyond their tabular record collections. The message and coverage JSON files each contain the same snapshot inventory. Use either inventory once; do not append them together.

## Scope

| Channel | Unique messages | Snapshots | Coverage |
| --- | ---: | ---: | --- |
| Rev's Casino | 10 | 2 | partial |
| Dashboard Royale | 9 | 1 | partial |
| Build-A-Dataset | 11 | 1 | partial |
| House Edge | 30 | 2 | partial |
| Heads Up – Poker Bot Tournament | 30 | 1 | partial |
| Hitachi: Hack the Highway | 10 | 1 | partial |
| HEB Challenge | 30 | 2 | partial |
| Best Use of Databricks | 10 | 1 | partial |

Collection dates were November 7–8, 2026 in America/Chicago. Displayed posting dates range from November 4 to November 8; two messages are dated November 4. The posting timezone is unverified. Collection dates must not be used to localize posting times. No exact capture times or complete observation windows were recorded.

Ten Rev’s Casino messages were sighted twice, producing 10 extra memberships. **150 links are not 150 messages.** Sample sizes reflect unequal acquisition coverage, not popularity, entrants or activity rates. Every author role is unknown and every `human_reviewed` value is false. Aliases apply only within one channel. H-E-B’s eleven participation posts contain nine self-reported labels; these are not nine verified teams or entrants.

## Joins

- `Messages.message_id` is a text primary key. `Snapshots.snapshot_id` is a text primary key.
- The bridge key is `(snapshot_id, message_id)`; it joins the authoritative snapshot membership to unique messages.
- Join messages, coverage, snapshots and official challenge context on `challenge_id`.
- `reply_to_message_id` supports a nullable message self-join. All 25 currently recorded non-null parents exist in this sample; a null parent does not establish absence of a reply relationship.
- Synthetic selections join synthetic teams on `team_id` and official context on `challenge_id`. Keep them out of observed-message totals.

## CSV and Excel import

CSV uses UTF-8, a header row, comma separators, CRLF record endings and double-quote escaping. Every cell is quoted, including IDs. **Quoting does not stop Excel from rounding 19-digit Discord IDs.** In Excel use Data → From Text/CSV → Transform Data, disable automatic type detection or remove the inferred Changed Type step, then set all identifier columns to **Text before loading**. Opening a CSV by double-clicking is unsafe for these IDs. The companion workbook stores identifiers as text.

Null and missing values export as blank cells; explicit `false`, zero, empty arrays and empty objects remain `false`, `0`, `[]` and `{}`. Use the original JSON plus dictionary to distinguish null, absent properties and any empty strings. Objects and arrays are serialized as JSON text inside the CSV field, preserving their contents. Displayed dates/times are literal source text. `reaction_types_observed` is a nullable integer count, not an array.

## Provenance and limits

Messages use scoped aliases and paraphrases, with no original handles or verbatim quotes. Message IDs and source URLs remain for traceability and can reveal originals to authorized Discord server members. This is a **pseudonymized derivative, not guaranteed anonymity**. Source links require access to the original server.

Only two messages have inspected reaction readings (1 and 15); the other 138 remain unmeasured. The sum of 16 is neither a dataset-wide reaction total nor unique reactors. Categories are single-assistant interpretations of message content, not independently verified emotions, outcomes or participant characteristics.

The written guide requires physical-world collection. The user reaffirmed that organizers agreed to this remote-observation approach. That agreement is recorded as **user-reported**, with no independent verification of its exact scope or publication conditions. No blanket compliance or final submission is claimed.

Preserved historical source notes may describe earlier states: the Rev reread’s blocked navigation occurred before later acquisition of all eight channels; synthetic metadata mentions an earlier ten-message dataset; the catalog’s project-fit sentence evaluates the written rule without the later reaffirmed exception. These source bytes are intentionally unchanged. The current package scope and eligibility status are documented here and in [ELIGIBILITY.md](ELIGIBILITY.md).

## Rebuild and verify

From the repository root, with Node.js 18 or newer:

```sh
node scripts/package-dataset.mjs
```

The script validates record identities and snapshot links, copies the five originals without reserializing them, rebuilds the named CSV/documentation files and refreshes the SHA-256 manifest. It writes only controlled paths and deletes nothing. Retained review inputs under `provenance/` allow regeneration from a repository clone; a local `../outputs/dataset-package-work/` review overrides those inputs when present. A changed source inventory requires a refreshed audit. Rerun after the workbook is finalized to include its current hash. The manifest excludes itself.

Application run instructions are in the [repository README](../README.md). Requirements were reviewed on 2026-11-08; no new source messages were collected during this packaging step.
