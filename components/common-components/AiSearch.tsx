"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Search, Sparkles, ChevronDown, ChevronUp, X, ArrowUpRight, Send } from "lucide-react";

const placeholders = [
  "Search for 3BHK apartments in Coimbatore...",
  "Find villas near the beach...",
  "Looking for affordable flats in Pune?",
  "Explore luxury penthouses in Delhi...",
  "Search properties with swimming pool...",
];

const suggestions = [
  { icon: "🏠", label: "Buy a Home" },
  { icon: "🏢", label: "Rent Apartment" },
  { icon: "🌆", label: "New Projects" },
  { icon: "💰", label: "Budget Homes" },
];

const capabilities = [
  {
    category: "Search by Location",
    items: [
      "Find properties in South Coimbatore",
      "Show me homes near metro stations",
      "Properties in Bandra under ₹2 Cr",
      "Gated communities in Whitefield, Coimbatore",
    ],
  },
  {
    category: "Filter by Type",
    items: [
      "3BHK apartments with parking",
      "Independent villas with garden",
      "Studio flats for rent in Pune",
      "Commercial spaces in Connaught Place",
    ],
  },
  {
    category: "Investment & Budget",
    items: [
      "Best areas for real estate investment in 2025",
      "Properties under ₹50 lakhs in Hyderabad",
      "High ROI rental properties in Chennai",
      "Affordable housing projects near IT parks",
    ],
  },
  {
    category: "Amenities & Lifestyle",
    items: [
      "Homes with swimming pool and gym",
      "Pet-friendly apartments in Delhi NCR",
      "Properties near top schools in Noida",
      "Sea-facing flats in Goa",
    ],
  },
];

type Message = { role: "user" | "ai"; text: string };

export default function AISearchComponent() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMode, setChatMode] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [listening, setListening] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const charIndexRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Typewriter placeholder effect (only in landing mode)
  useEffect(() => {
    if (chatMode) return;
    const current = placeholders[placeholderIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (isTyping) {
      if (charIndexRef.current < current.length) {
        timeout = setTimeout(() => {
          setDisplayedPlaceholder(current.slice(0, charIndexRef.current + 1));
          charIndexRef.current += 1;
        }, 45);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 1800);
      }
    } else {
      if (charIndexRef.current > 0) {
        timeout = setTimeout(() => {
          setDisplayedPlaceholder(current.slice(0, charIndexRef.current - 1));
          charIndexRef.current -= 1;
        }, 25);
      } else {
        setPlaceholderIndex((i) => (i + 1) % placeholders.length);
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayedPlaceholder, isTyping, placeholderIndex, chatMode]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const sendMessage = () => {
    const text = query.trim();
    if (!text) return;

    if (!chatMode) {
      setChatMode(true);
      setShowCapabilities(false);
    }

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuery("");
    setAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setAiTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `I found some great properties matching "${text}". Let me help you explore the best options available in your preferred location and budget.`,
        },
      ]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleSuggestion = (label: string) => {
    setQuery(label);
  };

  // ── CHAT MODE ──────────────────────────────────────────────────────────────
  if (chatMode) {
    return (
      <div className="flex flex-col w-full h-[80vh] max-w-2xl mx-auto relative">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
          {/* AI greeting */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-card border border-border px-4 py-3 text-sm">
              <p className="font-medium mb-2">Hello! I&apos;m your AI Property Assistant. How can I help you today?</p>
              <div className="rounded-xl bg-muted/60 px-4 py-3 text-muted-foreground text-sm">
                Please tell me what you&apos;re looking for — property type, location, budget, or any specific requirements.
              </div>
            </div>
          </div>

          {/* Conversation messages */}
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex items-end justify-end gap-2">
                <div className="max-w-[75%] rounded-2xl rounded-br-none bg-themeColor1 text-white px-4 py-3 text-sm">
                  {msg.text}
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-card border border-border px-4 py-3 text-sm">
                  {msg.text}
                </div>
              </div>
            )
          )}

          {/* AI typing indicator */}
          {aiTyping && (
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-card border border-border px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom search bar */}
        <div className="px-4 pb-4 pt-2 border-t border-border bg-background">
          <div className="flex items-center w-full rounded-2xl border border-border bg-card shadow-md px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-themeColor1 transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setListening((v) => !v)}
              className={`shrink-0 p-1.5 rounded-full transition-colors ${
                listening ? "bg-themeColor1 text-white" : "text-muted-foreground hover:text-themeColor1"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!query.trim()}
              className="shrink-0 p-1.5 rounded-full bg-themeColor1 text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LANDING MODE ───────────────────────────────────────────────────────────
  return (
    <div className="flex w-full min-h-[82vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 text-center">

        {/* Tagline */}
        <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground">
          <span className="h-px w-8 bg-border" />
          SMART. FAST. PERSONAL.
          <span className="h-px w-8 bg-border" />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-themeColor1" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              AI <span className="text-themeColor1">Search</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Find your perfect property with the power of AI.
          </p>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Suggested for you</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map(({ icon, label }) => (
              <button
                key={label}
                onClick={() => handleSuggestion(label)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm hover:border-themeColor1 hover:text-themeColor1 transition-colors"
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Explore more */}
        <button
          onClick={() => setShowCapabilities((v) => !v)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showCapabilities ? "Show fewer" : "Explore more capabilities"}
          {showCapabilities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Capabilities Panel */}
        {showCapabilities && (
          <div className="w-full rounded-2xl border border-border bg-card shadow-lg p-5 text-left relative">
            <button
              onClick={() => setShowCapabilities(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <h2 className="text-base font-semibold text-center mb-5">Explore more capabilities</h2>
            <div className="flex flex-col gap-4">
              {capabilities.map(({ category, items }) => (
                <div key={category} className="rounded-xl border border-border p-4 flex flex-col gap-2">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                    {category}
                  </p>
                  {items.map((item) => (
                    <button
                      key={item}
                      onClick={() => { setQuery(item); setShowCapabilities(false); }}
                      className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted text-sm text-left transition-colors group"
                    >
                      <span>{item}</span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search bar — sits naturally below content, centered with everything */}
        <div className="w-full">
          <div className="flex items-center w-full rounded-2xl border border-border bg-card shadow-md px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-themeColor1 transition-all">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={displayedPlaceholder}
              className="flex-1 bg-transparent outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setListening((v) => !v)}
              className={`shrink-0 p-1.5 rounded-full transition-colors ${
                listening ? "bg-themeColor1 text-white" : "text-muted-foreground hover:text-themeColor1"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!query.trim()}
              className="shrink-0 p-1.5 rounded-full bg-themeColor1 text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
