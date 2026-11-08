# Eligibility and submission status

Reviewed 2026-11-08. **Organizer exception reported:** the user reaffirmed that organizers agreed to this project’s remote-observation approach. The written Build-A-Dataset rules call for primary physical-world collection. This project actually uses authorized Discord UI observations; the exact exception scope and publication conditions have not been independently inspected.

**Video: pending — the user will record it later. Devpost submission: unverified. Exact submission deadline, actual team roster and personal eligibility: unverified.** A completed dataset package or public repository is not a submission receipt or a blanket compliance finding.

## Evidence and source review

The current dataset has 140 unique messages from 8 partial channel samples, read November 7–8, 2026. Two posts display November 4 dates. No physical interviews, survey contacts or field measurements are claimed. The nine-team scenario is synthetic supplementary material, not collection evidence.

The [official participant guide](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit), [challenge page](https://tamudatathon.com/challenges/3), [event page](https://tamudatathon.com/) and [current FAQ](https://tamudatathon.com/#faq) were reviewed for the retained requirements report. The FAQ evidence came from the official page’s public client bundle, as recorded in [provenance/requirements-review.json](provenance/requirements-review.json). This document summarizes those reviewed requirements; it does not establish later rule changes.

| ID | Requirement | Project status | Evidence / limitation | Source |
| --- | --- | --- | --- | --- |
| R01 | Gather the primary data yourselves during the event. | organizer exception reported | Collection is documented on November 7–8, but it observes existing online messages, including two November 4 posts. Exact acquisition timestamps are absent. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R02 | Collect through physical-world engagement. | organizer exception reported | Current data is Discord UI observation, not field measurements. The user reaffirmed organizer agreement to this approach; exact scope is not independently verified. | [Official source](https://tamudatathon.com/challenges/3) |
| R03 | Build a working interactive application. | implemented | Dashboard supports challenge/category filters, message inspection, snapshots, exports and imports. Documented application checks verified these interactions. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R04 | Make collected data essential; outside data is supplementary. | implemented organizer exception reported | Message rows drive counts, themes and explorer results. Official metadata and synthetic scenarios are separate. Collection relies on the user-reported organizer exception described in R02. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R05 | Document context, method, timing, sample, fields, processing and limitations. | documented with known gaps | DISCORD_METHODOLOGY.md, METRIC_DICTIONARY.md and bundled snapshots document the process. Exact capture times, timestamp timezone and full-history coverage are unknown. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R06 | Publish code, safe dataset, methodology and run instructions in GitHub. | repository present | The repository remote is https://github.com/vrssubbu/challenge-pulse; the checked-out revision contains dist/data, methodology, application code, tests and run instructions. Verify that the final packaged revision is pushed before submission. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R07 | Supply field descriptions and limitations; label public and synthetic supplements. | documented | Metric dictionary, separate simulation methodology, source_type fields and explicit source labels exist. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R08 | Submit the GitHub link and approximately two-minute demo through Devpost. | pending user will record later | The user explicitly said they will make the video later. No completed video or Devpost receipt is verified. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R09 | Meet the event submission deadline. | not verified | Guide delegates to the event deadline without a timestamp or portal URL. Official schedule lists hacking ending Sunday November 8 at noon and judging at 12:30 PM; these are not proof of a challenge-specific submission cutoff. | [Official source](https://tamudatathon.com/) |
| R10 | Respect permission, consent, venue rules and safe collection. | partially documented not independently verified | Methodology describes authorized Discord UI access; the user reaffirmed organizer agreement. No raw interviews or field collection occurred. Exact exception scope and publication conditions were not independently inspected. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R11 | Remove sensitive identifiers and restricted information before publication. | aliases and paraphrases present source links remain | Dataset has scoped aliases and paraphrases rather than handles or raw quotes. Message IDs and Discord permalinks retain traceability and can identify originals to authorized server members; this is pseudonymization, not guaranteed anonymity. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R12 | Never fabricate collection or present generated values as observed. | explicitly separated | Nine-team scenario is labeled synthetic and stored separately; actual coded messages retain observation provenance. No team contacts are claimed. | [Official source](https://docs.google.com/document/d/1LjwC2ZwxrLQzuy14MjoHLTnhe4Wmq6eEUBKs1PHoUjc/edit) |
| R13 | Eligible attendees: enrolled undergraduates/graduates aged 18+, or graduates within one year. | personal eligibility unknown | Current official FAQ was freshly read; user/team eligibility facts were not supplied or verified. | [Official source](https://tamudatathon.com/#faq) |
| R14 | Teams may have at most four people. | actual roster unknown | Current official FAQ confirms four-person cap. Fictional four-person teams are simulation, not the entrant roster. | [Official source](https://tamudatathon.com/#faq) |

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
- Confirm the real team’s registration and eligibility; the fictional four-person simulation teams are unrelated to the entrant roster.
- Include the final GitHub revision and video link in the actual submission. Retain the real submission receipt when available; none is recorded here.
- Keep the pseudonymization limitation visible: message IDs/permalinks can reveal originals to authorized server members. No separate verified consent/publication agreement is claimed.

No award result, judge acceptance, final eligibility determination or completed submission is asserted.
