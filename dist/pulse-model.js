export const LENSES = [
  {id:'all',label:'All content',categories:null},
  {id:'questions',label:'Questions & requests',categories:['help_request','rule_clarification','leaderboard_request','logistics_request']},
  {id:'progress',label:'Reported progress',categories:['progress_report']},
  {id:'strategy',label:'Strategy & teamwork',categories:['strategy_discussion','collaboration']},
  {id:'community',label:'Social & media',categories:['social_banter','unclassified_media']},
  {id:'updates',label:'Organizer updates',categories:['organizer_update']}
];

export const THEMES = [
  {id:'clarity',title:'What needs clarification?',categories:['help_request','rule_clarification','logistics_request'],label:'Help, rules or logistics requests',icon:'?',action:'Inspect the requests before deciding which explanation or resource would help.'},
  {id:'leaderboard',title:'Who is asking for the standings?',categories:['leaderboard_request'],label:'Explicit leaderboard requests',icon:'↗',action:'A current leaderboard may address these messages. Requests do not establish entrant counts.'},
  {id:'building',title:'What are people trying?',categories:['strategy_discussion','progress_report','collaboration'],label:'Strategy, progress or collaboration messages',icon:'◇',action:'Explore the approaches people mention. Their outcomes and team membership are not verified.'}
];

export function labelForCategory(id,labels={}) {
  return labels[id]??String(id).replaceAll('_',' ').replace(/^./,c=>c.toUpperCase());
}

export function themeSummaries(rows) {
  return THEMES.map(theme=>({...theme,count:rows.filter(r=>theme.categories.includes(r.category)).length,denominator:rows.length}));
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
    (!query||row.paraphrase.toLowerCase().includes(query))&&
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
    return {...base,...(imported?{displayed_date:null,first_displayed_time:null,last_displayed_time:null,window_start:null,window_end:null,display_label_message_counts:null,largest_display_label_message_share:null,concentration_note:null,reaction_counted_messages:null,reaction_count_sum_observed:null,captured_at:null,timezone:null}:{}),coverage_status:imported?'partial':base.coverage_status==='not_read'?'partial':base.coverage_status,observed_messages:rows.length,distinct_display_labels:imported?null:base.distinct_display_labels??null,category_counts:counts,coverage_note:imported?'Partial samples merged on this device. Alias scope, reaction readings and observation windows may differ; combined identity/reaction aggregates and observation intervals are not established.':base.coverage_note,messages_per_hour:null,team_count:null,entrant_count:null};
  });
}
