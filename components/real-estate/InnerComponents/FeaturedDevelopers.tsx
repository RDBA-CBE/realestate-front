// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";

// import { Building2, ArrowUpRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { truncateText } from "@/utils/function.utils";

// const breakpoints = {
//   320: { slidesPerView: 1, spaceBetween: 16 },
//   640: { slidesPerView: 2, spaceBetween: 30 },
//   1180: { slidesPerView: 3, spaceBetween: 30 },
//   1300: { slidesPerView: 3, spaceBetween: 30 },
// };

// function DeveloperCard({ developer }: { developer: any }) {
//   const router = useRouter();

//   const name =
//     developer?.industry ||
//     `${developer?.first_name ?? ""} ${developer?.last_name ?? ""}`.trim();

//   const projectCount = developer?.total_project_count ?? 0;
//   const propertyCount = developer?.total_properties_count ?? 0;

//   const description = developer?.description;

//   const logo =
//     developer?.developer_image || developer?.profile_image;

//   const projectName =
//     developer?.projects?.[0]?.name ||
//     developer?.latest_project_name ||
//     null;

//   const projectImage =
//     developer?.projects?.[0]?.primary_image ||
//     developer?.latest_project_image ||
//     null;

//   return (
//     <div
//       onClick={() =>
//         router.push(`/developer/${developer?.slug}`)
//       }
//       className="group cursor-pointer border border-gray-100 rounded-2xl bg-dred p-7 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:z-20 flex flex-col h-full w-full relative"
//     >
//       {/* Action Indicator */}
//       <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 transition-all duration-500 group-hover:bg-white/30 group-hover:text-white group-hover:rotate-45">
//         <ArrowUpRight className="w-5 h-5" />
//       </div>

//       {/* Logo Branding */}
//       <div className="w-20 h-20 mb-4 flex-shrink-0 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-md">
//         <div className="relative w-full h-full flex items-center justify-center">
//           {logo ? (
//             <img
//               src={logo}
//               alt={name}
//               className="w-full h-full object-contain p-0"
//             />
//           ) : (
//             <Building2 className="w-8 h-8 text-gray-400" />
//           )}
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-grow flex flex-col">
//         <h3 className="section-in-ti !text-white mb-2 break-words">
//           {name}
//         </h3>

//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
//             {projectCount} Projects
//           </span>
//           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-dred">
//             {propertyCount} Listings
//           </span>
//         </div>

//         {description ? (
//           <p className="text-white/80 break-words">
//             {truncateText(description, 130)}
//           </p>
//         ) : (
//           <p className="text-xs text-gray-400 italic">
//             No description available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function FeaturedDevelopers({
//   developerList,
// }: {
//   developerList: any[];
// }) {
//   const hasDevelopers = !!developerList?.length;

//   return (
//     <section className="section-pad bg-white ">
//       <div className="section-wid pb-5">

//         {/* Heading */}
//         <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-5">

//           <div className=" lg:mb-0">
//             <h2 className="section-ti">
//               Featured Developers
//             </h2>

//             <p className="section-cap">
//               Explore top real estate developers and their latest projects
//             </p>
//           </div>

//         </div>

//         {/* Slider */}
//         {hasDevelopers ? (
//           <Swiper
//             modules={[Autoplay]}
//             breakpoints={breakpoints}
//             autoplay={{
//               delay: 3500,
//               disableOnInteraction: false,
//             }}
//             loop={developerList.length > 4}
//             className="developer-swiper !overflow-visible pt-12 pb-16"
//           >
//             {developerList.map((developer, index) => (
//               <SwiperSlide
//                 key={index}
//                 className="h-auto flex"
//               >
//                 <DeveloperCard developer={developer} />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         ) : (
//           <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">

//             <p className="text-lg font-medium">
//               No featured developers available right now.
//             </p>

//             <p className="mt-2">
//               Check back later or remove the developer filter
//               to load more listings.
//             </p>

//           </div>
//         )}
//       </div>

//       <style jsx global>{`
//         .developer-swiper .swiper-wrapper {
//           align-items: stretch;
//         }

