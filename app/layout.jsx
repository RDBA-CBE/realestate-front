import { Poppins, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import store from "@/store";
import { Suspense } from "react";
import NewFooter from "@/components/real-estate/NewFooter";
import { ToastProvider } from "@/components/common-components/ToastProvider";
import RootLayoutClient from "@/components/common-components/root-layout";
import { SITE_URL } from "@/utils/seo.utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Boom Realty | Find Properties for Sale & Lease",
    template: "%s | Boom Realty",
  },
  description:
    "Discover verified residential and commercial properties for sale and lease across India. Browse apartments, villas, plots, and more on Boom Realty.",
  keywords: [
    "real estate",
    "properties for sale",
    "properties for lease",
    "apartments",
    "villas",
    "plots",
    "Boom Realty",
    "India real estate",
  ],
  authors: [{ name: "Boom Realty", url: SITE_URL }],
  creator: "Boom Realty",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Boom Realty",
    title: "Boom Realty | Find Properties for Sale & Lease",
    description:
      "Discover verified residential and commercial properties for sale and lease across India.",
    images: [
      {
        url: `${SITE_URL}/assets/home/boom-logo.png`,
        width: 1200,
        height: 630,
        alt: "Boom Realty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boom Realty | Find Properties for Sale & Lease",
    description:
      "Discover verified residential and commercial properties for sale and lease across India.",
    images: [`${SITE_URL}/assets/home/boom-logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${robotoFlex.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/images/real-estate/home/heropage.webp"
          fetchPriority="high"
        />
      </head>
      <body className="font-sans antialiased bg-[#f9f9f9]">
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
              <div className="w-12 h-12 rounded-full border-4 border-[#9b0f09]/20 border-t-[#9b0f09] animate-spin" />
            </div>
          }
        >
          <RootLayoutClient>{children}</RootLayoutClient>
          <Toaster position="top-center" />
          <ToastProvider />
        </Suspense>
      </body>
    </html>
  );
}
