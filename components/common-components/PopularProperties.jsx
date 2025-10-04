import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const PopularProperties = () => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'rent', 'sale'

  const properties = [
    {
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Sale',
      type: 'sale',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
    },
    {
      title: 'Modern Apartment Downtown',
      location: 'New Jersey City, CA, USA',
      details: { beds: '3', baths: '2' },
      status: 'For Rent',
      type: 'rent',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'
    },
    {
      title: 'Beachfront Condo',
      location: 'California City, CA, USA',
      details: { beds: '2', baths: '2' },
      status: 'For Rent',
      type: 'rent',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
    },
    {
      title: 'Suburban Family Home',
      location: 'New York City, CA, USA',
      details: { beds: '4', baths: '3' },
      status: 'For Rent',
      type: 'rent',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
    },
    {
      title: 'Penthouse with City View',
      location: 'Los Angeles, CA, USA',
      details: { beds: '3', baths: '3' },
      status: 'For Sale',
      type: 'sale',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded1027f2b?w=400&h=300&fit=crop'
    },
    {
      title: 'Countryside Estate',
      location: 'Texas City, CA, USA',
      details: { beds: '6', baths: '5' },
      status: 'For Sale',
      type: 'sale',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop'
    },
    {
      title: 'Studio Apartment',
      location: 'San Francisco, CA, USA',
      details: { beds: '1', baths: '1' },
      status: 'For Rent',
      type: 'rent',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
    },
    {
      title: 'Luxury Condo Highrise',
      location: 'Miami, FL, USA',
      details: { beds: '2', baths: '2' },
      status: 'For Sale',
      type: 'sale',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'
    }
  ];

  // Filter properties based on active filter
  const filteredProperties = properties.filter(property => {
    if (activeFilter === 'all') return true;
    return property.type === activeFilter;
  });

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
      slidesPerView: 4,
      spaceBetween: 24,
    },
  };

  return (
    <div className='py-16 bg-dark'> 
      <div className="container mx-auto px-4">
        {/* Header Section with Filter Buttons on the right */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold text-white mb-2">Discover Popular Properties</h2>
            <p className="text-white">Aliquam lacinia diam quis lacus euismod</p>
          </div>
          
          {/* Filter Buttons - Moved to right end */}
          <div className="bg-white rounded-lg p-1 border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setActiveFilter('rent')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === 'rent'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() => setActiveFilter('sale')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === 'sale'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-red-600'
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
        {activeFilter === 'all' ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={breakpoints}
            navigation={{
              nextEl: '.properties-swiper-next',
              prevEl: '.properties-swiper-prev',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="popular-properties-swiper"
          >
            {filteredProperties.map((property, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div 
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${property.image})` }}
                  >
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === 'For Sale' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {property.status}
                    </span>
                    
                    {/* Favorite button */}
                    {/* <button className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-red-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button> */}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>{property.details.beds} bed</span>
                      <span>{property.details.baths} bath</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Grid layout for Rent and Sale filters
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map((property, index) => (
              <div key={index} className="bg-white border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${property.image})` }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'For Sale' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {property.status}
                  </span>
                  
                  {/* Favorite button */}
                  {/* <button className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-red-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button> */}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{property.details.beds} bed</span>
                    <span>{property.details.baths} bath</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularProperties;