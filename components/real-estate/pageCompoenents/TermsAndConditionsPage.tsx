"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Use of Services",
    content:
      "You must be at least 18 years old to use our Services. You agree to use the Services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Services. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our Services.",
  },
  {
    number: "02",
    title: "User Accounts",
    content:
      "To access certain features of our Services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
  },
  {
    number: "03",
    title: "Intellectual Property",
    content:
      "All content on our Services, including text, graphics, logos, images, and software, is the property of Real Estate or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.",
  },
  {
    number: "04",
    title: "Disclaimers and Limitation of Liability",
    content:
      'Our Services are provided "as is" without any warranties, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content or information provided through our Services. To the fullest extent permitted by law, Real Estate shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Services.',
  },
  {
    number: "05",
    title: "Governing Law",
    content:
      "These Terms shall be governed by and construed in accordance with the applicable laws, without regard to its conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.",
  },
  {
    number: "06",
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.",
  },
];

const TermsAndConditionsPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      

      <section className="  bg-dred h-[65px] md:h-[70px] flex items-center justify-center overflow-hidden">
        
       
        <div className=" text-center text-white ">
          
          <h1 className="text-2xl md:text-2xl text-white pb-0 mb-0">
            Terms &amp; Conditions
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
                  <FileText className="text-white w-7 h-7" />
                </div>
                <h2 className="section-in-ti mb-3">Agreement to Our Terms</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Welcome to Real Estate! By accessing or using our Services,
                  you agree to be bound by these Terms and our Privacy Policy.
                </p>
                <div className="border-t border-gray-200 pt-6 space-y-2">
                  {sections.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setOpenIndex(i)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        openIndex === i
                          ? "bg-dred text-white font-medium"
                          : "text-gray-600 hover:bg-gray-200"
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
                      <p className="text-gray-600 leading-relaxed text-[15px]">
                        {s.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Contact */}
              <div className="bg-dred rounded-2xl p-8 text-white mt-6">
                <h3 className="text-xl font-semibold mb-2">
                  Have Questions?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  If you have any questions about these Terms, feel free to
                  reach out to us.
                </p>
                <a
                  href="mailto:support@realestate.com"
                  className="inline-block bg-white text-dred font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
                >
                  support@realestate.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;
