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
import { Loader, ShieldCheck } from "lucide-react";

const resetSchema = Yup.object({
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function ResetPasswordPage({ params }: { params: { uid: string; token: string } }) {
  const router = useRouter();
  const { uid, token } = params;

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

      const body = {
        uidb64: uid,
        token,
        new_password: state.password,
      }

      const res: any = await Models.auth.reset_password(body);
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
        <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">Set a new password</h1>
        <p className="text-xl text-amber-300 font-semibold mb-10">Choose a strong password to secure your account.</p>
        <div className="space-y-6">
          {["Use at least 8 characters", "Mix letters, numbers & symbols", "Don't reuse old passwords"].map((tip, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">{i + 1}</div>
              <p className="text-lg text-white font-medium">{tip}</p>
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
          {state.success ? (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Password Reset!</h3>
              <p className="text-sm text-gray-500">Your password has been updated. You can now log in.</p>
              <Link href="/login" className="w-full mt-2">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <CardHeader className="flex flex-col space-y-2 mb-6 p-0">
                <h3 className="text-xl font-bold tracking-tight text-gray-900">Reset Password</h3>
                <CardDescription>Enter and confirm your new password below</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  title="New Password"
                  type="password"
                  placeholder="Enter new password"
                  className="rounded-xl"
                  value={state.password}
                  onChange={(e) => setState({ password: e.target.value, errors: { ...state.errors, password: "" } })}
                  error={state.errors?.password}
                />
                <Input
                  title="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  className="rounded-xl"
                  value={state.confirmPassword}
                  onChange={(e) => setState({ confirmPassword: e.target.value, errors: { ...state.errors, confirmPassword: "" } })}
                  error={state.errors?.confirmPassword}
                />
                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/30"
                  disabled={state.btnLoading}
                >
                  {state.btnLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Reset Password"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-5">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-black hover:underline">Login</Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
