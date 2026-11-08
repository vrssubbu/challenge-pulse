import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildCreatorStories} from '../dist/creator-data.js';
import {filterMessages} from '../dist/pulse-model.js';
import {parseImport,mergeMessages} from '../dist/model.js';

const source=JSON.parse(readFileSync(new URL('../dist/data/discord-message-coding.json',import.meta.url),'utf8'));
const rows=parseImport(source);
const counts=stories=>stories.map(({id,count,total,share})=>({id,count,total,share}));

test('creator stories summarize the real sample and preserve inspectable source records',()=>{
  const stories=buildCreatorStories(rows);
  assert.deepEqual(counts(stories),[
    {id:'clarity',count:41,total:140,share:41/140},
    {id:'building',count:24,total:140,share:24/140},
    {id:'participation',count:11,total:140,share:11/140}
  ]);
  const byId=new Map(rows.map(row=>[row.message_id,row]));
  for(const story of stories){
    assert.equal(story.records.length,story.count);
    for(const record of story.records){
      assert.strictEqual(record,byId.get(record.message_id));
      assert.equal(record.source_type,'discord_ui_observation');
      assert.ok(record.source_url.endsWith('/'+record.message_id));
    }
  }
});

test('selecting HEB changes story denominators and resetting restores the full sample',()=>{
  const before=JSON.stringify(rows);
  const selected=filterMessages(rows,{challenge:'heb'});
  const stories=buildCreatorStories(selected);
  assert.equal(selected.length,30);
  assert.deepEqual(counts(stories),[
    {id:'clarity',count:11,total:30,share:11/30},
    {id:'building',count:2,total:30,share:2/30},
    {id:'participation',count:11,total:30,share:11/30}
  ]);
  assert.ok(stories.every(story=>story.records.every(record=>record.challenge_id==='heb'&&selected.includes(record))));
  // Participation counts posts, including repeated reported labels, not nine teams.
  assert.equal(stories[2].records.length,11);
  assert.equal(new Set(stories[2].records.map(record=>record.reported_team_alias)).size,9);
  assert.deepEqual(buildCreatorStories(filterMessages(rows,{challenge:'all'})).map(story=>story.count),[41,24,11]);
  assert.equal(JSON.stringify(rows),before);
});

test('a filter with no matching messages shows unavailable shares, not invented zeros or samples',()=>{
  const empty=filterMessages(rows,{challenge:'heb',query:'this phrase has no matching observed message'});
  assert.equal(empty.length,0);
  const stories=buildCreatorStories(empty);
  assert.equal(stories.length,3);
  assert.ok(stories.every(story=>story.count===0&&story.total===0&&story.share===null&&story.records.length===0));
});

test('reimporting observations does not inflate stories and synthetic records stay outside the observed import',()=>{
  const before=JSON.stringify(rows);
  const merged=mergeMessages(rows,parseImport(source));
  assert.equal(merged.added,0);
  assert.deepEqual(counts(buildCreatorStories(merged.records)),counts(buildCreatorStories(rows)));
  assert.throws(()=>parseImport({schema_version:1,records:[{
    ...rows[0],category:'participation_confirmation',source_type:'synthetic',is_observed:false,scenario_only:true
  }]}),/source_type|synthetic/i);
  assert.equal(JSON.stringify(rows),before);
});
