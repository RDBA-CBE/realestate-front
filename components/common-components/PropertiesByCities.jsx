// components/PropertiesByCities.js (Minimal Swiper Version)
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useRouter } from "next/navigation";


const PropertiesByCities = () => {
  const router = useRouter();

  const cities = [
    { 
      name: 'Coimbatore', 
      count: '23 Properties',
      image: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop'
    },
    { 
      name: 'Chennai', 
      count: '40 Properties',
      image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=400&h=300&fit=crop'
    },
    { 
      name: 'Tiruchirappalli', 
      count: '3 Properties',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop'
    },
    { 
      name: 'Bangalore', 
      count: '2 Properties',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop'
    }
  ];

  const handleClick = (type) => {
    router.push(`/property-list?search=${type?.name}`);
  };

  return (
    <div className='py-16 bg-white'> 
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Properties by Cities</h2>
            <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
          </div>
          <a href="#" className="text-red-600 font-medium hover:text-red-700 transition-colors">
            See All Cities →
          </a>
        </div>

        {/* Swiper Component */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          {cities.map((city, index) => (
            <SwiperSlide key={index}>
              <div 
              onClick={()=>handleClick(city)}
                className="relative bg-cover bg-center rounded-lg overflow-hidden h-48 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                style={{ backgroundImage: `url(${city.image})` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/50 transition-all"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                  <h3 className="font-semibold text-lg mb-2">{city.name}</h3>
                  <p className="text-white text-opacity-90">{city.count}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PropertiesByCities;




