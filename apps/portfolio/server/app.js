import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { HttpError, hashIp, isAdmin, newSessionToken, requireOrigin, sessionCookie, sessionHash, sessionToken, validateChat, validateEmail } from './security.js';
import { runChat, notifyTelegram } from './chat.js';
import { createSanityProjectsGateway, isValidProjectSlug, sanityLocaleFromAppLanguage } from './sanity-projects.js';

const defaultStatic = fileURLToPath(new URL('../dist',import.meta.url));
const dummyPasswordHash = bcrypt.hashSync('non-existent-user-placeholder',10);
const publicUser = user => ({id:user.id,email:user.email,role:user.role || 'user',is_admin:user.is_admin === true});
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.webm':'video/webm','.mp4':'video/mp4','.pdf':'application/pdf'};
const csp="default-src 'self'; script-src 'self' 'unsafe-inline' https://us-assets.i.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://mxq3x3cp.apicdn.sanity.io https://cdn.sanity.io https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://app.posthog.com; media-src 'self' https://audio-assets.vercel.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'";

export function json(res,status,body) {
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(body));
}
function publicJson(res,status,body) {
  res.writeHead(status,{
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':status===200?'public, max-age=60, stale-while-revalidate=300':'no-store',
  });
  res.end(JSON.stringify(body));
}
async function readJson(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||'')) throw new HttpError(415,'Content-Type must be application/json.');
  let size=0;
  const chunks=[];
  for await (const chunk of req) {
    size+=chunk.length;
    if(size>10000) throw new HttpError(413,'Request body is too large.');
    chunks.push(chunk);
  }
  try {
    const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!body || typeof body!=='object' || Array.isArray(body)) throw new Error();
    return body;
  } catch { throw new HttpError(400,'Invalid JSON body.'); }
}
async function currentUser(req,repository,config,admin=false) {
  const token=sessionToken(req,config);
  if (!token) throw new HttpError(401,'Authentication required.');
  const user=await repository.session(sessionHash(token));
  if (!user) throw new HttpError(401,'Session expired.');
  if (admin && !isAdmin(user)) throw new HttpError(403,'Administrator access required.');
  return publicUser(user);
}

