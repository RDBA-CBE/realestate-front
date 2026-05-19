"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { truncateText } from "@/utils/function.utils";

const breakpoints = {
  320: { slidesPerView: 1, spaceBetween: 16 },
  640: { slidesPerView: 2, spaceBetween: 30 },
  1180: { slidesPerView: 3, spaceBetween: 30 },
  1300: { slidesPerView: 4, spaceBetween: 30 },
};

function DeveloperCard({ developer }: { developer: any }) {
  const router = useRouter();

  const name =
    developer?.industry ||
    `${developer?.first_name ?? ""} ${developer?.last_name ?? ""}`.trim();

  const projectCount = developer?.total_project_count ?? 0;
  const propertyCount = developer?.total_properties_count ?? 0;

  const description = developer?.description;

  const logo =
    developer?.developer_image || developer?.profile_image;

  const projectName =
    developer?.projects?.[0]?.name ||
    developer?.latest_project_name ||
    null;

  const projectImage =
    developer?.projects?.[0]?.primary_image ||
    developer?.latest_project_image ||
    null;

  return (
    <div
      onClick={() =>
        router.push(`/developer/${developer?.id}`)
      }
      className="cursor-pointer border border-[#e0e0e0] rounded-2xl bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full w-full"
    >
      {/* Top */}
      <div className="flex  gap-3 p-4 border-b border-gray-100">
        
        <div className="w-16 h-16 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-7 h-7 text-gray-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="section-in-ti leading-[25px] break-words">
            {name}
          </h3>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5 text-sm text-gray-600">
            <p>{projectCount} Project</p>
            <p>{propertyCount} Properties</p>
          </div>
        </div>

      </div>

      {/* Description */}
      <div className="px-4 py-3 flex-grow flex">
        {description ? (
          <p className="line-clamp-3 text-gray-700 break-words">
            {truncateText(description, 130)}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No description available.
          </p>
        )}
      </div>

      {/* Optional Bottom Section */}
      {/* 
      <div className="px-4 pb-4 mt-auto">
        {projectName && (
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            {projectName}
          </h4>
        )}

        <div className="rounded-xl overflow-hidden h-36 bg-gray-100">
          {projectImage ? (
            <img
              src={projectImage}
              alt={projectName || name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Building2 className="w-10 h-10" />
            </div>
          )}
        </div>
      </div>
      */}
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
    <section className="section-pad bg-[#f8f8f8]">
      <div className="section-wid pb-5">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-12">
          
          <div className="mb-6 lg:mb-0">
            <h2 className="section-ti">
              Featured Developers
            </h2>

            <p className="section-cap">
              Explore top real estate developers and their latest projects
            </p>
          </div>

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
            loop={developerList.length > 4}
            className="developer-swiper pb-10"
          >
            {developerList.map((developer, index) => (
              <SwiperSlide
                key={index}
                className="h-auto flex"
              >
                <DeveloperCard developer={developer} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
            
            <p className="text-lg font-medium">
              No featured developers available right now.
            </p>

            <p className="mt-2">
              Check back later or remove the developer filter
              to load more listings.
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