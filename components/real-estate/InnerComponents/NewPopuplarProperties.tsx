import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
// import "swiper/css";
import { capitalizeFLetter, formatPriceRange, truncateText } from "@/utils/function.utils";
import { useRouter } from "next/navigation";
import { Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";
import PropertyCard from "./PropertyCard";

const NewPopuplarProperties = (props) => {

  const router=useRouter()
  const { propertyList, updatePropertyType, locationEmpty, locationLabel } = props;
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'rent', 'sale'

  // Swiper breakpoints configuration
  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 30 },
    1180: { slidesPerView: 3, spaceBetween: 30 },
    1300: { slidesPerView: 4, spaceBetween: 30 },
  };

  const handleClick=(property)=>{
router.push(`property-detail/${property?.id}`)

  }

  console.log("propertyList com", propertyList);

  return (
    <div className="section-pad bg-[#f8f8f8]">
      <div className="section-wid ">
        {/* Header Section with Filter Buttons on the right */}
        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-12 text-start">
          <div className="mb-6 lg:mb-0">
            <h2 className="section-ti">
              Discover Popular Properties
            </h2>
            <p className="section-cap">
              Aliquam lacinia diam quis lacus euismod
            </p>
            {locationEmpty && (
              <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                No properties found in <span className="font-semibold mx-1">{locationLabel}</span> — showing all available properties.
              </div>
            )}
          </div>

          {/* Filter Buttons - Moved to right end */}
          <div className="gap-2 md:gap-4  inline-flex">
            <button
              onClick={() => {
                updatePropertyType("all");
                setActiveFilter("all");
              }}
              className={`px-3 md:px-6 py-2 text-sm rounded-full transition-colors ${
                activeFilter === "all"
                  ? "bg-color2 text-white"
                  : "border border-[#d1d0d0]  hover:text-dred"
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => {
                updatePropertyType("lease");

                setActiveFilter("lease");
              }}
              className={`px-6 py-2 text-sm rounded-full transition-colors ${
                activeFilter === "lease"
                  ? "bg-color2 text-white"
                  : "border border-[#d1d0d0]  hover:text-dred"
              }`}
            >
              For Lease
            </button>
            <button
              onClick={() => {
                updatePropertyType("sale");

                setActiveFilter("sale");
              }}
              className={`px-6 py-2 text-sm rounded-full transition-colors ${
                activeFilter === "sale"
                  ? "bg-color2 text-white"
                  : "border border-[#d1d0d0]  hover:text-dred"
              }`}
            >
              For Sale
            </button>
          </div>
        </div>

        {/* Navigation Buttons for Swiper */}
        {/* {activeFilter === 'all' && (
          <div className="flex justify-end mb-4">
            <div className="flex gap-2">
              <button className="properties-swiper-prev w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="properties-swiper-next w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )} */}

        {/* Conditional Rendering: Swiper for "All Properties", Grid for filtered views */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={breakpoints}
          navigation={{
            nextEl: ".properties-swiper-next",
            prevEl: ".properties-swiper-prev",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="featured-listings-swiper pb-10"
        >
          {propertyList?.map((property, index) => (
           <SwiperSlide key={index} className="h-auto">
              <PropertyCard listing={property} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NewPopuplarProperties;
