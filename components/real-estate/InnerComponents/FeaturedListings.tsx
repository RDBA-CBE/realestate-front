"use client";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import PropertyCard from "./PropertyCard";

const FeaturedListings = (props) => {
  const { list } = props;
  const swiperRef = useRef(null);

  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 30 },
    1024: { slidesPerView: 3, spaceBetween: 60 },
    1200: { slidesPerView: 4, spaceBetween: 30 },
  };

  const handleSlideChange = (swiper) => {
    const bullets = document.querySelectorAll('.featured-listings-swiper .swiper-pagination-bullet');
    bullets.forEach((bullet, i) => {
      bullet.classList.remove('swiper-pagination-bullet-active');
    });
    const activeIndex = swiper.realIndex % 3;
    if (bullets[activeIndex]) {
      bullets[activeIndex].classList.add('swiper-pagination-bullet-active');
    }
  };

  return (
    <div className="hm-fea-list bg-white">
      <div className="section-wid mx-auto ">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-10">
          <div>
            <h2 className="section-ti">Discover Our Fully Furnished Sale Properties</h2>
            <p className="section-cap">Aliquam lacinia diam quis lacus euismod</p>
          </div>
          <a
            href="property-list"
            className="flex items-center gap-4 mt-4 md:mt-0  transition-colors font-medium"
          >
            See All Properties
            <span className="w-9 h-9 rounded-full bg-[#9b0f09] flex items-center justify-center text-white text-sm">
              <ArrowUpRight className="w-5 h-5"/>
            </span>
          </a>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          breakpoints={breakpoints}
          // pagination={{
          //   clickable: true,
          //   renderBullet: (index, className) => {
          //     if (index < 3) {
          //       return `<span class="${className} "></span>`;
          //     }
          //     return '';
          //   },
          // }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          loop={true}
          className="featured-listings-swiper pb-10"
        >
          {list.map((listing, index) => (
            <SwiperSlide key={index} className="h-auto">
              <PropertyCard listing={listing} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedListings;
