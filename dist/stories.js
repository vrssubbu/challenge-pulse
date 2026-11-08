import {THEMES, labelForCategory, themeSummaries} from './pulse-model.js?v=4';
import {CATEGORY_LABELS} from './model.js?v=4';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const number = value => value.toLocaleString('en-US');
const share = (count, total) => {
  const percentage = count / total * 100;
  return percentage > 0 && percentage < 1 ? '<1%' : `${Math.round(percentage)}%`;
};
const colors = ['#f4cf8b','#bd7d91','#79b8b2','#9ba6cb','#d99a74','#b7b58c','#d5acbf','#719fbc'];
const stories = [
  {theme:'clarity',kicker:'THE QUESTIONS',title:'Help, rules & logistics',copy:'Messages coded as help, rule clarification or logistics. This includes explanations and answers, not just requests.'},
  {theme:'building',kicker:'THE WORK IN PROGRESS',title:'Ideas being worked through',copy:'Messages about strategy, reported progress or collaboration. These are discussion signals; outcomes are unverified.'},
  {theme:'participation',kicker:'THE EXPLICIT SIGNALS',title:'Participation, in their posts',copy:'Posts explicitly signaling participation. A post is not a verified team, entrant or completed submission.'}
];

/** Render selected, normalized message records; callbacks open the existing explorer. */
export function renderPulseStories(rows, {onExplore = () => {}, challengeName = id => id, selected = 'all'} = {}) {
  const root = document.getElementById('pulse-stories');
  if (!root) return;
  const records = Array.isArray(rows) ? rows : [];
  const total = records.length;
  const scope = selected === 'all' ? 'All selected challenges' : typeof challengeName === 'function' ? challengeName(selected) : String(challengeName);
  const heading = `<div class="pulse-stories-heading"><div><span class="eyebrow">03 / THE FINDINGS</span><h2 id="pulse-stories-title">What the sample says.</h2></div><p>${escapeHtml(scope)} · ${number(total)} selected message${total === 1 ? '' : 's'}<br><small>Recorded observations · partial coverage</small></p></div>`;
  root.setAttribute('aria-labelledby', 'pulse-stories-title');
  if (!total) {
    root.innerHTML = `${heading}<div class="pulse-story-empty"><span class="eyebrow">ROOM FOR EVIDENCE</span><h3>No messages in this selection.</h3><p>No category shares can be calculated. An empty sample does not establish that a challenge was quiet.</p></div>`;
    return;
  }

  const themes = themeSummaries(records);
  const cards = stories.map((story, index) => {
    const count = themes.find(theme => theme.id === story.theme)?.count ?? 0;
    return `<article class="pulse-story-card" style="--enter-delay:${index * 90}ms"><span class="pulse-story-index" aria-hidden="true">0${index+1}</span><span class="pulse-story-kicker">${story.kicker}</span><div class="pulse-story-value">${number(count)}<small>${escapeHtml(share(count,total))} of sample</small></div><h3 class="pulse-story-title">${story.title}</h3><p class="pulse-story-copy">${story.copy}</p><button type="button" class="pulse-story-link" data-story-theme="${story.theme}" aria-label="Inspect ${number(count)} messages: ${story.title}"${count ? '' : ' disabled'}>${count ? 'Explore these messages' : 'None in this sample'} <span aria-hidden="true">↗</span></button></article>`;
  }).join('');

  const counts = new Map();
  for (const row of records) counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
  // Stable category order keeps color associations consistent when filters change.
  const categoryOrder = Object.keys(CATEGORY_LABELS);
  const entries = [...counts].sort(([a],[b]) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b) || String(a).localeCompare(String(b)));
  const colorFor = category => colors[Math.max(0, categoryOrder.indexOf(category)) % colors.length];
  const distribution = entries.map(([category,count]) => `<span class="pulse-composition-segment" style="--segment-share:${count/total*100}%;--segment-color:${colorFor(category)};flex-basis:${count/total*100}%;background:${colorFor(category)}"></span>`).join('');
  const legend = entries.map(([category,count]) => `<button type="button" class="pulse-composition-key" data-story-category="${escapeHtml(category)}" style="--segment-color:${colorFor(category)}"><span aria-hidden="true"></span><span>${escapeHtml(labelForCategory(category,CATEGORY_LABELS))}</span><strong>${number(count)} <small>· ${escapeHtml(share(count,total))}</small></strong></button>`).join('');
  const clarity = themes.find(theme => theme.id === 'clarity')?.count ?? 0;
  const building = themes.find(theme => theme.id === 'building')?.count ?? 0;
  const line = clarity && building ? 'Questions are part of the build.' : clarity ? 'A useful next step can begin with a question.' : building ? 'The process leaves traces in the conversation.' : 'Every recorded message is one piece of the picture.';
  const lines = [line, building ? 'Progress leaves a trail in the conversation.' : 'A recorded message offers a starting point, not the whole picture.', 'A signal starts the story. Evidence gives it shape.'];
  let lineIndex = 0;
  root.innerHTML = `${heading}<div class="pulse-stories-grid">${cards}</div><div class="pulse-composition"><div><span class="eyebrow">ONE SAMPLE, MANY TOPICS</span><h3>The conversation mix</h3><p>One category per message. Every segment uses the same denominator: ${number(total)} selected messages.</p></div><div class="pulse-composition-bar" aria-hidden="true">${distribution}</div><div class="pulse-composition-legend" aria-label="Message category counts and shares; select a category to explore">${legend}</div></div><aside class="pulse-editorial"><span class="eyebrow">EDITORIAL INTERPRETATION · NOT A PARTICIPANT QUOTATION</span><div class="pulse-editorial-output" aria-live="polite" aria-atomic="true"><strong class="pulse-editorial-line">${line}</strong></div><p>These content patterns describe the selected sample. They do not measure feelings, difficulty, popularity or the full event.</p><button type="button" class="pulse-story-link" data-pulse-editorial-next aria-label="Show the next editorial pulse line">Next pulse line <span aria-hidden="true">→</span></button></aside>`;
  root.querySelectorAll('[data-story-theme]').forEach(button => button.addEventListener('click', () => {
    if (THEMES.some(theme => theme.id === button.dataset.storyTheme)) onExplore({challenge:selected,theme:button.dataset.storyTheme});
  }));
  root.querySelectorAll('[data-story-category]').forEach(button => button.addEventListener('click', () => onExplore({challenge:selected,category:button.dataset.storyCategory})));
  root.querySelector('[data-pulse-editorial-next]').addEventListener('click', () => {
    lineIndex = (lineIndex + 1) % lines.length;
    const nextLine = document.createElement('strong');
    nextLine.className = 'pulse-editorial-line';
    nextLine.textContent = lines[lineIndex];
    root.querySelector('.pulse-editorial-output').replaceChildren(nextLine);
  });
}
