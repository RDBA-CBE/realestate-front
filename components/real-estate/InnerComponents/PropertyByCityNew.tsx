"use client";
import React, { useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CITY_IMAGES = [
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=700&fit=crop",
  "https://images.unsplash.com/photo-1573108724029-4c46571d6490?w=600&h=700&fit=crop",
];

const breakpoints = {
  320: { slidesPerView: 1.3, spaceBetween: 16 },
  480: { slidesPerView: 2.2, spaceBetween: 16 },
  768: { slidesPerView: 3.2, spaceBetween: 20 },
  1180: { slidesPerView: 4.2, spaceBetween: 24 },
  1400: { slidesPerView: 5, spaceBetween: 24 },
};

const PropertyByCityNew = ({ cityList = [] }) => {
  const router = useRouter();
  const swiperRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
  

  const handleClick = (city) => {
    router.push(`/property-list?location=${city?.id}`);
  };

  return (
    <section className="exp-wrapper">
      <div className="exp-container section-wid">

         <div className="flex flex-col md:flex-row justify-between items-start ">

        {/* Heading */}
        <div className="">
          <h2 className="section-ti">Properties by Cities</h2>
          <p className="section-cap">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        {cityList.length > 6 && <div className="flex items-center gap-3 ">
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



        {/* Slider */}
        <div className="mt-10 md:mt-14 mb-5">
          <Swiper
            modules={[Autoplay]}
            breakpoints={breakpoints}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={cityList.length > 4}
            // onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
          >
            {cityList.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="exp-card" onClick={() => handleClick(item)}>
                  <img
                    src={CITY_IMAGES[index % CITY_IMAGES.length]}
                    alt={item.name}
                    className="exp-img"
                  />
                  <div className="exp-content">
                    <h4 className="section-in-ti">{item.name}</h4>
                    <p>{item.property_count} {item.property_count === 1 ? "Property" : "Properties"}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default PropertyByCityNew;
