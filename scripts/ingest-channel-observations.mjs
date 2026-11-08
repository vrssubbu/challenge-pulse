// Maintenance of explicitly observed UI records. This script does not generate observations.
import {readFile,writeFile} from 'node:fs/promises';
import {validateMessage,mergeMessages,CHALLENGE_IDS} from '../dist/model.js';
const dataDir=new URL('../dist/data/',import.meta.url);
const load=async name=>JSON.parse(await readFile(new URL(name,dataDir),'utf8'));
const coding=await load('discord-message-coding.json'),coverage=await load('discord-observations.json');
const input=JSON.parse(await readFile(new URL('./observed-channel-batches.json',import.meta.url),'utf8'));
const snapshots=new Map((coding.snapshots??[]).map(s=>[s.snapshot_id,s]));
let records=coding.records.map(validateMessage);
for(const batch of input.batches){
 if(!CHALLENGE_IDS.includes(batch.challenge_id))throw new Error('Unknown batch challenge');
 const channel_url=`https://discord.com/channels/755441182951211028/${batch.channel_id}`;
 const incoming=batch.rows.map(([message_id,display_date,display_time,display_alias,category,paraphrase,reply_to_message_id,reported_team_alias=null])=>validateMessage({
  message_id,challenge_id:batch.challenge_id,source_type:'discord_ui_observation',source_url:`${channel_url}/${message_id}`,channel_url,
  display_date,display_time,timezone:null,captured_at:batch.captured_at,display_alias,category,paraphrase,reply_to_message_id,
  identity_unit:'Observed display label within this channel, not a verified account, person or team',collector:'assistant',
  collection_method:'Assistant reading of the authorized native Chrome Discord interface',coding_method:'Single-assistant qualitative coding of visible message content',
  human_reviewed:false,snapshot_ids:[batch.snapshot_id],author_role:'unknown',role_evidence:null,reported_team_alias,reported_team_alias_scope:reported_team_alias?batch.reported_team_alias_scope:null
 }));
 const merged=mergeMessages(records,incoming);records=merged.records;
 const ordered=[...incoming].sort((a,b)=>(a.display_date+'T'+a.display_time).localeCompare(b.display_date+'T'+b.display_time));
 const point=r=>r?{date:r.display_date,time:r.display_time}:null;
 snapshots.set(batch.snapshot_id,{snapshot_id:batch.snapshot_id,label:batch.label,challenge_id:batch.challenge_id,captured_at:batch.captured_at,
  observed_on_local:batch.observed_on_local,observation_timezone:batch.observation_timezone,coverage_status:'partial',collection_method:'discord_loaded_accessibility_tree',
  message_ids:incoming.map(r=>r.message_id),observed_messages:incoming.length,displayed_start:point(ordered[0]),displayed_end:point(ordered.at(-1)),
  timezone:null,timezone_verified:false,channel_start_seen:batch.channel_start_seen,channel_end_seen:batch.channel_end_seen,threads_inspected:batch.threads_inspected,coverage_note:batch.coverage_note});
}
coding.records=records;coding.snapshots=[...snapshots.values()];coverage.snapshots=coding.snapshots;
const readChannels=new Set(records.map(r=>r.challenge_id));
const collectionDates=[...new Set(coding.snapshots.map(s=>s.observed_on_local).filter(Boolean))].sort();
const reactionRows=records.filter(r=>r.reaction_count_observed!==null);
const sampling=`${records.length} unique message items from bounded loaded Discord samples in ${readChannels.size} of eight challenge channels. Repeated sightings are deduplicated by message ID. Samples have different displayed time spans and do not establish full-channel or common-interval coverage.`;
const metadata={...coding.metadata,source_channel_url:null,source_channel_urls:[...new Set(records.map(r=>r.channel_url))],collection_date_local:collectionDates.length===1?collectionDates[0]:null,first_collection_date_local:collectionDates[0],collection_dates_local:collectionDates,latest_observation_date_local:collectionDates.at(-1),snapshot_count:coding.snapshots.length,sampling,
 identity_note:'Aliases identify rendered display labels within a channel. Prefixes prevent accidental cross-channel matches; they are not verified people or teams and must not be summed as unique participants.',
 reaction_note:`Latest reaction readings cover ${reactionRows.length} of ${records.length} message items. Counts across emoji are reaction events, not unique reactors. Missing readings stay null; no growth or velocity is estimated.`,
 navigation_attempt_note:'Earlier navigation attempts were blocked. Newly acquired channel samples are recorded individually; channels without message evidence remain unread.',
 limits:[`${8-readChannels.size} challenge channels have no inspected message content; missing activity remains null, not zero`,
 'No messages-per-hour calculation: sampled time spans are not complete observation intervals',
 'No cross-challenge popularity or competition ranking; loaded sample sizes reflect acquisition coverage',
 'No total participant, team, entrant or valid-submission counts; participant claims are not verified counts',
 'No inferred mental health, numerical difficulty, prize motivation or personal winning probability',
 'Categories are single-assistant content interpretations, not independently human-validated responses']};
