export const config = { runtime: "edge" };

const MAX_MESSAGE_LENGTH = 2000;
const MAX_BODY_BYTES = 10_000;
const MAX_HISTORY_ROWS = 6;
const MAX_KNOWLEDGE_ROWS = 30;
const MAX_TOOL_ROUNDS = 2;
const DEFAULT_DAILY_MESSAGES_PER_SESSION = 30;
const DEFAULT_MAX_OUTPUT_TOKENS = 220;
const DEFAULT_MAX_OUTPUT_TOKENS_CAP = 400;
const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const DEFAULT_INSTRUCTIONS = `
Voce e o AI Assistant do portfolio de Eduardo Lima, Designer UX/UI Senior.
Sua funcao e responder como se fosse o proprio Eduardo, sempre em primeira pessoa, com tom formal, amigavel e tecnico.
Seu publico principal sao recrutadores, lideres tecnicos e empresas.

Voce tem acesso a ferramenta consultar_conhecimento, que consulta a tabela agent_knowledge e contem informacoes detalhadas sobre mim.
SEMPRE use essa ferramenta para buscar informacoes sobre minha carreira, projetos, habilidades, processos e vida pessoal.

Se a ferramenta nao retornar informacoes relevantes, responda:
"No meu conteudo atual nao tenho essa informacao registrada."

REGRA CRITICA DE TAMANHO:
Suas respostas devem ser SEMPRE curtas e objetivas, com no maximo 300 caracteres.
O objetivo e ter uma conversa fluida e rapida, contando o conteudo aos poucos.
Nunca envie blocos grandes de texto.

REGRA SOBRE FERRAMENTAS:
Quando perguntado sobre ferramentas, diferencie explicitamente:
1. Dia a dia profissional: Figma, Jira, Miro etc.
2. Projetos pessoais: n8n, Supabase, Cursor AI, v0 etc.
Deixe claro quais sao de uso profissional e quais sao estudos/projetos pessoais.

COMPORTAMENTO EM SAUDACOES:
Se o usuario disser "oi", "ola", "hey", "boa tarde" ou saudacoes semelhantes, responda apenas:
"Ola! Como posso ajudar voce hoje?"
Nunca mencione empresa, cargo, projetos ou historico em saudacoes.
Nao use introducoes longas.

REGRA PARA MENCIONAR A EMPRESA:
Voce so deve mencionar a Construtora Tenda quando o usuario perguntar explicitamente.

NIVEL DE DETALHE DAS RESPOSTAS:
Perguntas simples devem receber respostas curtas e diretas.
Perguntas pedindo detalhes devem receber respostas completas, mas respeitando o limite de 300 caracteres.
Se precisar, divida o conteudo em mais mensagens ao longo da conversa.

IDIOMA:
Responda no idioma do usuario, PT-BR ou ingles.

Use a tool consultar_conhecimento para embasar suas respostas.
Sempre em primeira pessoa.
Nunca invente nada.
`.trim();

const knowledgeTool = {
  type: "function",
  name: "consultar_conhecimento",
  description:
    "Consulta a base de conhecimento do portfolio sobre Eduardo Lima, projetos, servicos, experiencia, contato e forma de trabalho.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Pergunta ou termos que devem ser buscados na base de conhecimento.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  strict: true,
};

const json = (statusCode, payload) =>
  new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const sseHeaders = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-store, no-transform",
  Connection: "keep-alive",
  "X-Content-Type-Options": "nosniff",
};

const encodeSse = (event, payload) =>
  `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;

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

const createTimeoutSignal = (timeoutMs) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
};

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) return null;

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
};

const supabaseFetch = async (config, path, options = {}) => {
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Supabase request failed: status=${response.status} body=${body.slice(0, 300)}`,
    );
  }

  if (response.status === 204) return null;
  return response.json().catch(() => null);
};

const getPositiveIntegerEnv = (name, fallback) => {
  const value = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const getMaxOutputTokens = () => {
  const requested = getPositiveIntegerEnv(
    "OPENAI_MAX_OUTPUT_TOKENS",
    DEFAULT_MAX_OUTPUT_TOKENS,
  );
  const cap = getPositiveIntegerEnv(
    "OPENAI_MAX_OUTPUT_TOKENS_CAP",
    DEFAULT_MAX_OUTPUT_TOKENS_CAP,
  );
  return Math.min(requested, cap);
};

const getTodayIsoStart = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString();
};

