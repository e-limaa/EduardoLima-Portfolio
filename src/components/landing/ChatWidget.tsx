import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { Button } from "@antigravity/ds";
import { Input } from "@antigravity/ds";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


// URL do Webhook do n8n - Substitua pela sua URL de produção
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "YOUR_N8N_WEBHOOK_URL_HERE";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatWidget = () => {
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
        text: "Olá! Bem-vindo ao meu portfólio.",
        sender: "bot",
        timestamp: new Date(),
      },
      {
        id: "2",
        text: "Pergunte qualquer coisa sobre meu trabalho, processo criativo ou experiência.",
        sender: "bot",
        timestamp: new Date(),
      },
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Inicializa Session ID do localStorage ou cria um novo
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("chat_session_id") ||
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
      // Verificar se a URL do webhook está configurada
      if (WEBHOOK_URL === "YOUR_N8N_WEBHOOK_URL_HERE") {
        // Simulação caso o webhook não esteja configurado
        setTimeout(() => {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "O Chat está configurado para n8n, mas a URL do Webhook ainda não foi definida no código.",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botResponse]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const response = await fetch(WEBHOOK_URL, {
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
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log('n8n response:', data); // Debug para ver a estrutura retornada

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
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.",
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
      className="w-full max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px] md:h-[580px]"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <AvatarImage src="/assets/images/avatar-bot.webp" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-black"></span>
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">Edu Lima</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              AI Assistant
            </p>
          </div>
        </div>

      </div>

      {/* Messages */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent"
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
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-white/90 rounded-bl-none border border-zinc-200 dark:border-white/5"
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
            <div className="bg-zinc-100 dark:bg-white/10 p-3 rounded-2xl rounded-bl-none border border-zinc-200 dark:border-white/5 flex gap-1 items-center h-10 w-16 justify-center">
              <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-white/50 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="bg-white dark:bg-black/20 border-zinc-200 dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/30 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50"
        />
        <Button
          type="submit"
          size="icon-md"
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          disabled={!inputValue.trim() || isTyping}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};
