"use client";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { formatPriceRange } from "@/utils/function.utils";
import { useRouter } from "next/navigation";
import { MapPin, BedDouble, Bath, Maximize2, ArrowUpRight } from "lucide-react";

const FeaturedListings = (props) => {
  const { list } = props;
  const router = useRouter();
  const swiperRef = useRef(null);

  const handleClick = (property) => {
    router.push(`property-detail/${property?.id}`);
  };

  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 30 },
    1024: { slidesPerView: 3, spaceBetween: 60 },
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
            <h2 className="section-ti">Discover Our Sale Properties</h2>
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
            <SwiperSlide key={index}>
              <div
                className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => handleClick(listing)}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden rounded-2xl">
                  <img
                    src={listing?.primary_image}
                    alt={listing?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white text-[#9b0f09] text-xs font-semibold px-3 py-1 rounded-full shadow">
                    For Sale
                  </div>
                </div>

                {/* Content */}
                <div className="pt-4 pb-2 text-start">
                  <h3 className="section-in-ti mb-1">
                    {listing?.title}
                  </h3>
                  <p className=" flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 " />
                    {listing?.city}
                  </p>

                  {/* Stats + Price */}
                  <div className="flex items-center justify-between border-t pt-3 border-[#d1d0d0]">
                    <div className="flex items-center gap-3 ">
                      <span className="flex items-center gap-1 border-r pr-3 border-[#d1d0d0]">
                        <BedDouble className="w-4 h-4" /> {listing?.bedrooms}
                      </span>
                      <span className="flex items-center gap-1 border-r pr-3 border-[#d1d0d0]">
                        <Bath className="w-4 h-4" /> {listing?.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" /> {listing?.price_per_sqft}
                      </span>
                    </div>
                    <span className="text-[#9b0f09]  xl:text-xl font-bold text-base">
                      ₹{" "}
                      {formatPriceRange(
                        listing?.price_range?.minimum_price,
                        listing?.price_range?.maximum_price
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedListings;
