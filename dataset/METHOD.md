# Participant Pulse dataset method

Participant Pulse describes recorded challenge discussions. Its dataset comes from authorized online interface observations, not an in-person survey, an entry list or a verified count of competing teams. Scoped aliases and paraphrases preserve analytical content while the original identifiers retain source traceability. A separate synthetic scenario records no actual contacts or responses. See [verified contents](VERIFIED_CONTENTS.md) for the reconciled package counts.

## What has actually been observed

The dataset contains **140 unique message items across all eight challenge channels**, organized into 11 observation snapshots. Collection occurred through authorized native Chrome UI reading on November 7–8, 2026. Exact capture times were not recorded. The timezone behind Discord's rendered message timestamps has not been independently verified.

| Channel | Observed messages | Within-channel display labels | Displayed message span, timezone unverified |
| --- | ---: | ---: | --- |
| Rev's Casino | 10 | 5 | Nov 7, 22:47–23:22 |
| Dashboard Royale | 9 | 6 | Nov 4, 22:31 to Nov 7, 16:52 |
| Build-A-Dataset | 11 | 6 | Nov 4, 23:57 to Nov 7, 12:37 |
| House Edge | 30 | 15 | Nov 7, 19:38–23:31 |
| Heads Up | 30 | 7 | Nov 7, 21:03 to Nov 8, 00:38 |
| Hitachi | 10 | 5 | Nov 7, 10:41 to Nov 8, 00:36 |
| H-E-B | 30 | 19 | Nov 7, 14:58–23:49 |
| Databricks | 10 | 4 | Nov 7, 09:03–20:54 |

These are bounded loaded samples with unequal spans, not full-channel counts or comparable observation intervals. Display-label counts apply only within a channel; summing them would not yield unique people. Dashboard Royale and Build-A-Dataset include one pre-event November 4 message each. A channel-start marker was seen for those two channels, but complete history and threads were not verified.

The original ten Rev's Casino messages were read twice. Those snapshots are repeated sightings of the same messages, not 20 unique messages or two independent samples. House Edge and H-E-B each have separate earlier and later message batches. No channel has a verified complete observation window, verified team membership, entrant count, or submission outcomes.

During the November 8 Rev reread, reaction counts were inspected on two messages. The 23:22 leaderboard request displayed 12 heavy-plus-sign reactions and three custom-image reactions: 15 reaction events across two emoji types, not 15 unique reactors. The 22:57 collaboration message displayed one custom-image reaction. Reaction counts for the other 138 messages remain unknown. The sum of 16 applies only to those two inspected messages; it is not the total reactions on the dataset or channel. No exact capture time was recorded, so no growth or velocity calculation is made.

Earlier navigation attempts were blocked. A later authorized Chrome session enabled reading the remaining seven channels. Historical snapshot notes preserve the earlier limitation; current channel summaries reflect the new observations. Neither the larger sample sizes nor the successful access establish popularity rankings, activity rates, or complete coverage.

## Acquisition protocol for a comparable dataset

1. **Fix the scope before counting.** Use the same explicit start and end times for every channel. Document the event, channel, date, timezone, and window boundaries. If the available material covers different windows, display those differences and avoid a combined ranking.
2. **Choose and label the coverage method.** A census means every message in the stated channel/window was inspected, including any relevant thread material declared in scope. A sample means a documented selection, such as fixed time slices or consecutive visible messages. Do not call a viewport a census merely because all visible items were counted.
3. **Record the actual acquisition.** Capture the observation timestamp, method, first and last observed message references where available, number of unique message items, gaps, thread treatment, and whether history boundaries were reached. The UI's current clock does not by itself establish a timestamp's timezone.
4. **Inspect all selected channels consistently.** Collect equivalent windows and thread depth. If access or tooling stops, preserve completed observations, mark the rest incomplete, and resume only from a clean authorized session. Never fill missing cells with plausible numbers.
5. **Deduplicate before coding.** Count each unique message ID once. Scrolling overlap, search results, quoted replies, and screenshots of the same message are not new messages. If a stable message ID is unavailable, mark the identifier provisional and document the matching rule.
6. **Code content from the text actually read.** Apply the codebook below. Use neutral factual paraphrases and avoid unnecessary raw quotes. Images or attachments that were not inspected remain unclassified; do not infer their contents from reactions.
7. **Audit a subset.** A second reviewer can independently code a small set and resolve disagreements. Record the number checked and disagreements actually found; do not claim inter-rater reliability without a real check.

Messages arriving after the snapshot are outside its coverage. Deletions, edits, and reactions may change the live channel; retain the capture date/time actually available and describe the dataset as a snapshot. Do not manufacture a precise timestamp from a date-only observation.

