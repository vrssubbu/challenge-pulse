// Rebuild the analytical package without changing the dashboard's source data.
// Node.js 18+, no dependencies. Run: node scripts/package-dataset.mjs
import {readFile, writeFile, mkdir, copyFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'dataset');
const work = path.resolve(root, '../outputs/dataset-package-work');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async filename => JSON.parse(await readFile(filename, 'utf8'));
const exists = async filename => {try {await stat(filename);return true;} catch(error) {if(error.code === 'ENOENT')return false;throw error;}};
const fields = records => [...new Set(records.flatMap(Object.keys))];
const csvCell = value => '"' + (value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)).replaceAll('"', '""') + '"';
const csv = (records, columns = fields(records)) => [columns.map(csvCell).join(','), ...records.map(row => columns.map(key => csvCell(row[key])).join(','))].join('\r\n') + '\r\n';
async function save(relative, content) {
  const target = path.join(destination, relative);
  await mkdir(path.dirname(target), {recursive:true});
  await writeFile(target, content, 'utf8');
}

// Persist the review inputs so regeneration also works from a repository clone.
// Only these explicitly named files are written; the workbook is never modified.
async function reviewInput(externalName, packagedName) {
  const external = path.join(work, externalName);
  const packaged = path.join(destination, 'provenance', packagedName);
  if(await exists(external)) {
    await mkdir(path.dirname(packaged), {recursive:true});
    await copyFile(external, packaged);
  }
  if(!await exists(packaged)) throw new Error(`Missing review input: ${externalName}; retain dataset/provenance/${packagedName} in the repository.`);
  return json(packaged);
}
const audit = await reviewInput('data-audit.json', 'source-audit.json');
const suggested = await reviewInput('suggested-data-dictionary.json', 'field-definitions.json');
const requirements = await reviewInput('requirements-research.json', 'requirements-review.json');

const sourceSpecifications = [
  ['discord-message-coding', 'observed', 'records', 'Messages'],
  ['discord-observations', 'observed', 'records', 'Coverage'],
  ['catalog', 'context', 'challenges', 'Challenges'],
  ['simulated-teams', 'synthetic', 'records', 'SyntheticTeams'],
  ['simulated-team-challenges', 'synthetic', 'records', 'SyntheticAllocations']
];
const sources = [];
const tables = [];
for(const [name, folder, collection, table] of sourceSpecifications) {
  const original = `dist/data/${name}.json`;
  const packaged = `${folder}/${name}.json`;
  const bytes = await readFile(path.join(root, original));
  assert.equal(sha256(bytes),audit.files.find(item=>item.relative_path===original)?.sha256,`Source bytes changed: refresh the independent review for ${original}`);
  const data = JSON.parse(bytes.toString('utf8'));
  assert.ok(Array.isArray(data[collection]), `${original}: ${collection} must be an array`);
  sources.push({name,original,packaged,bytes,data,collection,table});
  tables.push({name:table,path:`${folder}/${name}.csv`,source:packaged,sourceCollection:collection,classification:folder,records:data[collection]});
}
const source = name => sources.find(item => item.name === name).data;
const messages = source('discord-message-coding').records;
const coverage = source('discord-observations').records;
const challenges = source('catalog').challenges;
const snapshots = source('discord-message-coding').snapshots;
assert.deepEqual(snapshots, source('discord-observations').snapshots, 'Both source snapshot inventories must agree');
const links = snapshots.flatMap(snapshot => snapshot.message_ids.map(message_id => ({snapshot_id:snapshot.snapshot_id,message_id,challenge_id:snapshot.challenge_id})));
tables.push(
  {name:'Snapshots',path:'observed/snapshots.csv',source:'observed/discord-message-coding.json',sourceCollection:'snapshots',classification:'observed',records:snapshots},
  {name:'SnapshotMessageLinks',path:'observed/snapshot-message-links.csv',source:'observed/discord-message-coding.json',sourceCollection:'snapshots[].message_ids',classification:'observed',records:links}
);
const inventory = {
  observed_message_rows:messages.length,
  unique_message_ids:new Set(messages.map(row => row.message_id)).size,
  channel_coverage_rows:coverage.length,
  catalog_rows:challenges.length,
  snapshots:snapshots.length,
  snapshot_membership_rows:links.length,
  unique_messages_in_snapshot_membership:new Set(links.map(row => row.message_id)).size,
  repeated_sighting_extra_memberships:links.length-new Set(links.map(row => row.message_id)).size,
  synthetic_team_rows:source('simulated-teams').records.length,
  synthetic_team_challenge_rows:source('simulated-team-challenges').records.length
};
for(const [key,value] of Object.entries(inventory)) assert.equal(value,audit.inventory[key],`Source inventory changed: refresh the independent review for ${key}`);
assert.equal(messages.length,inventory.unique_message_ids,'Message IDs must be unique');
const messageById = new Map(messages.map(row => [row.message_id,row]));
const challengeIds = new Set(challenges.map(row => row.challenge_id));
const snapshotIds = new Set(snapshots.map(row => row.snapshot_id));
assert.equal(snapshotIds.size,snapshots.length,'Snapshot IDs must be unique');
assert.equal(new Set(links.map(row => JSON.stringify([row.snapshot_id,row.message_id]))).size,links.length,'Snapshot memberships must be unique');
for(const row of messages) {
  assert.equal(typeof row.message_id,'string','Discord message IDs must remain strings');
  assert.ok(row.reply_to_message_id === null || typeof row.reply_to_message_id === 'string','Reply IDs must remain strings or null');
  assert.ok(challengeIds.has(row.challenge_id),'Every message must join to the catalog');
  assert.equal(row.source_type,'discord_ui_observation','Synthetic records cannot enter observed messages');
}
for(const snapshot of snapshots) {
  assert.equal(snapshot.message_ids.length,snapshot.observed_messages,'Snapshot count must match its authoritative membership');
  for(const message_id of snapshot.message_ids) {
    assert.equal(typeof message_id,'string','Snapshot message IDs must remain strings');
    const row = messageById.get(message_id);
    assert.ok(row,'Snapshot references an absent message');
    assert.equal(row.challenge_id,snapshot.challenge_id,'Snapshot/message challenge mismatch');
    assert.ok(row.snapshot_ids.includes(snapshot.snapshot_id),'Message snapshot IDs must preserve authoritative membership');
  }
}
for(const row of messages) for(const id of row.snapshot_ids) assert.ok(links.some(link => link.snapshot_id===id && link.message_id===row.message_id),'Message membership absent from authoritative snapshots');
for(const table of tables.filter(item => item.classification==='synthetic')) for(const row of table.records) {
  assert.equal(row.source_type,'synthetic');assert.equal(row.is_observed,false);assert.equal(row.scenario_only,true);
}

