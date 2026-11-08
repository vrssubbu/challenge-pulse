# Discord metric dictionary

Every metric belongs to a stated channel and coverage window. Use null for unavailable values. A measured zero requires a complete observation of the defined unit and window in which no qualifying event occurred.

The current dataset has 140 unique message items from all eight challenge channels, represented in 11 partial observation snapshots. Repeated sightings do not add messages. Channel sample sizes range from nine to thirty and cover different displayed date/time spans; they are not a ranking of event activity. Reaction counts are available for only two messages. H-E-B contains 11 explicit participation self-report posts with nine distinct reported labels in one channel scope. These are not verified entrants. See [the acquisition method](DISCORD_METHODOLOGY.md).

## Current snapshot fields

The files `discord-observations.json` and `discord-message-coding.json` each contain `schema_version`, `metadata`, `snapshots`, and `records`. The latter also contains `coding_scheme`. Exact capture times were not recorded: `captured_at` remains null. Metadata records collection dates, which must not be converted into fabricated precise timestamps.

| Field | Meaning |
| --- | --- |
| `challenge_id` | Stable catalog ID: `revs-casino`, `dashboard-royale`, `build-a-dataset`, `house-edge`, `heads-up`, `hitachi`, `heb`, or `databricks`. |
| `challenge_name` | Official human-readable challenge name. |
| `source_url` | Known channel reference retained for provenance. A known sidebar link alone does not prove its message content was read; `source_url_verification` and coverage describe that distinction. |
| `source_type` | `discord_ui_observation`; never relabel as survey or physical-world observation. |
| `captured_at` | Exact acquisition timestamp if recorded; currently null. |
| `metadata.collection_dates_local` | November 7 and 8, 2026, in America/Chicago: dates of reading, separate from rendered message timestamps. |
| `coverage_status` | All current channels are `partial`. The schema also supports `not_read` for missing evidence. A future complete status requires a defined and verified scope. |
| `coverage_note` | What material was actually inspected and what remains missing. |
| `displayed_date`, `first_displayed_date`, `last_displayed_date`, `first_displayed_time`, `last_displayed_time` | First and last rendered dates/times among inspected messages. `displayed_date` is a single date or a readable date span. They do not establish complete coverage between them. `window_start` and `window_end` remain null because no continuous observation interval is established. |
| `timezone` | Timezone of displayed timestamps; currently null because it was not verified. Metadata `display_timezone_verified` is false. |
| `observed_messages` | Distinct visible message items counted in the sample; null when not read. |
| `distinct_display_labels` | Number of distinct displayed labels, not verified accounts or teams. |
| `display_label_message_counts` | Sample message counts by aliases scoped to one channel. Aliases include A–E in Rev's Casino and channel-prefixed labels elsewhere; they do not establish identity or team membership. |
| `largest_display_label_message_share` | Largest within-channel alias's message count divided by that channel's sampled messages. Rev's Casino is an example: 6/10 = 0.6; other channel values use their own counts and denominators. |
| `concentration_note` | Scope qualification for the concentration metric. |
| `category_counts` | Counts for the exclusive message categories present in that channel sample. The combined dataset contains 12 observed categories, defined in the methodology; each message has exactly one category. |
| `participant_count`, `team_count`, `entrant_count` | All null; these populations have not been measured. |
| `messages_per_hour` | Null because the viewport does not cover a complete interval. |
| `snapshot_ids`, `snapshot_count` | IDs/count of observation sessions for this channel. Two sessions of the same ten messages are not twenty unique messages. |
| `reaction_counted_messages` | Two for Rev's Casino; null in the other channels because reactions were not inspected there. The Rev denominator is ten messages; the full-dataset denominator is 140. |
| `reaction_count_sum_observed` | Sum of the latest inspected emoji counts on the two messages: 16. This is neither unique reactors nor a complete sample/channel reaction total. |
| `participation_report_messages` | Number of messages coded `participation_confirmation` within the inspected channel sample. H-E-B has 11; zero elsewhere means none coded in that sample, not no participation. |
| `reported_team_label_count`, `reported_team_alias_scope` | Distinct reported labels counted only within one explicit channel collection scope. H-E-B has nine in `heb-channel-20261108`; other channels have no recorded team-label count. Not verified team/entrant totals. |
| `participation_coverage_note` | Explains self-report status, duplicate-label grouping and missing verification. |

