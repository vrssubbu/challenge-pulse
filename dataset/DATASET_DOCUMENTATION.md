# Participant Pulse — Dataset documentation

**Team:** CTRL_ALT_DEFEAT

**Event:** TAMU Datathon 2026

**Documentation date:** November 8, 2026

**Companion files:** [Excel workbook](Participant_Pulse_Dataset.xlsx) · [Dataset index](README.md) · [Full field dictionary](DATA_DICTIONARY.csv)

Participant Pulse makes a recorded sample of challenge discussions inspectable: readers can move from a count or content category to the underlying paraphrased messages, collection snapshots and source references. The observed dataset contains **140 unique messages from eight challenge channels, recorded in 11 observation snapshots**. Its **150 snapshot–message associations include 10 repeat sightings**, not 150 different messages.

This document addresses the seven documentation topics in point 5 of the [Build Your Own Dataset participant guide](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit). The labels **5.1–5.7 below are this document’s navigation**, not official guide subsection numbers. A short point 6 publication map follows them.

The collection was remote observation of Discord through an authorized browser interface. The written guide calls for physical-world primary collection; the user reports organizer agreement to this remote approach. The precise exception and publication permissions have not been independently verified. This document describes what was actually collected and does not assert final eligibility. [Recorded requirements and status](ELIGIBILITY.md).

## 5.1 Location and context

The source setting was the TAMU Datathon Discord server’s eight challenge channels: Rev’s Casino, Dashboard Royale, Build-A-Dataset, House Edge, Heads Up, Hitachi, H-E-B and Databricks. Channel provenance is retained in the [coverage inventory](observed/discord-observations.json); message-level source URLs are retained in the [message dataset](observed/discord-message-coding.json).

The unit being observed was a visible message, including questions, explanations, progress claims, collaboration invitations and social conversation. The analytical population is **the loaded, inspected message sample**, not all event attendees or all messages in those channels. Author roles were not verified, so the sample must not be described as exclusively participant-authored.

The project asks what topics appear in the available discussion and which records support those findings. Official challenge descriptions provide separate context in [context/catalog.json](context/catalog.json). They do not supply observed participant counts. The illustrative team scenario is stored separately under [synthetic/](synthetic/) and does not contribute to observed findings.

No physical venue measurements, in-person interviews, survey responses or team contacts are claimed for this collection.

## 5.2 Collection method

The assistant read visible content through an **authorized native Chrome Discord interface** and transcribed analytical records: exact message identifiers, rendered dates and times, source references, channel-scoped display-label aliases and concise paraphrases. Collection provenance remains attached to each record through `collector`, `collection_method`, `coding_method`, `identity_unit` and `source_type`.

The acquisition produced bounded loaded samples rather than a random sample or a channel census. An initial Rev’s Casino sample was later reread; other channels and additional House Edge and H-E-B batches were acquired as access permitted. Earlier blocked navigation is retained in historical notes. Later successful acquisition accounts for all eight channels in the current inventory; it does not establish complete histories or comparable observation windows.

Each message received one content category through **AI-assisted, single-assistant qualitative coding** of the content actually read. Every current `human_reviewed` value is `false`: no independent human review, second-coder agreement rate or inter-rater reliability result is recorded. All `author_role` values remain `unknown`, with null `role_evidence`. Confident wording, quoted organizer text and display names were not treated as proof of authority.

Unassessed image content remains `unclassified_media`. Statements about scores or progress remain self-reports or banter; the collection did not verify their outcomes. Reply relationships were recorded where explicit parent references were available. A nearby message was not automatically treated as a reply, answer or resolution.

The detailed [collection and coding method](METHOD.md) and [original Discord methodology](../docs/DISCORD_METHODOLOGY.md) distinguish this completed acquisition from recommendations for a future collection with common windows, precise capture timestamps and independent review.

## 5.3 Timing

**Collection dates:** November 7–8, 2026, recorded in `America/Chicago`. Exact capture times were not recorded.

**Displayed message dates:** November 4–8, 2026. The timezone of Discord’s displayed posting timestamps was not verified.