// Copy source JSON bytes, not a JSON.stringify reconstruction.
for(const item of sources) {
  await mkdir(path.dirname(path.join(destination,item.packaged)), {recursive:true});
  await copyFile(path.join(root,item.original),path.join(destination,item.packaged));
  assert.ok(item.bytes.equals(await readFile(path.join(destination,item.packaged))),`Copy differs: ${item.packaged}`);
}
const observedCategories = Object.entries(source('discord-message-coding').coding_scheme.definitions).map(([category,definition]) => ({category,definition,observed_message_count:messages.filter(row => row.category===category).length}));
tables.push({name:'CategoryCodebook',path:'observed/category-codebook.csv',source:'observed/discord-message-coding.json',sourceCollection:'coding_scheme.definitions and records[].category',classification:'observed',records:observedCategories});
for(const table of tables) await save(table.path,csv(table.records));

const contextualDefinitions = {
  challenge_id:'Stable challenge key. Joins official challenge context, observations, snapshots and the separate synthetic scenario; the join does not make scenario rows observed.',
  name:'Official challenge display name as recorded in the catalog.',
  page_url:'Public official challenge page used as a contextual source.',
  guide_url:'Linked participant guide or challenge application URL.',
  objective:'Summary of the challenge objective from official public material.',
  scoring:'Recorded scoring summary. Unknown details remain unknown; this is not a measured participant score.',
  submission:'Recorded submission instructions; string or JSON array according to the original row.',
  deadline:'Recorded challenge-specific deadline when known; null means no exact cutoff was established in this catalog.',
  eligibility_constraints:'JSON array of recorded challenge restrictions. It does not verify this project or any actual team member as eligible.',
  prizes:'JSON object of prize descriptions by placing. No cash values or per-person allocations are inferred.',
  unknowns:'JSON array of unresolved contextual facts at catalog retrieval.',
  participant_count:'Unknown entrant/participant population; null throughout this catalog.',
  id:'Compatibility alias equal to challenge_id in every current catalog row.',
  source_type:'Source classification: official_challenge_metadata. External context, separate from online observation and simulation.',
  source_url:'Official source URL supporting the challenge context.',
  rubric_percent:'JSON object of official rubric percentage weights, present only where specified in the source.',
  submission_url:'Official submission destination recorded for this challenge; absence is not a submission receipt.',
  rubric_points:'JSON object of official rubric point weights, present only where specified in the source.',
  current_project_fit:'Recorded project-fit assessment against written rules at catalog creation. The preserved Build-A-Dataset text predates the latest reaffirmed user-reported organizer exception; see ELIGIBILITY.md.',
  registration_url:'Official registration destination recorded for this challenge.',
  main_submission_url:'Main event submission destination recorded in the source catalog.',
  schedule_conflict:'Recorded scheduling caveat or conflict, not evidence of any actual entrant action.',
  access_instruction:'Recorded instructions for accessing the challenge resources.'
};
const syntheticDefinitions = {
  team_id:'Identifier for one fictional scenario team; not an actual team or observed participant identifier.',
  source_type:'Always synthetic. Generated supplementary scenario data, not fieldwork, interviews or online observed messages.',
  is_observed:'Always false. Must not be interpreted as collected empirical data.',
  scenario_only:'Always true. Retains the explicit scenario classification.',
  profile_label:'Human-readable label for an invented team.',
  team_size:'Assumed members per fictional team; four by construction, not surveyed membership.',
  selected_challenge_count:'Number of authored scenario challenge selections for this fictional team.',
  active_or_submitting_challenge_count:'Number of this fictional team’s selections with hypothetical active or submitting status.',
  members_allocated:'Current fictional members allocated across this team’s scenario selections.',
  members_unallocated:'Fictional team_size minus current allocated members.',
  assumption_note:'Explicit row-level statement that the record and its values are invented.',
  record_id:'Unique fictional team–challenge pair identifier.',
  challenge_id:'Official challenge key used to contextualize a fictional selection; this is not evidence of entry.',
  status:'Authored hypothetical status: considering, active, submitting or stopped.',
  person_count_allocated:'Current hypothetical members allocated to this selection. Considering/stopped rows have zero by design.',
  effort_hours:'Assumed elapsed working hours, not person-hours or measured event effort.',
  simulated_difficulty_1_5:'Invented difficulty rating, 1 easy to 5 difficult; null for considering. Not a participant answer.',
  simulated_prize_importance_1_5:'Invented prize-importance rating, 1 none to 5 high. Not measured or self-reported motivation.'
};
const linkDefinitions = {
  snapshot_id:'Observation-session key. Together with message_id forms the bridge primary key; joins Snapshots.snapshot_id.',
  message_id:'Exact string message ID from the authoritative snapshots[].message_ids inventory. Joins Messages.message_id; repeat sightings do not add new messages.',
  challenge_id:'Challenge key copied from the parent authoritative snapshot; validated against the linked message.'
};
const codebookDefinitions = {
  category:'Exclusive content-category key from the source coding scheme; joins Messages.category.',
  definition:'Original source codebook definition. Categories are single-assistant interpretations, not independently validated participant attributes.',
  observed_message_count:'Number of unique observed message records assigned this category across the current sample; not people or teams.'
};
const originalDefinitions = new Map(suggested.map(item => [`${item.table}.${item.field}`,item.definition]));
const valueType = value => value===null?'null':Array.isArray(value)?'array':typeof value==='number'?(Number.isInteger(value)?'integer':'number'):typeof value;
const dictionary = tables.flatMap(table => fields(table.records).map(field => {
  const definition = originalDefinitions.get(`${table.name}.${field}`) ?? (table.name==='Challenges'?contextualDefinitions[field]:table.name==='SnapshotMessageLinks'?linkDefinitions[field]:table.name==='CategoryCodebook'?codebookDefinitions[field]:syntheticDefinitions[field]);
  assert.ok(definition,`Missing data dictionary definition: ${table.name}.${field}`);
  const present = table.records.filter(row => Object.hasOwn(row,field));
  const values = present.map(row => row[field]);
  const types = {};
  for(const value of values) {const type=valueType(value);types[type]=(types[type]??0)+1;}
  const nonNull = values.filter(value => value!==null);
  return {
    table:table.name,file:table.path,classification:table.classification,field,definition,
    total_rows:table.records.length,present_count:present.length,missing_property_count:table.records.length-present.length,
    null_count:values.filter(value => value===null).length,non_null_count:nonNull.length,types,
    distinct_non_null_values:new Set(nonNull.map(value => JSON.stringify(value))).size,
    example:nonNull[0]??null,
    csv_encoding:'UTF-8; every cell quoted; null/missing blank; objects/arrays serialized as JSON; boolean false preserved; import IDs as TEXT'
  };
}));
await save('DATA_DICTIONARY.csv',csv(dictionary));

