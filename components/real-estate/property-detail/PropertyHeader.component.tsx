"use client";

import {
  Heart,
  Share2,
  Copy,
  Printer,
  Bed,
  Bath,
  Square,
  GitCompareArrowsIcon,
  BedDouble,
  Verified,
  Clock,
  Phone,
  CalendarCheck,
  FileDown,
  Building2,
  X,
  Download,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  capitalizeFLetter,
  Failure,
  formatNumber,
  formatPriceRange,
  formattedNoDecimal,
  formatToINR,
  Success,
  TimeAgo,
  useSetState,
  isPlotProperty,
  formatToINRS,
  formatIndianNumber,
} from "@/utils/function.utils";
import { useEffect, useState } from "react";
import Models from "@/imports/models.import";
import { RWebShare } from "react-web-share";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs, { Dayjs } from "dayjs";

export default function PropertyHeader(props: any) {
  const [state, setState] = useSetState({
    is_compare: false,
    url : ''
  });

  const router = useRouter();

   const [loginPopup, setLoginPopup] = useState(false);

  const { data, updateList } = props;
  const mobileLayout = props.mobileLayout ?? false;
  const isPlot =
    isPlotProperty(data) ||
    (Array.isArray(data?.property_type) &&
      data.property_type.some(
        (propertyType: any) =>
          propertyType?.name?.toLowerCase().trim() === "plot"
      ));
  console.log("data",data)

   useEffect(() => {
    setState({url:window.location.href});
  }, []);

  useEffect(() => {
    const compareList = localStorage.getItem("compare");
    if (compareList?.length > 0) {
      if (compareList.includes(data?.id)) {
        setState({ is_compare: true });
      } else {
        setState({ is_compare: false });
      }
    }
  }, [data]);

  const handleWishList = async () => {
      // e.stopPropagation();
      // e.preventDefault();
      const token = localStorage.getItem("demo_token");
      if (!token) { setLoginPopup(true); return; }
      try {
       if (!data?.user_wishlists) {
          await Models.wishlist.add_property({
            property_id: data?.id,
          });
          updateList();
          Success("Added to your wishlist !");
        } else {
          await Models.wishlist.remove_property({
            property_id: data?.id,
          });
          updateList();
          Success("Removed from your wishlist !");
        }
      } catch (err) { console.log(err); }
    };

    const LoginPopup = loginPopup ? (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center" onClick={() => setLoginPopup(false)}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 bg-[#fff6f6] rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-[#9b0f09]" />
        </div>
        <h3 className="text-lg font-bold text-black mb-2">Login Required</h3>
        <p className="text-gray-500 text-sm mb-6">Please sign in to save properties to your wishlist.</p>
        <div className="flex gap-3">
          <button onClick={() => setLoginPopup(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={() => { setLoginPopup(false); router.push("/login"); }} className="flex-1 bg-[#9b0f09] text-white py-2.5 rounded-xl font-medium hover:bg-[#7d0c07]">Sign In</button>
        </div>
      </div>
    </div>
  ) : null;

  const handleWishLis = async () => {
    try {
      const token = localStorage.getItem("demo_token");
      if (token) {
        if (!data?.user_wishlists) {
          await Models.wishlist.add_property({
            property_id: data?.id,
          });
          updateList();
          Success("Added to your wishlist !");
        } else {
          await Models.wishlist.remove_property({
            property_id: data?.id,
          });
          updateList();
          Success("Removed from your wishlist !");
        }
      } else {
        Failure("Please log in to add properties to your wishlist!");
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleCompareList = () => {
    try {
      const propertyId = data?.id;
      const compareList = JSON.parse(localStorage.getItem("compare") || "[]");

      let updatedList = [];
      if (compareList.includes(propertyId)) {
        updatedList = compareList.filter((id: string) => id !== propertyId);
        Success("Removed from your compare list !");
      } else {
        Success("Added to your compare list !");

        updatedList = [...compareList, propertyId];
      }

      localStorage.setItem("compare", JSON.stringify(updatedList));

      const compares = localStorage.getItem("compare");
      if (compares?.length > 0) {
        const is_compared = compares?.includes(data?.id);
        setState({ is_compare: is_compared });
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };


  

  // ── Inquiry modal state ──────────────────────────────────────────────────
  type InquiryMode = "none" | "enquire" | "callback" | "booking" | "done";
  const [inquiryMode, setInquiryMode] = useState<InquiryMode>("none");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ email: "", phone: "", message: "" });
  const [callbackErrors, setCallbackErrors] = useState({ email: "", phone: "", message: "" });
  const [bookingForm, setBookingForm] = useState<{ email: string; phone: string; message: string; date: Dayjs | null }>({ email: "", phone: "", message: "", date: null });
  const [bookingErrors, setBookingErrors] = useState({ email: "", phone: "", date: "", message: "" });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    setUserId(uid);
    Models.user.details(uid).then((res: any) => {
      setCallbackForm((p) => ({ ...p, email: res?.email || "", phone: res?.phone || "" }));
      setBookingForm((p) => ({ ...p, email: res?.email || "", phone: res?.phone || "" }));
    }).catch(() => {});
  }, []);

  const inputCls = (err: string) =>
    `w-full bg-white border rounded-xl px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${err ? "border-red-500" : "border-gray-300 focus:border-dred"}`;

  const withTokenSubmit = async () => {
    try {
      setInquiryLoading(true);
      const res: any = await Models.user.details(userId);
      const body: any = {
        assigned_to: data?.developer?.id,
        first_name: res?.first_name,
        last_name: res?.last_name,
        email: res?.email,
        interested_property: [data?.id],
        lead_source: 1, status: 1,
        inquiry_detail: "New Requirements",
        website: true,
      };
      if (res?.phone) body.phone = res.phone;
      await Models.lead.create(body);
      Success("Enquiry sent!");
      setInquiryMode("done");
    } catch (e: any) {
      if (e?.email?.length) Failure(e.email[0]);
    } finally { setInquiryLoading(false); }
  };

  const submitCallback = async () => {
    const errs = { email: "", phone: "", message: "" };
    if (!callbackForm.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(callbackForm.phone)) errs.phone = "Enter a valid 10-digit number";
    if (!callbackForm.message.trim()) errs.message = "Inquiry details are required";
    setCallbackErrors(errs);
    if (errs.phone || errs.message) return;
    try {
      setInquiryLoading(true);
      await Models.chat.callback({ property: data?.id ?? null, search: "", message: callbackForm.message, email: callbackForm.email, phone_number: callbackForm.phone, user_id: userId });
      setInquiryMode("done");
      setCallbackForm({ email: "", phone: "", message: "" });
    } catch (e) { console.error(e); } finally { setInquiryLoading(false); }
  };

  const submitBooking = async () => {
    const errs = { email: "", phone: "", date: "", message: "" };
    if (!bookingForm.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) errs.email = "Enter a valid email";
    if (!bookingForm.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(bookingForm.phone)) errs.phone = "Enter a valid 10-digit number";
    if (!bookingForm.date) errs.date = "Date is required";
    if (!bookingForm.message.trim()) errs.message = "Inquiry details are required";
    setBookingErrors(errs);
    if (errs.email || errs.phone || errs.date || errs.message) return;
    try {
      setInquiryLoading(true);
      await Models.chat.booking_inquiry({ property: data?.id ?? null, search: "", message: bookingForm.message, email: bookingForm.email, phone_number: bookingForm.phone, schedule_date_time: bookingForm.date?.format("YYYY-MM-DD HH:mm:ss"), user_id: userId });
      setInquiryMode("done");
      setBookingForm({ email: "", phone: "", message: "", date: null });
    } catch (e) { console.error(e); } finally { setInquiryLoading(false); }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className=" mt-5 md:mt-0 ">
      <div className="flex flex-row items-between md:items-start justify-between gap-4">
        <div className="space-y-2 md:w-[70%]">
        <div className="flex items-center flex-wrap gap-2 md:gap-3 text-sm text-gray-600 ">
            {/* <span>{`${capitalizeFLetter(data?.area?.name)} , ${capitalizeFLetter(
              data?.location?.name
            )} `}</span> */}
            <span className="rounded-full px-4 py-1 bg-dred text-white flex items-center gap-1  font-medium">
              ● For {capitalizeFLetter(data?.listing_type)}
            </span>

            {data?.rera_number && <span className="flex items-center gap-1 rounded-full px-4 py-1 border bg-white">
              <Verified className="w-4 h-4 text-dred"/> RERA Approved
            </span>}

            <span className="flex items-center gap-1 rounded-full px-4 py-1 border bg-white">
              <Clock className="w-4 h-4 text-dred" /> {TimeAgo(data?.created_at)}
            </span>

            
            {/* <span className="flex items-center gap-1">🔗 8721</span> */}
          </div>
          <h1 className={mobileLayout ? "section-ti !text-[22px] !font-bold !mt-4" : "!text-[28px] section-ti !font-bold !mt-4"}>{data?.title}</h1>
          {data?.developer?.industry &&
          <p>By <span className="text-dred cursor-pointer" onClick={()=> router.push(`/developer/${data?.developer?.slug}`)}>{data?.developer?.industry} </span></p>
        }
          <p className="text-black leading-relaxed " style={{wordBreak:"break-all"}}>{capitalizeFLetter(data?.address)}</p>
          <a
            href={data?.location_url || "#"}
            target="_blank"
            className="text-sm text-dred hover:underline font-medium flex gap-2"
          >
            <MapPin className="w-3.5 h-3.5 text-red mt-0.5"/> View on Map
          </a>
          {/* <div className="block sm:hidden">
            <span className="section-in-ti">
              {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </span>
           
          </div> */}
          


            <p className={` mb-2 !text-dred !font-bold ${mobileLayout ? "block section-ti !text-[24px]" : "block sm:hidden section-ti !text-[28px]"}`}>
             ₹ {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </p>
            {isPlot ? (
              data?.price_per_cent && (
                <span className={mobileLayout ? "block" : "block sm:hidden"}>
                  <p className="text-[14px] text-black mb-0">
                    Approx ₹ {formatIndianNumber(data?.price_per_cent)} / cent
                  </p>
                </span>
              )
            ) : (
              data?.price_per_sqft && (
                <span className={mobileLayout ? "block" : "block sm:hidden"}>
                  <p className="text-[14px] text-black mb-0">
                    Approx ₹ {(data?.price_per_sqft)} / sq.ft
                  </p>
                </span>
              )
            )}

          {/* <div className="flex flex-wrap items-center gap-2 xs:gap-6 text-gray-700 pt-2">
            <div className="flex items-center gap-1  py-0.5 rounded-md">
               {data.floor_plans && data.floor_plans.length > 0 && (
               <span className="flex items-center gap-1 text-dred border border-dred px-3 rounded-md"><BedDouble className="w-4 h-4 text-dred" />   {`${[
                        ...new Set(
                          data.floor_plans.map((floor_plan: any) =>
                            floor_plan.category?.match(/\d+/)?.[0]
                          )
                        ),
                      ].join(", ")} BHK Appartment`}</span>
            )}
            </div>
           
            <div className="flex items-center gap-1 text-dred border border-dred px-3 rounded-md">
              <Square size={18} className="text-dred" />{" "}
              <span className="text-dred">{(data?.built_up_area)} sqft</span>
            </div>
          </div> */}
        </div>

        {/* Right side */}
        <div className={`flex flex-col items-end justify-end gap-1 ${mobileLayout ? "hidden" : "hidden sm:block"}`}>
         
         
            <p className=" text-2xl 2xl:text-3xl font-bold mb-1 !text-dred pt-2 text-right pb-1">
              ₹ {formatPriceRange(
                data?.price_range?.minimum_price,
                data?.price_range?.maximum_price
              )}{" "}
            </p>
            {isPlot ? (
              data?.price_per_cent && (
                <span className="">
                  <p className="text-[16px] text-black text-right mb-0">
                    Approx ₹ {formatIndianNumber(data?.price_per_cent)} / cent
                  </p>
                </span>
              )
            ) : (
              data?.price_per_sqft && (
                <span className="">
                  <p className="text-[16px] text-black text-right mb-0">
                    Approx ₹ {(data?.price_per_sqft)} / sq.ft
                  </p>
                </span>
              )
            )}
        

           <div className="flex items-center justify-end gap-2 mt-3">
            <Button
              onClick={() => handleWishList()}
              size="icon"
              variant="outline"
              className={`rounded-full ${
                data?.user_wishlists
                  ? "bg-color2 border-dred !text-white hover:bg-color2 hover: border-[#9b0f09]"
                  : "bg-white text-dred border-dred hover:text-dred"
              }`}
            >
              <Heart
                size={18}
                fill={data?.user_wishlists ? "currentColor" : "none"}
              />
            </Button>

            <Button
              onClick={() => handleCompareList()}
              size="icon"
              variant="outline"
              className={`rounded-full ${
                state?.is_compare
                  ? "bg-color2 border-dred !text-white hover:bg-green-600 hover:bg-[#9b0f09]"
                  : "bg-white text-dred border-dred hover:text-dred"
              }`}
            >
              <GitCompareArrowsIcon size={18} />
            </Button>
            <RWebShare
              data={{
                title: "Karpagam Institute Of Technology",
                text: `Check this out!`,
                url: state.url,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button size="icon" variant="outline" className="rounded-full text-dred border-dred hover:border-dred hover:text-dred" >
                <Share2 size={18} />
              </Button>
            </RWebShare>

            {/* <Button size="icon" variant="outline" className="rounded-full">
            <Printer size={18} />
          </Button> */}
          </div>
        </div>
      </div>
      {LoginPopup}

      {/* ── Mobile action buttons (below price, hidden on sm+) ─────────────── */}
      <div className={`mt-4 ${mobileLayout ? "block" : "block sm:hidden"}`}>
        <div className="flex items-center gap-2 flex-wrap">
         
          {/* Call Back */}
          <button
            onClick={() => setInquiryMode("callback")}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-gray-300 bg-dred text-white text-sm font-medium text-black"
          >
            <Phone className="w-3.5 h-3.5" /> Call Back
          </button>

          {/* Booking Inquiry */}
          <button
            onClick={() => setInquiryMode("booking")}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-black hover:bg-dred hover:text-white"
          >
            <CalendarCheck className="w-3.5 h-3.5" /> Booking Inquiry
          </button>
        </div>

        {/* Download Brochure */}
        {data?.voucher_url && (
          <button
            onClick={() => window.open(data.voucher_url, "_blank", "noopener,noreferrer")}
            className="mt-4 flex items-center gap-1.5 text-sm text-gray-600 font-medium"
          >
            <Download className="w-4 h-4 text-dred" /> Download Brochure
          </button>
        )}
      </div>

      {/* ── Inquiry bottom sheet modal ────────────────────────────────────── */}
      <AnimatePresence>
        {inquiryMode !== "none" && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[9998]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInquiryMode("none")}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col rounded-t-3xl bg-white shadow-2xl max-h-[90vh]"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Developer logo */}
                  {data?.developer?.developer_image ? (
                    <div className="border border-gray-200 rounded-xl h-12 w-12 flex-shrink-0 overflow-hidden">
                      <img
                        src={data.developer.developer_image}
                        alt={data.developer.industry || "Developer"}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center border-2 border-dred rounded-xl h-12 w-12 flex-shrink-0">
                      <Building2 className="h-6 w-6 text-dred" />
                    </div>
                  )}
                  {/* Developer name + sheet title */}
                  <div>
                    {data?.developer?.industry && (
                      <p className="text-xs text-gray-500 font-medium leading-tight">
                        {data.developer.industry}
                      </p>
                    )}
                    <h2 className="text-base font-semibold text-gray-900 leading-tight">
                      {inquiryMode === "enquire" ? "Enquire Now" : inquiryMode === "callback" ? "Request Call Back" : inquiryMode === "booking" ? "Booking Inquiry" : "Thank You!"}
                    </h2>
                  </div>
                </div>
                <button onClick={() => setInquiryMode("none")} className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-5 space-y-4"
                onTouchMove={(e) => e.stopPropagation()}>

                {/* ── Done state ── */}
                {inquiryMode === "done" && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-semibold">We'll be in touch soon!</p>
                    <p className="text-xs text-gray-500 text-center">Our team will reach out at the provided contact details.</p>
                    <button onClick={() => setInquiryMode("none")} className="mt-2 px-5 py-2 rounded-xl bg-dred text-white text-sm font-medium">Close</button>
                  </div>
                )}

                {/* ── Enquire Now ── */}
                {inquiryMode === "enquire" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Send a quick enquiry about this property and our team will get back to you.</p>
                    <button
                      onClick={withTokenSubmit}
                      disabled={inquiryLoading}
                      className="w-full py-3 rounded-xl bg-dred text-white text-sm font-medium disabled:opacity-50"
                    >
                      {inquiryLoading ? "Sending..." : "Send Enquiry"}
                    </button>
                  </div>
                )}

                {/* ── Call Back ── */}
                {inquiryMode === "callback" && (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" inputMode="numeric" value={callbackForm.phone}
                        onChange={(e) => { setCallbackForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })); setCallbackErrors((p) => ({ ...p, phone: "" })); }}
                        placeholder="10-digit phone number" className={inputCls(callbackErrors.phone)} />
                      {callbackErrors.phone && <p className="text-xs text-red-500">{callbackErrors.phone}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Email</label>
                      <input type="email" value={callbackForm.email}
                        onChange={(e) => { setCallbackForm((p) => ({ ...p, email: e.target.value })); setCallbackErrors((p) => ({ ...p, email: "" })); }}
                        placeholder="Email address" className={inputCls(callbackErrors.email)} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Inquiry Details <span className="text-red-500">*</span></label>
                      <textarea value={callbackForm.message} rows={3}
                        onChange={(e) => { setCallbackForm((p) => ({ ...p, message: e.target.value })); setCallbackErrors((p) => ({ ...p, message: "" })); }}
                        placeholder="Tell us about your inquiry..." className={`${inputCls(callbackErrors.message)} resize-none`} />
                      {callbackErrors.message && <p className="text-xs text-red-500">{callbackErrors.message}</p>}
                    </div>
                    <button onClick={submitCallback} disabled={inquiryLoading}
                      className="w-full py-3 rounded-xl bg-dred text-white text-sm font-medium disabled:opacity-50">
                      {inquiryLoading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                )}

                {/* ── Booking Inquiry ── */}
                {inquiryMode === "booking" && (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Preferred Date & Time <span className="text-red-500">*</span></label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDateTimePicker value={bookingForm.date} disablePast
                          onChange={(val) => { setBookingForm((p) => ({ ...p, date: val })); setBookingErrors((p) => ({ ...p, date: "" })); }}
                          slotProps={{ textField: { size: "small", placeholder: "Select date and time", sx: { width: "100%", "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "14px", border: bookingErrors.date ? "1px solid #ef4444" : "1px solid #d1d5db", "& fieldset": { border: "none" } }, "& .MuiInputBase-input": { padding: "8px 12px" } } } }}
                        />
                      </LocalizationProvider>
                      {bookingErrors.date && <p className="text-xs text-red-500">{bookingErrors.date}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Email <span className="text-red-500">*</span></label>
                      <input type="email" value={bookingForm.email}
                        onChange={(e) => { setBookingForm((p) => ({ ...p, email: e.target.value })); setBookingErrors((p) => ({ ...p, email: "" })); }}
                        placeholder="Email address" className={inputCls(bookingErrors.email)} />
                      {bookingErrors.email && <p className="text-xs text-red-500">{bookingErrors.email}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" inputMode="numeric" value={bookingForm.phone}
                        onChange={(e) => { setBookingForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })); setBookingErrors((p) => ({ ...p, phone: "" })); }}
                        placeholder="10-digit phone number" className={inputCls(bookingErrors.phone)} />
                      {bookingErrors.phone && <p className="text-xs text-red-500">{bookingErrors.phone}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Inquiry Details <span className="text-red-500">*</span></label>
                      <textarea value={bookingForm.message} rows={3}
                        onChange={(e) => { setBookingForm((p) => ({ ...p, message: e.target.value })); setBookingErrors((p) => ({ ...p, message: "" })); }}
                        placeholder="Tell us about your inquiry..." className={`${inputCls(bookingErrors.message)} resize-none`} />
                      {bookingErrors.message && <p className="text-xs text-red-500">{bookingErrors.message}</p>}
                    </div>
                    <button onClick={submitBooking} disabled={inquiryLoading}
                      className="w-full py-3 rounded-xl bg-dred text-white text-sm font-medium disabled:opacity-50">
                      {inquiryLoading ? "Submitting..." : "Confirm Booking"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {LoginPopup}
    </div>
  );
}
