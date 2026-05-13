"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import { MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#164e63] font-sans overflow-hidden">

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center lg:w-1/2 p-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <svg className="w-6 h-6 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-extrabold text-xl tracking-wider text-white cursor-pointer" onClick={() => router.push("/")}>
              Real Estate
            </span>
          </div>

          <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <MailCheck className="w-24 h-24 text-amber-400" />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Verify Your Email
          </h1>
          <p className="text-lg text-amber-300 font-medium mb-8">
            One click away from accessing your account
          </p>

          <div className="space-y-4 text-left max-w-xs mx-auto">
            {[
              "Click 'Verify Email' to confirm your account",
              "If link expired, resend a new verification email",
              "Check spam folder if email not received",
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">{i + 1}</div>
                <p className="text-white text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen p-6">
        <Card className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-auto">
          <CardHeader className="p-0 mb-6">
            {/* Mobile logo */}
            <div className="flex items-center mb-4 lg:hidden">
              <svg className="w-5 h-5 mr-2 text-[#164e63]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-bold text-[#164e63]">Real Estate</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Email Verification</h3>
            </div>
            <p className="text-sm text-gray-500">
              {token
                ? "Your verification link is ready. Click the button below to verify your email."
                : "No token found. Please use the link sent to your email or resend below."}
            </p>
          </CardHeader>

          {/* Token status */}
          {token && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700 font-medium truncate">Token detected</p>
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={state.loading || !token}
            className="w-full py-6 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {state.loading ? "Verifying..." : "Verify Email"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Resend Section */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Resend Verification Email</p>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={state.email}
              onChange={(e) => setState({ email: e.target.value })}
              className="rounded-xl mb-3"
            />
            <Button
              onClick={handleResend}
              disabled={state.resendLoading || !state.email}
              className="w-full py-5 rounded-xl font-semibold bg-[#164e63] hover:bg-[#0f3a4a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.resendLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Resend Email
                </span>
              )}
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button onClick={() => router.push("/login")} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