Each `snapshots` entry has a stable `snapshot_id`, `label`, `challenge_id`, `observed_on_local`, `observation_timezone`, nullable `captured_at`, a deduplicated `message_ids` list, and `observed_messages`. `displayed_start`/`displayed_end` contain rendered message date/time bounds, with `timezone: null` and `timezone_verified: false`. These bounds do not establish uninterrupted observation. `channel_start_seen` is true only for the Dashboard Royale and Build-A-Dataset snapshots; `channel_end_seen` and `threads_inspected` remain false. `coverage_status` remains `partial`; `coverage_note` describes the precise limits.

Future comparable acquisition should add explicit analytical window boundaries, sampling method, thread scope, and gap notes. These are not present as established facts in the initial viewport sample.

## Current message-level fields

| Field | Meaning / allowed interpretation |
| --- | --- |
| `message_id` | Source message ID, used for deduplication. |
| `challenge_id` | Channel's mapped challenge. Cross-channel reposts remain separate source messages, but are not independent participant endorsements. |
| `source_type`, `source_url`, `channel_url` | Online observation type, exact message reference, and channel reference. |
| `display_alias` | Pseudonymous displayed-label alias scoped to one channel, including A–E for Rev's Casino and channel-prefixed aliases elsewhere. This is not a verified unique-person key and must not be combined across channels into a person count. |
| `display_date`, `display_time` | Date/time rendered by the source. |
| `timezone`, `captured_at` | Currently null: display timezone and exact capture time were not verified/recorded. |
| `category` | Exactly one supported content category. The current data uses 12 categories listed in the methodology; `organizer_update` is supported but not assigned. Questions and answers may both be `rule_clarification`. |
| `paraphrase` | Minimal description of the visible message, with names and original wording omitted. |
| `reply_to_message_id` | Explicit parent ID where observed; otherwise null. Null can mean the parent ID was not available, even when quoted reply context was visible. |
| `identity_unit` | Explicit reminder that display labels are not verified accounts, people, or teams. |
| `collector`, `collection_method` | Assistant UI observation, not user fieldwork. |
| `coding_method`, `human_reviewed` | Single-assistant qualitative classification; `human_reviewed` is false. |
| `snapshot_ids` | Packaged observation sessions in which this message was read. The authoritative snapshots list also references the message ID. |
| `author_role`, `role_evidence` | All current authors are `unknown`, with null evidence. A future `organizer` value requires explicit observed role evidence. |
| `reported_team_alias`, `reported_team_alias_scope` | Anonymous label supplied in an explicit participation self-report, plus its channel collection scope. Only H-E-B confirmation posts currently populate these fields; team names and membership are not retained or verified. |
| `reaction_count_observed` | Latest sum of inspected emoji-reaction counts for the message: 15 or 1 on the two inspected messages, null on the other 138. Not unique reactors. |
| `reaction_types_observed` | Number of emoji types contributing to the latest inspected sum: 2 or 1. |
| `reaction_observed_on_local`, `reaction_observed_timezone` | Date/timezone of the reaction reading: November 8, 2026, America/Chicago. This does not verify the timezone of Discord's rendered message times. |
| `reaction_capture_time` | Null because no exact reaction capture timestamp was recorded. |
| `reaction_snapshot_id` | `revs-reread-20261108` for the two reaction readings; null otherwise. Do not attribute these readings to the initial snapshot. |
| `reaction_observation_note` | Explicit explanation of the inspected count and its unit. |

For future collection, reliable author keys, verified roles, normalized timestamps, explicit-content flags, and resolution evidence may be added when supported. They have not been established in the current dataset and must not be inferred from content categories.

