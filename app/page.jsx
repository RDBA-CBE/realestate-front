"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetState } from "@/utils/function.utils";

import Script from "next/script";
import LoginForm from "@/components/ui/login-form";
import SignInForm from "@/components/ui/signin-form";

const App = () => {
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  return (
    <div >
      <Script
        src="https://checkout.razorpay.com/v1/checkout.jsx"
        strategy="afterInteractive"
      />

      {isLoading ? (
        <div className="flex md:min-h-[70vh] min-h-[60vh] w-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex md:min-h-[70vh] min-h-[60vh] w-full items-center justify-center md:p-6">
          <LoginForm isRefresh={true} />
        </div>
      )}
    </div>
  );
};

export default App;
