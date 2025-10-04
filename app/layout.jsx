"use client";

import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/common-components/header";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import store from "@/store";
import { Suspense } from "react";
import PageTransition from "@/components/common-components/PageTransition";

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
  return (
    <Provider store={store}>
      <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
        <body className="font-sans antialiased bg-[#f7f7f7]">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col w-full min-h-screen">
              <Header />
              <main className="w-full">
                {children}
              </main>
            </div>
            <Toaster position="top-center" />
          </Suspense>
        </body>
      </html>
    </Provider>
  );
}
