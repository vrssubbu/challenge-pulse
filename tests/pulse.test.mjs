import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {themeSummaries,displayTimeBuckets,filterMessages,buildCoverage} from '../dist/pulse-model.js';
const fixture=JSON.parse(fs.readFileSync(new URL('../dist/data/discord-message-coding.json',import.meta.url),'utf8'));
const rows=fixture.records;

test('thematic requests are coded content counts with an explicit sample denominator',()=>{
  const theme=themeSummaries(rows).find(t=>t.id==='leaderboard');
  assert.equal(theme.denominator,rows.length);
  assert.equal(theme.count,rows.filter(r=>r.category==='leaderboard_request').length);
  assert.equal(themeSummaries([])[0].denominator,0);
});
test('display-time groups contain only observed messages and do not interpolate missing hours',()=>{
  const sample=[{message_id:'1',display_date:'2026-11-07',display_time:'22:47'},{message_id:'2',display_date:'2026-11-08',display_time:'02:03'}];
  const buckets=displayTimeBuckets(sample);
  assert.deepEqual(buckets.map(b=>b.key),['2026-11-07T22','2026-11-08T02']);
  assert.equal(buckets.reduce((n,b)=>n+b.count,0),2);
  assert.equal(buckets.some(b=>'rate' in b),false);
});
test('snapshot filter trusts authoritative message membership rather than imported snapshot claims',()=>{
  const sample=[{...rows[0],snapshot_ids:['known']},{...rows[1],snapshot_ids:['known']}];
  const snapshots=[{snapshot_id:'known',message_ids:[rows[0].message_id]}];
  assert.deepEqual(filterMessages(sample,{snapshot:'known'},snapshots).map(r=>r.message_id),[rows[0].message_id]);
  assert.equal(filterMessages(sample,{snapshot:'unknown'},snapshots).length,0);
});
test('lenses, category, query and role filters compose without assigning unknown roles',()=>{
  const questions=filterMessages(rows,{lens:'questions',query:'leaderboard'});
  assert.ok(questions.every(r=>r.category==='leaderboard_request'));
  assert.equal(filterMessages(rows,{role:'organizer'}).length,rows.filter(r=>r.author_role==='organizer').length);
  assert.equal(filterMessages(rows,{challenge:'heb'}).length,rows.filter(r=>r.challenge_id==='heb').length);
});
test('unread coverage stays null and mixed imports discard incompatible identity/time summaries',()=>{
  const base=[{challenge_id:'revs-casino',coverage_status:'partial',observed_messages:rows.length,distinct_display_labels:5,displayed_date:'2026-11-07',first_displayed_time:'22:47',largest_display_label_message_share:.6,reaction_counted_messages:2,reaction_count_sum_observed:16},{challenge_id:'heb',coverage_status:'not_read',observed_messages:null}];
  const result=buildCoverage(['revs-casino','heb'],base,rows,[rows[0]]);
  assert.equal(result[0].observed_messages,rows.length);
  assert.equal(result[0].distinct_display_labels,null);
  assert.equal(result[0].displayed_date,null);
  assert.equal(result[0].largest_display_label_message_share,null);
  assert.equal(result[0].reaction_count_sum_observed,null);
  assert.equal(result[0].messages_per_hour,null);
  assert.equal(result[1].observed_messages,null);
});
