import {CHALLENGE_IDS,CATEGORY_LABELS,safeUrl,parseImport,mergeMessages,summarize,csv,equalChanceTopThree} from './model.js?v=6';
import {LENSES,THEMES,labelForCategory,themeSummaries,sampledDisplaySpan,participationSummary,displayTimeBuckets,filterMessages,buildCoverage} from './pulse-model.js?v=6';
import {renderPulseStories} from './stories.js?v=6';
import {refreshMotion,syncMotion} from './motion.js?v=6';
import {mountSignalReel} from './reel.js?v=6';

const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categoryLabel=id=>labelForCategory(id,CATEGORY_LABELS);
const names=['Rev’s Casino','Dashboard Royale','Build-A-Dataset','House Edge','Heads Up – Poker Bot Tournament','Hitachi: Hack the Highway','HEB Challenge','Best Use of Databricks'];
const shortNames=['Rev’s Casino','Dashboard','Build a Dataset','House Edge','Heads Up','Hitachi','HEB','Databricks'];
const symbols=['♠','▥','✦','♦','♣','↗','♥','◈'];
let catalog=CHALLENGE_IDS.map((id,i)=>({id,name:names[i]}));
let messages=[],observationData={metadata:{},records:[]},messageData={metadata:{}},localMessages=[];
let toastTimer,activeLens='all',activeHour='',activeTheme=null;
let signalReel=null;
const storageKey='challenge-pulse-discord-v1';
const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPreferencePaused=false;
try{motionPreferencePaused=localStorage.getItem('challenge-pulse-motion')==='paused';}catch{}
let motionPaused=motionQuery.matches||motionPreferencePaused;

function showNotice(text){$('load-notice').textContent=text;$('load-notice').hidden=false;}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
function applyMotion(){
  document.documentElement.classList.toggle('motion-paused',motionPaused);
  syncMotion();
  signalReel?.syncMotion();
  $('motion-toggle').setAttribute('aria-pressed',String(motionPaused));
  $('motion-toggle').disabled=motionQuery.matches;
  $('motion-toggle').innerHTML=motionQuery.matches?'Reduced motion on':motionPaused?'<span aria-hidden="true">▷</span> Play motion':'<span aria-hidden="true">Ⅱ</span> Pause motion';
  $('motion-toggle').title=motionQuery.matches?'Your device preference disables decorative motion. All data stays visible.':'Controls decorative animation; the data is a recorded snapshot, not a live feed.';
}
$('motion-toggle').addEventListener('click',()=>{if(motionQuery.matches)return;motionPreferencePaused=!motionPreferencePaused;motionPaused=motionPreferencePaused;applyMotion();try{localStorage.setItem('challenge-pulse-motion',motionPreferencePaused?'paused':'playing');}catch{}});
motionQuery.addEventListener('change',e=>{motionPaused=e.matches||motionPreferencePaused;applyMotion();});
applyMotion();

function showPanel(id,focusHeading=true){
  if(!['overview','explore','evidence','scenario','simulation'].includes(id))id='overview';
  document.querySelectorAll('.panel').forEach(p=>{p.hidden=p.id!==id;p.classList.toggle('active',p.id===id);});
  document.querySelectorAll('.tab').forEach(b=>{b.classList.toggle('active',b.dataset.panel===id);if(b.dataset.panel===id)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  history.replaceState(null,'','#'+id);
  refreshMotion();
  window.scrollTo({top:0,behavior:'auto'});
  if(focusHeading){const heading=$(id).querySelector('h1');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}
}
document.querySelectorAll('[data-panel],[data-go]').forEach(b=>b.addEventListener('click',()=>{
  const panel=b.dataset.panel??b.dataset.go;
  if(b.dataset.go==='explore')openExplorer({challenge:$('challenge-filter').value});
  else showPanel(panel);
}));
document.querySelectorAll('.brand').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPanel('overview');}));
window.addEventListener('hashchange',()=>showPanel(location.hash.slice(1)));
const challengeName=id=>catalog.find(c=>c.id===id)?.name??id;
const snapshots=()=>Array.isArray(messageData.snapshots)?messageData.snapshots:[];
const coverageRecords=()=>buildCoverage(CHALLENGE_IDS,observationData.records,messages,localMessages);
const selectedMessages=()=>filterMessages(messages,{challenge:$('challenge-filter').value});
function displaySpanText(rows){
  const span=sampledDisplaySpan(rows);if(!span)return 'Displayed times not available for this sample';
  const start=`${span.start_date} ${span.start_time}`;
  const end=span.start_date===span.end_date?span.end_time:`${span.end_date} ${span.end_time}`;
  return `Sampled display times: ${start}–${end} · ${span.timezone??'timezone unverified'} · not a continuous window`;
}

