"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import Utils from "@/imports/utils.import";
import Link from "next/link";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import { useEffect } from "react";
import { Loader, Home, CheckCircle2, ArrowRight } from "lucide-react";

const perks = [
  "List your property for Sale or Lease",
  "Get verified leads from serious buyers",
  "Property activated in just 30 minutes",
  "Free listing — no hidden charges",
];

const PostPropertyPage = () => {
  const router = useRouter();

  const [state, setState] = useSetState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    industry_name: "",
    loading: false,
    error: {},
    developerGroup: null,
  });

  useEffect(() => { getGroup(); }, []);

  const getGroup = async () => {
    try {
      const res: any = await Models.auth.group();
      const developerGroup = res.results.find((g) => g.name === "Developer");
      setState({ developerGroup: developerGroup?.id });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setState({ [name]: value, error: { ...state.error, [name]: "" } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ loading: true });
      const body = {
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        password: state.password,
        industry: state.industry_name,
        terms_accepted: true,
        user_type: "developer",
        groups: [state.developerGroup],
      };
      await Utils.Validation.signup.validate(body, { abortEarly: false });
      const res: any = await Models.auth.singup(body);
      Success(res?.message || "Account created! Please verify your email.");
      router.push("/");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach((err) => { errors[err.path] = err.message; });
        setState({ error: errors });
      } else {
        Failure(error?.email?.[0] || error?.password?.[0] || "Something went wrong.");
      }
    } finally {
      setState({ loading: false });
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

        <div className="flex items-center gap-2 cursor-pointer z-10" onClick={() => router.push("/")}>
          <img src="/assets/images/real-estate/home/boom-logo-wt.png" alt="Logo" className="h-12 w-auto object-contain" />
</div>
        <div className="z-10 space-y-6">
          <h1 className="text-5xl font-semibold text-white leading-tight">
            Sell or Lease your property with ease.
          </h1>
          <p className="text-white/70 text-lg max-w-xs">
            Reach thousands of verified buyers and tenants instantly.
          </p>
          <ul className="space-y-4 pt-2">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white/80 shrink-0" />
                <span className="text-white/90 text-sm font-medium">{perk}</span>
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
          <h2 className="text-3xl font-bold text-black pb-5">Post Your Property</h2>
          {/* <p className="text-gray-500 text-sm mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#9b0f09] font-semibold hover:underline">Sign in</Link>
          </p> */}

          {/* Google SSO */}
          {/* <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-black hover:bg-gray-50 transition mb-6 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
              <path fill="#FFC107" d="M43.61 20.083H24V28.917H35.856C34.78 32.091 32.618 34.333 29.833 36.196L36.194 40.082C40.007 36.43 42.61 31.066 43.61 25.136V20.083Z" />
              <path fill="#4285F4" d="M24 43.5C29.833 43.5 34.8 41.527 38.3 38.312L32.062 34.333C30.297 35.533 27.575 36.25 24 36.25C19.458 36.25 15.69 33.277 14.167 29.289L7.864 33.267C10.74 38.835 16.96 43.5 24 43.5Z" />
              <path fill="#34A853" d="M14.167 29.289C13.43 27.202 13.042 25.136 13.042 24C13.042 22.864 13.43 20.798 14.167 18.711L7.864 14.733C6.34 17.864 5.583 20.884 5.583 24C5.583 27.116 6.34 30.136 7.864 33.267L14.167 29.289Z" />
              <path fill="#FBBC04" d="M24 11.75C27.59 11.75 30.73 13.046 33.268 15.485L38.483 10.27C34.8 6.977 29.833 5 24 5C16.96 5 10.74 9.665 7.864 15.233L14.167 19.211C15.69 15.223 19.458 11.75 24 11.75Z" />
            </svg>
            Continue with Google
          </button> */}

          {/* <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input title="First Name" name="first_name" placeholder="John" value={state.first_name} onChange={handleInputChange} error={state.error?.first_name} className="rounded-xl border-gray-200 text-black placeholder:text-gray-400" />
              <Input title="Last Name" name="last_name" placeholder="Doe" value={state.last_name} onChange={handleInputChange} error={state.error?.last_name} className="rounded-xl border-gray-200 text-black placeholder:text-gray-400" />
            </div>
            <Input title="Email" name="email" type="email" placeholder="you@example.com" value={state.email} onChange={handleInputChange} error={state.error?.email} className="rounded-xl border-gray-200 text-black placeholder:text-gray-400" />
            <Input title="Password" name="password" type="password" placeholder="Create a password" value={state.password} onChange={handleInputChange} error={state.error?.password} className="rounded-xl border-gray-200 text-black placeholder:text-gray-400" />
            <Input title="Industry / Company Name" name="industry_name" placeholder="e.g. Casagrand Builders" value={state.industry_name} onChange={handleInputChange} error={state.error?.industry_name} className="rounded-xl border-gray-200 text-black placeholder:text-gray-400" />

            <p className="text-xs text-gray-400">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-[#9b0f09] hover:underline">Terms</Link>{" "}and{" "}
              <Link href="/privacy-policy" className="text-[#9b0f09] hover:underline">Privacy Policy</Link>.
            </p>

            <Button
              type="submit"
              disabled={state.loading}
              className="w-full py-6 rounded-xl font-semibold text-white bg-[#9b0f09] hover:bg-[#7d0c07] transition-colors shadow-md shadow-[#9b0f09]/30"
            >
              {state.loading ? <Loader className="w-4 h-4 animate-spin" /> : "Create Account & Post Property"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostPropertyPage;
