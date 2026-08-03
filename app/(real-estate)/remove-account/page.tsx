"use client";

import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Mail, Phone, RefreshCw, ShieldCheck } from "lucide-react";
import Models from "@/imports/models.import";
import { clearAuthData } from "@/store/slice/AuthSlice";
import { Failure, Success } from "@/utils/function.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OTP_DURATION_SECONDS = 900; // 15 minutes

const errorMessage = (error: any) =>
  error?.detail || error?.message || error?.email?.[0] || error?.otp?.[0] || "Something went wrong. Please try again.";

export default function RemoveAccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"details" | "verify">("details");
  const [secondsRemaining, setSecondsRemaining] = useState(OTP_DURATION_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step !== "verify" || secondsRemaining <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, secondsRemaining]);

  const sendOtp = async (isResend = false) => {
    try {
      if (isResend) setIsResending(true);
      else setIsSubmitting(true);
      await Models.auth.request_account_removal_otp({ email, phone, reason_text: reason });
      setSecondsRemaining(OTP_DURATION_SECONDS);
      setOtp("");
      if (!isResend) setStep("verify");
      Success(isResend ? "A new OTP has been sent to your email." : "OTP sent to your email address.");
    } catch (error) {
      Failure(errorMessage(error));
    } finally {
      setIsSubmitting(false);
      setIsResending(false);
    }
  };

  const handleDetailsSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly) nextErrors.phone = "Enter your phone number.";
    else if (digitsOnly.length !== 10) nextErrors.phone = "Phone number must be exactly 10 digits.";
    if (!reason.trim()) nextErrors.reason = "Tell us why you want to remove your account.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    await sendOtp();
  };

  const clearClientData = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(clearAuthData());
  };

  const handleVerifyAndRemove = async (event: FormEvent) => {
    event.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: "Enter the OTP sent to your email." });
      return;
    }
    try {
      setIsSubmitting(true);
      setErrors({});
      const response: any = await Models.auth.verify_account_removal_otp({ email, otp: otp.trim() });
      clearClientData();
      Success(response?.message || response?.detail || "Your account has been removed.");
      router.replace("/");
    } catch (error) {
      Failure(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeLabel = `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#fff] px-4 py-12 sm:px-6 flex justify-center items-center">
      <div className="mx-auto w-full h-fit max-w-xl rounded-2xl border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5 sm:p-9">
        <button
          type="button"
          onClick={() => (step === "verify" ? setStep("details") : router.back())}
          disabled={step === "verify" && secondsRemaining > 0}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#9b0f09] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {step === "details" ? (
          <form onSubmit={handleDetailsSubmit} className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-50 p-3 text-[#9b0f09]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Remove your account</h1>
                <p className="mt-1 text-sm text-gray-600">
                  This action is permanent. We&apos;ll send a verification code before removing your account.
                </p>
              </div>
            </div>

            <Input
              title="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setErrors((v) => ({ ...v, email: "" })); }}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            <Input
              title="Phone Number"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) => { setPhone(event.target.value.replace(/[^0-9+\-\s()]/g, "")); setErrors((v) => ({ ...v, phone: "" })); }}
              placeholder="+1 234 567 8900"
              error={errors.phone}
              required
            />

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium text-gray-900">
                Reason for Account Removal <span className="text-[#9b0f09]">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(event) => { setReason(event.target.value); setErrors((v) => ({ ...v, reason: "" })); }}
                placeholder="Tell us why you are leaving"
                rows={5}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 ${
                  errors.reason ? "border-[#9b0f09] focus:ring-[#9b0f09]" : "border-gray-200 focus:ring-gray-400"
                }`}
                required
              />
              {errors.reason && <p className="text-sm text-[#9b0f09]">{errors.reason}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-[#9b0f09] text-white hover:bg-[#7d0c07]"
            >
              {isSubmitting ? <><Loader2 className="animate-spin" /> Sending OTP...</> : <><Mail /> Submit</>}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRemove} className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-red-50 p-3 text-[#9b0f09]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
              <p className="mt-2 text-sm text-gray-600">
                Enter the OTP sent to <span className="font-semibold text-gray-900">{email}</span>.
              </p>
            </div>

            <Input
              title="One-time password"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "")); setErrors((v) => ({ ...v, otp: "" })); }}
              placeholder="Enter OTP"
              maxLength={8}
              error={errors.otp}
              required
            />

            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-600">
                {secondsRemaining > 0 ? (
                  <>
                    OTP is valid for{" "}
                    <span className="font-semibold text-gray-900">{timeLabel}</span>
                  </>
                ) : (
                  "OTP has expired."
                )}
              </p>
              <button
                type="button"
                onClick={() => sendOtp(true)}
                disabled={secondsRemaining > 0 || isResending}
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#9b0f09] disabled:cursor-not-allowed disabled:text-gray-400"
              >
                {isResending && <Loader2 className="h-4 w-4 animate-spin" />}
                <RefreshCw className="h-4 w-4" /> Resend OTP
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-[#9b0f09] text-white hover:bg-[#7d0c07]"
            >
              {isSubmitting ? <><Loader2 className="animate-spin" /> Verifying...</> : <><CheckCircle2 /> Verify & Remove Account</>}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