function renderConstellation(){
  const focused=document.activeElement?.classList.contains('constellation-node')?document.activeElement.dataset.challenge:null;
  const selected=$('challenge-filter').value,coverage=coverageRecords();
  $('constellation-nodes').innerHTML=CHALLENGE_IDS.map((id,i)=>{
    const item=coverage.find(c=>c.challenge_id===id),n=item?.observed_messages;
    return `<button type="button" class="constellation-node node-${i+1}${selected===id?' selected':''}${n===null?' missing':''}" data-challenge="${id}" aria-pressed="${selected===id}" aria-label="${esc(challengeName(id))}: ${n===null?'no recorded sample':n+' observed messages; partial sample'}"><span class="node-icon" aria-hidden="true">${symbols[i]}</span><span class="node-label">${esc(shortNames[i])}</span><span class="node-count">${n===null?'No sample':n+' observed'}</span></button>`;
  }).join('');
  document.querySelectorAll('.constellation-node').forEach(b=>b.addEventListener('click',()=>{
    $('challenge-filter').value=$('challenge-filter').value===b.dataset.challenge?'all':b.dataset.challenge;
    renderOverview();
  }));
  const row=coverage.find(c=>c.challenge_id===selected);
  $('constellation-selected').textContent=selected==='all'?'Select a challenge · equal node sizes, no popularity ranking':`${challengeName(selected)} · ${row?.observed_messages===null?'no recorded sample':row?.observed_messages+' messages in a partial sample'}`;
  if(focused)document.querySelector(`.constellation-node[data-challenge="${CSS.escape(focused)}"]`)?.focus({preventScroll:true});
}

