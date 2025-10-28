import React, { useState } from "react";

const BannerSection = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("Buy");

  // Dynamic placeholder based on selected tab
  const placeholderText = `Enter an address, neighborhood, city, or ZIP code for ${activeTab}`;

  return (
    <section
      className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        height: "860px",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://homez-appdir.vercel.app/_next/static/media/home-1.14c0d866.jpg')",
      }}
    >
      <div className="container mx-auto px-4 text-center relative">
        {/* Subheading */}
        <h3 className="text-sm md:text-base font-medium text-white mb-3 uppercase tracking-widest">
          The Best Way To
        </h3>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Find Your Dream Home
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-200 mb-10">
          We’ve more than 745,000 apartments, places & plots.
        </p>

        {/* Search Card */} 
        <div className="bg-[#ffffff2b] shadow-2xl rounded-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b">
            {["Buy", "Rent", "Sold"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-semibold text-sm md:text-base transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-[#a9a7a7] text-white"
                    : "text-[#131212fa] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center gap-3 p-4 md:p-10">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder={placeholderText}
                className="w-full px-5 py-3 rounded-lg bg-transparent border border-[#a9a7a7] text-white placeholder-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition whitespace-nowrap">
                Advanced
              </button>
              <button className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