Collection dates describe when source material was read. Displayed dates and times describe what the interface showed for the messages. These are different quantities: the collection timezone must not be used to turn the displayed posting times into UTC timestamps. Message `timezone` and `captured_at` remain null; no precise capture time has been reconstructed.

| Channel | Earliest displayed message | Latest displayed message |
| --- | --- | --- |
| Rev’s Casino | Nov 7, 22:47 | Nov 7, 23:22 |
| Dashboard Royale | Nov 4, 22:31 | Nov 7, 16:52 |
| Build-A-Dataset | Nov 4, 23:57 | Nov 7, 12:37 |
| House Edge | Nov 7, 19:38 | Nov 7, 23:31 |
| Heads Up | Nov 7, 21:03 | Nov 8, 00:38 |
| Hitachi | Nov 7, 10:41 | Nov 8, 00:36 |
| H-E-B | Nov 7, 14:58 | Nov 7, 23:49 |
| Databricks | Nov 7, 09:03 | Nov 7, 20:54 |

All dates in this table are in 2026; their posting timezone is unverified. The endpoints are the first and last sampled messages, **not evidence of continuous coverage between them**. Dashboard Royale and Build-A-Dataset each include one November 4 post. A channel-start marker was seen for those two channels, but full history and thread coverage were not established. No complete observation window or messages-per-hour rate is asserted.

The [snapshot table](observed/snapshots.csv) retains observation dates, method, coverage notes and displayed endpoints separately. A reaction reading has its own observation date and snapshot; it is not backdated to a message’s posting time or earlier sighting.

## 5.4 Sample size and coverage

| Challenge-channel sample | Unique messages | Snapshots | Coverage |
| --- | ---: | ---: | --- |
| Rev’s Casino | 10 | 2 | Partial |
| Dashboard Royale | 9 | 1 | Partial |
| Build-A-Dataset | 11 | 1 | Partial |
| House Edge | 30 | 2 | Partial |
| Heads Up | 30 | 1 | Partial |
| Hitachi | 10 | 1 | Partial |
| H-E-B | 30 | 2 | Partial |
| Databricks | 10 | 1 | Partial |
| **Total** | **140** | **11** | **All partial** |

The same ten Rev’s Casino messages appear in two snapshots. Deduplication keeps **140 unique message rows** while the bridge preserves **150 memberships**: 140 first memberships plus 10 repeat sightings. Adding snapshot sizes without deduplicating message IDs would overcount the sample. The snapshot inventories embedded in the two observed JSON files are identical; they must not be appended together.

Supporting observations have narrower scope:

- **Replies:** 25 recorded non-null parent IDs, all present among the 140 messages. The other 115 rows have no recorded parent reference; that does not establish that no reply relationship existed.
- **Reactions:** two messages have inspected readings, of 15 and 1 reaction events. The other 138 messages are unmeasured. The sum of 16 is only the sum of those two readings, not a complete reaction total or a count of unique reactors.
- **Participation labels:** 11 H-E-B participation self-report posts contain nine distinct reported labels within `heb-channel-20261108`. These are scoped self-reports, not nine verified teams, entrants or submissions.

Unequal sample sizes and displayed spans reflect acquisition coverage. They do not support a cross-challenge popularity ranking, an event-wide participant total or a measure of competition.

## 5.5 Fields, table units and joins

The [Excel workbook](Participant_Pulse_Dataset.xlsx) is the review-friendly companion. The original JSON files remain authoritative for metadata, source types, nested structures, explicit nulls and missing properties. [DATA_DICTIONARY.csv](DATA_DICTIONARY.csv) provides definitions and observed presence/type/null profiles for **135 fields across eight analytical tables**.

| Table or file | Record unit | Rows | Role |
| --- | --- | ---: | --- |
| [Messages](observed/discord-message-coding.csv) | One unique `message_id`; all 30 source fields | 140 | Observed records |
| [Coverage](observed/discord-observations.csv) | One `challenge_id`; 35 source fields | 8 | Partial channel summaries |
| [Snapshots](observed/snapshots.csv) | One `snapshot_id`; 18 source fields | 11 | Recorded observation sessions |
| [Snapshot links](observed/snapshot-message-links.csv) | One `(snapshot_id, message_id)` membership | 150 | Authoritative repeated-sighting bridge |
| [Category codebook](observed/category-codebook.csv) | One observed category and definition | 12 | Coding reference and counts |
| [Challenge catalog](context/catalog.csv) | One official `challenge_id` | 8 | External contextual metadata |
| [Synthetic teams](synthetic/simulated-teams.csv) | One fictional `team_id` | 9 | Separate scenario |
| [Synthetic allocations](synthetic/simulated-team-challenges.csv) | One fictional team/challenge selection | 21 | Separate scenario |

