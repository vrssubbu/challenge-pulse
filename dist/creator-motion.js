// Original code-native sculpture and progressive motion. No analytical value is animated or invented here.
let controller = null;
let sculptureSequence = 0;

function mountSculpture(host) {
  if(host.querySelector('.sculpture-stage'))return;
  const id=`creator-chrome-${sculptureSequence++}`;
  const paint=name=>`url(#${id}-${name})`;
  const stage=document.createElement('div');
  stage.className='sculpture-stage';stage.setAttribute('aria-hidden','true');
  // All markup below is authored artwork, never interpolated participant content.
  stage.innerHTML=`<div class="sculpture-aura sculpture-aura-violet"></div><div class="sculpture-aura sculpture-aura-amber"></div>
  <div class="sculpture-entrance"><div class="sculpture-magnet"><svg class="sculpture-svg" viewBox="0 0 720 650" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
  <defs>
    <linearGradient id="${id}-ring" x1="130" y1="110" x2="580" y2="490" gradientUnits="userSpaceOnUse"><stop stop-color="#181b22"/><stop offset=".13" stop-color="#677582"/><stop offset=".22" stop-color="#f4f9fc"/><stop offset=".3" stop-color="#9da8b5"/><stop offset=".39" stop-color="#24262e"/><stop offset=".5" stop-color="#9584a5"/><stop offset=".59" stop-color="#f2e1d4"/><stop offset=".7" stop-color="#383941"/><stop offset=".82" stop-color="#a9b3bd"/><stop offset=".91" stop-color="#e6ebef"/><stop offset="1" stop-color="#20242a"/></linearGradient>
    <linearGradient id="${id}-top" x1=".12" y1="0" x2=".82" y2="1"><stop stop-color="#f5f7f7"/><stop offset=".23" stop-color="#cbd3dc"/><stop offset=".45" stop-color="#79838f"/><stop offset=".5" stop-color="#bec7d0"/><stop offset=".76" stop-color="#eef0ef"/><stop offset="1" stop-color="#949ba6"/></linearGradient>
    <linearGradient id="${id}-front" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#a6adb6"/><stop offset=".18" stop-color="#303640"/><stop offset=".5" stop-color="#11141a"/><stop offset=".82" stop-color="#454b53"/><stop offset="1" stop-color="#9ea6af"/></linearGradient>
    <linearGradient id="${id}-side" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="#606474"/><stop offset=".22" stop-color="#282631"/><stop offset=".62" stop-color="#777783"/><stop offset=".86" stop-color="#25242b"/><stop offset="1" stop-color="#9699a1"/></linearGradient>
    <linearGradient id="${id}-inset" x1=".1" y1="0" x2=".75" y2="1"><stop stop-color="#7c8794"/><stop offset=".28" stop-color="#c0cad3"/><stop offset=".7" stop-color="#b5bec6"/><stop offset="1" stop-color="#e8edee"/></linearGradient>
    <linearGradient id="${id}-warm" x1="0" y1=".1" x2="1" y2=".9"><stop stop-color="#a4acbd"/><stop offset=".32" stop-color="#eee2d3"/><stop offset=".48" stop-color="#9a9697"/><stop offset=".7" stop-color="#e0c5a7"/><stop offset="1" stop-color="#726a6f"/></linearGradient>
    <linearGradient id="${id}-edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".28" stop-color="#f3f5fa"/><stop offset=".5" stop-color="#525965"/><stop offset=".72" stop-color="#d4b6ef"/><stop offset="1" stop-color="#d9c0a6"/></linearGradient>
    <radialGradient id="${id}-sphere" cx=".32" cy=".22" r=".78"><stop stop-color="#fff"/><stop offset=".15" stop-color="#d5dce6"/><stop offset=".38" stop-color="#747884"/><stop offset=".53" stop-color="#24262e"/><stop offset=".68" stop-color="#9f8ea8"/><stop offset=".78" stop-color="#e0c4a2"/><stop offset="1" stop-color="#17191e"/></radialGradient>
    <radialGradient id="${id}-floor"><stop stop-color="#9d6eb8" stop-opacity=".2"/><stop offset=".5" stop-color="#8b6e74" stop-opacity=".09"/><stop offset="1" stop-color="#0c0c0c" stop-opacity="0"/></radialGradient>
    <filter id="${id}-shadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#000" flood-opacity=".55"/></filter>
    <filter id="${id}-soft"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <ellipse cx="363" cy="566" rx="265" ry="45" fill="${paint('floor')}"/>
  <g class="sculpture-orbit-back">
    <ellipse cx="358" cy="310" rx="292" ry="160" transform="rotate(-32 358 310)" stroke="#08090b" stroke-width="23"/>
    <ellipse cx="358" cy="308" rx="292" ry="160" transform="rotate(-32 358 308)" stroke="${paint('ring')}" stroke-width="13"/>
    <ellipse cx="358" cy="305" rx="292" ry="160" transform="rotate(-32 358 305)" stroke="#d7e2ec" stroke-opacity=".28" stroke-width="1.2"/>
  </g>
  <g class="sculpture-orbit-fine"><ellipse cx="365" cy="315" rx="270" ry="203" transform="rotate(43 365 315)" stroke="${paint('ring')}" stroke-width="1.6"/><path d="M105 370 110 366M576 147 582 154" stroke="#e1d8ef" stroke-width="5" stroke-linecap="round"/></g>
  <g class="sculpture-key sculpture-key-alt" filter="${paint('shadow')}">
    <path d="M374 144Q379 134 391 139L506 176Q518 181 514 194L481 283Q478 292 467 288L343 242Q332 238 337 225Z" fill="${paint('side')}" transform="translate(0 40)"/>
    <path d="M337 225 467 274 479 282 479 322Q474 331 462 326L344 282Q332 277 337 264Z" fill="${paint('front')}"/>
    <path d="M505 180 516 190 481 282 479 322 514 232Q518 221 517 208Z" fill="${paint('side')}"/>
    <path d="M374 144Q379 134 391 139L506 176Q518 181 514 194L481 283Q478 292 467 288L343 242Q332 238 337 225Z" fill="${paint('warm')}" stroke="${paint('edge')}" stroke-width="1.6"/>
    <path d="M384 153 499 191 470 270 350 228Z" fill="${paint('inset')}" stroke="#4e505c" stroke-opacity=".55" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M384 153 499 191M350 228 470 270" stroke="#fff" stroke-opacity=".42" stroke-width="2"/>
    <g transform="matrix(.91 .31 -.37 .91 381 198)"><text font-family="Kanit,Arial,sans-serif" font-size="39" font-weight="800" letter-spacing="-1" fill="#25232b">ALT_</text><path d="M1 13H73" stroke="#4d424d" stroke-opacity=".4"/></g>
    <path d="M354 264 454 302" stroke="#b9a4b9" stroke-opacity=".3" stroke-width="2"/>
  </g>
  <g class="sculpture-key sculpture-key-control" filter="${paint('shadow')}">
    <path d="M118 204 244 158Q251 155 260 161L326 213Q337 221 326 227L199 279Q189 283 180 276L115 223Q106 215 118 204Z" fill="${paint('side')}" transform="translate(0 40)"/>
    <path d="M111 215 188 276 195 281 195 321Q187 322 179 314L117 264Q110 258 111 246Z" fill="${paint('side')}"/>
    <path d="M195 280 330 222 330 262 205 318Q198 322 192 320Z" fill="${paint('front')}"/>
    <path d="M118 204 244 158Q251 155 260 161L326 213Q337 221 326 227L199 279Q189 283 180 276L115 223Q106 215 118 204Z" fill="${paint('top')}" stroke="${paint('edge')}" stroke-width="1.7"/>
    <path d="M133 212 250 169 311 218 192 265Z" fill="${paint('inset')}" stroke="#626d7a" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M133 212 250 169 311 218" stroke="#fff" stroke-opacity=".65" stroke-width="1.8"/>
    <g transform="matrix(.93 -.36 .73 .59 161 224)"><text font-family="Kanit,Arial,sans-serif" font-size="43" font-weight="800" letter-spacing="-1.5" fill="#252932">CTRL_</text><path d="M1 14H89" stroke="#475260" stroke-opacity=".45"/></g>
    <path d="M210 299 315 254" stroke="#b2bdc9" stroke-opacity=".3" stroke-width="2"/>
  </g>
  <g class="sculpture-key sculpture-key-defeat" filter="${paint('shadow')}">
    <path d="M224 327 414 273Q426 270 437 279L551 366Q564 377 547 384L357 452Q345 457 333 446L221 350Q209 338 224 327Z" fill="${paint('side')}" transform="translate(0 52)"/>
    <path d="M216 339 345 451 349 504Q339 504 328 494L225 405Q216 397 216 386Z" fill="${paint('side')}"/>
    <path d="M349 452 556 377 556 423Q556 432 541 439L360 504Q351 508 346 503Z" fill="${paint('front')}"/>
    <path d="M224 327 414 273Q426 270 437 279L551 366Q564 377 547 384L357 452Q345 457 333 446L221 350Q209 338 224 327Z" fill="${paint('top')}" stroke="${paint('edge')}" stroke-width="2"/>
    <path d="M239 339 422 286 537 374 348 438Z" fill="${paint('inset')}" stroke="#67717c" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M239 339 422 286 537 374" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
    <g transform="matrix(.94 -.29 .83 .72 284 365)"><text font-family="Kanit,Arial,sans-serif" font-size="39" font-weight="900" letter-spacing="-1" fill="#22272f">DEFEAT</text><text x="3" y="23" font-family="Arial,sans-serif" font-size="7" letter-spacing="3.5" fill="#5b6470">MAKE SENSE OF THE SIGNAL</text></g>
    <path d="M369 481 531 423" stroke="#e5d5c7" stroke-opacity=".34" stroke-width="2"/>
    <path d="M230 369 324 450" stroke="#ba91cf" stroke-opacity=".35" stroke-width="2"/>
  </g>
  <g class="sculpture-orbit-front"><path d="M91 389C83 445 135 489 230 487C344 485 479 424 560 341" stroke="#090a0d" stroke-width="18" stroke-linecap="round"/><path d="M91 386C83 442 135 486 230 484C344 482 479 421 560 338" stroke="${paint('ring')}" stroke-width="11" stroke-linecap="round"/><path d="M92 384C86 437 136 480 230 480C344 478 475 418 557 337" stroke="#e8e7ee" stroke-opacity=".4" stroke-width="1.3"/></g>
  <g class="sculpture-satellite sculpture-satellite-a"><circle cx="564" cy="188" r="21" fill="${paint('sphere')}"/><ellipse cx="557" cy="179" rx="5" ry="2" transform="rotate(-30 557 179)" fill="#fff" opacity=".6"/></g>
  <g class="sculpture-satellite sculpture-satellite-b"><circle cx="156" cy="417" r="12" fill="${paint('sphere')}"/></g>
  <g class="sculpture-satellite sculpture-satellite-c"><circle cx="387" cy="92" r="7" fill="${paint('sphere')}"/></g>
  <g opacity=".8" stroke="#a5a0af" stroke-width=".8"><path d="M591 387h13m-6.5-6.5v13M165 140h10m-5-5v10"/><circle cx="280" cy="534" r="2" fill="#9e8995" stroke="none"/></g>
  </svg></div></div>`;
  host.append(stage);
}

