// The reel moves recorded challenge cards; motion is never a live-activity signal.
import {createReelArt} from './reel-art.js?v=6';
const symbols = ['♠','▥','✦','♦','♣','↗','♥','◈'];
const accents = ['#e6b97b','#a1b9ba','#c9a0b4','#b6b7d3','#a7c4a5','#d4a48e','#cead72','#9dbacb'];

export function wrapReelDistance(distance, span) {
  if (!Number.isFinite(distance) || !Number.isFinite(span) || span <= 0) return 0;
  return ((distance + span / 2) % span + span) % span - span / 2;
}

function roundedQuad(points, radius) {
  const along = (origin, destination) => {
    const distance = Math.hypot(destination[0]-origin[0],destination[1]-origin[1]);
    const fraction = Math.min(radius / distance,.25);
    return [origin[0]+(destination[0]-origin[0])*fraction,origin[1]+(destination[1]-origin[1])*fraction];
  };
  const format = point => point.map(value=>value.toFixed(2)).join(' ');
  const corners=points.map((point,index)=>({point,before:along(point,points[(index+3)%4]),after:along(point,points[(index+1)%4])}));
  return `M ${format(corners[0].before)} `+corners.map((corner,index)=>`${index?'L '+format(corner.before)+' ':''}Q ${format(corner.point)} ${format(corner.after)}`).join(' ')+' Z';
}

/** A rounded cylindrical quad. Card size depends on position, never its message count. */
export function reelCardGeometry(distance, viewportWidth, scale = 1) {
  const radius=Math.max(160,viewportWidth/2-14);
  const d=Math.min(Math.abs(distance)/radius,1.5);
  const width=(180+42*d*d)*scale;
  const x=distance*(1+.083*d*d);
  const edgeHeight=edge=>(285+80*Math.pow(Math.min(Math.abs(edge)/radius,1.65),2.6))*scale;
  const leftHeight=edgeHeight(x-width/2),rightHeight=edgeHeight(x+width/2);
  const height=Math.max(leftHeight,rightHeight);
  const topLeft=(height-leftHeight)/2,topRight=(height-rightHeight)/2;
  const polygon=[[0,topLeft],[width,topRight],[width,topRight+rightHeight],[0,topLeft+leftHeight]];
  return {x,y:-12*d*d*scale,width,height,leftHeight,rightHeight,clipPath:`path("${roundedQuad(polygon,14*scale)}")`};
}

export function signalReelItems(catalog = [], records = []) {
  const counts = new Map();
  for (const row of records) counts.set(row.challenge_id, (counts.get(row.challenge_id) || 0) + 1);
  return catalog.map((challenge, index) => ({
    id: challenge.id ?? challenge.challenge_id,
    name: challenge.name ?? 'Challenge',
    count: counts.get(challenge.id ?? challenge.challenge_id) ?? null,
    symbol: symbols[index % symbols.length], accent: accents[index % accents.length]
  }));
}

