"use client";

import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/common-components/header";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import store from "@/store";
import { Suspense } from "react";
import PageTransition from "@/components/common-components/PageTransition";
import { usePathname } from "next/navigation";
import NewHeader from "@/components/real-estate/NewHeader";
import ChatWidget from "@/components/common-components/ChatWidget";
import PropertyFinderChat from "@/components/common-components/ChatWidget";
import NewFooter from "@/components/real-estate/NewFooter";
import { ToastProvider } from "@/components/common-components/ToastProvider";

// Poppins as the main sans font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // pick the weights you need
  variable: "--font-poppins",
});

// Roboto as secondary font (for mono / UI text)
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }) {
  const pathname = usePathname(); // ✅ correct hook
  const isLoginPath = pathname?.startsWith("/login");
  const isSigninPath = pathname?.startsWith("/signin");
  const isForgetPassword = pathname?.startsWith("/forgot-password");
  const isSignup = pathname?.startsWith("/signin");
  const isPostProperty = pathname?.startsWith("/post-property");
  const isResetPassword = pathname?.startsWith("/reset-password");
  const isVerifyEmail = pathname?.startsWith("/verify-email");

  return (
    <Provider store={store}>
      <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
        <body className="font-sans antialiased bg-[#f9f9f9]">
          <Suspense
            fallback={
              <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
                <div className="w-12 h-12 rounded-full border-4 border-[#9b0f09]/20 border-t-[#9b0f09] animate-spin" />
              </div>
            }
          >
            <div className="flex flex-col w-full min-h-screen">
              {!isLoginPath &&
                !isSigninPath &&
                !isForgetPassword &&
                !isSignup &&
                !isPostProperty &&
                !isResetPassword &&
                !isVerifyEmail && <Header />}

              <main className="w-full">{children}</main>

              <NewFooter />
            </div>
            {/* <PropertyFinderChat /> */}
            <Toaster position="top-center" />
            <ToastProvider />
          </Suspense>
        </body>
      </html>
    </Provider>
  );
}
