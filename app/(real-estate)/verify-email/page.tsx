"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import { Loader, Home, ArrowRight, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const tips = [
  "Click 'Verify Email' to confirm your account",
  "Link expired? Resend a new verification email",
  "Check your spam folder if not received",
];

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [state, setState] = useSetState({
    loading: false,
    resendLoading: false,
    email: "",
  });

  const handleVerify = async () => {
    if (!token) return Failure("Invalid or missing verification token.");
    try {
      setState({ loading: true });
      await Models.auth.verify_email({ token });
      Success("Email verified successfully!");
      router.push("/login");
    } catch (error: any) {
      Failure(error?.detail || error?.token?.[0] || "Verification failed. Please try again.");
    } finally {
      setState({ loading: false });
    }
  };

  const handleResend = async () => {
    if (!state.email) return Failure("Please enter your email address.");
    try {
      setState({ resendLoading: true });
      await Models.auth.resend_token({ email: state.email });
      Success("Verification email resent! Please check your inbox.");
    } catch (error: any) {
      Failure(error?.detail || error?.email?.[0] || "Failed to resend. Please try again.");
    } finally {
      setState({ resendLoading: false });
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans relative">

      {/* Top-right: View Properties */}
      <div className="absolute top-5 right-5 z-30">
        <button
          type="button"
          onClick={() => router.push("/property-list")}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-black hover:border-[#9b0f09] hover:text-[#9b0f09] transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          View Properties
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#9b0f09] px-16 pt-12  relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

        {/* Logo */}
        <div className="flex items-center  gap-2 cursor-pointer z-10" onClick={() => router.push("/")}>
          <img src="/assets/images/real-estate/home/boom-logo-wt.png" alt="Logo" className="h-12 w-auto object-contain" />
          </div>
        {/* Headline */}
        <div className="z-10 space-y-6">
          {/* <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center">
            <MailCheck className="w-10 h-10 text-white" />
          </div> */}
          <h1 className="text-5xl font-semibold  text-white leading-tight">
            Almost there! Verify now.
          </h1>
          <p className="text-white/70 text-lg max-w-xs">
            One quick step to unlock your full account access.
          </p>
          <ul className="space-y-4 pt-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <span className="text-white/90 text-sm font-medium">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom illustration */}
        <div className="z-10">
          <svg viewBox="0 0 400 160" className="w-full opacity-20" xmlns="http://www.w3.org/2000/svg" style={{marginBottom:"-15px"}}>
            <rect x="20" y="60" width="80" height="90" rx="4" fill="white" />
            <polygon points="60,20 100,60 20,60" fill="white" />
            <rect x="45" y="100" width="30" height="50" rx="2" fill="#9b0f09" />
            <rect x="130" y="40" width="100" height="110" rx="4" fill="white" />
            <polygon points="180,5 230,40 130,40" fill="white" />
            <rect x="160" y="90" width="40" height="60" rx="2" fill="#9b0f09" />
            <rect x="260" y="70" width="70" height="80" rx="4" fill="white" />
            <polygon points="295,35 330,70 260,70" fill="white" />
            <rect x="278" y="110" width="25" height="40" rx="2" fill="#9b0f09" />
            <rect x="0" y="148" width="400" height="4" rx="2" fill="white" />
          </svg>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/assets/images/real-estate/home/boom-logo.png" alt="Logo" className="h-12 w-auto object-contain" />
            </div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-[#fff6f6] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#9b0f09]" />
            </div>
            <h2 className="text-3xl font-bold text-black">Verify Email</h2>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            {token
              ? "Your verification link is ready. Click below to confirm your email."
              : "No token found. Use the link sent to your email or resend below."}
          </p>

          {/* Token badge */}
          {token && (
            <div className="flex items-center gap-2 bg-[#fff6f6] border border-[#9b0f09]/20 rounded-xl px-4 py-3 mb-6">
              <ShieldCheck className="w-4 h-4 text-[#9b0f09] shrink-0" />
              <p className="text-sm text-[#9b0f09] font-medium">Verification token detected</p>
            </div>
          )}

          {/* Verify button */}
          <Button
            onClick={handleVerify}
            disabled={state.loading || !token}
            className="w-full py-6 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07] transition-colors shadow-md shadow-[#9b0f09]/30 disabled:opacity-40 disabled:cursor-not-allowed mb-8"
          >
            {state.loading
              ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Verifying...</span>
              : <span className="flex items-center gap-2"><MailCheck className="w-4 h-4" /> Verify Email</span>
            }
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">DIDN&apos;T GET THE EMAIL?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Resend section */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-black">Resend Verification Email</p>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={state.email}
              onChange={(e) => setState({ email: e.target.value })}
              className="rounded-xl border-gray-200 text-black placeholder:text-gray-400"
            />
            <Button
              onClick={handleResend}
              disabled={state.resendLoading || !state.email}
              className="w-full py-5 rounded-xl font-semibold border-2 border-[#9b0f09] text-[#9b0f09] bg-white hover:bg-[#fff6f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {state.resendLoading
                ? <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</span>
                : <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Resend Email</span>
              }
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Back to{" "}
            <Link href="/login" className="text-[#9b0f09] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
