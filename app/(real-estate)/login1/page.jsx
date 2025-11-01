"use client";

import Link from "next/link";
import React, { useState } from "react";

// Main App component
const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      // Simple validation check (must be 10 digits for India/US format, for example)
      if (phoneNumber.match(/^\d{10}$/)) {
        setMessage(`Success! Sent OTP to ${countryCode} ${phoneNumber}`);
      } else {
        setMessage("Please enter a valid 10-digit phone number.");
      }
    }, 1500);
  };

  // --- UI Components mimicking shadcn/ui for this single file ---

  const Label = ({ htmlFor, children }) => (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-gray-700 leading-none"
    >
      {children}
    </label>
  );

  const Button = ({ children, disabled, onClick, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      // Button color is the distinct mint/emerald green from the image
      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 
        ${
          disabled
            ? "bg-emerald-300/80 text-white cursor-not-allowed"
            : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/30"
        } ${className}`}
    >
      {children}
    </button>
  );

  const Input = ({
    type = "text",
    value,
    onChange,
    placeholder,
    className = "",
    id,
    required = false,
  }) => (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`flex h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm 
        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
        transition duration-150 ${className}`}
    />
  );

  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-auto ${className}`}
    >
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="flex flex-col space-y-2 mb-6">
      <h3 className="text-xl font-bold tracking-tight text-gray-900">
        {children}
      </h3>
    </div>
  );

  // Component for the steps list on the left side
  const StepItem = ({ number, children }) => (
    <div className="flex items-center space-x-3">
      <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-[#3d767d] rounded-full flex-shrink-0">
        {number}
      </div>
      <p className="text-lg text-white font-medium">{children}</p>
    </div>
  );

  // SVG for the main illustration (Person, Phone, House, Checkmark)
 const IllustrationSVG = () => (
    <svg 
      className="w-full h-auto max-w-md" 
      viewBox="0 0 500 300" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ground/Shadow (Darker Violet) */}
      <rect x="0" y="270" width="500" height="30" fill="#1d8d95ff"/>
      <ellipse cx="250" cy="280" rx="200" ry="20" fill="#22c3ceff" opacity="0.5"/>

      {/* Main Elements Group */}
      <g transform="translate(100, 50)">
        {/* Person Sitting (Simplified) - Primary Violet */}
        <path d="M50 200 C 50 150, 150 150, 150 200 L 150 250 L 50 250 Z" fill="#22ceceff" stroke="#1d7d95ff" strokeWidth="4" />
        {/* Head */}
        <circle cx="100" cy="130" r="25" fill="#f59e0b"/>
        {/* Body/Torso - Lighter Violet */}
        <rect x="70" y="155" width="60" height="80" rx="10" fill="#b5fbfdff"/>
        
        {/* Smartphone (Primary Violet) */}
        <rect x="250" y="50" width="100" height="180" rx="15" fill="#22c8ceff" stroke="#fff" strokeWidth="2"/>
        {/* Screen - Darker Violet (to blend with background) */}
        <rect x="258" y="58" width="84" height="164" rx="10" fill="#1d8395ff"/>

        {/* House Icon on Phone Screen (Amber/Red - kept for contrast) */}
        <g transform="translate(265, 80)">
          <rect x="0" y="40" width="70" height="50" fill="#f59e0b" rx="5"/> {/* Base */}
          <polygon points="35 0, 70 40, 0 40" fill="#d97706"/> {/* Roof */}
          <rect x="30" y="55" width="10" height="20" fill="#ef4444"/> {/* Door */}
        </g>

        {/* Checkmark (Emerald Green - Primary Action Color) */}
        <circle cx="300" cy="50" r="30" fill="#10b981" stroke="#fff" strokeWidth="3"/>
        <path d="M285 50 L 295 60 L 315 40" stroke="#fff" strokeWidth="4" fill="none"/>
        
        {/* Wavy Line Aesthetic (Yellow/Amber - kept for contrast) */}
        <path d="M 0 260 Q 50 230, 100 260 T 200 260 T 300 260 T 400 260" fill="none" stroke="#fcd34d" strokeWidth="5" opacity="0.3"/>
      </g>
    </svg>
  );

  // Wavy lines decoration near the form card
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
    // Custom deep violet background matching the design image
    <div className="min-h-screen flex flex-col lg:flex-row lg:justify-between p-4 sm:p-8 bg-[#164e63] font-sans relative overflow-hidden items-center">
      {/* 1. Left Section - Promotional Content (Hidden on mobile, shown on large screens) */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 relative z-10">
        {/* Logo (Top Left) */}
        <div className="mb-12 flex items-center text-white relative">
          {/* Logo Icon */}
          {/* <svg
            className="w-6 h-6 mr-2 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg> */}
          {/* <span className="font-extrabold text-xl tracking-wider">
            HOUSING.COM
          </span> */}

          {/* NEW: Small decorative shape near the logo */}
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

        {/* Title and Steps */}
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
          <StepItem number={1}>Login with your phone number</StepItem>
          <StepItem number={2}>Add property details</StepItem>
          <StepItem number={3}>Property activated in just 30 min</StepItem>
        </div>

        {/* Main Illustration (Bottom Left) - Now an SVG */}
        <div className="mt-16 flex justify-center lg:justify-start">
          <IllustrationSVG />
        </div>
      </div>

      {/* 2. Right Section - Phone Number Form (Always visible) */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pt-12 relative z-20 lg:self-start">
        {/* Wavy Decoration near the form (Top Right) */}
        <WavyDecorationSVG />

        <Card className="shadow-violet-900/50 relative z-30">
          <CardHeader>Login </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                {/* Country Code Dropdown */}
                <div className="space-y-2">
                  <Input
                    title="Email"
                    placeholder="you@example.com"
                    className="rounded-xl"
                    value=""
                    name="email"
                    // onChange={handleInputChange}
                    // error={state.error?.email}
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    title="Password"
                    placeholder="Enter your password"
                    type="password"
                    className="rounded-xl"
                    value=""
                    name="password"
                    // onChange={handleInputChange}
                    // error={state.error?.password}
                  />

                  <div className="text-right">
                    <Link
                      href="/forgot-password-email"
                      className="text-sm  hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <Button type="submit" disabled={loading || phoneNumber.length < 10}>
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Continue"
              )}
            </Button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

             <div className="flex flex-col justify-center text-center">
              <p>Continue with Social</p>
              <div className=" mt-2 flex gap-4 justify-center">
                <div>
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.61 20.083H24V28.917H35.856C34.78 32.091 32.618 34.333 29.833 36.196L29.83 36.198L36.194 40.082L36.216 40.103C40.007 36.43 42.61 31.066 43.61 25.136V20.083Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M24 43.5C29.833 43.5 34.8 41.527 38.3 38.312L32.062 34.333C30.297 35.533 27.575 36.25 24 36.25C19.458 36.25 15.69 33.277 14.167 29.289L7.864 33.267C10.74 38.835 16.96 43.5 24 43.5Z"
                    />
                    <path
                      fill="#34A853"
                      d="M14.167 29.289C13.43 27.202 13.042 25.136 13.042 24C13.042 22.864 13.43 20.798 14.167 18.711L7.864 14.733C6.34 17.864 5.583 20.884 5.583 24C5.583 27.116 6.34 30.136 7.864 33.267L14.167 29.289Z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M24 11.75C27.59 11.75 30.73 13.046 33.268 15.485L38.483 10.27C34.8 6.977 29.833 5 24 5C16.96 5 10.74 9.665 7.864 15.233L14.167 19.211C15.69 15.223 19.458 11.75 24 11.75Z"
                    />
                  </svg>
                </div>
                <div>
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Blue circle background */}
                    <path
                      fill="#1877F2"
                      d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                    />
                    {/* White 'f' */}
                    <path
                      fill="#FFFFFF"
                      d="M15.4 9H13.5V7.5C13.5 7.198 13.55 7 13.8 7H15V4.5C15 4.5 14.144 4.35 13.3 4.35C11.5 4.35 10.3 5.45 10.3 7.2V9H8.5V11.5H10.3V19.65H13.5V11.5H15.4L15.7 9H15.4Z"
                    />
                  </svg>
                </div>
              </div>
            </div>

          </form>
        </Card>
      </div>

      {/* Aesthetic Background Wave (Bottom) */}
      <div className="hidden absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#2c005b] to-transparent z-0"></div>
    </div>
  );
};

export default App;
