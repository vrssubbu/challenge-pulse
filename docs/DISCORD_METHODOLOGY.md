# Discord observation methodology

Participant Pulse describes recorded challenge discussions. Its dataset comes from authorized online interface observations, not an in-person survey, an entry list or a verified count of competing teams. Scoped aliases and paraphrases preserve analytical content while the original identifiers retain source traceability. A separate synthetic scenario records no actual contacts or responses. See [verified contents](../dataset/VERIFIED_CONTENTS.md) for the reconciled package counts.

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