### Message field dictionary

“Null” below means the source explicitly records an unknown or unmeasured value. Types describe this packaged dataset; they are not instructions to replace unknown values with defaults.

| Field | Type in current JSON | Definition and current scope |
| --- | --- | --- |
| `message_id` | String | Exact message identifier and primary key. Preserve all digits as text. |
| `challenge_id` | String | Join key for the channel sample and official challenge context. |
| `source_type` | String | `discord_ui_observation` for every observed message. |
| `source_url` | String | Exact message provenance URL; authorized server readers may locate its original author and content. |
| `channel_url` | String | Source channel URL; not evidence of complete coverage. |
| `display_date` | String | Rendered posting date, `YYYY-MM-DD`; distinct from collection date. |
| `display_time` | String | Rendered `HH:mm` time, with no verified posting timezone. |
| `timezone` | Null | Displayed posting timezone is unknown for all 140 records. |
| `captured_at` | Null | Exact acquisition timestamp was not recorded for any message. |
| `display_alias` | String | Pseudonymous displayed-label alias scoped to one channel; not a verified person or team identity. |
| `category` | String | One exclusive assistant-assigned content label. |
| `paraphrase` | String | Concise summary of observed content, not a verbatim quote or verification of its claims. |
| `reply_to_message_id` | String or null | Explicit linked parent ID where recorded; 25 known and 115 null. |
| `human_reviewed` | Boolean | `false` for every current record; independent human review is not recorded. |
| `snapshot_ids` | Array of strings | Known observation memberships; additional sightings do not create new messages. |
| `author_role` | String | `unknown` for every current record. |
| `role_evidence` | Null | No verified role evidence is recorded. |
| `reported_team_alias` | String or null | Scoped pseudonym for an explicitly reported team label; present on 11 participation posts, null on 129 rows. |
| `reported_team_alias_scope` | String or null | `heb-channel-20261108` on those 11 posts; limits label matching to that scope. |
| `reaction_count_observed` | Integer or null | Latest inspected reaction-event total: 15 and 1 on two messages; 138 nulls. |
| `reaction_types_observed` | Integer or null | Count of distinct emoji reaction types: 2 and 1 on those readings. Not an array or unique-reactor count. |
| `reaction_observed_on_local` | String or null | Calendar date of reaction inspection; known for two messages. |
| `reaction_observed_timezone` | String or null | Timezone of reaction inspection, not posting time; known values are `America/Chicago`. |
| `reaction_capture_time` | Null | Exact reaction-reading capture time was not recorded. |
| `reaction_snapshot_id` | String or null | Snapshot supporting the current reading; `revs-reread-20261108` on two messages. |
| `collector` | String | `assistant` on every current record. |
| `collection_method` | String | Recorded authorized UI acquisition method. |
| `coding_method` | String | Single-assistant qualitative coding of visible message content. |
| `identity_unit` | String | Description of the channel-scoped displayed-label identity and its limits. |
| `reaction_observation_note` | String or null | Reading-specific interpretation and caveats, present for the two inspected messages. |

Coverage records include deduplicated message/category counts, alias counts, snapshot references and displayed endpoints. Their `participant_count`, `team_count`, `entrant_count`, `messages_per_hour`, exact capture times and complete-window boundaries remain unknown. These fields must not become zero counts.

Snapshot records separate `observed_on_local` and `observation_timezone` from `displayed_start`, `displayed_end` and the unknown posting `timezone`. `message_ids` defines membership. Coverage flags and notes describe the actual inspected material, including limits on channel boundaries and threads.

### Join rules