function renderOverview(){
  if($('hero-message-count'))$('hero-message-count').textContent=messages.length.toLocaleString();
  if($('hero-channel-count'))$('hero-channel-count').textContent=new Set(messages.map(row=>row.challenge_id)).size.toLocaleString();
  const rows=selectedMessages(),stats=summarize(rows),selected=$('challenge-filter').value;
  const coverage=coverageRecords().filter(r=>selected==='all'||r.challenge_id===selected);
  const read=coverage.filter(r=>r.observed_messages!==null).length;
  const labels=coverage.length===1?coverage[0].distinct_display_labels:null;
  const requestCount=filterMessages(rows,{lens:'questions'}).length;
  const pct=stats.messages?Math.round(requestCount/stats.messages*100):null;
  const cards=[
    ['Observed messages',stats.messages||'—',stats.messages?'Distinct IDs in the selected recorded sample':'No message records for this selection','▤'],
    ['Channels with observations',`${read} / ${coverage.length}`,'Recorded coverage; not a channel census','◎'],
    ['Display labels',labels??'—',labels!==null&&labels!==undefined?'Within this channel sample; not people or teams':selected==='all'?'Select one channel; aliases are not combined across channels':'Not comparable across samples or not observed','◇'],
    ['Questions & clarification',stats.messages?requestCount:'—',stats.messages?`${pct}% of ${stats.messages} selected messages; includes answers`:'No sample denominator','↗']
  ];
  $('metrics').innerHTML=cards.map(([label,value,detail,icon],i)=>`<div class="metric" style="--enter-delay:${i*55}ms"><span class="metric-label">${esc(label)}</span><span class="metric-icon" aria-hidden="true">${icon}</span><strong class="metric-value">${esc(value)}</strong><span class="metric-detail">${esc(detail)}</span></div>`).join('');
  $('filter-caption').textContent=stats.messages?`${stats.messages} observed messages · ${stats.channels} sampled channel${stats.channels===1?'':'s'}`:'No messages observed for this selection';
  const unread=coverage.length-read;
  $('coverage-title').textContent=read?(unread?`${read} channel${read===1?' has':'s have'} recorded observations. ${unread} ${unread===1?'remains':'remain'} unread.`:coverage.length===1?'This channel has a recorded partial sample.':`All ${read} challenge channels have recorded partial samples.`):'No channel in this selection has been read.';
  $('coverage-copy').textContent='Missing activity is unknown, not zero. These samples do not establish complete history, participant counts or competitive intensity.';
  const entries=Object.entries(stats.category_counts).sort((a,b)=>b[1]-a[1]);
  $('category-chart').innerHTML=entries.length?entries.map(([key,n],i)=>`<button type="button" class="chart-row category-row" data-category="${esc(key)}" aria-label="Inspect ${n} ${esc(categoryLabel(key))} messages"><span class="chart-label">${esc(categoryLabel(key))}</span><span class="chart-track"><span class="chart-bar" style="width:${n/stats.messages*100}%;--enter-delay:${i*65}ms"></span></span><span class="chart-value">${n} · ${Math.round(n/stats.messages*100)}% <span aria-hidden="true">↗</span></span></button>`).join(''):'<p class="not-observed">No sampled messages for this challenge. No category share can be calculated.</p>';
  document.querySelectorAll('.category-row').forEach(b=>b.addEventListener('click',()=>openExplorer({challenge:selected,category:b.dataset.category})));
  const themes=themeSummaries(rows),actionable=themes.filter(t=>['clarity','leaderboard'].includes(t.id)&&t.count>0).sort((a,b)=>b.count-a.count)[0]??themes.find(t=>t.id==='building'&&t.count>0);
  const insightTitle={clarity:'Discussed help, rules or logistics',leaderboard:'Asked about standings or scores',building:'Discussed approaches or progress'};
  $('sample-insight').innerHTML=actionable?`<div class="insight-number">${Math.round(actionable.count/stats.messages*100)}<span>%</span></div><h3>${esc(insightTitle[actionable.id])}</h3><p class="insight-copy">${actionable.count} of ${stats.messages} messages in this selected sample were coded as ${esc(actionable.label.toLowerCase())}.</p><div class="insight-action"><span class="eyebrow">POSSIBLE NEXT STEP</span><p>${esc(actionable.action)} This is a sample finding, not an event-wide estimate.</p></div><button class="text-button" id="show-leaderboard">Inspect the evidence ↗</button>`:stats.messages?'<h3>No actionable request in these categories</h3><p class="insight-copy">Explore the coded messages and their context. An absent request in this sample does not establish that no one asked elsewhere.</p>':'<h3>Observe before drawing a conclusion</h3><p class="insight-copy">This selection has no coded messages. The dashboard keeps the gap visible.</p>';
  $('show-leaderboard')?.addEventListener('click',()=>openExplorer({challenge:selected,theme:actionable?.id}));
  const participation=participationSummary(rows,selected);
  $('theme-cards').innerHTML=themes.map(theme=>`<button type="button" class="theme-card" data-theme="${theme.id}"><span class="theme-icon" aria-hidden="true">${theme.icon}</span><span class="theme-number">${theme.denominator?theme.count:'—'}<small>${theme.denominator?'of '+theme.denominator+' sample messages':'No observed denominator'}</small></span><strong>${esc(theme.title)}</strong><span class="theme-description">${esc(theme.label)}${theme.id==='participation'?participation.reported_label_count===null?' · select one channel with a consistent label scope to inspect reported team labels':` · ${participation.reported_label_count} self-reported team labels in this channel sample; unverified`:''}</span><span class="theme-link">Inspect the sample <span aria-hidden="true">↗</span></span></button>`).join('');
  document.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>openExplorer({challenge:selected,theme:b.dataset.theme})));
  renderConstellation();
  renderPulseStories(rows,{onExplore:openExplorer,challengeName,selected});
  if(signalReel)signalReel.update({catalog,records:messages,selected});
  else signalReel=mountSignalReel({catalog,records:messages,selected,onSelect:id=>{
    $('challenge-filter').value=id;
    renderOverview();
  }});
  refreshMotion();
}

