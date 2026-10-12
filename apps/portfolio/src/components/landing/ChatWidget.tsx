import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "@limia/design-system";
import { useLanguage } from "../language-provider";
import { readStorage, removeStorage, writeStorage } from "../../lib/safe-storage";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

type StoredMessage = Omit<Message, "timestamp"> & {
  timestamp: string | number | Date;
};

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;
const CHAT_MESSAGES_STORAGE_KEY = "chat_messages";
const CHAT_SESSION_ID_STORAGE_KEY = "chat_session_id";
const INTRO_MESSAGE_IDS = ["1", "2"] as const;

function createIntroMessages(t: (key: string) => string): Message[] {
  return [
    {
      id: "1",
      text: t("chat.msg1"),
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: t("chat.msg2"),
      sender: "bot",
      timestamp: new Date(),
    },
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredMessage(value: unknown): value is StoredMessage {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    (value.sender === "user" || value.sender === "bot") &&
    (typeof value.timestamp === "string" ||
      typeof value.timestamp === "number" ||
      value.timestamp instanceof Date)
  );
}

function stringifyResponse(value: unknown) {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function extractBotText(value: unknown): string {
  const responseData = Array.isArray(value) ? value[0] : value;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (!isRecord(responseData)) {
    return "Desculpe, não entendi a resposta do servidor.";
  }

  const possibleContent =
    responseData.output ??
    responseData.text ??
    responseData.message ??
    responseData.response ??
    responseData.answer;

  if (typeof possibleContent === "string") {
    return possibleContent;
  }

  if (isRecord(possibleContent)) {
    const nestedText = possibleContent.text ?? possibleContent.message;
    return typeof nestedText === "string"
      ? nestedText
      : stringifyResponse(possibleContent);
  }

  return stringifyResponse(responseData);
}

function parseSseEvents(buffer: string) {
  const chunks = buffer.split("\n\n");
  return {
    events: chunks.slice(0, -1),
    remaining: chunks[chunks.length - 1] || "",
  };
}

function readSseEvent(rawEvent: string): { event: string; data: unknown } | null {
  const lines = rawEvent.split("\n");
  const eventLine = lines.find((line) => line.startsWith("event:"));
  const dataLines = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim());

  if (dataLines.length === 0) return null;

  try {
    return {
      event: eventLine ? eventLine.slice(6).trim() : "message",
      data: JSON.parse(dataLines.join("\n")),
    };
  } catch {
    return null;
  }
}

function TypewriterText({
  text,
  shouldStart,
  onComplete,
}: {
  text: string;
  shouldStart: boolean;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState(shouldStart ? "" : text);
  const completionRef = useRef(onComplete);

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!shouldStart) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText("");
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
        completionRef.current?.();
      }
    }, 18);

    return () => window.clearInterval(interval);
  }, [shouldStart, text]);

  return <>{displayedText}</>;
}

