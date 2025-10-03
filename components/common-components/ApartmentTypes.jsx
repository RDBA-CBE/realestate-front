// components/ApartmentTypes.js
import React from 'react';

const ApartmentTypes = () => {
  const types = [
    { name: 'Houses', count: '22 Properties' },
    { name: 'Apartments', count: '22 Properties' },
    { name: 'Office', count: '22 Properties' },
    { name: 'Villa', count: '22 Properties' },
    { name: 'Townhome', count: '22 Properties' },
    { name: 'Bungalow', count: '22 Properties' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Apartment Types</h2>
          <p className="text-gray-600">Get some Inspirations from 1800+ skills</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {types.map((type, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:border-red-500 transition-colors">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApartmentTypes;