import { BlockList, isIP } from 'node:net';

export const positiveInteger = (value, fallback, max = 100000) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= max ? n : fallback;
};

export function loadConfig(env = process.env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
  if (!env.PUBLIC_ORIGIN) throw new Error('PUBLIC_ORIGIN is required.');
  const origin = new URL(env.PUBLIC_ORIGIN);
  const production = env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test';
  if (production && origin.protocol !== 'https:') throw new Error('Production PUBLIC_ORIGIN must use HTTPS.');
  if (!['https:', 'http:'].includes(origin.protocol) || origin.username || origin.password) throw new Error('Invalid PUBLIC_ORIGIN.');
  const allowedOrigins = new Set([origin.origin]);
  for (const value of (env.PUBLIC_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean)) {
    try {
      const allowed = new URL(value);
      if (!['https:', 'http:'].includes(allowed.protocol) || allowed.username || allowed.password || allowed.origin !== value || (production && allowed.protocol !== 'https:')) throw new Error();
      allowedOrigins.add(allowed.origin);
    } catch {
      throw new Error('Invalid PUBLIC_ORIGINS.');
    }
  }
  if (!env.RATE_LIMIT_SECRET || env.RATE_LIMIT_SECRET.length < 32) throw new Error('RATE_LIMIT_SECRET requires at least 32 characters.');
  const trustedProxies = new BlockList();
  for (const range of (env.CF_PROXY_CIDRS || '').split(',').filter(Boolean)) {
    const [ip, prefix] = range.trim().split('/');
    const family = isIP(ip);
    if (!family) throw new Error('Invalid CF_PROXY_CIDRS.');
    const type = family === 4 ? 'ipv4' : 'ipv6';
    if (prefix === undefined) trustedProxies.addAddress(ip, type);
    else trustedProxies.addSubnet(ip, Number(prefix), type);
  }
  const newsletterDeliveryEnabled = env.NEWSLETTER_DELIVERY_ENABLED === 'true';
  let newsletterWebhookUrl = '';
  let newsletterWebhookSecret = '';
  if (newsletterDeliveryEnabled) {
    try {
      const webhook = new URL(env.NEWSLETTER_WEBHOOK_URL || '');
      if (webhook.protocol !== 'https:' || webhook.hostname !== 'n8n.elimaj.com.br' || webhook.pathname !== '/webhook/novo-inscrito-newsletter' || webhook.username || webhook.password || webhook.search || webhook.hash) throw new Error();
      newsletterWebhookUrl = webhook.href;
    } catch {
      throw new Error('Newsletter delivery requires the approved HTTPS n8n webhook URL.');
    }
    newsletterWebhookSecret = env.NEWSLETTER_WEBHOOK_SECRET || '';
    if (!/^[A-Za-z0-9_-]{32,}$/.test(newsletterWebhookSecret)) {
      throw new Error('NEWSLETTER_WEBHOOK_SECRET requires at least 32 URL-safe characters.');
    }
  }
  return {
    databaseUrl: env.DATABASE_URL, origin: origin.origin, allowedOrigins, secureCookie: production || origin.protocol === 'https:',
    cookieName: production || origin.protocol === 'https:' ? '__Host-portfolio_session' : 'portfolio_session',
    rateSecret: env.RATE_LIMIT_SECRET, trustedProxies,
    host: env.HOST || '0.0.0.0', port: positiveInteger(env.PORT, env.NODE_ENV === 'development' ? 3010 : 3000, 65535),
    poolMax: positiveInteger(env.PG_POOL_MAX, 5, 20),
    sessionSeconds: positiveInteger(env.SESSION_SECONDS, 43200, 604800),
    chatTimeoutMs: positiveInteger(env.CHAT_TIMEOUT_MS, 30000, 120000),
    chatDailySession: positiveInteger(env.CHAT_DAILY_MESSAGES_PER_SESSION, 30),
    chatDailyIp: positiveInteger(env.CHAT_DAILY_MESSAGES_PER_IP, 60),
    chatIpConcurrency: positiveInteger(env.CHAT_CONCURRENCY_PER_IP, 2, 10),
    chatGlobalConcurrency: positiveInteger(env.CHAT_GLOBAL_CONCURRENCY, 5, 20),
    staticDir: env.STATIC_DIR, newsletterDeliveryEnabled, newsletterWebhookUrl, newsletterWebhookSecret,
  };
}