The packaged files carry an authoritative `snapshots` list with observed message IDs. Message rows retain every known `snapshot_ids` association and are deduplicated by `message_id`. A message can appear in both snapshots but is counted once in the combined sample. Reaction readings identify their own `reaction_snapshot_id`; the latest reaction reading must not be presented as if it was already measured in an earlier snapshot. Imported snapshot identifiers alone do not prove membership in a packaged observation session.

On import, matching message IDs must agree on their core text coding, source, displayed time, and alias. Duplicate records can add snapshot references or fill previously unknown reaction data without increasing the unique-message count. A reaction reading on a later observation date in the same observation timezone replaces the complete older reaction bundle, including its count, types, date, snapshot reference, and note. Earlier readings do not overwrite newer ones. Different known counts on the same date, or observations with incompatible timezones, require review because exact ordering is not established. The app reports these enrichments as updated records rather than new messages. This merge rule does not calculate growth or velocity.

## Message coding rules

The current dataset assigns exactly one `category` per message. The labels and counts below are single-assistant interpretations, with no independent human review or second-coder validation. A reply can have a different category from the message it replies to.

| Category | Current sample count | Include | Do not infer |
| --- | ---: | --- | --- |
| `social_banter` | 32 | Brief social conversation, jokes, exaggerated boasts or other banter. | Mental state, motivation, real scores, or competitive ability. |
| `strategy_discussion` | 10 | A statement about an approach, technical setup or model choice. | That the approach works or belongs to a separate team. |
| `progress_report` | 8 | A self-reported goal, result or current resource constraint. | Verified completion, score, final submission, or project quality. |
| `collaboration` | 6 | An invitation to collaborate or practice. | Actual team membership or the number of teams. |
| `unclassified_media` | 6 | Media without an assessed analytical claim. | Details of uninspected attachments or media. |
| `leaderboard_request` | 2 | An explicit request for a leaderboard or leaderboard update. | Actual rank, entrant count, or winning likelihood. |
| `score_request` | 1 | A request for other posters to share scores. | Verified scores or a request for an official leaderboard. |
| `rule_clarification` | 32 | Questions, answers, and explanations about rules or deliverables. | That every row is a question or that the author has official authority. |
| `logistics_request` | 4 | A request about registration, submission location or procedure. | That the request was unresolved after the observation. |
| `help_request` | 5 | An explicit request for help or resources, or a reported access problem. | Subsequent resolution, event-wide prevalence, or mental health. |
| `participation_confirmation` | 11 | A team-label self-report in response to a participation prompt. | Verified team membership, eligibility, entry, or final submission. |
| `other` | 23 | Resource links, attributed announcements, fragments or unmatched readable content. | That an external-tool discussion describes the challenge's difficulty. |

The application supports 13 categories; 12 occur in the bundled observations. The supported `organizer_update` category has no current rows and requires an organizer role with explicit role evidence. Version the codebook when extending it and recode consistently if comparisons require it. Do not assign authority based only on confident wording or a display name such as “Challenges Lead.”

Future explicit-content flags may include `reports_difficulty`, `mentions_prize_motivation`, `states_submission_intent`, and `requests_help`; these have not been populated in the current dataset. Use true only for an explicit statement, false only when inspected content does not express it, and null when content cannot be evaluated. These flags describe messages, not diagnoses, personalities, or reliable team-level states. Do not label participants as traumatized or infer mental-health conditions.

For difficulty, record the concrete topic when available, such as setup, rules, data, model, integration, or time. Do not invent a numerical 1–5 difficulty score from sarcasm or emotional wording. For prize motivation, a prize mention alone is not a statement that it influenced challenge choice.

## Authors, roles, and teams

Use stable pseudonymous author keys only when an underlying author identity is available through the authorized source. Distinct display labels are a weaker observation: labels can change, collide, or represent the same person. The current sample supports a count of distinct displayed labels, not a verified count of unique people.

Classify a message as organizer, staff, or bot only when the relevant role or account type is verified. Otherwise use `unknown`. All current message authors remain `unknown`; an organizer's name quoted in a reply is not evidence that the reply's author is an organizer. The current validator permits `organizer` only with an explicit `role_evidence` field and otherwise defaults to unknown. Present all-message activity separately from any participant-only subset. Do not silently discard unknown-role messages or count them as participants.

No conversion from authors to teams is valid without an explicit, current, verifiable team mapping. Do not estimate team counts by dividing authors by two, treating each speaker as a team, or applying the user's anecdote about two people per team to the event.

H-E-B has 11 explicit participation self-report posts containing nine distinct reported team labels. Repeated uses of the same label are mapped to the same anonymous alias within scope `heb-channel-20261108`. The quoted participation prompt was visible, but its original message ID was not loaded, so reply-parent IDs remain null. A separate team-name reply to a workspace/credits prompt is excluded. The nine labels are not nine verified entrants or a complete team count. The Dashboard Royale statement about eight other teams remains an unverified claim inside its message paraphrase and contributes no team-count field.

