import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { capitalizeFLetter, truncateText } from "@/utils/function.utils";
import { useRouter } from "next/navigation";

const PopularProperties = (props) => {

  const router=useRouter()
  const { propertyList, updatePropertyType } = props;
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'rent', 'sale'

  // Swiper breakpoints configuration
  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  };

  const handleClick=(property)=>{
router.push(`property-detail/${property?.id}`)

  }

  return (
    <div className="py-16 bg-lred">
      <div className="container mx-auto px-4">
        {/* Header Section with Filter Buttons on the right */}
        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-12 text-start">
          <div className="mb-6 lg:mb-0">
            <h2 className="section-title">
              Discover Popular Properties
            </h2>
            <p className="">
              Aliquam lacinia diam quis lacus euismod
            </p>
          </div>

          {/* Filter Buttons - Moved to right end */}
          <div className="bg-white rounded-lg p-1 border border-gray-200 inline-flex">
            <button
              onClick={() => {
                updatePropertyType("all");
                setActiveFilter("all");
              }}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-color2 text-white"
                  : "text-gray-600 hover:text-dred"
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => {
                updatePropertyType("lease");

                setActiveFilter("lease");
              }}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === "lease"
                  ? "bg-color2 text-white"
                  : "text-gray-600 hover:text-dred"
              }`}
            >
              For Lease
            </button>
            <button
              onClick={() => {
                updatePropertyType("sale");

                setActiveFilter("sale");
              }}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === "sale"
                  ? "bg-color2 text-white"
                  : "text-gray-600 hover:text-dred"
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
          modules={[Navigation, Autoplay]}
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
            <SwiperSlide key={index}>
              <div
              
              key={property?.id}
              onClick={()=>handleClick(property)}
 className="bg-white cursor-pointer border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url(${property.primary_image})`,
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                      property.listing_type === "sale"
                        ? "bg-green-500 text-white"
                        : "bg-color2 text-white"
                    }`}
                  >
                    {capitalizeFLetter(property.listing_type)}
                  </span>

                  {/* Favorite button */}
                  {/* <button className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-red-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button> */}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {truncateText(property.title)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{property.city}</p>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span className="bg-batch">{property.bedrooms} bed</span>
                    <span className="bg-batch">{property.bathrooms} bath</span>
                    {/* <span className="bg-batch">{property.price_per_sqft} sqft</span> */}
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

export default PopularProperties;
