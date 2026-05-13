"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import Utils from "@/imports/utils.import";
import Link from "next/link";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import CustomPhoneInput from "@/components/common-components/phoneInput";
import { useEffect } from "react";

const PostPropertyPage = () => {
  const router = useRouter();

  const [state, setState] = useSetState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    loading: false,
    error: {},
  });

  useEffect(()=>{
    getGroup()
  },[])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setState({ [name]: value, error: { ...state.error, [name]: "" } });
  };

  const getGroup = async () => {
    try {
      const res: any = await Models.auth.group(); 
      const developerGroup = res.results.find(group => group.name == 'Developer')
      setState({ group: res?.results ,
        developerGroup: developerGroup?.id 
      })
    }
    catch (error) {
      console.log("error", error);
      
    }
  }

  console.log("group", state.group);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ loading: true });
      const body = {
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        // phone: state.phone,
        password: state.password,
        industry: state.industry_name,
        terms_accepted: true,
        user_type: "developer",
        groups: [state.developerGroup],
      };

      await Utils.Validation.signup.validate(body, { abortEarly: false });
      const res: any = await Models.auth.singup(body);
      Success(res?.message || "Account created! Please verify your email.");
      router.push(`/`);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => { validationErrors[err.path] = err?.message; });
        setState({ error: validationErrors });
      } else {
        Failure(error?.email?.[0] || error?.password?.[0] || "Something went wrong.");
      }
    } finally {
      setState({ loading: false });
    }
  };

  const IllustrationSVG = () => (
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
        <path d="M 0 260 Q 50 230, 100 260 T 200 260 T 300 260 T 400 260" fill="none" stroke="#fcd34d" strokeWidth="5" opacity="0.3" />
      </g>
    </svg>
  );

  const WavyDecorationSVG = () => (
    <svg className="absolute hidden lg:block" style={{ top: "20px", right: "10px", width: "300px", height: "150px" }} viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path d="M5 100 C 50 80, 100 120, 150 100 C 200 80, 250 120, 295 100" stroke="#8be9faff" strokeWidth="4" opacity="0.5" />
      <path d="M5 120 C 50 100, 100 140, 150 120 C 200 100, 250 140, 295 120" stroke="#fcd34d" strokeWidth="4" opacity="0.4" />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:justify-between px-4 sm:p-8 bg-[#164e63] font-sans relative overflow-hidden items-center">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-col justify-between lg:w-1/2 relative z-10 p-12">
        {/* Logo */}
        <div className="mb-12 flex items-center text-white relative">
          <svg className="w-6 h-6 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="font-extrabold text-xl tracking-wider cursor-pointer" onClick={() => router.push("/")}>
            Real Estate
          </span>
        </div>

        <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
          Sell or Lease Your Property with Ease
        </h1>
        <p className="text-xl text-amber-300 font-semibold mb-10">
          Reach thousands of verified buyers & tenants
        </p>

        <div className="space-y-6">
          {[
            "List your property for Sale or Lease",
            "Get verified leads from serious buyers",
            "Property activated in just 30 minutes",
            "Free listing — no hidden charges",
          ].map((step, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-lg text-white font-medium">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center lg:justify-start">
          <IllustrationSVG />
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full min-h-screen lg:min-h-0 lg:w-1/2 flex justify-center items-center lg:justify-end lg:pt-12 relative z-20 lg:self-start">
        <WavyDecorationSVG />

        <Card className="relative z-30 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-auto">
          <CardHeader className="flex flex-col space-y-2 mb-6 p-0">
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Post Your Property</h3>
            <p className="text-sm text-gray-500">Create a free account to list your property</p>
          </CardHeader>

          {/* Google SSO */}
          <div className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition mb-4">
            <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
              <path fill="#FFC107" d="M43.61 20.083H24V28.917H35.856C34.78 32.091 32.618 34.333 29.833 36.196L36.194 40.082C40.007 36.43 42.61 31.066 43.61 25.136V20.083Z" />
              <path fill="#4285F4" d="M24 43.5C29.833 43.5 34.8 41.527 38.3 38.312L32.062 34.333C30.297 35.533 27.575 36.25 24 36.25C19.458 36.25 15.69 33.277 14.167 29.289L7.864 33.267C10.74 38.835 16.96 43.5 24 43.5Z" />
              <path fill="#34A853" d="M14.167 29.289C13.43 27.202 13.042 25.136 13.042 24C13.042 22.864 13.43 20.798 14.167 18.711L7.864 14.733C6.34 17.864 5.583 20.884 5.583 24C5.583 27.116 6.34 30.136 7.864 33.267L14.167 29.289Z" />
              <path fill="#FBBC04" d="M24 11.75C27.59 11.75 30.73 13.046 33.268 15.485L38.483 10.27C34.8 6.977 29.833 5 24 5C16.96 5 10.74 9.665 7.864 15.233L14.167 19.211C15.69 15.223 19.458 11.75 24 11.75Z" />
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
           
              <Input title="First Name" name="first_name" placeholder="First Name" className="rounded-xl" value={state.first_name} onChange={handleInputChange} required error={state.error?.first_name} />
              <Input title="Last Name" name="last_name" placeholder="Last Name" className="rounded-xl" value={state.last_name} onChange={handleInputChange} required error={state.error?.last_name} />
           

            <Input title="Email" name="email" type="email" placeholder="you@example.com" className="rounded-xl" value={state.email} onChange={handleInputChange} required error={state.error?.email} />

            
            <Input title="Password" name="password" type="password" placeholder="Create a password" className="rounded-xl" value={state.password} onChange={handleInputChange} required error={state.error?.password} />

            <Input title="Industry Name" name="industry_name" type="text" placeholder="Enter your industry name" className="rounded-xl" value={state.industry_name} onChange={handleInputChange} required error={state.error?.industry_name} />

            {/* <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <CustomPhoneInput
                value={state.phone}
                onChange={(value) => setState({ phone: value })}
                name="phone"
                required
                error={state.error?.phone}
              />
            </div> */}


            <Button
              type="submit"
              className="w-full py-6 px-4 rounded-lg font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/30"
              loading={state.loading}
            >
              Create Account & Post Property
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PostPropertyPage;
