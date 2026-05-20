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
];

export default function SellingOptionsSection() {
  return (
    <section className="section-pad bg-[#fff]">
      <div className="section-wid ">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="section-ti">
            Let&apos;s Find The Right Selling Option For You
          </h2>

          <p className="section-cap mt-3">
            We offer complete real estate services for buying, selling, and
            renting residential properties.
          </p>
        </div>

        {/* Layout */}
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.7fr_1fr]">
          {/* Left Big Image */}
          <div className="relative h-full overflow-hidden rounded-3xl">
            <img
              src="/assets/images/real-estate/home/About.png"
              alt="Property"
              className="h-[400px] md:h-full w-full object-cover "
            />

            {/* Overlay Card */}
            <div className="absolute bottom-6 right-6 left-6 md:bottom-6 md:left-6 md:right-0 max-w-md rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="section-in-ti leading-snug">
                Find Excellent Property Deals Near You
              </h3>

              <p className="mt-3 text-sm text-gray-500">
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
                <div key={index} className="flex-1 py-7 first:pt-0 last:pb-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#9b0f09] bg-white shadow-sm">
                    <Icon className="h-7 w-7 text-[#9b0f09]" />
                  </div>

                  <h3 className="section-in-ti mt-5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
