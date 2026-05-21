"use client";
import React, { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
// import "swiper/css";

const PROP_TYPE_IMAGES: Record<string, string> = {
  agri: "Agri.png",
  agriculture: "Agri.png",
  agricultural: "Agri.png",
  apartment: "ApARTMENT.png",
  commercial: "Commercial.png",
  flats: "Flats.png",
  flat: "Flats.png",
  house: "hOUSE (1).png",
  industry: "ndustry.png",
  industrial: "ndustry.png",
  plot: "Plot.png",
  villa: "vILLA.png",
};

const PROP_TYPE_BASE = "/assets/images/real-estate/home/prop-type/";
const PROP_TYPE_DEFAULT = "/assets/images/real-estate/home/prop-type/Commercial.png";

const getPropTypeImage = (name: string) => {
  if (!name) return PROP_TYPE_DEFAULT;
  const normalized = name.toLowerCase().trim();
  const filename = PROP_TYPE_IMAGES[normalized] || PROP_TYPE_IMAGES[normalized.replace(/\s+/g, "")];
  return filename ? `${PROP_TYPE_BASE}${filename}` : PROP_TYPE_DEFAULT;
};

const PropertyByType = ({ propertyTypeList = [] }) => {
  const router = useRouter();
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const handleClick = (type) => {
    router.push(`/property-list?propertyType=${type?.id}`);
  };

  return (
    <section className="bg-[#f8f8f8] section-pad !pt-0">
      <div className="section-wid mx-auto ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 ">
          <div>
            <h2 className="section-ti">Explore Property Types</h2>
            <p className="section-cap">Lorem ipsum dolor sit amet</p>
          </div>
          {/* Nav Arrows */}
          {propertyTypeList.length > 6 && (
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                ref={prevRef}
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b0f09] hover:border-[#9b0f09] hover:text-white text-gray-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                ref={nextRef}
                onClick={() => swiperRef.current?.slideNext()}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b0f09] hover:border-[#9b0f09] hover:text-white text-gray-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Swiper Cards */}
        <div className="overflow-hidden pt-10">
          <Swiper
            className="!overflow-visible"
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 16 },
              500: { slidesPerView: 2, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 20 },
              860: { slidesPerView: 3, spaceBetween: 20 },
              
              1024: { slidesPerView: 4 , spaceBetween: 20},
              1400: { slidesPerView: 5 , spaceBetween: 20},
              1600: { slidesPerView: 6 , spaceBetween: 24},
            }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
              if (
                typeof swiper.params.navigation === "object" &&
                swiper.params.navigation
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
          >
            {propertyTypeList.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                 <div className="pb-5 ">
  <div
    onClick={() => handleClick(item)}
    className="bg-white rounded-2xl h-[180px] flex flex-col items-center text-center cursor-pointer relative transition-all duration-300 hover:-translate-y-1"
    style={{
      background: `url(/assets/images/real-estate/home/prop-frame.png)`,
      backgroundSize: "cover",
      width: "100%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      boxShadow: "0 10px 10px rgba(0,0,0,0.08)",
    }}
  >
    <div className="w-20 h-20 rounded-2xl bg-dred flex text-white items-center justify-center border border-[#9b0f09] absolute -top-8 z-50 shadow-md">
      <img
        src={getPropTypeImage(item.name)}
        alt={item.name}
        className="w-10"
        onError={(e) => { e.currentTarget.src = PROP_TYPE_DEFAULT; }}
      />
    </div>
    <h3 className="section-in-ti mt-[80px]">{item.name}</h3>
    <p>{item.properties_count} Properties</p>
  </div>
</div>
              </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PropertyByType;
