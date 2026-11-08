// Records only the UI observations reported by the collection session.
// This is a deterministic maintenance script, not an observation generator.
import {readFile,writeFile} from 'node:fs/promises';
const dataDir=new URL('../dist/data/',import.meta.url);
const read=async name=>JSON.parse(await readFile(new URL(name,dataDir),'utf8'));
const messages=await read('discord-message-coding.json');
const coverage=await read('discord-observations.json');
if(messages.records.length!==10||messages.records.some(r=>r.challenge_id!=='revs-casino'))throw new Error('This maintenance script only applies to the original ten-message Rev sample.');
const ids=messages.records.map(r=>r.message_id);
const common={challenge_id:'revs-casino',captured_at:null,coverage_status:'partial',collection_method:'discord_loaded_accessibility_tree',message_ids:ids,observed_messages:ids.length,displayed_start:{date:'2026-11-07',time:'22:47'},displayed_end:{date:'2026-11-07',time:'23:22'},timezone:null,timezone_verified:false,channel_start_seen:false,channel_end_seen:false,threads_inspected:false};
const snapshots=[
 {...common,snapshot_id:'revs-initial-001',label:'Initial Rev sample · Nov 7',observed_on_local:'2026-11-07',observation_timezone:'America/Chicago',coverage_note:'Ten distinct messages from a bounded visible channel sample. Neither full channel history nor continuous time coverage was established. Exact capture time was not recorded.'},
 {...common,snapshot_id:'revs-reread-20261108',label:'Rev sample reread · Nov 8',observed_on_local:'2026-11-08',observation_timezone:'America/Chicago',coverage_note:'The same ten-message visible sample was read again. Two message reaction counts were inspected. Navigation to the other challenge contents was blocked by the UI tool; no additional channel messages were acquired. Exact capture time was not recorded.'}
];
const reactionEvidence={
 '1568858133911175270':{count:15,types:2,note:'12 heavy-plus-sign reactions plus 3 custom-image reactions were displayed. Their sum is 15 reaction events, not 15 unique reactors.'},
 '1568851951876051077':{count:1,types:1,note:'One custom-image reaction was displayed. This is a reaction count, not a verified person or team count.'}
};
for(const record of messages.records){
 record.snapshot_ids=snapshots.map(s=>s.snapshot_id);
 record.author_role='unknown';record.role_evidence=null;
 const r=reactionEvidence[record.message_id];
 Object.assign(record,{reaction_count_observed:r?.count??null,reaction_types_observed:r?.types??null,reaction_observed_on_local:r?'2026-11-08':null,reaction_observed_timezone:r?'America/Chicago':null,reaction_capture_time:null,reaction_snapshot_id:r?'revs-reread-20261108':null,reaction_observation_note:r?.note??null});
}
const metadata={...messages.metadata,collection_dates_local:['2026-11-07','2026-11-08'],latest_observation_date_local:'2026-11-08',sampling:'Ten unique messages from one bounded visible Rev’s Casino sample, read on two occasions. Repeated sightings do not add messages. No full channel history, complete time interval or other challenge content was acquired.',snapshot_count:2,reaction_note:'Latest observed reaction counts cover only two of ten sampled messages. Counts across emoji are reaction events, not unique reactors. Exact capture times are unavailable, so no reaction growth or velocity is estimated.',navigation_attempt_note:'Attempts to navigate to other challenge message contents were blocked by the UI tool. Sidebar channel links are known, but the seven other channels remain unread.'};
messages.metadata=metadata;messages.snapshots=snapshots;
coverage.metadata={...coverage.metadata,...metadata};coverage.snapshots=snapshots;
for(const record of coverage.records){
 const observed=record.challenge_id==='revs-casino';
 record.snapshot_ids=observed?snapshots.map(s=>s.snapshot_id):[];
 record.snapshot_count=observed?2:0;
 record.reaction_counted_messages=observed?2:null;
 record.reaction_count_sum_observed=observed?16:null;
 record.reaction_coverage_note=observed?'Reaction counts were read for two of ten sampled messages on November 8. The sum 16 counts emoji reactions across these two messages, not unique reactors or a complete sample reaction total.':null;
 if(observed)record.coverage_note=metadata.sampling;
}
await writeFile(new URL('discord-message-coding.json',dataDir),JSON.stringify(messages,null,2)+'\n');
await writeFile(new URL('discord-observations.json',dataDir),JSON.stringify(coverage,null,2)+'\n');
console.log(JSON.stringify({unique_messages:messages.records.length,snapshots:snapshots.length,reaction_counted_messages:2,other_channels_still_unread:7}));
