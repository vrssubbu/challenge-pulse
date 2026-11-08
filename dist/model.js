export const CHALLENGE_IDS=['revs-casino','dashboard-royale','build-a-dataset','house-edge','heads-up','hitachi','heb','databricks'];
const CHANNEL_IDS={'revs-casino':'1567712707728375929','dashboard-royale':'1567712613171859527','build-a-dataset':'1567718000117809214','house-edge':'1567712548252295198','heads-up':'1567712256412749935','hitachi':'1567713790177320992','heb':'1567713269240692846','databricks':'1567718421980778667'};
export const CATEGORY_LABELS={social_banter:'Social conversation',strategy_discussion:'Strategy discussion',progress_report:'Reported progress',collaboration:'Collaboration',participation_confirmation:'Participation self-report',unclassified_media:'Unclassified media',leaderboard_request:'Leaderboard request',score_request:'Score request',help_request:'Help request',rule_clarification:'Rules clarification',logistics_request:'Logistics request',organizer_update:'Organizer update',other:'Other'};
export function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
export function validateMessage(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Each record must be a message object.');
 if(typeof raw.message_id!=='string'||!/^\d{10,25}$/.test(raw.message_id))throw new Error('A Discord message ID stored as text is required. Choose message records, not a coverage export.');
 if(raw.source_type!=='discord_ui_observation')throw new Error('source_type must truthfully identify discord_ui_observation. Other source types cannot be relabeled as observations.');
 if(raw.is_observed===false||raw.scenario_only===true)throw new Error('Synthetic or scenario-only records cannot be imported as observed messages.');
 if(!CHALLENGE_IDS.includes(raw.challenge_id))throw new Error('Unknown challenge_id.');
 if(!Object.hasOwn(CATEGORY_LABELS,raw.category))throw new Error('Unknown content category.');
 if(typeof raw.paraphrase!=='string'||!raw.paraphrase.trim()||raw.paraphrase.length>1000)throw new Error('A paraphrase of 1–1000 characters is required.');
 if(typeof raw.display_alias!=='string'||!/^[A-Za-z0-9_-]{1,30}$/.test(raw.display_alias))throw new Error('Use a short anonymous display_alias (letters, numbers, underscores or hyphens).');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(raw.display_date??''))throw new Error('display_date must be YYYY-MM-DD.');
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(raw.display_time??''))throw new Error('display_time must be HH:mm.');
 if(Number.isNaN(Date.parse(`${raw.display_date}T00:00:00Z`))||new Date(`${raw.display_date}T00:00:00Z`).toISOString().slice(0,10)!==raw.display_date)throw new Error('display_date is invalid.');
 const source_url=safeUrl(raw.source_url);if(!source_url||!/^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/.test(source_url))throw new Error('source_url must link to a Discord message.');
 if(!source_url.endsWith('/'+raw.message_id))throw new Error('Source URL and message_id do not match.');
 if(!source_url.startsWith(`https://discord.com/channels/755441182951211028/${CHANNEL_IDS[raw.challenge_id]}/`))throw new Error('Source channel does not match the selected TAMU Datathon challenge.');
 if(raw.timezone!==null&&raw.timezone!==undefined){if(typeof raw.timezone!=='string')throw new Error('timezone must be a valid timezone name or null.');try{new Intl.DateTimeFormat('en',{timeZone:raw.timezone});}catch{throw new Error('timezone must be a valid timezone name or null.');}}
 if(raw.reply_to_message_id!==null&&raw.reply_to_message_id!==undefined&&(typeof raw.reply_to_message_id!=='string'||!/^\d{10,25}$/.test(raw.reply_to_message_id)))throw new Error('reply_to_message_id must be a text ID or null.');
 const snapshot_ids=raw.snapshot_ids??[];if(!Array.isArray(snapshot_ids)||snapshot_ids.length>100||snapshot_ids.some(id=>typeof id!=='string'||! /^[a-zA-Z0-9_-]{1,80}$/.test(id)))throw new Error('snapshot_ids must contain at most 100 short snapshot identifiers.');
 const author_role=raw.author_role??'unknown';if(!['unknown','organizer'].includes(author_role))throw new Error('author_role must be unknown or organizer.');
 const role_evidence=raw.role_evidence??null;if(role_evidence!==null&&(typeof role_evidence!=='string'||!role_evidence.trim()||role_evidence.length>1000))throw new Error('role_evidence must be nonempty text up to 1000 characters, or null.');
 if(author_role==='organizer'&&!role_evidence)throw new Error('An organizer role requires explicit observed role evidence.');
 if(raw.category==='organizer_update'&&author_role!=='organizer')throw new Error('The organizer_update category requires an organizer role with explicit observed role evidence.');
 const reported_team_alias=raw.reported_team_alias??null,reported_team_alias_scope=raw.reported_team_alias_scope??null;
 if(reported_team_alias!==null){if(typeof reported_team_alias!=='string'||!/^[A-Za-z0-9_-]{1,30}$/.test(reported_team_alias))throw new Error('reported_team_alias must be a short anonymous label or null.');if(typeof reported_team_alias_scope!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(reported_team_alias_scope))throw new Error('A reported team alias requires a short explicit scope identifier.');if(raw.category!=='participation_confirmation')throw new Error('A reported team alias is only counted for an explicit participation self-report.');}
 else if(reported_team_alias_scope!==null)throw new Error('reported_team_alias_scope must be null when no alias is recorded.');
 const reactions={};for(const key of ['reaction_count_observed','reaction_types_observed']){const v=raw[key]??null;if(v!==null&&(!Number.isInteger(v)||v<0||v>10000000))throw new Error(`${key} must be a nonnegative whole number or null.`);reactions[key]=v;}
 for(const key of ['reaction_observed_on_local','reaction_observed_timezone','reaction_capture_time','reaction_snapshot_id'])reactions[key]=raw[key]??null;
 if(reactions.reaction_count_observed!==null){if(!/^\d{4}-\d{2}-\d{2}$/.test(reactions.reaction_observed_on_local??'')||Number.isNaN(Date.parse(reactions.reaction_observed_on_local+'T00:00:00Z'))||new Date(reactions.reaction_observed_on_local+'T00:00:00Z').toISOString().slice(0,10)!==reactions.reaction_observed_on_local)throw new Error('Reaction counts require a valid observation date.');try{if(typeof reactions.reaction_observed_timezone!=='string')throw new Error();new Intl.DateTimeFormat('en',{timeZone:reactions.reaction_observed_timezone});}catch{throw new Error('Reaction counts require an observation timezone.');}if(typeof reactions.reaction_snapshot_id!=='string'||!snapshot_ids.includes(reactions.reaction_snapshot_id))throw new Error('Reaction counts must identify a listed snapshot.');}
 if(reactions.reaction_types_observed!==null&&(reactions.reaction_count_observed===null||reactions.reaction_types_observed>reactions.reaction_count_observed))throw new Error('Reaction type count must not exceed the observed count.');
 if(reactions.reaction_capture_time!==null&&(typeof reactions.reaction_capture_time!=='string'||Number.isNaN(Date.parse(reactions.reaction_capture_time))))throw new Error('Reaction capture time must be a valid timestamp or null.');
 const provenance={};for(const key of ['collector','collection_method','coding_method','identity_unit','reaction_observation_note']){if(raw[key]!==undefined&&raw[key]!==null){if(typeof raw[key]!=='string'||raw[key].length>1000)throw new Error(`${key} must be text up to 1000 characters, or null.`);provenance[key]=raw[key];}else provenance[key]=null;}
 if(raw.captured_at!==undefined&&raw.captured_at!==null&&(typeof raw.captured_at!=='string'||Number.isNaN(Date.parse(raw.captured_at))))throw new Error('captured_at must be a valid timestamp or null.');
 return {message_id:raw.message_id,challenge_id:raw.challenge_id,source_type:raw.source_type,source_url,channel_url:source_url.slice(0,source_url.lastIndexOf('/')),display_date:raw.display_date,display_time:raw.display_time,timezone:raw.timezone??null,captured_at:raw.captured_at??null,display_alias:raw.display_alias,category:raw.category,paraphrase:raw.paraphrase.trim(),reply_to_message_id:raw.reply_to_message_id??null,human_reviewed:raw.human_reviewed===true,snapshot_ids:[...new Set(snapshot_ids)],author_role,role_evidence,reported_team_alias,reported_team_alias_scope,...reactions,...provenance};
}
export function parseImport(input){if(input?.schema_version!==undefined&&input.schema_version!==1)throw new Error('Unsupported schema version.');const rows=Array.isArray(input)?input:input?.records;if(!Array.isArray(rows))throw new Error('The JSON must contain a records array.');if(rows.length>10000)throw new Error('Import up to 10,000 messages at a time.');return rows.map((r,i)=>{try{return validateMessage(r);}catch(e){throw new Error(`Record ${i+1}: ${e.message}`);}});}
export function mergeMessages(existing,incoming){
 const map=new Map(existing.map(r=>[r.message_id,r]));let added=0,updated=0,skipped=0;
 const reactionKeys=['reaction_count_observed','reaction_types_observed','reaction_observed_on_local','reaction_observed_timezone','reaction_capture_time','reaction_snapshot_id','reaction_observation_note'];
 for(const r of incoming){
  const old=map.get(r.message_id);
  if(!old){map.set(r.message_id,r);added++;continue;}
  const keys=['challenge_id','category','paraphrase','display_alias','display_date','display_time','source_url','timezone','reply_to_message_id','reported_team_alias','reported_team_alias_scope'];
  if(keys.some(k=>old[k]!==r[k]))throw new Error(`Message ${r.message_id} conflicts with an existing record. Review the source and correct the file before merging.`);
  const next={...old,snapshot_ids:[...new Set([...(old.snapshot_ids??[]),...(r.snapshot_ids??[])])]};
  const oldKnown=old.reaction_count_observed!==null&&old.reaction_count_observed!==undefined,incomingKnown=r.reaction_count_observed!==null&&r.reaction_count_observed!==undefined;
  let replaceReaction=!oldKnown&&incomingKnown;
  if(oldKnown&&incomingKnown){
   if(old.reaction_observed_timezone!==r.reaction_observed_timezone)throw new Error(`Reaction readings for message ${r.message_id} use different observation timezones. Review their ordering before merging.`);
   if(r.reaction_observed_on_local===old.reaction_observed_on_local&&(r.reaction_count_observed!==old.reaction_count_observed||r.reaction_types_observed!==old.reaction_types_observed))throw new Error(`Message ${r.message_id} has different reaction counts on the same observation date. Exact ordering is not established; review the readings before merging.`);
   replaceReaction=r.reaction_observed_on_local>old.reaction_observed_on_local;
  }
  if(replaceReaction)for(const key of reactionKeys)next[key]=r[key]??null;
  const oldRole=old.author_role??'unknown',newRole=r.author_role??'unknown';
  if(oldRole!=='unknown'&&newRole!=='unknown'&&oldRole!==newRole)throw new Error(`Message ${r.message_id} has conflicting author roles; review role evidence before merging.`);
  if(oldRole==='unknown'&&newRole!=='unknown'){next.author_role=newRole;next.role_evidence=r.role_evidence;}
  if(r.human_reviewed===true)next.human_reviewed=true;
  for(const key of ['collector','collection_method','coding_method','identity_unit'])if(next[key]==null&&r[key]!=null)next[key]=r[key];
  const changed=JSON.stringify(next)!==JSON.stringify(old);
  map.set(r.message_id,next);if(changed)updated++;else skipped++;
 }
 return{records:[...map.values()].sort((a,b)=>a.message_id.localeCompare(b.message_id)),added,updated,skipped};
}
export function summarize(records){const counts={};for(const r of records)counts[r.category]=(counts[r.category]??0)+1;return{messages:records.length,channels:new Set(records.map(r=>r.challenge_id)).size,category_counts:counts,leaderboard_requests:counts.leaderboard_request??0};}
export function csv(records){const fields=['message_id','challenge_id','display_date','display_time','timezone','display_alias','category','reported_team_alias','reported_team_alias_scope','paraphrase','source_url','source_type','snapshot_ids','author_role','role_evidence','reaction_count_observed','reaction_types_observed','reaction_observed_on_local','reaction_observed_timezone','reaction_capture_time','reaction_snapshot_id','captured_at','collection_method','coding_method','human_reviewed'];const cell=v=>{let s=v==null?'':Array.isArray(v)?JSON.stringify(v):String(v);if(/^[=+@\-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};return [fields.map(cell).join(','),...records.map(r=>fields.map(k=>cell(r[k])).join(','))].join('\r\n');}
export function equalChanceTopThree(n){return Number.isInteger(n)&&n>=1&&n<=100000?Math.min(3,n)/n:null;}
