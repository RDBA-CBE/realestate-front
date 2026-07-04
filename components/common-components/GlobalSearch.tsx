"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeft,
  RefreshCcw,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Models from "@/imports/models.import";

interface ConversationEntry {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessage {
  role: "user" | "bot";
  text?: string;
  response?: string;
}

const QUICK_SUGGESTIONS = [
  "3BHK apartment in Chennai",
  "Villa under 2 Cr",
  "Commercial space in Coimbatore",
  "Affordable plots near Bangalore",
];

export default function GlobalSearch() {
  const router = useRouter();
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [freeInput, setFreeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  const sendMessage = async (query: string) => {
    const text = query.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setFreeInput("");
    setLoading(true);
    setTimeout(() => inputRef.current?.focus(), 0);

    try {
      const res: any = await Models.chat.global({
        query: text,
        conversation_history: conversationHistory,
      });

      const botResponse: string = res?.response ?? "";
      const updatedHistory: ConversationEntry[] = res?.conversation_history ?? [
        ...conversationHistory,
        { role: "user", content: text },
        { role: "assistant", content: botResponse },
      ];

      setConversationHistory(updatedHistory);
      setMessages((prev) => [...prev, { role: "bot", response: botResponse }]);
    } catch (e) {
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

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (!chatMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">
            AI <span className="text-themeColor1">Property Search</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md">
            Tell me what you&apos;re looking for and I&apos;ll guide you to the
            perfect property.
          </p>
        </div>

        {/* Search box */}
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 shadow-md focus-within:ring-2 focus-within:ring-themeColor1 transition-all">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={freeInput}
              onChange={(e) => setFreeInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && freeInput.trim() && startChat(freeInput)
              }
              placeholder="e.g. apartment in Chennai under 1 Cr..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => freeInput.trim() && startChat(freeInput)}
              disabled={!freeInput.trim()}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-themeColor1 text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Search <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xl">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Try asking
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => startChat(s)}
                className="px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground hover:border-themeColor1 hover:text-themeColor1 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── CHAT MODE ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-2 py-4 border-b border-border shrink-0">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-dred w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm text-foreground">
          AI Property Assistant
        </span>
        <button
          onClick={reset}
          className="ml-auto flex gap-1 items-center px-3 py-1.5 rounded-xl bg-themeColor1 text-white text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCcw className="h-3 w-3" />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-5 pb-10 flex flex-col gap-4">
        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div className="bg-sky-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[75%] break-words">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-muted border border-border text-foreground text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm leading-relaxed">{children}</li>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-semibold text-foreground mt-3 mb-1">
                        {children}
                      </h3>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-xl border border-themeColor1/30 bg-themeColor1/5 text-themeColor1 text-xs font-medium hover:bg-themeColor1/10 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {children}
                      </a>
                    ),
                  }}
                >
                  {msg.response ?? ""}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-2 pb-4 pt-2 border-t border-border shrink-0">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-themeColor1 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={freeInput}
            onChange={(e) => setFreeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(freeInput)}
            placeholder="Type a message..."
            autoFocus
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={() => sendMessage(freeInput)}
            disabled={!freeInput.trim() || loading}
            className="p-1.5 rounded-xl bg-themeColor1 text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
