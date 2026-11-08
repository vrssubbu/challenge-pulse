# Discord observation methodology

Challenge Pulse describes visible challenge discussion. Its dataset is derived from online observations, not an in-person survey, an entry list, or a verified count of competing teams. The written Build-A-Dataset guide requires physical-world primary data. The user reports that organizers permitted remote observations for this project; that exception and its scope have not been independently verified. See [the guide review](CHALLENGE_REVIEW.md). A separate synthetic scenario illustrates possible team-level data but records no actual contacts or responses.

## What has actually been observed

The initial pass observed one Rev's Casino viewport containing 10 message items and five distinct display labels. The same ten-message sample was read again on November 8, 2026. The two snapshots are repeated sightings of the same messages, not 20 unique messages or two independent samples. The visible message timestamps ran from 22:47 to 23:22 on November 7, 2026. The timezone behind Discord's rendered timestamps has not been independently verified. This is a viewport sample, not an exhaustive export of that interval or the full channel. It contains no verified team membership, entrant count, or submission outcomes.

During the November 8 reread, reaction counts were inspected on two messages. The 23:22 leaderboard request displayed 12 heavy-plus-sign reactions and three custom-image reactions: 15 reaction events across two emoji types, not 15 unique reactors. The 22:57 collaboration message displayed one custom-image reaction. Reaction counts for the other eight messages remain unknown. The sum of 16 applies only to those two inspected messages; it is not the total reactions on the ten-message sample or channel. No exact capture time was recorded, so no growth or velocity calculation is made.

The other seven challenge channels have not been observed in this pass. Navigation attempts were blocked by the UI tool before their message contents could be read. Their sidebar links are known, but their activity metrics remain null or “not observed.” Do not treat missing channels as quiet, compute their activity as zero, or rank all eight channels from this one viewport.

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

The current dataset assigns exactly one `category` per message. The six current labels and counts are below. They are single-assistant interpretations, with no independent human review or second-coder validation. A reply can have a different category from the message it replies to.

| Category | Current sample count | Include | Do not infer |
| --- | ---: | --- | --- |
| `social_banter` | 4 | Brief social or conversational content without a specific request, progress claim, or concrete strategy signal in this coding. | Mental state, motivation, or competitive ability. |
| `strategy_discussion` | 1 | A statement about an approach to trying the challenge. | That the approach works or belongs to a separate team. |
| `progress_report` | 1 | A self-reported challenge goal or current progress. | Verified completion, a final submission, or project quality. |
| `collaboration` | 1 | An invitation to collaborate. | Actual team membership or the number of teams. |
| `unclassified_media` | 1 | A visible image message whose contents were not classified. | Anything about the image's content. |
| `leaderboard_request` | 2 | An explicit request for a leaderboard or leaderboard update. | Actual rank, entrant count, or winning likelihood. |

The importer also supports `help_request` for explicit challenge assistance, `rule_clarification` for discussion clarifying rules, `organizer_update` for an update whose organizer source is verified, and `other` for readable unmatched content. These categories are supported for expanded collection, not observed or assigned in the current file. Version the codebook when extending it further and recode consistently if comparisons require it. Do not assign `organizer_update` based only on confident wording or an unverified display name.

Future explicit-content flags may include `reports_difficulty`, `mentions_prize_motivation`, `states_submission_intent`, and `requests_help`; these have not been populated in the current dataset. Use true only for an explicit statement, false only when inspected content does not express it, and null when content cannot be evaluated. These flags describe messages, not diagnoses, personalities, or reliable team-level states. Do not label participants as traumatized or infer mental-health conditions.

For difficulty, record the concrete topic when available, such as setup, rules, data, model, integration, or time. Do not invent a numerical 1–5 difficulty score from sarcasm or emotional wording. For prize motivation, a prize mention alone is not a statement that it influenced challenge choice.

## Authors, roles, and teams

Use stable pseudonymous author keys only when an underlying author identity is available through the authorized source. Distinct display labels are a weaker observation: labels can change, collide, or represent the same person. The current sample supports a count of distinct displayed labels, not a verified count of unique people.

Classify a message as organizer, staff, or bot only when the relevant role or account type is verified. Otherwise use `unknown`. All ten current message authors remain `unknown`; an organizer's name quoted in a reply is not evidence that the reply's author is an organizer. The current validator permits `organizer` only with an explicit `role_evidence` field and otherwise defaults to unknown. Present all-message activity separately from any participant-only subset. Do not silently discard unknown-role messages or count them as participants.

No conversion from authors to teams is valid without an explicit, current, verifiable team mapping. Do not estimate team counts by dividing authors by two, treating each speaker as a team, or applying the user's anecdote about two people per team to the event.

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

