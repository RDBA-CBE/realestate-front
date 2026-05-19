"use client";
import React, { useRef } from "react";
import {
  Building2,
  Home,
  Landmark,
  Store,
  Hotel,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
// import "swiper/css";

const icons = [Home, Landmark, Building2, Building, Hotel, Store];

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
      <div className="section-wid mx-auto pb-5">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 ">
          <div>
            <h2 className="section-ti">Explore Property Types</h2>
            <p className="section-cap">Lorem ipsum dolor sit amet</p>
          </div>
          {/* Nav Arrows */}
          {propertyTypeList.length > 6 && <div className="flex items-center gap-3 mt-4 md:mt-0">
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
          </div>}
        </div>

        {/* Swiper Cards */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
            if (typeof swiper.params.navigation === "object" && swiper.params.navigation) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
        >
          {propertyTypeList.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <SwiperSlide key={index}>
                <div
                  onClick={() => handleClick(item)}
                  className="bg-white rounded-2xl h-[180px] flex flex-col items-center justify-center text-center border border-gray bg-lred hover:shadow-lg transition duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-dred flex text-white items-center justify-center mb-5 border border-[#9b0f09]">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="section-in-ti">{item.name}</h3>
                  <p>{item.properties_count} Properties</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default PropertyByType;