/** Mount once. update({catalog, records, selected}) keeps the same animation loop. */
export function mountSignalReel({catalog = [], records = [], onSelect = () => {}, selected = 'all'} = {}) {
  const stage = document.getElementById('signal-reel-stage');
  if (!stage) return null;
  const previous = document.getElementById('reel-prev');
  const next = document.getElementById('reel-next');
  const all = document.getElementById('reel-all');
  const status = document.getElementById('reel-status');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  const listen = (target, type, handler, options = {}) => target?.addEventListener(type, handler, {...options, signal:abort.signal});
  let items = [], cards = [], position = 0, step = 205, width = 1, scale = 1;
  let frame = 0, lastTime = 0, velocity = 0, target = null, drag = null;
  let visible = !('IntersectionObserver' in window), hovered = false, focusWithin = false;
  let staticMode = false, destroyed = false, suppressUntil = 0, selectedId = selected;
  let sourceCatalog = catalog, sourceRecords = records;
  const motionAllowed = () => !reduced.matches && !document.documentElement.classList.contains('motion-paused');
  const syncArtMotion = () => stage.classList.toggle('reel-motion-frozen',!visible || document.hidden);
  const canAnimate = () => !destroyed && !staticMode && visible && !document.hidden && items.length > 1;
  const shouldTick = () => canAnimate() && !drag && (target !== null || Math.abs(velocity) > .5 || (!hovered && !focusWithin));
  const announce = index => {
    const item = items[index];
    if (status && item) status.textContent = `${item.name} · ${item.count === null ? 'no recorded sample' : item.count + ' recorded messages'} · partial coverage`;
  };
  const draw = () => {
    if (staticMode) return;
    const span = step * items.length;
    cards.forEach((card,index) => {
      const distance = wrapReelDistance(index * step - position, span);
      const geometry = reelCardGeometry(distance,width,scale);
      card.style.width=`${geometry.width.toFixed(2)}px`;
      card.style.height=`${geometry.height.toFixed(2)}px`;
      card.style.clipPath=geometry.clipPath;
      card.style.setProperty('--reel-copy-safe',`${((geometry.height-Math.min(geometry.leftHeight,geometry.rightHeight))/2).toFixed(2)}px`);
      card.style.transform = `translate(-50%,-50%) translate3d(${geometry.x.toFixed(2)}px,${geometry.y.toFixed(2)}px,0)`;
      card.style.zIndex = String(100-Math.round(Math.min(1.5,Math.abs(distance)/(width/2))*20));
    });
  };
  const tick = time => {
    frame = 0;
    if (!shouldTick()) { lastTime = 0; return; }
    const dt = lastTime ? Math.min((time-lastTime)/1000,.05) : 0;
    lastTime = time;
    if (target !== null) {
      const delta = target-position;
      position += delta * (1-Math.exp(-12*dt));
      if (Math.abs(delta)<.3) {position=target;target=null;}
    } else if (Math.abs(velocity)>.5) {
      position += velocity*dt;
      velocity *= Math.exp(-3*dt);
    } else if (!hovered && !focusWithin) {
      position += 50*scale*dt;
    }
    if (target === null && items.length) position = ((position%(step*items.length))+step*items.length)%(step*items.length);
    draw();
    request();
  };
  const request = () => {
    if (shouldTick() && !frame) frame=requestAnimationFrame(tick);
  };
  const stop = () => {if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;};
  const center = (index, animate = true) => {
    if (!cards.length) return;
    index=((index%cards.length)+cards.length)%cards.length;
    announce(index);
    velocity=0;
    if (staticMode) {
      cards[index].scrollIntoView({behavior:'auto',block:'nearest',inline:'center'});
      return;
    }
    target = position + wrapReelDistance(index*step-position,step*cards.length);
    if (!animate || !visible) {position=target;target=null;draw();}
    request();
  };
  const navigate = direction => {
    if(!items.length)return;
    if(staticMode) {
      const centerX=stage.scrollLeft+stage.clientWidth/2;
      const nearest=cards.reduce((best,card,index)=>Math.abs(card.offsetLeft+card.offsetWidth/2-centerX)<Math.abs(cards[best].offsetLeft+cards[best].offsetWidth/2-centerX)?index:best,0);
      center(nearest+direction,false);
    } else center(Math.round((target ?? position)/step)+direction);
  };
  const measure = () => {
    const oldStep=step;
    width=stage.clientWidth || 1;
    // Geometry writes card width every frame, so measurement uses a stable pitch.
    scale=width<=820?5/6:1;
    step=205*scale;
    position=position/oldStep*step;
    if(target!==null)target=target/oldStep*step;
    draw();
    request();
  };
  function syncMotion() {
    const nextStatic=!motionAllowed();
    if(nextStatic!==staticMode) {
      staticMode=nextStatic;
      stage.classList.toggle('reel-static',staticMode);
      if(!staticMode)stage.scrollLeft=0;
      velocity=0;target=null;drag=null;
      stage.classList.remove('dragging');
      cards.forEach(clearGeometry);
      measure();
    }
    if(!shouldTick())stop();else request();
  }
  function update({catalog:updatedCatalog = sourceCatalog, records:updatedRecords = sourceRecords, selected:updatedSelected = selectedId} = {}) {
    sourceCatalog=updatedCatalog;sourceRecords=updatedRecords;selectedId=updatedSelected;
    const updated=signalReelItems(sourceCatalog,sourceRecords);
    const rebuild=items.length!==updated.length || updated.some((item,index)=>items[index]?.id!==item.id);
    items=updated;
    if(rebuild) {
      stop();stage.replaceChildren();
      cards=items.map((item,index)=>{
        const card=document.createElement('button');
        card.type='button';card.className='reel-card';card.dataset.reelId=item.id;
        card.style.setProperty('--card-accent',item.accent);
        card.append(createReelArt(index));
        const copy=document.createElement('span');copy.className='reel-card-copy';
        const label=(className,tag='span',parent=card)=>{const element=document.createElement(tag);element.className=className;parent.append(element);return element;};
        label('reel-card-index').textContent=String(index+1).padStart(2,'0');
        const icon=label('reel-card-symbol');icon.textContent=item.symbol;icon.setAttribute('aria-hidden','true');
        label('reel-card-name','strong',copy);label('reel-card-count','span',copy);label('reel-card-caption','span',copy);
        card.append(copy);
        listen(card,'click',event=>{if(event.detail!==0&&performance.now()<suppressUntil)return;onSelect(item.id);});
        // Pointer focus must not move a card out from under the pending click.
        listen(card,'focus',()=>{if(!drag&&card.matches(':focus-visible'))center(index,false);});
        stage.append(card);return card;
      });
    }
    items.forEach((item,index)=>{
      const card=cards[index];
      card.querySelector('.reel-card-name').textContent=item.name;
      const count=card.querySelector('.reel-card-count');
      count.textContent=item.count===null?'No sample':String(item.count);
      if(item.count!==null){const unit=document.createElement('small');unit.className='reel-card-unit';unit.textContent=' messages';count.append(unit);}
      card.querySelector('.reel-card-caption').textContent='Recorded sample · inspect ↗';
      card.setAttribute('aria-label',`${item.name}: ${item.count===null?'no recorded sample':item.count+' observed messages'}; select challenge`);
      card.setAttribute('aria-pressed',String(selectedId===item.id));
      card.classList.toggle('selected',selectedId===item.id);
    });
    all?.setAttribute('aria-pressed',String(selectedId==='all'));
    if(status)status.textContent=selectedId==='all'?'All challenges selected · recorded samples, not a live feed':`${items.find(item=>item.id===selectedId)?.name ?? 'Challenge'} selected · findings below follow this selection`;
    if(previous)previous.disabled=items.length<2;
    if(next)next.disabled=items.length<2;
    measure();syncMotion();
  }
  listen(previous,'click',()=>navigate(-1));
  listen(next,'click',()=>navigate(1));
  listen(all,'click',()=>onSelect('all'));
  listen(stage,'pointerenter',event=>{if(event.pointerType!=='touch'){hovered=true;if(!shouldTick())stop();}});
  listen(stage,'pointerleave',()=>{hovered=false;request();});
  listen(stage,'focusin',()=>{focusWithin=true;velocity=0;stop();});
  listen(stage,'focusout',event=>{if(!stage.contains(event.relatedTarget)){focusWithin=false;request();}});
  listen(stage,'keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const index=Math.max(0,cards.indexOf(document.activeElement));
    const destination=event.key==='Home'?0:event.key==='End'?cards.length-1:(index+(event.key==='ArrowRight'?1:-1)+cards.length)%cards.length;
    cards[destination]?.focus({preventScroll:true});center(destination,false);
  });
  listen(stage,'pointerdown',event=>{
    if(staticMode||!event.isPrimary||event.button!==0)return;
    drag={id:event.pointerId,startX:event.clientX,startY:event.clientY,lastX:event.clientX,time:performance.now(),moved:false};
    velocity=0;target=null;stop();
  });
  listen(stage,'pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;
    if(!drag.moved) {
      if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){drag=null;request();return;}
      if(Math.abs(dx)<6)return;
      drag.moved=true;stage.classList.add('dragging');stage.setPointerCapture(event.pointerId);
    }
    const now=performance.now(),dt=Math.max((now-drag.time)/1000,.008),delta=event.clientX-drag.lastX;
    position-=delta;velocity=Math.max(-1400,Math.min(1400,-delta/dt));
    drag.lastX=event.clientX;drag.time=now;draw();
  });
  const endDrag=event=>{
    if(!drag||event.pointerId!==drag.id)return;
    if(drag.moved){suppressUntil=performance.now()+350;if(performance.now()-drag.time>100)velocity=0;}
    if(event.type==='pointercancel')velocity=0;
    if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
    drag=null;stage.classList.remove('dragging');request();
  };
  // A short press may leave the stage before capture has begun.
  listen(document,'pointerup',endDrag);listen(document,'pointercancel',endDrag);
  listen(stage,'lostpointercapture',endDrag);
  listen(stage,'click',event=>{if(event.detail!==0&&performance.now()<suppressUntil){event.preventDefault();event.stopPropagation();}},{capture:true});
  listen(document,'visibilitychange',()=>{syncArtMotion();if(document.hidden)stop();else request();});
  listen(reduced,'change',syncMotion);
  const intersection='IntersectionObserver' in window?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncArtMotion();if(visible){draw();request();}else stop();},{threshold:0}):null;
  intersection?.observe(stage);
  const resize='ResizeObserver' in window?new ResizeObserver(measure):null;
  resize?.observe(stage);
  if(!resize)listen(window,'resize',measure,{passive:true});
  syncArtMotion();
  update({catalog,records,selected});
  function clearGeometry(card) {
    for(const property of ['transform','z-index','width','height','clip-path','--reel-copy-safe'])card.style.removeProperty(property);
  }
  return {update,syncMotion,destroy(){destroyed=true;stop();abort.abort();intersection?.disconnect();resize?.disconnect();stage.classList.remove('dragging');stage.classList.add('reel-static');cards.forEach(clearGeometry);}};
}
