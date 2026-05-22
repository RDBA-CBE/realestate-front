"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import Link from "next/link";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import { Loader, Home, ArrowRight, ShieldCheck, AlertTriangle, ArrowLeft } from "lucide-react";

const tips = [
  "Use at least 8 characters",
  "Mix uppercase, lowercase & numbers",
  "Add a symbol for extra security",
  "Don't reuse old passwords",
];

const resetSchema = Yup.object({
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const uid = params?.uid as string | undefined;
  const token = params?.token as string | undefined;
  const [isMounted, setIsMounted] = useState(false);

  const [state, setState] = useSetState({
    password: "",
    confirmPassword: "",
    btnLoading: false,
    success: false,
    errors: {},
  });

  useEffect(() => { setIsMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ btnLoading: true, errors: {} });
      await resetSchema.validate(
        { password: state.password, confirmPassword: state.confirmPassword },
        { abortEarly: false }
      );
      const res: any = await Models.auth.reset_password({ uidb64: uid, token, new_password: state.password });
      Success(res?.message || "Password reset successfully");
      setState({ btnLoading: false, success: true });
    } catch (error) {
      setState({ btnLoading: false });
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach((err) => { errors[err.path] = err.message; });
        setState({ errors });
      } else {
        Failure(error?.message || error?.detail || "Something went wrong. Please try again.");
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
          onClick={() => router.push("/property-list")}
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
            Set a new secure password.
          </h1>
          <p className="text-white/70 text-lg max-w-xs">
            Choose a strong password to keep your account safe.
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
          {/* No token */}
          {!token ? (
            <div className="flex flex-col items-center text-center space-y-5 py-8">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-[#9b0f09]" />
              </div>
              <h2 className="text-2xl font-bold text-black">Invalid Reset Link</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                This password reset link is invalid or has expired.
              </p>
              <Link href="/forgot-password" className="w-full">
                <Button className="w-full py-6 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07]">
                  Request a new link
                </Button>
              </Link>
            </div>

          ) : state.success ? (
            <div className="flex flex-col items-center text-center space-y-5 py-8">
              <div className="w-16 h-16 rounded-full bg-[#fff6f6] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#9b0f09]" />
              </div>
              <h2 className="text-2xl font-bold text-black">Password Reset!</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                Your password has been updated successfully. You can now sign in.
              </p>
              <Link href="/login" className="w-full">
                <Button className="w-full py-6 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07]">
                  Go to Sign In
                </Button>
              </Link>
            </div>

          ) : (
            <>
              <h2 className="text-3xl font-bold text-black mb-1">Reset Password</h2>
              <p className="text-gray-500 text-sm mb-8">Enter and confirm your new password below.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  title="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={state.password}
                  onChange={(e) => setState({ password: e.target.value, errors: { ...state.errors, password: "" } })}
                  error={state.errors?.password}
                  className="rounded-xl border-gray-200 text-black placeholder:text-gray-400"
                />
                <Input
                  title="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={state.confirmPassword}
                  onChange={(e) => setState({ confirmPassword: e.target.value, errors: { ...state.errors, confirmPassword: "" } })}
                  error={state.errors?.confirmPassword}
                  className="rounded-xl border-gray-200 text-black placeholder:text-gray-400"
                />

                <Button
                  type="submit"
                  disabled={state.btnLoading}
                  className="w-full py-6 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07] transition-colors shadow-md shadow-[#9b0f09]/30"
                >
                  {state.btnLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Reset Password"}
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
}
