import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load = async name => JSON.parse(await readFile(new URL(`../dist/data/${name}.json`,import.meta.url),'utf8'));

test('packaged observations reconcile with coded evidence and preserve missing channels',async()=>{
  const catalog=await load('catalog');
  const summaries=await load('discord-observations');
  const coding=await load('discord-message-coding');
  const challenges=catalog.challenges || catalog.records;
  assert.equal(challenges.length,8);
  assert.equal(new Set(challenges.map(r=>r.id || r.challenge_id)).size,8);
  assert.equal(new Set(coding.records.map(r=>r.message_id)).size,coding.records.length);
  for(const summary of summaries.records){
    const rows=coding.records.filter(r=>r.challenge_id===summary.challenge_id);
    if(summary.coverage_status==='not_read'){
      assert.equal(rows.length,0);
      assert.equal(summary.observed_messages,null);
      assert.equal(summary.distinct_display_labels,null);
      assert.equal(summary.category_counts,null);
    }else{
      assert.equal(summary.observed_messages,rows.length);
      assert.equal(summary.distinct_display_labels,new Set(rows.map(r=>r.display_alias)).size);
      const categories={};
      for(const row of rows) categories[row.category]=(categories[row.category]||0)+1;
      assert.deepEqual(summary.category_counts,categories);
      assert.equal(Object.values(summary.display_label_message_counts).reduce((s,n)=>s+n,0),rows.length);
    }
    assert.equal(summary.participant_count,null);
    assert.equal(summary.team_count,null);
    assert.equal(summary.entrant_count,null);
    if(summary.coverage_status!=='complete') assert.equal(summary.messages_per_hour,null);
  }
});