export function createApp({repository,config,chat=runChat,telegram=notifyTelegram,logger=console,sanity=createSanityProjectsGateway()}) {
  const staticRoot=path.resolve(config.staticDir || defaultStatic);
  return createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy',csp);
    // No CORS headers: authenticated requests and mutations are same-origin.
    try {
      const url=new URL(req.url,'http://localhost');
      const route=url.pathname;
      const method=req.method;
      if (route.startsWith('/api/')) {
        res.setHeader('Cache-Control','no-store');
        if (!['GET','HEAD'].includes(method)) requireOrigin(req,config);
        if (route==='/api/health' && method==='GET') {
          try {await repository.health(); return json(res,200,{ok:true,database:'ready'});}
          catch {return json(res,503,{ok:false,database:'unavailable'});}
        }
        if (route==='/api/projects' && method==='GET') {
          const appLanguage=url.searchParams.get('locale') || 'en';
          const locale=sanityLocaleFromAppLanguage(appLanguage);
          if (!locale) throw new HttpError(400,'Invalid project language.');
          try {return publicJson(res,200,{projects:await sanity.list(locale)});}
          catch {logger.error('[projects] Sanity query failed');throw new HttpError(503,'Projects are temporarily unavailable.');}
        }
        if (route==='/api/projects/navigation' && method==='GET') {
          const currentId=url.searchParams.get('currentId') || '';
          if (!isValidProjectSlug(currentId)) throw new HttpError(400,'Invalid project ID.');
          try {return publicJson(res,200,await sanity.adjacent(currentId));}
          catch {logger.error('[projects] Sanity navigation query failed');throw new HttpError(503,'Project navigation is temporarily unavailable.');}
        }
        const projectRoute=route.match(/^\/api\/projects\/([^/]+)$/);
        if (projectRoute && method==='GET') {
          let slug;
          try {slug=decodeURIComponent(projectRoute[1]);} catch {throw new HttpError(400,'Invalid project slug.');}
          if (!isValidProjectSlug(slug)) throw new HttpError(400,'Invalid project slug.');
          const appLanguage=url.searchParams.get('locale') || 'en';
          const locale=sanityLocaleFromAppLanguage(appLanguage);
          if (!locale) throw new HttpError(400,'Invalid project language.');
          try {
            const project=await sanity.bySlug(slug,locale);
            if (!project) throw new HttpError(404,'Project not found.');
            return publicJson(res,200,{project});
          } catch(error) {
            if (error instanceof HttpError) throw error;
            logger.error('[projects] Sanity project query failed');
            throw new HttpError(503,'Project is temporarily unavailable.');
          }
        }
        if (route==='/api/auth/session' && method==='GET') return json(res,200,{user:await currentUser(req,repository,config)});
        if (route==='/api/auth/login' && method==='POST') {
          const body=await readJson(req);
          const email=validateEmail(body.email);
          const password=typeof body.password==='string'?body.password:'';
          if (!password || Buffer.byteLength(password,'utf8')>72) throw new HttpError(400,'Senha inválida.');
          await repository.rate(`login:ip:${hashIp(req,config)}`,900,10);
          await repository.rate(`login:email:${sessionHash(email)}`,900,10);
          const user=await repository.findUser(email);
          const valid=await bcrypt.compare(password,user?.password_hash || dummyPasswordHash);
          if (!user || !valid) throw new HttpError(401,'Email ou senha inválidos.');
          if (!isAdmin(user)) throw new HttpError(403,'Administrator access required.');
          // Revoke any existing authenticated cookie before issuing a fresh ID.
          const previous=sessionToken(req,config);
          if(previous) await repository.revokeSession(sessionHash(previous));
          const token=newSessionToken();
          await repository.createSession(sessionHash(token),user.id);
          res.setHeader('Set-Cookie',sessionCookie(token,config));
          return json(res,200,{user:publicUser(user)});
        }
        if (route==='/api/auth/logout' && method==='POST') {
          // Origin verification also protects this bodyless mutation.
          const token=sessionToken(req,config);
          if(token) await repository.revokeSession(sessionHash(token));
          res.setHeader('Set-Cookie',sessionCookie('',config,true));
          res.writeHead(204); return res.end();
        }
        if (route==='/api/admin/interactions' && method==='GET') {
          await currentUser(req,repository,config,true);
          return json(res,200,{interactions:await repository.interactions()});
        }
        const readRoute=route.match(/^\/api\/admin\/sessions\/([^/]+)\/read$/);
        if (readRoute && method==='PATCH') {
          await currentUser(req,repository,config,true);
          const sessionId=decodeURIComponent(readRoute[1]);
          if (!sessionId || sessionId.length>128) throw new HttpError(400,'Invalid session ID.');
          await repository.markRead(sessionId);
          return json(res,200,{ok:true});
        }
        if (route==='/api/newsletter' && method==='POST') {
          const body=await readJson(req);
          const email=validateEmail(body.email);
          const name=typeof body.name==='string'?body.name.trim():null;
          if(name && name.length>120) throw new HttpError(400,'Nome muito longo.');
          await repository.rate(`newsletter:${hashIp(req,config)}`,3600,10);
          try {await repository.newsletter(name || null,email);}
          catch(error) {if(error.code==='23505') throw new HttpError(409,'Este email já está cadastrado.','EMAIL_EXISTS'); throw error;}
          return json(res,201,{ok:true});
        }
        if (route==='/api/chat' && method==='POST') {
          const body=validateChat(await readJson(req));
          await repository.rate(`chat:minute:${hashIp(req,config)}`,60,10);
          const reservation=await repository.reserveChat(body.sessionId,hashIp(req,config));
          const controller=new AbortController();
          const timeout=setTimeout(()=>controller.abort(new Error('Chat timeout.')),config.chatTimeoutMs);
          timeout.unref();
          const disconnect=()=>{if(!res.writableEnded) controller.abort(new Error('Client disconnected.'));};
          res.on('close',disconnect);
          let started=false;
          const sendEvent=(event,payload)=>{ if (!res.destroyed && !res.writableEnded) res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`); };
          try {
            // Required data fails closed before starting paid generation or SSE.
            const context={history:await repository.history(body.sessionId),knowledgeRows:await repository.knowledge()};
            if(body.stream) {
              started=true;
              res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-store, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
              res.flushHeaders();
            }
            const answer=await chat({repository,context,...body,signal:controller.signal,onDelta:body.stream?delta=>sendEvent('delta',{delta}):undefined});
            if(controller.signal.aborted) throw controller.signal.reason;
            if(typeof answer!=='string' || !answer.trim()) throw new Error('Empty AI answer.');
            // The success event is sent only after the interaction transaction commits.
            await repository.completeChat(reservation,{sessionId:body.sessionId,message:body.message,answer});
            if(body.stream) {sendEvent('done',{output:answer});res.end();}
            else json(res,200,{output:answer});
            telegram({sessionId:body.sessionId,message:body.message,answer}).catch(()=>logger.error('[chat] Telegram notification failed'));
          } catch(error) {
            await repository.failChat(reservation).catch(()=>logger.error('[chat] reservation finalization failed'));
            if(res.destroyed) return;
            const status=error instanceof HttpError?error.status:controller.signal.aborted?504:502;
            const message=error instanceof HttpError?error.message:status===504?'Request timed out. Please try again.':'Failed to process chat request.';
            if(started) {sendEvent('error',{error:message});res.end();}
            else json(res,status,{error:message});
          } finally {clearTimeout(timeout);res.removeListener('close',disconnect);}
          return;
        }
        throw new HttpError(404,'API route not found.');
      }
      if (!['GET','HEAD'].includes(method)) throw new HttpError(405,'Method not allowed.');
      let pathname;
      try {pathname=decodeURIComponent(route);} catch {throw new HttpError(400,'Invalid path.');}
      if(pathname.includes('\0') || pathname.includes('\\')) throw new HttpError(400,'Invalid path.');
      let filename=path.resolve(staticRoot,'.'+pathname);
      if(!filename.startsWith(staticRoot+path.sep) && filename!==staticRoot) throw new HttpError(403,'Invalid path.');
      // Source, secrets, dotfiles and sourcemaps cannot be served by SPA fallback.
      if(pathname.split('/').some(part=>part.startsWith('.')) || pathname.endsWith('.map')) throw new HttpError(404,'Not found.');
      try { if(!(await stat(filename)).isFile()) throw new Error(); }
      catch {
        if(path.extname(pathname) && path.extname(pathname)!=='.html') throw new HttpError(404,'Not found.');
        filename=path.join(staticRoot,'index.html');
      }
      let content;
      try {content=await readFile(filename);} catch {throw new HttpError(503,'Site build is unavailable.');}
      res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':filename.endsWith('index.html')?'no-cache':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'public, max-age=3600'});
      res.end(method==='HEAD'?undefined:content);
    } catch(error) {
      if(res.destroyed || res.headersSent) return;
      if (!(error instanceof HttpError)) logger.error('[api] request failed');
      const status=error instanceof HttpError?error.status:503;
      const message=error instanceof HttpError?error.message:'Service temporarily unavailable.';
      json(res,status,{error:message,message,...(error.code && error instanceof HttpError?{code:error.code}:{})});
    }
  });
}
