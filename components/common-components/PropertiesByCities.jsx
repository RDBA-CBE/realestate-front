
import React from 'react';

const PropertiesByCities = () => {
  const cities = [
    { name: 'Los Angeles', count: '12 Properties' },
    { name: 'Miami', count: '12 Properties' },
    { name: 'New York', count: '12 Properties' },
    { name: 'Chicago', count: '12 Properties' }
  ];

  return (
    <section className="section cities">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Properties by Cities</h2>
            <p className="section-subtitle">Aliquam lacinia diam quis lacus euismod</p>
          </div>
          <a href="#" className="view-all">See All Cities</a>
        </div>
        <div className="grid grid-4">
          {cities.map((city, index) => (
            <div key={index} className="city-card">
              <div className="city-image">
                {/* City image would go here */}
              </div>
              <div className="city-content">
                <h3>{city.name}</h3>
                <p>{city.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesByCities;