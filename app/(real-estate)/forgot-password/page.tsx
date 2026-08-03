"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import Link from "next/link";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import { Loader, Home, CheckCircle2, ArrowRight, MailCheck, ArrowLeft } from "lucide-react";

const steps = [
  "Enter your registered email address",
  "Check your inbox for the reset link",
  "Set a new password and sign in",
];

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [state, setState] = useSetState({
    email: "",
    btnLoading: false,
    submitted: false,
    errors: {},
  });

  useEffect(() => { setIsMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ btnLoading: true, errors: {} });
      await Yup.object({ email: Yup.string().email("Enter a valid email").required("Email is required") })
        .validate({ email: state.email }, { abortEarly: false });
      const res: any = await Models.auth.forget_password({ email: state.email });
      Success(res?.message || "Reset link sent to your email");
      setState({ btnLoading: false, submitted: true });
    } catch (error) {
      setState({ btnLoading: false });
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach((err) => { errors[err.path] = err.message; });
        setState({ errors });
      } else {
        Failure(error?.email?.[0] || error?.message || "Something went wrong. Please try again.");
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex bg-white font-sans relative">

      {/* Top-right: View Properties */}
      <div className="absolute top-5 right-5 z-30 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/property-list")}
          className="flex items-center gap-2 px-4 py-1 rounded-full border bg-white text-sm text-dred font-medium text-black border border-[#9b0f09] hover:bg-[#fff6f6] hover:text-[#9b0f09] transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          View Properties
        
        </button>
        <button
          type="button"
          onClick={() => router.back()}

          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-dred text-sm font-medium text-white hover:border-[#9b0f09]  transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
          
        </button>
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#9b0f09] px-16 pt-12  relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

        <div className="flex items-center gap-2 cursor-pointer z-10" onClick={() => router.push("/")}>
          <img src="/assets/images/real-estate/home/boom-logo-wt.png" alt="Logo" className="h-12 w-auto object-contain" />
      </div>
        <div className="z-10 space-y-6">
          <h1 className="text-5xl font-semibold text-white leading-tight">
            Forgot your password? No worries.
          </h1>
          <p className="text-white/70 text-lg max-w-xs">
            We&apos;ll send you a secure link to reset it in seconds.
          </p>
          <ul className="space-y-4 pt-2">
            {steps.map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <span className="text-white/90 text-sm font-medium">{step}</span>
              </li>
            ))}
          </ul>
        </div>

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

          {/* mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8 cursor-pointer" onClick={() => router.push("/")}>
<img src="/assets/images/real-estate/home/boom-logo.png" alt="Logo" className="h-12 w-auto object-contain" />
          </div>

          {state.submitted ? (
            <div className="flex flex-col items-center text-center space-y-5 py-8">
              <div className="w-16 h-16 rounded-full bg-[#fff6f6] flex items-center justify-center">
                <MailCheck className="w-8 h-8 text-[#9b0f09]" />
              </div>
              <h2 className="text-2xl font-bold text-black">Check your email</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                We sent a password reset link to{" "}
                <span className="font-semibold text-black">{state.email}</span>
              </p>
              <p className="text-xs text-gray-400">Didn&apos;t receive it? Check your spam folder or</p>
              <button
                onClick={() => setState({ submitted: false, email: "" })}
                className="text-sm font-semibold text-[#9b0f09] hover:underline"
              >
                Try a different email
              </button>
              <Link href="/login" className="w-full">
                <Button className="w-full py-6 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07]">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-black mb-1">Forgot Password</h2>
              <p className="text-gray-500 text-sm mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  title="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={state.email}
                  onChange={(e) => setState({ email: e.target.value, errors: { ...state.errors, email: "" } })}
                  error={state.errors?.email}
                  className="rounded-xl border-gray-200 text-black placeholder:text-gray-400"
                />

                <Button
                  type="submit"
                  disabled={state.btnLoading}
                  className="w-full py-6 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07] transition-colors shadow-md shadow-[#9b0f09]/30"
                >
                  {state.btnLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Remember your password?{" "}
                <Link href="/login" className="text-[#9b0f09] font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
