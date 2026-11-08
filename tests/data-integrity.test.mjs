import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseImport,validateMessage,mergeMessages,csv} from '../dist/model.js';
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

test('snapshot memberships preserve repeated sightings without inventing additional messages',async()=>{
  const coding=await load('discord-message-coding');
  const coverage=await load('discord-observations');
  const ids=new Set(coding.records.map(r=>r.message_id));
  assert.deepEqual(coding.snapshots,coverage.snapshots);
  assert.equal(new Set(coding.snapshots.map(s=>s.snapshot_id)).size,coding.snapshots.length);
  for(const snapshot of coding.snapshots){
    assert.equal(snapshot.observed_messages,snapshot.message_ids.length);
    assert.equal(new Set(snapshot.message_ids).size,snapshot.message_ids.length);
    assert.equal(snapshot.coverage_status,'partial');
    assert.equal(snapshot.captured_at,null);
    assert.equal(snapshot.timezone_verified,false);
    for(const id of snapshot.message_ids){
      assert.ok(ids.has(id));
      const row=coding.records.find(r=>r.message_id===id);
      assert.equal(row.challenge_id,snapshot.challenge_id);
      assert.ok(row.snapshot_ids.includes(snapshot.snapshot_id));
    }
  }
  const merged=mergeMessages(parseImport(coding),parseImport(coding));
  assert.equal(merged.records.length,coding.records.length);
  assert.equal(merged.added,0);
  for(const row of coding.records){
    assert.equal(row.author_role,'unknown');
    assert.equal(row.role_evidence,null);
    for(const id of row.snapshot_ids)assert.ok(coding.snapshots.some(s=>s.snapshot_id===id&&s.message_ids.includes(row.message_id)));
  }
});

test('reaction observations retain partial coverage, dates, source snapshots and nulls',async()=>{
  const coding=await load('discord-message-coding');
  const rows=parseImport(coding),counted=rows.filter(r=>r.reaction_count_observed!==null);
  assert.equal(counted.length,2);
  assert.equal(counted.reduce((n,r)=>n+r.reaction_count_observed,0),16);
  const request=rows.find(r=>r.message_id==='1568858133911175270');
  assert.equal(request.reaction_count_observed,15);
  assert.equal(request.reaction_types_observed,2);
  assert.equal(request.reaction_observed_on_local,'2026-11-08');
  assert.equal(request.reaction_observed_timezone,'America/Chicago');
  assert.equal(request.reaction_capture_time,null);
  assert.equal(request.reaction_snapshot_id,'revs-reread-20261108');
  assert.match(request.reaction_observation_note,/not 15 unique reactors/);
  assert.equal(rows.filter(r=>r.reaction_count_observed===null).length,rows.length-counted.length);
  assert.throws(()=>validateMessage({...request,reaction_count_observed:-1}),/nonnegative/);
  assert.throws(()=>validateMessage({...request,reaction_types_observed:16}),/must not exceed/);
  assert.throws(()=>validateMessage({...request,reaction_snapshot_id:'not-an-observed-snapshot'}),/listed snapshot/);
  assert.throws(()=>validateMessage({...request,author_role:'organizer',role_evidence:null}),/explicit observed role evidence/);
  assert.throws(()=>validateMessage({...request,is_observed:false}),/cannot be imported/);
  assert.match(csv(rows),/reaction_snapshot_id/);
});