const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));

/** Safe to call again after the root renderer replaces cards; creates one controller only. */
export function initCreatorMotion() {
  if(controller){controller.refresh();return controller;}
  if(typeof document==='undefined')return null;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=window.matchMedia('(hover: hover) and (pointer: fine)');
  const compact=window.matchMedia('(max-width: 900px)');
  const abort=new AbortController();
  const listen=(node,type,handler,options={})=>node?.addEventListener(type,handler,{...options,signal:abort.signal});
  const sculptures=new Set(), artworks=new Set(), rows=new Set(), projects=new Set(), paragraphs=new Map();
  const visible=new Set(), observed=new Set(), revealed=new WeakSet(), entrances=new Set();
  let scheduled=0,destroyed=false,pointerRow=null,pointerId=null;
  const enabled=()=>!reduced.matches&&!document.documentElement.classList.contains('motion-paused');
  const onScreen=element=>{const rect=element.getBoundingClientRect();return rect.bottom>0&&rect.top<innerHeight&&rect.width>0;};
  const isVisible=element=>intersection?visible.has(element):onScreen(element);
  const active=()=>enabled()&&!document.hidden;
  const schedule=()=>{if(!scheduled&&!destroyed&&!document.hidden)scheduled=requestAnimationFrame(updateScroll);};
  const resetMagnet=host=>{host.style.removeProperty('--magnet-x');host.style.removeProperty('--magnet-y');host.style.removeProperty('--magnet-rx');host.style.removeProperty('--magnet-ry');};
  const syncSculpture=host=>{
    host.classList.toggle('is-motion-active',active()&&isVisible(host));
    if(!active()||!isVisible(host))resetMagnet(host);
  };
  const syncArtwork=element=>element.setAttribute('data-art-paused',String(!active()||!isVisible(element)));
  const intersection='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries){
      // A queued observation can arrive after a filter has replaced its card.
      if(destroyed||!target.isConnected||!observed.has(target)){visible.delete(target);continue;}
      if(isIntersecting)visible.add(target);else visible.delete(target);
      if(sculptures.has(target))syncSculpture(target);
      if(artworks.has(target))syncArtwork(target);
    }
    schedule();
  },{threshold:0}):null;
  const observe=element=>{if(observed.has(element))return;observed.add(element);intersection?.observe(element);};

  function splitParagraph(element) {
    if(paragraphs.has(element))return;
    // Decorative duplicate is hidden from accessibility APIs; one intact sentence stays available.
    const text=element.textContent.trim();
    if(!text)return;
    const accessible=document.createElement('span');accessible.className='creator-readable-copy';accessible.textContent=text;
    const visual=document.createElement('span');visual.className='creator-character-copy';visual.setAttribute('aria-hidden','true');
    const characters=[];
    for(const token of text.split(/(\s+)/)) {
      if(/^\s+$/.test(token)){visual.append(document.createTextNode(token));continue;}
      const word=document.createElement('span');word.className='creator-char-word';
      for(const character of [...token]) {const span=document.createElement('span');span.className='creator-char';span.textContent=character;word.append(span);characters.push(span);}
      visual.append(word);
    }
    element.replaceChildren(accessible,visual);paragraphs.set(element,{text,characters});observe(element);
  }

  function enter(element,delay=0) {
    if(revealed.has(element))return;revealed.add(element);
    if(!enabled()||document.hidden||!element.animate||!onScreen(element))return;
    const animation=element.animate([{opacity:.25,translate:'0 22px',filter:'blur(5px)'},{opacity:1,translate:'0 0',filter:'blur(0px)'}],{duration:650,delay,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'});
    entrances.add(animation);animation.finished.catch(()=>{}).finally(()=>entrances.delete(animation));
  }

  function updateScroll() {
    scheduled=0;
    if(destroyed||document.hidden)return;
    const motion=enabled();
    for(const host of sculptures)if(host.isConnected)syncSculpture(host);
    for(const art of artworks)if(art.isConnected)syncArtwork(art);
    for(const [element,{characters}] of paragraphs) {
      if(!element.isConnected||(!isVisible(element)&&motion))continue;
      const rect=element.getBoundingClientRect();
      const progress=clamp((innerHeight*.82-rect.top)/(innerHeight*.62+rect.height*.3));
      characters.forEach((character,index)=>{const value=motion ? .3+.7*clamp(progress*(characters.length+8)-index) : 1;character.style.opacity=value.toFixed(3);});
    }
    let rowIndex=0;
    for(const row of rows) {
      if(!row.isConnected)continue;
      const index=rowIndex++;
      const lane=row.parentElement;
      const keyboardFocus=lane.matches(':focus-visible')||Boolean(lane.querySelector(':focus-visible'));
      // Narrow layouts use native horizontal scrolling even when a desktop mouse emulates a phone.
      if(!motion||!pointer.matches||compact.matches||keyboardFocus){row.style.removeProperty('--marquee-shift');continue;}
      // Keep the press target stationary through pointerup/click dispatch.
      if(pointerRow===row)continue;
      if(!isVisible(row))continue;
      const container=row.parentElement;
      const rect=container.getBoundingClientRect();
      const travel=Math.max(0,row.scrollWidth-container.clientWidth);
      // Only consume existing overflow. Real cards remain keyboard/touch reachable.
      const progress=clamp((innerHeight-rect.top)/(innerHeight+rect.height));
      const direction=row.dataset.marqueeDirection??row.dataset.direction??(index%2?'left':'right');
      const amount=direction==='right'?-travel*(1-progress):-travel*progress;
      row.style.setProperty('--marquee-shift',`${amount.toFixed(2)}px`);
    }
    const projectList=[...projects].filter(element=>element.isConnected);
    projectList.forEach((card,index)=>{
      if(!motion){card.style.removeProperty('--project-scale');card.style.removeProperty('--project-stack');return;}
      if(!isVisible(card))return;
      const wrapper=card.closest('.creator-project-wrap,.creator-project-slot,[data-project-slot]');
      const rect=(wrapper??card).getBoundingClientRect();
      const next=projectList[index+1];
      const nextRect=next?.getBoundingClientRect();
      const top=parseFloat(getComputedStyle(card).top)||96;
      const progress=nextRect?clamp((innerHeight*.9-nextRect.top)/Math.max(1,innerHeight*.9-top)):clamp((top-rect.top)/Math.max(1,rect.height));
      const targetScale=1-Math.min(3,projectList.length-1-index)*.03;
      card.style.setProperty('--project-scale',(1-(1-targetScale)*progress).toFixed(4));
      card.style.setProperty('--project-stack',String(index));
    });
  }

  function refresh() {
    if(destroyed)return;
    if(pointerRow&&!pointerRow.isConnected){pointerRow=null;pointerId=null;}
    // Dynamic renderers replace evidence cards; release detached references and observers.
    for(const set of [sculptures,artworks,rows,projects,observed,visible])for(const element of set)if(!element.isConnected){set.delete(element);intersection?.unobserve(element);}
    for(const [element] of paragraphs)if(!element.isConnected)paragraphs.delete(element);
    document.querySelectorAll('.creator-sculpture').forEach(host=>{
      mountSculpture(host);
      if(sculptures.has(host))return;
      sculptures.add(host);observe(host);
      const hero=host.closest('.creator-hero')??host;
      listen(hero,'pointermove',event=>{
        if(!active()||!pointer.matches||event.pointerType==='touch'||!isVisible(host))return;
        const rect=host.getBoundingClientRect();
        const x=clamp((event.clientX-rect.left-rect.width/2)/Math.max(1,rect.width/2),-1,1);
        const y=clamp((event.clientY-rect.top-rect.height/2)/Math.max(1,rect.height/2),-1,1);
        host.style.setProperty('--magnet-x',`${(x*19).toFixed(2)}px`);host.style.setProperty('--magnet-y',`${(y*12).toFixed(2)}px`);
        host.style.setProperty('--magnet-rx',`${(-y*4).toFixed(2)}deg`);host.style.setProperty('--magnet-ry',`${(x*6).toFixed(2)}deg`);
      },{passive:true});
      listen(hero,'pointerleave',()=>resetMagnet(host));
      enter(host.querySelector('.sculpture-entrance'),160);
    });
    document.querySelectorAll('.creator-marquee-row').forEach(row=>{rows.add(row);observe(row);});
    document.querySelectorAll('.creator-project-card').forEach(card=>{projects.add(card);observe(card);});
    document.querySelectorAll('.creator-marquee-tile,.creator-project-visual').forEach(art=>{if(artworks.has(art))return;artworks.add(art);art.setAttribute('data-art-paused','true');observe(art);});
    document.querySelectorAll('[data-scroll-chars]').forEach(splitParagraph);
    document.querySelectorAll('.creator-hero .creator-nav,.creator-hero .creator-heading,.creator-hero-bottom').forEach((element,index)=>enter(element,index*80));
    sync();
  }

  function sync() {
    if(!active()) {
      for(const animation of entrances)animation.cancel();entrances.clear();
      for(const host of sculptures){host.classList.remove('is-motion-active');resetMagnet(host);}
      for(const art of artworks)art.setAttribute('data-art-paused','true');
      for(const [element,{characters}] of paragraphs)characters.forEach(character=>character.style.removeProperty('opacity'));
      for(const row of rows)row.style.removeProperty('--marquee-shift');
      for(const card of projects){card.style.removeProperty('--project-scale');card.style.removeProperty('--project-stack');}
    }
    if(document.hidden){cancelAnimationFrame(scheduled);scheduled=0;}else schedule();
  }

  listen(window,'scroll',schedule,{passive:true});listen(window,'resize',schedule,{passive:true});
  listen(document,'pointerdown',event=>{
    const row=event.target.closest?.('.creator-marquee-row');
    if(row&&rows.has(row)){pointerRow=row;pointerId=event.pointerId;}
  },{passive:true,capture:true});
  const releasePointer=event=>{if(event.pointerId!==pointerId)return;pointerRow=null;pointerId=null;schedule();};
  listen(document,'pointerup',releasePointer,{passive:true});listen(document,'pointercancel',releasePointer,{passive:true});
  listen(document,'focusin',schedule);listen(document,'focusout',schedule);
  listen(document,'visibilitychange',sync);listen(reduced,'change',sync);listen(pointer,'change',sync);listen(compact,'change',sync);
  const resize='ResizeObserver' in window?new ResizeObserver(schedule):null;
  const hero=document.querySelector('.creator-hero');if(hero)resize?.observe(hero);
  controller={refresh,sync,destroy(){
    destroyed=true;abort.abort();intersection?.disconnect();resize?.disconnect();cancelAnimationFrame(scheduled);
    for(const animation of entrances)animation.cancel();
    for(const host of sculptures){host.classList.remove('is-motion-active');resetMagnet(host);}
    for(const art of artworks)art.setAttribute('data-art-paused','true');
    for(const row of rows)row.style.removeProperty('--marquee-shift');
    for(const card of projects){card.style.removeProperty('--project-scale');card.style.removeProperty('--project-stack');}
    for(const [element,{text}] of paragraphs)element.textContent=text;
    for(const set of [sculptures,artworks,rows,projects,observed,visible,entrances])set.clear();
    paragraphs.clear();
    pointerRow=null;pointerId=null;
    controller=null;
  }};
  refresh();return controller;
}

export function syncCreatorMotion() {controller?.sync();}
