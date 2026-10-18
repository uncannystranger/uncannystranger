import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {contactConfig,contactReady,contactQuota,deliverContact,MAX_CONTACT_BYTES} from '../src/server/contact.ts';
import handler from '../api/contact.ts';
const origin='https://uncannystranger.com';
const config={enabled:true,rateLimitReady:true,resendKey:'test-only',turnstileSecret:'test-only',siteKey:'test-public-key',sender:'Uncanny Stranger <contact@uncannystranger.com>',origins:[origin]};
const valid=()=>({name:'Test Visitor',email:'visitor@example.org',message:'A controlled test enquiry.',submissionId:randomUUID(),token:'test-token',website:''});
const transport=(verification:any={success:true,hostname:'uncannystranger.com',action:'contact'},providerStatus=200)=>{
 const calls:any[]=[];
 const fetchImpl:any=async(url:string,options:any)=>{calls.push({url,options});return new Response(JSON.stringify(url.includes('siteverify')?verification:{id:'test-message-id'}),{status:url.includes('siteverify')?200:providerStatus});};
 return {calls,fetchImpl};
};
test('contact delivery is fail-closed without explicit complete configuration',()=>{
 assert.equal(contactReady(contactConfig({})),false);
 assert.equal(contactReady({...config,rateLimitReady:false}),false);
 assert.equal(contactReady({...config,sender:'visitor@example.org'}),false);
 assert.equal(contactReady(config),true);
});
test('fixed recipient, validated Reply-To and plain-text delivery',async()=>{
 const {calls,fetchImpl}=transport();const p=valid();const result=await deliverContact(p,origin,config,fetchImpl);
 assert.equal(result.status,200);assert.match(result.body.message,/accepted/);assert.doesNotMatch(result.body.message,/delivered to.*inbox/i);
 const sent=JSON.parse(calls[1].options.body);assert.deepEqual(sent.to,['abdallahmadm@gmail.com']);assert.equal(sent.reply_to,p.email);assert.equal(sent.from,config.sender);assert(!sent.html&&!sent.attachments);
 assert.equal(calls[0].options.redirect,'error');assert(calls[0].options.signal&&calls[1].options.signal);
});
test('duplicate retries have a stable provider idempotency key',async()=>{
 const {calls,fetchImpl}=transport();const p=valid();await deliverContact(p,origin,config,fetchImpl);await deliverContact(p,origin,config,fetchImpl);
 assert.equal(calls[1].options.headers['Idempotency-Key'],calls[3].options.headers['Idempotency-Key']);
 assert.notEqual(calls[0].options.body.get('idempotency_key'),calls[2].options.body.get('idempotency_key')); // Fresh validation when the browser refreshes its token.
});
test('foreign origins cannot call providers',async()=>{const t=transport();assert.equal((await deliverContact(valid(),'https://example.org',config,t.fetchImpl)).status,403);assert.equal(t.calls.length,0);});
test('recipient injection, malformed addresses and header injection rejected',async()=>{
 for(const p of [{...valid(),to:'attacker@example.org'},{...valid(),email:'a@b.org\r\nBcc:x@y.org'},{...valid(),name:'Name\r\nInjected'},[],null,{...valid(),submissionId:'../../file'}])
 assert.equal((await deliverContact(p,origin,config,transport().fetchImpl)).status,400);
});
test('field limits and empty values rejected',async()=>{
 for(const p of [{...valid(),name:'a'.repeat(101)},{...valid(),message:'a'.repeat(4001)},{...valid(),message:'  '},{...valid(),token:'a'.repeat(2049)},{...valid(),email:'no-address'}])
 assert.equal((await deliverContact(p,origin,config,transport().fetchImpl)).status,400);
});
test('honeypot blocks submission with no provider call',async()=>{const t=transport();assert.equal((await deliverContact({...valid(),website:'bot'},origin,config,t.fetchImpl)).status,400);assert.equal(t.calls.length,0);});
test('unconfigured delivery returns an honest unavailable result',async()=>{const t=transport();const r=await deliverContact(valid(),origin,{...config,resendKey:''},t.fetchImpl);assert.equal(r.status,503);assert.match(r.body.message,/No message was sent/);assert.equal(t.calls.length,0);});
test('missing, failed, wrong-host and wrong-action challenges cannot send',async()=>{
 assert.equal((await deliverContact({...valid(),token:''},origin,config,transport().fetchImpl)).status,400);
 for(const v of [{success:false},{success:true,hostname:'example.org',action:'contact'},{success:true,hostname:'uncannystranger.com',action:'login'}]){const t=transport(v);assert.equal((await deliverContact(valid(),origin,config,t.fetchImpl)).status,400);assert.equal(t.calls.length,1);}
});
test('provider failures and timeouts return safe errors',async()=>{
 assert.equal((await deliverContact(valid(),origin,config,transport(undefined,500).fetchImpl)).status,502);
 const r=await deliverContact(valid(),origin,config,async()=>{throw new Error('test internal detail')});
 assert.equal(r.status,502);assert(!r.body.message.includes('test internal detail'));
});
test('five requests per instance/IP/ten minutes and expiry',()=>{
 const key=randomUUID();for(let i=0;i<5;i++)assert.equal(contactQuota(key,100).allowed,true);
 assert.equal(contactQuota(key,101).allowed,false);assert.equal(contactQuota(key,600101).allowed,true);
});
const invoke=async(method:string,body?:any,headers:any={})=>{let status=200,data:any;const out:any={};const res:any={status(n:number){status=n;return this},setHeader(k:string,v:any){out[k]=v;return this},end(s:string){data=JSON.parse(s)}};await handler({method,body,headers,socket:{remoteAddress:randomUUID()}},res);return{status,data,headers:out};};
test('public configuration reveals no server credentials',async()=>{const r=await invoke('GET');assert.equal(r.status,200);assert.deepEqual(Object.keys(r.data).sort(),['ready','siteKey']);assert.equal(r.headers['Cache-Control'],'no-store');});
test('HTTP methods, missing origin and content type enforced',async()=>{
 assert.equal((await invoke('PUT')).status,405);assert.equal((await invoke('POST',valid())).status,403);
 assert.equal((await invoke('POST',valid(),{origin,'content-type':'text/plain'})).status,415);
 assert.equal((await invoke('POST',valid(),{origin,'content-type':'application/json','sec-fetch-site':'cross-site'})).status,403);
});
test('HTTP malformed JSON and request-size limits enforced',async()=>{
 const headers={origin,'content-type':'application/json'};
 assert.equal((await invoke('POST','{',headers)).status,400);
 assert.equal((await invoke('POST',valid(),{...headers,'content-length':String(MAX_CONTACT_BYTES+1)})).status,413);
 assert.equal((await invoke('POST','a'.repeat(MAX_CONTACT_BYTES+1),headers)).status,413);
});

test('local test quota exception cannot activate on production or Vercel',()=>{
 assert.equal(contactConfig({CONTACT_LOCAL_TEST:'true'}).rateLimitReady,true);
 for(const env of [{NODE_ENV:'production'},{VERCEL:'1'},{VERCEL_ENV:'preview'}])
  assert.equal(contactConfig({...env,CONTACT_LOCAL_TEST:'true'}).rateLimitReady,false);
});
