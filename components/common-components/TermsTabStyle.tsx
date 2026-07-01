import { ChevronDown, ChevronUp, FileText, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

const TermsTabStyle = ({sections}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="grid lg:grid-cols-3 gap-12 items-start">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-[#f8f8f8] rounded-2xl p-8 sticky top-28">
          <div className="w-14 h-14 bg-dred rounded-2xl flex items-center justify-center mb-6">
            <FileText className="text-white w-7 h-7" />
          </div>
          <h2 className="section-in-ti mb-3">Agreement to Our Terms</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Welcome to Real Estate! By accessing or using our Services, you
            agree to be bound by these Terms and our Privacy Policy.
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
            <p className="text-xs text-gray-400">Last updated: January 2025</p>
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
                <span className="section-in-ti !text-[17px]">{s.title}</span>
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
          <h3 className="text-xl font-semibold mb-2">Have Questions?</h3>
          <p className="text-white/80 text-sm mb-4">
            If you have any questions about these Terms, feel free to reach out
            to us.
          </p>
          <a
            href="mailto:info@boomrealtys.com"
            className="inline-block bg-white text-dred font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            info@boomrealtys.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsTabStyle;