const reviewDate = requirements.review_date_local;
const guideUrl = requirements.source_registry.find(item => item.id==='guide').url;
const channelRows = coverage.map(row => `| ${row.challenge_name} | ${row.observed_messages} | ${row.snapshot_count} | ${row.coverage_status} |`).join('\n');

await save('README.md',`# Participant Pulse dataset

This is the central data package for Participant Pulse by CTRL_ALT_DEFEAT: **${messages.length} unique observed discussion messages, ${coverage.length} challenge-channel samples, ${snapshots.length} observation snapshots and ${links.length} snapshot–message links**. It also contains official challenge context and a **separate synthetic scenario of ${inventory.synthetic_team_rows} fictional teams and ${inventory.synthetic_team_challenge_rows} fictional team–challenge allocations**. No teams were contacted to create the scenario.

The original five JSON files are copied byte-for-byte from the application’s \`dist/data/\` directory. CSV files are derived analytical views. Original JSON remains authoritative for exact types, null versus missing properties, metadata and nested structures.

## Start here

- [Participant_Pulse_Dataset.xlsx](Participant_Pulse_Dataset.xlsx) is the included companion workbook, with separate sheets for observations, context, provenance and synthetic scenarios.
- [DATASET_DOCUMENTATION.md](DATASET_DOCUMENTATION.md) brings all seven guide point-5 topics into one account of the actual collection and maps the point-6 deliverables. The workbook's Eligibility sheet contains the full review and twelve detailed checks for points 5 and 6.
- [METHOD.md](METHOD.md) explains acquisition, coding, processing and limitations.
- [DATA_DICTIONARY.csv](DATA_DICTIONARY.csv) describes all ${dictionary.length} fields across the eight analytical tables, including field presence, nulls and actual source types.
- [ELIGIBILITY.md](ELIGIBILITY.md) records written requirements, the user-reported organizer exception and outstanding submission status.
- [DEMO_OUTLINE.md](DEMO_OUTLINE.md) is a roughly two-minute recording outline. **Video: pending; the user will record it later.**
- [MANIFEST.json](MANIFEST.json) records original-source hashes, packaged-file hashes and table counts.

## Files and record units

| Path | Rows | Unit / classification |
| --- | ---: | --- |
| \`observed/discord-message-coding.json\` and \`.csv\` | ${messages.length} | One unique observed message; 30 original fields |
| \`observed/discord-observations.json\` and \`.csv\` | ${coverage.length} | One partial channel coverage summary; 35 original fields |
| \`observed/snapshots.csv\` | ${snapshots.length} | One recorded observation snapshot; 18 original fields |
| \`observed/snapshot-message-links.csv\` | ${links.length} | One authoritative snapshot/message membership |
| \`observed/category-codebook.csv\` | ${observedCategories.length} | Category, source definition and observed-message count |
| \`context/catalog.json\` and \`.csv\` | ${challenges.length} | Official contextual challenge metadata |
| \`synthetic/simulated-teams.json\` and \`.csv\` | ${inventory.synthetic_team_rows} | Fictional four-person scenario team |
| \`synthetic/simulated-team-challenges.json\` and \`.csv\` | ${inventory.synthetic_team_challenge_rows} | Fictional team/challenge selection and allocation |
| \`provenance/\` | — | Independent source audit, original field definitions and requirements review |

The JSON files contain metadata beyond their tabular record collections. The message and coverage JSON files each contain the same snapshot inventory. Use either inventory once; do not append them together.

## Scope

| Channel | Unique messages | Snapshots | Coverage |
| --- | ---: | ---: | --- |
${channelRows}

Collection dates were November 7–8, 2026 in America/Chicago. Displayed posting dates range from November 4 to November 8; two messages are dated November 4. The posting timezone is unverified. Collection dates must not be used to localize posting times. No exact capture times or complete observation windows were recorded.

Ten Rev’s Casino messages were sighted twice, producing ${inventory.repeated_sighting_extra_memberships} extra memberships. **${links.length} links are not ${links.length} messages.** Sample sizes reflect unequal acquisition coverage, not popularity, entrants or activity rates. Every author role is unknown and every \`human_reviewed\` value is false. Aliases apply only within one channel. H-E-B’s eleven participation posts contain nine self-reported labels; these are not nine verified teams or entrants.

## Joins

- \`Messages.message_id\` is a text primary key. \`Snapshots.snapshot_id\` is a text primary key.
- The bridge key is \`(snapshot_id, message_id)\`; it joins the authoritative snapshot membership to unique messages.
- Join messages, coverage, snapshots and official challenge context on \`challenge_id\`.
- \`reply_to_message_id\` supports a nullable message self-join. All 25 currently recorded non-null parents exist in this sample; a null parent does not establish absence of a reply relationship.
- Synthetic selections join synthetic teams on \`team_id\` and official context on \`challenge_id\`. Keep them out of observed-message totals.

## CSV and Excel import

CSV uses UTF-8, a header row, comma separators, CRLF record endings and double-quote escaping. Every cell is quoted, including IDs. **Quoting does not stop Excel from rounding 19-digit Discord IDs.** In Excel use Data → From Text/CSV → Transform Data, disable automatic type detection or remove the inferred Changed Type step, then set all identifier columns to **Text before loading**. Opening a CSV by double-clicking is unsafe for these IDs. The companion workbook stores identifiers as text.

Null and missing values export as blank cells; explicit \`false\`, zero, empty arrays and empty objects remain \`false\`, \`0\`, \`[]\` and \`{}\`. Use the original JSON plus dictionary to distinguish null, absent properties and any empty strings. Objects and arrays are serialized as JSON text inside the CSV field, preserving their contents. Displayed dates/times are literal source text. \`reaction_types_observed\` is a nullable integer count, not an array.

## Provenance and limits

Messages use scoped aliases and paraphrases, with no original handles or verbatim quotes. Message IDs and source URLs remain for traceability and can reveal originals to authorized Discord server members. This is a **pseudonymized derivative, not guaranteed anonymity**. Source links require access to the original server.

Only two messages have inspected reaction readings (1 and 15); the other 138 remain unmeasured. The sum of 16 is neither a dataset-wide reaction total nor unique reactors. Categories are single-assistant interpretations of message content, not independently verified emotions, outcomes or participant characteristics.

The written guide requires physical-world collection. The user reaffirmed that organizers agreed to this remote-observation approach. That agreement is recorded as **user-reported**, with no independent verification of its exact scope or publication conditions. No blanket compliance or final submission is claimed.

Preserved historical source notes may describe earlier states: the Rev reread’s blocked navigation occurred before later acquisition of all eight channels; synthetic metadata mentions an earlier ten-message dataset; the catalog’s project-fit sentence evaluates the written rule without the later reaffirmed exception. These source bytes are intentionally unchanged. The current package scope and eligibility status are documented here and in [ELIGIBILITY.md](ELIGIBILITY.md).

## Rebuild and verify

From the repository root, with Node.js 18 or newer:

\`\`\`sh
node scripts/package-dataset.mjs
\`\`\`

The script validates record identities and snapshot links, copies the five originals without reserializing them, rebuilds the named CSV/documentation files and refreshes the SHA-256 manifest. It writes only controlled paths and deletes nothing. Retained review inputs under \`provenance/\` allow regeneration from a repository clone; a local \`../outputs/dataset-package-work/\` review overrides those inputs when present. A changed source inventory requires a refreshed audit. Rerun after the workbook is finalized to include its current hash. The manifest excludes itself.

Application run instructions are in the [repository README](../README.md). Requirements were reviewed on ${reviewDate}; no new source messages were collected during this packaging step.
`);

