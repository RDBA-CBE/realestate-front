"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Search, ArrowRight, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Models from "@/imports/models.import";

interface Step {
  id: string;
  question: string;
  type: "single" | "multi" | "text";
  options: string[];
}



interface AppliedFilters { property_type?: string; city?: string; max_price?: string; furnishing?: string; amenities?: string; [key: string]: string | undefined; }

interface ApiResponse {
  done: boolean;
  message: string;
  step: Step;
  state: Record<string, any>;
  applied_filters?: AppliedFilters;
  results_count?: number;
  results?: any[];
}

interface BotMsg { role: "bot"; response: ApiResponse }
interface UserMsg { role: "user"; text: string }
type Message = BotMsg | UserMsg;

const suggestions = [
  "3BHK apartment in Chennai",
  "Villa under 2 Cr",
  "Commercial space in Coimbatore",
  "Affordable plots near Bangalore",
];

export default function AISearchComponent() {
  const router = useRouter();
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [freeInput, setFreeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [enterAreaMode, setEnterAreaMode] = useState(false);
  const [areaInput, setAreaInput] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "" });
  const [contactErrors, setContactErrors] = useState({ name: "", phone: "", email: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleResponse = (res: ApiResponse | ApiResponse[]) => {
    const items = Array.isArray(res) ? res : [res];
    setMessages((prev) => [...prev, ...items.map(r => ({ role: "bot" as const, response: r }))]);
    const last = items[items.length - 1];
    setState(last.state || {});
    const validStep = last.step && last.step.id ? last.step : null;
    setCurrentStep(validStep);
    setSelectedOptions([]);
    setTextInput("");
    setEnterAreaMode(false);
    setAreaInput("");
    if (last.done) setDone(true);
  };

  // Called when user submits from landing search box
  const startChat = async (query: string) => {
    const text = query.trim();
    if (!text || loading) return;
    setChatMode(true);
    setFreeInput("");
    setMessages([{ role: "user", text }]);
    setLoading(true);
    try {
      const res: any = await Models.chat.chats({ message: text });
      handleResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendOption = async (answer: string) => {
    if (!currentStep || loading) return;
    const newState = { ...state, [currentStep.id]: answer };
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    setCurrentStep(null);
    setLoading(true);
    try {
      const res: any = await Models.chat.chats({ step_id: currentStep.id, answer, state: newState });
      handleResponse(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const sendMulti = async () => {
    if (!currentStep || loading || selectedOptions.length === 0) return;
    const answer = selectedOptions.join(", ");
    const newState = { ...state, [currentStep.id]: selectedOptions };
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    setCurrentStep(null);
    setLoading(true);
    try {
      const res: any = await Models.chat.chats({ step_id: currentStep.id, answer, state: newState });
      handleResponse(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const sendText = async () => {
    const text = textInput.trim();
    if (!text || !currentStep || loading) return;
    const newState = { ...state, [currentStep.id]: text };
    setMessages((prev) => [...prev, { role: "user", text }]);
    setCurrentStep(null);
    setLoading(true);
    try {
      const res: any = await Models.chat.chats({ step_id: currentStep.id, answer: text, state: newState });
      handleResponse(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const validateContact = () => {
    const errs = { name: "", phone: "", email: "" };
    if (!contactForm.name.trim()) errs.name = "Name is required";
    if (!contactForm.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(contactForm.phone)) errs.phone = "Enter a valid 10-digit number";
    if (!contactForm.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) errs.email = "Enter a valid email";
    setContactErrors(errs);
    return !errs.name && !errs.phone && !errs.email;
  };

  // Submit all 3 contact fields sequentially
  const sendContactForm = async () => {
    if (!validateContact() || loading) return;
    const { name, phone, email } = contactForm;
    setContactSubmitted(true);
    setCurrentStep(null);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: `${name} · ${phone} · ${email}` }]);
    try {
      let curState = { ...state };
      // name
      curState = { ...curState, contact_name: name };
      let res: any = await Models.chat.chats({ step_id: "contact_name", answer: name, state: curState });
      // phone
      curState = { ...curState, contact_phone: phone };
      res = await Models.chat.chats({ step_id: "contact_phone", answer: phone, state: curState });
      // email
      curState = { ...curState, contact_email: email };
      res = await Models.chat.chats({ step_id: "contact_email", answer: email, state: curState });
      handleResponse(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const sendFreeMessage = async () => {
    const text = freeInput.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setFreeInput("");
    setLoading(true);
    try {
      const res: any = await Models.chat.chats({ message: text });
      handleResponse(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const toggleMulti = (opt: string) =>
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (!chatMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 gap-8">
        {/* Title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">
            AI <span className="text-themeColor1">Property Search</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md">
            Tell me what you&apos;re looking for and I&apos;ll guide you to the perfect property.
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
              onKeyDown={(e) => e.key === "Enter" && startChat(freeInput)}
              placeholder="e.g. 3BHK apartment in Chennai under 1 Cr..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => startChat(freeInput)}
              disabled={!freeInput.trim()}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-themeColor1 text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Search <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xl">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Try asking</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
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
    <div className="flex flex-col w-full max-w-2xl mx-auto" style={{ minHeight: "80vh" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-2 py-4 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm text-foreground">AI Property Assistant</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-5 flex flex-col gap-3">
        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div className="bg-sky-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[70%] break-words">
                  {msg.text}
                </div>
              </div>
            );
          }

          const { response } = msg;
          const lastBotIndex = messages.map((m, idx) => m.role === "bot" ? idx : -1).filter(x => x !== -1).pop();
          const isLastBot = i === lastBotIndex;
          const hasValidStep = !!response.step && !!response.step.id && !!response.step.type;
          const showOptions = hasValidStep && !response.done;
          const isActive = isLastBot && !response.done;

          return (
            <div key={i} className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex flex-col gap-2 w-full max-w-[85%]">
                {/* Message with markdown */}
                <div className="bg-muted border border-border text-foreground text-sm px-4 py-3 rounded-2xl rounded-tl-sm">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                    }}
                  >
                    {response.message}
                  </ReactMarkdown>
                </div>

                {/* View Properties button when done=true and has results */}
                {response.done && response.applied_filters && (response.results_count ?? 0) > 0 && (
                  <button
                    onClick={() => {
                      const f = response.applied_filters!;
                      const params = new URLSearchParams();
                      if (f.property_type) params.set("propertyType", f.property_type);
                      if (f.city) params.set("search", f.city);
                      if (f.max_price) params.set("maxPrice", f.max_price);
                      if (f.furnishing) params.set("furnishing", f.furnishing);
                      if (f.amenities) params.set("amenities", f.amenities);
                      router.push(`/property-list?${params.toString()}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ background: "#7a1010" }}
                  >
                    {/* ${response.results_count}  */}
                    <Building2 className="w-4 h-4" />
                    View {response.results_count === 1 ? "Property" : `Properties`}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Options panel — show on all, disable if not active */}
                { response.step && response.step.id && !response.done && (
                  <div className={!isActive ? "opacity-40 pointer-events-none select-none" : ""}>
                    {/* SINGLE — pill buttons */}
                    {response.step.type === "single" && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(!enterAreaMode || !isActive) ? (
                          response.step.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                if (!isActive) return;
                                if (opt === "Enter Area") { setEnterAreaMode(true); return; }
                                sendOption(opt);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                opt === "Skip"
                                  ? "border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-500"
                                  : opt === "Enter Area"
                                  ? "border-border text-muted-foreground hover:border-themeColor1 hover:text-themeColor1 bg-background"
                                  : "border-themeColor1/30 text-foreground hover:bg-themeColor1 hover:text-white bg-card"
                              }`}
                            >
                              {opt}
                            </button>
                          ))
                        ) : (
                          <div className="flex gap-2 w-full">
                            <input
                              type="text"
                              value={areaInput}
                              onChange={(e) => setAreaInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter" && areaInput.trim()) { sendOption(areaInput.trim()); setEnterAreaMode(false); setAreaInput(""); } }}
                              placeholder="Type your area..."
                              autoFocus
                              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-themeColor1 transition-colors placeholder:text-muted-foreground"
                            />
                            <button
                              onClick={() => { if (areaInput.trim()) { sendOption(areaInput.trim()); setEnterAreaMode(false); setAreaInput(""); } }}
                              disabled={!areaInput.trim()}
                              className="px-3 py-2 rounded-xl bg-themeColor1 text-white disabled:opacity-40"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* MULTI */}
                    {response.step.type === "multi" && (
                      <div className="bg-card border border-border rounded-2xl px-4 py-3 mt-1">
                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                          {response.step.options.map((opt) => (
                            <label key={opt} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedOptions.includes(opt)}
                                onChange={() => toggleMulti(opt)}
                                className="accent-themeColor1 w-3.5 h-3.5 shrink-0"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <button
                          onClick={sendMulti}
                          disabled={selectedOptions.length === 0}
                          className="mt-3 self-end px-4 py-1.5 rounded-xl bg-themeColor1 text-white text-xs font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
                        >
                          Confirm ({selectedOptions.length})
                        </button>
                      </div>
                    )}

                    {/* TEXT — contact group */}
                    {response.step.type === "text" && response.step.id === "contact_name" && (
                      <div className="bg-card border border-border rounded-2xl px-4 py-3 mt-1 flex flex-col gap-3">
                        {/* Name */}
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => { setContactForm((p) => ({ ...p, name: e.target.value })); setContactErrors((p) => ({ ...p, name: "" })); }}
                            placeholder="Full name"
                            className={`w-full bg-background border rounded-xl px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground ${contactErrors.name ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                          />
                          {contactErrors.name && <p className="text-xs text-red-500 pl-1">{contactErrors.name}</p>}
                        </div>
                        {/* Phone */}
                        <div className="flex flex-col gap-1">
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={contactForm.phone}
                            onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setContactForm((p) => ({ ...p, phone: v })); setContactErrors((p) => ({ ...p, phone: "" })); }}
                            placeholder="Phone number (10 digits)"
                            className={`w-full bg-background border rounded-xl px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground ${contactErrors.phone ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                          />
                          {contactErrors.phone && <p className="text-xs text-red-500 pl-1">{contactErrors.phone}</p>}
                        </div>
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                          <input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => { setContactForm((p) => ({ ...p, email: e.target.value })); setContactErrors((p) => ({ ...p, email: "" })); }}
                            placeholder="Email address"
                            className={`w-full bg-background border rounded-xl px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground ${contactErrors.email ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                          />
                          {contactErrors.email && <p className="text-xs text-red-500 pl-1">{contactErrors.email}</p>}
                        </div>
                        <button
                          onClick={sendContactForm}
                          className="self-end px-4 py-2 rounded-xl bg-themeColor1 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
                        >
                          Submit <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* TEXT — single field */}
                    {response.step.type === "text" && response.step.id !== "contact_name" && (
                      <div className="bg-card border border-border rounded-2xl px-4 py-3 mt-1 flex gap-2">
                        <input
                          type="text"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendText()}
                          placeholder={response.step.question}
                          className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-themeColor1 transition-colors placeholder:text-muted-foreground"
                        />
                        <button
                          onClick={sendText}
                          disabled={!textInput.trim()}
                          className="px-3 py-2 rounded-xl bg-themeColor1 text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing dots */}
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

      {/* Free-text bar — only when last bot message is done with no step */}
      {(() => {
        const lastBot = [...messages].reverse().find(m => m.role === "bot") as BotMsg | undefined;
        return lastBot && !lastBot.response.step?.id && !loading;
      })() && (
        <div className="px-2 pb-4 pt-2 border-t border-border shrink-0">
          <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-themeColor1 transition-all">
            <input
              type="text"
              value={freeInput}
              onChange={(e) => setFreeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendFreeMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={sendFreeMessage}
              disabled={!freeInput.trim()}
              className="p-1.5 rounded-xl bg-themeColor1 text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