Score claims in House Edge are preserved as self-reports or banter, not measured performance. In Build-A-Dataset, comments criticizing an external learning tool are not coded as challenge frustration. These distinctions prevent topic confusion from becoming false difficulty or competition metrics.

## Replies and help outcomes

Use explicit reply references when available. A nearby later message is not automatically a reply. A reply is not necessarily an answer, and an answer is not necessarily a resolution.

Report “no reply observed within covered material” when appropriate. That statement is right-censored by the observation boundary and incomplete history; it does not establish that a request remained unanswered or unresolved in the full channel. Report resolution only when an explicit acknowledgement or sufficiently clear resolution is observed and linked.

Response latency requires a verified request timestamp, linked reply timestamp, compatible timezone, and a nonnegative interval. Label it first observed linked-reply latency unless the entire intervening history is covered. Exclude unavailable latencies from the average and report the valid pair count. A sample missing earlier replies cannot establish the actual first-response time.

## Shareable records and retention

Retain only fields needed for reproducible counts and coding. Keep aggregate public outputs free of participant handles, avatars, identifying message quotes, credentials, and unrelated chat. Internal message references and pseudonymous author keys can support deduplication without becoming public labels. An anonymized derivative is still an online-derived dataset, not physical-world primary data.

Separate measured counts, coded interpretations, externally sourced challenge facts, and assumed calculator inputs. Do not turn uncertain values into zero or generated values into observed rows. Preserve an explicit record of corrections and coverage changes.

## What this dataset can answer

With comparable coverage, it can describe message volume, conversation topics, observed requests, explicit progress mentions, and visible reply patterns. It can help participants find recurring setup issues and help organizers see where clarification may be useful.

It cannot determine event-wide enthusiasm, actual challenge entrants, the number of active teams, effort spent, submission quality, causal effects of prizes, or anyone's winning percentage. Those quantities require additional evidence that channel activity does not supply.

## Packaging and analytical exports

This package preserves the five source JSON files byte-for-byte. Per-record CSV exports retain every original field, including all 30 message, 35 coverage and 18 snapshot fields. Objects and arrays become JSON text; null/missing values become blank cells; boolean false and numeric zero retain their meanings. Identifier strings are never converted to numbers. See README for safe Excel import.

The authoritative snapshot list is `observed/discord-message-coding.json: snapshots`, verified identical to the coverage file’s snapshot list. The 150-row bridge is generated directly from `snapshots[].message_ids`, retaining each snapshot key and challenge key. It contains 140 unique message IDs and 10 repeat-sighting memberships. Memberships are not independent messages. Every referenced message and challenge is checked. All 25 recorded reply-parent IDs are present in the current sample, although replies and resolution are distinct concepts.

The dictionary uses the independent field review retained in `provenance/field-definitions.json`, supplemented with explicit catalog, bridge and synthetic field definitions. Presence/type/null profiles are calculated from the current source records. It corrects stale descriptions that limited aliases to A–E, treated six categories as the complete codebook or generalized Rev’s 0.6 concentration share to all channels. The current sources contain 12 observed content categories. The separate category CSV preserves source definitions and adds counts of unique message records.

The acquisition protocol above describes good practice for a comparable future collection. It does not claim that complete common windows, exact capture timestamps or independent second-coder review were achieved in this dataset. Those gaps remain explicit.

## Supplementary synthetic scenario

The scenario contains nine invented four-person teams, 36 hypothetical members and 21 authored team/challenge selections. No people were approached, interviewed or surveyed to produce them. The fixed matrix and Mulberry32 seed 20261108 generate illustrative effort/rating values. All records retain `source_type: synthetic`, `is_observed: false` and `scenario_only: true`.

Current allocations assign 34 hypothetical members and leave two unallocated. Considering and stopped selections have zero current members. Effort is assumed elapsed hours, not person-hours. Difficulty and prize-importance ratings are invented; status-dependent ranges deliberately create relationships and are not empirical findings. The scenario is independent of the observations and never contributes to observed counts. Full generation details are in [the simulation methodology](../docs/SIMULATION_METHODOLOGY.md).

## Source preservation and reproducibility

Original identifiers and source links preserve access-controlled traceability, so the records are pseudonymized rather than irreversibly anonymous. [VERIFIED_CONTENTS.md](VERIFIED_CONTENTS.md) lists factual checks of the packaged data. The observed records, official context and hypothetical scenario remain distinct.

The packaging process collects no new messages and does not edit, reclassify or invent source observations. `MANIFEST.json` links source paths, record counts and SHA-256 hashes to this package. Retained historical metadata is interpreted using the current README caveats rather than silently rewritten.
