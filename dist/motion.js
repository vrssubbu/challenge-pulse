// Progressive motion: the final values and content are present before animation.
// This module never simulates messages arriving or changes analytical values.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const seen = new WeakSet();
const active = new Set();
const magnetic = new Set();
const wordBlocks = new Set();
let scrollFrame = 0;
const enabled = () => !reduced.matches && !document.documentElement.classList.contains('motion-paused');
const selectors = '.metric,.theme-card,.challenge-card,.discord-card,.pulse-story-card,.pulse-composition,.pulse-editorial,.page-intro,.timeline-card';
function reveal(element) {
  if (!enabled() || !element.animate) return;
  const animation = element.animate([
    {opacity:.55, transform:'translateY(22px)'},
    {opacity:1, transform:'translateY(0)'}
  ], {duration:650, easing:'cubic-bezier(.16,1,.3,1)'});
  active.add(animation);
  animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
}
const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{
    if (!isIntersecting) return;
    observer.unobserve(target);
    reveal(target);
  });
}, {threshold:.1}) : null;
export function refreshMotion() {
  document.querySelectorAll(selectors).forEach(element=>{
    if(seen.has(element)) return;
    seen.add(element);
    observer?.observe(element);
  });
  document.querySelectorAll('[data-magnetic]').forEach(element=>{
    if(magnetic.has(element))return;
    magnetic.add(element);
    element.addEventListener('pointermove',event=>{
      if(!enabled()||event.pointerType==='touch')return;
      const rect=element.getBoundingClientRect();
      const x=Math.max(-7,Math.min(7,(event.clientX-rect.left-rect.width/2)*.07));
      const y=Math.max(-5,Math.min(5,(event.clientY-rect.top-rect.height/2)*.1));
      element.style.translate=`${x}px ${y}px`;
    },{passive:true});
    const reset=()=>element.style.removeProperty('translate');
    element.addEventListener('pointerleave',reset);
    element.addEventListener('blur',reset);
  });
  document.querySelectorAll('[data-scroll-words]').forEach(element=>{
    if(wordBlocks.has(element))return;
    wordBlocks.add(element);
    const words=element.textContent.trim().split(/\s+/);
    element.replaceChildren(...words.flatMap((word,index)=>{
      const span=document.createElement('span');
      span.className='scroll-word';
      span.textContent=word;
      return index===words.length-1?[span]:[span,document.createTextNode(' ')];
    }));
  });
  scheduleWords();
}
export function syncMotion() {
  if (enabled()) {scheduleWords();return;}
  for (const animation of active) animation.cancel();
  active.clear();
  cancelAnimationFrame(scrollFrame);scrollFrame=0;
  magnetic.forEach(element=>element.style.removeProperty('translate'));
  wordBlocks.forEach(element=>element.querySelectorAll('.scroll-word').forEach(word=>word.style.removeProperty('opacity')));
  const hero=document.querySelector('.hero');
  hero?.style.removeProperty('--pointer-x');
  hero?.style.removeProperty('--pointer-y');
}
function scheduleWords(){
  if(scrollFrame||!enabled()||document.hidden)return;
  scrollFrame=requestAnimationFrame(()=>{
    scrollFrame=0;
    wordBlocks.forEach(element=>{
      if(!element.isConnected)return;
      const rect=element.getBoundingClientRect();
      if(!rect.width||rect.bottom<0||rect.top>innerHeight)return;
      const progress=Math.max(0,Math.min(1,(innerHeight*.9-rect.top)/(innerHeight*.55)));
      const words=[...element.querySelectorAll('.scroll-word')];
      words.forEach((word,index)=>{
        const light=Math.max(0,Math.min(1,progress*(words.length+2)-index));
        word.style.opacity=String(.45+.55*light);
      });
    });
  });
}
window.addEventListener('scroll',scheduleWords,{passive:true});
window.addEventListener('resize',scheduleWords,{passive:true});
const hero=document.querySelector('.hero');
hero?.addEventListener('pointermove',event=>{
  if(!enabled()||event.pointerType==='touch')return;
  const rect=hero.getBoundingClientRect();
  hero.style.setProperty('--pointer-x',`${(event.clientX-rect.left)/rect.width*100}%`);
  hero.style.setProperty('--pointer-y',`${(event.clientY-rect.top)/rect.height*100}%`);
},{passive:true});
hero?.addEventListener('pointerleave',()=>{
  hero.style.removeProperty('--pointer-x');hero.style.removeProperty('--pointer-y');
});
reduced.addEventListener('change',syncMotion);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){for(const animation of active)animation.cancel();active.clear();}
});
