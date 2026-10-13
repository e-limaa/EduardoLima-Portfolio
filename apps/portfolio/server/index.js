import { loadConfig } from './config.js';
import { createPool, createRepository } from './db.js';
import { createApp } from './app.js';
import { deliverNewsletterEvent } from './newsletter-worker.js';
import { refreshTrustedProxies } from './trusted-proxies.js';
import { logger } from './log.js';

const config=loadConfig();
let proxyRefresh;
if(config.trustedProxyHosts.length) {
  const addresses=await refreshTrustedProxies(config);
  if(!addresses.length) logger.warn('proxy.hosts_unresolved',{hosts:config.trustedProxyHosts});
  proxyRefresh=setInterval(()=>refreshTrustedProxies(config).catch(error=>logger.error('proxy.refresh_failed',error)),60000);
  proxyRefresh.unref();
} else if(config.production && !config.trustedProxyCidrs.length) {
  logger.warn('proxy.not_configured',{note:'behind a tunnel every visitor shares one rate-limit bucket'});
}
const pool=createPool(config);
const repository=createRepository(pool,config);
const app=createApp({repository,config});
app.requestTimeout=15000;
app.headersTimeout=10000;
app.keepAliveTimeout=5000;
app.listen(config.port,config.host,()=>logger.info('server.listening',{port:config.port,trustedProxyHosts:config.trustedProxyHosts,trustedProxyCount:config.trustedProxyHosts.length+config.trustedProxyCidrs.length}));
const cleanup=setInterval(()=>repository.cleanup().catch(error=>logger.error('database.maintenance_failed',error)),3600000);
cleanup.unref();
let newsletterWorker;
if(config.newsletterDeliveryEnabled) {
  const deliver=()=>deliverNewsletterEvent(repository,config).catch(error=>logger.error('newsletter.outbox_failed',error));
  newsletterWorker=setInterval(deliver,5000);
  newsletterWorker.unref();
  deliver();
}
let closing=false;
for (const signal of ['SIGTERM','SIGINT']) process.on(signal,()=>{
  if(closing) return;
  closing=true;
  logger.info('server.stopping',{signal});
  clearInterval(cleanup);
  if(proxyRefresh) clearInterval(proxyRefresh);
  if(newsletterWorker) clearInterval(newsletterWorker);
  app.close(async()=>{await pool.end();process.exit(0);});
  setTimeout(()=>process.exit(1),45000).unref();
});
