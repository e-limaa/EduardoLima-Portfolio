export async function deliverNewsletterEvent(repository,config,fetchImpl=fetch) {
  if(!config.newsletterDeliveryEnabled) return false;
  const event=await repository.claimNewsletterEvent();
  if(!event) return false;
  let status=null;
  let delivered=false;
  try {
    const response=await fetchImpl(config.newsletterWebhookUrl,{
      method:'POST',
      headers:{
        'content-type':'application/json',
        'x-portfolio-event-id':event.id,
        'x-portfolio-webhook-secret':config.newsletterWebhookSecret,
      },
      body:JSON.stringify(event.payload),
      signal:AbortSignal.timeout(15000),
    });
    status=response.status;
    delivered=response.ok;
  } catch {}
  await repository.finishNewsletterEvent(event,{delivered,status});
  return delivered;
}
