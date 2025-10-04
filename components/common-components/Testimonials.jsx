// components/Testimonials.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Testimonials = () => {
  const testimonials = [
    {
      text: "Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance. And we didn't on our original designs.",
      author: 'Leslie Alexander',
      position: 'Nintendo',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      text: "Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance. And we didn't on our original designs.",
      author: 'Floyd Miles',
      position: 'Bank of America',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      text: "Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance. And we didn't on our original designs.",
      author: 'Leslie Alexander',
      position: 'Nintendo',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      text: "Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance. And we didn't on our original designs.",
      author: 'Floyd Miles',
      position: 'Bank of America',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      text: "Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance. And we didn't on our original designs.",
      author: 'Floyd Miles',
      position: 'Bank of America',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className='flex items-center gap-1 mb-4'>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            People Love Living with Realton
          </h2>
          <p className='text-gray-600'>
            Aliquam lacinia diam quis lacus euismod
          </p>
        </div>

        {/* Navigation Buttons */}
        {/* <div className='flex justify-end mb-6'>
          <div className='flex gap-2'>
            <button className='testimonials-swiper-prev w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors'>
              <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <button className='testimonials-swiper-next w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors'>
              <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>
        </div> */}

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          navigation={{
            nextEl: '.testimonials-swiper-next',
            prevEl: '.testimonials-swiper-prev',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className='testimonials-swiper'
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className='bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full'>
                {/* Quote Icon */}
                <div className='text-red-500 mb-4'>
                  <svg
                    className='w-8 h-8'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z' />
                  </svg>
                </div>

                {/* Star Rating */}
                <StarRating rating={testimonial.rating} />

                {/* Testimonial Text */}
                <p className='text-gray-600 mb-6 leading-relaxed'>
                  {testimonial.text}
                </p>

                {/* Author Info with Image */}
                <div className='flex items-center'>
                  <div className='w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0'>
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback avatar */}
                    <div className='w-full h-full bg-gray-200 rounded-full flex items-center justify-center hidden'>
                      <span className='text-gray-500 font-semibold text-sm'>
                        {testimonial.author
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900'>
                      {testimonial.author}
                    </h4>
                    <p className='text-gray-500 text-sm'>
                      {testimonial.position}
                    </p>
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

export default Testimonials;