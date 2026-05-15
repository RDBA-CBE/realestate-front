"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 30 },
    1180: { slidesPerView: 3, spaceBetween: 30 },
    1300: { slidesPerView: 4, spaceBetween: 30 },
  };

function DeveloperCard({ developer }: { developer: any }) {
  const router = useRouter();

  const name = developer?.industry || `${developer?.first_name ?? ""} ${developer?.last_name ?? ""}`.trim();
  const projectCount = developer?.total_project_count ?? 0;
  const propertyCount = developer?.total_properties_count ?? 0;
  const description = developer?.description;
  const logo = developer?.developer_image || developer?.profile_image;

  // first project image from developer's projects/properties
  const projectName = developer?.projects?.[0]?.name || developer?.latest_project_name || null;
  const projectImage = developer?.projects?.[0]?.primary_image || developer?.latest_project_image || null;

  return (
    <div
      onClick={() => router.push(`/property-list?developerId=${developer?.id}`)}
      className="cursor-pointer border border-[#e0e0e0] rounded-2xl bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Top: logo + name + project count */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className="w-14 h-14 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-7 h-7 text-gray-400" />
          )}
        </div>
        <div >
          <h3 className="section-in-ti">{name}</h3>
          <div className="flex gap-3 mt-0.5"> <p >{projectCount} Project</p> <p >{propertyCount} Properties</p> </div>
          
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-3 flex-grow">
        {description ? (
          <p className="line-clamp-3">{description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No description available.</p>
        )}
      </div>

      {/* Bottom: project name + image
      <div className="px-4 pb-4">
        {projectName && (
          <h4 className="text-sm font-bold text-gray-900 mb-2">{projectName}</h4>
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
      </div> */}
    </div>
  );
}

export default function FeaturedDevelopers({ developerList }: { developerList: any[] }) {
  if (!developerList?.length) return null;

  return (
    <section className="section-pad bg-[#f8f8f8]">
      <div className="section-wid">
        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-12">
          <div className="mb-6 lg:mb-0">
            <h2 className="section-ti">Featured Developers</h2>
            <p className="section-cap">
              Explore top real estate developers and their latest projects
            </p>
          </div>
        </div>

        <Swiper
          modules={[Autoplay]}
          breakpoints={breakpoints}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={developerList.length > 4}
          className="pb-10"
        >
          {developerList.map((developer, index) => (
            <SwiperSlide key={index} className="h-auto">
              <DeveloperCard developer={developer} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
