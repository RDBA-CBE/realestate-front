"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Building2, Send, X, Bot, User, RotateCcw,
  MapPin, Home, TrendingUp, Phone, DollarSign,
  FileText, Search, ArrowRight, Wifi,
} from "lucide-react";
import Models from "@/imports/models.import";

const STORAGE_KEY = "re_chat_messages";
const SEEN_KEY = "re_chat_seen";

interface ChatMessage {
  id: number;
  role_name: "bot" | "users";
  message: string;
  reply: string;
  created_at: string;
}

const WELCOME: ChatMessage = {
  id: 1,
  role_name: "bot",
  message: "",
  reply:
    "Hello! Welcome to **Boom Realty**.\n\nI'm your personal property assistant. I can help you:\n- Find properties by **location** or **type**\n- Understand **pricing** & listings\n- Explore **buy**, **rent**, or **lease** options\n\nWhat are you looking for today?",
  created_at: new Date().toISOString(),
};

const QUICK_REPLIES = [
  { label: "Chennai Properties", icon: <MapPin size={12} /> },
  { label: "Apartments for Rent", icon: <Home size={12} /> },
  { label: "Villas for Sale", icon: <TrendingUp size={12} /> },
  { label: "Contact Agent", icon: <Phone size={12} /> },
];



function getBotReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("chennai"))
    return "**Chennai** has some of our finest listings — luxury apartments in Anna Nagar, beachside villas on ECR, and commercial spaces on OMR.\n\n[Browse Chennai Properties →](/property-list)";
  if (t.includes("rent") || t.includes("rental"))
    return "Looking to **rent**? We have premium apartments, independent houses, and commercial spaces across Tamil Nadu.\n\n[View Rental Listings →](/property-list)";
  if (t.includes("sale") || t.includes("buy") || t.includes("purchase"))
    return "Ready to **invest**? We have verified residential and commercial properties for sale with transparent pricing.\n\n[Browse Sale Properties →](/property-list)";
  if (t.includes("villa"))
    return "Luxury **villas** await! Private pools, landscaped gardens, and premium finishes across prime locations.\n\n[Browse Villas →](/property-list)";
  if (t.includes("apartment") || t.includes("flat"))
    return "We have **apartments** in all configurations — 1BHK to 4BHK — across prime city locations.\n\n[Browse Apartments →](/property-list)";
  if (t.includes("agent") || t.includes("contact"))
    return "Our expert agents are ready to help!\n\n**Email:** info@boomrealtys.com\n**Phone:** +91 98765 43210\n\nOr submit an enquiry on any property page.";
  if (t.includes("price") || t.includes("cost") || t.includes("budget"))
    return "We have properties across all budgets! Use our **price range filter** to narrow your search.\n\n[Search by Budget →](/property-list)";
  if (t.includes("lease"))
    return "Looking for a **lease**? We have long-term lease options for residential and commercial properties.\n\n[View Lease Listings →](/property-list)";
  if (t.includes("coimbatore"))
    return "**Coimbatore** is a great choice! Apartments, villas, and commercial spaces in prime areas like RS Puram and Peelamedu.\n\n[Browse Coimbatore →](/property-list)";
  if (t.includes("hello") || t.includes("hi") || t.includes("hey"))
    return "Hello! Great to have you here. I'm ready to help you find your dream property. What are you looking for?";
  if (t.includes("thank"))
    return "You're most welcome! Feel free to reach out anytime. Happy house hunting!";
  return "I can assist with **property searches**, **pricing**, **rent/sale/lease**, or connecting you with an **agent**.\n\nTry: *\"Apartments for rent in Chennai\"* or *\"Villas for sale\"*";
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function BotBubble({ msg }: { msg: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2.5"
    >
      {/* Bot avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-5 shadow-sm"
        style={{ background: "linear-gradient(135deg,#7a0c07,#9b0f09)" }}
      >
        <Bot size={14} className="text-white" />
      </div>

      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[78%]">
        <span className="text-[11px] text-gray-400 font-medium ml-0.5">Assistant</span>
        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 text-[13.5px] text-gray-700 leading-relaxed shadow-sm border border-gray-100">
          <ReactMarkdown
            components={{
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
              li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
              ul: ({ children }) => <ul className="my-1.5 space-y-0.5">{children}</ul>,
              a: ({ href, children }) => (
                <a href={href} className="inline-flex items-center gap-1 text-[#9b0f09] font-medium hover:text-red-900 no-underline hover:underline">
                  {children} <ArrowRight size={11} />
                </a>
              ),
            }}
          >
            {msg.reply}
          </ReactMarkdown>
        </div>
        <span className="text-[10px] text-gray-400 ml-0.5">{formatTime(msg.created_at)}</span>
      </div>
    </motion.div>
  );
}

function UserBubble({ msg }: { msg: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2.5 flex-row-reverse"
    >
      {/* User avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-5 shadow-sm"
        style={{ background: "#9b0f09" }}
      >
        <User size={14} className="text-white" />
      </div>

      <div className="flex flex-col gap-1 items-end max-w-[85%] sm:max-w-[78%]">
        <span className="text-[11px] text-gray-400 font-medium mr-0.5">You</span>
        <div
          className="rounded-2xl rounded-br-sm px-4 py-3 text-[13.5px] text-white leading-relaxed"
          style={{ background: "#9b0f09" }}
        >
          {msg.message}
        </div>
        <span className="text-[10px] text-gray-400 mr-0.5">{formatTime(msg.created_at)}</span>
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2.5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ background: "linear-gradient(135deg,#7a0c07,#9b0f09)" }}
      >
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-gray-300 block"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [propertyTypes, setPropertyTypes] = useState([]);


  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetchPropertyTypes();
  }, []);
  
  const fetchPropertyTypes = async () => {
    try {
      const res: any = await Models.category.list(1, {});
      setPropertyTypes(res?.results || []);
    } catch (error) {
      console.log("Error fetching property types:", error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setMessages(JSON.parse(stored)); } catch { setMessages([WELCOME]); }
    } else {
      setMessages([WELCOME]);
    }
    if (!localStorage.getItem(SEEN_KEY)) {
      setTimeout(() => setOpen(true), 1500);
      localStorage.setItem(SEEN_KEY, "1");
    }
  }, []);

  useEffect(() => {
    if (messages.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput("");
    setSending(true);
    setMessages((p) => [...p, {
      id: Date.now(), role_name: "users", message: msg, reply: "", created_at: new Date().toISOString(),
    }]);
    setTimeout(() => {
      setMessages((p) => [...p, {
        id: Date.now() + 1, role_name: "bot", message: "", reply: getBotReply(msg), created_at: new Date().toISOString(),
      }]);
      setSending(false);
    }, 900);
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* ── Floating button ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-[9998] w-14 h-14 rounded-[30px] shadow-2xl flex items-center justify-center text-white"
            style={{ background: "linear-gradient(145deg,#b81209,#9b0f09)" }}
          >
            <Building2 size={22} strokeWidth={1.8} />
            {/* WiFi signal rings */}
            <span className="absolute inset-0 rounded-[30px] animate-ping opacity-20" style={{ background: "#9b0f09" }} />
            <span className="absolute inset-[-6px] rounded-[36px]  opacity-30 animate-pulse" />
            <span className="absolute inset-[-13px] rounded-[43px]  opacity-15 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/40"
            style={{ backdropFilter: "blur(3px)", touchAction: "none" }}
          />
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[9999] flex flex-col shadow-2xl"
            style={{ width: isMobile ? "100vw" : 420 }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 sm:px-5 py-4 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6b0a06 0%, #9b0f09 60%, #b81209 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <Building2 size={18} className="text-white" strokeWidth={1.8} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#9b0f09]" />
                </div>
                <div>
                  <div className="font-semibold text-white text-[15px] leading-tight">Property Assistant</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Wifi size={10} className="text-emerald-300" />
                    <span className="text-[11px] text-emerald-300 font-medium">Online · Boom Realty</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3"
              style={{ background: "#f4f6f9" }}
            >
              {/* Date divider */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {messages.map((msg) =>
                msg.role_name === "bot"
                  ? <BotBubble key={msg.id} msg={msg} />
                  : <UserBubble key={msg.id} msg={msg} />
              )}
              {sending && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* ── Quick replies ── */}
            {messages.length <= 2 && !sending && (
              <div className="px-3 sm:px-4 py-3 flex flex-wrap gap-2 border-t border-gray-200 bg-white">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => handleSend(q.label)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-600 bg-gray-50 hover:bg-red-50 hover:border-red-200 hover:text-[#9b0f09] transition-all duration-150 font-medium shadow-sm"
                  >
                    <span className="text-[#9b0f09]">{q.icon}</span>
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input ── */}
            <div className="bg-white border-t border-gray-200 px-3 sm:px-4 pt-3 pb-4 sm:pb-5 flex-shrink-0">
              {!token && (
                <div className="mb-2.5 px-3 py-2 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center gap-1.5">
                  <User size={11} className="text-[#9b0f09]" />
                  <span className="text-[11px] text-[#9b0f09]">
                    <a href="/login" className="font-semibold hover:underline">Login</a>
                    {" "}to save your conversation history
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-gray-200 bg-gray-50 focus-within:border-[#9b0f09] focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
                <Search size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message here..."
                  disabled={sending}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || sending}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${input.trim() && !sending
                      ? "text-white shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  style={input.trim() && !sending
                    ? { background: "linear-gradient(135deg,#7a0c07,#9b0f09)" }
                    : {}
                  }
                >
                  <Send size={14} />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2 tracking-wide">
                Boom Realty · AI Property Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
