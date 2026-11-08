export const LENSES = [
  {id:'all',label:'All content',categories:null},
  {id:'questions',label:'Questions & clarification',categories:['help_request','rule_clarification','leaderboard_request','score_request','logistics_request']},
  {id:'participation',label:'Participation mentions',categories:['participation_confirmation']},
  {id:'progress',label:'Reported progress',categories:['progress_report']},
  {id:'strategy',label:'Strategy & teamwork',categories:['strategy_discussion','collaboration']},
  {id:'community',label:'Social & media',categories:['social_banter','unclassified_media']},
  {id:'updates',label:'Organizer updates',categories:['organizer_update']}
];

export const THEMES = [
  {id:'clarity',title:'What is being clarified?',categories:['help_request','rule_clarification','logistics_request'],label:'Help, rules or logistics discussion',icon:'?',action:'Inspect the discussion to distinguish questions, answers and explanations before deciding what resource would help.'},
  {id:'leaderboard',title:'What standings or scores are being requested?',categories:['leaderboard_request','score_request'],label:'Leaderboard or score requests',icon:'↗',action:'Inspect which standings or scores are being requested. These posts do not establish team performance or entrant counts.'},
  {id:'building',title:'What are people trying?',categories:['strategy_discussion','progress_report','collaboration'],label:'Strategy, progress or collaboration messages',icon:'◇',action:'Explore the approaches people mention. Their outcomes and team membership are not verified.'},
  {id:'participation',title:'Who explicitly signaled participation?',categories:['participation_confirmation'],label:'Self-reported participation posts',icon:'◎',action:'Inspect the participation posts. Reported team labels do not establish membership, eligibility or valid submissions.'}
];

export function labelForCategory(id,labels={}) {
  return labels[id]??String(id).replaceAll('_',' ').replace(/^./,c=>c.toUpperCase());
}

export function themeSummaries(rows) {
  return THEMES.map(theme=>({...theme,count:rows.filter(r=>theme.categories.includes(r.category)).length,denominator:rows.length}));
}

export function sampledDisplaySpan(rows) {
  const valid=rows.filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r.display_date??'')&&/^\d{2}:\d{2}$/.test(r.display_time??''));
  if(!valid.length)return null;
  const ordered=[...valid].sort((a,b)=>`${a.display_date}T${a.display_time}`.localeCompare(`${b.display_date}T${b.display_time}`));
  const first=ordered[0],last=ordered.at(-1),zones=new Set(valid.map(r=>r.timezone??null));
  return {start_date:first.display_date,start_time:first.display_time,end_date:last.display_date,end_time:last.display_time,timezone:zones.size===1&&!zones.has(null)?[...zones][0]:null};
}

export function participationSummary(rows,challenge='all') {
  const posts=rows.filter(r=>r.category==='participation_confirmation'&&(challenge==='all'||r.challenge_id===challenge));
  const labeled=posts.filter(r=>typeof r.reported_team_alias==='string'&&r.reported_team_alias);
  const scopes=new Set(labeled.map(r=>r.reported_team_alias_scope??null));
  const hasSample=rows.some(r=>r.challenge_id===challenge);
  const comparable=challenge!=='all'&&hasSample&&(!labeled.length||(scopes.size===1&&!scopes.has(null)));
  return {messages:posts.length,reported_label_count:comparable?new Set(labeled.map(r=>r.reported_team_alias)).size:null,scope:comparable&&scopes.size===1?[...scopes][0]:null,posts_without_label:posts.length-labeled.length};
}

export function displayTimeBuckets(rows) {
  const map=new Map();
  for(const row of rows) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(row.display_date??'')||!/^\d{2}:\d{2}$/.test(row.display_time??''))continue;
    const key=`${row.display_date}T${row.display_time.slice(0,2)}`;
    const bucket=map.get(key)??{key,date:row.display_date,hour:row.display_time.slice(0,2)+':00',message_ids:[]};
    bucket.message_ids.push(row.message_id);
    map.set(key,bucket);
  }
  return [...map.values()].sort((a,b)=>a.key.localeCompare(b.key)).map(b=>({...b,count:b.message_ids.length}));
}

export function filterMessages(rows,filters={},snapshots=[],importedIds=new Set()) {
  const lens=LENSES.find(l=>l.id===filters.lens);
  const snapshot=snapshots.find(s=>s.snapshot_id===filters.snapshot);
  const authoritativeIds=new Set(snapshot?.message_ids??[]);
  const categories=Array.isArray(filters.categories)?filters.categories:null;
  const query=String(filters.query??'').trim().toLowerCase();
  return rows.filter(row=>
    (!filters.challenge||filters.challenge==='all'||row.challenge_id===filters.challenge)&&
    (!filters.category||filters.category==='all'||row.category===filters.category)&&
    (!categories||categories.includes(row.category))&&
    (!lens?.categories||lens.categories.includes(row.category))&&
    (!filters.role||filters.role==='all'||(row.author_role??'unknown')===filters.role)&&
    (!query||`${row.paraphrase} ${row.reported_team_alias??''}`.toLowerCase().includes(query))&&
    (!filters.snapshot||filters.snapshot==='all'||(filters.snapshot==='imports'?importedIds.has(row.message_id):authoritativeIds.has(row.message_id)))&&
    (!filters.hour||`${row.display_date}T${row.display_time.slice(0,2)}`===filters.hour)
  );
}

export function buildCoverage(challengeIds,baseRecords,messages,importedRecords=[]) {
  return challengeIds.map(id=>{
    const base=baseRecords.find(r=>r.challenge_id===id)??{challenge_id:id,coverage_status:'not_read',coverage_note:'Channel not read. Activity is unknown.'};
    const rows=messages.filter(r=>r.challenge_id===id),imported=importedRecords.some(r=>r.challenge_id===id);
    if(!rows.length)return{...base,observed_messages:base.observed_messages===0&&base.coverage_status!=='not_read'?0:null,distinct_display_labels:null,category_counts:null};
    const counts={};for(const r of rows)counts[r.category]=(counts[r.category]??0)+1;
    return {...base,...(imported?{displayed_date:null,first_displayed_date:null,last_displayed_date:null,first_displayed_time:null,last_displayed_time:null,window_start:null,window_end:null,display_label_message_counts:null,largest_display_label_message_share:null,concentration_note:null,reaction_counted_messages:null,reaction_count_sum_observed:null,participation_report_messages:counts.participation_confirmation??0,reported_team_label_count:null,reported_team_alias_scope:null,participation_coverage_note:'Message posts include imported records. Combined reported-label scope is not independently verified; no aggregate team-label count is exported.',captured_at:null,timezone:null}:{}),coverage_status:imported?'partial':base.coverage_status==='not_read'?'partial':base.coverage_status,observed_messages:rows.length,distinct_display_labels:imported?null:base.distinct_display_labels??null,category_counts:counts,coverage_note:imported?'Partial samples merged on this device. Alias scope, reaction readings and observation windows may differ; combined identity/reaction aggregates and observation intervals are not established.':base.coverage_note,messages_per_hour:null,team_count:null,entrant_count:null};
  });
}
