"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  capitalizeFLetter,
  Failure,
  formatPhoneNumber,
  Success,
  useSetState,
} from "@/utils/function.utils";
import Models from "@/imports/models.import";
import TextArea from "@/components/common-components/textArea";
import { Building2, CalendarCheck, Phone, X } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

interface ContactAgentFormProps {
  data: any;
  token: any;
  onClose: any;
  industryClick: any;
}

type InquiryMode = "none" | "callback" | "booking";

export default function ContactAgentForm({
  data,
  token,
  onClose,
  industryClick,
}: ContactAgentFormProps) {
  const [state, setState] = useSetState({
    inquiry: "",
    btnLoading: false,
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    userId:""
  });

  const router = useRouter()

  const [inquiryMode, setInquiryMode] = useState<InquiryMode | "done">("none");

  const [callbackForm, setCallbackForm] = useState({
    email: "",
    phone: "",
    message: "",
  });
  const [callbackErrors, setCallbackErrors] = useState({
    email: "",
    phone: "",
    message: "",
  });
  const [callbackLoading, setCallbackLoading] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    email: "",
    phone: "",
    message: "",
    date: "",
  });
  const [bookingErrors, setBookingErrors] = useState({ email: "", phone: "", date: "", message: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    profile();
    console.log("inquiryMode", inquiryMode);
  }, []);

  const profile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response: any = await Models.user.details(userId);
        console.log("response", response);
        setState({userId:userId});
        setCallbackForm({
          email: response?.email,
          phone: response?.phone,
          message: "",
        });
        setBookingForm({
          email: response?.email,
          phone: response?.phone,
          message: "",
          date: "",
        });
        // setState({
        //   first_name: response?.first_name,
        //   last_name: response?.last_name,
        //   phone: response?.phone,
        //   email: response?.email,
        // });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ btnLoading: true });
      const body = {
        assigned_to: data?.developer?.id,
        first_name: state.first_name,
        last_name: state.last_name,
        phone: state.phone,
        email: state.email,
        interested_property: [data?.id],
        lead_source: 1,
        status: 1,
        inquiry_detail: state.inquiry ? state.inquiry : "New Requirements",
        website: true,
      };
      await Models.lead.create(body);
      Success("Enquiry sent ! ");
      setState({
        btnLoading: false,
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        inquiry: "",
      });
    } catch (error) {
      if (error?.email?.length > 0) Failure(error?.email[0]);
      setState({ btnLoading: false });
    }
  };

  const withTokenSubmit = async () => {
    try {
      setState({ btnLoading: true });
      const userId = localStorage.getItem("userId");
      const response: any = await Models.user.details(userId);
      const body: any = {
        assigned_to: data?.developer?.id,
        first_name: response?.first_name,
        last_name: response?.last_name,
        email: response.email,
        interested_property: [data?.id],
        lead_source: 1,
        status: 1,
        inquiry_detail: state.inquiry ? state.inquiry : "New Requirements",
        website: true,
      };
      if (response.phone) body.phone = response.phone;
      await Models.lead.create(body);
      setState({
        btnLoading: false,
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        inquiry: "",
      });
      Success("Enquiry sent ! ");
    } catch (error) {
      if (error?.email?.length > 0) Failure(error?.email[0]);
      setState({ btnLoading: false });
    }
  };

  const submitCallback = async () => {
    try {
      setCallbackLoading(true);

      const errs = { email: "", phone: "", message: "" };
      // if (!callbackForm.email.trim()) {errs.email = "Email is required";  setCallbackLoading(false);}
      //  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(callbackForm.email)){
      //   errs.email = "Enter a valid email";  
      //   setCallbackLoading(false);}
      if (!callbackForm.phone.trim()){ errs.phone = "Phone is required";  setCallbackLoading(false);}
      else if (!/^[0-9]{10}$/.test(callbackForm.phone)){
        errs.phone = "Enter a valid 10-digit number"; 
       setCallbackLoading(false);
      }
      if (!callbackForm.message.trim()) { errs.message = "Inquiry details are required"; setCallbackLoading(false); }
      setCallbackErrors(errs);
      if (errs.email || errs.phone || errs.message) return;
      const payload = {
        property: data?.id ?? null,
        search: "",
        message: callbackForm.message,
        email: callbackForm.email,
        phone_number: callbackForm.phone,
        user_id:state.userId,
      };
      console.log("Callback Payload:", payload);

      const res: any = await Models.chat.callback(payload);
      console.log("Callback Response:", res);
      setInquiryMode("done");
      setCallbackLoading(false);
      setCallbackForm({ email: "", phone: "", message: "" });
      setCallbackErrors({ email: "", phone: "", message: "" });

      // TODO: replace with actual API call
    } catch (e) {
      setCallbackLoading(false);
      console.error(e);
    }
  };

  const submitBooking = async () => {
    try {
    setBookingLoading(true);

    const errs = { email: "", phone: "", date: "", message: "" };
    if (!bookingForm.email.trim()) {errs.email = "Email is required"; setBookingLoading(false);}
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email))
      {errs.email = "Enter a valid email"; setBookingLoading(false);}
    if (!bookingForm.phone.trim()){ errs.phone = "Phone is required"; setBookingLoading(false);}
    else if (!/^[0-9]{10}$/.test(bookingForm.phone))
     { errs.phone = "Enter a valid 10-digit number"; setBookingLoading(false);}
    if (!bookingForm.date.trim()){ errs.date = "Date is required"; setBookingLoading(false);}
    if (!bookingForm.message.trim()) { errs.message = "Inquiry details are required"; setBookingLoading(false); }
    setBookingErrors(errs);
    if (errs.email || errs.phone || errs.message) return;
    const payload = {
      property: data?.id ?? null,
      search: "",
      message: bookingForm.message,
      email: bookingForm.email,
      phone_number: bookingForm.phone,
      schedule_date_time:bookingForm?.date?moment(bookingForm?.date).format("YYYY-MM-DD HH:mm:ss"):null,
      user_id:state.userId,
    };
    const res: any = await Models.chat.booking_inquiry(payload);

    setInquiryMode("done");
    setBookingLoading(false);
    console.log("Booking Inquiry Payload:", payload);
    setBookingForm({ email: "", phone: "", message: "", date: "" });
    setBookingErrors({ email: "", phone: "", date: "", message: "" });
    } catch (e) {
    setBookingLoading(false);

      console.error(e);
    } 
  };

  const inputCls = (err: string) =>
    `w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground ${err ? "border-red-500" : "border-border focus:border-themeColor1"}`;

  return (
    <Card
      className={`rounded-2xl shadow-none border border-gray max-w-md mx-auto !bg-gray ${
        onClose ? "w-[500px]" : "me-0"
      }`}
    >
      {onClose && (
        <div className="w-100 text-right">
          <button onClick={onClose} className="px-5 pt-4">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <CardContent className={`p-6 space-y-6 ${onClose ? "pt-0" : ""}`}>
        {/* Agent info */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <div className="flex-shrink-0 cursor-pointer" onClick={()=> router.push(`/developer/${data?.developer?.id}`)}>
            {/* <Image
              src="/assets/images/real-estate/dummy.png"
              alt="Agent"
              width={60}
              height={60}
              className="rounded-full object-cover border-2 border-gray-200"
            /> */}
            {data?.developer?.developer_image ? (
              <div className="border border-gray rounded-xl h-16 w-16">
                <img
                  src={data?.developer?.developer_image}
                  alt={data?.developer?.industry || "Developer"}
                  
                  
                  className="object-contain position-center w-full h-full"
                />
              </div>
                
              ) : (
                <div className="flex h-full w-full items-center justify-center border-2 p-3 border-dred rounded-xl">
                  <Building2 className="h-10 w-10 text-dred " />
                </div>
              )}
          </div>
          <div className="text-left">
            <h3 className="font-semibold cursor-pointer" onClick={()=> router.push(`/developer/${data?.developer?.id}`)}>
              {capitalizeFLetter(data?.developer?.industry)}
            </h3>
            <p className="text-gray-600 text-sm">
              {capitalizeFLetter(data?.developer?.user_type)}
            </p>
            <p className="text-gray-800 font-medium mt-1">
              {formatPhoneNumber(data?.developer?.phone)}
            </p>
          </div>
        </div>

        {inquiryMode === "none" ? (
          <div className="flex flex-row gap-2">
            <button
              onClick={() => setInquiryMode("callback")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-xs font-medium text-foreground"
            >
              <Phone className="w-4 h-4 text-themeColor1 shrink-0" />
              Call Back
            </button>
            <button
              onClick={() => setInquiryMode("booking")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:border-themeColor1 hover:bg-themeColor1/5 transition-colors text-xs font-medium text-foreground"
            >
              <CalendarCheck className="w-4 h-4 text-themeColor1 shrink-0" />
              Booking Inquiry
            </button>
          </div>
        ) : inquiryMode === "done" ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-foreground">We&apos;ll be in touch soon!</p>
            <p className="text-xs text-muted-foreground text-center">
              Our team will reach out to you at the provided contact details.
            </p>
            <button
              onClick={() => { setInquiryMode("none"); if (onClose) onClose(); }}
              className="mt-1 px-4 py-2 rounded-xl text-white text-sm"
              style={{ background: "#7a1010" }}
            >
              Close
            </button>
          </div>
        ) : inquiryMode === "callback" ? (
          <div className="flex flex-col gap-3">
             <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-medium">
                Phone Number <span className="text-red-500">*</span>
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
                className={inputCls(callbackErrors.phone)}
              />
              {callbackErrors.phone && (
                <p className="text-xs text-red-500 pl-1">
                  {callbackErrors.phone}
                </p>
              )}
            </div>
            
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
                className={inputCls(callbackErrors.email)}
              />
              {callbackErrors.email && (
                <p className="text-xs text-red-500 pl-1">
                  {callbackErrors.email}
                </p>
              )}
            </div>
           
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-medium">
                Inquiry Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={callbackForm.message}
                onChange={(e) => {
                  setCallbackForm((p) => ({ ...p, message: e.target.value }));
                  setCallbackErrors((p) => ({ ...p, message: "" }));
                }}
                placeholder="Tell us more about your inquiry..."
                rows={3}
                className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground resize-none ${callbackErrors.message ? "border-red-500" : "border-border focus:border-themeColor1"}`}
              />
              {callbackErrors.message && (
                <p className="text-xs text-red-500 pl-1">{callbackErrors.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInquiryMode("none")}
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
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Preferred Date and Time <span className="text-red-500">*</span>
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
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={bookingForm.email}
                onChange={(e) => {
                  setBookingForm((p) => ({ ...p, email: e.target.value }));
                  setBookingErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder="Email address"
                className={inputCls(bookingErrors.email)}
              />
              {bookingErrors.email && (
                <p className="text-xs text-red-500 pl-1">
                  {bookingErrors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-medium">
                Phone Number <span className="text-red-500">*</span>
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
                className={inputCls(bookingErrors.phone)}
              />
              {bookingErrors.phone && (
                <p className="text-xs text-red-500 pl-1">
                  {bookingErrors.phone}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-medium">
                Inquiry Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={bookingForm.message}
                onChange={(e) => {
                  setBookingForm((p) => ({ ...p, message: e.target.value }));
                  setBookingErrors((p) => ({ ...p, message: "" }));
                }}
                placeholder="Tell us more about your inquiry..."
                rows={3}
                className={`w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground resize-none ${bookingErrors.message ? "border-red-500" : "border-border focus:border-themeColor1"}`}
              />
              {bookingErrors.message && (
                <p className="text-xs text-red-500 pl-1">{bookingErrors.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInquiryMode("none")}
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
      </CardContent>
    </Card>
  );
}
