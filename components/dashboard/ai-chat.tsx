"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Loader2, Trash2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Désolé, une erreur est survenue. Réessaie." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "Rédige un email de relance pour un paiement en retard",
    "Comment négocier un meilleur tarif avec une marque ?",
    "Analyse mes stats et donne-moi des conseils",
    "Aide-moi à fixer mes tarifs selon mon audience",
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/25 hover:bg-accent-glow transition-all hover:scale-105"
      >
        {open ? (
          <X className="h-6 w-6 text-bg-primary" />
        ) : (
          <Bot className="h-6 w-6 text-bg-primary" />
        )}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 flex w-[400px] max-h-[600px] flex-col rounded-2xl border border-border-subtle bg-bg-surface shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    BrandSync AI
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Assistant pour créateurs
                  </p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Effacer la conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[300px] max-h-[420px]">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-3">
                      <Bot className="h-6 w-6 text-accent" />
                    </div>
                    <p className="text-sm font-medium text-text-primary">
                      Comment puis-je t&apos;aider ?
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Je connais tes marques, collabs et paiements.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setInput(s);
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        className="w-full text-left rounded-lg border border-border-subtle px-3 py-2.5 text-xs text-text-secondary hover:bg-bg-elevated hover:border-accent/30 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-accent text-bg-primary rounded-br-md"
                          : "bg-bg-elevated text-text-primary rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-bg-elevated rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Réflexion en cours...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border-subtle px-4 py-3">
              <div className="flex items-end gap-2 rounded-xl border border-border-subtle bg-bg-primary px-3 py-2 focus-within:border-accent/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écris ton message..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none max-h-20"
                  style={{ minHeight: "24px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-2 text-center">
                BrandSync AI peut faire des erreurs. V&eacute;rifie les infos importantes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
