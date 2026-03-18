// components/FeaturedListings.js
import React from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { formatPriceRange } from "@/utils/function.utils";
import { useRouter } from "next/navigation";

const FeaturedListings = (props) => {
  const { list } = props;
  const router = useRouter();

  console.log("✌️saleWithFurnishedList --->", list);

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

  const handleClick = (property) => {
    router.push(`property-detail/${property?.id}`);
  };

  return (
    <div className="py-14 bg-lred">
      {" "}
      {/* Just use div instead of section */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Our Fully Furnished Sale Properties
            </h2>
            <p className="text-gray-600">
              Aliquam lacinia diam quis lacus euismod
            </p>
          </div>
          <a href="property-list" className="text-dred font-medium">
            See All Properties →
          </a>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={breakpoints}
          navigation={{
            nextEl: ".properties-swiper-next",
            prevEl: ".properties-swiper-prev",
          }}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="popular-properties-swiper"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {list.map((listing, index) => (
              <SwiperSlide key={index}>
                <div
                  key={index}
                  className="border border-gray-200 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${listing?.primary_image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-sm font-semibold text-dred">
                      {formatPriceRange(
                        listing?.price_range?.minimum_price,
                        listing?.price_range?.maximum_price
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{listing.city}</p>
                    <div className="flex space-x-4 text-sm text-gray-600 mb-4">
                      <span className="bg-batch">{listing.bedrooms} bed</span>
                      <span className="bg-batch">{listing.bathrooms} bath</span>
                      <span className="bg-batch">{listing.price_per_sqft} sqft</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {listing.listing_type}
                      </span>
                      <button
                        onClick={() => handleClick(listing)}
                        className="text-dred border border-[#9b0f09] px-4 py-2 rounded text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedListings;
