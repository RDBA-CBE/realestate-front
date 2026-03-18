// components/ApartmentTypes.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ApartmentTypes = (props) => {
  const router = useRouter();

  const { propertyTypeList } = props;

  const handleClick = (type) => {
    router.push(`/property-list?propertyType=${type?.id}`);
  };

  const images = [
    "/assets/images/real-estate/pt-1.png",
    "/assets/images/real-estate/pt-2.png",
    "/assets/images/real-estate/pt-3.png",
    "/assets/images/real-estate/pt-4.png",
    "/assets/images/real-estate/pt-5.png",
    "/assets/images/real-estate/pt-6.png",
  ];

  return (
    <div className="py-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto p-6"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">
              Explore Property Types
            </h2>
            <p className="text-gray-600">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={15}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="property-swipper"
          >
            {propertyTypeList?.map((type, index) => (
              <SwiperSlide key={index} className="">
                <div
                  onClick={() => handleClick(type)}
                  className="text-center  rounded-lg hover:border-red-500 transition-colors h-full cursor-pointer"
                >
                  <div className="w-20 h-20 md:w-28 md:h-28  rounded-lg flex items-center justify-center mx-auto mb-4">
                    <img
                      src={images[index % images.length]}
                      alt={type.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="iconbox-content">
                    <h6 className="title font-semibold text-gray-900 mb-1">
                      {type.name}
                    </h6>
                    <p className="text text-sm text-gray-600 mb-0">
                      {type.properties_count} Properties
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </div>
  );
};

export default ApartmentTypes;