- Join messages, coverage, snapshots and catalog on `challenge_id`.
- Join the snapshot bridge to messages on the exact text `message_id`, and to snapshots on `snapshot_id`. Its composite key is `(snapshot_id, message_id)`.
- Use `reply_to_message_id` for a nullable message self-join. A linked reply alone is not evidence of help resolution.
- Join synthetic allocations to synthetic teams on `team_id` and to challenge context on `challenge_id`. Do not merge those rows into observed-message counts.
- Match display aliases only within their channel. Match reported team labels only within their explicit alias scope. Neither supports a cross-channel person count.

## 5.6 Processing, cleaning and checks

The processing preserved source evidence while making the records usable in the dashboard and workbook:

1. **Record and pseudonymize.** Replace original displayed names with scoped aliases; summarize content using neutral paraphrases. Preserve source IDs and references for traceability. Claims about scores or participation remain claims.
2. **Deduplicate exact IDs.** Count each `message_id` once. Preserve repeated observations as memberships in the snapshot bridge rather than duplicate message rows.
3. **Apply the content codebook.** Assign one category per message, retaining unknown roles, unassessed media and the lack of independent human review. The package contains 12 observed categories. The application also supports `organizer_update`, but no current message uses it.
4. **Keep unknowns explicit.** Preserve null reaction readings, role evidence, timestamps and unmeasured population fields. No plausible values, complete windows, participant counts or difficulty scores were generated to fill gaps.
5. **Reconcile related tables.** Check unique text IDs, known challenge joins, snapshot membership, matching snapshot inventories and reply-parent references. The retained [source audit](provenance/source-audit.json) reports these structural checks without claiming a second review of the underlying coding.
6. **Package without rewriting originals.** Copy the five source JSON files byte-for-byte from `dist/data/`; derive the CSV views and record SHA-256 hashes in [MANIFEST.json](MANIFEST.json). The [field review](provenance/field-definitions.json) supports dictionary definitions. Packaging collects no additional messages.

The observed category counts reconcile to 140:

| Category | Messages | Category | Messages |
| --- | ---: | --- | ---: |
| `social_banter` | 32 | `rule_clarification` | 32 |
| `other` | 23 | `participation_confirmation` | 11 |
| `strategy_discussion` | 10 | `progress_report` | 8 |
| `collaboration` | 6 | `unclassified_media` | 6 |
| `help_request` | 5 | `logistics_request` | 4 |
| `leaderboard_request` | 2 | `score_request` | 1 |

Three dashboard summaries can be reproduced directly from these labels:

| Summary | Calculation | Full-sample result |
| --- | --- | ---: |
| Help, rules and logistics | `help_request` + `rule_clarification` + `logistics_request` | **41 / 140 = 29.3%** |
| Strategy, progress and collaboration | `strategy_discussion` + `progress_report` + `collaboration` | **24 / 140 = 17.1%** |
| Participation self-report posts | `participation_confirmation` | **11 / 140 = 7.9%** |

The 41-message finding includes questions **and answers or explanations**. It is not a count of 41 unresolved questions, affected people or verified problems. These three themes are selected analytical groupings, not an exhaustive partition of all message categories. Percentages use the unique selected-message count as the denominator; the table above uses all 140 bundled messages.

CSV exports use UTF-8 with quoted fields. Arrays and objects become JSON text inside cells; null and missing values become blanks, while `false`, `0`, `[]` and `{}` retain their meanings. Original JSON distinguishes null from an absent property. **Quoted CSV identifiers can still be rounded by Excel.** Use the supplied workbook, which stores identifiers as text, or import CSV identifier columns as Text before loading. Do not double-click CSVs to preserve 19-digit IDs.

From the repository root, reproduce the package with Node.js 18 or newer:

```sh
node scripts/package-dataset.mjs
```

