import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { loadConfig } from '../config.js';
import { createApp } from '../app.js';
import { isAdmin, requestIp, sessionHash } from '../security.js';
import { createSanityProjectsGateway } from '../sanity-projects.js';
import { refreshTrustedProxies } from '../trusted-proxies.js';

const config=loadConfig({NODE_ENV:'test',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'http://localhost:3000',RATE_LIMIT_SECRET:'a'.repeat(32)});
test('development API defaults to the Vite proxy port without changing production',()=>{
  const development=loadConfig({NODE_ENV:'development',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'http://localhost:3000',RATE_LIMIT_SECRET:'a'.repeat(32)});
  const production=loadConfig({NODE_ENV:'production',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'https://elimaj.com.br',RATE_LIMIT_SECRET:'a'.repeat(32)});
  assert.equal(development.port,3010);
  assert.equal(production.port,3000);
});
const user={id:'00000000-0000-0000-0000-000000000001',email:'admin@example.com',role:'admin',is_admin:false,password_hash:await bcrypt.hash('password',4)};
function repository(overrides={}) {
  const sessions=new Map();
  return {health:async()=>{},rate:async()=>{},findUser:async()=>user,session:async hash=>sessions.get(hash),createSession:async(hash)=>sessions.set(hash,user),revokeSession:async hash=>sessions.delete(hash),interactions:async()=>[{id:'interaction'}],markRead:async()=>{},newsletter:async()=>{},contact:async()=>{},contacts:async()=>[{id:'00000000-0000-0000-0000-0000000000aa',name:'Ana',is_read:false}],markContactRead:async()=>{},reserveChat:async()=>'reservation',history:async()=>[],knowledge:async()=>[],completeChat:async()=>{},failChat:async()=>{},...overrides};
}
async function withServer(repo,run,overrides={}) {
  const app=createApp({repository:repo,config,logger:{error:()=>{}},telegram:async()=>{},chat:async()=>'answer',...overrides});
  await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${app.address().port}`;
  try {await run((route,options)=>fetch(base+route,options));}
  finally {await new Promise(resolve=>app.close(resolve));}
}
const mutation=(body,extras={})=>({method:'POST',headers:{Origin:config.origin,'Content-Type':'application/json',...extras},body:JSON.stringify(body)});

test('opaque persisted sessions protect admin, revoke on logout, and never expose hash',async()=>{
  await withServer(repository(),async request=>{
    assert.equal((await request('/api/admin/interactions')).status,401);
    const login=await request('/api/auth/login',mutation({email:user.email,password:'password'}));
    assert.equal(login.status,200);
    const cookie=login.headers.get('set-cookie');
    assert.match(cookie,/HttpOnly; SameSite=Strict/);
    assert.match(cookie,/portfolio_session=[A-Za-z0-9_-]{43}/);
    assert.equal((await login.json()).user.password_hash,undefined);
    const headers={Cookie:cookie.split(';')[0]};
    assert.equal((await request('/api/admin/interactions',{headers})).status,200);
    assert.equal((await request('/api/auth/session',{headers})).status,200);
    assert.equal((await request('/api/auth/logout',{method:'POST',headers:{...headers,Origin:config.origin}})).status,204);
    assert.equal((await request('/api/auth/session',{headers})).status,401);
  });
});
test('cross-site, missing Origin and spoofed Host cannot mutate or login',async()=>{
  let calls=0;
  await withServer(repository({newsletter:async()=>calls++}),async request=>{
    for(const headers of [{Origin:'https://evil.example'},{Origin:''},{Origin:config.origin,'Sec-Fetch-Site':'cross-site'}]) {
      assert.equal((await request('/api/newsletter',mutation({email:'test@example.com'},headers))).status,403);
    }
    assert.equal(calls,0);
  });
});
test('server-side role authorization rejects valid non-admin session',async()=>{
  await withServer(repository({session:async()=>({...user,role:'user',is_admin:false})}),async request=>{
    const headers={Cookie:`${config.cookieName}=${'a'.repeat(43)}`,Origin:config.origin};
    assert.equal((await request('/api/admin/interactions',{headers})).status,403);
    assert.equal((await request('/api/admin/sessions/session123/read',{method:'PATCH',headers})).status,403);
  });
});
test('newsletter normalizes email and preserves duplicate409 code',async()=>{
  let data;
  await withServer(repository({newsletter:async(name,email)=>{data={name,email};}}),async request=>{
    const result=await request('/api/newsletter',mutation({name:' Eduardo ',email:' TEST@EXAMPLE.COM '}));
    assert.equal(result.status,201);assert.deepEqual(data,{name:'Eduardo',email:'test@example.com'});
  });
  await withServer(repository({newsletter:async()=>{throw Object.assign(new Error(),{code:'23505'});}}),async request=>{
    const result=await request('/api/newsletter',mutation({email:'test@example.com'}));
    assert.equal(result.status,409);assert.equal((await result.json()).code,'EMAIL_EXISTS');
  });
});
test('newsletter accepts the configured www alias and rejects unlisted origins',async()=>{
  const aliasConfig=loadConfig({NODE_ENV:'test',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'http://localhost:3000',PUBLIC_ORIGINS:'http://www.localhost:3000',RATE_LIMIT_SECRET:'a'.repeat(32)});
  await withServer(repository(),async request=>{
    const alias=await request('/api/newsletter',{...mutation({email:'test@example.com'}),headers:{Origin:'http://www.localhost:3000','Content-Type':'application/json'}});
    assert.equal(alias.status,201);
    const unlisted=await request('/api/newsletter',{...mutation({email:'test@example.com'}),headers:{Origin:'http://other.localhost:3000','Content-Type':'application/json'}});
    assert.equal(unlisted.status,403);
  },{config:aliasConfig});
});
test('contact form stores normalized messages, notifies, rate limits and validates reachability',async()=>{
  const stored=[];const notified=[];const scopes=[];
  await withServer(repository({contact:async data=>stored.push(data),rate:async scope=>scopes.push(scope)}),async request=>{
    const created=await request('/api/contact',mutation({name:' Ana ',email:' ANA@EXAMPLE.COM ',phone:'',company:' ACME ',message:' Quero um site '}));
    assert.equal(created.status,201);
    assert.deepEqual(stored,[{name:'Ana',email:'ana@example.com',phone:null,company:'ACME',message:'Quero um site'}]);
    assert.deepEqual(notified,stored);
    assert.match(scopes[0],/^contact:[0-9a-f]{64}$/);
    const noReach=await request('/api/contact',mutation({name:'Ana',message:'Oi'}));
    assert.equal(noReach.status,400);assert.equal((await noReach.json()).code,'CONTACT_REACH_REQUIRED');
    assert.equal((await request('/api/contact',mutation({name:'Ana',phone:'abc',message:'Oi'}))).status,400);
    assert.equal((await request('/api/contact',mutation({name:'Ana',phone:'(11) 99999-0000',message:'x'.repeat(4001)}))).status,400);
    assert.equal((await request('/api/contact',mutation({name:'Ana',email:'ana@example.com',message:'Oi'},{Origin:'https://evil.example'}))).status,403);
    assert.equal(stored.length,1);
  },{contactTelegram:async data=>{notified.push(data);}});
  await withServer(repository({rate:async()=>{throw Object.assign(new Error('limited'),{status:429});}}),async request=>{
    assert.notEqual((await request('/api/contact',mutation({name:'Ana',phone:'11999990000',message:'Oi'}))).status,201);
  });
});
test('admin contact inbox lists messages and marks one read, only for admins',async()=>{
  const marked=[];
  await withServer(repository({markContactRead:async id=>marked.push(id)}),async request=>{
    assert.equal((await request('/api/admin/contacts')).status,401);
    const login=await request('/api/auth/login',mutation({email:user.email,password:'password'}));
    const headers={Cookie:login.headers.get('set-cookie').split(';')[0]};
    const list=await request('/api/admin/contacts',{headers});
    assert.equal(list.status,200);assert.equal((await list.json()).contacts[0].name,'Ana');
    const id='00000000-0000-0000-0000-0000000000AA';
    assert.equal((await request(`/api/admin/contacts/${id}/read`,{method:'PATCH',headers})).status,403); // Origin required.
    assert.equal((await request(`/api/admin/contacts/${id}/read`,{method:'PATCH',headers:{...headers,Origin:config.origin}})).status,200);
    assert.equal((await request('/api/admin/contacts/not-a-uuid/read',{method:'PATCH',headers:{...headers,Origin:config.origin}})).status,404);
    assert.deepEqual(marked,[id.toLowerCase()]);
  });
  await withServer(repository({session:async()=>({...user,role:'user',is_admin:false})}),async request=>{
    assert.equal((await request('/api/admin/contacts',{headers:{Cookie:`${config.cookieName}=${'a'.repeat(43)}`}})).status,403);
  });
});
test('malformed admin session IDs are rejected as bad requests',async()=>{
  await withServer(repository(),async request=>{
    const login=await request('/api/auth/login',mutation({email:user.email,password:'password'}));
    const headers={Cookie:login.headers.get('set-cookie').split(';')[0],Origin:config.origin};
    assert.equal((await request('/api/admin/sessions/%E0%A4%A/read',{method:'PATCH',headers})).status,400);
  });
});
test('access log omits query strings and errors carry the underlying cause',async()=>{
  const infos=[];const errors=[];
  const logger={info:(event,fields)=>infos.push({event,...fields}),error:(event,error,fields)=>errors.push({event,message:error?.message,...fields})};
  const sanity={list:async()=>{throw new Error('Sanity CDN 500');},bySlug:async()=>undefined,adjacent:async()=>({})};
  await withServer(repository(),async request=>{
    assert.equal((await request('/api/projects?locale=en&email=someone@example.com')).status,503);
    assert.equal((await request('/api/health')).status,200);
  },{logger,sanity});
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(infos.map(entry=>[entry.event,entry.method,entry.path,entry.status]),[['http.request','GET','/api/projects',503]]);
  assert.equal(typeof infos[0].ms,'number');
  assert.doesNotMatch(JSON.stringify(infos),/someone|email|locale/);
  assert.deepEqual(errors,[{event:'projects.list_failed',message:'Sanity CDN 500'}]);
});
test('published projects are available through same-origin public routes',async()=>{
  const calls=[];
  const project={_id:'project-1',slug:{current:'landing-page'},title:'Landing page'};
  const sanity={
    list:async locale=>{calls.push(['list',locale]);return [project];},
    bySlug:async(slug,locale)=>{calls.push(['bySlug',slug,locale]);return slug==='landing-page'?project:undefined;},
    adjacent:async currentId=>{calls.push(['adjacent',currentId]);return {prevId:'case-one',nextId:'case-two'};},
  };
  await withServer(repository(),async request=>{
    const list=await request('/api/projects?locale=pt-br');
    assert.equal(list.status,200);
    assert.match(list.headers.get('cache-control'),/public/);
    assert.deepEqual((await list.json()).projects,[project]);
    assert.deepEqual((await (await request('/api/projects/landing-page?locale=en')).json()).project,project);
    assert.deepEqual(await (await request('/api/projects/navigation?currentId=landing-page')).json(),{prevId:'case-one',nextId:'case-two'});
    assert.equal((await request('/api/projects?locale=fr')).status,400);
    assert.equal((await request('/api/projects/%2Fadmin')).status,400);
    assert.equal((await request('/api/projects/missing')).status,404);
  },{sanity});
  assert.deepEqual(calls,[['list','ptBr'],['bySlug','landing-page','en'],['adjacent','landing-page'],['bySlug','missing','en']]);
});
test('Sanity project gateway performs server-side CDN reads without forwarding browser Origin',async()=>{
  const requests=[];
  const gateway=createSanityProjectsGateway({fetchImpl:async(url,options)=>{
    requests.push({url:new URL(url),options});
    const query=new URL(url).searchParams.get('query');
    const result=query.includes('slug.current == $slug')?{_id:'project-1'}:[];
    return {ok:true,json:async()=>({result})};
  }});
  assert.deepEqual(await gateway.list('ptBr'),[]);
  assert.deepEqual(await gateway.bySlug('landing-page','en'),{_id:'project-1'});
  assert.equal(requests[0].url.hostname,'mxq3x3cp.apicdn.sanity.io');
  assert.equal(requests[0].url.searchParams.get('$locale'),'"ptBr"');
  assert.equal(requests[0].options.headers.Origin,undefined);
  assert.equal(requests[1].url.searchParams.get('$slug'),'"landing-page"');
});
test('DB or reservation failure fails closed before AI and no false health readiness',async()=>{
  let aiCalls=0;
  await withServer(repository({health:async()=>{throw new Error();},reserveChat:async()=>{throw new Error();}}),async request=>{
    assert.equal((await request('/api/health')).status,503);
    assert.equal((await request('/api/chat',mutation({message:'hi',sessionId:'session123'}))).status,503);
    assert.equal(aiCalls,0);
  },{chat:async()=>{aiCalls++;}});
});
test('required history failure prevents paid AI',async()=>{
  let aiCalls=0;
  await withServer(repository({history:async()=>{throw new Error();}}),async request=>{
    assert.equal((await request('/api/chat',mutation({message:'hi',sessionId:'session123',stream:true}))).status,502);
    assert.equal(aiCalls,0);
  },{chat:async()=>{aiCalls++;}});
});
test('stream emits done after commit and emits error when persistence fails',async()=>{
  let committed=false;
  await withServer(repository({completeChat:async()=>{committed=true;}}),async request=>{
    const response=await request('/api/chat',mutation({message:'hi',sessionId:'session123',stream:true}));
    const text=await response.text();
    assert.match(text,/event: delta/);assert.match(text,/event: done\ndata: \{"output":"answer"\}/);assert.equal(committed,true);
  },{chat:async({onDelta})=>{onDelta('answer');return 'answer';}});
  await withServer(repository({completeChat:async()=>{throw new Error();}}),async request=>{
    const text=await (await request('/api/chat',mutation({message:'hi',sessionId:'session123',stream:true}))).text();
    assert.match(text,/event: error/);assert.doesNotMatch(text,/event: done/);
  });
});
test('password rejection and validation avoid silent bcrypt truncation',async()=>{
  await withServer(repository(),async request=>{
    assert.equal((await request('/api/auth/login',mutation({email:user.email,password:'wrong'}))).status,401);
    assert.equal((await request('/api/auth/login',mutation({email:user.email,password:'é'.repeat(37)}))).status,400);
    assert.equal((await request('/api/chat',mutation({message:'hi',sessionId:'short'}))).status,400);
  });
});
test('proxy headers are ignored unless peer is explicitly trusted; secure production cookies',()=>{
  const req={socket:{remoteAddress:'::ffff:127.0.0.1'},headers:{'cf-connecting-ip':'203.0.113.1','x-forwarded-for':'203.0.113.2'}};
  assert.equal(requestIp(req,config),'127.0.0.1');
  const trusted=loadConfig({NODE_ENV:'production',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'https://example.com',RATE_LIMIT_SECRET:'a'.repeat(32),CF_PROXY_CIDRS:'127.0.0.1/32'});
  assert.equal(requestIp(req,trusted),'203.0.113.1');assert.equal(trusted.secureCookie,true);assert.match(trusted.cookieName,/^__Host-/);
  assert.equal(isAdmin({...user,role:'owner'}),true);assert.equal(sessionHash('token').length,64);
});

test('named cloudflared peers are trusted by resolved address only, and lookup failure trusts nothing',async()=>{
  const req=peer=>({socket:{remoteAddress:peer},headers:{'cf-connecting-ip':'203.0.113.9'}});
  const named=loadConfig({NODE_ENV:'production',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'https://example.com',RATE_LIMIT_SECRET:'a'.repeat(32),CF_PROXY_HOSTS:'cloudflared'});
  assert.deepEqual(named.trustedProxyHosts,['cloudflared']);
  assert.equal(requestIp(req('172.18.0.5'),named),'172.18.0.5'); // Nothing trusted before resolution.
  assert.deepEqual(await refreshTrustedProxies(named,async host=>{assert.equal(host,'cloudflared');return [{address:'172.18.0.5',family:4}];}),['172.18.0.5']);
  assert.equal(requestIp(req('::ffff:172.18.0.5'),named),'203.0.113.9');
  assert.equal(requestIp(req('172.18.0.6'),named),'172.18.0.6'); // Another container on the shared network.
  await refreshTrustedProxies(named,async()=>{throw new Error('ENOTFOUND');});
  assert.equal(requestIp(req('172.18.0.5'),named),'172.18.0.5');
  const base={NODE_ENV:'production',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'https://example.com',RATE_LIMIT_SECRET:'a'.repeat(32)};
  assert.throws(()=>loadConfig({...base,CF_PROXY_HOSTS:'bad host/'}),/CF_PROXY_HOSTS/);
  assert.throws(()=>loadConfig({...base,CF_PROXY_CIDRS:'10.0.0.0/99'}),/CF_PROXY_CIDRS/);
});
test('newsletter delivery requires a URL-safe shared secret when enabled',()=>{
  const base={NODE_ENV:'production',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'https://example.com',RATE_LIMIT_SECRET:'a'.repeat(32),NEWSLETTER_DELIVERY_ENABLED:'true',NEWSLETTER_WEBHOOK_URL:'https://n8n.elimaj.com.br/webhook/novo-inscrito-newsletter'};
  assert.throws(()=>loadConfig(base),/NEWSLETTER_WEBHOOK_SECRET/);
  assert.throws(()=>loadConfig({...base,NEWSLETTER_WEBHOOK_SECRET:'short'}),/NEWSLETTER_WEBHOOK_SECRET/);
  const secret='b'.repeat(43);
  assert.equal(loadConfig({...base,NEWSLETTER_WEBHOOK_SECRET:secret}).newsletterWebhookSecret,secret);
});
test('production additional origins must be exact HTTPS origins',()=>{
  const base={NODE_ENV:'production',DATABASE_URL:'postgres://example',PUBLIC_ORIGIN:'https://example.com',RATE_LIMIT_SECRET:'a'.repeat(32)};
  assert.deepEqual([...loadConfig({...base,PUBLIC_ORIGINS:'https://www.example.com'}).allowedOrigins],['https://example.com','https://www.example.com']);
  assert.throws(()=>loadConfig({...base,PUBLIC_ORIGINS:'http://www.example.com'}),/PUBLIC_ORIGINS/);
  assert.throws(()=>loadConfig({...base,PUBLIC_ORIGINS:'https://www.example.com/path'}),/PUBLIC_ORIGINS/);
});
