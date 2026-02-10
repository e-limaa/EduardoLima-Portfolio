const MAX_MESSAGE_LENGTH = 2000;
const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
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

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

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

    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
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