const getDailySessionUsage = async (supabaseConfig, sessionId) => {
  if (!supabaseConfig) return 0;

  try {
    const rows = await supabaseFetch(
      supabaseConfig,
      `interaction_logs?select=timestamp&session_id=eq.${encodeURIComponent(
        sessionId,
      )}&timestamp=gte.${encodeURIComponent(getTodayIsoStart())}&limit=100`,
      { method: "GET" },
    );

    return Array.isArray(rows) ? rows.length : 0;
  } catch (err) {
    console.error(`[chat] failed to load daily usage: ${err.message}`);
    return 0;
  }
};

const checkUsageLimit = async (supabaseConfig, sessionId) => {
  const dailyLimit = getPositiveIntegerEnv(
    "CHAT_DAILY_MESSAGES_PER_SESSION",
    DEFAULT_DAILY_MESSAGES_PER_SESSION,
  );
  const usedToday = await getDailySessionUsage(supabaseConfig, sessionId);

  return {
    allowed: usedToday < dailyLimit,
    dailyLimit,
    remaining: Math.max(dailyLimit - usedToday, 0),
  };
};

const loadRecentHistory = async (supabaseConfig, sessionId) => {
  if (!supabaseConfig) return [];

  try {
    const rows = await supabaseFetch(
      supabaseConfig,
      `interaction_logs?select=user_message,ai_response,timestamp&session_id=eq.${encodeURIComponent(
        sessionId,
      )}&order=timestamp.desc&limit=${MAX_HISTORY_ROWS}`,
      { method: "GET" },
    );

    if (!Array.isArray(rows)) return [];

    return rows
      .reverse()
      .flatMap((row) => {
        const messages = [];
        if (typeof row.user_message === "string" && row.user_message.trim()) {
          messages.push({ role: "user", content: row.user_message });
        }
        if (typeof row.ai_response === "string" && row.ai_response.trim()) {
          messages.push({ role: "assistant", content: row.ai_response });
        }
        return messages;
      });
  } catch (err) {
    console.error(`[chat] failed to load history: ${err.message}`);
    return [];
  }
};

const rowToSearchText = (row) =>
  Object.entries(row || {})
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) =>
      typeof value === "object"
        ? `${key}: ${JSON.stringify(value)}`
        : `${key}: ${String(value)}`,
    )
    .join("\n");

const scoreKnowledgeRow = (queryTerms, row) => {
  const text = rowToSearchText(row).toLowerCase();
  return queryTerms.reduce(
    (score, term) => score + (term.length > 2 && text.includes(term) ? 1 : 0),
    0,
  );
};

const consultarConhecimento = async (supabaseConfig, query) => {
  if (!supabaseConfig) {
    return JSON.stringify({
      found: false,
      error: "Supabase nao esta configurado no backend.",
    });
  }

  try {
    const rows = await supabaseFetch(
      supabaseConfig,
      `agent_knowledge?select=*&limit=${MAX_KNOWLEDGE_ROWS}`,
      { method: "GET" },
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return JSON.stringify({ found: false, items: [] });
    }

    const queryTerms = String(query || "")
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.replace(/[^\p{L}\p{N}_-]/gu, ""))
      .filter(Boolean);

    const ranked = rows
      .map((row) => ({ row, score: scoreKnowledgeRow(queryTerms, row) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ row }) => row);

    return JSON.stringify({
      found: ranked.length > 0,
      query,
      items: ranked,
    });
  } catch (err) {
    console.error(`[chat] failed to query knowledge: ${err.message}`);
    return JSON.stringify({
      found: false,
      error: "Falha ao consultar a base de conhecimento.",
    });
  }
};

