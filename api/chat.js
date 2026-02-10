const MAX_MESSAGE_LENGTH = 2000;
const MAX_BODY_BYTES = 10_000;
const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;
const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const rateBuckets = new Map();

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(payload));
};

const normalizeOrigin = (value) => {
  if (!value || typeof value !== "string") return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const getHeader = (req, key) => {
  const raw = req.headers?.[key];
  if (Array.isArray(raw)) return raw[0] || "";
  return typeof raw === "string" ? raw : "";
};

const getClientIp = (req) => {
  const forwarded = getHeader(req, "x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = getHeader(req, "x-real-ip");
  return realIp || "unknown";
};

const isOriginAllowed = (req) => {
  const origin = normalizeOrigin(getHeader(req, "origin"));
  if (!origin) {
    return false;
  }

  const host = getHeader(req, "host");
  const forwardedProto = getHeader(req, "x-forwarded-proto");
  const proto =
    (forwardedProto && forwardedProto.split(",")[0].trim()) ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  const sameOrigin = normalizeOrigin(`${proto}://${host}`);
  const configuredOrigins = (process.env.CHAT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => normalizeOrigin(item.trim()))
    .filter(Boolean);

  const allowed = new Set([sameOrigin, ...configuredOrigins].filter(Boolean));
  return allowed.has(origin);
};

const consumeRateLimit = (key) => {
  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || now >= current.resetAt) {
    const next = { count: 1, resetAt: now + RATE_WINDOW_MS };
    rateBuckets.set(key, next);
    return { limited: false, retryAfterMs: 0 };
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return { limited: true, retryAfterMs: Math.max(0, current.resetAt - now) };
  }

  current.count += 1;
  rateBuckets.set(key, current);
  return { limited: false, retryAfterMs: 0 };
};

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === "object") return body;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return {};
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  if (!isOriginAllowed(req)) {
    return sendJson(res, 403, { error: "Origin not allowed." });
  }

  const contentType = getHeader(req, "content-type");
  if (!contentType.toLowerCase().includes("application/json")) {
    return sendJson(res, 415, { error: "Content-Type must be application/json." });
  }

  const contentLength = Number.parseInt(getHeader(req, "content-length"), 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return sendJson(res, 413, { error: "Request body is too large." });
  }

  const rateKey = getClientIp(req);
  const rateLimit = consumeRateLimit(rateKey);
  if (rateLimit.limited) {
    const retryAfterSeconds = Math.ceil(rateLimit.retryAfterMs / 1000);
    res.setHeader("Retry-After", String(retryAfterSeconds));
    return sendJson(res, 429, { error: "Too many requests. Try again later." });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.VITE_N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET || process.env.VITE_N8N_WEBHOOK_SECRET;

  if (!webhookUrl) {
    return sendJson(res, 500, { error: "Chat endpoint is not configured." });
  }

  const body = parseBody(req.body);
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

  if (!message) {
    return sendJson(res, 400, { error: "Message is required." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return sendJson(res, 400, { error: "Message is too long." });
  }

  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return sendJson(res, 400, { error: "Invalid sessionId." });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookSecret ? { "x-webhook-secret": webhookSecret } : {}),
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return sendJson(res, 502, { error: "Upstream service unavailable." });
    }

    const upstreamContentType = upstream.headers.get("content-type") || "";
    if (upstreamContentType.includes("application/json")) {
      const json = await upstream.json();
      return sendJson(res, 200, json);
    }

    const text = await upstream.text();
    return sendJson(res, 200, { output: text });
  } catch {
    return sendJson(res, 502, { error: "Failed to process chat request." });
  } finally {
    clearTimeout(timeout);
  }
};
