"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import Link from "next/link";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import { Loader, MailCheck } from "lucide-react";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [state, setState] = useSetState({
    email: "",
    btnLoading: false,
    submitted: false,
    errors: {},
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const LeftPanel = () => (
    <div className="hidden lg:flex lg:flex-col justify-between lg:w-1/2 relative z-10 p-12">
      <div className="mb-12 flex items-center text-white">
        <svg className="w-6 h-6 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className="font-extrabold text-xl tracking-wider cursor-pointer" onClick={() => router.push("/")}>
          Real Estate
        </span>
      </div>

      <div>
        <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">Forgot your password?</h1>
        <p className="text-xl text-amber-300 font-semibold mb-10">No worries, we'll send you reset instructions.</p>
        <div className="space-y-6">
          {["Enter your registered email", "Check your inbox for the reset link", "Set a new password and login"].map((step, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">{i + 1}</div>
              <p className="text-lg text-white font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-center lg:justify-start">
        <svg className="w-full h-auto max-w-md" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="270" width="500" height="30" fill="#1d8d95ff" />
          <ellipse cx="250" cy="280" rx="200" ry="20" fill="#22c3ceff" opacity="0.5" />
          <g transform="translate(100, 50)">
            <path d="M50 200 C 50 150, 150 150, 150 200 L 150 250 L 50 250 Z" fill="#22ceceff" stroke="#1d7d95ff" strokeWidth="4" />
            <circle cx="100" cy="130" r="25" fill="#f59e0b" />
            <rect x="70" y="155" width="60" height="80" rx="10" fill="#b5fbfdff" />
            <rect x="250" y="50" width="100" height="180" rx="15" fill="#22c8ceff" stroke="#fff" strokeWidth="2" />
            <rect x="258" y="58" width="84" height="164" rx="10" fill="#1d8395ff" />
            <g transform="translate(265, 80)">
              <rect x="0" y="40" width="70" height="50" fill="#f59e0b" rx="5" />
              <polygon points="35 0, 70 40, 0 40" fill="#d97706" />
              <rect x="30" y="55" width="10" height="20" fill="#ef4444" />
            </g>
            <circle cx="300" cy="50" r="30" fill="#10b981" stroke="#fff" strokeWidth="3" />
            <path d="M285 50 L 295 60 L 315 40" stroke="#fff" strokeWidth="4" fill="none" />
          </g>
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:justify-between px-4 sm:p-8 bg-[#164e63] font-sans relative overflow-hidden items-center">
      <LeftPanel />

      <div className="w-full min-h-screen lg:min-h-0 lg:w-1/2 flex justify-center items-center lg:justify-end lg:pt-12 relative z-20 lg:self-start">
        <Card className="relative z-30 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-auto">
          {state.submitted ? (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <MailCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Check your email</h3>
              <p className="text-sm text-gray-500">
                We sent a password reset link to <span className="font-medium text-gray-800">{state.email}</span>
              </p>
              <p className="text-xs text-gray-400">Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={() => setState({ submitted: false, email: "" })}
                className="text-sm font-medium text-emerald-600 hover:underline"
              >
                Try a different email
              </button>
              <Link href="/login" className="w-full mt-2">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <CardHeader className="flex flex-col space-y-2 mb-6 p-0">
                <h3 className="text-xl font-bold tracking-tight text-gray-900">Forgot Password</h3>
                <CardDescription>Enter your email to receive a password reset link</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  title="Email"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-xl"
                  value={state.email}
                  onChange={(e) => setState({ email: e.target.value, errors: { ...state.errors, email: "" } })}
                  error={state.errors?.email}
                />

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/30"
                  disabled={state.btnLoading}
                >
                  {state.btnLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-5">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-black hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
