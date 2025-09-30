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
    <section className="section apartment-types">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Apartment Types</h2>
            <p className="section-subtitle">Get some Inspirations from 1800+ skills</p>
          </div>
        </div>
        <div className="grid grid-6">
          {types.map((type, index) => (
            <div key={index} className="type-card">
              <div className="type-icon">
                {/* Icon would go here */}
              </div>
              <h3>{type.name}</h3>
              <p>{type.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApartmentTypes;