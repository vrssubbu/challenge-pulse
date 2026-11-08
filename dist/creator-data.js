import {THEMES} from './pulse-model.js?v=6';
import {createReelArt} from './reel-art.js?v=7';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const definitions=[
  {id:'clarity',name:'Clarity in the conversation',label:'HELP / RULES / LOGISTICS',action:'Turn recurring discussion into useful clarification.',limit:'Includes questions, explanations and answers. These are not counts of unresolved requests.',art:2},
  {id:'building',name:'The work behind the work',label:'STRATEGY / PROGRESS / COLLABORATION',action:'Explore the approaches people are discussing.',limit:'Progress and approaches are self-reported. Completion and team membership are not verified.',art:5},
  {id:'participation',name:'Participation, in their words',label:'EXPLICIT PARTICIPATION POSTS',action:'Inspect what was explicitly reported.',limit:'Posts and reported labels are not verified teams, entrants or valid submissions.',art:6}
];

export function buildCreatorStories(rows=[]) {
  return definitions.map(story=>{
    const categories=THEMES.find(theme=>theme.id===story.id).categories;
    const records=rows.filter(row=>categories.includes(row.category));
    return {...story,count:records.length,total:rows.length,share:rows.length?records.length/rows.length:null,records};
  });
}

let galleryKey='';
export function renderCreatorData({catalog=[],records=[],rows=[],selected='all',onExplore=()=>{}}={}) {
  const tracks=document.getElementById('creator-marquee-tracks');
  const counts=new Map();
  records.forEach(row=>counts.set(row.challenge_id,(counts.get(row.challenge_id)??0)+1));
  const key=JSON.stringify(catalog.map(c=>[c.id,c.name,counts.get(c.id)??null]));
  if(tracks&&galleryKey!==key){
    galleryKey=key;
    tracks.innerHTML=[catalog.slice(0,4),catalog.slice(4)].map((group,rowIndex)=>`<div class="creator-marquee-lane" tabindex="0" role="group" aria-label="Challenge samples ${rowIndex*4+1} to ${rowIndex*4+group.length}"><div class="creator-marquee-row" data-direction="${rowIndex===0?'right':'left'}">${group.map((c,index)=>{
      const count=counts.get(c.id),ordinal=rowIndex*4+index;
      return `<button type="button" class="creator-marquee-tile" data-creator-challenge="${escapeHtml(c.id)}" aria-label="Explore ${escapeHtml(c.name)}: ${count==null?'no recorded sample':count+' recorded messages'}"><span class="creator-tile-art" aria-hidden="true">${createReelArt(ordinal).outerHTML}</span><span class="creator-tile-index" aria-hidden="true">0${ordinal+1} / OBSERVED DISCUSSION</span><span class="creator-tile-caption"><strong>${escapeHtml(c.name)}</strong><span>${count==null?'Not sampled':count+' message'+(count===1?'':'s')} <span aria-hidden="true">↗</span></span></span></button>`;
    }).join('')}</div></div>`).join('');
    tracks.querySelectorAll('[data-creator-challenge]').forEach(button=>button.addEventListener('click',()=>onExplore({challenge:button.dataset.creatorChallenge})));
  }
  const list=document.getElementById('creator-project-list');
  if(!list)return;
  const scope=selected==='all'?'All selected challenges':catalog.find(c=>c.id===selected)?.name??selected;
  list.innerHTML=buildCreatorStories(rows).map((story,index)=>{
    const percentage=story.share===null?'—':(story.share*100).toFixed(1)+'%';
    const examples=story.records.filter((row,index,all)=>all.findIndex(item=>item.paraphrase===row.paraphrase)===index).slice(0,2);
    return `<article class="creator-project-card" style="--project-index:${index}" aria-labelledby="creator-project-title-${index}">
      <div class="creator-project-top"><span class="creator-project-number" aria-hidden="true">0${index+1}</span><div class="creator-project-heading"><small>${story.label}</small><h3 id="creator-project-title-${index}">${story.name}</h3></div><button type="button" class="creator-outline" data-creator-theme="${story.id}"${story.count?'':' disabled'}>Inspect ${story.count} messages <span aria-hidden="true">↗</span></button></div>
      <div class="creator-project-grid"><div class="creator-project-stat"><strong>${story.count}</strong><span>of ${story.total} selected messages</span><b>${percentage} of the sample</b><small>${escapeHtml(scope)}<br>${story.limit}</small></div><div class="creator-project-visual" aria-hidden="true">${createReelArt(story.art).outerHTML}<span>Illustrative artwork</span></div><div class="creator-project-copy"><h4>${story.action}</h4><p>Examples from the selected records · paraphrased</p>${examples.length?`<ul>${examples.map(row=>`<li>${escapeHtml(row.paraphrase)}</li>`).join('')}</ul>`:'<p>No messages in this category within the selected sample. This does not establish absence across the event.</p>'}<small>Every source record is available through “Inspect messages.”</small></div></div>
    </article>`;
  }).join('');
  list.querySelectorAll('[data-creator-theme]').forEach(button=>button.addEventListener('click',()=>onExplore({challenge:selected,theme:button.dataset.creatorTheme})));
}
