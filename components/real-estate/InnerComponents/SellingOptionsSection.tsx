import React from "react";
import { BadgeDollarSign, Clock3, Building2 } from "lucide-react";

const items = [
  {
    title: "Find Excellent Deals",
    desc: "We offer complete real estate services for buying, selling, and renting.",
    icon: BadgeDollarSign,
  },
  {
    title: "Friendly Host & Fast Support",
    desc: "We offer complete real estate services for buying, selling, and renting.",
    icon: Clock3,
  },
  {
    title: "List Your Own Property",
    desc: "We offer complete real estate services for buying, selling, and renting.",
    icon: Building2,
  },
   {
    title: "List Your Own Property",
    desc: "We offer complete real estate services for buying, selling, and renting.",
    icon: Building2,
  },
];

export default function SellingOptionsSection() {
  return (
    <section className="section-pad bg-[#fff] !pt-2 md:!pt-0 !pb-0 md:!pb-[40px]">
      <div className="section-wid ">
        {/* Heading */}
        <div className="mx-auto mb-8 md:mb-14 max-w-2xl text-center">
          <h2 className="section-ti">
            Let&apos;s Find The Right Selling Option For You
          </h2>

          <p className="section-cap mt-3">
            We offer complete real estate services for buying, selling, and
            renting residential properties.
          </p>
        </div>

        {/* Layout */}
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Big Image */}
          <div className="relative  h-[400px] md:h-full overflow-hidden rounded-2xl">
            <img
              src="/assets/images/real-estate/home/selling-opt-2.webp"
              alt="Property"
              className="h-full w-full object-cover"
            />

            {/* Overlay Card */}
            <div className="absolute right-6 left-6 bottom-6 md:right-0 md:left-6 max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="section-in-ti leading-snug">
                Find Excellent Property Deals Near You
              </h3>

              <p className="mt-3 leading-relaxed ">
                We offer complete real estate services for buying, selling, and
                renting residential properties.
              </p>
            </div>
          </div>

          {/* Right Side Features */}
          <div className="flex h-full flex-col divide-y divide-gray-200">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="py-3 first:pt-2 pt-5 last:pb-0">
                  {/* <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#9b0f09] bg-white shadow-sm">
                    <Icon className="h-7 w-7 text-[#9b0f09]" />
                  </div> */}
                  {/* <h3 className="section-in-ti mt-5 leading-snug">
                    {item.title}
                  </h3> */}

                    <div className="flex  gap-3 ">
                    <Icon className="h-7 w-7 text-[#9b0f09]" />
                    <h3 className="section-in-ti leading-snug mb-2.5">
                    {item.title}
                  </h3>
                  </div>

                  

                  <p className="ms-1 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
