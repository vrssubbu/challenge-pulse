import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {themeSummaries,sampledDisplaySpan,participationSummary,displayTimeBuckets,filterMessages,buildCoverage} from '../dist/pulse-model.js';
const fixture=JSON.parse(fs.readFileSync(new URL('../dist/data/discord-message-coding.json',import.meta.url),'utf8'));
const rows=fixture.records;

test('thematic requests are coded content counts with an explicit sample denominator',()=>{
  const theme=themeSummaries(rows).find(t=>t.id==='leaderboard');
  assert.equal(theme.denominator,rows.length);
  assert.equal(theme.count,rows.filter(r=>['leaderboard_request','score_request'].includes(r.category)).length);
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
  const sample=rows.filter(r=>r.challenge_id==='revs-casino');
  const base=[{challenge_id:'revs-casino',coverage_status:'partial',observed_messages:sample.length,distinct_display_labels:5,displayed_date:'2026-11-07',first_displayed_date:'2026-11-07',last_displayed_date:'2026-11-07',first_displayed_time:'22:47',largest_display_label_message_share:.6,reaction_counted_messages:2,reaction_count_sum_observed:16,reported_team_label_count:2,reported_team_alias_scope:'fixture'},{challenge_id:'heb',coverage_status:'not_read',observed_messages:null}];
  const result=buildCoverage(['revs-casino','heb'],base,sample,[sample[0]]);
  assert.equal(result[0].observed_messages,sample.length);
  assert.equal(result[0].distinct_display_labels,null);
  assert.equal(result[0].displayed_date,null);
  assert.equal(result[0].largest_display_label_message_share,null);
  assert.equal(result[0].reaction_count_sum_observed,null);
  assert.equal(result[0].first_displayed_date,null);
  assert.equal(result[0].reported_team_label_count,null);
  assert.equal(result[0].reported_team_alias_scope,null);
  assert.equal(result[0].messages_per_hour,null);
  assert.equal(result[1].observed_messages,null);
});
test('sampled display spans preserve distinct dates without inventing verified timezone or continuous coverage',()=>{
  const sample=[{display_date:'2026-11-08',display_time:'02:13',timezone:null},{display_date:'2026-11-07',display_time:'23:50',timezone:null}];
  assert.deepEqual(sampledDisplaySpan(sample),{start_date:'2026-11-07',start_time:'23:50',end_date:'2026-11-08',end_time:'02:13',timezone:null});
  assert.equal(sampledDisplaySpan([]),null);
});
test('participation labels deduplicate within one channel and scope, never across channels',()=>{
  const sample=[{challenge_id:'heb',category:'participation_confirmation',reported_team_alias:'T1',reported_team_alias_scope:'heb-scope'},{challenge_id:'heb',category:'participation_confirmation',reported_team_alias:'T1',reported_team_alias_scope:'heb-scope'},{challenge_id:'heb',category:'participation_confirmation',reported_team_alias:'T2',reported_team_alias_scope:'heb-scope'},{challenge_id:'hitachi',category:'participation_confirmation',reported_team_alias:'T1',reported_team_alias_scope:'hitachi-scope'}];
  assert.deepEqual(participationSummary(sample,'heb'),{messages:3,reported_label_count:2,scope:'heb-scope',posts_without_label:0});
  assert.equal(participationSummary(sample,'all').reported_label_count,null);
  assert.equal(participationSummary([],'heb').reported_label_count,null);
  assert.equal(participationSummary([{challenge_id:'heb',category:'social_banter'}],'heb').reported_label_count,0);
  assert.equal(participationSummary([...sample,{challenge_id:'heb',category:'participation_confirmation',reported_team_alias:'T3',reported_team_alias_scope:'other-scope'}],'heb').reported_label_count,null);
});
test('final HEB sample exposes posts and reported labels as separate quantities',()=>{
  const actual=participationSummary(rows,'heb');
  assert.equal(actual.messages,rows.filter(r=>r.challenge_id==='heb'&&r.category==='participation_confirmation').length);
  assert.equal(actual.reported_label_count,9);
  assert.equal(actual.messages,11);
  assert.equal(filterMessages(rows,{lens:'participation',challenge:'heb'}).length,11);
});
