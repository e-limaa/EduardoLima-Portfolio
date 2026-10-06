import { loadConfig } from './config.js';
import { createPool, createRepository } from './db.js';
import { createApp } from './app.js';
import { deliverNewsletterEvent } from './newsletter-worker.js';

const config=loadConfig();
const pool=createPool(config);
const repository=createRepository(pool,config);
const app=createApp({repository,config});
app.requestTimeout=15000;
app.headersTimeout=10000;
app.keepAliveTimeout=5000;
app.listen(config.port,config.host,()=>console.log(`Portfolio server listening on port ${config.port}`));
const cleanup=setInterval(()=>repository.cleanup().catch(()=>console.error('[database] maintenance failed')),3600000);
cleanup.unref();
let newsletterWorker;
if(config.newsletterDeliveryEnabled) {
  const deliver=()=>deliverNewsletterEvent(repository,config).catch(()=>console.error('[newsletter] outbox processing failed'));
  newsletterWorker=setInterval(deliver,5000);
  newsletterWorker.unref();
  deliver();
}
let closing=false;
for (const signal of ['SIGTERM','SIGINT']) process.on(signal,()=>{
  if(closing) return;
  closing=true;
  clearInterval(cleanup);
  if(newsletterWorker) clearInterval(newsletterWorker);
  app.close(async()=>{await pool.end();process.exit(0);});
  setTimeout(()=>process.exit(1),45000).unref();
});
