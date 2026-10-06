import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverNewsletterEvent } from '../newsletter-worker.js';

test('disabled newsletter delivery never claims an event or contacts a consumer',async()=>{
  let claimed=false;
  const repository={claimNewsletterEvent:async()=>{claimed=true;return null;}};
  const sent=await deliverNewsletterEvent(repository,{newsletterDeliveryEnabled:false,newsletterWebhookUrl:''},async()=>{throw new Error('network must stay disabled');});
  assert.equal(sent,false);
  assert.equal(claimed,false);
});

test('newsletter delivery sends the compatible insert envelope with its stable event id',async()=>{
  const event={id:'7c8c7682-6f1e-43aa-9fa9-1e7ac52ca085',attempts:1,payload:{type:'INSERT',table:'newsletter_subscribers',schema:'public',record:{id:'subscriber-id',email:'subscriber@example.com'},old_record:null}};
  const calls=[];
  const repository={claimNewsletterEvent:async()=>event,finishNewsletterEvent:async(...args)=>calls.push(args)};
  const sent=await deliverNewsletterEvent(repository,{newsletterDeliveryEnabled:true,newsletterWebhookUrl:'https://n8n.elimaj.com.br/webhook/novo-inscrito-newsletter',newsletterWebhookSecret:'test-secret'},async(url,options)=>{
    assert.equal(url,'https://n8n.elimaj.com.br/webhook/novo-inscrito-newsletter');
    assert.equal(options.method,'POST');
    assert.equal(options.headers['x-portfolio-event-id'],event.id);
    assert.equal(options.headers['x-portfolio-webhook-secret'],'test-secret');
    assert.deepEqual(JSON.parse(options.body),event.payload);
    return {ok:true,status:200};
  });
  assert.equal(sent,true);
  assert.deepEqual(calls,[[event,{delivered:true,status:200}]]);
});

test('failed newsletter delivery is recorded for delayed retry without exposing provider text',async()=>{
  const event={id:'b23e3b5d-d8ee-4b25-a232-332f33bafe08',attempts:2,payload:{}};
  const calls=[];
  const repository={claimNewsletterEvent:async()=>event,finishNewsletterEvent:async(...args)=>calls.push(args)};
  const sent=await deliverNewsletterEvent(repository,{newsletterDeliveryEnabled:true,newsletterWebhookUrl:'https://n8n.elimaj.com.br/webhook/novo-inscrito-newsletter',newsletterWebhookSecret:'test-secret'},async()=>({ok:false,status:503}));
  assert.equal(sent,false);
  assert.deepEqual(calls,[[event,{delivered:false,status:503}]]);
});
