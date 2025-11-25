import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import exampleImage from 'figma:asset/fe1addf78ff4776eb2ba01a20bd652eabe95c942.png';

// URL do Webhook do n8n - Substitua pela sua URL de produção
const WEBHOOK_URL = "https://n8n.elimaj.com.br/webhook/40af2497-91cb-4f71-ad2c-d4a61abb5e7a";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Bem-vindo ao meu portfólio.",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Pergunte qualquer coisa sobre meu trabalho, processo criativo ou disponibilidade.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gerar um Session ID único quando o componente montar
    const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
  }, []);

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
      
      // Tenta extrair a mensagem de diferentes formatos comuns de resposta do n8n
      const botText = data.text || data.message || data.output || data.response || "Desculpe, não entendi a resposta do servidor.";

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
      className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px] md:h-[580px]"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <AvatarImage src={exampleImage} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-black"></span>
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">Edu - AI Assistant</h3>
            <p className="text-xs text-white/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white/10 text-white/90 rounded-bl-none border border-white/5"
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
             <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center h-10 w-16 justify-center">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
             </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50"
        />
        <Button 
            type="submit" 
            size="icon" 
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
            disabled={!inputValue.trim() || isTyping}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};
