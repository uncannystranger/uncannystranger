import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/frame-engagement.ts';
import {supabasePublicFetch, MissingServerConfigError} from '../src/server/supabaseRest.ts';
const invoke = async (method:string, body:any={}, headers:any={}) => {
  let status=200, data:any;
  const res:any={status(n:number){status=n;return this},setHeader(){return this},end(s:string){data=JSON.parse(s)}};
  await handler({method,body,query:body,headers},res);
  return {status,data};
};
const valid={action:'toggle-like',unsplashId:'test-photo',sessionId:'test-session-123'};
test('GET cannot mutate engagement',async()=>assert.equal((await invoke('GET',valid)).status,405));
test('cross-origin writes rejected',async()=>assert.equal((await invoke('POST',valid,{'origin':'https://example.org','content-type':'application/json'})).status,403));
test('non-JSON and oversized requests rejected',async()=>{
 assert.equal((await invoke('POST',valid)).status,415);
 assert.equal((await invoke('POST',{...valid,x:'a'.repeat(4100)},{'content-type':'application/json'})).status,413);
});
test('malformed JSON and arrays rejected',async()=>{
 assert.equal((await invoke('POST','{',{'content-type':'application/json'})).status,400);
 assert.equal((await invoke('POST',[],{'content-type':'application/json'})).status,400);
});
test('invalid identifiers rejected',async()=>assert.equal((await invoke('GET',{...valid,action:'summary',unsplashId:'../private'})).status,400));
test('approved writes and summaries preserve backend behavior',async()=>{
 process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_ANON_KEY='test-only';
 const original=globalThis.fetch;const calls:any[]=[];
 globalThis.fetch=async (url,options)=>{calls.push({url,options});return new Response(JSON.stringify([{likes:1}]),{status:200})};
 try {
  assert.equal((await invoke('POST',valid,{'content-type':'application/json','origin':'https://uncannystranger.com'})).status,200);
  assert.equal((await invoke('GET',{...valid,action:'summary'})).status,200);
  assert.ok(String(calls[0].url).endsWith('/rpc/frame_toggle_like'));
  assert.ok(String(calls[1].url).endsWith('/rpc/frame_engagement_summary'));
  assert.equal(calls[0].options.redirect,'error');assert.ok(calls[0].options.signal);
 } finally {globalThis.fetch=original;delete process.env.SUPABASE_URL;delete process.env.SUPABASE_ANON_KEY}
});
test('public database configuration requires secure endpoint',async()=>{
 process.env.SUPABASE_URL='http://example.org';process.env.SUPABASE_ANON_KEY='test-only';
 try {await assert.rejects(()=>supabasePublicFetch('/photos'),MissingServerConfigError)} finally {delete process.env.SUPABASE_URL;delete process.env.SUPABASE_ANON_KEY}
});