test('duplicate-message reaction updates keep their complete provenance and reject ambiguous ordering',async()=>{
  const coding=await load('discord-message-coding');
  const source=validateMessage(coding.records.find(r=>r.message_id==='1568858133911175270'));
  const old=validateMessage({...source,reaction_count_observed:null,reaction_types_observed:null,reaction_observed_on_local:null,reaction_observed_timezone:null,reaction_capture_time:null,reaction_snapshot_id:null,reaction_observation_note:null,snapshot_ids:['revs-initial-001']});
  const enriched=mergeMessages([old],[source]);
  assert.equal(enriched.added,0);assert.equal(enriched.updated,1);assert.equal(enriched.skipped,0);
  assert.equal(enriched.records[0].reaction_count_observed,15);
  assert.equal(enriched.records[0].reaction_snapshot_id,'revs-reread-20261108');
  assert.equal(enriched.records[0].reaction_observation_note,source.reaction_observation_note);
  assert.deepEqual(enriched.records[0].snapshot_ids,['revs-initial-001','revs-reread-20261108']);
  const later=validateMessage({...source,snapshot_ids:[...source.snapshot_ids,'test-later-snapshot'],reaction_count_observed:18,reaction_observed_on_local:'2026-11-09',reaction_snapshot_id:'test-later-snapshot',reaction_observation_note:'Test fixture: later dated reading.'});
  const advanced=mergeMessages([source],[later]);
  assert.equal(advanced.updated,1);assert.equal(advanced.records[0].reaction_count_observed,18);
  assert.equal(advanced.records[0].reaction_observed_on_local,'2026-11-09');
  assert.equal(advanced.records[0].reaction_snapshot_id,'test-later-snapshot');
  assert.equal(advanced.records[0].reaction_observation_note,'Test fixture: later dated reading.');
  const older=mergeMessages(advanced.records,[source]);
  assert.equal(older.records[0].reaction_count_observed,18);
  assert.equal(older.records[0].reaction_snapshot_id,'test-later-snapshot');
  assert.throws(()=>mergeMessages([source],[validateMessage({...source,reaction_count_observed:16})]),/same observation date/);
  assert.throws(()=>mergeMessages([source],[validateMessage({...source,reaction_observed_timezone:'UTC'})]),/different observation timezones/);
  assert.equal(source.reaction_count_observed,15,'Failed or later merges must not mutate original input records');
});

test('organizer-update coding requires explicit organizer role evidence',async()=>{
  const coding=await load('discord-message-coding');
  const source=coding.records[0];
  assert.throws(()=>validateMessage({...source,category:'organizer_update',author_role:'unknown',role_evidence:null}),/organizer_update category requires/);
  assert.throws(()=>validateMessage({...source,category:'organizer_update',author_role:'organizer',role_evidence:null}),/explicit observed role evidence/);
  const coded=validateMessage({...source,category:'organizer_update',author_role:'organizer',role_evidence:'Test fixture: explicit organizer role shown in source.'});
  assert.equal(coded.category,'organizer_update');
  assert.equal(coded.author_role,'organizer');
  assert.match(coded.role_evidence,/Test fixture/);
});

test('eight-channel evidence retains scoped participation labels and unverified claims',async()=>{
  const coding=await load('discord-message-coding');
  const coverage=await load('discord-observations');
  const rows=parseImport(coding);
  assert.equal(rows.length,140);
  assert.equal(coding.snapshots.length,11);
  assert.equal(new Set(rows.map(r=>r.challenge_id)).size,8);
  assert.deepEqual(Object.fromEntries(coverage.records.map(r=>[r.challenge_id,r.observed_messages])),{'revs-casino':10,'dashboard-royale':9,'build-a-dataset':11,'house-edge':30,'heads-up':30,hitachi:10,heb:30,databricks:10});
  const heb=rows.filter(r=>r.challenge_id==='heb'&&r.category==='participation_confirmation');
  assert.equal(heb.length,11);
  assert.equal(new Set(heb.map(r=>r.reported_team_alias)).size,9);
  assert.deepEqual([...new Set(heb.map(r=>r.reported_team_alias_scope))],['heb-channel-20261108']);
  assert.ok(heb.every(r=>r.reply_to_message_id===null));
  const excluded=rows.find(r=>r.message_id==='1568838602387886162');
  assert.equal(excluded.category,'other');assert.equal(excluded.reported_team_alias,null);
  const claim=rows.find(r=>r.message_id==='1568726374322274466');
  assert.match(claim.paraphrase,/unverified/);assert.equal(claim.reported_team_alias,null);
  assert.ok(coverage.records.every(r=>r.team_count===null&&r.entrant_count===null&&r.participant_count===null&&r.coverage_status==='partial'));
  assert.throws(()=>validateMessage({...heb[0],reported_team_alias_scope:null}),/explicit scope/);
  assert.throws(()=>validateMessage({...heb[0],category:'other'}),/only counted/);
  assert.throws(()=>mergeMessages([heb[0]],[{...heb[0],reported_team_alias:'HEB-T99'}]),/conflicts/);
  assert.equal(rows.filter(r=>r.display_date==='2026-11-04').length,2,'Pre-event message dates must not be silently moved into event dates');
  assert.ok(rows.filter(r=>r.challenge_id!=='revs-casino').every(r=>r.display_alias.includes('-')));
  assert.equal(coverage.metadata.collection_date_local,null,'Aggregate multi-date acquisition must not imply one date');
});
