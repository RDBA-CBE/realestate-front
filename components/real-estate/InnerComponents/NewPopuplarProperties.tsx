import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
// import "swiper/css";
import { capitalizeFLetter, formatPriceRange, truncateText } from "@/utils/function.utils";
import { useRouter } from "next/navigation";
import { Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";

const NewPopuplarProperties = (props) => {

  const router=useRouter()
  const { propertyList, updatePropertyType } = props;
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'rent', 'sale'

  // Swiper breakpoints configuration
  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 30 },
    1024: { slidesPerView: 3, spaceBetween: 60 },
  };

  const handleClick=(property)=>{
router.push(`property-detail/${property?.id}`)

  }

  console.log("propertyList com", propertyList);

  return (
    <div className="section-pad bg-white">
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
          </div>

          {/* Filter Buttons - Moved to right end */}
          <div className="gap-2 md:gap-4  inline-flex">
            <button
              onClick={() => {
                updatePropertyType("all");
                setActiveFilter("all");
              }}
              className={`px-4 md:px-6 py-2 rounded-full transition-colors ${
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
              className={`px-6 py-2 rounded-full transition-colors ${
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
              className={`px-6 py-2 rounded-full transition-colors ${
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
          className="popular-properties-swiper"
        >
          {propertyList?.map((property, index) => (
           <SwiperSlide key={index} className="h-auto">
              <div
                className="bg-white rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col"
                onClick={() => handleClick(property)}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden rounded-2xl">
                  <img
                    src={property?.primary_image}
                    alt={property?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white text-[#9b0f09] text-xs font-semibold px-3 py-1 rounded-full shadow">
                    For Sale
                  </div>
                </div>

                {/* Content */}
                <div className="pt-4 pb-2 text-start flex flex-col flex-1">
                  <h3 className="section-in-ti mb-1 min-h-[48px]">
                    {property?.title}
                  </h3>
                  <p className="flex items-center gap-1 mb-4 min-h-[24px]">
                    {property?.city && <><MapPin className="w-3.5 h-3.5" />{property?.city}</>}
                  </p>

                  {/* Stats + Price */}
                  <div className="flex items-center justify-between border-t pt-3 border-[#d1d0d0] mt-auto">
                    <div className="flex items-center gap-3 ">
                      <span className="flex items-center gap-1 border-r pr-3 border-[#d1d0d0]">
                        <BedDouble className="w-4 h-4" /> {property?.bedrooms}
                      </span>
                      <span className="flex items-center gap-1 border-r pr-3 border-[#d1d0d0]">
                        <Bath className="w-4 h-4" /> {property?.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" /> {property?.price_per_sqft}
                      </span>
                    </div>
                    <span className="text-[#9b0f09]  xl:text-xl font-bold text-base">
                      ₹{" "}
                      {formatPriceRange(
                        property?.price_range?.minimum_price,
                        property?.price_range?.maximum_price
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

export default NewPopuplarProperties;
