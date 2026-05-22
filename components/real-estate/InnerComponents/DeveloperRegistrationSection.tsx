"use client";
import { useRouter } from "next/navigation";
import { Building2, BadgeCheck, TrendingUp, Users } from "lucide-react";

const perks = [
  {
    icon: Building2,
    title: "List Your Properties",
    desc: "Showcase your projects to thousands of active buyers and renters across the platform.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    desc: "Reach a wider audience and close deals faster with our powerful listing tools.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Developer Badge",
    desc: "Build trust with buyers through our verified developer profile and credibility badge.",
  },
  {
    icon: Users,
    title: "Connect With Buyers",
    desc: "Get direct inquiries from serious buyers and renters looking for properties like yours.",
  },
];

export default function DeveloperRegistrationSection() {
  const router = useRouter();

  return (
    <section className="section-pad py-10" style={{background:`url(/assets/images/real-estate/home/dev-2.webp)`, backgroundSize:"cover", width:"100%", height:"100%", backgroundPosition:"center", backgroundRepeat:"no-repeat"}}>
      <div className="section-wid pt-5 pb-5">
        <div className="flex flex-col xl:flex-row  gap-10  xl:gap-20">

          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block text-sm  text-white uppercase tracking-widest mb-3">
              For Developers
            </span>
            <h2 className="section-ti mb-4 !text-white">
              Register as a Developer &amp; List Your Properties
            </h2>
            <p className="section-cap mb-4 xl:mb-8 max-w-lg mx-auto lg:mx-0 !text-white">
              Join our growing network of trusted real estate developers. Post your projects, reach verified buyers, and grow your business with ease.
            </p>
            <button
              onClick={() => router.push("/post-property")}
              className="inline-flex items-center gap-2 bg-dred hover:bg-red-800 text-white px-8 py-3 rounded-full transition-colors duration-200 shadow-md "
            >
              <Building2 className="w-5 h-5 !text-white" />
              Register &amp; Post Property
            </button>
          </div>

          {/* Right perks grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 border border-[#d1d0d0] p-5 rounded-2xl bg-white"
                >
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full border border-[#9b0f09] bg-white shadow-sm">
                    <Icon className="h-6 w-6 text-[#9b0f09]" />
                  </div>
                  <div>
                    <h3 className="section-in-ti mb-1">{perk.title}</h3>
                    <p className=" leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
