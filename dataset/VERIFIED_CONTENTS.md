# Participant Pulse — Verified contents

This checklist describes the bundled records used by the website and workbook. Counts are recalculated by the package script from the original source files. It records data checks and measurement limits.

## Reconciled contents

| Check | Verified result | Evidence |
| --- | --- | --- |
| Unique observed messages | **140** rows and **140** distinct IDs | observed/discord-message-coding.json |
| Challenge coverage | **8** partial channel samples and **8** official challenge records | observed/discord-observations.json; context/catalog.json |
| Observation snapshots | **11**; both source inventories agree | observed/snapshots.csv |
| Snapshot memberships | **150** associations, containing **140** unique message IDs and **10** repeat sightings | observed/snapshot-message-links.csv |
| Source identifiers | Message IDs and non-null reply IDs retain their exact source strings; snapshot links use the same strings | Original JSON and generated CSV values; identifier columns must be imported as Text |
| Source copies | All five packaged JSON files match the original bytes and retained audit hashes | MANIFEST.json; provenance/source-audit.json |
| Field dictionary | **135** fields across eight analytical tables; **30** original message fields | DATA_DICTIONARY.csv |
| Content categories | **12** observed categories | observed/category-codebook.csv |
| Fictional scenario | **9** synthetic teams and **21** synthetic allocations | synthetic/; each row is marked synthetic and scenario-only |

Snapshot memberships preserve repeated observations. They are not additional message rows. The separate synthetic scenario never contributes to observed counts.

## Website findings from the same records

| Finding | Categories | Full bundled sample |
| --- | --- | --- |
| Help, rules and logistics | help_request + rule_clarification + logistics_request | **41 / 140 (29.3%)** |
| Strategy, progress and collaboration | strategy_discussion + progress_report + collaboration | **24 / 140 (17.1%)** |
| Participation self-report posts | participation_confirmation | **11 / 140 (7.9%)** |

The first finding includes questions and answers or explanations. These themes count messages, not people, unresolved problems or verified entrants. The website hero uses all loaded records; overview and story-card findings follow the selected sample. Additional local imports can change website totals without changing this bundled package.

## Source and measurement limits

The records came from authorized online reading of Discord challenge channels on November 7–8, 2026. The original source type and method remain attached to every message. Displayed posting dates include two November 4 messages. Exact capture times and the posting timezone were not recorded or verified.

All channel samples are partial and have unequal coverage. Every author role is unknown; categories are single-assistant interpretations and no independent human coding review is recorded. Only two messages have inspected reaction readings, of 15 and 1 reaction events; other reaction values remain unmeasured. None of these records establishes event-wide activity, unique people, verified teams, entrants or winning probabilities.

Scoped aliases and paraphrases replace original handles and quotations. Exact IDs and source links retain traceability for authorized server members, so the records are pseudonymized rather than guaranteed anonymous. Official challenge metadata is external context; synthetic rows are invented examples, not fieldwork or contacts.

The Excel companion, JSON/CSV tables, documentation and website use the same observation units and source distinctions. JSON remains authoritative for source types, nested values, nulls and missing properties. CSV quotes do not prevent Excel rounding; preserve identifier columns as Text. The package script does not alter the workbook or website.

See [dataset documentation](DATASET_DOCUMENTATION.md), [method](METHOD.md), [dictionary](DATA_DICTIONARY.csv) and [manifest](MANIFEST.json) for the supporting records and transformations.
