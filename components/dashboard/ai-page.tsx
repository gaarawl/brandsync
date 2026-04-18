"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  Trash2,
  Mail,
  TrendingUp,
  DollarSign,
  Lightbulb,
  FileText,
  MessageSquare,
} from "lucide-react";
import AIRateCard from "@/components/dashboard/ai-rate-card";
import AIBriefParser from "@/components/dashboard/ai-brief-parser";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Summary = {
  brandsCount: number;
  brandsList: string;
  collabsCount: number;
  collabsList: string;
  totalRevenue: number;
  pendingCount: number;
  pendingAmount: number;
  overdueCount: number;
  deadlines: string;
  userName: string;
};

const quickActions = [
  {
    icon: Mail,
    label: "Email de prospection",
    prompt: "R\u00E9dige un email professionnel de prospection pour une marque que je souhaite contacter pour une collaboration.",
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: DollarSign,
    label: "N\u00E9gocier un tarif",
    prompt: "Comment n\u00E9gocier un meilleur tarif avec une marque ? Donne-moi des arguments concrets bas\u00E9s sur mes stats.",
    color: "text-green-400 bg-green-500/10",
  },
  {
    icon: TrendingUp,
    label: "Analyser mes stats",
    prompt: "Analyse mes statistiques et donne-moi des conseils concrets pour am\u00E9liorer mes revenus.",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Lightbulb,
    label: "Id\u00E9es de contenu",
    prompt: "Propose-moi 5 id\u00E9es de contenu originales pour attirer de nouvelles marques partenaires.",
    color: "text-yellow-400 bg-yellow-500/10",
  },
  {
    icon: FileText,
    label: "Relance paiement",
    prompt: "R\u00E9dige un email de relance poli mais ferme pour un paiement en retard.",
    color: "text-orange-400 bg-orange-500/10",
  },
  {
    icon: MessageSquare,
    label: "Brief cr\u00E9atif",
    prompt: "Aide-moi \u00E0 r\u00E9diger un brief cr\u00E9atif pour une collaboration sponsoris\u00E9e sur Instagram.",
    color: "text-pink-400 bg-pink-500/10",
  },
];

type TabType = "chat" | "tarifs" | "brief";

const tabs: { key: TabType; label: string; icon: typeof MessageSquare }[] = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "tarifs", label: "Tarifs", icon: DollarSign },
  { key: "brief", label: "Brief", icon: FileText },
];

export default function AIChatPage({ summary }: { summary: Summary }) {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ used: 0, limit: 10, plan: "free", remaining: 10 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch usage on mount
  useEffect(() => {
    fetch("/api/ai/usage")
      .then((r) => r.json())
      .then((data) => setUsage(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    if (usage.remaining <= 0) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: msg },
        {
          role: "assistant",
          content: usage.plan === "free"
            ? "Tu as atteint ta limite de 10 messages/jour sur le plan gratuit. Passe au plan Pro pour 200 messages/jour !"
            : "Tu as atteint ta limite de messages pour aujourd'hui.",
        },
      ]);
      setInput("");
      return;
    }

    const userMsg: Message = { role: "user", content: msg };
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

      if (res.status === 429) {
        const data = await res.json();
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
        setUsage((u) => ({ ...u, remaining: 0, used: u.limit }));
        return;
      }

      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
      if (data.usage) {
        setUsage({
          used: data.usage.used,
          limit: data.usage.limit,
          plan: data.usage.plan,
          remaining: Math.max(data.usage.limit - data.usage.used, 0),
        });
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "D\u00E9sol\u00E9, une erreur est survenue. R\u00E9essaie dans un instant." },
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

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-page-ai">
      {/* Header */}
      <div className="border-b border-border-subtle px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">BrandSync AI</h1>
              <p className="text-xs text-text-muted">
                Ton assistant pour g&eacute;rer tes collaborations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "chat" && messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-xs text-text-secondary hover:bg-bg-elevated transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Nouvelle conversation
              </button>
            )}
            <div className="flex items-center gap-2 rounded-lg bg-bg-elevated px-3 py-2">
              <span className="text-xs text-text-muted">
                {usage.remaining}/{usage.limit} messages
              </span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                usage.plan === "business"
                  ? "bg-amber-500/15 text-amber-500"
                  : usage.plan === "pro"
                  ? "bg-accent/15 text-accent"
                  : "bg-text-muted/15 text-text-muted"
              }`}>
                {usage.plan === "business" ? "BUSINESS" : usage.plan === "pro" ? "PRO" : "FREE"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs — distinct card-style with strong active gradient */}
        <div className="mt-4 flex items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: isActive ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold border transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 text-white border-violet-400/40 shadow-[0_8px_28px_-6px_rgba(139,92,246,0.55),inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "bg-bg-elevated/50 border-border-subtle text-text-muted hover:border-accent/40 hover:bg-bg-elevated hover:text-text-primary"
                }`}
              >
                <tab.icon
                  className={`h-4 w-4 ${
                    isActive ? "text-white" : "text-accent/70"
                  }`}
                />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tarifs tab */}
      {activeTab === "tarifs" && <AIRateCard />}

      {/* Brief tab */}
      {activeTab === "brief" && <AIBriefParser />}

      {/* Chat area */}
      {activeTab === "chat" && <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 mb-4">
                <Bot className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Salut {summary.userName} !
              </h2>
              <p className="text-sm text-text-muted max-w-md">
                Je suis ton assistant IA. Je connais tes {summary.brandsCount} marques,
                tes {summary.collabsCount} collaborations et tes revenus.
                Pose-moi n&apos;importe quelle question !
              </p>
            </motion.div>

            {/* Context cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-3 mb-8 w-full max-w-lg"
            >
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-accent">{summary.brandsCount}</p>
                <p className="text-[11px] text-text-muted mt-1">Marques</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-accent">{summary.collabsCount}</p>
                <p className="text-[11px] text-text-muted mt-1">Collabs</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {summary.totalRevenue.toLocaleString("fr-FR")}&euro;
                </p>
                <p className="text-[11px] text-text-muted mt-1">Revenus</p>
              </div>
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl"
            >
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className="flex flex-col items-center gap-2.5 rounded-xl border border-border-subtle bg-bg-surface p-4 hover:bg-bg-elevated hover:border-accent/30 transition-all text-center group"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                    {action.label}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Messages */
          <div className="px-6 py-6 space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 mt-0.5">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-bg-primary rounded-br-md"
                      : "bg-bg-surface border border-border-subtle text-text-primary rounded-bl-md"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="bg-bg-surface border border-border-subtle rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">R&eacute;flexion en cours...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>}

      {/* Input */}
      {activeTab === "chat" && <div className="border-t border-border-subtle px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 rounded-xl border border-border-subtle bg-bg-surface px-4 py-3 focus-within:border-accent/50 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Demande-moi n'importe quoi..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none max-h-32"
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2 text-center">
            Entr&eacute;e pour envoyer &middot; Shift+Entr&eacute;e pour un saut de ligne
          </p>
        </div>
      </div>}
    </main>
  );
}
