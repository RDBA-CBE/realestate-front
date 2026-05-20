// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { ArrowRight } from "lucide-react";
// import { url } from "inspector";

// const HowItWorks = () => {
//   const router = useRouter();

//   const OnTypeClick = (card) => {
//     const params = new URLSearchParams();
//     params.append("type", card.type);
//     // router.push(`/property-list?${params.toString()}`);
//     router.push(`${card.url}`);
//   };

//   const cards = [
//     {
//       title: "Looking for the new home?",
//       description: "10 new offers every day. 350 offers on site, trusted by a community of thousands of users.",
//       buttonText: "Get Started",
//       image: "/assets/images/real-estate/property-buy.png",
//       type: "Sale",
//       url: "/property-list?type=Sale",
//       bg: "#9b0f09",
//       border:"none",
//       text:"#ffff",
//       buttonClr:"#fff",
//       buttonTextClr:"#9b0f09"
//     },
//     {
//       title: "Want to sell your home?",
//       description: "10 new offers every day. 350 offers on site, trusted by a community of thousands of users.",
//       buttonText: "Get Started",
//       image: "/assets/images/real-estate/property-rent.png",
//       type: "Lease",
//       url: "/post-property",
      
//       bg: "####",
//       border:"1px solid #9b0f09"
//     },
//   ];

//   return (
//     <div className="section-pad bg-white">
//       <div className="  section-wid">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {cards.map((card, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between rounded-2xl px-12 py-16 gap-6"
//               style={{ backgroundColor: card.bg, border:card.border, color:card.text }}
//             >
//               {/* Left Content */}
//               <div className="flex-1">
//                 <h3 className="section-ti mb-3 "  style={{  color:card.text }}>
//                   {card.title}
//                 </h3>
//                 <p className=" mb-6 max-w-xs">
//                   {card.description}
//                 </p>
//                 <button
//                   onClick={() => OnTypeClick(card)}
//                   className="flex items-center gap-2 bg-dred hover:bg-[#fff6f6] hover:text-[#9b0f09] text-white hover:border hover:border-[#9b0f09] px-5 py-2.5 rounded-full transition-colors"
//                   style={{  backgroundColor: card.buttonClr , color:card.buttonTextClr}}
//                 >
//                   {card.buttonText} <ArrowRight size={14} />
//                 </button>
//               </div>

//               {/* Right Image */}
//               <div className="shrink-0 hidden lg:block">
//                 <img
//                   src={card.image}
//                   alt={card.title}
//                   className="w-28 h-28 object-contain"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HowItWorks;


"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const router = useRouter();

  const OnTypeClick = (card) => {
    router.push(`${card.url}`);
  };

  const cards = [
    {
      title: "Looking for the new home?",
      description:
        "10 new offers every day. 350 offers on site, trusted by a community of thousands of users.",
      buttonText: "Get Started",
      image: "/assets/images/real-estate/home/hit-in-buy.png",
      bgImage:
        "/assets/images/real-estate/home/Buy.png",
      url: "/property-list?type=Sale",
    },
    {
      title: "Want to sell your home?",
      description:
        "10 new offers every day. 350 offers on site, trusted by a community of thousands of users.",
      buttonText: "Get Started",
      image: "/assets/images/real-estate/home/hit-in-sale.png",
      bgImage:
        "/assets/images/real-estate/home/Sale.png",
      url: "/post-property",
    },
  ];

  return (
    <section className="section-pad bg-white">
      <div className="section-wid py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl min-h-[360px] group"
            >
              {/* Background Image */}
              <img
                src={card.bgImage}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Overlay */}
               <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20 z-[1]" />

              {/* Floating Content Card */}
              <div className="absolute bottom-5 left-5 right-5 z-[2]">
                <div className="bg-white/10 rounded-2xl px-5 py-8 flex items-center justify-between gap-4 shadow-xl">
                  {/* Left Content */}
                  <div className="flex-1">
                    <h3 className="section-in-ti mb-2 !text-white">
                      {card.title}
                    </h3>

                    <p className=" mb-4 max-w-md leading-relaxed !text-white">
                      {card.description}
                    </p>

                    <button
                      onClick={() => OnTypeClick(card)}
                      className="flex items-center gap-2 bg-dred hover:bg-[#fff6f6] hover:text-[#9b0f09] text-sm text-white hover:border hover:border-[#9b0f09] px-5 py-2 rounded-full transition-colors"
                    >
                      {card.buttonText}
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Right Small Image */}
                  <div className="hidden sm:block shrink-0">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;