"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { url } from "inspector";

const HowItWorks = () => {
  const router = useRouter();

  const OnTypeClick = (card) => {
    const params = new URLSearchParams();
    params.append("type", card.type);
    // router.push(`/property-list?${params.toString()}`);
    router.push(`${card.url}`);
  };

  const cards = [
    {
      title: "Looking for the new home?",
      description: "10 new offers every day. 350 offers on site, trusted by a community of thousands of users.",
      buttonText: "Get Started",
      image: "/assets/images/real-estate/property-buy.png",
      type: "Sale",
      url: "/property-list?type=Sale",
      bg: "#f7f7f7",
    },
    {
      title: "Want to sell your home?",
      description: "10 new offers every day. 350 offers on site, trusted by a community of thousands of users.",
      buttonText: "Get Started",
      image: "/assets/images/real-estate/property-rent.png",
      type: "Lease",
      url: "login",
      bg: "#fff6f6",
    },
  ];

  return (
    <div className="section-pad bg-white">
      <div className="  section-wid py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl px-12 py-16 gap-6"
              style={{ backgroundColor: card.bg }}
            >
              {/* Left Content */}
              <div className="flex-1">
                <h3 className="section-ti mb-3 ">
                  {card.title}
                </h3>
                <p className=" mb-6 max-w-xs">
                  {card.description}
                </p>
                <button
                  onClick={() => OnTypeClick(card)}
                  className="flex items-center gap-2 bg-dred hover:bg-[#fff6f6] hover:text-[#9b0f09] text-white hover:border hover:border-[#9b0f09] px-5 py-2.5 rounded-full transition-colors"
                >
                  {card.buttonText} <ArrowRight size={14} />
                </button>
              </div>

              {/* Right Image */}
              <div className="shrink-0 hidden lg:block">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-28 h-28 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
