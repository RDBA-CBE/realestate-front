"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content:
      "We collect various types of information to provide and improve our Services. This includes Personal Data (name, email, phone, address), Usage Data (IP address, browser type, pages visited, time spent), and Tracking & Cookies Data to monitor activity and hold session information.",
    list: [
      "Personal Data: name, email address, phone number, and address",
      "Usage Data: IP address, browser type, pages visited, time and date of visit",
      "Tracking & Cookies Data: used to track activity and hold certain information",
    ],
  },
  {
    number: "02",
    title: "How We Use Your Information",
    content: "Real Estate uses the collected data for the following purposes:",
    list: [
      "To provide and maintain our Services",
      "To notify you about changes to our Services",
      "To allow participation in interactive features",
      "To provide customer support",
      "To gather analysis to improve our Services",
      "To monitor usage and detect technical issues",
      "To send news, special offers, and relevant information",
    ],
  },
  {
    number: "03",
    title: "How We Share Your Information",
    content: "We may share your personal information in the following situations:",
    list: [
      "With Service Providers: to monitor and analyze use of our Services",
      "For Business Transfers: in connection with any merger or acquisition",
      "With Affiliates: who are required to honor this Privacy Policy",
      "With Your Consent: for any other purpose with your explicit consent",
    ],
  },
  {
    number: "04",
    title: "Your Data Protection Rights",
    content:
      "Depending on your location, you may have the following data protection rights:",
    list: [
      "The right to access, update, or delete your information",
      "The right of rectification",
      "The right to object to processing",
      "The right of restriction",
      "The right to data portability",
      "The right to withdraw consent at any time",
    ],
  },
  {
    number: "05",
    title: "Security of Your Data",
    content:
      "The security of your data is important to us. While we strive to use commercially acceptable means to protect your Personal Data, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.",
  },
  {
    number: "06",
    title: "Changes to This Privacy Policy",
    content:
      "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically. Changes are effective when posted.",
  },
];

const PrivacyPolicyPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="  bg-dred h-[65px] md:h-[70px] flex items-center justify-center overflow-hidden">
        
       
        <div className=" text-center text-white ">
          
          <h1 className="text-2xl md:text-2xl text-white pb-0 mb-0">
            Privacy Policy
          </h1>
         
        </div>
      </section>

      <section className="section-pad">
        <div className="section-wid">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#f8f8f8] rounded-2xl p-8 sticky top-28">
                <div className="w-14 h-14 bg-dred rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="text-white w-7 h-7" />
                </div>
                <h2 className="section-in-ti mb-3">
                  Our Commitment to Your Privacy
                </h2>
                <p className=" text-sm leading-relaxed mb-6">
                  This policy describes how Real Estate collects, uses, and
                  shares your personal information when you use our Services.
                </p>
                <div className="border-t border-gray-200 pt-6 space-y-2">
                  {sections.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setOpenIndex(i)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        openIndex === i
                          ? "bg-dred text-white font-medium"
                          : " hover:bg-gray-200"
                      }`}
                    >
                      {s.number}. {s.title}
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Last updated: January 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            <div className="lg:col-span-2 space-y-4">
              {sections.map((s, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-dred bg-red-50 px-2 py-1 rounded-md">
                        {s.number}
                      </span>
                      <span className="section-in-ti !text-[17px]">
                        {s.title}
                      </span>
                    </div>
                    {openIndex === i ? (
                      <ChevronUp className="w-5 h-5 text-dred flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === i && (
                    <div className="px-7 pb-6">
                      <div className="h-px bg-gray-100 mb-5" />
                      <p className=" leading-relaxed text-[15px] mb-4">
                        {s.content}
                      </p>
                      {s.list && (
                        <ul className="space-y-2">
                          {s.list.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-[15px] ">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Contact */}
              <div className="bg-dred rounded-2xl p-8 text-white mt-6">
                <h3 className="text-xl font-semibold mb-2">
                  Questions About Privacy?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us by email.
                </p>
                <a
                  href="mailto:privacy@realestate.com"
                  className="inline-block bg-white text-dred font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
                >
                  privacy@realestate.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