//         .developer-swiper .swiper-slide {
//           height: auto;
//           display: flex;
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Building2, ArrowUpRight, Building, LayoutGrid } from "lucide-react";

import { useRouter } from "next/navigation";
import { truncateText } from "@/utils/function.utils";
import Link from "next/link";


const breakpoints = {
  320: { slidesPerView: 1, spaceBetween: 16 },
  600: { slidesPerView: 1.5, spaceBetween: 20 },

  780: { slidesPerView: 2, spaceBetween: 20 },
  1180: { slidesPerView: 3, spaceBetween: 20 },
  1300: { slidesPerView: 3, spaceBetween: 20 },
  1500: { slidesPerView: 3, spaceBetween: 24 },
};

function DeveloperCard({ developer }: { developer: any }) {
  const router = useRouter();

  const name =
    developer?.industry ||
    `${developer?.first_name ?? ""} ${developer?.last_name ?? ""}`.trim();

  const projectCount = developer?.total_project_count ?? 0;
  const propertyCount = developer?.total_properties_count ?? 0;

  const description = developer?.description;

  const logo = developer?.developer_image || developer?.profile_image;

  return (
    <div
      onClick={() => router.push(`/developer/${developer?.slug}`)}
      className="group cursor-pointer bg-white rounded-2xl py-10 px-5 lg:px-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
    >
      {/* Arrow */}
      <div className="absolute top-3 right-3 md:top-5 md:right-5 w-8 h-8 rounded-full bg-[#fdf1f1] flex items-center justify-center text-dred transition-all duration-300 group-hover:rotate-45">
        <ArrowUpRight className="w-4 h-4" />
      </div>

      <div className="flex items-start gap-4 pb-3">
        {/* Logo */}
        <div className="w-20 h-20 rounded-xl border border-gray-100 overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-2xl">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <Building2 className="w-7 h-7 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="section-in-ti text-black mb-2  ">{name}</h3>
          <div className="border-b border-[1.4px] border-dred  w-[20%] mb-4" />

          {/* Counts */}
          <div className="flex items-center gap-4 mb-3 ">
            <div className="flex items-center gap-1">
              {/* <LayoutGrid size={13} /> */}
              <img
                src="/assets/images/real-estate/home/dev-icon-1.png"
                alt=""
                className="w-5"
              />
              <span>{projectCount} Projects</span>
            </div>

            <div className="flex items-center gap-1">
              {/* <Building size={13} /> */}
              <img
                src="/assets/images/real-estate/home/dev-icon-2.png"
                alt=""
                className="w-5"
              />

              <span>{propertyCount} Listings</span>
            </div>
          </div>
        </div>
      </div>
      {/* Description */}
      <p className=" leading-relaxed pb-0">
        {description ? (
          <>
            {truncateText(description, 150)}{" "}
            <Link href={`/developer/${developer?.slug}`} className="text-dred hover:underline">read more </Link>
          </>
        ) : (
          "No description available."
        )}
      </p>
    </div>
  );
}

export default function FeaturedDevelopers({
  developerList,
}: {
  developerList: any[];
}) {
  const hasDevelopers = !!developerList?.length;

  return (
    <section
      className="section-pad overflow-hidden relative "
      style={{
        background: ` url('/assets/images/real-estate/home/developers1.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="section-wid pb-5">
        {/* Heading */}
        <div className="mb-10 relative z-10">
          <h2 className="section-ti !text-white">Featured Developers</h2>

          <p className="section-cap !text-white/90">
            Find exceptional properties from leading developers designed with quality, innovation and reliability
          </p>
        </div>

        {/* Slider */}
        {hasDevelopers ? (
          <Swiper
            modules={[Autoplay]}
            breakpoints={breakpoints}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={developerList.length > 3}
            className="developer-swiper !overflow-visible"
          >
            {developerList.map((developer, index) => (
              <SwiperSlide key={index} className="h-auto">
                <DeveloperCard developer={developer} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-8 text-center text-white">
            <p className="text-lg font-medium">
              No featured developers available right now.
            </p>

            <p className="mt-2 text-white/80">
              Check back later to explore more developers.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .developer-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .developer-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
      `}</style>
    </section>
  );
}
