import {copyFile, cp, mkdir, readFile, readdir, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

// Prepare a local review copy. This script never commits, pushes or deploys.
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const dataset=path.join(root,'dataset');
const downloads=path.join(root,'dist/downloads');
const review=path.resolve(root,'../Participant Pulse Final Review');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
await import('./package-dataset.mjs');
const manifest=JSON.parse(await readFile(path.join(dataset,'MANIFEST.json'),'utf8'));
assert(manifest.workbook.included,'Finalize the Excel workbook before preparing a review.');
assert(!manifest.files.some(f=>/inspect\.ndjson|ELIGIBILITY|DEMO_OUTLINE|requirements-review/.test(f.path)),'Remove old audit/support files from the dataset package.');
for(const item of [...manifest.files,{path:'MANIFEST.json'}]){
  const source=path.join(dataset,item.path),target=path.join(downloads,item.path);
  await mkdir(path.dirname(target),{recursive:true});
  const bytes=await readFile(source);
  if(item.sha256)assert.equal(hash(bytes),item.sha256,`Dataset manifest: ${item.path}`);
  await copyFile(source,target);
  assert.equal(hash(await readFile(target)),hash(bytes),`Website download: ${item.path}`);
}
const reviewEntries=['dist','dataset','docs','scripts','tests','.openai','README.md','serve.mjs','package.json','.gitignore','.gitattributes'];
await mkdir(review,{recursive:true});
for(const entry of reviewEntries){
  const source=path.join(root,entry);
  if((await stat(source)).isDirectory())await cp(source,path.join(review,entry),{recursive:true});
  else await copyFile(source,path.join(review,entry));
}
await writeFile(path.join(review,'START_HERE.md'),`# Participant Pulse — Final review\n\nTeam: **CTRL_ALT_DEFEAT**\n\n- [Final Excel](dataset/Participant_Pulse_Dataset.xlsx)\n- [Dataset documentation](dataset/DATASET_DOCUMENTATION.md)\n- [Verified contents](dataset/VERIFIED_CONTENTS.md)\n- [Raw dataset and dictionary](dataset/)\n\nThe website, Excel and documentation use the same bundled 140 observations across 8 challenges. The key finding is 41 help/rules/logistics messages (29.3%). The CTRL_ALT_DEFEAT block animation is preserved.\n\n## Open the website\n\nWith Node.js 18 or newer installed, run \`node serve.mjs\` from this folder, then open http://127.0.0.1:4173. No package installation is required. The website’s Excel button downloads the exact workbook linked above. JSON/CSV exports include any records later imported in that browser; the Excel remains the bundled snapshot.\n\nThis is a local review copy. No commit, push or publication is performed by the preparation script.\n`);
async function inventory(directory,prefix=''){
  const result=[];
  for(const entry of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
    const relative=prefix?`${prefix}/${entry.name}`:entry.name;
    if(relative==='REVIEW_MANIFEST.json')continue;
    if(entry.isDirectory())result.push(...await inventory(path.join(directory,entry.name),relative));
    else {const bytes=await readFile(path.join(directory,entry.name));result.push({path:relative,bytes:bytes.length,sha256:hash(bytes)});}
  }
  return result;
}
const files=await inventory(review);
await writeFile(path.join(review,'REVIEW_MANIFEST.json'),JSON.stringify({project:'Participant Pulse',team:'CTRL_ALT_DEFEAT',status:'local review',files},null,2)+'\n');
assert.equal(hash(await readFile(path.join(review,'dataset/Participant_Pulse_Dataset.xlsx'))),hash(await readFile(path.join(review,'dist/downloads/Participant_Pulse_Dataset.xlsx'))));
console.log(`Review ready: ${review} (${files.length} files). Excel and website download are byte-identical. No Git or publishing actions performed.`);