const callOpenAI = async (payload, signal) => {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `OpenAI responded with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

const parseOpenAIStream = async (response, onEvent) => {
  if (!response.body) {
    throw new Error("OpenAI stream did not include a response body.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const rawEvent of events) {
      const dataLines = rawEvent
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      if (dataLines.length === 0) continue;

      const data = dataLines.join("\n");
      if (data === "[DONE]") continue;

      onEvent(JSON.parse(data));
    }
  }
};

const callOpenAIStream = async (payload, signal, onTextDelta) => {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, stream: true }),
    signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message =
      data?.error?.message ||
      data?.message ||
      `OpenAI responded with status ${response.status}`;
    throw new Error(message);
  }

  let completedResponse = null;

  await parseOpenAIStream(response, (event) => {
    if (event.type === "response.output_text.delta") {
      const delta = typeof event.delta === "string" ? event.delta : "";
      if (delta) onTextDelta(delta);
      return;
    }

    if (event.type === "response.completed") {
      completedResponse = event.response || null;
      return;
    }

    if (event.type === "response.failed" || event.type === "error") {
      const message =
        event.error?.message || event.message || "OpenAI stream failed.";
      throw new Error(message);
    }
  });

  if (!completedResponse) {
    throw new Error("OpenAI stream did not include a completed response.");
  }

  return completedResponse;
};

const extractOutputText = (response) => {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const output = Array.isArray(response?.output) ? response.output : [];
  const parts = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const contentItem of content) {
      if (
        contentItem?.type === "output_text" &&
        typeof contentItem.text === "string"
      ) {
        parts.push(contentItem.text);
      }
    }
  }

  return parts.join("\n").trim();
};

const runResponseWithTools = async ({
  message,
  sessionId,
  supabaseConfig,
  signal,
}) => {
  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const instructions = process.env.OPENAI_INSTRUCTIONS || DEFAULT_INSTRUCTIONS;
  const maxOutputTokens = getMaxOutputTokens();
  const shouldStoreResponses = process.env.OPENAI_STORE === "true";
  const history = await loadRecentHistory(supabaseConfig, sessionId);
  let input = [...history, { role: "user", content: message }];
  let response = null;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    response = await callOpenAI(
      {
        model,
        instructions,
        input,
        tools: [knowledgeTool],
        tool_choice: "auto",
        max_output_tokens: maxOutputTokens,
        store: shouldStoreResponses,
        ...(shouldStoreResponses
          ? {}
          : { include: ["reasoning.encrypted_content"] }),
      },
      signal,
    );

    const toolCalls = (Array.isArray(response.output) ? response.output : []).filter(
      (item) => item?.type === "function_call",
    );

    if (toolCalls.length === 0) break;

    input = [...input, ...response.output];

    for (const toolCall of toolCalls) {
      let args = {};
      try {
        args = JSON.parse(toolCall.arguments || "{}");
      } catch {
        args = {};
      }

      const output =
        toolCall.name === "consultar_conhecimento"
          ? await consultarConhecimento(supabaseConfig, args.query || message)
          : JSON.stringify({ error: `Ferramenta desconhecida: ${toolCall.name}` });

      input.push({
        type: "function_call_output",
        call_id: toolCall.call_id,
        output,
      });
    }
  }

  const text = extractOutputText(response);

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return text;
};

const createResponsePayload = ({ model, instructions, input, maxOutputTokens, shouldStoreResponses }) => ({
  model,
  instructions,
  input,
  tools: [knowledgeTool],
  tool_choice: "auto",
  max_output_tokens: maxOutputTokens,
  store: shouldStoreResponses,
  ...(shouldStoreResponses
    ? {}
    : { include: ["reasoning.encrypted_content"] }),
});

const appendToolOutputs = async ({ input, response, supabaseConfig, message }) => {
  const toolCalls = (Array.isArray(response.output) ? response.output : []).filter(
    (item) => item?.type === "function_call",
  );

  if (toolCalls.length === 0) {
    return { input, hasToolCalls: false };
  }

  const nextInput = [...input, ...response.output];

  for (const toolCall of toolCalls) {
    let args = {};
    try {
      args = JSON.parse(toolCall.arguments || "{}");
    } catch {
      args = {};
    }

    const output =
      toolCall.name === "consultar_conhecimento"
        ? await consultarConhecimento(supabaseConfig, args.query || message)
        : JSON.stringify({ error: `Ferramenta desconhecida: ${toolCall.name}` });

    nextInput.push({
      type: "function_call_output",
      call_id: toolCall.call_id,
      output,
    });
  }

  return { input: nextInput, hasToolCalls: true };
};

const runStreamingResponseWithTools = async ({
  message,
  sessionId,
  supabaseConfig,
  signal,
  onTextDelta,
}) => {
  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const instructions = process.env.OPENAI_INSTRUCTIONS || DEFAULT_INSTRUCTIONS;
  const maxOutputTokens = getMaxOutputTokens();
  const shouldStoreResponses = process.env.OPENAI_STORE === "true";
  const history = await loadRecentHistory(supabaseConfig, sessionId);
  let input = [...history, { role: "user", content: message }];
  let finalResponse = null;
  let fullText = "";

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    let roundText = "";
    const response = await callOpenAIStream(
      createResponsePayload({
        model,
        instructions,
        input,
        maxOutputTokens,
        shouldStoreResponses,
      }),
      signal,
      (delta) => {
        roundText += delta;
        onTextDelta(delta);
      },
    );

    const toolResult = await appendToolOutputs({
      input,
      response,
      supabaseConfig,
      message,
    });

    if (!toolResult.hasToolCalls) {
      finalResponse = response;
      fullText += roundText;
      break;
    }

    input = toolResult.input;
  }

  const text = (fullText || extractOutputText(finalResponse)).trim();

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return text;
};

const saveInteractionLog = async (
  supabaseConfig,
  { sessionId, message, answer },
) => {
  if (!supabaseConfig) return;

  await supabaseFetch(supabaseConfig, "interaction_logs", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      session_id: sessionId,
      user_message: message,
      ai_response: answer,
      timestamp: new Date().toISOString(),
      is_read: false,
    }),
  });
};

const notifyTelegram = async ({ sessionId, message, answer }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  const text = [
    "Nova interacao no chat do portfolio",
    `Sessao: ${sessionId}`,
    "",
    `Visitante: ${message}`,
    "",
    `Assistente: ${answer}`,
  ]
    .join("\n")
    .slice(0, 3900);

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Telegram request failed: status=${response.status} body=${body.slice(
        0,
        300,
      )}`,
    );
  }
};

