// Progressive motion: the final values and content are present before animation.
// This module never simulates messages arriving or changes analytical values.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const seen = new WeakSet();
const active = new Set();
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
}
export function syncMotion() {
  if (enabled()) return;
  for (const animation of active) animation.cancel();
  active.clear();
  const hero=document.querySelector('.hero');
  hero?.style.removeProperty('--pointer-x');
  hero?.style.removeProperty('--pointer-y');
}
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