function renderCatalog(){
  $('catalog').innerHTML=catalog.map((c,i)=>{
    const link=safeUrl(c.page_url??c.source_url),prize=Array.isArray(c.prizes)?c.prizes[0]:c.prizes?.['1'];
    return `<article class="challenge-card"><div class="challenge-top"><span class="challenge-symbol" aria-hidden="true">${symbols[i]??'✦'}</span><span class="challenge-index">0${i+1}</span></div><h3>${esc(c.name)}</h3><p>${esc(c.objective??c.summary??'Official challenge information is not loaded.')}</p><span class="prize-label">FIRST PLACE · OFFICIAL LISTING</span><div class="challenge-prize">${esc(prize??'See official challenge details')}</div><button type="button" class="catalog-evidence text-button" data-challenge="${esc(c.id)}">Explore recorded discussion ↗</button>${link?`<a class="text-link" href="${esc(link)}" target="_blank" rel="noopener">Official challenge details <span>↗</span></a>`:'<span class="small-note">Source unavailable</span>'}</article>`;
  }).join('');
  document.querySelectorAll('.catalog-evidence').forEach(b=>b.addEventListener('click',()=>openExplorer({challenge:b.dataset.challenge})));
}

function explorerFilters(includeHour=true){
  return {challenge:$('explore-challenge').value,category:$('category-filter').value,query:$('message-search').value,snapshot:$('snapshot-filter').value,role:$('role-filter').value,lens:activeLens,categories:activeTheme?.categories??null,hour:includeHour?activeHour:''};
}
function openExplorer({challenge='all',category='all',lens='all',theme=null}={}){
  $('explore-challenge').value=challenge;$('category-filter').value=category;$('message-search').value='';$('snapshot-filter').value='all';$('role-filter').value='all';
  activeLens=lens;activeHour='';activeTheme=THEMES.find(t=>t.id===theme)??null;
  renderExplorer();showPanel('explore');
}
function renderExplorer(){
  const focused=document.activeElement?.dataset;
  const focusedLens=focused?.lens,focusedHour=focused?.hour;
  refreshSnapshotSelector();
  const imports=new Set(localMessages.map(r=>r.message_id));
  const beforeHour=filterMessages(messages,explorerFilters(false),snapshots(),imports),buckets=displayTimeBuckets(beforeHour);
  if(activeHour&&!buckets.some(b=>b.key===activeHour))activeHour='';
  const rows=filterMessages(messages,explorerFilters(),snapshots(),imports);
  $('lens-filters').innerHTML=LENSES.map(l=>`<button type="button" data-lens="${l.id}" class="lens-button${activeLens===l.id?' selected':''}" aria-pressed="${activeLens===l.id}">${esc(l.label)}</button>`).join('');
  document.querySelectorAll('[data-lens]').forEach(b=>b.addEventListener('click',()=>{activeLens=b.dataset.lens;activeHour='';activeTheme=null;$('category-filter').value='all';renderExplorer();}));
  $('active-theme').hidden=!activeTheme;
  if(activeTheme)$('active-theme').innerHTML=`${esc(activeTheme.title)} <button type="button" id="clear-theme" aria-label="Clear thematic question">×</button>`;
  $('clear-theme')?.addEventListener('click',()=>{activeTheme=null;renderExplorer();$('reset-explorer').focus({preventScroll:true});});
  $('message-count').textContent=`${rows.length} of ${messages.length} distinct observed messages · filters affect this view only`;
  $('display-timeline').innerHTML=buckets.length?buckets.map(bucket=>`<button type="button" class="time-bucket${activeHour===bucket.key?' selected':''}" data-hour="${bucket.key}" aria-pressed="${activeHour===bucket.key}"><span class="time-dot">${bucket.count}</span><strong>${bucket.hour}</strong><span>${bucket.date}</span><small>sample message${bucket.count===1?'':'s'}</small></button>`).join(''):'<p class="not-observed">No displayed-time groups for these filters.</p>';
  document.querySelectorAll('[data-hour]').forEach(b=>b.addEventListener('click',()=>{activeHour=activeHour===b.dataset.hour?'':b.dataset.hour;renderExplorer();}));
  $('clear-hour').hidden=!activeHour;
  $('messages-body').innerHTML=rows.length?rows.map(r=>`<tr><td><strong>${esc(r.display_time)}</strong><small>${esc(r.display_date)}</small><small>${esc(r.timezone??'Timezone unverified')}</small></td><td>${esc(challengeName(r.challenge_id))}</td><td><span class="alias-badge">${esc(r.display_alias)}</span><small>${r.author_role==='organizer'?'Explicit organizer role':'Role unknown'}</small></td><td><span class="category-tag">${esc(categoryLabel(r.category))}</span></td><td class="message-paraphrase">${esc(r.paraphrase)}${r.reported_team_alias?`<small class="reported-team">Self-reported label: ${esc(r.reported_team_alias)} · unverified</small>`:''}</td><td><button type="button" class="inspect-message" data-message="${esc(r.message_id)}">Inspect <span aria-hidden="true">↗</span></button></td></tr>`).join(''):'<tr><td colspan="6" class="empty-table"><strong>No observed messages match.</strong><br>Try another lens or reset the filters. An empty view does not establish zero channel activity.</td></tr>';
  document.querySelectorAll('[data-message]').forEach(b=>b.addEventListener('click',()=>showMessage(b.dataset.message)));
  if(focusedLens)document.querySelector(`[data-lens="${CSS.escape(focusedLens)}"]`)?.focus({preventScroll:true});
  if(focusedHour)document.querySelector(`[data-hour="${CSS.escape(focusedHour)}"]`)?.focus({preventScroll:true});
}

