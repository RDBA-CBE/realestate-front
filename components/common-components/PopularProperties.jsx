// components/PopularProperties.js
import React from 'react';

const PopularProperties = () => {
  const properties = [
    {
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Sale'
    },
    {
      title: 'Luxury villa in Rego Park',
      location: 'New Jersey City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Rent'
    },
    {
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Rent'
    },
    {
      title: 'Luxury villa in Rego Park',
      location: 'New York City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Rent'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Popular Properties</h2>
          <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                  property.status === 'For Sale' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {property.status}
                </span>
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
      </div>
    </section>
  );
};

export default PopularProperties;