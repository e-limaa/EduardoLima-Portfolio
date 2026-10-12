import { createHash, createHmac, randomBytes } from 'node:crypto';
import { isIP } from 'node:net';

export class HttpError extends Error {
  constructor(status, message, code) { super(message); this.status = status; this.code = code; }
}
export const sessionHash = token => createHash('sha256').update(token).digest('hex');
export const newSessionToken = () => randomBytes(32).toString('base64url');
export const isAdmin = user => !!user && (user.is_admin === true || ['admin','owner','superadmin'].includes(user.role));
export function requestIp(req, config) {
  let peer = req.socket.remoteAddress || '';
  if (peer.startsWith('::ffff:')) peer = peer.slice(7);
  const family = isIP(peer);
  const trusted = family && config.trustedProxies.check(peer, family === 4 ? 'ipv4' : 'ipv6');
  const forwarded = req.headers['cf-connecting-ip'];
  return trusted && typeof forwarded === 'string' && isIP(forwarded) ? forwarded : peer;
}
export const hashIp = (req, config) => createHmac('sha256', config.rateSecret).update(requestIp(req, config)).digest('hex');
export function requireOrigin(req, config) {
  // Exact configured origin is independent of spoofable Host and proxy headers.
  const allowedOrigins = config.allowedOrigins || new Set([config.origin]);
  if (!allowedOrigins.has(req.headers.origin) || req.headers['sec-fetch-site'] === 'cross-site') throw new HttpError(403, 'Origin not allowed.');
}
export function sessionToken(req, config) {
  const cookies = (req.headers.cookie || '').split(';').map(part => part.trim());
  const value = cookies.find(part => part.startsWith(`${config.cookieName}=`))?.slice(config.cookieName.length + 1);
  return value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
}
export function sessionCookie(token, config, clear = false) {
  return `${config.cookieName}=${clear ? '' : token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear ? 0 : config.sessionSeconds}${config.secureCookie ? '; Secure' : ''}`;
}
export function validateEmail(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Email inválido.');
  return email;
}
export function validateContact(body) {
  const text = (value, max, label) => {
    const result = typeof value === 'string' ? value.trim() : '';
    if (result.length > max) throw new HttpError(400, `${label} is too long.`);
    return result || null;
  };
  const name = text(body.name, 120, 'Name');
  const rawEmail = text(body.email, 254, 'Email');
  const email = rawEmail ? validateEmail(rawEmail) : null;
  const phone = text(body.phone, 40, 'Phone');
  const company = text(body.company, 120, 'Company');
  const message = text(body.message, 4000, 'Message');
  if (phone && !/^[0-9+()\-.\s]{6,40}$/.test(phone)) throw new HttpError(400, 'Invalid phone number.');
  if (!name || !message) throw new HttpError(400, 'Name and message are required.', 'CONTACT_REQUIRED');
  if (!email && !phone) throw new HttpError(400, 'Email or phone is required.', 'CONTACT_REACH_REQUIRED');
  return {name, email, phone, company, message};
}
export function validateChat(body) {
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  if (!message || message.length > 2000) throw new HttpError(400, 'Message is required and must be at most 2000 characters.');
  if (!/^[a-zA-Z0-9_-]{8,128}$/.test(sessionId)) throw new HttpError(400, 'Invalid sessionId.');
  return {message, sessionId, stream: body.stream === true};
}