## Measured counts and derived metrics

| Metric | Calculation | Conditions and limits |
| --- | --- | --- |
| Observed message count | Number of distinct inspected message keys. | Includes all roles unless labelled otherwise. Do not count quoted parent text or repeat viewports again. |
| Distinct displayed labels | Number of distinct display-label keys within a channel's inspected messages. | Label count only; not verified authors, people, teams, or entrants. Aliases are scoped per channel; cross-channel sums are not unique-person totals. |
| Distinct observed authors | Count of reliable pseudonymous author keys. | Unavailable when only display labels are known. Show unknown-author coverage separately. |
| Participant message count | Messages from verified participant-role authors. | Unknown roles must not be automatically included. Report the role-verification coverage. |
| Messages per hour | Census message count divided by fully covered window duration in hours. | Not valid for an arbitrary viewport or incomplete history. The first-to-last sampled timestamp span is not a fully observed exposure window. |
| Category count | Messages in a given exclusive category. | The 140 rows reconcile to 12 categories; see methodology for counts. These are single-assistant interpretations. `rule_clarification` includes questions and answers; do not label its count as unanswered questions. |
| Category share | Category count divided by all inspected messages in the selected sample, including media items. | Show count and denominator. Sample composition is descriptive; unequal channel acquisition prevents interpreting shares as event-wide participation. |
| Participation self-report posts | Count of `participation_confirmation` messages. | Eleven posts in the H-E-B sample. Repeated posts are messages, not new teams. |
| Distinct reported team labels | Deduplicated `reported_team_alias` within one selected channel and one explicit scope. | Nine labels in H-E-B. Suppress the total across channels or mixed scopes. An unrelated workspace/credits team-name reply is excluded. |
| Explicit difficulty mentions | Count of messages explicitly reporting task difficulty. | Describes messages, not unique teams, severity, or prevalence among all participants. |
| Explicit prize-motivation mentions | Count of messages explicitly linking prizes to interest or challenge choice. | Does not establish a causal prize effect or event-wide motivation. |
| Explicit submission-plan mentions | Count of messages expressing submission plans. | Repeated statements may come from the same team; not a submission count. |
| Help requests with an observed linked reply | Count of coded requests having at least one explicit observed reply. | A reply can be social or nonresolving; do not label this a resolution rate. |
| No reply observed in covered material | Coded requests without an observed linked reply in the available material. | Right-censored and possibly incomplete. Never label simply “unanswered” or “unresolved.” |
| First observed linked-reply latency | Reply timestamp minus request timestamp for the earliest linked reply observed. | Requires compatible verified timestamps. Show valid pair count and whether complete intervening history was covered. |
| Explicitly observed resolutions | Requests with linked, explicit resolution evidence. | Missing resolution evidence is unknown, not a negative outcome. |
| Reactions observed | Sum of inspected emoji reaction counts on a message at the stated reading date. | Current values are 15 and 1 for two messages; other values are unknown. Reactions may overlap across authors, emoji, and messages and can change. Not votes, unique people, or a growth/velocity measure. |

## Comparison rules

Use the same windows, acquisition method, and role treatment before interpreting channel volume comparisons. Show coverage beside each chart. The current eight channel samples have different spans and sizes: users may inspect their observed composition, but cannot infer a popularity, difficulty, competition or activity-rate ranking. Do not sort missing values as if they were low activity.

Multiple posts by one author are legitimate message activity but are not independent votes of interest. A channel dominated by banter, help, organizer updates, or a few frequent posters can have high volume without more competitors. No single weighted “competition score” is validated by this dataset.

## Hypothetical top-three calculator

If retained, label the input `assumed entrants N` and the output `equal-chance scenario`. For positive integer N, the baseline is `min(3, N) / N`. The calculation assumes equally likely entrants and up to three places; it is not fitted to Discord or a personal prediction. Do not feed message counts or distinct display labels into N as measured team counts.