const originalMethod = await readFile(path.join(root,'docs/DISCORD_METHODOLOGY.md'),'utf8');
const method = originalMethod.replace(/^# Discord observation methodology\s*/, '# Participant Pulse dataset method\n\n').replace('[the guide review](CHALLENGE_REVIEW.md)','[the eligibility review](ELIGIBILITY.md)');
await save('METHOD.md',`${method.trim()}

## Packaging and analytical exports

This package preserves the five source JSON files byte-for-byte. Per-record CSV exports retain every original field, including all 30 message, 35 coverage and 18 snapshot fields. Objects and arrays become JSON text; null/missing values become blank cells; boolean false and numeric zero retain their meanings. Identifier strings are never converted to numbers. See README for safe Excel import.

The authoritative snapshot list is \`observed/discord-message-coding.json: snapshots\`, verified identical to the coverage file’s snapshot list. The ${links.length}-row bridge is generated directly from \`snapshots[].message_ids\`, retaining each snapshot key and challenge key. It contains ${messages.length} unique message IDs and ${inventory.repeated_sighting_extra_memberships} repeat-sighting memberships. Memberships are not independent messages. Every referenced message and challenge is checked. All 25 recorded reply-parent IDs are present in the current sample, although replies and resolution are distinct concepts.

The dictionary uses the independent field review retained in \`provenance/field-definitions.json\`, supplemented with explicit catalog, bridge and synthetic field definitions. Presence/type/null profiles are calculated from the current source records. It corrects stale descriptions that limited aliases to A–E, treated six categories as the complete codebook or generalized Rev’s 0.6 concentration share to all channels. The current sources contain ${observedCategories.length} observed content categories. The separate category CSV preserves source definitions and adds counts of unique message records.

The acquisition protocol above describes good practice for a comparable future collection. It does not claim that complete common windows, exact capture timestamps or independent second-coder review were achieved in this dataset. Those gaps remain explicit.

## Supplementary synthetic scenario

The scenario contains nine invented four-person teams, 36 hypothetical members and 21 authored team/challenge selections. No people were approached, interviewed or surveyed to produce them. The fixed matrix and Mulberry32 seed 20261108 generate illustrative effort/rating values. All records retain \`source_type: synthetic\`, \`is_observed: false\` and \`scenario_only: true\`.

Current allocations assign 34 hypothetical members and leave two unallocated. Considering and stopped selections have zero current members. Effort is assumed elapsed hours, not person-hours. Difficulty and prize-importance ratings are invented; status-dependent ranges deliberately create relationships and are not empirical findings. The scenario is independent of the observations and never contributes to observed counts or eligibility evidence. Full generation details are in [the simulation methodology](../docs/SIMULATION_METHODOLOGY.md).

## Publication and review status

The user reaffirmed organizer agreement to remote observation. The precise scope is not independently documented here; this is not a claim that online data became physical-world fieldwork. Original identifiers and source links preserve access-controlled traceability, so the records are pseudonymized rather than irreversibly anonymous. Requirements and pending video/submission status are in [ELIGIBILITY.md](ELIGIBILITY.md).

The packaging process collects no new messages and does not edit, reclassify or invent source observations. \`MANIFEST.json\` links source paths, record counts and SHA-256 hashes to this package. Retained historical metadata is interpreted using the current README caveats rather than silently rewritten.
`);

const escapeTable = value => String(value??'').replaceAll('|','\\|').replaceAll('\n',' ');
const requirementRows = requirements.requirements.map(item => `| ${item.id} | ${escapeTable(item.guide_reference??'')} | ${escapeTable(item.requirement)} | ${escapeTable(item.display_status??item.project_status.replaceAll('_',' '))} | ${escapeTable(item.evidence)} | [Official source](${item.source_url}) |`).join('\n');
const detailedRuleRows = (requirements.point_5_and_6_checks??[]).map(item=>`| ${item.id} | ${escapeTable(item.requirement)} | ${escapeTable(item.status)} | ${escapeTable(item.evidence)} | ${escapeTable(item.next_action)} |`).join('\n');
const judgingRows = requirements.judging.map(item => `| ${item.criterion} | ${item.points} | ${item.project_note} |`).join('\n');
await save('ELIGIBILITY.md',`# Eligibility and submission status

Reviewed ${reviewDate}. **Organizer exception reported:** the user reaffirmed that organizers agreed to this project’s remote-observation approach. The written Build-A-Dataset rules call for primary physical-world collection. This project actually uses authorized Discord UI observations; the exact exception scope and publication conditions have not been independently inspected.

**Team eligibility: user-confirmed.** CTRL_ALT_DEFEAT has four members, all aged 18+ and currently undergraduate or graduate students. This satisfies the reviewed age/student-status and four-member criteria based on the user's confirmation; registration records have not been inspected.

**Video: pending — the user will record it later. Devpost submission and exact submission cutoff: unverified.** The scope of permission for public sharing is also unconfirmed. A completed dataset package or public repository is not a submission receipt or a blanket compliance finding.

## Guide points 5 and 6

**Point 5 — documented.** [DATASET_DOCUMENTATION.md](DATASET_DOCUMENTATION.md) covers context, method, timing, sample size, fields, processing and limitations. Unknown capture times and posting timezone are disclosed rather than invented. The guide requires these topics, not a specifically named document or an Excel format.

**Point 6 — required artifacts available; public-sharing scope unverified.** The [public repository](https://github.com/vrssubbu/challenge-pulse) contains the dataset, methodology, application source and run instructions. Public main revision 55173bc was verified at the start of this review. The new documentation and workbook belong in the same final push. A read-only review found no obvious handles, email addresses, phone contacts or credentials in the coded data. Exact message IDs, source links, times and reply structure remain linkable, so pseudonymization does not by itself establish permission to publish.

The lettered checks below are local labels, not official subrule numbers.

| Check | Required topic | Status | Evidence | Remaining action / qualification |
| --- | --- | --- | --- | --- |
${detailedRuleRows}

## Evidence and source review

The current dataset has ${messages.length} unique messages from ${coverage.length} partial channel samples, read November 7–8, 2026. Two posts display November 4 dates. No physical interviews, survey contacts or field measurements are claimed. The nine-team scenario is synthetic supplementary material, not collection evidence.

The [official participant guide](${guideUrl}), [challenge page](https://tamudatathon.com/challenges/3), [event page](https://tamudatathon.com/) and [current FAQ](https://tamudatathon.com/#faq) were reviewed for the retained requirements report. The FAQ evidence came from the official page’s public client bundle, as recorded in [provenance/requirements-review.json](provenance/requirements-review.json). This document summarizes those reviewed requirements; it does not establish later rule changes.

R01–R14 are internal checklist identifiers; the reference column maps them to the guide or event FAQ.

| ID | Guide / event reference | Requirement | Project status | Evidence / limitation | Source |
| --- | --- | --- | --- | --- | --- |
${requirementRows}

The package now supplies originals, CSV tables, a full field dictionary, methodology and provenance. The companion Excel workbook is produced separately and is included in the manifest when present. Application code and instructions remain in the [repository](https://github.com/vrssubbu/challenge-pulse). Publication of a particular final package revision must be checked against the repository revision; local generation alone does not verify a push.

## Judging rubric

The guide assigns 20 points to each category, for 100 total. [Official guide](${guideUrl}).

| Criterion | Points | Relevant project evidence |
| --- | ---: | --- |
${judgingRows}

The reviewed guide specifies no minimum dataset size or required technology stack. A polished deployment is not a substitute for the working application, dataset documentation, GitHub link and roughly two-minute video. The current application is the analytical deliverable; animations are decorative and do not measure live activity.

## Remaining submission items

- Record the approximately two-minute video later, using [DEMO_OUTLINE.md](DEMO_OUTLINE.md), and add its actual link only after it exists.
- Verify the actual Devpost portal and cutoff with current event information. The event schedule’s hacking end is not proof of the challenge-specific submission deadline or an extension.
- Confirm event registration and use the real four-member roster in Devpost. The user has confirmed the team's size, ages and current student status; fictional scenario teams are unrelated.
- Include the final GitHub revision and video link in the actual submission. Retain the real submission receipt when available; none is recorded here.
- Keep the pseudonymization limitation visible: message IDs/permalinks can reveal originals to authorized server members. No separate verified consent/publication agreement is claimed.

No award result, judge acceptance, final eligibility determination or completed submission is asserted.
`);

await save('DEMO_OUTLINE.md',`# Two-minute demonstration outline

**Status: pending. The user will record the video later.** This is a proposed script and shot list, not a completed recording or submission. Use the actual application, package and working repository revision. Suggested timing totals approximately two minutes.

| Time | Show | Suggested narration |
| --- | --- | --- |
| 0:00–0:15 | Participant Pulse hero, then the evidence summary | “Participant Pulse makes a partial sample of challenge discussion easier to inspect. We have 140 unique recorded messages across eight challenge channels.” |
| 0:15–0:35 | METHOD.md and collection provenance, without exposing original participant handles | “The observations were read through the authorized Discord interface on November 7 and 8. Organizers agreed to our remote approach, as reported by our team. We retained aliases and paraphrases. Posting timezones and exact capture times remain unknown, and two posts predate the event.” |
| 0:35–0:55 | The Messages table and the 11-row Snapshots / 150-row membership tables | “Each message ID is kept as text and counted once. Eleven snapshots create 150 memberships because ten messages were read twice. Repeated sightings are not extra messages. The dictionary explains every exported field.” |
| 0:55–1:25 | Select a challenge, open a category and inspect a message’s source, timestamp and snapshot membership | “Changing the challenge changes the sampled evidence and its denominator. Each finding leads to the underlying paraphrases and provenance. These are coded messages, not verified people, teams or a popularity ranking.” |
| 1:25–1:40 | H-E-B participation lens or coverage view | “Eleven H-E-B participation posts contain nine reported labels within that channel. They are self-reports, not nine verified entrants. All channel samples remain partial, so we do not calculate activity rates.” |
| 1:40–1:50 | Separate Simulation panel and synthetic folder | “The nine-team scenario is clearly marked synthetic. It illustrates possible team-level questions and never contributes to observed counts. No teams were contacted to make it.” |
| 1:50–2:00 | Repository README, dataset folder and export action | “The repository includes the working app, original JSON, CSV, workbook, data dictionary, method and file hashes. The goal is traceable discussion evidence with its limits visible.” |

Keep the cursor and text legible. Show one complete filter-to-evidence interaction. Decorative carousel motion is a design choice, not a live feed or a measure of engagement. Paraphrases and editorial lines are not attributed verbatim participant quotations. Use a paused/static view if movement makes the evidence hard to read.

Before recording the final sentence, confirm the workbook and final dataset revision are actually in the repository. Do not present a local preview as a published original website URL. If demonstrating original Discord material, avoid participant handles, avatars or unrelated chat; the packaged evidence can demonstrate provenance without displaying those details.

After recording, verify the video plays and add its real URL to the actual Devpost submission along with the GitHub link. Video, exact submission deadline and submission receipt remain pending or unverified until established. The [official participant guide](${guideUrl}) is the source for the roughly two-minute demo requirement.
`);

async function inventoryFiles(directory, prefix='') {
  const result=[];
  for(const entry of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
    const relative=prefix?`${prefix}/${entry.name}`:entry.name;
    if(relative==='MANIFEST.json')continue;
    if(entry.isDirectory())result.push(...await inventoryFiles(path.join(directory,entry.name),relative));
    else if(entry.isFile()) {
      const bytes=await readFile(path.join(directory,entry.name));
      const table=tables.find(item=>item.path===relative);
      result.push({path:relative,bytes:bytes.length,sha256:sha256(bytes),...(table?{table:table.name,record_count:table.records.length}:{}),...(relative==='DATA_DICTIONARY.csv'?{record_count:dictionary.length}:{}),...(relative==='observed/category-codebook.csv'?{record_count:observedCategories.length}:{})});
    }
  }
  return result;
}
const files = await inventoryFiles(destination);
const manifest = {
  schema_version:1,
  package:'Participant Pulse analytical dataset',
  generated_at_utc:new Date().toISOString(),
  requirements_review_date:reviewDate,
  generated_by:'scripts/package-dataset.mjs',
  hash_algorithm:'SHA-256',
  paths_relative_to:'dataset/',
  manifest_excludes_itself:true,
  source_json_copies:'Byte-for-byte copies; originals are relative to the repository root.',
  inventory,
  source_files:sources.map(item=>({original_path:item.original,packaged_path:item.packaged,collection:item.collection,record_count:item.data[item.collection].length,bytes:item.bytes.length,sha256:sha256(item.bytes),copy_sha256:files.find(file=>file.path===item.packaged).sha256})),
  tables:tables.map(({name,path:tablePath,classification,source:sourcePath,sourceCollection,records})=>({name,path:tablePath,classification,source_path:sourcePath,source_collection:sourceCollection,record_count:records.length,field_count:fields(records).length})),
  dictionary_field_count:dictionary.length,
  workbook:{path:'Participant_Pulse_Dataset.xlsx',included:files.some(file=>file.path==='Participant_Pulse_Dataset.xlsx'),note:'Built separately; rerun packaging after workbook changes to refresh its hash.'},
  files
};
await save('MANIFEST.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Packaged ${inventory.observed_message_rows} unique messages, ${inventory.snapshots} snapshots, ${inventory.snapshot_membership_rows} memberships, ${inventory.synthetic_team_rows} synthetic teams and ${inventory.synthetic_team_challenge_rows} synthetic selections.`);
console.log(`${dictionary.length} dictionary fields; ${files.length} hashed package files; workbook ${manifest.workbook.included?'included':'not yet present'}.`);
console.log(destination);
