"use client";
import React, { useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_IMAGE = "/assets/images/real-estate/home/location/general.jpg";
const IMAGE_BASE_PATH = "/assets/images/real-estate/home/location/";

// Actual image files available in the location folder
const LOCATION_IMAGES = [
  "Bangalore.webp",
  "Chennai.webp",
  "Coimbatore.webp",
  "Erode.webp",
  "Hosur.webp",
  "Kochi.webp",
  "Kodaikanal.webp",
  "Ooty.webp",
  "Nagerkoil.webp",
  "Mysore.webp"
];

// Build a lowercase-keyed map: { "bangalore": "Bangalore.png", ... }
const CITY_IMAGE_MAP: Record<string, string> = Object.fromEntries(
  LOCATION_IMAGES.map((file) => [file.replace(/\.[^.]+$/, "").toLowerCase(), file])
);

const breakpoints = {
  320: { slidesPerView: 2, spaceBetween: 14 },
  480: { slidesPerView: 2.2, spaceBetween: 16 },
  990: { slidesPerView: 3.2, spaceBetween: 20 },
  1180: { slidesPerView: 4.2, spaceBetween: 20 },
  1400: { slidesPerView: 4, spaceBetween: 20 },
  1500: { slidesPerView: 5, spaceBetween: 24 },
};

const PropertyByCity = ({ cityList = [] }) => {
  const router = useRouter();
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleClick = (city) => {
    router.push(`/property-list?location=${city?.id}`);
  };

  const getCityImage = (name: string) => {
    if (!name) return DEFAULT_IMAGE;
    const normalized = name.toLowerCase().trim();
    // Also try matching without spaces (e.g. "New York" -> "newyork")
    const filename = CITY_IMAGE_MAP[normalized] || CITY_IMAGE_MAP[normalized.replace(/\s+/g, "")];
    return filename ? `${IMAGE_BASE_PATH}${filename}` : DEFAULT_IMAGE;
  };

  return (
    <section className="section-pad bg-white overflow-hidden">
      <div className="section-wid pb-2 md:pb-5">
         <div className="flex flex-col md:flex-row justify-between items-start mb-5 md:mb-10 ">
        <div className=" ">
          <h2 className="section-ti">Properties by Cities</h2>
          <p className="section-cap mb-0 md:mb-4">Explore top cities with the best real estate opportunities</p>
        </div>

        {cityList.length > 6 && <div className="flex items-center gap-3  mt-4 lg:mt-0">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b0f09] hover:border-[#9b0f09] hover:text-white text-gray-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b0f09] hover:border-[#9b0f09] hover:text-white text-gray-500 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>}

          </div>

        <Swiper
          modules={[Autoplay]}
          breakpoints={breakpoints}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={cityList.length > 4}
          // onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {cityList.map((city, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => handleClick(city)}
                className="relative cursor-pointer rounded-2xl overflow-hidden group h-[240px] md:h-[340px]"
                // style={{ height: "340px" }}
              >
                <img
                  src={getCityImage(city.name)}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE;
                  }}
                />

                {/* Gradient overlay — stronger at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                  <h4 className="text-white text-[17px] leading-tight mb-2">
                    {city.name}
                  </h4>
                  <p className="text-xs md:text-sm bg-white/80 px-2 py-1 md:px-3 md:py-2 rounded-lg w-fit mb-0">
                    <span className="text-black font-bold">{city.property_count}</span>
                    <span className="text-black/90 ml-1 ">
                      {city.property_count === 1 ? "Property" : "Properties"} Available
                    </span>
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PropertyByCity;
