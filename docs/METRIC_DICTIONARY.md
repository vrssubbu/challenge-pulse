# Discord metric dictionary

Every metric belongs to a stated channel and coverage window. Use null for unavailable values. A measured zero requires a complete observation of the defined unit and window in which no qualifying event occurred.

The current dataset is a Rev's Casino viewport sample of 10 unique visible message items and five distinct display labels. It is not sufficient for an event-wide activity comparison. All metrics for the seven unobserved channels are unavailable. See [the acquisition method](DISCORD_METHODOLOGY.md).

## Current snapshot fields

The files `discord-observations.json` and `discord-message-coding.json` each contain `schema_version`, `metadata`, and `records`. The latter also contains `coding_scheme`. Exact capture times were not recorded: `captured_at` remains null, while metadata preserves the explicitly approximate observation-session range. Never replace that range with a fabricated precise timestamp.

| Field | Meaning |
| --- | --- |
| `challenge_id` | Stable catalog ID: `revs-casino`, `dashboard-royale`, `build-a-dataset`, `house-edge`, `heads-up`, `hitachi`, `heb`, or `databricks`. |
| `challenge_name` | Official human-readable challenge name. |
| `source_url` | Observed channel reference retained for provenance; null for channels not read. |
| `source_type` | `discord_ui_observation`; never relabel as survey or physical-world observation. |
| `captured_at` | Exact acquisition timestamp if recorded; currently null. |
| `metadata.observation_session_approximate_utc` | Explicitly approximate observation-session range; not a precise capture timestamp. |
| `coverage_status` | Current values are `not_read` or `partial`. A future complete status requires a defined and verified scope. |
| `coverage_note` | What material was actually inspected and what remains missing. |
| `displayed_date`, `first_displayed_time`, `last_displayed_time` | Date and first/last times rendered among the inspected messages. They do not establish complete coverage between them. |
| `timezone` | Timezone of displayed timestamps; currently null because it was not verified. Metadata `display_timezone_verified` is false. |
| `observed_messages` | Distinct visible message items counted in the sample; null when not read. |
| `distinct_display_labels` | Number of distinct displayed labels, not verified accounts or teams. |
| `display_label_message_counts` | Sample message counts by aliases A–E; not identity or team membership. |
| `largest_display_label_message_share` | Largest alias's message count divided by sampled messages: currently 6/10 = 0.6. |
| `concentration_note` | Scope qualification for the concentration metric. |
| `category_counts` | Counts using the six exclusive categories below. |
| `participant_count`, `team_count`, `entrant_count` | All null; these populations have not been measured. |
| `messages_per_hour` | Null because the viewport does not cover a complete interval. |

Future comparable acquisition should add explicit analytical window boundaries, sampling method, thread scope, and gap notes. These are not present as established facts in the initial viewport sample.

## Current message-level fields

| Field | Meaning / allowed interpretation |
| --- | --- |
| `message_id` | Source message ID, used for deduplication. |
| `challenge_id` | Channel's mapped challenge. Cross-channel reposts remain separate source messages, but are not independent participant endorsements. |
| `source_type`, `source_url`, `channel_url` | Online observation type, exact message reference, and channel reference. |
| `display_alias` | A–E distinguish displayed labels within this sample. This is not a verified unique-person key. |
| `display_date`, `display_time` | Date/time rendered by the source. |
| `timezone`, `captured_at` | Currently null: display timezone and exact capture time were not verified/recorded. |
| `category` | Exactly one of `social_banter`, `strategy_discussion`, `progress_report`, `collaboration`, `unclassified_media`, or `leaderboard_request`. |
| `paraphrase` | Minimal description of the visible message, with names and original wording omitted. |
| `reply_to_message_id` | Explicit parent ID where observed; otherwise null. One known parent link is present. Null can mean the parent ID was not available. |
| `identity_unit` | Explicit reminder that display labels are not verified accounts, people, or teams. |
| `collector`, `collection_method` | Assistant UI observation, not user fieldwork. |
| `coding_method`, `human_reviewed` | Single-assistant qualitative classification; `human_reviewed` is false. |

For future collection, reliable author keys, verified roles, normalized timestamps, explicit-content flags, and resolution evidence may be added when supported. They have not been measured in the current dataset and must not be inferred from the six categories.

## Measured counts and derived metrics

| Metric | Calculation | Conditions and limits |
| --- | --- | --- |
| Observed message count | Number of distinct inspected message keys. | Includes all roles unless labelled otherwise. Do not count quoted parent text or repeat viewports again. |
| Distinct displayed labels | Number of distinct display-label keys in inspected messages. | Label count only; not verified authors, people, teams, or entrants. The current sample supports five labels. |
| Distinct observed authors | Count of reliable pseudonymous author keys. | Unavailable when only display labels are known. Show unknown-author coverage separately. |
| Participant message count | Messages from verified participant-role authors. | Unknown roles must not be automatically included. Report the role-verification coverage. |
| Messages per hour | Census message count divided by fully covered window duration in hours. | Not valid for an arbitrary viewport or incomplete history. The first-to-last sampled timestamp span is not a fully observed exposure window. |
| Category count | Messages in a given exclusive category. | Current counts: social_banter 4; strategy_discussion 1; progress_report 1; collaboration 1; unclassified_media 1; leaderboard_request 2. These are single-assistant interpretations. |
| Intent share | Intent count divided by all inspected messages, including unclassified items as a visible category. | Show count and denominator. If using only classified messages, label that changed denominator explicitly. |
| Explicit difficulty mentions | Count of messages explicitly reporting task difficulty. | Describes messages, not unique teams, severity, or prevalence among all participants. |
| Explicit prize-motivation mentions | Count of messages explicitly linking prizes to interest or challenge choice. | Does not establish a causal prize effect or event-wide motivation. |
| Explicit submission-plan mentions | Count of messages expressing submission plans. | Repeated statements may come from the same team; not a submission count. |
| Help requests with an observed linked reply | Count of coded requests having at least one explicit observed reply. | A reply can be social or nonresolving; do not label this a resolution rate. |
| No reply observed in covered material | Coded requests without an observed linked reply in the available material. | Right-censored and possibly incomplete. Never label simply “unanswered” or “unresolved.” |
| First observed linked-reply latency | Reply timestamp minus request timestamp for the earliest linked reply observed. | Requires compatible verified timestamps. Show valid pair count and whether complete intervening history was covered. |
| Explicitly observed resolutions | Requests with linked, explicit resolution evidence. | Missing resolution evidence is unknown, not a negative outcome. |
| Reactions observed | Reaction counts visible on a message at capture time. | Optional snapshot measure only; reactions may overlap across authors and messages and can change. Not votes or people counts. |

## Comparison rules

Use the same windows, acquisition method, and role treatment before comparing channels. Show coverage beside each chart. Do not sort missing values to the bottom as if they were low activity. With only the current Rev's sample, present its observations as a case study and leave cross-channel comparisons unavailable.

Multiple posts by one author are legitimate message activity but are not independent votes of interest. A channel dominated by banter, help, organizer updates, or a few frequent posters can have high volume without more competitors. No single weighted “competition score” is validated by this dataset.

## Hypothetical top-three calculator

If retained, label the input `assumed entrants N` and the output `equal-chance scenario`. For positive integer N, the baseline is `min(3, N) / N`. The calculation assumes equally likely entrants and up to three places; it is not fitted to Discord or a personal prediction. Do not feed message counts or distinct display labels into N as measured team counts.

