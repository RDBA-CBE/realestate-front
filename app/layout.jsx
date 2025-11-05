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


  return (
    <Provider store={store}>
      <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
        <body className="font-sans antialiased bg-[#fff]">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col w-full min-h-screen">
              {!isLoginPath && !isSigninPath && !isForgetPassword && <Header />}

              <main className="w-full">{children}</main>
            </div>
            <Toaster position="top-center" />
          </Suspense>
        </body>
      </html>
    </Provider>
  );
}