const runSideEffects = (context, tasks) => {
  const work = Promise.allSettled(tasks).then((results) => {
    for (const result of results) {
      if (result.status === "rejected") {
        console.error(`[chat] side effect failed: ${result.reason?.message}`);
      }
    }
  });

  if (context && typeof context.waitUntil === "function") {
    context.waitUntil(work);
  } else {
    work.catch((err) =>
      console.error(`[chat] side effect scheduler failed: ${err.message}`),
    );
  }
};

export default async function handler(req, context) {
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
    10,
  );
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json(413, { error: "Request body is too large." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return json(500, { error: "OpenAI endpoint is not configured." });
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
  const shouldStream = body.stream === true;

  if (!message) {
    return json(400, { error: "Message is required." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return json(400, { error: "Message is too long." });
  }

  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return json(400, { error: "Invalid sessionId." });
  }

  const supabaseConfig = getSupabaseConfig();
  const usageLimit = await checkUsageLimit(supabaseConfig, sessionId);

  if (!usageLimit.allowed) {
    return json(429, {
      error:
        "Limite diário de mensagens atingido. Tente novamente amanhã.",
      limit: usageLimit.dailyLimit,
      remaining: usageLimit.remaining,
    });
  }

  const timeout = createTimeoutSignal(30_000);

  if (shouldStream) {
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    let writeChain = Promise.resolve();

    const writeEvent = (event, payload) => {
      writeChain = writeChain.then(() =>
        writer.write(encoder.encode(encodeSse(event, payload))),
      );
      return writeChain;
    };

    (async () => {
      let answer = "";
      try {
        answer = await runStreamingResponseWithTools({
          message,
          sessionId,
          supabaseConfig,
          signal: timeout.signal,
          onTextDelta: (delta) => {
            answer += delta;
            writeEvent("delta", { delta });
          },
        });

        await writeChain;
        await writeEvent("done", { output: answer });

        runSideEffects(context, [
          saveInteractionLog(supabaseConfig, { sessionId, message, answer }),
          notifyTelegram({ sessionId, message, answer }),
        ]);
      } catch (err) {
        const isAbort = err instanceof DOMException && err.name === "AbortError";
        console.error(`[chat] stream error: ${err.message}`);
        await writeEvent("error", {
          error: isAbort
            ? "Request timed out. Please try again."
            : "Failed to process chat request.",
        });
      } finally {
        timeout.clear();
        await writeChain.catch(() => {});
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      status: 200,
      headers: sseHeaders,
    });
  }

  try {
    const answer = await runResponseWithTools({
      message,
      sessionId,
      supabaseConfig,
      signal: timeout.signal,
    });

    runSideEffects(context, [
      saveInteractionLog(supabaseConfig, { sessionId, message, answer }),
      notifyTelegram({ sessionId, message, answer }),
    ]);

    return json(200, { output: answer });
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    console.error(`[chat] response error: ${err.message}`);
    return json(isAbort ? 504 : 502, {
      error: isAbort
        ? "Request timed out. Please try again."
        : "Failed to process chat request.",
    });
  } finally {
    timeout.clear();
  }
}
