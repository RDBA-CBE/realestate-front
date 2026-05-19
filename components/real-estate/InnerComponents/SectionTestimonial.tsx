"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const SectionTestimonial = () => {
  const testimonials = [
    {
      text: "Every property radiates top-notch quality and absolute comfort here. The team went above and beyond to make sure everything was perfect.",
      author: "John Carter",
      location: "Los Angeles, CA",
    },
    {
      text: "Amazing service and attention to detail. I felt supported during the entire process and couldn't be happier with my new home.",
      author: "Lisa Monroe",
      location: "San Francisco, CA",
    },
    {
      text: "Fast responses, honest advice and great listings — highly recommended for anyone searching for a new place.",
      author: "Samuel Green",
      location: "Austin, TX",
    },
  ];

  return (
    <section className="section-pad bg-[#f5f5f5]">
      <div className="section-wid py-5">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-[50px] ">
          
          {/* Left */}
          <div className="lg:col-span-2 min-w-0">
            <h2 className="section-ti mb-4 break-words">
              What our customers say about us
            </h2>

            <p className="section-cap break-words">
              Lorem ipsum dolor sit amet consectetur pretium consectetur
              nulla est in dui ornare nulla quis diam consequat habitant
              nam viverra netus.
            </p>
          </div>

          {/* Right */}
          <div className="lg:col-span-4 min-w-0 flex justify-center lg:justify-end">
            <div className="w-full rounded-lg">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={true}
                autoHeight={false}
                className="testimonial-swiper"
              >
                {testimonials.map((t, i) => (
                  <SwiperSlide key={i} className="h-auto rounded-lg">
                    <div className="bg-white rounded-lg p-8 pb-12 shadow-md hover:shadow-xl h-full flex transition-all duration-300">
                      
                      <div className="flex items-start gap-6 w-full">
                        
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-dred text-white flex items-center justify-center font-semibold text-xl shrink-0">
                          {t.author.charAt(0)}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 min-w-0">
                          
                          <div className="flex-1">
                            <p className="text-lg text-gray-800 break-words leading-relaxed">
                              {t.text}
                            </p>
                          </div>

                          <div className="mt-6">
                            <h4 className="section-in-ti">
                              {t.author}
                            </h4>

                            <p className="text-sm text-gray-500">
                              {t.location}
                            </p>
                          </div>

                        </div>

                      </div>

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        :global(.testimonial-swiper .swiper-wrapper) {
          align-items: stretch;
        }

        :global(.testimonial-swiper .swiper-slide) {
          height: auto;
          display: flex;
        }

        :global(.swiper-pagination) {
          left: 40px !important;
          bottom: 20px !important;
          text-align: left;
        }

        :global(.swiper-pagination-bullet) {
          background: #d1d1d1;
          opacity: 1;
        }

        :global(.swiper-pagination-bullet-active) {
          background: #1f2937;
        }
      `}</style>
    </section>
  );
};

export default SectionTestimonial;