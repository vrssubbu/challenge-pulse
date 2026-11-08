# Eligibility and submission status

Reviewed 2026-11-08. **Organizer exception reported:** the user reaffirmed that organizers agreed to this project’s remote-observation approach. The written Build-A-Dataset rules call for primary physical-world collection. This project actually uses authorized Discord UI observations; the exact exception scope and publication conditions have not been independently inspected.

**Team eligibility: user-confirmed.** CTRL_ALT_DEFEAT has four members, all aged 18+ and currently undergraduate or graduate students. This satisfies the reviewed age/student-status and four-member criteria based on the user's confirmation; registration records have not been inspected.

**Video: pending — the user will record it later. Devpost submission and exact submission cutoff: unverified.** The scope of permission for public sharing is also unconfirmed. A completed dataset package or public repository is not a submission receipt or a blanket compliance finding.

## Guide points 5 and 6

**Point 5 — documented.** [DATASET_DOCUMENTATION.md](DATASET_DOCUMENTATION.md) covers context, method, timing, sample size, fields, processing and limitations. Unknown capture times and posting timezone are disclosed rather than invented. The guide requires these topics, not a specifically named document or an Excel format.

**Point 6 — required artifacts available; public-sharing scope unverified.** The [public repository](https://github.com/vrssubbu/challenge-pulse) contains the dataset, methodology, application source and run instructions. Public main revision 55173bc was verified at the start of this review. The new documentation and workbook belong in the same final push. A read-only review found no obvious handles, email addresses, phone contacts or credentials in the coded data. Exact message IDs, source links, times and reply structure remain linkable, so pseudonymization does not by itself establish permission to publish.

The lettered checks below are local labels, not official subrule numbers.

| Check | Required topic | Status | Evidence | Remaining action / qualification |
| --- | --- | --- | --- | --- |
| 5a | Location / context | Documented | DATASET_DOCUMENTATION.md §5.1; Coverage. Eight challenge discussion channels; actual remote setting identified. | Keep the actual source context. |
| 5b | Collection method | Documented | DATASET_DOCUMENTATION.md §5.2; METHOD.md. Authorized UI reading, aliases, paraphrases and assistant content coding. | No physical interviews or automated scraping claimed. |
| 5c | Timing | Documented; unknowns explicit | DATASET_DOCUMENTATION.md §5.3; Snapshots. Read Nov 7–8, 2026; source posts Nov 4–8. Exact capture times and posting timezone unknown. | Do not invent exact times or continuous coverage. |
| 5d | Sample size / unit | Documented | DATASET_DOCUMENTATION.md §5.4. 140 distinct messages, eight channels, 11 snapshots, 150 links; ten repeated sightings. | Counts describe messages, not people or entrants. |
| 5e | Field meanings | Documented | DATASET_DOCUMENTATION.md §5.5; Dictionary/Codebook sheets; DATA_DICTIONARY.csv. All 30 message fields explained. | Preserve text IDs, nullable values and source labels. |
| 5f | Processing / cleaning | Documented | DATASET_DOCUMENTATION.md §5.6. Exact-ID deduplication, category coding, snapshot joins, reaction provenance and export transformations. | Original JSON remains unchanged; do not double count repeated sightings. |
| 5g | Limitations / bias | Documented | DATASET_DOCUMENTATION.md §5.7. Partial unequal samples, unknown roles/timezones, no independent coding review, source-link privacy and no team-count inference. | Carry material limits into the demonstration. |
| 6a | Dataset on GitHub | Available in public repo | dataset/ contains Excel, observed JSON/CSV, snapshots and source metadata. https://github.com/vrssubbu/challenge-pulse/tree/main/dataset | Include the repository URL in the actual submission. |
| 6b | Methodology on GitHub | Documented | DATASET_DOCUMENTATION.md and METHOD.md describe the actual collection; dictionary and limits are included. | Publish the revised documentation with this workbook. |
| 6c | Application source code | Available in public repo | dist/, serve.mjs and tests/ are in the public repository. The source uses the observed records for findings and filters. | Keep code and dataset in the same final revision. |
| 6d | Run instructions | Documented | Repository README: Node.js 18+, node serve.mjs, then http://127.0.0.1:4173. No package installation is required for the static application. | Use the README instructions for reviewer setup. |
| 6e | No private / sensitive publication | Publication scope unverified | Aliases and paraphrases are used, but source message IDs and permalinks retain linkability. Remote observation approval is reported; separate public-sharing scope is not confirmed. | Confirm that sharing this derivative and its source references is permitted. |

## Evidence and source review

The current dataset has 140 unique messages from 8 partial channel samples, read November 7–8, 2026. Two posts display November 4 dates. No physical interviews, survey contacts or field measurements are claimed. The nine-team scenario is synthetic supplementary material, not collection evidence.

The [official participant guide](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit), [challenge page](https://tamudatathon.com/challenges/3), [event page](https://tamudatathon.com/) and [current FAQ](https://tamudatathon.com/#faq) were reviewed for the retained requirements report. The FAQ evidence came from the official page’s public client bundle, as recorded in [provenance/requirements-review.json](provenance/requirements-review.json). This document summarizes those reviewed requirements; it does not establish later rule changes.

R01–R14 are internal checklist identifiers; the reference column maps them to the guide or event FAQ.

| ID | Guide / event reference | Requirement | Project status | Evidence / limitation | Source |
| --- | --- | --- | --- | --- | --- |
| R01 | Guide rule 1 | Gather the primary data yourselves during the event. | Organizer exception reported | Collection is documented on November 7–8, but it observes existing online messages, including two November 4 posts. Exact acquisition timestamps are absent. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R02 | Guide rule 2 | Collect through physical-world engagement. | Organizer exception reported | Current data is Discord UI observation, not field measurements. The user reaffirmed organizer agreement to this approach; exact scope is not independently verified. | [Official source](https://tamudatathon.com/challenges/3) |
| R03 | Guide rule 3 | Build a working interactive application. | Implemented | Participant Pulse provides working filters, message inspection, snapshots, imports and exports. All 31 application checks passed for the current source revision; prior desktop/mobile interaction checks are documented. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R04 | Guide rule 4 | Make collected data essential; outside data is supplementary. | Implemented; exception reported | Message rows drive counts, themes and explorer results. Official metadata and synthetic scenarios are separate. Collection relies on the user-reported organizer exception described in R02. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R05 | Guide rule 5 | Document context, method, timing, sample, fields, processing and limitations. | Documented | DATASET_DOCUMENTATION.md maps all seven required topics to the actual collection. METHOD.md, DATA_DICTIONARY.csv, coverage and snapshots supply detail. Exact capture times and posting timezone remain explicitly unknown. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R06 | Guide rule 6 | Publish code, safe dataset, methodology and run instructions in GitHub. | Public; privacy scope unverified | Public GitHub main 55173bc was verified before this review update. Code, workbook, JSON/CSV dataset, methodology, dictionary and run instructions are present. Source IDs and links remain reidentifiable to authorized readers. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R07 | Rule 5 / submission checklist | Supply field descriptions and limitations; label public and synthetic supplements. | Documented | DATA_DICTIONARY.csv covers 135 fields across eight analytical tables. The workbook includes the observed data dictionary and codebook. Context and synthetic supplements are labeled separately. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R08 | Submission checklist | Submit the GitHub link and approximately two-minute demo through Devpost. | Video pending | The user explicitly said they will make the video later. No completed video or Devpost receipt is verified. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R09 | Submission deadline | Meet the event submission deadline. | Deadline/submission unverified | Guide delegates to the event deadline without a timestamp or portal URL. Official schedule lists hacking ending Sunday November 8 at noon and judging at 12:30 PM; these are not proof of a challenge-specific submission cutoff. | [Official source](https://tamudatathon.com/) |
| R10 | Rule 2 / responsibility guidance | Respect permission, consent, venue rules and safe collection. | Reported; scope unverified | Authorized interface access and organizer approval of the remote approach are user-reported. Approval to publish the coded records and retained source references has not been separately confirmed. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R11 | Rule 6 / responsibility guidance | Remove sensitive identifiers and restricted information before publication. | Pseudonymized; review needed | Scoped aliases and paraphrases replace original handles and quotations. Message IDs and source permalinks remain, so authorized readers can locate originals. This is not guaranteed anonymity. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R12 | Rules 1, 2 and 4 / exclusions | Never fabricate collection or present generated values as observed. | Separated and labeled | Nine-team scenario is labeled synthetic and stored separately; actual coded messages retain observation provenance. No team contacts are claimed. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R13 | Event FAQ | Eligible attendees: enrolled undergraduates/graduates aged 18+, or graduates within one year. | User-confirmed eligible | The user confirms all four real team members are 18+ and are current undergraduate or graduate students. Individual registration records have not been inspected. | [Official source](https://tamudatathon.com/#faq) |
| R14 | Event FAQ | Teams may have at most four people. | User-confirmed: 4 members | The user confirms CTRL_ALT_DEFEAT has four members, meeting the FAQ maximum of four. The nine fictional scenario teams are unrelated. | [Official source](https://tamudatathon.com/#faq) |

The package now supplies originals, CSV tables, a full field dictionary, methodology and provenance. The companion Excel workbook is produced separately and is included in the manifest when present. Application code and instructions remain in the [repository](https://github.com/vrssubbu/challenge-pulse). Publication of a particular final package revision must be checked against the repository revision; local generation alone does not verify a push.

## Judging rubric

The guide assigns 20 points to each category, for 100 total. [Official guide](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit).

| Criterion | Points | Relevant project evidence |
| --- | ---: | --- |
| Data Collection and Quality | 20 | Organizer exception reported for remote observations; written-rule difference and sampling, timing and coding limitations remain explicit. |
| Application Functionality and Data Integration | 20 | Filters, evidence inspection and data-derived metrics are implemented. |
| Creativity and Originality | 20 | Observation question and interactive presentation can be demonstrated without treating motion as data. |
| Usefulness and Impact | 20 | Can inspect recurring discussion topics; cannot establish entrants, popularity rankings or winning probabilities. |
| Communication and Presentation | 20 | Repository documentation exists; user will make the video later. Final Devpost submission is unverified. |

The reviewed guide specifies no minimum dataset size or required technology stack. A polished deployment is not a substitute for the working application, dataset documentation, GitHub link and roughly two-minute video. The current application is the analytical deliverable; animations are decorative and do not measure live activity.

## Remaining submission items

- Record the approximately two-minute video later, using [DEMO_OUTLINE.md](DEMO_OUTLINE.md), and add its actual link only after it exists.
- Verify the actual Devpost portal and cutoff with current event information. The event schedule’s hacking end is not proof of the challenge-specific submission deadline or an extension.
- Confirm event registration and use the real four-member roster in Devpost. The user has confirmed the team's size, ages and current student status; fictional scenario teams are unrelated.
- Include the final GitHub revision and video link in the actual submission. Retain the real submission receipt when available; none is recorded here.
- Keep the pseudonymization limitation visible: message IDs/permalinks can reveal originals to authorized server members. No separate verified consent/publication agreement is claimed.

No award result, judge acceptance, final eligibility determination or completed submission is asserted.
