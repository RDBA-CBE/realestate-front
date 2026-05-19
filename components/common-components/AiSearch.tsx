"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Search,
  ArrowRight,
  Building2,
  MessageCircle,
  Phone,
  X,
  CalendarCheck,
  Eye,
  SendIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Models from "@/imports/models.import";
import { capitalizeFLetter } from "@/utils/function.utils";
import moment from "moment";

interface Step {
  id: string;
  question: string;
  type: "single" | "multi" | "text";
  options: string[];
}

interface AppliedFilters {
  property_type?: string;
  city?: string;
  max_price?: string;
  furnishing?: string;
  amenities?: string;
  [key: string]: string | undefined;
}

interface ApiResponse {
  done: boolean;
  message: string;
  step: Step;
  state: Record<string, any>;
  applied_filters?: AppliedFilters;
  results_count?: number;
  results?: any[];
}

interface BotMsg {
  role: "bot";
  response: ApiResponse;
}
interface UserMsg {
  role: "user";
  text: string;
}
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
  const [finalState, setFinalState] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    inquiryDetails: "",
  });
  const [contactErrors, setContactErrors] = useState({
    name: "",
    phone: "",
    email: "",
    inquiryDetails: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [inquiryPopup, setInquiryPopup] = useState<{
    propId: number;
    propTitle: string;
  } | null>(null);
  const [inquiryMode, setInquiryMode] = useState<
    "menu" | "callback" | "booking" | "done"
  >("menu");
  const [callbackForm, setCallbackForm] = useState({
    email: "",
    phone: "",
    message: "",
    user_id: "",
  });
  const [callbackErrors, setCallbackErrors] = useState({
    email: "",
    phone: "",
  });
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    email: "",
    phone: "",
    message: "",
    user_id: "",
  });
  const [bookingErrors, setBookingErrors] = useState({
    date: "",
    time: "",
    email: "",
    phone: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [profileData, setProfileData] = useState({ email: "", phone: "", id: "" });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, currentStep]);

  useEffect(() => {
    profile();
  }, []);

  const profile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response: any = await Models.user.details(userId);
        setProfileData({ email: response?.email ?? "", phone: response?.phone ?? "", id: response?.id ?? "" });
      }
    }
    catch (error) {
      console.log("error", error);
    }
  };

  const handleResponse = (res: any) => {
    console.log("Response:", res);
    const items = Array.isArray(res) ? res : [res];
    setMessages((prev) => [
      ...prev,
      ...items.map((r) => ({ role: "bot" as const, response: r })),
    ]);
    const last = items[items.length - 1];
    console.log("last", last);

    setState(last.state || {});
    const validStep = last.step && last.step.id ? last.step : null;
    setCurrentStep(validStep);
    setSelectedOptions([]);
    setTextInput("");
    setEnterAreaMode(false);
    setAreaInput("");
    setFinalState(res?.state);
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
      const res: any = await Models.chat.chats({
        step_id: currentStep.id,
        answer,
        state: newState,
      });
      handleResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMulti = async () => {
    if (!currentStep || loading || selectedOptions.length === 0) return;
    const answer = selectedOptions.join(", ");
    const newState = { ...state, [currentStep.id]: selectedOptions };
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    setCurrentStep(null);
    setLoading(true);
    try {
      const res: any = await Models.chat.chats({
        step_id: currentStep.id,
        answer,
        state: newState,
      });
      handleResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendText = async () => {
    const text = textInput.trim();
    if (!text || !currentStep || loading) return;
    const newState = { ...state, [currentStep.id]: text };
    setMessages((prev) => [...prev, { role: "user", text }]);
    setCurrentStep(null);
    setLoading(true);
    try {
      const res: any = await Models.chat.chats({
        step_id: currentStep.id,
        answer: text,
        state: newState,
      });
      handleResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const validateContact = () => {
    const errs = { name: "", phone: "", email: "", inquiryDetails: "" };
    if (!contactForm.name.trim()) errs.name = "Name is required";
    if (!contactForm.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(contactForm.phone))
      errs.phone = "Enter a valid 10-digit number";
    if (!contactForm.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email))
      errs.email = "Enter a valid email";
    if (!contactForm.inquiryDetails.trim())
      errs.inquiryDetails = "Inquiry details are required";
    setContactErrors(errs);
    return !errs.name && !errs.phone && !errs.email;
  };

  // Submit all 3 contact fields sequentially

  const sendContactForm = async (payload: any) => {
    try {
      const body = {
        contact_name: "",
        contact_phone: payload?.phone_number,
        contact_email: payload?.email,
      };

      let res: any = await Models.chat.chats(body);
      console.log("sendContactForm", res);
      setCurrentStep(null);
      if (!validateContact() || loading) return;
      setContactSubmitted(true);

      // setLoading(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: `${payload?.phone_number} · ${payload?.email} · Inquiry Details: ${payload?.message} `,
        },
      ]);
      // let curState = { ...state };
      // // name
      // curState = { ...curState, contact_name: name };
      // let res: any = await Models.chat.chats({ step_id: "contact_name", answer: name, state: curState });
      // // phone
      // curState = { ...curState, contact_phone: phone };
      // res = await Models.chat.chats({ step_id: "contact_phone", answer: phone, state: curState });
      // // email
      // curState = { ...curState, contact_email: email };
      // res = await Models.chat.chats({ step_id: "contact_email", answer: email, state: curState });
      handleResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMulti = (opt: string) =>
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );

  const submitBooking = async () => {
    try {
      setBookingLoading(true);

      const errs = { date: "", time: "", email: "", phone: "" };
      if (!bookingForm.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email))
        errs.email = "Enter a valid email";
      if (!bookingForm.phone.trim()) errs.phone = "Phone is required";
      else if (!/^[0-9]{10}$/.test(bookingForm.phone))
        errs.phone = "Enter a valid 10-digit number";
      setBookingErrors(errs);
      if (errs.email || errs.phone) return;

//       {
//   "property": 0,
//   "message": "string",
//   "search": "string",
//   "schedule_date_time": "2026-05-18T09:50:25.657Z",
//   "email": "user@example.com",
//   "phone_number": "1955656171208"
// }
      const payload = {
        property: inquiryPopup?.propId ?? null,
        search: finalState,
        message: capitalizeFLetter(bookingForm.message),
        email: bookingForm.email,
        phone_number: bookingForm.phone,
        schedule_date_time:bookingForm?.date?moment(bookingForm?.date).format("YYYY-MM-DD HH:mm:ss"):null,
      };
      console.log("Booking Inquiry Payload:", payload);
      let res: any = await Models.chat.booking_inquiry(payload);
    //  await  handleResponse(res);

      // console.log("Booking Inquiry Payload:", payload);
      setInquiryMode("done");
      setBookingLoading(false);
      await sendContactForm(payload);
      await profile();
      // TODO: replace with actual API call
    } catch (e) {
      setBookingLoading(false);

      console.error(e);
    }
  };

  const submitCallback = async () => {
    try {
      setCallbackLoading(true);

      const errs = { email: "", phone: "" };
      if (!callbackForm.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(callbackForm.email))
        errs.email = "Enter a valid email";
      if (!callbackForm.phone.trim()) errs.phone = "Phone is required";
      else if (!/^[0-9]{10}$/.test(callbackForm.phone))
        errs.phone = "Enter a valid 10-digit number";
      setCallbackErrors(errs);
      if (errs.email || errs.phone) return;

      const payload = {
        property: inquiryPopup?.propId ?? null,
        search: finalState,
        message: callbackForm.message,
        email: callbackForm.email,
        phone_number: callbackForm.phone,
      };
      console.log("Callback Payload:", payload);
      let res: any = await Models.chat.callback(payload);
      console.log("Callback Response:", res);
      setInquiryMode("done");
      await sendContactForm(payload);
      await profile();
      setCallbackLoading(false);

    } catch (e) {
      setCallbackLoading(false);

      console.error(e);
    }
  };

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
              onKeyDown={(e) => e.key === "Enter" && freeInput.trim().length >= 20 && startChat(freeInput)}
              placeholder="e.g. 3BHK apartment in Chennai under 1 Cr..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              autoFocus
              maxLength={20}
            
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
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Try asking
          </p>
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
    <div
      className="flex flex-col w-full max-w-2xl mx-auto pb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-2 py-4 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-themeColor1 to-orange-400 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm text-foreground">
          AI Property Assistant
        </span>
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
          const lastBotIndex = messages
            .map((m, idx) => (m.role === "bot" ? idx : -1))
            .filter((x) => x !== -1)
            .pop();
          const isLastBot = i === lastBotIndex;
          const hasValidStep =
            !!response.step && !!response.step.id && !!response.step.type;
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
                      p: ({ children }) => (
                        <p className="mb-1 last:mb-0">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {response.done &&
                    response.results &&
                    response.results.length > 0
                      ? response.message
                          .split("\n")
                          .filter((line: string) => {
                            const t = line.trim();
                            return (
                              !t.startsWith("**") &&
                              !t.includes("₹") &&
                              !response.results!.some((p: any) =>
                                t.includes(p.title),
                              )
                            );
                          })
                          .join("\n")
                          .trim()
                      : response.message}
                  </ReactMarkdown>
                </div>

                {/* Property results cards */}
                {response.done &&
                  response.results &&
                  response.results.length > 0 && (
                    <div className="flex flex-col gap-2 mt-1">
                      {response.results
                        .slice(0, visibleCount)
                        .map((prop: any) => {
                          const minPrice = parseFloat(prop.minimum_price);
                          const maxPrice = parseFloat(prop.maximum_price);
                          const formatPrice = (n: number) => {
                            if (n >= 10000000)
                              return `₹${(n / 10000000).toFixed(2)} Cr`;
                            if (n >= 100000)
                              return `₹${(n / 100000).toFixed(2)} L`;
                            return `₹${n.toLocaleString()}`;
                          };
                          const priceStr =
                            minPrice && maxPrice && minPrice !== maxPrice
                              ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                              : minPrice
                                ? formatPrice(minPrice)
                                : null;
                          return (
                            <div
                              key={prop.id}
                              className="flex gap-3 bg-card border border-border rounded-xl p-2.5 hover:border-themeColor1 transition-colors"
                            >
                              {prop.primary_image && (
                                <img
                                  src={prop.primary_image}
                                  alt={prop.title}
                                  onClick={() =>
                                    router.push(`/property-detail/${prop.id}`)
                                  }
                                  className="w-14 h-14 rounded-lg object-cover shrink-0 cursor-pointer"
                                />
                              )}
                              <div
                                className="flex flex-col justify-center gap-0.5 min-w-0 flex-1 cursor-pointer"
                                onClick={() =>
                                  router.push(`/property-detail/${prop.id}`)
                                }
                              >
                                <div className="text-sm font-semibold text-foreground truncate">
                                  {prop.title}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {prop.city}
                                  {prop.state ? `, ${prop.state}` : ""}
                                </div>
                                {priceStr && (
                                  <p className="text-xs font-medium text-themeColor1">
                                    {priceStr}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 self-center flex flex-row gap-1">
                                <button
                                  onClick={(e) => {
                                    console.log("View Property:", prop);
                                    e.stopPropagation();
                                    router.push(`/property-detail/${prop.id}`);
                                  }}
                                  className="p-1.5 rounded-full hover:bg-themeColor1/10 text-themeColor1 transition-colors"
                                  title="View Property"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInquiryPopup({
                                      propId: prop.id,
                                      propTitle: prop.title,
                                    });
                                    setInquiryMode("menu");
                                    setCallbackForm({ email: profileData.email, phone: profileData.phone, message: "", user_id: profileData.id });
                                    setCallbackErrors({ email: "", phone: "" });
                                    setBookingForm({ date: "", time: "", email: profileData.email, phone: profileData.phone, message: "", user_id: profileData.id });
                                    setBookingErrors({ date: "", time: "", email: "", phone: "" });
                                  }}
                                  className="p-1.5 rounded-full hover:bg-themeColor1/10 text-themeColor1 transition-colors"
                                  title="Inquiry"
                                >
                                  <SendIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                      {/* View More */}
                      {visibleCount < response.results.length && (
                        <button
                          onClick={() => setVisibleCount((c) => c + 6)}
                          className="w-full py-2 rounded-xl border border-border text-sm text-muted-foreground hover:border-themeColor1 hover:text-themeColor1 transition-colors"
                        >
                          View More ({response.results.length - visibleCount}{" "}
                          remaining)
                        </button>
                      )}

                      {/* View Properties button — only after all results visible */}
                      {visibleCount >= response.results.length &&
                        response.applied_filters && (
                          <>
                            <div className="flex flex-row gap-2">
                              <button
                                onClick={() => {
                                  setInquiryPopup({ propId: null, propTitle: "General Inquiry" });
                                  setInquiryMode("callback");
                                  setCallbackForm({ email: profileData.email, phone: profileData.phone, message: "", user_id: profileData.id });
                                  setCallbackErrors({ email: "", phone: "" });
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-xs font-medium text-foreground"
                              >
                                <Phone className="w-4 h-4 text-themeColor1 shrink-0" />
                                Call Back
                              </button>
                              <button
                                onClick={() => {
                                  setInquiryPopup({ propId: null, propTitle: "General Inquiry" });
                                  setInquiryMode("booking");
                                  setBookingForm({ date: "", time: "", email: profileData.email, phone: profileData.phone, message: "", user_id: profileData.id });
                                  setBookingErrors({ date: "", time: "", email: "", phone: "" });
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-xs font-medium text-foreground"
                              >
                                <CalendarCheck className="w-4 h-4 text-themeColor1 shrink-0" />
                                Booking Inquiry
                              </button>
                              <button
                                onClick={() => {
                                  const f = response.applied_filters!;
                                  const params = new URLSearchParams();
                                  if (f.property_type)
                                    params.set("propertyType", f.property_type);
                                  if (f.city) params.set("search", f.city);
                                  if (f.max_price)
                                    params.set("maxPrice", f.max_price);
                                  if (f.furnishing)
                                    params.set("furnishing", f.furnishing);
                                  if (f.amenities)
                                    params.set("amenities", f.amenities);
                                  router.push(
                                    `/property-list?${params.toString()}`,
                                  );
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                                style={{ background: "#7a1010" }}
                              >
                                <Building2 className="w-4 h-4 shrink-0" />
                                View{" "}
                                {response.results_count === 1
                                  ? "Property"
                                  : "Properties"}
                                <ArrowRight className="w-4 h-4 shrink-0" />
                              </button>
                            </div>
                          </>
                        )}
                    </div>
                  )}

                {/* Options panel — show on all, disable if not active */}
                {response.step && response.step.id && !response.done && (
                  <div
                    className={
                      !isActive
                        ? "opacity-40 pointer-events-none select-none"
                        : ""
                    }
                  >
                    {/* SINGLE — pill buttons */}
                    {response.step.type === "single" && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {!enterAreaMode || !isActive ? (
                          response.step.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                if (!isActive) return;
                                if (opt === "Enter Area") {
                                  setEnterAreaMode(true);
                                  return;
                                }
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
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && areaInput.trim()) {
                                  sendOption(areaInput.trim());
                                  setEnterAreaMode(false);
                                  setAreaInput("");
                                }
                              }}
                              placeholder="Type your area..."
                              autoFocus
                              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-themeColor1 transition-colors placeholder:text-muted-foreground"
                            />
                            <button
                              onClick={() => {
                                if (areaInput.trim()) {
                                  sendOption(areaInput.trim());
                                  setEnterAreaMode(false);
                                  setAreaInput("");
                                }
                              }}
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
                            <label
                              key={opt}
                              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                            >
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
                    {response.step.type === "text" &&
                      response.step.id === "contact_name" && (
                        <>
                          <div className="flex flex-row gap-2">
                            <button
                              onClick={() => {
                                setInquiryPopup({ propId: null, propTitle: "General Inquiry" });
                                setInquiryMode("callback");
                                setCallbackForm({ email: profileData.email, phone: profileData.phone, message: "", user_id: profileData.id });
                                setCallbackErrors({ email: "", phone: "" });
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-xs font-medium text-foreground"
                            >
                              <Phone className="w-4 h-4 text-themeColor1 shrink-0" />
                              Call Back
                            </button>
                            <button
                              onClick={() => {
                                setInquiryPopup({ propId: null, propTitle: "General Inquiry" });
                                setInquiryMode("booking");
                                setBookingForm({ date: "", time: "", email: profileData.email, phone: profileData.phone, message: "", user_id: profileData.id });
                                setBookingErrors({ date: "", time: "", email: "", phone: "" });
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-xs font-medium text-foreground"
                            >
                              <CalendarCheck className="w-4 h-4 text-themeColor1 shrink-0" />
                              Booking Inquiry
                            </button>
                            <button
                              onClick={() => {
                                console.log("sendContactForm", response);
                                const f = response.state;
                                const params = new URLSearchParams();
                                if (f.property_type)
                                  params.set("propertyType", f.property_type);
                                if (f.city) params.set("search", f.city);
                                if (f.max_price)
                                  params.set("maxPrice", f.max_price);
                                if (f.furnishing)
                                  params.set("furnishing", f.furnishing);
                                if (f.amenities)
                                  params.set("amenities", f.amenities);
                                router.push(
                                  `/property-list?${params.toString()}`,
                                );
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                              style={{ background: "#7a1010" }}
                              type="button"
                            >
                              <Building2 className="w-4 h-4 shrink-0" />
                              View{" "}
                              {response.results_count === 1
                                ? "Property"
                                : "Properties"}
                              <ArrowRight className="w-4 h-4 shrink-0" />
                            </button>
                          </div>
                        </>
                      )}

                    {/* TEXT — single field */}
                    {response.step.type === "text" &&
                      response.step.id !== "contact_name" && (
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
        const lastBot = [...messages]
          .reverse()
          .find((m) => m.role === "bot") as BotMsg | undefined;
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
      {/* Inquiry Popup */}
      {inquiryPopup && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4"
          onClick={() => setInquiryPopup(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground truncate pr-2">
                {inquiryPopup.propTitle}
              </p>
              <button
                onClick={() => setInquiryPopup(null)}
                className="shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {inquiryMode === "menu" && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setInquiryMode("booking")}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-sm font-medium text-foreground"
                >
                  <CalendarCheck className="w-4 h-4 text-themeColor1" />
                  Booking Inquiry
                </button>
                <button
                  onClick={() => setInquiryMode("callback")}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-sm font-medium text-foreground"
                >
                  <Phone className="w-4 h-4 text-themeColor1" />
                  Call Back
                </button>
              </div>
            )}

            {inquiryMode === "booking" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Preferred Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingForm.date}
                    onChange={(e) => {
                      setBookingForm((p) => ({ ...p, date: e.target.value }));
                      setBookingErrors((p) => ({ ...p, date: "" }));
                    }}
                    className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors ${bookingErrors.date ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                  />
                  {bookingErrors.date && (
                    <p className="text-xs text-red-500 pl-1">
                      {bookingErrors.date}
                    </p>
                  )}
                </div>
                {/* <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Preferred Time
                  </label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => {
                      setBookingForm((p) => ({ ...p, time: e.target.value }));
                      setBookingErrors((p) => ({ ...p, time: "" }));
                    }}
                    className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors ${bookingErrors.time ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                  >
                    <option value="">Select a time slot</option>
                    {[
                      "09:00 AM",
                      "10:00 AM",
                      "11:00 AM",
                      "12:00 PM",
                      "01:00 PM",

                      "02:00 PM",
                      "03:00 PM",
                      "04:00 PM",
                      "05:00 PM",
                      "06:00 PM",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {bookingErrors.time && (
                    <p className="text-xs text-red-500 pl-1">
                      {bookingErrors.time}
                    </p>
                  )}
                </div> */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => {
                      setBookingForm((p) => ({ ...p, email: e.target.value }));
                      setBookingErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="Email address"
                    className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground ${bookingErrors.email ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                  />
                  {bookingErrors.email && (
                    <p className="text-xs text-red-500 pl-1">
                      {bookingErrors.email}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={bookingForm.phone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setBookingForm((p) => ({ ...p, phone: v }));
                      setBookingErrors((p) => ({ ...p, phone: "" }));
                    }}
                    placeholder="Phone number (10 digits)"
                    className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground ${bookingErrors.phone ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                  />
                  {bookingErrors.phone && (
                    <p className="text-xs text-red-500 pl-1">
                      {bookingErrors.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Inquiry Details
                  </label>
                  <textarea
                    value={bookingForm.message}
                    onChange={(e) =>
                      setBookingForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell us more about your inquiry..."
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-themeColor1 transition-colors placeholder:text-muted-foreground resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      inquiryPopup?.propId === null
                        ? setInquiryPopup(null)
                        : setInquiryMode("menu")
                    }
                    className="flex-1 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:border-themeColor1 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={submitBooking}
                    disabled={bookingLoading}
                    className="flex-1 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                    style={{ background: "#7a1010" }}
                  >
                    {bookingLoading ? "Submitting..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}

            {inquiryMode === "callback" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={callbackForm.email}
                    onChange={(e) => {
                      setCallbackForm((p) => ({ ...p, email: e.target.value }));
                      setCallbackErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="Email address"
                    className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground ${callbackErrors.email ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                  />
                  {callbackErrors.email && (
                    <p className="text-xs text-red-500 pl-1">
                      {callbackErrors.email}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={callbackForm.phone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setCallbackForm((p) => ({ ...p, phone: v }));
                      setCallbackErrors((p) => ({ ...p, phone: "" }));
                    }}
                    placeholder="Phone number (10 digits)"
                    className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground ${callbackErrors.phone ? "border-red-500" : "border-border focus:border-themeColor1"}`}
                  />
                  {callbackErrors.phone && (
                    <p className="text-xs text-red-500 pl-1">
                      {callbackErrors.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Inquiry Details
                  </label>
                  <textarea
                    value={callbackForm.message}
                    onChange={(e) =>
                      setCallbackForm((p) => ({
                        ...p,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Tell us more about your inquiry..."
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-themeColor1 transition-colors placeholder:text-muted-foreground resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      inquiryPopup?.propId === null
                        ? setInquiryPopup(null)
                        : setInquiryMode("menu")
                    }
                    className="flex-1 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:border-themeColor1 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={submitCallback}
                    disabled={callbackLoading}
                    className="flex-1 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                    style={{ background: "#7a1010" }}
                  >
                    {callbackLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            )}

            {inquiryMode === "done" && (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  We&apos;ll call you back soon!
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Our team will reach out to you at the provided contact
                  details.
                </p>
                <button
                  onClick={() => setInquiryPopup(null)}
                  className="mt-1 px-4 py-2 rounded-xl text-white text-sm"
                  style={{ background: "#7a1010" }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