function showMessage(id){
  const r=messages.find(row=>row.message_id===id);if(!r)return;
  const sources=snapshots().filter(s=>s.message_ids?.includes(id));
  const reaction=Number.isInteger(r.reaction_count_observed)?`<div class="detail-reaction"><strong>${r.reaction_count_observed}</strong><span>reaction events in the latest recorded reading${r.reaction_observed_on_local?' · '+esc(r.reaction_observed_on_local):''}<small>Not unique reactors. This reading is separate from the message’s displayed posting time${r.reaction_snapshot_id?' and belongs to '+esc(r.reaction_snapshot_id):''}.</small></span></div>`:'';
  $('message-detail').innerHTML=`<span class="source-pill neutral">${esc(challengeName(r.challenge_id))}</span><h2 id="detail-title">${esc(categoryLabel(r.category))}</h2><p class="detail-paraphrase">${esc(r.paraphrase)}</p><span class="detail-caption">Paraphrase of observed content · not a verbatim quote</span>${reaction}<dl class="detail-facts"><div><dt>Displayed time</dt><dd>${esc(r.display_date)} · ${esc(r.display_time)}<small>${esc(r.timezone??'Timezone not verified')}</small></dd></div><div><dt>Display alias</dt><dd>${esc(r.display_alias)}<small>Sample-scoped label, not a verified person or team</small></dd></div>${r.reported_team_alias?'<div><dt>Self-reported team label</dt><dd>'+esc(r.reported_team_alias)+'<small>Within this channel’s recorded label scope. Not a verified team, membership or entrant.</small></dd></div>':''}<div><dt>Author role</dt><dd>${r.author_role==='organizer'?'Organizer · explicit evidence':'Unknown'}${r.role_evidence?'<small>'+esc(r.role_evidence)+'</small>':''}</dd></div><div><dt>Record source</dt><dd>Discord UI observation<small>${esc(r.collection_method??'Collection method not supplied for this imported record')}</small></dd></div><div><dt>Coding</dt><dd>${r.human_reviewed?'Marked human-reviewed':'Not independently human-reviewed'}<small>${esc(r.coding_method??'Coding method not supplied')}</small></dd></div><div><dt>Observed snapshots</dt><dd>${sources.length?sources.map(s=>esc(s.label??s.snapshot_id)).join('<br>'):'No authoritative bundled snapshot membership'}<small>Repeated sightings are deduplicated by message ID.</small></dd></div></dl><div class="detail-bottom"><a class="button dark-button" href="${esc(safeUrl(r.source_url))}" target="_blank" rel="noopener">Open original message ↗</a><p>Requires access to the Discord server. Source context may have changed since collection.</p></div>`;
  $('message-dialog').showModal();
}
$('close-detail').addEventListener('click',()=>$('message-dialog').close());
$('message-dialog').addEventListener('click',e=>{if(e.target===$('message-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});

function renderEvidence(){
  const records=coverageRecords();
  $('discord-method').textContent=localMessages.length?'Mixed partial samples: bundled observations plus imported coded records. Imports have not been independently verified; no combined observation interval is established.':observationData.metadata?.sampling??'Partial UI observations; no complete channel history or complete time interval.';
  $('discord-limits').textContent='No messages-per-hour calculation or cross-challenge ranking is supported by this coverage. Snapshot counts are not summed across repeated sightings; messages are deduplicated by ID.';
  $('discord-snapshots').innerHTML=records.map(r=>{
    const read=r.observed_messages!==null,link=safeUrl(r.source_url),sampleSnapshots=snapshots().filter(s=>s.challenge_id===r.challenge_id);
    const timeNote=localMessages.some(m=>m.challenge_id===r.challenge_id)?'Mixed imported samples · no combined time window':displaySpanText(messages.filter(m=>m.challenge_id===r.challenge_id));
    return `<article class="discord-card"><div class="discord-card-header"><h3>${esc(challengeName(r.challenge_id))}</h3><span class="source-pill neutral">${read?'Partial sample':'Not read'}</span></div><div class="discord-window">${read?esc(timeNote):'No messages observed. Channel activity is unknown.'}</div><div class="discord-numbers"><div><strong>${r.observed_messages??'—'}</strong><small>Distinct observed messages</small></div><div><strong>${r.distinct_display_labels??'—'}</strong><small>Sample display labels · not teams</small></div></div>${read?`<ul class="theme-list">${Object.entries(r.category_counts??{}).map(([k,n])=>`<li>${esc(categoryLabel(k))} · ${n}</li>`).join('')}</ul>`:''}<p>${esc(r.coverage_note)}</p>${sampleSnapshots.length?`<p class="snapshot-count">${sampleSnapshots.length} recorded snapshot${sampleSnapshots.length===1?'':'s'} · repeated messages counted once</p>`:''}<div class="coverage-actions"><button type="button" class="text-button coverage-inspect" data-challenge="${esc(r.challenge_id)}">Inspect this sample ↗</button>${link?`<a class="text-link" href="${esc(link)}" target="_blank" rel="noopener">Open channel ↗</a>`:''}</div></article>`;
  }).join('');
  document.querySelectorAll('.coverage-inspect').forEach(b=>b.addEventListener('click',()=>openExplorer({challenge:b.dataset.challenge})));
}

function refreshSelectors(){
  for(const id of ['challenge-filter','explore-challenge']){
    const old=$(id).value;$(id).innerHTML='<option value="all">All challenges</option>'+catalog.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');$(id).value=old||'all';
  }
  const oldCategory=$('category-filter').value;
  $('category-filter').innerHTML='<option value="all">All categories</option>'+Object.entries(CATEGORY_LABELS).map(([k,v])=>`<option value="${esc(k)}">${esc(v)}</option>`).join('');$('category-filter').value=oldCategory||'all';
  refreshSnapshotSelector();
}
function refreshSnapshotSelector(){
  const oldSnapshot=$('snapshot-filter').value,challenge=$('explore-challenge').value;
  const available=snapshots().filter(s=>challenge==='all'||s.challenge_id===challenge);
  const grouped=CHALLENGE_IDS.map(id=>{
    const group=available.filter(s=>s.challenge_id===id);if(!group.length)return '';
    return `<optgroup label="${esc(challengeName(id))}">${group.map((s,i)=>`<option value="${esc(s.snapshot_id)}">${esc(s.label??'Snapshot '+(i+1))} · ${s.message_ids?new Set(s.message_ids).size:s.observed_messages??'?'} messages</option>`).join('')}</optgroup>`;
  }).join('');
  $('snapshot-filter').innerHTML='<option value="all">All recorded snapshots</option>'+grouped+(localMessages.some(r=>challenge==='all'||r.challenge_id===challenge)?'<option value="imports">Records imported on this device</option>':'');
  $('snapshot-filter').value=[...$('snapshot-filter').options].some(o=>o.value===oldSnapshot)?oldSnapshot:'all';
}
function renderAll(){refreshSelectors();renderOverview();renderCatalog();renderExplorer();renderEvidence();$('footer-data-status').textContent=`${messages.length} distinct observed messages · ${summarize(messages).channels} of ${CHALLENGE_IDS.length} channels sampled`;}
function download(filename,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportMetadata(base){return localMessages.length?{source_type:'discord_ui_observation',sampling:'Mixed partial message samples: bundled observations plus user-imported coded records. No complete channel or interval coverage is established.',collection_method:'Bundled assistant UI observations and imported message records; imported records have not been independently verified.',captured_at:null,display_timezone:null,imported_on_this_device:localMessages.length,identity_note:'Aliases may collide across samples. No combined distinct-display-label count is reported.',snapshot_note:'Only bundled snapshot membership is treated as authoritative by the explorer. Imported snapshot metadata is not verified.',seed_metadata:base}:{...base,imported_on_this_device:0};}
document.querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',()=>{
  const kind=b.dataset.export,exported_at=new Date().toISOString();
  if(kind==='messages-csv')download('challenge-pulse-messages.csv',csv(messages),'text/csv;charset=utf-8');
  else if(kind==='coverage-json')download('challenge-pulse-coverage.json',JSON.stringify({...observationData,metadata:exportMetadata(observationData.metadata),exported_at,records:coverageRecords()},null,2),'application/json');
  else download('challenge-pulse-messages.json',JSON.stringify({...messageData,schema_version:1,exported_at,metadata:exportMetadata(messageData.metadata),records:messages},null,2),'application/json');
}));
$('import-file').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;const box=$('import-message');
  try{
    if(file.size>5*1024*1024)throw new Error('Choose a file smaller than 5 MB.');
    const input=parseImport(JSON.parse(await file.text())),merged=mergeMessages(messages,input),nextLocal=mergeMessages(localMessages,input).records;
    try{localStorage.setItem(storageKey,JSON.stringify({schema_version:1,records:nextLocal}));}catch{throw new Error('Browser storage is unavailable or full. Nothing was imported.');}
    messages=merged.records;localMessages=nextLocal;box.textContent=`Merged ${merged.added} new messages; updated ${merged.updated??0} records with additional provenance; skipped ${merged.skipped} unchanged duplicate IDs. Repeated sightings never increase message counts. Imported snapshot metadata is not verified.`;box.classList.remove('error');renderAll();toast('Message records merged.');
  }catch(error){box.textContent=error.message;box.classList.add('error');}
  box.hidden=false;e.target.value='';
});
document.querySelector('.import-button').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('import-file').click();}});
$('challenge-filter').addEventListener('change',renderOverview);
for(const id of ['explore-challenge','category-filter','snapshot-filter','role-filter'])$(id).addEventListener('change',()=>{activeHour='';if(id==='category-filter'){activeTheme=null;activeLens='all';}renderExplorer();});
$('message-search').addEventListener('input',()=>{activeHour='';renderExplorer();});
$('clear-hour').addEventListener('click',()=>{activeHour='';renderExplorer();(document.querySelector('[data-hour]')??$('reset-explorer')).focus({preventScroll:true});});
$('reset-explorer').addEventListener('click',()=>openExplorer());
$('scenario-form').addEventListener('submit',e=>e.preventDefault());
$('entrant-count').addEventListener('input',()=>{
  const raw=$('entrant-count').value,n=Number(raw),v=raw?equalChanceTopThree(n):null;
  $('scenario-result').innerHTML=v===null?'<span class="scenario-number">—</span><span>Enter a whole number from 1 to 100,000.</span>':`<span class="scenario-number">${(100*v).toLocaleString(undefined,{maximumFractionDigits:1})}%</span><span>Hypothetical equal-chance baseline · ${n.toLocaleString()} assumed entrants</span>`;
});

