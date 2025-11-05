"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Models from "@/imports/models.import";
import Utils from "@/imports/utils.import";
import Link from "next/link";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Failure, Success, useSetState } from "@/utils/function.utils";
import { Loader } from "lucide-react";
import { useDispatch } from "react-redux";

// Main App component
const App = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize dispatch
  const [isMounted, setIsMounted] = useState(false); // Track mounting state

  const [state, setState] = useSetState({
    username: "",
    password: "",
    btnLoading: false,
  });

  useEffect(() => {
    setIsMounted(true); // Ensure component is only rendered on client
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setState({ btnLoading: true });
      const body = {
        email: state.username,
        // password: state.password,
      };

      await Utils.Validation.forgetPassword.validate(body, {
        abortEarly: false,
      });

      const res: any = await Models.auth.forget_password(body);
      console.log("res", res);

      // Dispatch action to store tokens and group in Redux
      // dispatch(setAuthData({ tokens: res.access, groups: res.group[0] }));

      Success(res?.message);

      // ✅ Trigger storage event to notify other tabs
      // window.dispatchEvent(new Event("storage"));
      setState({
        btnLoading: false,
        email: "",
      });
      router.push("/");
    } catch (error) {
      console.log("error: ", error);
      setState({ btnLoading: false });

      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err?.message;
        });

        console.log("validationErrors: ", validationErrors);

        // Set validation errors in state
        setState({ errors: validationErrors });
        setState({ submitLoading: false }); // Stop loading after error
      } else {
        setState({ submitLoading: false }); // Stop loading after unexpected error
        if (error?.email) {
          Failure(error.email[0]);
        } else {
          Failure("An error occurred. Please try again.");
        }
      }
    }
  };

  // 🚀 Prevent hydration errors by ensuring the component renders only after mount
  if (!isMounted) return null;

  const IllustrationSVG = () => (
    <svg
      className="w-full h-auto max-w-md"
      viewBox="0 0 500 300"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="270" width="500" height="30" fill="#1d8d95ff" />
      <ellipse
        cx="250"
        cy="280"
        rx="200"
        ry="20"
        fill="#22c3ceff"
        opacity="0.5"
      />

      <g transform="translate(100, 50)">
        <path
          d="M50 200 C 50 150, 150 150, 150 200 L 150 250 L 50 250 Z"
          fill="#22ceceff"
          stroke="#1d7d95ff"
          strokeWidth="4"
        />

        <circle cx="100" cy="130" r="25" fill="#f59e0b" />

        <rect x="70" y="155" width="60" height="80" rx="10" fill="#b5fbfdff" />

        <rect
          x="250"
          y="50"
          width="100"
          height="180"
          rx="15"
          fill="#22c8ceff"
          stroke="#fff"
          strokeWidth="2"
        />

        <rect x="258" y="58" width="84" height="164" rx="10" fill="#1d8395ff" />

        <g transform="translate(265, 80)">
          <rect x="0" y="40" width="70" height="50" fill="#f59e0b" rx="5" />{" "}
          {/* Base */}
          <polygon points="35 0, 70 40, 0 40" fill="#d97706" /> {/* Roof */}
          <rect x="30" y="55" width="10" height="20" fill="#ef4444" />{" "}
          {/* Door */}
        </g>

        <circle
          cx="300"
          cy="50"
          r="30"
          fill="#10b981"
          stroke="#fff"
          strokeWidth="3"
        />
        <path
          d="M285 50 L 295 60 L 315 40"
          stroke="#fff"
          strokeWidth="4"
          fill="none"
        />

        <path
          d="M 0 260 Q 50 230, 100 260 T 200 260 T 300 260 T 400 260"
          fill="none"
          stroke="#fcd34d"
          strokeWidth="5"
          opacity="0.3"
        />
      </g>
    </svg>
  );

  const WavyDecorationSVG = () => (
    <svg
      className="absolute hidden lg:block"
      style={{ top: "20px", right: "10px", width: "300px", height: "150px" }}
      viewBox="0 0 300 150"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Wavy line in a lighter purple/amber mix */}
      <path
        d="M5 100 C 50 80, 100 120, 150 100 C 200 80, 250 120, 295 100"
        stroke="#8be9faff"
        strokeWidth="4"
        opacity="0.5"
      />
      <path
        d="M5 120 C 50 100, 100 140, 150 120 C 200 100, 250 140, 295 120"
        stroke="#fcd34d"
        strokeWidth="4"
        opacity="0.4"
      />
    </svg>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:justify-between  px-4 sm:p-8 bg-[#164e63] font-sans relative overflow-hidden items-center">
      <div className="hidden lg:flex lg:flex-col justify-between  lg:w-1/2  relative z-10 p-12 ">
        {/* Logo (Top Left) */}
        <div className="mb-12 flex items-center text-white relative">
          {/* Logo Icon */}
          <svg
            className="w-6 h-6 mr-2 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          <span
            className="font-extrabold text-xl tracking-wider cursor-pointer"
            onClick={() => router.push("/")}
          >
            Real Estate
          </span>

          <svg
            className="absolute -top-1 right-0 w-3 h-3 text-amber-300 transform translate-x-3 -translate-y-3 opacity-70"
            viewBox="0 0 10 10"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0"
              y="5"
              width="7.07"
              height="7.07"
              transform="rotate(-45 0 5)"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight flex items-center">
          {/* Decorative icon near the headline */}
          {/* <svg
            className="w-8 h-8 mr-4 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.694h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.046a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.046a1 1 0 00-1.176 0l-2.817 2.046c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.022 8.723c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.694l1.07-3.292z" />
          </svg> */}
          Looking for the right buyer?
        </h1>
        <p className="text-xl text-amber-300 font-semibold mb-10">
          Your Search Ends Here
        </p>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">
              1
            </div>
            <p className="text-lg text-white font-medium">
              Login with your phone number
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">
              2
            </div>
            <p className="text-lg text-white font-medium">
              Add property details
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">
              3
            </div>
            <p className="text-lg text-white font-medium">
              Property activated in just 30 min
            </p>
          </div>
        </div>

        {/* Main Illustration (Bottom Left) - Now an SVG */}
        <div className="mt-16 flex justify-center lg:justify-start">
          <IllustrationSVG />
        </div>
      </div>

      <div className="w-full min-h-screen lg:min-h-0 lg:w-1/2 flex justify-center items-center  lg:justify-end lg:pt-12 relative z-20 lg:self-start">
        <WavyDecorationSVG />

        <Card className="shadow-violet-900/50 relative z-30 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-auto">
          <CardHeader className="flex flex-col space-y-2 mb-6 p-0">
            <h3 className="text-xl font-bold tracking-tight text-gray-900">
              Forgot Password
            </h3>

            <CardDescription>
              Enter your email below to receive password reset mail
            </CardDescription>
          </CardHeader>

          <form className="space-y-6">
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <Input
                    title="Email"
                    id="email"
                    type="email"
                    placeholder="Enter Your mail ID"
                    className="rounded-xl"
                    required
                    value={state.username}
                    onChange={(e) =>
                      setState({
                        username: e.target.value,
                        errors: { ...state.errors, email: "" },
                      })
                    }
                    error={state.errors?.email}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/30"
                onClick={() =>
                  setState({
                    btnLoading: false,
                    email: "",
                  })
                }
                loading={state.loading}
              >
                Cancel
              </Button>

              <Button
                className="w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/30"
                onClick={handleSubmit}
              >
                {state.btnLoading ? <Loader /> : "Confirm"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Remember your password ?{" "}
            <Link
              href="/login"
              className="font-medium text-black hover:underline "
            >
              Login
            </Link>
          </p>
        </Card>
      </div>

      <div className="hidden absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#2c005b] to-transparent z-0"></div>
    </div>
  );
};

export default App;