coding.metadata=metadata;coverage.metadata={...coverage.metadata,...metadata};
for(const summary of coverage.records){
 const rows=records.filter(r=>r.challenge_id===summary.challenge_id),channelSnapshots=coding.snapshots.filter(s=>s.challenge_id===summary.challenge_id);
 if(!rows.length)continue;
 const aliases={},categories={};for(const r of rows){aliases[r.display_alias]=(aliases[r.display_alias]??0)+1;categories[r.category]=(categories[r.category]??0)+1;}
 const ordered=[...rows].sort((a,b)=>(a.display_date+'T'+a.display_time).localeCompare(b.display_date+'T'+b.display_time)),first=ordered[0],last=ordered.at(-1);
 const reactionRows=rows.filter(r=>r.reaction_count_observed!==null);
 const participationRows=rows.filter(r=>r.category==='participation_confirmation'),reportedLabels=participationRows.filter(r=>r.reported_team_alias!==null),labelScopes=[...new Set(reportedLabels.map(r=>r.reported_team_alias_scope))];
 Object.assign(summary,{source_url:rows[0].channel_url,source_url_verification:'Channel message interface read',coverage_status:'partial',
  coverage_note:channelSnapshots.map(s=>s.coverage_note).join(' '),captured_at:null,
  displayed_date:first.display_date===last.display_date?first.display_date:`${first.display_date} to ${last.display_date}`,
  first_displayed_date:first.display_date,last_displayed_date:last.display_date,first_displayed_time:first.display_time,last_displayed_time:last.display_time,
  window_start:null,window_end:null,timezone:null,observed_messages:rows.length,distinct_display_labels:Object.keys(aliases).length,
  display_label_message_counts:aliases,largest_display_label_message_share:Math.max(...Object.values(aliases))/rows.length,
  concentration_note:'Largest within-channel display-label share of the inspected messages; not verified account or team concentration.',category_counts:categories,
  participant_count:null,team_count:null,entrant_count:null,messages_per_hour:null,snapshot_ids:channelSnapshots.map(s=>s.snapshot_id),snapshot_count:channelSnapshots.length,
  reaction_counted_messages:reactionRows.length||null,reaction_count_sum_observed:reactionRows.length?reactionRows.reduce((n,r)=>n+r.reaction_count_observed,0):null,
  reaction_coverage_note:reactionRows.length?`Reaction counts were inspected for ${reactionRows.length} of ${rows.length} messages. The sum covers only these readings and is not a unique-reactor or whole-sample count.`:null,
  participation_report_messages:participationRows.length,reported_team_label_count:labelScopes.length===1?new Set(reportedLabels.map(r=>r.reported_team_alias)).size:null,reported_team_alias_scope:labelScopes.length===1?labelScopes[0]:null,
  participation_coverage_note:participationRows.length?'Explicit participation-message self-reports in this channel sample. Repeated posts using the same reported label are grouped within the stated scope. These are not verified teams, entries, membership or an event census.':'No explicit participation-confirmation category was assigned in the inspected sample; this is not evidence of nonparticipation.'});
}
coding.coding_scheme.definitions.logistics_request='A request about registration, scheduling, submission access or other participation logistics; no organizer role is inferred.';
coding.coding_scheme.definitions.rule_clarification='A question or explanation about challenge rules or deliverable requirements; author authority is not implied.';
coding.coding_scheme.definitions.other='Readable message content outside the specific categories; unverified numerical claims remain text claims, not measured participation.';
coding.coding_scheme.definitions.participation_confirmation='An explicit self-report in response to a participation prompt. Pseudonymous reported team labels are scoped to that channel collection; neither membership nor entry is verified.';
coding.coding_scheme.definitions.help_request='An explicit request for assistance or resources. Message presence does not establish whether the issue was later resolved.';
coding.coding_scheme.definitions.score_request='A request for other participants to share scores. The question itself does not verify scores or request an official leaderboard.';
await writeFile(new URL('discord-message-coding.json',dataDir),JSON.stringify(coding,null,2)+'\n');
await writeFile(new URL('discord-observations.json',dataDir),JSON.stringify(coverage,null,2)+'\n');
console.log(JSON.stringify({messages:records.length,read_channels:readChannels.size,snapshots:coding.snapshots.length,by_channel:Object.fromEntries(coverage.records.map(r=>[r.challenge_id,r.observed_messages]))}));