async function load(){
  const results=await Promise.allSettled(['catalog.json','discord-observations.json','discord-message-coding.json'].map(async f=>{const r=await fetch('./data/'+f);if(!r.ok)throw new Error(`${f}: HTTP ${r.status}`);return r.json();}));
  const errors=[];
  if(results[0].status==='fulfilled'&&Array.isArray(results[0].value.challenges))catalog=results[0].value.challenges.map(c=>({...c,id:c.id??c.challenge_id}));else errors.push('The official catalog could not be loaded.');
  if(results[1].status==='fulfilled'&&Array.isArray(results[1].value.records))observationData=results[1].value;else errors.push('Coverage metadata could not be loaded.');
  if(results[2].status==='fulfilled'){try{messageData=results[2].value;messages=mergeMessages([],parseImport(messageData)).records;}catch(e){errors.push('Message data: '+e.message);}}else errors.push('The message dataset could not be loaded.');
  try{const stored=localStorage.getItem(storageKey);if(stored){localMessages=parseImport(JSON.parse(stored));messages=mergeMessages(messages,localMessages).records;}}catch(e){localMessages=[];errors.push('Saved local imports could not be loaded: '+e.message);}
  if(errors.length)showNotice(errors.join(' ')+' Run this app with node serve.mjs, rather than opening index.html as a file.');
  renderAll();showPanel(location.hash.slice(1),false);
}
load().catch(error=>showNotice('The dashboard could not initialize: '+error.message));
