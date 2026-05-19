"use client";
import React, { useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Distinct city skyline images — one per slot, cycles if more cities than images
const CITY_IMAGES = [
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=700&fit=crop", // city skyline night
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=700&fit=crop", // glass buildings
  "https://images.unsplash.com/photo-1573108724029-4c46571d6490?w=600&h=700&fit=crop", // city lights night
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&h=700&fit=crop", // miami beach
  "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=700&fit=crop", // downtown dusk
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=700&fit=crop", // city bridge
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=700&fit=crop", // urban street
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=700&fit=crop", // skyscrapers
  "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=700&fit=crop", // coastal city
  "https://images.unsplash.com/photo-1573108724029-4c46571d6490?w=600&h=700&fit=crop", // city aerial
];

const breakpoints = {
  320: { slidesPerView: 1.3, spaceBetween: 14 },
  480: { slidesPerView: 2.2, spaceBetween: 16 },
  768: { slidesPerView: 3.2, spaceBetween: 20 },
  1180: { slidesPerView: 4.2, spaceBetween: 24 },
  1400: { slidesPerView: 5, spaceBetween: 24 },
};

const PropertyByCity = ({ cityList = [] }) => {
  const router = useRouter();
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleClick = (city) => {
    router.push(`/property-list?location=${city?.id}`);
  };

  return (
    <section className="section-pad bg-white overflow-hidden">
      <div className="section-wid pb-5">
         <div className="flex flex-col md:flex-row justify-between items-start mb-10 ">
        <div className=" ">
          <h2 className="section-ti">Properties by Cities</h2>
          <p className="section-cap">Explore top cities with the best real estate opportunities</p>
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
                className="relative cursor-pointer rounded-2xl overflow-hidden group"
                style={{ height: "340px" }}
              >
                {/* Unique image per index */}
                <img
                  src={CITY_IMAGES[index % CITY_IMAGES.length]}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay — stronger at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-white font-bold text-[17px] leading-tight mb-1">
                    {city.name}
                  </h4>
                  <p className="text-sm bg-white/80 px-3 py-2 rounded-lg w-fit ">
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
