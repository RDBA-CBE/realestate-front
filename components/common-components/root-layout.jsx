"use client";

import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import store from "@/store";
import Header from "@/components/common-components/header";
import NewFooter from "@/components/real-estate/NewFooter";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const hideHeader =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signin") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/post-property") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verify-email");

  return (
    <Provider store={store}>
      <div className="flex flex-col w-full min-h-screen">
        {!hideHeader && <Header />}
        <main className="w-full flex-1 min-h-[calc(100vh-80px)]">{children}</main>
        <NewFooter />
      </div>
    </Provider>
  );
}
