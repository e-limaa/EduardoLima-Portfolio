import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';

const hostnamePattern = /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9_-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]{0,61}[a-z0-9])?)*$/i;

export function parseProxyCidrs(value = '') {
  return value.split(',').map(range => range.trim()).filter(Boolean).map(range => {
    const [ip, prefix] = range.split('/');
    const family = isIP(ip);
    const bits = prefix === undefined ? undefined : Number(prefix);
    if (!family || (bits !== undefined && (!Number.isInteger(bits) || bits < 0 || bits > (family === 4 ? 32 : 128)))) throw new Error('Invalid CF_PROXY_CIDRS.');
    return {ip, prefix: bits, type: family === 4 ? 'ipv4' : 'ipv6'};
  });
}
export function parseProxyHosts(value = '') {
  const hosts = value.split(',').map(host => host.trim()).filter(Boolean);
  if (hosts.some(host => !hostnamePattern.test(host))) throw new Error('Invalid CF_PROXY_HOSTS.');
  return hosts;
}
export function buildTrustedProxies(cidrs, addresses = []) {
  const list = new BlockList();
  for (const {ip, prefix, type} of cidrs) {
    if (prefix === undefined) list.addAddress(ip, type);
    else list.addSubnet(ip, prefix, type);
  }
  for (const address of addresses) {
    const family = isIP(address);
    if (family) list.addAddress(address, family === 4 ? 'ipv4' : 'ipv6');
  }
  return list;
}
// Trusts only the current addresses of the named cloudflared peers, so a Docker
// network shared with other services never makes their forwarded headers trusted.
// A failed lookup trusts nothing for that host: rate limits fall back to the peer IP.
export async function refreshTrustedProxies(config, resolve = lookup) {
  const addresses = [];
  for (const host of config.trustedProxyHosts) {
    try {
      for (const {address} of await resolve(host, {all: true})) addresses.push(address);
    } catch {}
  }
  config.trustedProxies = buildTrustedProxies(config.trustedProxyCidrs, addresses);
  return addresses;
}
