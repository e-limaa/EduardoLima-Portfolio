const MAX_TOOL_ROUNDS = 2;
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

// The last round must answer with text: a tool call there would leave no output.
const toolChoiceForRound = (round) => (round >= MAX_TOOL_ROUNDS - 1 ? "none" : "auto");
const getPositiveIntegerEnv = (name,fallback) => { const n=Number(process.env[name]); return Number.isInteger(n)&&n>0?n:fallback; };
const getMaxOutputTokens = () => Math.min(getPositiveIntegerEnv('OPENAI_MAX_OUTPUT_TOKENS',220),getPositiveIntegerEnv('OPENAI_MAX_OUTPUT_TOKENS_CAP',400));
const rankKnowledge = (rows, query) => { const terms=String(query).toLowerCase().split(/\s+/).filter(term=>term.length>2); const ranked=rows.map(row=>({row,score:terms.reduce((sum,term)=>sum+(JSON.stringify(row).toLowerCase().includes(term)?1:0),0)})).sort((a,b)=>b.score-a.score).slice(0,6).map(item=>item.row); return JSON.stringify({found:ranked.length>0,query,items:ranked}); };
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

  const consume = (rawEvent) => {
    const dataLines = rawEvent.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trim());
    if (!dataLines.length) return;
    const data = dataLines.join('\n');
    if (data !== '[DONE]') onEvent(JSON.parse(data));
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() || "";

    for (const rawEvent of events) {
      consume(rawEvent);
    }
  }
  buffer += decoder.decode();
  if (buffer.trim()) consume(buffer);
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
  context,
  signal,
}) => {
  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const instructions = process.env.OPENAI_INSTRUCTIONS || DEFAULT_INSTRUCTIONS;
  const maxOutputTokens = getMaxOutputTokens();
  const shouldStoreResponses = process.env.OPENAI_STORE === "true";
  const history = context.history;
  let input = [...history, { role: "user", content: message }];
  let response = null;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    response = await callOpenAI(
      {
        model,
        instructions,
        input,
        tools: [knowledgeTool],
        tool_choice: toolChoiceForRound(round),
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
          ? rankKnowledge(context.knowledgeRows, args.query || message)
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

const createResponsePayload = ({ model, instructions, input, maxOutputTokens, shouldStoreResponses, round }) => ({
  model,
  instructions,
  input,
  tools: [knowledgeTool],
  tool_choice: toolChoiceForRound(round),
  max_output_tokens: maxOutputTokens,
  store: shouldStoreResponses,
  ...(shouldStoreResponses
    ? {}
    : { include: ["reasoning.encrypted_content"] }),
});

const appendToolOutputs = async ({ input, response, context, message }) => {
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
        ? rankKnowledge(context.knowledgeRows, args.query || message)
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
  context,
  signal,
  onTextDelta,
}) => {
  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const instructions = process.env.OPENAI_INSTRUCTIONS || DEFAULT_INSTRUCTIONS;
  const maxOutputTokens = getMaxOutputTokens();
  const shouldStoreResponses = process.env.OPENAI_STORE === "true";
  const history = context.history;
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
        round,
      }),
      signal,
      (delta) => {
        roundText += delta;
        onTextDelta(delta);
      },
    );

    // Text streamed before a tool call was already shown to the visitor, so it
    // belongs in the persisted answer too.
    fullText += roundText;

    const toolResult = await appendToolOutputs({
      input,
      response,
      context,
      message,
    });

    if (!toolResult.hasToolCalls) {
      finalResponse = response;
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


export async function runChat({repository,context,message,sessionId,signal,onDelta}) {
  if(!process.env.OPENAI_API_KEY) throw new Error('OpenAI endpoint is not configured.');
  const history=context?.history || await repository.history(sessionId);
  const knowledgeRows=context?.knowledgeRows || await repository.knowledge();
  const options={message,sessionId,context:{history,knowledgeRows},signal};
  return onDelta ? runStreamingResponseWithTools({...options,onTextDelta:onDelta}) : runResponseWithTools(options);
}
export async function notifyTelegram({sessionId,message,answer}) {
  return sendTelegram(['Nova interacao no chat do portfolio','Sessao: '+sessionId,'','Visitante: '+message,'','Assistente: '+answer].join('\n'));
}
export async function notifyContactTelegram({name,email,phone,company,message}) {
  return sendTelegram(['Nova mensagem de contato no portfolio','Nome: '+name,email?'Email: '+email:null,phone?'Telefone: '+phone:null,company?'Empresa: '+company:null,'',message].filter(line=>line!==null).join('\n'));
}
async function sendTelegram(fullText) {
  if(!process.env.TELEGRAM_BOT_TOKEN||!process.env.TELEGRAM_CHAT_ID) return;
  const text=fullText.slice(0,3900);
  const response=await fetch('https://api.telegram.org/bot'+process.env.TELEGRAM_BOT_TOKEN+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:process.env.TELEGRAM_CHAT_ID,text,disable_web_page_preview:true}),signal:AbortSignal.timeout(5000)});
  if(!response.ok) throw new Error('Telegram notification failed.');
}
