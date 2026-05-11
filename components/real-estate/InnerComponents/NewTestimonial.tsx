"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

const NewTestimonial = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const testimonials = [
    {
      text: "Lorem Ipsum Dolor Sit Amet Consectetur. Mattis Urna Duis Tincidunt Condimentum Morbi Venenatis Rhoncus Ut Semper. Odio Suspendisse Morbi Ipsum Condim Entum Et Ut.Condimentum Et Ut.",
      author: "John Richard",
      position: "Lorem ipsum dolor",
      rating: 5,
    },
    {
      text: "Lorem Ipsum Dolor Sit Amet Consectetur. Mattis Urna Duis Tincidunt Condimentum Morbi Venenatis Rhoncus Ut Semper. Odio Suspendisse Morbi Ipsum Condim Entum Et Ut.Condimentum Et Ut.",
      author: "Sarah Johnson",
      position: "Lorem ipsum dolor",
      rating: 5,
    },
    {
      text: "Lorem Ipsum Dolor Sit Amet Consectetur. Mattis Urna Duis Tincidunt Condimentum Morbi Venenatis Rhoncus Ut Semper. Odio Suspendisse Morbi Ipsum Condim Entum Et Ut.Condimentum Et Ut.",
      author: "Michael Brown",
      position: "Lorem ipsum dolor",
      rating: 5,
    },
  ];

  const Stars = ({ count = 5 }) => (
    <div className="flex gap-1 mb-4">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-orange-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="section-pad bg-[#f7f7f7]">
      <div className="section-wid py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Panel */}
          <div>
            <h2 className="section-ti">What Our Clients Say</h2>
            <p className="mb-8 max-w-xs">
              We offer complete real estate services for buying, selling, and renting residential and
            </p>

            {/* Google Rating */}
            {/* <div className="flex items-center gap-3">
              
              <svg className="w-10 h-10" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-lg">4.9 / 5</span>
                  <Stars count={5} />
                </div>
                <p className="text-gray-500 text-xs">Based On 250 Review</p>
              </div>
            </div> */}
          </div>

          {/* Right Panel — Swiper */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(swiper) => {
                if (typeof swiper.params.navigation === 'object' && swiper.params.navigation) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              // autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="px-8">
                    {/* Stars */}
                    {/* <Stars count={t.rating} /> */}

                    {/* Review Text */}
                    <p className="mb-6">{t.text}</p>

                    {/* Author + Quote icon */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-medium text-[#000]">{t.author}</p>
                        <p className="text-md">{t.position}</p>
                      </div>
                      {/* Quote icon */}
                      <svg className="w-8 h-8 text-[#bdbdbc] fill-current opacity-80" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Arrows */}
            <button ref={prevRef} className="absolute left-0 md:left-[-20px] top-1/2 -translate-y-1/2 -translate-x-4 border border-[#d1d0d0] rounded-full text-gray-400 p-3 hover:text-gray-700 text-xl z-10">
              <ArrowLeft size={14}/>
            </button>
            <button ref={nextRef} className="absolute right-0 md:right-[-20px] top-1/2 -translate-y-1/2 translate-x-4 border border-[#d1d0d0] rounded-full text-gray-400 p-3 hover:text-gray-700 text-xl z-10">
              <ArrowRight size={14}/>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewTestimonial;
