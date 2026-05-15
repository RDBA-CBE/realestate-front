// components/Testimonials.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const Testimonials = () => {
  const testimonials = [
    {
      text: "Finding our dream home was seamless thanks to this platform. The search tools are intuitive and the property listings are detailed and accurate.",
      author: "Sarah Johnson",
      position: "Homeowner",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      text: "As an investor, I appreciate the comprehensive market data and quick response times. The team truly understands real estate.",
      author: "Michael Chen",
      position: "Property Investor",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      text: "The support I received throughout the buying process was exceptional. They made what seemed complicated feel easy and stress-free.",
      author: "Emily Rodriguez",
      position: "First-time Buyer",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      text: "Amazing design, easy to customize and the overall experience was smooth from start to finish.",
      author: "David Miller",
      position: "Landlord",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-dred fill-current" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section className="section-pad bg-[#f8f8f8]">
      <div className="section-wid  pb-5">
        <div className="text-center mb-12">
          <h2 className="section-ti mb-3">
            People Love Living with Realton
          </h2>
          <p className="section-cap">
            Aliquam lacinia diam quis lacus euismod
          </p>
        </div>

        {/* IMPORTANT FIX */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="testimonial-swiper"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index} className="flex !h-auto">
              {/* THIS WRAPPER MAKES SAME HEIGHT */}
              <div className="w-full h-full flex">
                <div
                  className="w-full h-full flex flex-col bg-white rounded-2xl p-6
                  border border-[#ececec]
                  shadow-[0px_1px_3px_rgba(0,0,0,0.08),0px_4px_12px_rgba(0,0,0,0.05)]
                  hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]
                  transition-all duration-300"
                >
                  {/* Top */}
                  <div className="flex justify-between items-center mb-5">
                    <StarRating rating={item.rating} />

                    <svg
                      className="w-10 h-10 text-dred fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                  </div>

                  {/* CONTENT TAKES SPACE */}
                  <div className="flex-1">
                    <p className="">
                      {item.text}
                    </p>
                  </div>

                  {/* FOOTER ALWAYS BOTTOM */}
                  <div className="border-t border-gray-100 pt-5 mt-6">
                    <div className="flex items-center gap-3">
                      {/* <img
                        src={item.image}
                        alt={item.author}
                        className="w-12 h-12 rounded-full object-cover"
                      /> */}

                      <div className="w-12 h-12 rounded-full bg-dred text-white flex items-center justify-center font-semibold text-lg uppercase">
                        {item.author.charAt(0)}
                      </div>

                      <div>
                        <h4 className="section-in-ti">
                          {item.author}
                        </h4>
                        <p className="">
                          {item.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;