export const ChatWidget = () => {
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const hasStoredMessagesRef = useRef(false);

  // Inicializa mensagens carregando da sessao atual do navegador ou usa o padrao
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = readStorage(CHAT_MESSAGES_STORAGE_KEY, "session");
    if (savedMessages) {
      hasStoredMessagesRef.current = true;
      try {
        const parsed: unknown = JSON.parse(savedMessages);
        // Converte strings de data de volta para objetos Date
        if (Array.isArray(parsed)) {
          return parsed.filter(isStoredMessage).map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        }
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error("Failed to parse messages", e);
        }
      }
    }
    return createIntroMessages(t);
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(() =>
    hasStoredMessagesRef.current ? 2 : 0
  );
  const isResponding = isTyping || streamingMessageId !== null;

  useEffect(() => {
    if (shouldReduceMotion) {
      setIntroPhase(2);
    }
  }, [shouldReduceMotion]);

  // Inicializa o session ID da sessao atual ou cria um novo
  const [sessionId] = useState(() => {
    const savedSession = readStorage(CHAT_SESSION_ID_STORAGE_KEY, "session");
    if (savedSession && SESSION_ID_PATTERN.test(savedSession)) {
      return savedSession;
    }

    return (
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
    );
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Remove persistencia antiga para nao restaurar conversas depois de reabrir o navegador.
  useEffect(() => {
    removeStorage(CHAT_MESSAGES_STORAGE_KEY);
    removeStorage(CHAT_SESSION_ID_STORAGE_KEY);
  }, []);

  // Salva o Session ID apenas na sessao atual do navegador
  useEffect(() => {
    writeStorage(CHAT_SESSION_ID_STORAGE_KEY, sessionId, "session");
  }, [sessionId]);

  // Salva as mensagens apenas na sessao atual do navegador
  useEffect(() => {
    writeStorage(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages), "session");
  }, [messages]);

  // Efeito para scrollar para o fundo sempre que mensagens mudarem ou status de digitação mudar
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
  }, [messages, isTyping, shouldReduceMotion]);

  useEffect(() => {
    const translatedIntroMessages = createIntroMessages(t);

    setMessages((prev) =>
      prev.map((message) => {
        const translatedMessage = translatedIntroMessages.find((introMessage) => introMessage.id === message.id);
        return translatedMessage
          ? { ...message, text: translatedMessage.text }
          : message;
      })
    );
  }, [language, t]);

  const handleGlowMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty("--chat-border-glow-x", `${x}px`);
    event.currentTarget.style.setProperty("--chat-border-glow-y", `${y}px`);
    event.currentTarget.style.setProperty("--chat-border-glow-opacity", "1");
  };

  const handleGlowLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--chat-border-glow-opacity", "0");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const currentInput = inputValue;
    let pendingBotMessageId: string | null = null;
    setInputValue("");
    setIsTyping(true);
    setStreamingMessageId(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: sessionId,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const errorMessage =
          typeof errorPayload?.error === "string"
            ? errorPayload.error
            : "Não foi possível enviar a mensagem.";
        throw new Error(errorMessage);
      }

      const responseContentType = response.headers.get("content-type") || "";
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "",
        sender: "bot",
        timestamp: new Date(),
      };
      pendingBotMessageId = botResponse.id;

      setMessages((prev) => [...prev, botResponse]);

      if (response.body && responseContentType.includes("text/event-stream")) {
        setIsTyping(false);
        setStreamingMessageId(botResponse.id);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let streamedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parsed = parseSseEvents(buffer);
          buffer = parsed.remaining;

          for (const rawEvent of parsed.events) {
            const event = readSseEvent(rawEvent);
            if (!event || !isRecord(event.data)) continue;

            if (event.event === "delta") {
              const delta = event.data.delta;
              if (typeof delta !== "string") continue;

              streamedText += delta;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === botResponse.id
                    ? { ...message, text: streamedText }
                    : message,
                ),
              );
            }

            if (event.event === "done") {
              const output = event.data.output;
              if (typeof output === "string" && output) {
                streamedText = output;
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === botResponse.id
                      ? { ...message, text: output }
                      : message,
                  ),
                );
              }
              setStreamingMessageId(null);
            }

            if (event.event === "error") {
              const message =
                typeof event.data.error === "string"
                  ? event.data.error
                  : "Falha ao processar a resposta.";
              throw new Error(message);
            }
          }
        }

        return;
      }

      const data: unknown = await response.json();
      const botText = extractBotText(data);
      setStreamingMessageId(null);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botResponse.id ? { ...message, text: botText } : message,
        ),
      );
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error sending message:", error);
      }
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Desculpe, ocorreu um erro ao processar sua mensagem: ${error instanceof Error ? error.message : "falha desconhecida"
          }`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) =>
        pendingBotMessageId
          ? prev.map((message) =>
              message.id === pendingBotMessageId ? errorResponse : message,
            )
          : [...prev, errorResponse],
      );
    } finally {
      setIsTyping(false);
      setStreamingMessageId(null);
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onPointerMove={handleGlowMove}
      onPointerLeave={handleGlowLeave}
      className="chat-border-glow flex h-[480px] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-card/80 shadow-2xl backdrop-blur-xl md:h-[580px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-layer-2 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/30 shadow-sm">
            <AvatarImage src="/assets/images/avatar-bot.webp" alt="" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-foreground text-sm">
              Edu Lima
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-success-subtle bg-success" />
              {t("chat.assistant")}
            </p>
          </div>
        </div>

      </div>

      {/* Messages */}
      <div
        ref={scrollAreaRef}
        className="flex-1 space-y-4 overflow-y-auto p-4"
      >
        {messages.map((msg) => {
          const isIntroMessage = INTRO_MESSAGE_IDS.includes(msg.id as (typeof INTRO_MESSAGE_IDS)[number]);
          const shouldHideSecondIntroMessage = msg.id === "2" && introPhase === 0;
          const shouldTypeFirstIntroMessage = msg.id === "1" && introPhase === 0;
          const shouldTypeSecondIntroMessage = msg.id === "2" && introPhase === 1;
          const isStreamingMessage = msg.sender === "bot" && msg.id === streamingMessageId;

          if (shouldHideSecondIntroMessage) return null;

          return (
            <motion.div
              key={msg.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "border border-border bg-layer-2 text-foreground rounded-bl-none"
                  }`}
              >
                {(shouldTypeFirstIntroMessage || shouldTypeSecondIntroMessage) ? (
                  <div className="mb-1">
                    <TypewriterText
                      text={msg.text}
                      shouldStart={!shouldReduceMotion}
                      onComplete={() => {
                        if (msg.id === "1") setIntroPhase(1);
                        if (msg.id === "2") setIntroPhase(2);
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-1">
                    {msg.text.split('\n').map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={i} className="h-2" />;

                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      return (
                        <div key={i} className="flex items-start gap-2 ml-1 mb-1">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                          <span>{trimmed.substring(2)}</span>
                        </div>
                      );
                    }

                    if (/^\d+\.\s/.test(trimmed)) {
                      const match = trimmed.match(/^(\d+\.)\s+(.*)/);
                      if (match) {
                        return (
                          <div key={i} className="flex items-start gap-2 ml-1 mb-1">
                            <span className="font-mono opacity-60 shrink-0">{match[1]}</span>
                            <span>{match[2]}</span>
                          </div>
                        );
                      }
                    }

                    if (isIntroMessage) {
                      return <div key={i} className="mb-1">{line}</div>;
                    }

                    return <div key={i} className="mb-1">{line}</div>;
                    })}
                    {isStreamingMessage && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 rounded-full bg-current opacity-70 motion-safe:animate-pulse" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex h-10 w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-none border border-border bg-card/80 p-3">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 motion-safe:animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 motion-safe:animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 motion-safe:animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border bg-layer-1 p-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("chat.placeholder")}
          aria-label={t("chat.inputLabel")}
          disabled={isResponding}
          className="bg-input-background"
        />
        <Button
          type="submit"
          size="icon-md"
          disabled={!inputValue.trim() || isResponding}
          aria-label={t("chat.send")}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};