The workbook is produced separately; this command does not rebuild it. Rerun packaging after finalizing it to include the current workbook hash. Source changes require refreshed audit inputs. See [rebuild instructions](README.md#rebuild-and-verify).

## 5.7 Limitations, privacy and interpretation

**Coverage and selection.** Every channel sample is partial, with unequal loaded material and time spans. Threads, intervening messages, later edits and deletions may be absent. The sample is neither random nor representative of all attendees. It cannot establish channel popularity, complete activity rates, event-wide enthusiasm or a census of teams.

**Coding and identity.** Categories are single-assistant interpretations with no independent human validation. Display labels can change or collide, and all author roles are unknown. The data may include staff or bots. Aliases cannot be converted into verified people, team membership, entrants or valid submissions. Scores, progress and participation statements remain unverified self-reports.

**Timing and outcomes.** Exact capture times and posting timezones are unknown. Sample endpoints do not establish continuous observation. A visible reply is not necessarily an answer, and an answer is not necessarily a resolution. The records do not measure verified organizer response times, help-resolution rates, effort, submission quality or anyone’s likelihood of winning.

**Privacy and publication.** Original handles and verbatim message text are omitted, but message identifiers and Discord source URLs remain. Authorized server readers can follow them to original content and authors. The dataset is therefore **pseudonymized, not guaranteed anonymous**. Authorized access for collection is not by itself evidence of unrestricted republication permission. The user-reported organizer agreement’s exact scope, consent implications and publication conditions have not been independently verified. No blanket privacy clearance is asserted.

**Source separation.** Official challenge facts are externally sourced context. The supplementary scenario contains nine invented four-person teams and 21 fictional team/challenge selections, flagged `source_type: synthetic`, `is_observed: false` and `scenario_only: true`. No people were approached to create it. Its effort and rating values are assumptions, not observations or survey responses; it contributes nothing to the 140-message totals or evidence of collection. See [simulation methodology](../docs/SIMULATION_METHODOLOGY.md).

**Historical metadata.** Original files retain earlier notes about blocked navigation, smaller samples and written-rule project fit. The current package contains all eight partial channel samples; the latest scope and user-reported exception are explained in [README.md](README.md) and [ELIGIBILITY.md](ELIGIBILITY.md). Preserving those source bytes does not make historical notes current findings.

## Point 6 — Repository publication map

Point 6 of the [official guide](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) calls for the dataset, collection documentation, application source and run instructions in GitHub, without publishing private or sensitive information. The repository locations are:

| Deliverable | Local package or repository path | GitHub location |
| --- | --- | --- |
| Dataset and analytical exports | [Dataset index](README.md), `observed/`, `context/`, `synthetic/` | [Central dataset folder](https://github.com/vrssubbu/challenge-pulse/tree/main/dataset) |
| Excel companion | [Participant_Pulse_Dataset.xlsx](Participant_Pulse_Dataset.xlsx) | [Workbook](https://github.com/vrssubbu/challenge-pulse/blob/main/dataset/Participant_Pulse_Dataset.xlsx) |
| Collection documentation | This document and [METHOD.md](METHOD.md) | [Dataset documentation](https://github.com/vrssubbu/challenge-pulse/blob/main/dataset/DATASET_DOCUMENTATION.md), [method](https://github.com/vrssubbu/challenge-pulse/blob/main/dataset/METHOD.md) |
| Definitions and provenance | [DATA_DICTIONARY.csv](DATA_DICTIONARY.csv), [provenance/](provenance/), [MANIFEST.json](MANIFEST.json) | [Dictionary](https://github.com/vrssubbu/challenge-pulse/blob/main/dataset/DATA_DICTIONARY.csv), [provenance](https://github.com/vrssubbu/challenge-pulse/tree/main/dataset/provenance) |
| Application source | [dist/](../dist/) | [Application source](https://github.com/vrssubbu/challenge-pulse/tree/main/dist) |
| Run and verification instructions | [Repository README](../README.md) | [README](https://github.com/vrssubbu/challenge-pulse/blob/main/README.md) |

To run the static application from a repository clone with Node.js 18 or newer:

```sh
node serve.mjs
```

Open `http://127.0.0.1:4173`. No package installation is required. Application validation runs with `npm test`. Do not open `dist/index.html` directly, because browser restrictions prevent its JSON data loading from local file URLs.

The links above identify the deliverables; publication of the final local revision must be checked against the actual pushed GitHub revision. A repository or workbook does not establish permission for every retained identifier, judge acceptance or completed submission. The approximately two-minute video is pending and will be recorded later; Devpost submission and the exact cutoff remain unverified. Current status and the recording outline are maintained in [ELIGIBILITY.md](ELIGIBILITY.md) and [DEMO_OUTLINE.md](DEMO_OUTLINE.md).
