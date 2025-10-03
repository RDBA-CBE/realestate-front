// components/PropertiesByCities.js
import React from 'react';

const PropertiesByCities = () => {
  const cities = [
    { name: 'Los Angeles', count: '12 Properties' },
    { name: 'Miami', count: '12 Properties' },
    { name: 'New York', count: '12 Properties' },
    { name: 'Chicago', count: '12 Properties' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Properties by Cities</h2>
            <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
          </div>
          <a href="#" className="text-red-600 font-medium">See All Cities →</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.map((city, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{city.name}</h3>
                <p className="text-sm text-gray-600">{city.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesByCities;