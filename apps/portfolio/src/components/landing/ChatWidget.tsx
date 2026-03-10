import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "@limia/design-system";
import { useLanguage } from "../language-provider";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

export const ChatWidget = () => {
  const { t } = useLanguage();

  // Inicializa mensagens carregando do localStorage ou usa o padrão
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Converte strings de data de volta para objetos Date
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error("Failed to parse messages", e);
      }
    }
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
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Inicializa Session ID do localStorage ou cria um novo
  const [sessionId] = useState(() => {
    const savedSession = localStorage.getItem("chat_session_id");
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

  // Salva o Session ID no localStorage
  useEffect(() => {
    localStorage.setItem("chat_session_id", sessionId);
  }, [sessionId]);

  // Salva as mensagens no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // Efeito para scrollar para o fundo sempre que mensagens mudarem ou status de digitação mudar
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

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
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: sessionId
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

      const data = await response.json();

      let botText = "Desculpe, não entendi a resposta do servidor.";

      // 1. Se for array (comportamento padrão do n8n às vezes), pega o primeiro item
      const responseData = Array.isArray(data) ? data[0] : data;

      // 2. Tenta extrair de campos comuns
      if (typeof responseData === 'string') {
        botText = responseData;
      } else if (typeof responseData === 'object' && responseData !== null) {
        // Tenta encontrar o campo de texto em várias propriedades possíveis
        const possibleContent = responseData.output || responseData.text || responseData.message || responseData.response || responseData.answer;

        if (typeof possibleContent === 'string') {
          botText = possibleContent;
        } else if (typeof possibleContent === 'object' && possibleContent !== null) {
          // Se o conteúdo for um objeto (ex: JSON dentro de 'output'), tenta extrair texto dele ou stringify
          botText = (possibleContent as any).text || (possibleContent as any).message || JSON.stringify(possibleContent, null, 2);
        } else {
          // Fallback: se não achou campos conhecidos, stringify do objeto todo (exceto se for vazio)
          botText = JSON.stringify(responseData, null, 2);
        }
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Desculpe, ocorreu um erro ao processar sua mensagem: ${error instanceof Error ? error.message : "falha desconhecida"
          }`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex h-[480px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-xl md:h-[580px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/30 shadow-sm">
            <AvatarImage src="/assets/images/avatar-bot.webp" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-foreground text-sm flex items-center gap-2">
              Edu Lima
              <span className="h-2.5 w-2.5 rounded-full border border-background bg-primary" />
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
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
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "border border-border bg-card/80 text-foreground rounded-bl-none"
                }`}
            >
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

                return <div key={i} className="mb-1">{line}</div>;
              })}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex h-10 w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-none border border-border bg-card/80 p-3">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border bg-muted/30 p-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("chat.placeholder")}
          className="bg-input-background"
        />
        <Button
          type="submit"
          size="icon-md"
          disabled={!inputValue.trim() || isTyping}
          aria-label={t("chat.send") || "Send message"}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};

