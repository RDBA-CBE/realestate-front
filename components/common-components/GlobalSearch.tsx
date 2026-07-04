"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  MapPin,
  BedDouble,
  Mic,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Models from "@/imports/models.import";
import { formatPriceRange } from "@/utils/function.utils";

interface ConversationEntry {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessage {
  role: "user" | "bot";
  text?: string;
  response?: string;
  properties?: any[];
}

const QUICK_SUGGESTIONS = [
  { label: "3BHK in Chennai", emoji: "🏙️" },
  { label: "Villa under 2 Cr", emoji: "🏡" },
  { label: "Commercial in Coimbatore", emoji: "🏢" },
  { label: "Plots near Bangalore", emoji: "🌿" },
];

export default function GlobalSearch() {
  const router = useRouter();
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [freeInput, setFreeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"global" | "property">("property");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  const sendMessage = async (query: string) => {
    const text = query.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setFreeInput("");
    setLoading(true);
    setTimeout(() => inputRef.current?.focus(), 0);

    try {
      const res: any = await (mode === "global" ? Models.chat.global : Models.chat.global_property)({
        query: text,
        conversation_history: conversationHistory,
      });

      const botResponse: string = res?.response ?? "";
      const properties: any[] = res?.properties ?? [];
      const updatedHistory: ConversationEntry[] = res?.conversation_history ?? [
        ...conversationHistory,
        { role: "user", content: text },
        { role: "assistant", content: botResponse },
      ];

      setConversationHistory(updatedHistory);
      setMessages((prev) => [...prev, { role: "bot", response: botResponse, properties }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", response: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startChat = (query: string) => {
    setChatMode(true);
    sendMessage(query);
  };

  const reset = () => {
    setChatMode(false);
    setMessages([]);
    setConversationHistory([]);
    setFreeInput("");
  };

  const switchMode = (newMode: "global" | "property") => {
    if (newMode === mode) return;
    setMode(newMode);
    reset();
  };

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (!chatMode) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-dred/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-orange-400/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-2xl">
          {/* Mode Switch */}
          <div className="flex items-center rounded-xl border border-border overflow-hidden text-xs font-medium">
            <button
              onClick={() => setMode("property")}
              className={`px-4 py-2 transition-colors ${
                mode === "property" ? "bg-dred text-white" : "text-foreground hover:bg-muted"
              }`}
            >
              Property
            </button>
            <button
              onClick={() => setMode("global")}
              className={`px-4 py-2 transition-colors ${
                mode === "global" ? "bg-dred text-white" : "text-foreground hover:bg-muted"
              }`}
            >
              Global
            </button>
          </div>

          {/* Hero */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dred to-orange-500 flex items-center justify-center shadow-xl shadow-dred/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white animate-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-dred to-orange-500 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed">
              Describe what you&apos;re looking for in plain language — our AI will find the perfect match.
            </p>
          </div>

          {/* Search box */}
          <div className="w-full">
            <div className="flex items-center gap-3 bg-white dark:bg-card border border-border rounded-2xl px-5 py-4 shadow-xl shadow-black/5 focus-within:ring-2 focus-within:ring-dred/40 focus-within:border-dred/40 transition-all">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={freeInput}
                onChange={(e) => setFreeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && freeInput.trim() && startChat(freeInput)}
                placeholder="e.g. 2BHK apartment in Coimbatore under 50L..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
                autoFocus
              />
              <button
                onClick={() => freeInput.trim() && startChat(freeInput)}
                disabled={!freeInput.trim()}
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-dred to-orange-500 text-white text-sm font-semibold disabled:opacity-40 hover:shadow-lg hover:shadow-dred/30 transition-all"
              >
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-xs text-muted-foreground/60 uppercase tracking-[0.15em] font-medium">
              Popular searches
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => startChat(s.label)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-white dark:bg-card text-sm text-foreground hover:border-dred hover:text-dred hover:shadow-md hover:shadow-dred/10 transition-all"
                >
                  <span>{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CHAT MODE ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-white/80 dark:bg-card/80 backdrop-blur-md shrink-0">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="text-foreground w-4 h-4" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-dred to-orange-500 flex items-center justify-center shadow-md shadow-dred/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground leading-tight">AI Property Assistant</span>
          <span className="text-[11px] text-green-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-border overflow-hidden text-xs font-medium">
            <button
              onClick={() => switchMode("property")}
              className={`px-3 py-2 transition-colors ${
                mode === "property"
                  ? "bg-dred text-white"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              Property
            </button>
            <button
              onClick={() => switchMode("global")}
              className={`px-3 py-2 transition-colors ${
                mode === "global"
                  ? "bg-dred text-white"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              Global
            </button>
          </div>
          <button
            onClick={reset}
            className="flex gap-1.5 items-center px-3.5 py-2 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5 bg-gray-50/50 dark:bg-background">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-dred to-orange-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white dark:bg-card border border-border text-foreground text-sm px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
              👋 Hi! I&apos;m your AI property assistant. Tell me what kind of property you&apos;re looking for and I&apos;ll help you find the perfect match!
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div className="bg-gradient-to-br from-dred to-orange-500 text-white text-sm px-4 py-3 rounded-2xl rounded-br-sm max-w-[75%] break-words shadow-md shadow-dred/20">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-dred to-orange-500 flex items-center justify-center mt-0.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex flex-col gap-3 max-w-[85%]">
                {msg.response && (
                  <div className="bg-white dark:bg-card border border-border text-foreground text-sm px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                        h3: ({ children }) => <h3 className="font-semibold text-foreground mt-3 mb-1">{children}</h3>,
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg border border-dred/20 bg-dred/5 text-dred text-xs font-medium hover:bg-dred/10 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.response}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Property Cards */}
                {msg.properties && msg.properties.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {msg.properties.map((p) => (
                      <Link
                        key={p.id}
                        href={`/property-detail/${p.slug}`}
                        className="group flex gap-0 bg-white dark:bg-card border border-border rounded-2xl overflow-hidden hover:border-dred/40 hover:shadow-lg hover:shadow-dred/10 transition-all"
                      >
                        <div className="relative w-28 h-28 shrink-0">
                          <Image
                            src={p.primary_image || "/placeholder.jpg"}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[10px] bg-dred text-white px-2 py-0.5 rounded-full font-medium shadow">
                            {p.listing_type === "sale" ? "For Sale" : "For Lease"}
                          </span>
                        </div>
                        <div className="flex flex-col justify-center px-3 py-2.5 gap-1 min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-dred transition-colors">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 shrink-0 text-dred/60" />
                            <span className="truncate">
                              {[p.area?.name, p.location?.name].filter(Boolean).join(", ")}
                            </span>
                          </div>
                          {p.bedrooms > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BedDouble className="w-3 h-3 shrink-0" />
                              <span>{p.bedrooms} BHK</span>
                            </div>
                          )}
                          <p className="text-xs font-bold text-dred mt-0.5">
                            ₹ {formatPriceRange(p.minimum_price, p.maximum_price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-dred to-orange-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white dark:bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1.5 items-center shadow-sm">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-dred/40 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 pb-5 pt-3 border-t border-border bg-white/80 dark:bg-card/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-muted border border-border rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-dred/30 focus-within:border-dred/40 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={freeInput}
            onChange={(e) => setFreeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(freeInput)}
            placeholder="Ask about properties..."
            autoFocus
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
          />
          <button
            onClick={() => sendMessage(freeInput)}
            disabled={!freeInput.trim() || loading}
            className="p-2 rounded-xl bg-gradient-to-br from-dred to-orange-500 text-white disabled:opacity-40 hover:shadow-md hover:shadow-dred/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[11px] text-muted-foreground/50 mt-2">
          AI-powered · Results may vary
        </p>
      </div>
    </div>
  );
}
