import test from 'node:test';
import assert from 'node:assert/strict';
import {wrapReelDistance,signalReelItems} from '../dist/reel.js';

test('reel geometry wraps into a single track without accumulating drift',()=>{
  for(const distance of [-1000001,-1888,-20,0,900,1888,1000001]){
    const wrapped=wrapReelDistance(distance,1888);
    assert.ok(wrapped>=-944&&wrapped<944);
    assert.equal(wrapReelDistance(distance+1888*8,1888),wrapped);
  }
  assert.equal(wrapReelDistance(12,0),0);
});

test('reel counts recorded messages in catalog order and preserves unobserved samples',()=>{
  const catalog=[{id:'a',name:'One'},{id:'b',name:'Two'},{id:'c',name:'Three'}];
  const records=[{challenge_id:'b'},{challenge_id:'a'},{challenge_id:'b'}];
  const items=signalReelItems(catalog,records);
  assert.deepEqual(items.map(({id,count})=>({id,count})),[{id:'a',count:1},{id:'b',count:2},{id:'c',count:null}]);
  assert.equal(items[2].name,'Three');
  assert.equal(records.length,3);
});
