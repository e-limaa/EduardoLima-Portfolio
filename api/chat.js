export const config = { runtime: "edge" };

const MAX_MESSAGE_LENGTH = 2000;
const MAX_BODY_BYTES = 10_000;
const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

const json = (statusCode, payload) =>
  new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const normalizeOrigin = (value) => {
  if (!value || typeof value !== "string") return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const isOriginAllowed = (req) => {
  const origin = normalizeOrigin(req.headers.get("origin") || "");
  if (!origin) return false;

  const host = req.headers.get("host") || "";
  const forwardedProto = req.headers.get("x-forwarded-proto") || "";
  const proto =
    (forwardedProto && forwardedProto.split(",")[0].trim()) ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  const sameOrigin = normalizeOrigin(`${proto}://${host}`);
  const configuredOrigins = (process.env.CHAT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => normalizeOrigin(item.trim()))
    .filter(Boolean);

  const allowed = new Set([sameOrigin, ...configuredOrigins].filter(Boolean));
  return allowed.has(origin);
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  if (!isOriginAllowed(req)) {
    return json(403, { error: "Origin not allowed." });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json(415, { error: "Content-Type must be application/json." });
  }

  const contentLength = Number.parseInt(
    req.headers.get("content-length") || "",
    10
  );
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json(413, { error: "Request body is too large." });
  }

  const webhookUrl =
    process.env.N8N_WEBHOOK_URL || process.env.VITE_N8N_WEBHOOK_URL;
  const webhookSecret =
    process.env.N8N_WEBHOOK_SECRET || process.env.VITE_N8N_WEBHOOK_SECRET;

  if (!webhookUrl) {
    return json(500, { error: "Chat endpoint is not configured." });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";

  if (!message) {
    return json(400, { error: "Message is required." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return json(400, { error: "Message is too long." });
  }

  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return json(400, { error: "Invalid sessionId." });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookSecret ? { "x-webhook-secret": webhookSecret } : {}),
      },
      body: JSON.stringify({ message, sessionId }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const upstreamBody = await upstream.text().catch(() => "");
      console.error(
        `[chat] upstream error: status=${upstream.status} body=${upstreamBody.slice(0, 500)}`
      );
      return json(502, {
        error: "Upstream service unavailable.",
        detail: `n8n responded with status ${upstream.status}`,
      });
    }

    const upstreamContentType = upstream.headers.get("content-type") || "";
    if (upstreamContentType.includes("application/json")) {
      const data = await upstream.json();
      return json(200, data);
    }

    const text = await upstream.text();
    return json(200, { output: text });
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    console.error(`[chat] fetch error: ${err.message}`);
    return json(isAbort ? 504 : 502, {
      error: isAbort
        ? "Request timed out. Please try again."
        : "Failed to process chat request.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
